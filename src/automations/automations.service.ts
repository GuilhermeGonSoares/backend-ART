import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { ProductType } from '../enums/product.enum';
import { SubscriptionService } from '../subscription/subscription.service';
import { CreateContractDto } from './dtos/create-contract.dto';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { CreateAutomationDto } from './dtos/create-automation.dto';
import { AutentiqueService } from '../autentique/autentique.service';
import { ProductEntity } from '../product/entities/product.entity';
import { CustomerEntity } from '../customer/entities/customer.entity';
import { CreateGroupDto } from './dtos/create-group.dto';
import { ChargeService } from '../charge/charge.service';
import { CreateAsaasChargeDto } from '../asaas/dtos/create-charge.dto';
import { CreateChargeDto } from '../charge/dto/create-charge.dto';
import { AsaasService } from '../asaas/asaas.service';
import { ChargeEntity } from '../charge/entities/charge.entity';
import { SubscriptionEntity } from '../subscription/entities/subscription.entity';
import { UpdateChargeDto } from '../charge/dto/update-charge.dto';
import { AutentiqueEntity } from '../autentique/entities/autentique.entity';
import { AutentiqueStatus } from '../enums/autentique-contract.enum';
import { Repository } from 'typeorm';
import { AutomationEntity } from './entities/automation.entity';
import { InjectRepository } from '@nestjs/typeorm';

type EntityDto = {
  product?: ProductEntity;
  customer?: CustomerEntity;
  contract?: AutentiqueEntity;
  discount: number;
  contractId: number;
};

type AutomationDto = EntityDto & {
  type: ProductType;
};
@Injectable()
export class AutomationsService {
  private readonly logger = new Logger(AutomationsService.name);

  constructor(
    @InjectRepository(AutomationEntity)
    private readonly repository: Repository<AutomationEntity>,
    @Inject(forwardRef(() => SubscriptionService))
    private readonly subscriptionService: SubscriptionService,
    private readonly autentiqueService: AutentiqueService,
    private readonly chargeService: ChargeService,
    private readonly asaasService: AsaasService,
    @InjectQueue('automations') private readonly automationQueue: Queue,
  ) {}

  async createAutomations(automationDto: CreateAutomationDto) {
    const { type, id } = automationDto;
    let charge: ChargeEntity;
    let subscription: SubscriptionEntity;
    let entity: AutomationDto;

    if (type === ProductType.Subscription) {
      subscription = await this.subscriptionService.findOneSubscriptionById(
        id,
        true,
      );

      entity = this.mapToAutomationDto(subscription, type);
    } else if (type === ProductType.Unique) {
      charge = await this.chargeService.findChargeById(id, true);

      if (automationDto.isAutentique && !charge.contractId) {
        const contract = await this.autentiqueService.createContractInDatabase(
          ProductType.Unique,
        );
        const chargeDto = new UpdateChargeDto();
        chargeDto.contractId = contract.id;
        await this.chargeService.update(id, chargeDto);
        this.logger.log('Charge contract successfully created in the database');
        charge.contractId = contract.id;
      }
      entity = this.mapToAutomationDto(charge, type);
    }

    if (automationDto.isAutentique) {
      //se for Charge preciso verificar se já não tem um id no asaas.
      // se houver é necessário eu remover ele de lá uma vez que eu preciso que o usuário assine
      if (entity.contract?.signatureStatus === AutentiqueStatus.SIGNED) {
        throw new BadRequestException(`Already have the contract signed`);
      }
      if (type === ProductType.Unique && charge.asaasId) {
        const chargeDto = new CreateChargeDto();
        chargeDto.convertChargeToChargeDto(charge);
        await this.asaasService.deleteCharge(charge.asaasId);
        chargeDto.asaasId = null;
        await this.chargeService.update(charge.id, chargeDto);
      }
      await this.createAutentique(entity);
    }

    if (automationDto.isAutentique === false && type === ProductType.Unique) {
      // Preciso deletar ou atualizar a cobrança no asaas caso eu lance para uma que já tenha
      // Se já tem um contractId na cobrança eu preciso remove-la.
      const chargeDto = new CreateChargeDto();
      chargeDto.convertChargeToChargeDto(charge);

      if (charge.asaasId) {
        await this.asaasService.deleteCharge(charge.asaasId);
      }
      if (charge.contractId) {
        await this.autentiqueService.deleteContract(charge.contractId);
        chargeDto.contractId = null;
      }

      const asaasCharge = await this.asaasService.createCharge(
        new CreateAsaasChargeDto(
          chargeDto,
          charge.customer.asaasId,
          charge.product.price,
        ),
      );

      chargeDto.asaasId = asaasCharge.id;
      await this.chargeService.update(id, chargeDto);
      this.logger.log('Charge for single order successfully created');
    }

    if (automationDto.isCreateDrive === true) {
      await this.createGoogleDrive(entity, automationDto.isCreateGroup);
    }

    if (automationDto.isCreateGroup === true && !automationDto.isCreateDrive) {
      this.createGroupWhatsapp(entity);
    }
  }
  async createAutentique(entity: AutomationDto) {
    const payload = new CreateContractDto(
      entity.product,
      entity.customer,
      entity.discount,
      entity.type,
    );
    await this.autentiqueService.updateForNullAutentiqueId(entity.contractId);
    await this.automationQueue.add('autentique', {
      ...payload,
    });
  }

