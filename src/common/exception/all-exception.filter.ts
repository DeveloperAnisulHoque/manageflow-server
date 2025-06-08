import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { EntityNotFoundError } from "typeorm";



@Catch()
export class AllExceptionFilter implements ExceptionFilter {
   private readonly Logger = new Logger(AllExceptionFilter.name)

   catch(exception: any, host: ArgumentsHost) {
      const ctx = host.switchToHttp()
      const request = ctx.getRequest()
      const response = ctx.getResponse()

      
      const{status,message:errorResponse}=this.getHttpStatusAndMessage(exception)
   
      const responsePayload = {
         statusCode: status,
         error: true,
         timestamp: new Date().toDateString(),
         path: request.url,
         method: request.method,
         message: typeof errorResponse == "object" ? errorResponse["message"] || errorResponse : errorResponse,
         //    stack:exception.stack
      }

      this.Logger.error(
         `${request.method} ${request.url}`,
         JSON.stringify(responsePayload),
         `AllExceptionFilter`
      )
      response.status(status).json(responsePayload)
   }

   getHttpStatusAndMessage(exception: any) {
 
      if (exception instanceof HttpException) {

         return { status: exception.getStatus(),message:exception.getResponse() }
      }
      else if (exception instanceof EntityNotFoundError) {
         return { status: HttpStatus.BAD_REQUEST,message:"Entity not found for the given id" }
      }
      else {
         return {
            status: HttpStatus.INTERNAL_SERVER_ERROR , message:"Internal server error"
         }
      }

   }

}
