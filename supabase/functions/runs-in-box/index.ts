import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
serve(async (req) => {
  const url = new URL(req.url);

  const latMin = Number(url.searchParams.get("latMin"));
  const latMax = Number(url.searchParams.get("latMax"));
  const lngMin = Number(url.searchParams.get("lngMin"));
  const lngMax = Number(url.searchParams.get("lngMax"));

  if ([latMin, latMax, lngMin, lngMax].some(isNaN)) {
    return new Response("Invalid query", { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!
  );

  const { data, error } = await supabase
    .from("runs")
    .select("*")
    .gte("lat", latMin)
    .lte("lat", latMax)
    .gte("lng", lngMin)
    .lte("lng", lngMax)
    .limit(500);

  if (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
});
