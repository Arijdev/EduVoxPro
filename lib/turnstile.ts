export type TurnstileVerifyOptions = {
  token: string | null | undefined;
  ip?: string;
  expectedAction: string;
  expectedHostnames?: string[];
};

type TurnstileSiteverifyResponse = {
  success?: boolean;
  action?: string;
  hostname?: string;
  "error-codes"?: string[];
};

function getAllowedHostnames(explicit?: string[]): Set<string> {
  const raw =
    explicit && explicit.length > 0
      ? explicit
      : (process.env.TURNSTILE_HOSTNAMES ?? "")
          .split(",")
          .map((h) => h.trim())
          .filter(Boolean);
  return new Set(raw);
}

export async function verifyTurnstileToken(
  options: TurnstileVerifyOptions
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const { token, ip, expectedAction } = options;
  const expectedHostnames = getAllowedHostnames(options.expectedHostnames);

  if (!secret) return false;
  if (typeof token !== "string" || token.length === 0 || token.length > 2048) return false;
  if (!expectedAction) return false;
  if (expectedHostnames.size === 0) return false;

  try {
    const body = new URLSearchParams();
    body.set("secret", secret);
    body.set("response", token);
    if (ip) body.set("remoteip", ip);

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return false;
    const result = (await res.json()) as TurnstileSiteverifyResponse;

    return (
      result.success === true &&
      result.action === expectedAction &&
      typeof result.hostname === "string" &&
      expectedHostnames.has(result.hostname)
    );
  } catch {
    return false;
  }
}
