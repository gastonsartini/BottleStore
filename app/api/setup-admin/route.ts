import { createAuthenticatedClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = await createAuthenticatedClient();

  try {
    console.log('🔧 Starting admin setup process...');
    
    const { data: existingAdmin } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', 'admin@bottlestore.com')
      .maybeSingle();

    console.log('🔍 Existing admin check:', existingAdmin);

    if (existingAdmin) {
      console.log('⚠️ Admin user already exists');
      return NextResponse.json(
        { error: 'El usuario administrador ya existe. Puedes iniciar sesión con admin@bottlestore.com' },
        { status: 400 }
      );
    }

    console.log('🔧 Creating new admin user...');
    const { data, error } = await supabase.auth.signUp({
      email: 'admin@bottlestore.com',
      password: 'Cochabamba321',
    });

    console.log('🔍 Auth signup result:', { data: data?.user?.id, error });

    if (error) {
      console.error('❌ Auth signup error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (data.user) {
      console.log('🔧 Inserting admin user record...');
      const { error: insertError } = await supabase
        .from('admin_users')
        .insert({
          id: data.user.id,
          email: 'admin@bottlestore.com',
          role: 'admin',
        });

      console.log('🔍 Admin insert result:', { insertError });

      if (insertError) {
        console.error('❌ Admin insert error:', insertError);
        return NextResponse.json({ error: insertError.message }, { status: 400 });
      }

      console.log('✅ Admin user created successfully');
      return NextResponse.json({
        success: true,
        message: 'Admin user created successfully',
        email: 'admin@bottlestore.com',
        userId: data.user.id,
      });
    }

    return NextResponse.json({ error: 'Failed to create user' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
