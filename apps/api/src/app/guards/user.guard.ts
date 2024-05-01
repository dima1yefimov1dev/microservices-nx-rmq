import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const userId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest()?.user;
})
