import { supabase } from "../lib/supabase";

const createTestUsers = async () => {
  try {
    const testUsers = [
      {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
        role: "user",
      },
      {
        email: "admin@example.com",
        password: "admin123",
        name: "Admin User",
        role: "admin",
      },
      {
        email: "user@example.com",
        password: "user123",
        name: "Regular User",
        role: "user",
      },
    ];

    for (const user of testUsers) {
      // Check if auth user exists
      const { data: authUser, error: authError } = await supabase.auth
        .signInWithPassword({
          email: user.email,
          password: user.password,
        })
        .catch(() => ({ data: null, error: null }));

      if (!authUser) {
        // Create auth user
        const { data: newUser, error: signUpError } =
          await supabase.auth.signUp({
            email: user.email,
            password: user.password,
          });

        if (signUpError) {
          console.log(`Auth error for ${user.email}:`, signUpError.message);
          continue;
        }

        // Wait a bit for auth to propagate
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Get the user ID from the new auth user
        const userId = newUser.user?.id;

        if (userId) {
          // Create profile in database
          await createUserProfile(userId, user);
        }
      } else {
        // User exists in auth, check if profile exists
        await createUserProfile(authUser.user.id, user);
      }
    }

    console.log("✅ Test users and profiles created");
  } catch (error) {
    console.log("Test users setup error:", error.message);
  }
};

// Helper function to create profile
const createUserProfile = async (userId, userData) => {
  try {
    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();

    if (!existingProfile) {
      // Create profile
      const { error } = await supabase.from("profiles").insert({
        id: userId,
        email: userData.email,
        full_name: userData.name,
        role: userData.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.log(
          `Profile creation error for ${userData.email}:`,
          error.message,
        );
      } else {
        console.log(`✅ Profile created for ${userData.email}`);
      }
    }
  } catch (error) {
    console.log(`Profile check error for ${userData.email}:`, error.message);
  }
};
createTestUsers();
