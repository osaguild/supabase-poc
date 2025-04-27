import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PubSub, Subscription, Message, ClientConfig } from '@google-cloud/pubsub';

@Injectable()
export class PubSubService implements OnModuleInit, OnModuleDestroy {
  private pubsub: PubSub;
  private topic: string;
  private subscription: string;
  private subscriptionClient: Subscription;
  private readonly logger = new Logger(PubSubService.name);
  private isEmulator: boolean;

  constructor(private configService: ConfigService) {
    const projectId = this.configService.get<string>('gcp.projectId');
    const credentials = this.configService.get('gcp.credentials');
    const emulatorHost = process.env.PUBSUB_EMULATOR_HOST;
    
    this.isEmulator = !!emulatorHost;
    this.logger.log(`PubSub Mode: ${this.isEmulator ? 'Emulator' : 'Production'}`);
    
    if (this.isEmulator) {
      this.logger.log(`Using PubSub Emulator at: ${emulatorHost}`);
    }
    
    // エミュレーターモードまたは本番モードの設定
    const clientConfig: ClientConfig = {
      projectId,
    };
    
    // 本番環境のときのみ認証情報を使用
    if (!this.isEmulator && Object.keys(credentials).length > 0) {
      clientConfig.credentials = credentials;
    }
    
    this.pubsub = new PubSub(clientConfig);
    
    this.topic = this.configService.get<string>('gcp.pubsub.topic') || 'name-topic';
    this.subscription = this.configService.get<string>('gcp.pubsub.subscription') || 'name-subscription';
  }

  async onModuleInit() {
    try {
      // トピックが存在するか確認し、なければ作成
      const [topicExists] = await this.pubsub.topic(this.topic).exists();
      if (!topicExists) {
        this.logger.log(`Creating topic: ${this.topic}`);
        await this.pubsub.createTopic(this.topic);
      }

      // サブスクリプションが存在するか確認し、なければ作成
      const [subscriptionExists] = await this.pubsub
        .subscription(this.subscription)
        .exists();
      if (!subscriptionExists) {
        this.logger.log(`Creating subscription: ${this.subscription}`);
        await this.pubsub.topic(this.topic).createSubscription(this.subscription);
      }

      // サブスクリプションクライアントを設定
      this.subscriptionClient = this.pubsub.subscription(this.subscription);
    } catch (error) {
      this.logger.error('Error initializing PubSub', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    if (this.subscriptionClient) {
      this.subscriptionClient.removeAllListeners();
    }
  }

  async publishMessage(data: object): Promise<string> {
    try {
      const dataBuffer = Buffer.from(JSON.stringify(data));
      const messageId = await this.pubsub.topic(this.topic).publish(dataBuffer);
      this.logger.log(`Message published: ${messageId}`);
      return messageId;
    } catch (error) {
      this.logger.error('Error publishing message', error);
      throw error;
    }
  }

  async subscribeToMessages(callback: (data: object) => Promise<void>): Promise<void> {
    this.subscriptionClient.on('message', async (message: Message) => {
      try {
        const data = JSON.parse(message.data.toString());
        this.logger.log(`Message received: ${message.id}`);
        await callback(data);
        message.ack();
      } catch (error) {
        this.logger.error('Error processing message', error);
        message.nack();
      }
    });

    this.subscriptionClient.on('error', (error) => {
      this.logger.error('Subscription error', error);
    });

    this.logger.log(`Listening for messages on ${this.subscription}`);
  }
}
