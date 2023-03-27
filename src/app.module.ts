import configuration, { MongoDbConfig } from '@app/app.config';
import { AuthModule } from '@app/auth/auth.module';
import { JwtGuard } from '@app/auth/guards/jwt.guard';
import { RolesGuard } from '@app/auth/guards/roles.guard';
import { GlobalExceptionsFilter } from '@app/global-exceptions.filters';
import { AppLoggerMiddleware } from '@app/middleware/app-logger.middleware';
import { UsersModule } from '@app/users/users.module';
import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import {
  MiddlewareConsumer,
  Module,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ExercisesModule } from './exercises/exercises.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const mongoDbConfig = configService.get<MongoDbConfig>('mongodb');
        return {
          uri: mongoDbConfig.uri,
          user: mongoDbConfig.username,
          pass: mongoDbConfig.password,
          dbName: mongoDbConfig.dbName,
          appName: 'fitness-api',
          retryWrites: true,
          authSource: 'admin',
        };
      },
    }),
    AuthModule,
    UsersModule,
    ExercisesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    { provide: APP_GUARD, useClass: RolesGuard },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        exceptionFactory: (errors) => {
          const formattedErrors = formatErrors(errors);
          return new UnprocessableEntityException(formattedErrors);
        },
      }),
    },
    {
      provide: APP_FILTER,
      useValue: new GlobalExceptionsFilter(),
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}

const formatErrors = (errors: ValidationError[], parentName = '') => {
  const formattedErrors = [];

  for (const error of errors) {
    if (Array.isArray(error.value) && !error.constraints) {
      formattedErrors.push(formatErrors(error.children, error.property));
    } else if (Array.isArray(error.children) && error.children.length) {
      const ob = { name: `${parentName}.${error.property}`, errors: [] };
      ob.errors = formatErrors(error.children);
      formattedErrors.push(ob);
    } else {
      const err = {};
      err[error.property] = Object.keys(error.constraints).map(
        (p) => error.constraints[p],
      );
      formattedErrors.push(err);
    }
  }

  return formattedErrors.flat();
};
