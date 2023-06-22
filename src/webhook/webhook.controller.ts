import { Controller, HttpCode, Post, Body } from '@nestjs/common';
import { SubscriptionStatus } from '../enums/subscription-status.enum';
import { SubscriptionService } from '../subscription/subscription.service';
import { AutentiqueService } from '../autentique/autentique.service';
import { AutentiqueStatus } from '../enums/autentique-contract.enum';
import { ChargeService } from '../charge/charge.service';
import { CustomerService } from '../customer/customer.service';
import { AsaasService } from '../asaas/asaas.service';
import { CreateAsaasChargeDto } from '../asaas/dtos/create-charge.dto';
import { CreateChargeDto } from '../charge/dto/create-charge.dto';

@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly autentiqueService: AutentiqueService,
    private readonly chargeService: ChargeService,
    private readonly customerService: CustomerService,
    private readonly asaasService: AsaasService,
  ) {}
  @Post('contract')
  @HttpCode(200)
  async handleContractSignedEvent(@Body() payload: any) {
    if (payload && payload.partes[0].assinado) {
      const status = SubscriptionStatus.ACTIVE;
      const autentiqueId = payload.documento.uuid;
      const contract = await this.autentiqueService.findContractByAutentiqueId(
        autentiqueId,
      );
      if (contract.type === 'unique') {
        console.log(contract);
        console.log(contract.charge);
        const { customerId } = contract.charge;
        const customer = await this.customerService.findCustomerBy(
          'cnpj',
          customerId,
        );

        const chargeDto = new CreateChargeDto();
        chargeDto.convertChargeToChargeDto(contract.charge);

        const asaasCharge = await this.asaasService.createCharge(
          new CreateAsaasChargeDto(
            chargeDto,
            customer.asaasId,
            contract.charge.price,
          ),
        );
        chargeDto.asaasId = asaasCharge.id;
        await this.chargeService.update(contract.charge.id, chargeDto);
      } else {
        this.subscriptionService.updateSubscriptionStatusByAutentiqueId(
          autentiqueId,
          status,
        );
        this.autentiqueService.updateSignatureStatus(
          autentiqueId,
          AutentiqueStatus.SIGNED,
        );
      }
    }
    return;
  }
}
