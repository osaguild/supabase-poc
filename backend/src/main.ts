import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  // 詳細な環境情報をログに出力
  logger.log('======= アプリケーション起動: 環境情報 =======');
  logger.log(`Node Version: ${process.version}`);
  logger.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.log(`Current Directory: ${process.cwd()}`);
  
  // 環境変数の診断
  logger.log('======= 環境変数の診断 =======');
  logger.log(`PORT: ${process.env.PORT || '(未設定)'}`);
  logger.log(`PUBSUB_EMULATOR_HOST: ${process.env.PUBSUB_EMULATOR_HOST || '(未設定)'}`);
  logger.log(`DATABASE_URL: ${process.env.DATABASE_URL ? '(設定済み)' : '(未設定)'}`);
  
  // CORSの設定 - 開発環境ではすべてのオリジンを許可
  const corsOrigins = ['http://localhost:3002', 'http://localhost:3000', '*'];
  logger.log(`CORS設定済みOrigins: ${JSON.stringify(corsOrigins)}`);

  try {
    const app = await NestFactory.create(AppModule);
    
    // リクエストロギングミドルウェアを追加
    app.use((req, res, next) => {
      const logEntry = {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        headers: req.headers,
        query: req.query,
        ip: req.ip,
      };
      
      logger.log(`[受信リクエスト] ${JSON.stringify(logEntry)}`);
      
      // レスポンスロギング
      const originalSend = res.send;
      res.send = function(body) {
        logger.log(`[送信レスポンス] Status: ${res.statusCode}, Body: ${typeof body === 'string' ? body : '(非文字列)'}`);
        return originalSend.call(this, body);
      };
      
      next();
    });
    
    // CORSの設定を完全にオープンにする（開発環境用）
    app.enableCors({
      origin: '*', // すべてのオリジンを許可
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: false, // クレデンシャルを必要としない
      allowedHeaders: 'Content-Type,Accept,Authorization',
    });
    
    logger.log('[DEBUG] CORS設定完了: すべてのオリジンからのリクエストを許可');
    
    const configService = app.get(ConfigService);
    // PORT環境変数から直接取得
    const port = configService.get<number>('PORT') || 3003;
    
    await app.listen(port);
    logger.log(`アプリケーション起動成功 - URL: http://localhost:${port}`);
    logger.log(`CORS設定: ${corsOrigins.join(', ')}`);
  } catch (error) {
    logger.error(`アプリケーション起動エラー: ${error.message}`);
    logger.error(error.stack);
  }
}

bootstrap().catch(err => {
  const logger = new Logger('Bootstrap');
  logger.error(`予期せぬエラーが発生: ${err.message}`);
  logger.error(err.stack);
});
