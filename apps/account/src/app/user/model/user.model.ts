import { Document, Types } from "mongoose";
import {IUser, UserRole} from 'libs/interfaces/src'
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UserCourses, UserCoursesSchema } from "./user.courses.model";

@Schema()
export class User extends Document implements IUser {
  @Prop({required: true})
  displayName: string;

  @Prop({required: true})
  email: string;

  @Prop({required: true})
  passwordHash: string;

  @Prop({required: true, enum: UserRole, type: String, default: UserRole.Student})
  role: UserRole;

  @Prop({ type: [UserCoursesSchema], _id: false })
  courses: Types.Array<UserCourses>
}

export const UserSchema = SchemaFactory.createForClass(User);
