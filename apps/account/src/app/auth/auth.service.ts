import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user/repository/user.repository';
import { error } from 'console';
import { UserEntity } from '../user/entities/user.entity';
import { UserRole } from 'libs/interfaces/src/'
import { JwtService } from '@nestjs/jwt';
import { AccountRegister} from 'libs/contracts/src/index';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async registration({email, password, displayName}: AccountRegister.Request) {
    const user = await this.userRepository.findUserByEmail(email);

    if (user) {
      throw new error(`user with this email already registered`);
    }

    const newUserEntity = await new UserEntity({
      displayName,
      email,
      passwordHash: '',
      role: UserRole.Student
    }).setPassword(password);

    const newUser = await this.userRepository.createUser(newUserEntity);

    return {email: newUser.email};
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      throw new error(`password or login is not correct`);
    }

    const userEntity = new UserEntity(user);
    const checkIsPasswordCorrect = await userEntity.validatePassword(password);

    if (!checkIsPasswordCorrect) {
      throw new error(`password or login is not correct`);
    }

    return {id: user._id};
  }

  async login(id: string) {
    return {
      access_token: await this.jwtService.signAsync({id})
    }
  }
}
