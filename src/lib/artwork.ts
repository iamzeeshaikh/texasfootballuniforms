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
