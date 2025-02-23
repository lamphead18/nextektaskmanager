import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisService {
  private client;

  constructor() {
    this.client = createClient({
      socket: {
        host: 'localhost',
        port: 6379,
      },
    });

    this.client
      .connect()
      .then(() => console.log('✅ Redis conectado!'))
      .catch(console.error);
  }

  async setKey(key: string, value: string, ttl: number = 300) {
    await this.client.set(key, value, { EX: ttl });
  }

  async getKey(key: string) {
    return await this.client.get(key);
  }

  async deleteKey(key: string) {
    return await this.client.del(key);
  }

  async existsKey(key: string) {
    return await this.client.exists(key);
  }

  async scanKeys(pattern: string): Promise<string[]> {
    const keys: string[] = [];
    let cursor = 0;

    do {
      const reply = await this.client.scan(cursor, {
        MATCH: pattern,
        COUNT: 100,
      });
      cursor = reply.cursor;
      keys.push(...reply.keys);
    } while (cursor !== 0);

    return keys;
  }
}
