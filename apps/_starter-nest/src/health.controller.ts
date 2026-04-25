import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('/')
  root() {
    return { service: 'starter-nest', ok: true };
  }

  @Get('/health')
  health() {
    return { status: 'ok', uptime: process.uptime() };
  }
}
