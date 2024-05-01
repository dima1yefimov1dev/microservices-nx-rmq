import { IDomainEvent, IUser, IUserCourses, PurchaseState, UserRole } from "libs/interfaces/src";
import { compare, genSalt, hash } from "bcryptjs";
import { AccountChangeCourse } from "@purple/contracts";

export class UserEntity implements IUser {
  _id?: string;
  displayName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  courses?: IUserCourses[];
  events: IDomainEvent[] = [];


  constructor(user: IUser) {
    this._id = user._id;
    this.displayName = user.displayName;
    this.passwordHash = user.passwordHash;
    this.email = user.email;
    this.role = user.role;
    this.courses = user.courses;
  }

  public async setPassword(password: string) {
    const salt = await genSalt(10);
    this.passwordHash = await hash(password, salt);

    return this;
  }

  public async validatePassword(password: string) {
    return compare(password, this.passwordHash);
  }

  public updateProfile(displayName: string) {
    this.displayName = displayName;
    return this;
  }

  public getPublicProfile() {
    return {
      email: this.email,
      displayName: this.displayName,
      role: this.role
    }
  }

  public setCourseStatus(courseId: string, state: PurchaseState) {
    const exists = this.courses.find(course => course._id === courseId)
    if (!exists) {
      this.courses.push({
        courseId,
        purchaseState: state
      });

      return this;
    }

    if (state === PurchaseState.Canceled) {
      this.courses = this.courses.filter(course => course._id !== courseId );

      return this;
    }

    this.courses = this.courses.map(course => {
      if (course._id === courseId) {
        course.purchaseState = state
        return course;
      }

      return course;
    })
    this.events.push({
      topic: AccountChangeCourse.topic,
      data: {
        courseId,
        userId: this._id,
        state
      },
    })
    return this;
  }
}
