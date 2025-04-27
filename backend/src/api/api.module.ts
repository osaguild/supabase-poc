import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PubSubModule } from '../pubsub/pubsub.module';

@Module({
  imports: [PrismaModule, PubSubModule],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
