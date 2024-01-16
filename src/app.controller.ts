import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { StripeService } from './stripe.service';

@Controller()
export class AppController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly supabaseService: SupabaseService,
  ) {}

  @Post('/backend/user/:userId/update')
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

  @Get('/backend/user/:userId/data')
  async getUserData(@Param('userId') userId: string) {
    const data = await this.supabaseService.getUserData(userId);
    return data;
  }

  @Get('/backend/users/data')
  async getAllUserData() {
    const data = await this.supabaseService.getAllUsersData();
    return data;
  }

  @Post('/backend/user/:userId/purchase')
  async createCheckoutSession(@Param('userId') userId: string) {
    const clientId = await this.supabaseService.getClientId(userId);
    console.log(clientId);
    const session = await this.stripeService.createCheckoutSession(clientId);
    return { url: session.url };
  }

  @Get('/backend/health')
  async healthCheck() {
    return { message: 'success' };
  }
}
