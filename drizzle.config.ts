import {defineConfig} from 'drizzle-kit';

export default defineConfig({
    schema: './src/controller/database/schema/index.ts',
    out: './src/controller/database/schema/migrations',
    dialect: 'sqlite',
});
