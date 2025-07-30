-- Update the handle_new_user function to include mike@mikemacri.com as admin
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