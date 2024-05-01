import { CourseGetCourse, PaymentCheck, PaymentGenerateLink, PaymentStatus } from "@purple/contracts";
import { UserEntity } from "../entities/user.entity";
import { BuyCourseSagaState } from "./buy-course.state";
import { PurchaseState } from "libs/interfaces/src";

export class BuyCourseSagaStateStarted extends BuyCourseSagaState{
  public async pay(): Promise<{ paymentLink: string; user: UserEntity; }> {
    const { course } = await this.saga.rmqService.send<CourseGetCourse.Request, CourseGetCourse.Response>(CourseGetCourse.topic, {
      id: this.saga.courseId
    });

    if (!course) {
      throw new Error(`course doesn't exist`);
    }

    if (course.price === 0) {
      this.saga.setState(PurchaseState.Purchased, course._id);
      return { paymentLink: null, user: this.saga.user};
    }

    const {paymentLink} = await this.saga.rmqService.send<PaymentGenerateLink.Request, PaymentGenerateLink.Response>(PaymentGenerateLink.topic, {
      courseId: course._id,
      userId: this.saga.user._id,
      sum: course.price,
    })

    this.saga.setState(PurchaseState.WaitingForPayment, course._id);
    return {paymentLink, user: this.saga.user};
  }
  public checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {
    throw new Error("can`t check payment");
  }
  public async cancel(): Promise<{ user: UserEntity; }> {
    this.saga.setState(PurchaseState.Canceled, this.saga.courseId);
    return {user: this.saga.user}
  }

}

export class BuyCourseSagaStateProgress extends BuyCourseSagaState {
  public pay(): Promise<{ paymentLink: string; user: UserEntity; }> {
    throw new Error("Can`t generate link for payment in progress");
  }

  public async checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {
    const {status } = await this.saga.rmqService.send<PaymentCheck.Request, PaymentCheck.Response>(PaymentCheck.topic, {
      courseId: this.saga.courseId,
      userId: this.saga.user._id,
    })

    if (status === 'canceled') {
      this.saga.setState(PurchaseState.Canceled, this.saga.courseId);
      return {user: this.saga.user, status: 'canceled'};
    }

    if (status !== "success") {
      return {user: this.saga.user, status: 'success'};
    }

    this.saga.setState(PurchaseState.Purchased, this.saga.courseId)
    return {user: this.saga.user, status: 'progress'};
  }

  public cancel(): Promise<{ user: UserEntity; }> {
    throw new Error("Cannot stop payment in progress");
  }
}

export class BuyCourseSagaStatePurchased extends BuyCourseSagaState{
  public pay(): Promise<{ paymentLink: string; user: UserEntity; }> {
    throw new Error("Course already purchased.");
  }
  public checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {
    throw new Error("Course already purchased");
  }
  public cancel(): Promise<{ user: UserEntity; }> {
    throw new Error("Course is already purchased");
  }
}

export class BuyCourseSagaStateCanceled extends BuyCourseSagaState{
  public pay(): Promise<{ paymentLink: string; user: UserEntity; }> {
    this.saga.setState(PurchaseState.Started, this.saga.courseId);
    return this.saga.getState().pay();
  }
  public checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {
    throw new Error("Cannot check canceled payment");
  }
  public cancel(): Promise<{ user: UserEntity; }> {
    throw new Error("Course is already canceled");
  }
}
