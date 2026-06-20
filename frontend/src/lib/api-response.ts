import type { ApiResponse } from "@/types/api";

/**
 * Normalizes backend ApiResponse payloads.
 * Some controllers pass (statusCode, data, message) correctly;
 * others swap data and message — this handles both shapes.
 */
export function unwrapApiData<T>(response: ApiResponse<unknown>): T {
  const { data, message } = response;

  if (data !== null && data !== undefined && typeof data !== "string") {
    return data as T;
  }

  if (
    message !== null &&
    message !== undefined &&
    typeof message !== "string"
  ) {
    return message as T;
  }

  return data as T;
}

export function getApiErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: { data?: { message?: string } } }).response
      ?.data?.message === "string"
  ) {
    return (error as { response: { data: { message: string } } }).response.data
      .message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
