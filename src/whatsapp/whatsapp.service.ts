import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { WhatsappEntity } from './entities/whatsapp.entity';
import { Repository } from 'typeorm';
import { CreateGroupDto } from './dtos/create-group.dto';
import { ExistWhatsappPhone } from './dtos/exist-whatsapp-phone.dto';
import {
  messageGroupCalendly,
  messageGroupDrive,
  messageGroupInitial,
} from '../utils/messages/message.group';

@Injectable()
export class WhatsappService {
  private url: string;
  private groupName = 'TFG - ';
  private groupPhoto =
    'https://agenciaart.com.br/wp-content/uploads/2021/12/cropped-Logo-Site.png';
  private description = '';

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
    this.description = `Grupo do projeto de *${productName}* da *${customerName}*. \n \n *Links Úteis*: \n <AQUIVAILINKS> \n *Google Drive*: \n ${links[0]} \n *Dashboard de Acompanhamento* [TR] \n \n *Agendar Reuniões* \n Link do Calendly \n \n E aí, vamos decolar? 🚀`;
  }

  async existWhatsappNumber(phone: string): Promise<boolean> {
    const { data: existPhone }: { data: ExistWhatsappPhone } =
      await this.httpService.axiosRef.get(this.url + `/phone-exists/${phone}`);

    if (!existPhone.exists) {
      throw new BadRequestException('This whatsapp number is invalid!');
    }
    return true;
  }

  async createGroup(
    phone: string,
    customerName: string,
    customerId: string,
    productName: string,
    links: string[],
  ) {
    this.setDescription(productName, customerName, links);

    const group: WhatsappEntity = await this.findGroupByCustomerId(
      customerId,
    ).catch(() => undefined);

    if (group) {
      return group;
    }
    await this.existWhatsappNumber(phone);

    const response = await this.httpService.axiosRef.post(
      this.url + '/create-group',
      {
        groupName: this.groupName + customerName,
        phones: ['55' + phone],
      },
    );
    const createGroup: CreateGroupDto = response.data;

    await this.updateImageGroup(createGroup.phone);
    await this.updateDescriptionGroup(createGroup.phone);

    await this.saveWhatsappRegister(createGroup, customerId);

    await this.sendMessageGroup(
      createGroup.phone,
      messageGroupInitial(customerName),
      messageGroupDrive(links[0]),
      messageGroupCalendly(customerName),
    );

    return createGroup;
  }

  async sendMessageGroup(groupId: string, ...messages: string[]) {
    messages.forEach(async (message) => {
      await this.httpService.axiosRef.post(this.url + '/send-text', {
        phone: groupId,
        message,
        delayMessage: 3,
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

  async saveWhatsappRegister(createGroup: CreateGroupDto, customerId: string) {
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
}
