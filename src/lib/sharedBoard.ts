import { AACBoard } from '@/types/aac';
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';

export interface SharedBoardPayload {
  version: 1;
  boardId: string;
  businessType: string;
  boardName: string;
  boards: Record<string, AACBoard>;
}

const QR_BYTE_LIMITS = {
  L: 2953,
  M: 2331,
  Q: 1663,
  H: 1273,
} as const;

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const encodeBase64 = (binary: string) => {
  if (typeof globalThis.btoa === 'function') {
    return globalThis.btoa(binary);
  }

  if (typeof Buffer !== 'undefined') {
    return Buffer.from(binary, 'binary').toString('base64');
  }

  throw new Error('Base64 encoding is not available in this environment');
};

const decodeBase64 = (value: string) => {
  if (typeof globalThis.atob === 'function') {
    return globalThis.atob(value);
  }

  if (typeof Buffer !== 'undefined') {
    return Buffer.from(value, 'base64').toString('binary');
  }

  throw new Error('Base64 decoding is not available in this environment');
};

const base64UrlEncode = (value: string) => {
  const bytes = textEncoder.encode(value);
  let binary = '';

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return encodeBase64(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
};

const encodeSharedPayload = (value: string) => compressToEncodedURIComponent(value);

const base64UrlDecode = (value: string) => {
  const normalizedValue = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = (4 - (normalizedValue.length % 4)) % 4;
  const paddedValue = normalizedValue.padEnd(normalizedValue.length + padding, '=');
  const binary = decodeBase64(paddedValue);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  return textDecoder.decode(bytes);
};

const decodeSharedPayload = (value: string) => {
  const decompressed = decompressFromEncodedURIComponent(value);
  if (decompressed) {
    return decompressed;
  }

  return base64UrlDecode(value);
};

const isSharedBoardPayload = (value: unknown): value is SharedBoardPayload => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const payload = value as Partial<SharedBoardPayload>;
  return payload.version === 1
    && typeof payload.boardId === 'string'
    && typeof payload.businessType === 'string'
    && typeof payload.boardName === 'string'
    && !!payload.boards
    && typeof payload.boards === 'object';
};

export const isValidSavedBoardId = (boardId?: string | null) => {
  if (typeof boardId !== 'string') {
    return false;
  }

  const normalizedBoardId = boardId.trim();
  return normalizedBoardId.length > 0 && normalizedBoardId !== 'custom';
};

export const createSharedBoardUrl = (input: {
  baseUrl: string;
  boardId: string;
  businessType: string;
  boardName: string;
  boards?: Record<string, AACBoard>;
}) => {
  // Prefer a stable ID-based link whenever a saved board ID is available.
  if (isValidSavedBoardId(input.boardId)) {
    const url = new URL(`/board/${input.boardId.trim()}`, input.baseUrl);
    url.searchParams.set('type', input.businessType);
    return url.toString();
  }

  // Fallback for unsaved / local-only boards that have no stable saved ID.
  if (input.boards) {
    const url = new URL('/b', input.baseUrl);
    const payload: SharedBoardPayload = {
      version: 1,
      boardId: input.boardId,
      businessType: input.businessType,
      boardName: input.boardName,
      boards: input.boards,
    };

    url.searchParams.set('s', encodeSharedPayload(JSON.stringify(payload)));
    return url.toString();
  }

  const url = new URL(`/board/${input.boardId}`, input.baseUrl);
  url.searchParams.set('type', input.businessType);

  return url.toString();
};

export const parseSharedBoardPayload = (sharedValue: string | null) => {
  if (!sharedValue) {
    return null;
  }

  try {
    const decodedValue = decodeSharedPayload(sharedValue);
    if (!decodedValue) {
      return null;
    }

    const parsedValue = JSON.parse(decodedValue) as unknown;
    return isSharedBoardPayload(parsedValue) ? parsedValue : null;
  } catch {
    return null;
  }
};

export const canRenderBoardUrlAsQr = (url: string, level: keyof typeof QR_BYTE_LIMITS = 'M') => {
  const byteLength = textEncoder.encode(url).length;
  return byteLength <= QR_BYTE_LIMITS[level];
};