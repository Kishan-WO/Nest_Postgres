import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { DatabaseError } from 'pg';

@Catch(DatabaseError)
@Injectable()
export class DatabaseExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(DatabaseExceptionFilter.name);

    constructor(private readonly configService: ConfigService) { }

    catch(exception: DatabaseError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        this.logger.error(`Database Exception [${exception.code}]: ${exception.message}`, exception.stack);

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = exception.message || 'Database error occurred';

        if (exception.code === '23505') {
            status = HttpStatus.CONFLICT;
            message = 'Resource already exists (e.g., Email is already registered)';
        }

        const env = this.configService.get<string>('NODE_ENV');
        const isDev = !env || env === 'development';

        response.status(status).json({
            statusCode: status,
            message,
            timestamp: new Date().toISOString(),
            path: request.url,
            ...(isDev && { code: exception.code, detail: exception.detail }),
        });
    }
}
