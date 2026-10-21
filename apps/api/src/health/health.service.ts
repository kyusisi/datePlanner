import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { API_SERVICE } from '@date-planner/shared';
import type {
  DatabaseHealthResponse,
  HealthResponse,
} from '@date-planner/shared';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  health(): HealthResponse {
    return { status: 'ok', service: API_SERVICE };
  }

  async database(): Promise<DatabaseHealthResponse> {
    try {
      await this.prisma.checkConnection();
      return { status: 'ok', database: 'connected' };
    } catch {
      throw new ServiceUnavailableException('Database connection unavailable');
    }
  }
}
