import { Controller, Get } from '@nestjs/common';
import type {
  DatabaseHealthResponse,
  HealthResponse,
} from '@date-planner/shared';
import { HealthService } from './health.service.js';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  health(): HealthResponse {
    return this.healthService.health();
  }

  @Get('db')
  database(): Promise<DatabaseHealthResponse> {
    return this.healthService.database();
  }
}
