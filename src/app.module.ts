import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { StripeService } from './stripe.service';
import { SupabaseService } from './supabase.service';
import { ConfigModule } from '@nestjs/config';
import { GraphQLResolver } from './app.resolver';

ConfigModule.forRoot({
  envFilePath: '.env.local',
});

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      path: '/backend/graphql',
    }),
  ],
  controllers: [AppController],
  providers: [StripeService, SupabaseService, GraphQLResolver],
})
export class AppModule {}
