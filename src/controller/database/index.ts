import fs from 'fs';
import readline from 'readline';

import DatabaseClient from 'better-sqlite3';
import {BetterSQLite3Database, drizzle} from 'drizzle-orm/better-sqlite3';
import {migrate} from 'drizzle-orm/better-sqlite3/migrator';

import {logger} from '../../utils/logger';
import {DeviceType, KeyValue} from '../tstype';
import * as schema from './schema';
import {InsertDevice, InsertGroup} from './schema';
import {GroupMember} from './schema/group';

const NS = 'zh:controller:database';

async function createDatabase(path: string): Promise<BetterSQLite3Database<typeof schema>> {
    let db: BetterSQLite3Database<typeof schema>;
    if (!fs.existsSync(path) || (await isSqliteDatabase(path))) {
        db = drizzle(DatabaseClient(path), {schema});
        runMigrations(db);
    } else {
        await migrateJSONDatabase(path);
        db = drizzle(DatabaseClient(path), {schema});
    }
    return db;
}

async function isSqliteDatabase(path: string): Promise<boolean> {
    const readable = fs.createReadStream(path);
    const reader = readline.createInterface({input: readable});
    const line: string = await new Promise((resolve) => {
        reader.on('line', (line) => {
            reader.close();
            resolve(line);
        });
    });
    readable.close();
    return line === 'SQLite format 3';
}

function runMigrations(db: BetterSQLite3Database<typeof schema>): void {
    migrate(db, {migrationsFolder: './src/controller/database/schema/migrations'});
}

async function migrateJSONDatabase(path: string): Promise<void> {
    const devices: InsertDevice[] = [];
    const groups: InsertGroup[] = [];

    const file = fs.readFileSync(path, 'utf-8');
    for (const row of file.split('\n')) {
        if (!row) {
            continue;
        }

        try {
            const json = JSON.parse(row);

            if (json.id != undefined) {
                if (json.type == 'Group') {
                    groups.push({
                        id: json.id as number,
                        groupId: json.groupID as number,
                        members: json.members as GroupMember[],
                        meta: json.meta as KeyValue,
                    });
                } else {
                    devices.push({
                        id: json.id as number,
                        type: json.type as DeviceType,
                        ieeeAddr: json.ieeeAddr as string,
                        nwkAddr: json.nwkAddr as number,
                        manufId: json.manufId as number,
                        manufName: json.manufName as string,
                        powerSource: json.powerSource as string,
                        modelId: json.modelId as string,
                        epList: json.epList as number[],
                        endpoints: json.endpoints as KeyValue,
                        appVersion: json.appVersion as number,
                        stackVersion: json.stackVersion as number,
                        hwVersion: json.hwVersion as number,
                        dateCode: json.dateCode as string,
                        swBuildId: json.swBuildId as string,
                        zclVersion: json.zclVersion as number,
                        interviewCompleted: json.interviewCompleted as boolean,
                        meta: json.meta as KeyValue,
                        lastSeen: json.lastSeen as number,
                        checkinInterval: json.checkinInterval as number,
                    });
                }
            }
        } catch (error) {
            logger.error(`Corrupted database line, ignoring. ${error}`, NS);
        }
    }

    const tmpPath = path + '.migrate';
    const legacyPath = path + '.legacy';
    const db = drizzle(DatabaseClient(tmpPath), {schema});
    runMigrations(db);

    if (devices.length > 0) {
        for (const device of devices) {
            await db.insert(schema.device).values(device).onConflictDoUpdate({
                target: schema.device.id,
                set: device,
            });
        }
    }
    if (groups.length > 0) {
        for (const group of groups) {
            await db.insert(schema.group).values(group).onConflictDoUpdate({
                target: schema.group.id,
                set: group,
            });
        }
    }

    fs.renameSync(path, legacyPath);
    fs.renameSync(tmpPath, path);
}

export default createDatabase;
