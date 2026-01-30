import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Auth from "@/components/Auth";
import Account from "@/components/Account";
import { View, StyleSheet } from "react-native";
import Avatar from "@/components/Avatar";
import { Session } from "@supabase/supabase-js";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const updateProfile = async (data: {
    username: string;
    website: string;
    avatar_url: string;
  }) => {
    const { error } = await supabase.auth.updateUser({
      data,
    });
    if (error) throw error;
  };

  return (
    <View style={styles.container}>
      <Avatar
        size={200}
        url={avatarUrl}
        onUpload={(url: string) => {
          setAvatarUrl(url);
          updateProfile({ username, website, avatar_url: url });
        }}
      />
      {session && session.user ? (
        <Account key={session.user.id} session={session} />
      ) : (
        <Auth />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // This makes it fill the screen
  },
});
