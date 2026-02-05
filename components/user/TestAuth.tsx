import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { supabase } from "@/lib/supabase";

export default function () {
  GoogleSignin.configure({
    webClientId:
      "268276151273-rmbvs8baldua94l1hc4sffs9cqnciik8.apps.googleusercontent.com",
  });

  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={async () => {
        // await GoogleSignin.signOut();
        try {
          await GoogleSignin.hasPlayServices();
          const response = await GoogleSignin.signIn({
            loginHint: "",
          });
          console.log("Google response:", response); // Add this to see what you get

          if (response.type === "success") {
            // Changed this
            const { data, error } = await supabase.auth.signInWithIdToken({
              provider: "google",
              token: response.data.idToken,
            });
            console.log("Supabase error:", error);
            console.log("Supabase data:", data);
          }
        } catch (error: any) {
          if (error.code === statusCodes.IN_PROGRESS) {
            // operation (e.g. sign in) is in progress already
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // play services not available or outdated
          } else {
            // some other error happened
          }
        }
      }}
    />
  );
}
