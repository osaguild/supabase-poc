import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Logger,
  Req,
  Headers,
} from '@nestjs/common';
import { ApiService } from './api.service';
import { CreateNameDto } from './dto/create-name.dto';
import { Request } from 'express';

@Controller('api')
export class ApiController {
  private readonly logger = new Logger(ApiController.name);

  constructor(private readonly apiService: ApiService) {}

  @Post('names')
  @UsePipes(new ValidationPipe())
  async createName(@Body() createNameDto: CreateNameDto, @Req() request: Request, @Headers() headers: any) {
    // 詳細なデバッグ情報をログに出力
    this.logger.log('=========== API DEBUG INFO: POST /api/names ===========');
    this.logger.log(`[DEBUG] Request URL: ${request.protocol}://${request.get('host')}${request.originalUrl}`);
    this.logger.log(`[DEBUG] Request Method: ${request.method}`);
    this.logger.log(`[DEBUG] Headers: ${JSON.stringify(headers)}`);
    this.logger.log(`[DEBUG] Body: ${JSON.stringify(createNameDto)}`);
    this.logger.log(`[DEBUG] Client IP: ${request.ip}`);
    
    try {
      const result = await this.apiService.createName(createNameDto);
      this.logger.log(`[DEBUG] Response: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error(`[ERROR] Error processing request: ${error.message}`);
      this.logger.error(`[ERROR] Stack trace: ${error.stack}`);
      throw error;
    }
  }

  @Get('entries')
  async getAllEntries(@Req() request: Request, @Headers() headers: any) {
    // 詳細なデバッグ情報をログに出力
    this.logger.log('=========== API DEBUG INFO: GET /api/entries ===========');
    this.logger.log(`[DEBUG] Request URL: ${request.protocol}://${request.get('host')}${request.originalUrl}`);
    this.logger.log(`[DEBUG] Request Method: ${request.method}`);
    this.logger.log(`[DEBUG] Headers: ${JSON.stringify(headers)}`);
    this.logger.log(`[DEBUG] Client IP: ${request.ip}`);
    
    try {
      const result = await this.apiService.getAllEntries();
      this.logger.log(`[DEBUG] Response: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error(`[ERROR] Error processing request: ${error.message}`);
      this.logger.error(`[ERROR] Stack trace: ${error.stack}`);
      throw error;
    }
  }
}
