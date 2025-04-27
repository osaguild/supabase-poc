import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PubSubService } from '../pubsub/pubsub.service';

@Injectable()
export class ConsumerService implements OnModuleInit {
  private readonly logger = new Logger(ConsumerService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly pubSubService: PubSubService,
  ) {}

  async onModuleInit() {
    await this.startConsumer();
  }

  async startConsumer() {
    try {
      await this.pubSubService.subscribeToMessages(async (data: { lastName: string; firstName: string; nameEntryId: string }) => {
        this.logger.log(`Processing message: ${JSON.stringify(data)}`);
        await this.processMessage(data);
      });
      this.logger.log('Consumer started successfully');
    } catch (error) {
      this.logger.error('Failed to start consumer', error);
      throw error;
    }
  }

  async processMessage(data: { lastName: string; firstName: string; nameEntryId: string }) {
    try {
      const { lastName, firstName } = data;
      
      // 性+名を結合
      const fullName = `${lastName}${firstName}`;
      
      // フルネームをデータベースに保存
      const result = await this.prismaService.fullName.create({
        data: {
          fullName,
        },
      });
      
      this.logger.log(`Saved full name: ${fullName} with ID: ${result.id}`);
      return result;
    } catch (error) {
      this.logger.error('Error processing message', error);
      throw error;
    }
  }
}
