import { WhatsappEntity } from '../entities/whatsapp.entity';

export class ReturnWhatsappDto {
  private id: number;
  private groupId: string;
  private linkGroup: string;

  constructor(whatsapp: WhatsappEntity) {
    this.id = whatsapp.id;
    this.groupId = whatsapp.groupId;
    this.linkGroup = whatsapp.linkGroup;
  }
}
