import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  // getRequest(context: ExecutionContext) {
  //   const ctx = GqlExecutionContext.create(context);
  //   return ctx.getContext().req;
  // }

  getRequest(context: ExecutionContext) {
    console.log('ctx');
    // const ctx = GqlExecutionContext.create(context);
    // return ctx.getContext().req;
  }

  canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  logIn(req: any) {
    console.log('login');
    return null;
  }

  handleRequest() {
    return null;
  }
}
