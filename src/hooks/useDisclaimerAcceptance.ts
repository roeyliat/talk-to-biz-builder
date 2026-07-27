import { useCallback, useState } from 'react';

// Matches the existing 'talkbiz-' localStorage naming convention (see useTextToSpeech.ts).
const DISCLAIMER_STORAGE_KEY = 'talkbiz-disclaimer-accepted';

const readStoredAcceptance = (): boolean => {
  try {
    return localStorage.getItem(DISCLAIMER_STORAGE_KEY) === 'true';
  } catch (e) {
    // localStorage unavailable (e.g. private browsing) - fall back to in-memory only.
    console.warn('Failed to read disclaimer acceptance:', e);
    return false;
  }
};

export function useDisclaimerAcceptance() {
  const [accepted, setAccepted] = useState<boolean>(readStoredAcceptance);

  const accept = useCallback(() => {
    setAccepted(true);
    try {
      localStorage.setItem(DISCLAIMER_STORAGE_KEY, 'true');
    } catch (e) {
      // localStorage unavailable - acceptance still applies for the current session.
      console.warn('Failed to persist disclaimer acceptance:', e);
    }
  }, []);

  return { accepted, accept };
}
