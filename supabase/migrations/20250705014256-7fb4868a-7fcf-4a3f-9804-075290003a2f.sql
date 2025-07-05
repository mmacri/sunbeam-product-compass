-- Create or update the trigger function for handling new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
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
      WHEN NEW.email IN ('mike@homefitrecovery.com', 'homefitrecovery@gmail.com', 'admin@admin.com') THEN 'admin'::user_role
      ELSE 'user'::user_role
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    email = NEW.email,
    role = CASE 
      WHEN NEW.email IN ('mike@homefitrecovery.com', 'homefitrecovery@gmail.com', 'admin@admin.com') THEN 'admin'::user_role
      ELSE EXCLUDED.role
    END,
    updated_at = now();
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to create user profile for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();