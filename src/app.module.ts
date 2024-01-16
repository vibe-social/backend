import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { StripeService } from './stripe.service';
import { SupabaseService } from './supabase.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [StripeService, SupabaseService],
})
export class AppModule {}
