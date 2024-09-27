import events from 'events';

import {BetterSQLite3Database} from 'drizzle-orm/better-sqlite3';

import {Adapter} from '../../adapter';
import * as schema from '../database/schema';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventMap<T> = Record<keyof T, any[]> | DefaultEventMap;
type DefaultEventMap = [never];

abstract class Entity<T extends EventMap<T> = DefaultEventMap> extends events.EventEmitter<T> {
    protected static database?: BetterSQLite3Database<typeof schema>;
    protected static adapter?: Adapter;

    public static injectDatabase(database: BetterSQLite3Database<typeof schema>): void {
        Entity.database = database;
    }

    public static injectAdapter(adapter: Adapter): void {
        Entity.adapter = adapter;
    }
}

export default Entity;
