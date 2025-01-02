export function getCacheBustedUrl(url: string): string {
  const cacheBuster = Date.now().toString();
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}_cb=${cacheBuster}`;
}
