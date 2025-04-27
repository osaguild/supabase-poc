import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { ApiModule } from './api/api.module';
import { ConsumerModule } from './consumer/consumer.module';
import { PrismaModule } from './prisma/prisma.module';
import { PubSubModule } from './pubsub/pubsub.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
    PubSubModule,
    ApiModule,
    ConsumerModule,
  ],
})
export class AppModule {}
