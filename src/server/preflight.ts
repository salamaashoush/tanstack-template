/**
 * Nitro app plugin: runs once at server init, before the first request.
 *
 * The env schema validates lazily and the healthcheck route reads no config, so
 * without this a container started with a missing or malformed SESSION_SECRET
 * would boot, look healthy, and only fail once real traffic arrived. Reading the
 * required values at startup turns that into a refusal to start.
 *
 * The import is dynamic on purpose: `~/env` throws during module evaluation, and
 * a static import would throw before any handler here could turn it into a
 * legible message.
 */
export default async function preflight() {
  try {
    const { env } = await import("~/env");
    // Touching the properties is what triggers validation.
    void env.SESSION_SECRET;
    void env.API_URL;
  } catch (error) {
    console.error(
      "[preflight] Refusing to start: the environment is not valid.\n" +
        (error instanceof Error ? error.message : String(error)),
    );
    // Exit rather than rethrow: a thrown error is caught per-request by the
    // handler, which is the silent-500 behaviour this exists to remove.
    process.exit(1);
  }
}
