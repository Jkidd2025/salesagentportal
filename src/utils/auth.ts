import { supabase } from "@/integrations/supabase/client";

export async function createOrUpdateTestUser(email: string, password: string, isAdmin: boolean) {
  try {
    // First check if user exists
    const { data: existingUser } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (existingUser.user) {
      // User exists, just update their profile
      await supabase
        .from('profiles')
        .upsert({
          id: existingUser.user.id,
          full_name: isAdmin ? "Admin User" : "Regular User",
          is_admin: isAdmin,
          status: 'active'
        });
      
      return { user: existingUser.user, error: null };
    }

    // User doesn't exist, create new one
    const { data: newUser, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: isAdmin ? "Admin User" : "Regular User",
        }
      }
    });

    if (signUpError) {
      throw signUpError;
    }

    if (newUser.user) {
      // Update profile for new user
      await supabase
        .from('profiles')
        .upsert({
          id: newUser.user.id,
          full_name: isAdmin ? "Admin User" : "Regular User",
          is_admin: isAdmin,
          status: 'active'
        });
    }

    return { user: newUser.user, error: null };
  } catch (error: any) {
    console.error("Error in createOrUpdateTestUser:", error);
    return { user: null, error };
  }
}