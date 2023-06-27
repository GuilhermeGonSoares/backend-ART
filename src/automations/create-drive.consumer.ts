import {
  Processor,
  Process,
  OnQueueCompleted,
  InjectQueue,
} from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { GoogleDriveService } from '../google-drive/google-drive.service';
import { CustomerEntity } from '../customer/entities/customer.entity';
import { CreateGroupDto } from '../automations/dtos/create-group.dto';
import { GoogleDriveEntity } from '../google-drive/entities/google-drive.entity';

@Processor('automations')
export class CreateDriveConsumer {
  constructor(
    private readonly googleDriveService: GoogleDriveService,
    @InjectQueue('automations') private readonly automationQueue: Queue,
  ) {}
  @Process('createDrive')
  async createDrive(
    job: Job<{
      customer: CustomerEntity;
      productName: string;
      isCreateGroup: boolean;
    }>,
  ) {
    const { customer } = job.data;
    const folder: GoogleDriveEntity | undefined = await this.googleDriveService
      .findFolderByCustomerId(customer.cnpj)
      .catch(() => undefined);

    if (folder) {
      return folder.link;
    }

    return await this.googleDriveService.createFolder(
      customer.name,
      customer.cnpj,
    );
  }

  @OnQueueCompleted()
  async handleCreateDriveJob(
    job: Job<{
      customer: CustomerEntity;
      productName: string;
      isCreateGroup: boolean;
    }>,
  ) {
    const { customer, productName, isCreateGroup } = job.data;
    const linkDrive = job.returnvalue;

    if (isCreateGroup) {
      const createGroupDto = new CreateGroupDto(customer, productName, [
        linkDrive,
      ]);
      await this.automationQueue.add(
        'createGroup',
        {
          ...createGroupDto,
        },
        { lifo: true },
      );
    }
  }
}
