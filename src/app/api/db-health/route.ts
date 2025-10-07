/**
 * Database Health Check API Endpoint
 *
 * @fileoverview GET endpoint that tests database connectivity.
 * Returns status information about the database connection.
 *
 * @module api/db-health
 */

import { NextResponse } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';

/**
 * Health check response type
 */
interface HealthCheckResponse {
  status: 'ok' | 'error';
  database: 'connected' | 'disconnected';
  timestamp: string;
  error?: string;
}

/**
 * GET /api/db-health
 *
 * Tests database connectivity by executing a simple query.
 * Returns JSON with connection status.
 *
 * @returns JSON response with health check status
 *
 * @example
 * ```bash
 * curl http://localhost:3000/api/db-health
 * ```
 *
 * Success response:
 * ```json
 * {
 *   "status": "ok",
 *   "database": "connected",
 *   "timestamp": "2025-10-06T18:00:00.000Z"
 * }
 * ```
 *
 * Error response:
 * ```json
 * {
 *   "status": "error",
 *   "database": "disconnected",
 *   "timestamp": "2025-10-06T18:00:00.000Z",
 *   "error": "Connection failed: ..."
 * }
 * ```
 */
export async function GET(): Promise<NextResponse<HealthCheckResponse>> {
  try {
    // Test database connection with a simple query
    await db.execute(sql`SELECT 1`);

    const response: HealthCheckResponse = {
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    const response: HealthCheckResponse = {
      status: 'error',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
      error: `Database connection failed: ${errorMessage}`,
    };

    return NextResponse.json(response, { status: 503 });
  }
}
