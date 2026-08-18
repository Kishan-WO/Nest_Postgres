import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class GetUserMiddleware implements NestMiddleware {
    private readonly logger = new Logger('GetUserMiddleware');

    use(req: Request, res: Response, next: NextFunction) {
        this.logger.log(`[GetUserMiddleware] Received GET request: ${req.method} ${req.originalUrl}`);
        next();
    }
}
