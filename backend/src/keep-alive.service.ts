import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class KeepAliveService {
  private readonly logger = new Logger(KeepAliveService.name);

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  // Runs at 8am, 2pm, and 8pm
  @Cron('0 8,14,20 * * *')
  async pingDatabase() {
    try {
      await this.dataSource.query('SELECT 1');
      this.logger.log('Database keep-alive ping successful');
    } catch (error) {
      this.logger.error('Database keep-alive ping failed', error);
    }
  }
}
