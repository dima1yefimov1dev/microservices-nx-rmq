import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './model/user.model';
import { UserRepository } from './repository/user.repository';
import { UserCommands } from './user.commands';
import { UserQueries } from './user.queries';
import { UserService } from './user.service';
import { UserEventEmitter } from './user.events-emitter';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: User.name, schema: UserSchema},
    ]),
  ],
  providers: [UserRepository, UserService, UserEventEmitter],
  exports: [UserRepository],
  controllers: [UserCommands, UserQueries],
})
export class UserModule {}
