function getEnv(key: string, required = true): string {
    const value = process.env[key];

    if (required && (!value || value.trim() === '')) {
        throw new Error(`Missing environment variable: ${key}`);
    }

    return value as string;
}

function getEnvNumber(key: string, defaultValue?: number): number {
    const value = process.env[key];

    if (!value) {
        if (defaultValue !== undefined) return defaultValue;
        throw new Error(`Missing environment variable: ${key}`);
    }

    const parsed = Number(value);

    if (isNaN(parsed)) {
        throw new Error(`Invalid number for env ${key}`);
    }

    return parsed;
}

export default () => ({
    port: getEnvNumber('PORT', 3000),
    node_env: getEnv('NODE_ENV'),

    jwt: {
        access_secret: getEnv('JWT_ACCESS_SECRET'),
        access_expire: getEnv('JWT_ACCESS_EXPIRE'),
        refresh_secret: getEnv('JWT_REFRESH_SECRET'),
        refresh_expire: getEnv('JWT_REFRESH_EXPIRE'),
    },

    database: {
        host: getEnv('DB_HOST'),
        port: getEnvNumber('DB_PORT', 5432),
        username: getEnv('DB_USERNAME'),
        password: getEnv('DB_PASSWORD'),
        name: getEnv('DB_NAME'),
    },

    cloudinary: {
        cloud_name: getEnv('CLOUDINARY_CLOUD_NAME'),
        api_key: getEnv('CLOUDINARY_API_KEY'),
        api_secret: getEnv('CLOUDINARY_API_SECRET'),
    },
});
