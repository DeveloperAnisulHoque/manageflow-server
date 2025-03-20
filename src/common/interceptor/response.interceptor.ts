import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { map, Observable, tap } from "rxjs";

interface ApiResponse<T>{
    statusCode:any,
    message:string;
    data?:T
}


@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor{
    private readonly logger=new Logger(ResponseInterceptor.name)
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<ApiResponse<T>> {
     const request=context.switchToHttp().getRequest()
      const response=context.switchToHttp().getResponse()
     const {method,url}=request
         this.logger.debug(`Incoming request : ${method} ${url}`)

         return next.handle().pipe(map((data:any)=>{
                let message="Success"
                if(data.message){
                    message=data.message
                    delete data.message
                }
                return{
                    statusCode:response.statusCode,
                    message,
                    data
                }
         }),
        tap(({statusCode})=>{
            this.logger.log(`OutGoing response ${method} ${url} - Status:${statusCode}`)
        })
        )
    }
}