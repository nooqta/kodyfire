import mysql from 'mysql2/promise';
export declare class Database {
    user: string;
    password: string;
    host: string;
    port: number;
    database: string;
    connection: mysql.Connection;
    constructor(params: any);
    connect(): Promise<void>;
}
