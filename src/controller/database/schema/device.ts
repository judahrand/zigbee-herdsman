import {blob, index, integer, sqliteTable, text} from 'drizzle-orm/sqlite-core';

import {DeviceType, KeyValue} from '../../tstype';

export const device = sqliteTable(
    'device',
    {
        id: integer('id').primaryKey(),
        type: text('type').notNull().$type<DeviceType>(),
        ieeeAddr: text('ieee_address').notNull(),
        nwkAddr: integer('network_address').notNull(),
        manufId: integer('manufacturer_id'),
        manufName: text('manufacturer_name'),
        powerSource: text('power_source'),
        modelId: text('model_id'),
        epList: blob('endpoint_ids', {mode: 'json'}).notNull().$type<number[]>(),
        endpoints: blob('endpoints', {mode: 'json'}).notNull().$type<KeyValue>(),
        appVersion: integer('application_version'),
        stackVersion: integer('stack_version'),
        hwVersion: integer('hardware_version'),
        dateCode: text('date_code'),
        swBuildId: text('software_build_id'),
        zclVersion: integer('zcl_version'),
        interviewCompleted: integer('interview_completed', {mode: 'boolean'}).notNull(),
        meta: blob('metadata', {mode: 'json'}).notNull().$type<KeyValue>().default({}),
        lastSeen: integer('last_seen'),
        checkinInterval: integer('checkin_interval'),
    },
    (table) => {
        return {
            typeIdx: index('type_idx').on(table.type),
            ieeeAddrIdx: index('ieeeAddr_idx').on(table.ieeeAddr),
        };
    },
);

export type SelectDevice = typeof device.$inferSelect;
export type InsertDevice = typeof device.$inferInsert;
