import { Global, Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';

@Global() // it just removes the need to write imports: [DatabaseModule] in every feature module
@Module({
    providers: [...databaseProviders], // creates PG_CONNECTION, but only usable *inside* DatabaseModule
    exports: [...databaseProviders] // makes PG_CONNECTION available to modules that import DatabaseModule
})
export class DatabaseModule {

}
