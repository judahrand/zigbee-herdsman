import {blob, integer, sqliteTable} from 'drizzle-orm/sqlite-core';

import {KeyValue} from '../../tstype';

export type GroupMember = {
    deviceIeeeAddr: string;
    endpointID: number;
};

export const group = sqliteTable('group', {
    id: integer('id').primaryKey(),
    groupId: integer('group_id').notNull().unique(),
    members: blob('members', {mode: 'json'}).notNull().$type<GroupMember[]>().default([]),
    meta: blob('metadata', {mode: 'json'}).notNull().$type<KeyValue>().default({}),
});

export type SelectGroup = typeof group.$inferSelect;
export type InsertGroup = typeof group.$inferInsert;
