import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PubSubService } from '../pubsub/pubsub.service';
import { CreateNameDto } from './dto/create-name.dto';

@Injectable()
export class ApiService {
  private readonly logger = new Logger(ApiService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly pubsubService: PubSubService,
  ) {}

  async createName(createNameDto: CreateNameDto) {
    try {
      // データベースに名前エントリを保存
      const nameEntry = await this.prismaService.nameEntry.create({
        data: {
          lastName: createNameDto.lastName,
          firstName: createNameDto.firstName,
        },
      });

      this.logger.log(`Name entry saved with ID: ${nameEntry.id}`);

      // Pub/Subにメッセージを送信
      await this.pubsubService.publishMessage({
        lastName: createNameDto.lastName,
        firstName: createNameDto.firstName,
        nameEntryId: nameEntry.id,
      });

      this.logger.log('Published message to Pub/Sub');

      return nameEntry;
    } catch (error) {
      this.logger.error('Error creating name entry', error);
      throw error;
    }
  }

  async getAllEntries() {
    try {
      // 名前エントリを取得
      const nameEntries = await this.prismaService.nameEntry.findMany({
        orderBy: { createdAt: 'desc' },
      });

      // フルネームを取得
      const fullNames = await this.prismaService.fullName.findMany({
        orderBy: { createdAt: 'desc' },
      });

      return {
        nameEntries,
        fullNames,
      };
    } catch (error) {
      this.logger.error('Error getting entries', error);
      throw error;
    }
  }
}
