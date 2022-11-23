import mysql from 'mysql2/promise';
// Database access layer
export class Database {
  user: string;
  password: string;
  host: string;
  port: number;
  database: string;
  // Only MySQL is supported for now
  connection: mysql.Connection;
  constructor(params: any) {
    this.user = params.env.DB_USERNAME;
    this.password = params.env.DB_PASSWORD;
    this.host = params.env.DB_HOST;
    this.port = params.env.DB_PORT;
    this.database = params.env.DB_DATABASE;
  }
  async connect() {
    this.connection = await mysql.createConnection({
      host: this.host,
      user: this.user,
      password: this.password,
      port: this.port,
      database: this.database,
    });
  }
}
