import { InjectModel } from "@nestjs/mongoose";
import { User } from "../model/user.model";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { UserEntity } from "../entities/user.entity";

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  async createUser(user: UserEntity) {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async finUserById(id: string) {
    return await this.userModel.findById(id);
  }

  async findUserByEmail(email:string) {
    return this.userModel.findOne({ email });
  }

  async deleteUser(email:string) {
    return this.userModel.deleteOne({ email });
  }

  async updateUserProfile(userData: UserEntity) {
    const { _id, ...rest } = userData;
    if (!_id) {
        throw new Error("User ID (_id) is required for updating profile.");
    }
    return this.userModel.updateOne({ _id }, { $set: { ...rest } });
  }
}
