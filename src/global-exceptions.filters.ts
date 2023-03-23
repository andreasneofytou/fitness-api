import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionsFilter.name);

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const respObj = this.getResponseMessage(exception, request);
    response.status(respObj.statusCode).json(respObj);
  }

  getResponseMessage = (exception: Error, request: any) => {
    const { name: errorType, message: errorMessage } = exception;

    this.logger.error(
      JSON.stringify({
        error: exception.name,
        exception: exception.message,
        stack: exception.stack,
      }),
    );

    if (exception instanceof HttpException) {
      const res: any = exception.getResponse();
      return {
        statusCode: res.statusCode ?? 500,
        path: request.url ?? 'unknown',
        errorType: res.error || errorType,
        errorMessage: res.message,
      };
    }

    switch (exception.constructor.name) {
      case 'MongoServerError':
        if (exception['code'] === 11000) {
          return {
            statusCode: 400,
            path: request.url ?? 'unknown',
            errorType: 'DuplicatedEntryError',
            errorMessage: `Duplicated entry: ${JSON.stringify(
              exception['keyValue'],
            )}`,
          };
        }

      case 'AxiosError':
        const { data } = exception['response'] ?? {};
        return {
          ...data,
          path: request['originalUrl'] ?? 'unknown',
        };

      default:
        return {
          statusCode:
            exception['statusCode'] ?? HttpStatus.INTERNAL_SERVER_ERROR,
          path: request.url ?? 'unknown',
          errorType,
          errorMessage,
        };
    }
  };
}
