import type { SessionUser } from '@affex/auth-core';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth.guard.js';

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

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: { user?: SessionUser }) {
    return { ok: true, user: req.user };
  }
}
