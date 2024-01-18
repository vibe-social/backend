import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { StripeService } from './stripe.service';

@Controller('backend/rest/')
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

  @Get('/user/:ip_address/geocode')
  async getGeocodeLocation(@Param('ip_address') ip_address: string) {
    const data = await fetch(
      'http://vibe-social.westeurope.cloudapp.azure.com/location-discovery/geocode',
      {
        method: 'POST',
        body: JSON.stringify({
          ip_address: ip_address,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).then((res) => res.json());

    return data;
  }

  @Get('/users/data')
  async getAllUserData() {
    const data = await this.supabaseService.getAllUsersData();
    return data;
  }

  @Post('/user/:userId/purchase')
  async createCheckoutSession(@Param('userId') userId: string) {
    const clientId = await this.supabaseService.getClientId(userId);
    const session = await this.stripeService.createCheckoutSession(clientId);
    return { url: session.url };
  }

  @Get('/health')
  async healthCheck() {
    return { message: 'success' };
  }
}
