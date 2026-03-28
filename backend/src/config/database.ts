import dotenv from 'dotenv';

dotenv.config();

/**
 * Database configuration mapped from environment variables.
 * Supports the same DB_URL, DB_USER, DB_PASS pattern as the original Java application
 * while also supporting Prisma's DATABASE_URL format.
 */
export const databaseConfig = {
  /**
   * DATABASE_URL for Prisma. If not set directly, it will be constructed
   * from DB_URL, DB_USER, and DB_PASS environment variables for backward
   * compatibility with the original Java configuration.
   */
  getDatabaseUrl(): string {
    if (process.env.DATABASE_URL) {
      return process.env.DATABASE_URL;
    }

    const dbUrl = process.env.DB_URL || 'jdbc:mysql://db:3306/inventory?useSSL=false&allowPublicKeyRetrieval=true';
    const dbUser = process.env.DB_USER || 'inventory_user';
    const dbPass = process.env.DB_PASS || 'inventory_password';

    // Convert JDBC URL to Prisma-compatible MySQL URL
    const mysqlMatch = dbUrl.match(/jdbc:mysql:\/\/([^?]+)/);
    const hostAndDb = mysqlMatch ? mysqlMatch[1] : 'db:3306/inventory';

    return `mysql://${dbUser}:${dbPass}@${hostAndDb}`;
  },
};

export const serverConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
};
