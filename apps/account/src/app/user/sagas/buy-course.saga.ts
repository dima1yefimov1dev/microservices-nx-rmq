import { RMQService } from "nestjs-rmq";
import { UserEntity } from "../entities/user.entity";
import { PurchaseState } from "libs/interfaces/src";
import { BuyCourseSagaState } from "./buy-course.state";
import { BuyCourseSagaStateCanceled, BuyCourseSagaStateProgress, BuyCourseSagaStatePurchased, BuyCourseSagaStateStarted } from "./buy-course.steps";

export class BuyCourseSaga {
  private state: BuyCourseSagaState;

  constructor(
    public user: UserEntity,
    public courseId: string,
    public rmqService: RMQService,
  ) {

  }

  setState(state: PurchaseState, courseId: string) {
    switch(state) {
      case PurchaseState.Started:
        this.state = new BuyCourseSagaStateStarted();
        break;
      case PurchaseState.WaitingForPayment:
        this.state = new BuyCourseSagaStateProgress()
        break;
      case PurchaseState.Purchased:
        this.state = new BuyCourseSagaStatePurchased();
        break;
      case PurchaseState.Canceled:
        this.state = new BuyCourseSagaStateCanceled()
        break;
    }
    this.state.setContext(this);
    this.user.setCourseStatus(courseId, state)
  }

  getState() {
    return this.state;
  }
}
