import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { createSchema }  from './database.statements';


@Injectable({
    providedIn: 'root'
})

export class DatabaseService {
    sqliteConnection!: SQLiteConnection;
    platform!: string;
    native: boolean = false;
    sqlitePlugin: any;

    async initializePlugin(): Promise<boolean> {
        return new Promise(resolve => {
            this.platform = Capacitor.getPlatform();
            if (this.platform === 'ios' || this.platform === 'android') this.native = true;
            this.sqlitePlugin = CapacitorSQLite;
            this.sqliteConnection = new SQLiteConnection(this.sqlitePlugin);
            resolve(true); 
        });
    }

    async createConnection(database: string, encrypted: boolean, mode: string, version: number): Promise<SQLiteDBConnection> {
        if (this.sqliteConnection != null) {
            try {
                const db: SQLiteDBConnection = await
                this.sqliteConnection.createConnection(database, encrypted, mode, version, false);
                if (db != null) {
                    return Promise.resolve(db);
                } else {
                    return Promise.reject(new Error('Erro ao criar a conexão'));
                }
            } catch (err: any) {
                return Promise.reject(new Error(err));
            }
        } else {
            return Promise.reject(new Error(`Nenhuma conexão disponível para ${database}`));
        }
    }

    private async createSchema (db: SQLiteConnection): Promise<void> {
        await db.open();
        let createSchema: any = await db.execute(this.createSchema);
        await db.close();
        if (createSchema.changes.changes < 0) {
            return Promise.reject(new Error ("Erro no criação das tabelas"))
        }
    return Promise.resolve();    
    }
}

