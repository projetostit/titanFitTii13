import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import mysql from 'mysql2/promise';

@Injectable()

export class DatabaseService implements OnModuleInit, OnModuleDestroy {

  private pool: mysql.Pool;

  constructor() {

    this.pool = mysql.createPool({

      host: process.env.DB_HOST,

      port: Number(process.env.DB_PORT),

      user: process.env.DB_USER,

      password: process.env.DB_PASS,

      database: process.env.DB_NAME,

      waitForConnections: true,

      connectionLimit: 10,

    });

  }

  async onModuleInit() {

    const connection = await this.pool.getConnection();

    console.log('Banco de dados conectado com sucesso!');

    connection.release();

  }

  async onModuleDestroy() {

    await this.pool.end();

  }

  getPool() {

    return this.pool;

  }

}
