import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

export const PG_CONNECTION = 'PG_CONNECTION';

export const databaseProviders = [
    {
        provide: PG_CONNECTION,
        useFactory: async (configService: ConfigService) => {
            const logger = new Logger('Database');

            const pool = new Pool({
                host: configService.get<string>('database.host'),
                port: configService.get<number>('database.port'),
                user: configService.get<string>('database.username'),
                password: configService.get<string>('database.password'),
                database: configService.get<string>('database.name'),
                max: 10, // max pool size
                idleTimeoutMillis: 30000,
                connectionTimeoutMillis: 5000,
            });

            pool.on('connect', () => {
                logger.log('Postgres connection established');
            });

            try {
                await pool.query('SELECT 1');
                logger.log('Postgres connection successful');
            } catch (error) {
                logger.error('Postgres connection failed', error);
                throw error;
            }

            return pool;
        },
        inject: [ConfigService],
    },
];
