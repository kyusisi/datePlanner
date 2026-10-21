import { Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import type { Request, Response } from 'express';
import type { ApiError } from '@date-planner/shared';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const body =
      exception instanceof HttpException ? exception.getResponse() : null;
    let message: string | string[] = 'Internal server error';
    if (typeof body === 'string') message = body;
    else if (body && typeof body === 'object' && 'message' in body) {
      const value: unknown = body.message;
      if (
        typeof value === 'string' ||
        (Array.isArray(value) &&
          value.every((item) => typeof item === 'string'))
      )
        message = value;
    }
    if (statusCode === 500) this.logger.error('Unhandled request error');
    const error: ApiError = {
      statusCode,
      code:
        statusCode === 503
          ? 'SERVICE_UNAVAILABLE'
          : statusCode === 500
            ? 'INTERNAL_SERVER_ERROR'
            : `HTTP_${statusCode}`,
      message,
      path: request.path,
      timestamp: new Date().toISOString(),
    };
    response.status(statusCode).json(error);
  }
}
