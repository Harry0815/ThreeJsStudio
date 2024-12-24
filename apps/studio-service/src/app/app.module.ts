import type { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

/**
 * Represents the root module of the application in a NestJS framework.
 * The AppModule is decorated with the `@Module` decorator, which provides metadata
 * about the module. It defines controllers, providers, and imports used throughout the application.
 *
 * The `AppModule` also implements the `NestModule` interface to configure middleware
 * for the application.
 *
 * Configuration of middleware is handled within the `configure` method, allowing
 * middleware to be applied to specific routes or globally to all routes.
 */
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  /**
   * Configures middleware for the application.
   * @param consumer The middleware consumer to configure middleware for the application.
   */
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply().forRoutes('*');
    return;
  }
}
