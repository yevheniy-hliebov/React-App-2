import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";
import { BaseExceptionFilter } from "@nestjs/core";

@Catch(HttpException, Error)
export class HttpExceptionFilter extends BaseExceptionFilter {
  catch(exception: Error | HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const { status, message } = this.getExceptionDetails(exception);

    const exceptionResponse: any = {
      success: false,
      error: {
        statusCode: status,
        path: request.url,
        method: request.method,
        timestamp: new Date().toISOString(),
        message: message
      }
    }

    // Added validation error field from handling class-validator
    if (exception instanceof BadRequestException) {
      exceptionResponse.error.errors = Object.values(exception.getResponse())
    }
        
    response.status(status).json(exceptionResponse);
  }
  
  private getExceptionDetails(exception: Error | HttpException) {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    return { status, message };
  }
}