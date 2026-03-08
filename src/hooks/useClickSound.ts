import { useCallback, useState, useEffect } from 'react';

const CLICK_SOUND_URL = "http://commondatastorage.googleapis.com/codeskulptor-assets/week7-brrring.m4a";
const STORAGE_KEY = 'talkbiz-click-sound-volume';
const DEFAULT_VOLUME = 0.3;

export function useClickSound() {
  const [clickVolume, setClickVolume] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) return parseFloat(stored);
    } catch {}
    return DEFAULT_VOLUME;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(clickVolume));
    } catch {}
  }, [clickVolume]);

  const playClickSound = useCallback(() => {
    try {
      const audio = new Audio(CLICK_SOUND_URL);
      audio.volume = clickVolume;
      audio.play().catch(() => {});
    } catch {}
  }, [clickVolume]);

  return { playClickSound, clickVolume, setClickVolume };
}
