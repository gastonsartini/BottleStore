import { createAuthenticatedClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = await createAuthenticatedClient();

  try {
    const { data: existingAdmin } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', 'admin@bottlestore.com')
      .maybeSingle();

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin user already exists' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.auth.signUp({
      email: 'admin@bottlestore.com',
      password: 'Cochabamba321',
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (data.user) {
      const { error: insertError } = await supabase
        .from('admin_users')
        .insert({
          id: data.user.id,
          email: 'admin@bottlestore.com',
          role: 'admin',
        });

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: 'Admin user created successfully',
        email: 'admin@bottlestore.com',
      });
    }

    return NextResponse.json({ error: 'Failed to create user' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
