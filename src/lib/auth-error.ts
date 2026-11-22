const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const NETWORK_ERROR_MESSAGE = `Can't reach the FixMate API at ${API_URL}. Check that the backend is running and allows this origin, then try again.`;

function isNetworkError(message: string) {
  return /failed to fetch|network ?error|load failed|fetch failed/i.test(message);
}

/**
 * Normalizes a Better Auth error or a thrown fetch failure for display.
 * `authClient` rejects with a TypeError when the API is unreachable, so every
 * auth call needs to catch it rather than destructure `{ error }` blindly.
 */
export function getAuthErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === "object" && "message" in error) {
    const message = String(
      (error as { message?: unknown }).message ?? "",
    ).trim();

    if (message) {
      return isNetworkError(message) ? NETWORK_ERROR_MESSAGE : message;
    }
  }

  return fallback;
}
