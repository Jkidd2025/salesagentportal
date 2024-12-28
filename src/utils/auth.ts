import { supabase } from "@/integrations/supabase/client";

export async function createOrUpdateTestUser(email: string, password: string, isAdmin: boolean) {
  try {
    // First try to sign in
    console.log("Attempting to sign in test user:", email);
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!signInError && signInData?.user) {
      console.log("Test user exists, updating profile:", email);
      
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: signInData.user.id,
          full_name: isAdmin ? "Admin User" : "Regular User",
          is_admin: isAdmin,
          status: 'active'
        }, {
          onConflict: 'id'
        });

      if (profileError) {
        console.error("Error updating profile:", profileError);
        throw profileError;
      }

      return { user: signInData.user, error: null };
    }

    // If sign in failed, create new user
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

    // Wait for the trigger to create the profile
    await new Promise(resolve => setTimeout(resolve, 2000));

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

    // Update the profile with admin status
    const { error: profileUpdateError } = await supabase
      .from('profiles')
      .update({ 
        is_admin: isAdmin,
        status: 'active',
        full_name: isAdmin ? "Admin User" : "Regular User"
      })
      .eq('id', newSignInData.user.id);

    if (profileUpdateError) {
      console.error("Error updating profile:", profileUpdateError);
      throw profileUpdateError;
    }

    // Wait for profile update to complete
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { user: newSignInData.user, error: null };
  } catch (error: any) {
    console.error("Error in createOrUpdateTestUser:", error);
    return { user: null, error };
  }
}