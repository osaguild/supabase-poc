import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PubSubModule } from '../pubsub/pubsub.module';

@Module({
  imports: [PrismaModule, PubSubModule],
  providers: [ConsumerService],
})
export class ConsumerModule {}
