-- Update the handle_new_user function to include the new admin email
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Set search path to empty to prevent search path injection
  SET search_path = '';
  
  INSERT INTO public.user_profiles (
    id, 
    display_name, 
    email, 
    role
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    -- Set admin role for specific emails, otherwise default to user
    CASE 
      WHEN NEW.email IN ('mike@homefitrecovery.com', 'homefitrecovery@gmail.com', 'admin@admin.com', 'mike@mikemacri.com') THEN 'admin'::public.user_role
      ELSE 'user'::public.user_role
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    email = NEW.email,
    role = CASE 
      WHEN NEW.email IN ('mike@homefitrecovery.com', 'homefitrecovery@gmail.com', 'admin@admin.com', 'mike@mikemacri.com') THEN 'admin'::public.user_role
      ELSE EXCLUDED.role
    END,
    updated_at = now();
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to create user profile for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$function$;

-- Insert the admin user directly into auth.users
-- Note: In production, users should sign up normally through the UI
-- This is a one-time setup for the admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'mike@mikemacri.com',
  crypt('#2Pencil!!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;