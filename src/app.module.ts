import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { StripeService } from './stripe.service';
import { SupabaseService } from './supabase.service';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot({
  envFilePath: '.env.local',
});

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [StripeService, SupabaseService],
})
export class AppModule {}
