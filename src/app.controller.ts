import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { StripeService } from './stripe.service';

@Controller()
export class AppController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly supabaseService: SupabaseService,
  ) {}

  @Post('/user/:userId/update')
  async updateMood(
    @Param('userId') userId: string,
    @Body() data: { latitude: number; longitude: number; mood: string },
  ) {
    await this.supabaseService.postUpdate(
      userId,
      data.latitude,
      data.longitude,
      data.mood,
    );
    return { message: 'success' };
  }

  @Get('/user/:userId/data')
  async getUserData(@Param('userId') userId: string) {
    const data = await this.supabaseService.getUserData(userId);
    return data;
  }

  @Get('/users/data')
  async getAllUserData() {
    const data = await this.supabaseService.getAllUsersData();
    return data;
  }

  @Post('/user/:userId/purchase')
  async createCheckoutSession(@Param('userId') userId: string) {
    const session = await this.stripeService.createCheckoutSession(userId);
    return { url: session.url };
  }

  @Get('/health')
  async healthCheck() {
    return { message: 'success' };
  }
}
