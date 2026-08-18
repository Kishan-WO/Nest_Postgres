import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';

import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { GetUserMiddleware } from '../common/middleware/get_user.middleware';

@Module({
    imports: [CloudinaryModule],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository],
    exports: [UsersService, UsersRepository],
})
export class UsersModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(GetUserMiddleware)
            .exclude({ path: 'users/:id', method: RequestMethod.GET })
            .forRoutes({ path: 'users{*path}', method: RequestMethod.GET });
    }
}
