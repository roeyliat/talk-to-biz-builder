import { useCallback } from 'react';

const CLICK_SOUND_URL = "http://commondatastorage.googleapis.com/codeskulptor-assets/week7-brrring.m4a";

export function useClickSound() {
  const playClickSound = useCallback(() => {
    try {
      const audio = new Audio(CLICK_SOUND_URL);
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch {}
  }, []);

  return { playClickSound };
}
