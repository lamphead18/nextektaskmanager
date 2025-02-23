import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../auth/user-request.interface';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { method, originalUrl, body, query } = req;
    const userId = req.user?.userId || 'Unauthenticated User';
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      const statusCode = res.statusCode;

      this.logger.log(
        `${method} ${originalUrl} - Status: ${statusCode} - User: ${userId} - ${duration}ms`,
      );

      if (Object.keys(query).length) {
        this.logger.debug(`📌 Query Params: ${JSON.stringify(query)}`);
      }

      if (body && typeof body === 'object' && Object.keys(body).length) {
        this.logger.debug(`📦 Request Body: ${JSON.stringify(body)}`);
      }

      if (statusCode >= 400) {
        this.logger.error(
          `❌ Erro na requisição: ${statusCode} - ${JSON.stringify(body)}`,
        );
      }
    });

    next();
  }
}
