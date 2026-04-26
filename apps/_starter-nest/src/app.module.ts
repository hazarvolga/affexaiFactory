import { Module } from '@nestjs/common';
import { JwtAuthGuard } from './auth.guard.js';
import { HealthController } from './health.controller.js';

@Module({
  controllers: [HealthController],
  providers: [JwtAuthGuard],
})
export class AppModule {}
