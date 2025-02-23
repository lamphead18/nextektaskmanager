import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../auth/user-request.interface';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { method, originalUrl, body, query } = req;
    const userId = req.user?.userId || 'Unauthenticated User';

    res.on('finish', () => {
      const statusCode = res.statusCode;
      this.logger.log(
        `${method} ${originalUrl} - Status: ${statusCode} - User: ${userId}`,
      );

      if (body && typeof body === 'object' && Object.keys(body).length) {
      }
      if (Object.keys(query).length) {
        this.logger.debug(`Query: ${JSON.stringify(query)}`);
      }
    });

    next();
  }
}
