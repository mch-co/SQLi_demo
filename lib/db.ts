import mysql from "mysql2/promise";

// Configuration de la connexion à MariaDB
export const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "sqli_demo",
  port: parseInt(process.env.DB_PORT || "3306"),
};

// Créer une connexion
export async function getConnection() {
  return await mysql.createConnection(dbConfig);
}

// Créer un pool de connexions (recommandé pour la production)
export const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
});

// Fonction utilitaire pour exécuter des requêtes
export async function query<T>(sql: string, params?: any[]): Promise<T> {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.execute(sql, params);
    return results as T;
  } finally {
    connection.release();
  }
}
