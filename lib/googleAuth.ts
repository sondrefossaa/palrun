import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";
import { supabase } from "./supabase";

WebBrowser.maybeCompleteAuthSession();

type GoogleAuthResult = {
  error: Error | null;
  url?: string | null;
};

/**
 * Start Google auth with Supabase using expo-auth-session redirect handling.
 * Configure Supabase OAuth redirect URLs to include:
 * - Jog://
 * - https://auth.expo.io/@your-username/your-app-slug
 */
export async function performGoogleSignIn(): Promise<GoogleAuthResult> {
  const redirectUrl = makeRedirectUri({
    scheme: "Jog",
  });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectUrl,
      skipBrowserRedirect: true,
    },
  });

  if (error) {
    return { error };
  }

  if (!data?.url) {
    return { error: new Error("Failed to start Google sign-in") };
  }

  const browserResult = await WebBrowser.openAuthSessionAsync(
    data.url,
    redirectUrl,
  );

  if (browserResult.type !== "success" || !browserResult.url) {
    return { error: new Error("Google sign-in was canceled") };
  }

  const params = new URL(browserResult.url.replace("#", "?")).searchParams;
  const authCode = params.get("code");
  const authError =
    params.get("error_description") ?? params.get("error") ?? undefined;

  if (authError) {
    return { error: new Error(authError) };
  }

  if (!authCode) {
    return { error: new Error("No auth code returned from Google") };
  }

  const { error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(authCode);

  return {
    error: exchangeError ?? null,
    url: browserResult.url,
  };
}
