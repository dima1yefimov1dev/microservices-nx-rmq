import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { AccountUserCourses, AccountUserInfo } from 'libs/contracts/src'
import { UserRepository } from './repository/user.repository';

@Controller()
export class UserQueries {
  constructor(
    private readonly usersRepository: UserRepository
  ) {}

  @RMQValidate()
  @RMQRoute(AccountUserInfo.topic)
  async userInfo(@Body() { id }: AccountUserInfo.Request): Promise<AccountUserInfo.Response> {
    const user = await this.usersRepository.finUserById(id);
    return {
      user
    };
  }

  @RMQValidate()
  @RMQRoute(AccountUserCourses.topic)
  async userCourses(@Body() { id }: AccountUserCourses.Request): Promise<AccountUserCourses.Response> {
    const courses = (await this.usersRepository.finUserById(id)).courses;
    return {
      courses
    }
  }
}
