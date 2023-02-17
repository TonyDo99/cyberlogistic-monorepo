import { Catch, ArgumentsHost, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
// import { Request, Response } from 'express';
import { Observable, throwError } from 'rxjs';

@Catch(RpcException)
export class RpcExceptionOne implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    return throwError(() => exception.getError());
  }
  // const ctx = host.switchToHttp();
  // const response = ctx.getResponse<Response>();
  // const request = ctx.getRequest<Request>();
  // const error: any = exception.getError();
  // return response.status(error.code).json({
  //   path: request.url,
  //   timestamp: new Date().toISOString(),
  //   description: error,
  // });
}
