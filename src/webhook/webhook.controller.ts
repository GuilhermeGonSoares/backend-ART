import { Controller, HttpCode, Post, Body, Logger } from '@nestjs/common';
import { SubscriptionStatus } from '../enums/subscription-status.enum';
import { SubscriptionService } from '../subscription/subscription.service';
import { AutentiqueService } from '../autentique/autentique.service';
import { AutentiqueStatus } from '../enums/autentique-contract.enum';
import { ChargeService } from '../charge/charge.service';
import { CustomerService } from '../customer/customer.service';
import { AsaasService } from '../asaas/asaas.service';
import { CreateAsaasChargeDto } from '../asaas/dtos/create-charge.dto';
import { CreateChargeDto } from '../charge/dto/create-charge.dto';
import { AsaasChargeWebhook } from './interfaces/asaas-charge.interface';
import { PaymentStatus } from '../enums/payment-status.enum';
import { UpdateChargeDto } from '../charge/dto/update-charge.dto';
import { PaymentType } from '../enums/payment.enum';

@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

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
      this.logger.log(`Signed contract: ${payload.documento.nome}`);
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

  @Post('asaas')
  @HttpCode(200)
  async handleChargeEvent(@Body() payload: AsaasChargeWebhook) {
    const { event, payment } = payload;
    const updateChargeDto = new UpdateChargeDto();

    if (event === 'PAYMENT_CONFIRMED') {
      updateChargeDto.paymentStatus = PaymentStatus.CONFIRMED;
      await this.chargeService.updateByAsaasId(payment.id, updateChargeDto);
    } else if (event === 'PAYMENT_RECEIVED') {
      updateChargeDto.paymentStatus = PaymentStatus.RECEIVED;
      updateChargeDto.paymentDate = payment.paymentDate;
      await this.chargeService.updateByAsaasId(payment.id, updateChargeDto);
    } else if (event === 'PAYMENT_OVERDUE') {
      updateChargeDto.paymentStatus = PaymentStatus.OVERDUE;
      await this.chargeService.updateByAsaasId(payment.id, updateChargeDto);
    } else if (event === 'PAYMENT_DELETED') {
      //DELETAR COBRANÇA DO BANCO DE DADOS
      await this.chargeService.deleteByAsaasId(payment.id);
    } else if (event === 'PAYMENT_UPDATED') {
      console.log(event);
      console.log(payment);
      updateChargeDto.dueDate = payment.dueDate;
      updateChargeDto.paymentType =
        payment.billingType === 'BOLETO'
          ? PaymentType.BOLETO
          : payment.billingType === 'PIX'
          ? PaymentType.PIX
          : undefined;
      updateChargeDto.discount = payment.discount.value;
      await this.chargeService.updateByAsaasId(payment.id, updateChargeDto);
      // Alteração no vencimento ou valor de cobrança existente.
    }
  }
}
