import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "@/keystatic.config";

const handler = makeRouteHandler({
  config,
  clientId: process.env.KEYSTATIC_GITHUB_CLIENT_ID,
  clientSecret: process.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
  secret: process.env.KEYSTATIC_SECRET,
  localBaseDirectory: process.cwd(),
});

export async function GET(req: Request) {
  console.log("[keystatic] env check — secret:", !!process.env.KEYSTATIC_SECRET, "clientId:", !!process.env.KEYSTATIC_GITHUB_CLIENT_ID, "clientSecret:", !!process.env.KEYSTATIC_GITHUB_CLIENT_SECRET);
  try {
    return await handler.GET(req);
  } catch (err) {
    console.error("[keystatic] GET error:", err);
    throw err;
  }
}

export async function POST(req: Request) {
  try {
    return await handler.POST(req);
  } catch (err) {
    console.error("[keystatic] POST error:", err);
    throw err;
  }
}
