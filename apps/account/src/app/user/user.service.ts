import { Injectable } from "@nestjs/common";
import { ICourse, IUser } from "libs/interfaces/src";
import { UserRepository } from "./repository/user.repository";
import { RMQService } from "nestjs-rmq";
import { UserEntity } from "./entities/user.entity";
import { BuyCourseSaga } from "./sagas/buy-course.saga";
import { UserEventEmitter } from "./user.events-emitter";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly rmqService: RMQService,
    private readonly userEventEmitter: UserEventEmitter
  ) {}

  async changeProfile(user: Pick<IUser, 'displayName'>, id: string) {
    const existedUser = await this.userRepository.finUserById(id);

    if (!existedUser) {
      throw new Error(`user doesn't exist`);
    }

    const  userEntity = new UserEntity(existedUser).updateProfile(user.displayName);
    await this.updateUser(userEntity);
    const profile = userEntity.getPublicProfile();

    return profile;
  }

  async buyCourse(userId: string, courseId: string) {
    const userExist = await this.userRepository.finUserById(userId);
    if (!userExist) {
      throw new Error(`user doesn't exist`);
    }

    const userEntity = new UserEntity(userExist);
    const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);
    const {user, paymentLink} = await saga.getState().pay();
    await this.updateUser(user);
    return {
      paymentLink
    }
  }

  async checkPayment(userId: string, courseId: string) {
    const userExist = await this.userRepository.finUserById(userId);
    if (!userExist) {
      throw new Error(`user doesn't exist`);
    }

    const userEntity = new UserEntity(userExist);
    const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);
    const {user, status} = await  saga.getState().checkPayment();
    await this.updateUser(user);

    return { status };
  }

  private updateUser(user: UserEntity) {
    return Promise.all([
      this.userRepository.updateUserProfile(user),
      this.userEventEmitter.handle(user),
    ])
  }
}
