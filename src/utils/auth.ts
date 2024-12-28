import { supabase } from "@/integrations/supabase/client";

export async function createOrUpdateTestUser(email: string, password: string, isAdmin: boolean) {
  try {
    // First try to sign in
    console.log("Attempting to sign in test user:", email);
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // If sign in successful, return the user
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

    // If sign in failed due to invalid credentials, create the user
    if (signInError?.message.includes("Invalid login credentials")) {
      console.log("Creating new test user:", email);
      
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: isAdmin ? "Admin User" : "Regular User",
          }
        }
      });

      if (signUpError) {
        console.error("Error creating user:", signUpError);
        throw signUpError;
      }

      if (!signUpData.user) {
        throw new Error("No user returned after signup");
      }

      // Try signing in with the new credentials immediately
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

    // If sign in failed for other reasons, throw the error
    throw signInError;
  } catch (error: any) {
    console.error("Error in createOrUpdateTestUser:", error);
    return { user: null, error };
  }
}