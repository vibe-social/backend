import {
  Resolver,
  Query,
  Mutation,
  Args,
  ObjectType,
  Field,
  ID,
} from '@nestjs/graphql';
import { StripeService } from './stripe.service';
import { SupabaseService } from './supabase.service';

@Resolver()
export class GraphQLResolver {
  constructor(
    private readonly stripeService: StripeService,
    private readonly supabaseService: SupabaseService,
  ) {}

  @Mutation(() => String)
  async updateMood(
    @Args('userId') userId: string,
    @Args('latitude') latitude: number,
    @Args('longitude') longitude: number,
    @Args('mood') mood: string,
  ) {
    await this.supabaseService.postUpdate(userId, latitude, longitude, mood);
    return 'success';
  }

  @Query(() => UserData)
  async getUserData(@Args('userId') userId: string) {
    return await this.supabaseService.getUserData(userId);
  }

  @Query(() => GeocodeData)
  async getGeocodeLocation(@Args('ip_address') ip_address: string) {
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

  @Query(() => [UserData])
  async getAllUserData() {
    return await this.supabaseService.getAllUsersData();
  }

  @Mutation(() => CheckoutSession)
  async createCheckoutSession(@Args('userId') userId: string) {
    const clientId = await this.supabaseService.getClientId(userId);
    const session = await this.stripeService.createCheckoutSession(clientId);
    return { url: session.url };
  }

  @Query(() => String)
  async healthCheck() {
    return 'success';
  }
}

// You will need to define the GraphQL types (UserData, GeocodeData, CheckoutSession) used in these resolvers.

@ObjectType()
class UserData {
  @Field(() => ID)
  user_id: string;
  @Field()
  latitude: number;
  @Field()
  longitude: number;
  @Field()
  mood: string;
  @Field()
  description: string;
  @Field()
  timestamp: string;
}

@ObjectType()
class GeocodeData {
  @Field()
  latitude: number;
  @Field()
  longitude: number;
}

@ObjectType()
class CheckoutSession {
  @Field()
  url: string;
}
