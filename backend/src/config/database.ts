import { Pool, PoolClient } from 'pg';
import { logger } from '../utils/logger';

// Parse DATABASE_URL or use individual components
const getDatabaseConfig = () => {
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
    };
  }
  
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'oneaftersales',
    user: process.env.DB_USER || 'oneaftersales',
    password: process.env.DB_PASSWORD || 'SecurePassword123',
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  };
};

const pool = new Pool({
  ...getDatabaseConfig(),
  min: parseInt(process.env.DATABASE_POOL_MIN || '2'),
  max: parseInt(process.env.DATABASE_POOL_MAX || '10'),
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    logger.error('Query error', { text, error });
    throw error;
  }
};

export const getClient = (): Promise<PoolClient> => {
  return pool.connect();
};

export const initDatabase = async () => {
  try {
    await pool.query('SELECT NOW()');
    logger.info('Database connection established');
  } catch (error) {
    logger.error('Database connection failed', error);
    throw error;
  }
};

export default pool;
