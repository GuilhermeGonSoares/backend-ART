import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { WhatsappEntity } from './entities/whatsapp.entity';
import { Repository } from 'typeorm';
import { ExistWhatsappPhone } from './dtos/exist-whatsapp-phone.dto';
import {
  messageGroupCalendly,
  messageGroupDrive,
  messageGroupInitial,
} from '../utils/messages/message.group';
import { CreateGroupDto } from '../automations/dtos/create-group.dto';
import { ResponseCreateGroupDto } from './dtos/create-group.dto';

@Injectable()
export class WhatsappService {
  private url: string;
  private groupName = 'TFG - ';
  private groupPhoto =
    'https://agenciaart.com.br/wp-content/uploads/2021/12/cropped-Logo-Site.png';
  private description = '';
  private readonly logger = new Logger(WhatsappService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository(WhatsappEntity)
    private readonly repository: Repository<WhatsappEntity>,
  ) {
    this.url = `https://api.z-api.io/instances/${configService.get(
      'Z_API_ID',
    )}/token/${configService.get('Z_API_TOKEN')}`;
  }

  setDescription(
    productName: string,
    customerName: string,
    links: string[],
  ): void {
    let linkDrive: string;
    if (!links || links.length == 0) {
      linkDrive = ' ';
    } else {
      linkDrive = links[0];
    }
    this.description = `Grupo do projeto de *${productName}* da *${customerName}*. \n \n *Links Úteis*: \n *Google Drive*: \n ${linkDrive} \n *Dashboard de Acompanhamento* [TR] \n \n *Agendar Reuniões* \n Link do Calendly \n \n E aí, vamos decolar? 🚀`;
  }

  async existWhatsappNumber(phone: string): Promise<boolean> {
    const { data: existPhone }: { data: ExistWhatsappPhone } =
      await this.httpService.axiosRef.get(this.url + `/phone-exists/${phone}`);

    if (!existPhone.exists) {
      throw new BadRequestException('This whatsapp number is invalid!');
    }
    return true;
  }

  async createGroup({
    phone,
    customerName,
    customerId,
    productName,
    links,
  }: CreateGroupDto) {
    try {
      this.setDescription(productName, customerName, links);

      const group: WhatsappEntity = await this.findGroupByCustomerId(
        customerId,
      ).catch(() => undefined);

      if (group) {
        this.logger.log(`User: ${customerName} already has whatsapp group!`);
        await this.updateDescriptionGroup(group.groupId);
        return group;
      }

      const response = await this.httpService.axiosRef.post(
        this.url + '/create-group',
        {
          groupName: this.groupName + customerName,
          phones: ['55' + phone],
        },
      );
      const createGroup: ResponseCreateGroupDto = response.data;

      await this.updateImageGroup(createGroup.phone);
      await this.updateDescriptionGroup(createGroup.phone);

      await this.saveWhatsappRegister(createGroup, customerId);

      await this.sendMessageGroup(
        createGroup.phone,
        messageGroupInitial(customerName),
        messageGroupDrive(links[0]),
        messageGroupCalendly(customerName),
      );
      this.logger.log(
        `Whatsapp group created with success for user: ${customerName}`,
      );
      return createGroup;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async sendMessageGroup(groupId: string, ...messages: string[]) {
    messages.forEach(async (message) => {
      await this.httpService.axiosRef.post(this.url + '/send-text', {
        phone: groupId,
        message,
        delayMessage: 5,
      });
    });
  }

  async updateImageGroup(groupId: string) {
    const { data } = await this.httpService.axiosRef.post(
      this.url + '/update-group-photo',
      {
        groupId,
        groupPhoto: this.groupPhoto,
      },
    );

    if (!data.value) {
      throw new BadRequestException('Update image falid!');
    }

    return true;
  }

  async updateDescriptionGroup(groupId: string) {
    const { data } = await this.httpService.axiosRef.post(
      this.url + '/update-group-description',
      {
        groupId,
        groupDescription: this.description,
      },
    );

    if (!data.value) {
      throw new BadRequestException('Update description falid!');
    }

    return true;
  }

  async saveWhatsappRegister(
    createGroup: ResponseCreateGroupDto,
    customerId: string,
  ) {
    return await this.repository.save({
      customerId,
      groupId: createGroup.phone,
      linkGroup: createGroup.invitationLink,
    });
  }

  async findGroupByCustomerId(customerId: string) {
    const group = await this.repository.findOne({ where: { customerId } });

    if (!group) {
      throw new NotFoundException(`Not found group for this customer`);
    }

    return group;
  }

  async deleteGroupByCustomerId(customerId: string) {
    const group = await this.findGroupByCustomerId(customerId).catch(
      () => undefined,
    );

    if (group) {
      return await this.repository.remove(group);
    }

    return;
  }
}
