import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

export class SupabaseService {
  private supabase;
  private stripe;

  constructor() {
    const supabaseUrl = 'https://infrvzrylskidrzrpubu.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
    this.supabase = createClient(supabaseUrl, supabaseKey);

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    this.stripe = new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' });
  }

  async postUpdate(
    userId: string,
    latitude: number,
    longitude: number,
    mood: string,
  ): Promise<void> {
    const { error } = await this.supabase.from('updates').insert([
      {
        user_id: userId,
        latitude: latitude,
        longitude: longitude,
        mood: mood,
        timestamp: new Date().toISOString(),
      },
    ]);

    if (error) {
      throw new Error(error.message);
    }
  }

  async getUserData(userId: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('updates')
      .select('user_id, latitude, longitude, mood, description, timestamp')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const {
      data: { user },
    } = await this.supabase.auth.admin.getUserById(userId);

    return {
      user_id: data.user_id,
      latitude: data.latitude,
      longitude: data.longitude,
      mood: data.mood,
      description: data.description,
      ts: data.timestamp,
      user: {
        id: userId,
        email: user.email,
      },
    };
  }

  async getAllUsersData(): Promise<any> {
    const {
      data: { users },
      error1,
    } = await this.supabase.auth.admin.listUsers();
    if (error1) {
      throw new Error(error1.message);
    }

    const { data, error2 } = await this.supabase.rpc('get_all_data');

    if (error2) {
      throw new Error(error2.message);
    }

    return data.map((row) => ({
      ...row,
      user: users
        .map((u) => ({ id: u.id, email: u.email }))
        .find((u) => u.id === row.user_id),
    }));
  }

  async getClientId(userId: string): Promise<string> {
    const { data, error } = await this.supabase
      .from('clients')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .limit(1);

    if (error) {
      throw new Error(error.message);
    }

    if (data.length === 0) {
      const {
        data: { user },
      } = await this.supabase.auth.admin.getUserById(userId);
      const customer = await this.createCustomer(user.email);
      await this.supabase.from('clients').insert([
        {
          user_id: userId,
          stripe_customer_id: customer.id,
        },
      ]);

      return customer.id;
    }

    return data.stripe_customer_id;
  }

  async createCustomer(email: string): Promise<Stripe.Customer> {
    const customer = await this.stripe.customers.create({
      email: email,
    });

    return customer;
  }
}