  async createGoogleDrive(entity: AutomationDto, isCreateGroup = true) {
    await this.automationQueue.add(
      'createDrive',
      {
        customer: entity.customer,
        productName: entity.product.name,
        isCreateGroup,
      },
      {
        priority: 1,
      },
    );
  }

  async createGroupWhatsapp(entity: AutomationDto) {
    const createGroupDto = new CreateGroupDto(
      entity.customer,
      entity.product.name,
      [],
    );
    await this.automationQueue.add(
      'createGroup',
      {
        ...createGroupDto,
      },
      { lifo: true },
    );
  }

  private mapToAutomationDto<T extends EntityDto>(
    entity: T,
    type: ProductType,
  ): AutomationDto {
    return {
      customer: entity.customer,
      product: entity.product,
      contract: entity.contract,
      discount: entity.discount,
      contractId: entity.contractId,
      type: type,
    };
  }

  async saveAutomation(automationDto: CreateAutomationDto) {
    const automation = await this.repository.findOne({
      where: { serviceId: automationDto.id },
    });

    if (automation) {
      return await this.repository.save({
        ...automation,
        serviceId: automationDto.id,
        type: automationDto.type,
        initialDate: automationDto.initialDate,
        isCreateGroup: automationDto.isCreateGroup,
        isAutentique: automationDto.isAutentique,
        isCreateDrive: automationDto.isCreateDrive,
      });
    }

    return await this.repository.save({
      serviceId: automationDto.id,
      type: automationDto.type,
      initialDate: automationDto.initialDate,
      isCreateGroup: automationDto.isCreateGroup,
      isAutentique: automationDto.isAutentique,
      isCreateDrive: automationDto.isCreateDrive,
    });
  }

  async delete(id: number) {
    const automation = await this.repository.findOne({ where: { id } });

    if (!automation) {
      throw new NotFoundException(`Not found automation with this ${id}`);
    }

    return await this.repository.remove(automation);
  }

  async findAutomationByInitialDate(
    initialDate: Date,
  ): Promise<AutomationEntity[]> {
    return await this.repository
      .createQueryBuilder('automation')
      .where('automation.initialDate >= :startDate', { startDate: initialDate })
      .andWhere('automation.initialDate < :endDate', {
        endDate: new Date(initialDate.getTime() + 24 * 60 * 60 * 1000),
      })
      .getMany();
  }

  async deleteAutomationByServiceId(serviceId: number) {
    const automation = await this.repository.findOne({ where: { serviceId } });

    if (!automation) {
      throw new NotFoundException(
        `Not found automation for this service id: ${serviceId}`,
      );
    }

    return await this.repository.remove(automation);
  }
}
