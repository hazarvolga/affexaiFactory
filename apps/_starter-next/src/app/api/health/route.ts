import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json({
    service: 'starter-next',
    status: 'ok',
    uptime: process.uptime(),
  });
}
