import { supabase } from "@/integrations/supabase/client";

export async function createOrUpdateTestUser(email: string, password: string, isAdmin: boolean) {
  try {
    // First try to sign in
    console.log("Attempting to sign in test user:", email);
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // If sign in successful, just update profile
    if (signInData?.user) {
      console.log("Test user exists, updating profile:", email);
      
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: signInData.user.id,
          full_name: isAdmin ? "Admin User" : "Regular User",
          is_admin: isAdmin,
          status: 'active'
        });

      if (profileError) {
        console.error("Error updating profile:", profileError);
        throw profileError;
      }

      return { user: signInData.user, error: null };
    }

    // If sign in failed, try to create the user
    if (signInError) {
      console.log("Creating new test user:", email);
      
      // First create the auth user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: isAdmin ? "Admin User" : "Regular User",
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (signUpError) {
        console.error("Error creating user:", signUpError);
        throw signUpError;
      }

      if (!signUpData.user) {
        throw new Error("No user returned after signup");
      }

      // Wait a moment for the trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Try signing in with the new credentials
      console.log("Signing in with new credentials:", email);
      const { data: newSignInData, error: newSignInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (newSignInError) {
        console.error("Error signing in after creation:", newSignInError);
        throw newSignInError;
      }

      return { user: newSignInData.user, error: null };
    }

    throw new Error("Unexpected flow in createOrUpdateTestUser");
  } catch (error: any) {
    console.error("Error in createOrUpdateTestUser:", error);
    return { user: null, error };
  }
}