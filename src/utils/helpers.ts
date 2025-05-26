export function isMimeTypeAnimatable(mimeType: string) {
  return [
    'image/gif',
    'image/apng',
    'image/webp',
    'image/svg+xml',
    'video/x-mng'
  ].includes(mimeType)
}
