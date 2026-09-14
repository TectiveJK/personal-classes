export function jsonError(error: unknown) {
  const message = error instanceof Error ? error.message : "Something went wrong.";
  const status = (error as { status?: number }).status ?? 400;
  return Response.json({ error: message }, { status });
}
