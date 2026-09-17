/**
 * Reads an uploaded artwork file into a base64 payload so forms can keep
 * posting JSON to /api/lead instead of switching to multipart.
 */
export async function readArtwork(file: File | null | undefined) {
  if (!file || !file.size) return undefined;

  const buffer = await file.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }

  return {
    name: file.name,
    type: file.type || "application/octet-stream",
    data: btoa(binary),
  };
}

export const ARTWORK_ACCEPT = ".pdf,.ai,.eps,.svg,.png,.jpg,.jpeg,.zip";

/**
 * Client-side artwork cap. Vercel rejects a request body over about 4.5 MB,
 * and base64 inflates a file by a third, so a 3 MB file is the largest that
 * reliably arrives. Bigger files get a message pointing at email instead of
 * a failed submit.
 */
export const MAX_ARTWORK_BYTES = 3 * 1024 * 1024;

export function artworkTooLargeMessage(email: string) {
  return `That file is over 3 MB. Please email larger files to ${email} and send the form without it.`;
}
