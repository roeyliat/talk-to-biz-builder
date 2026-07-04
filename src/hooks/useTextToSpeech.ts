import { useCallback, useEffect, useState, useRef } from 'react';
import { useLanguage, Language } from '@/contexts/LanguageContext';

// Voice profile settings - pitch and rate adjustments
export type VoiceProfile = 'man' | 'woman' | 'boy' | 'girl';

export interface VoiceSettings {
  profile: VoiceProfile;
  rate: number;
  pitch: number;
  volume: number;
}

const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  profile: 'man',
  rate: 0.9,
  pitch: 1.0,
  volume: 1.0,
};

// Profile pitch/rate modifiers to simulate different voice types
const PROFILE_MODIFIERS: Record<VoiceProfile, { pitchMod: number; rateMod: number; preferFemale: boolean }> = {
  man: { pitchMod: 0, rateMod: 0, preferFemale: false },
  woman: { pitchMod: 0, rateMod: 0, preferFemale: true },
  boy: { pitchMod: 0.4, rateMod: 0.05, preferFemale: false }, // Higher pitch for child voice
  girl: { pitchMod: 0.6, rateMod: 0.05, preferFemale: true }, // Even higher pitch for girl voice
};

// Map app languages to BCP-47 language tags for speech synthesis
const languageToVoiceMap: Record<Language, string[]> = {
  he: ['he-IL', 'he', 'iw-IL', 'iw'],
  en: ['en-US', 'en'],
  ar: ['ar-SA', 'ar'],
  ru: ['ru-RU', 'ru'],
};

const STORAGE_KEY = 'talkbiz-voice-settings';

const normalizeVoiceLanguageTag = (lang: string) =>
  lang
    .toLowerCase()
    .replace(/_/g, '-')
    .replace(/^iw(?=-|$)/, 'he');

const getMatchingVoices = (availableVoices: SpeechSynthesisVoice[], langs: string | string[]) => {
  const candidates = Array.isArray(langs) ? langs : [langs];
  const matches: SpeechSynthesisVoice[] = [];

  candidates.forEach((lang) => {
    const normalizedTarget = normalizeVoiceLanguageTag(lang);
    const targetBase = normalizedTarget.split('-')[0];

    availableVoices.forEach((voice) => {
      const normalizedVoiceLang = normalizeVoiceLanguageTag(voice.lang);
      const isMatch = normalizedVoiceLang === normalizedTarget || normalizedVoiceLang.split('-')[0] === targetBase;

      if (isMatch && !matches.some((match) => match.name === voice.name && match.lang === voice.lang)) {
        matches.push(voice);
      }
    });
  });

  return matches;
};

export function useTextToSpeech() {
  const { language } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingCellId, setSpeakingCellId] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [settings, setSettings] = useState<VoiceSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_VOICE_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to load voice settings:', e);
    }
    return DEFAULT_VOICE_SETTINGS;
  });
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save voice settings:', e);
    }
  }, [settings]);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    
    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Find the best voice for a given language and profile
  const findBestVoice = useCallback((langs: string | string[], preferFemale: boolean): SpeechSynthesisVoice | undefined => {
    const matchingVoices = getMatchingVoices(voices, langs);

    if (matchingVoices.length === 0) {
      return undefined;
    }

    // Try to find a voice matching gender preference
    const genderKeywords = preferFemale 
      ? ['female', 'woman', 'girl', 'נקבה', 'أنثى', 'женщина']
      : ['male', 'man', 'boy', 'זכר', 'ذكر', 'мужчина'];
    
    // Also check for voices with gender in the name
    let preferredVoice = matchingVoices.find(v => 
      genderKeywords.some(keyword => v.name.toLowerCase().includes(keyword))
    );

    // If no gender-specific voice found, use the first matching voice
    if (!preferredVoice) {
      preferredVoice = matchingVoices[0];
    }

    return preferredVoice;
  }, [voices]);

  const updateSettings = useCallback((updates: Partial<VoiceSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const keepAliveRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const speak = useCallback((text: string, overrideLang?: Language, cellId?: string) => {
    // Clear any previous keep-alive interval
    if (keepAliveRef.current) {
      clearInterval(keepAliveRef.current);
      keepAliveRef.current = null;
    }

    // Only cancel if actually speaking (avoids Chrome cancel-then-speak bug)
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }

    if (!text.trim()) return;

    // Ensure voices are loaded
    let currentVoices = voices;
    if (currentVoices.length === 0) {
      currentVoices = window.speechSynthesis.getVoices();
    }

    window.speechSynthesis.resume();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Set language
    const targetLang = overrideLang || language;
    const voiceLangs = languageToVoiceMap[targetLang];

    // Get profile modifiers
    const profileMod = PROFILE_MODIFIERS[settings.profile];

    // Find and set the best voice for this language and profile
    const voice = findBestVoice(voiceLangs, profileMod.preferFemale);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = targetLang === 'he' ? 'he' : voiceLangs[0];
    }

    // Apply settings with profile modifiers
    utterance.rate = Math.min(2, Math.max(0.5, settings.rate + profileMod.rateMod));
    utterance.pitch = Math.min(2, Math.max(0.5, settings.pitch + profileMod.pitchMod));
    utterance.volume = settings.volume;

    // Event handlers
    utterance.onstart = () => {
      setIsSpeaking(true);
      if (cellId) setSpeakingCellId(cellId);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingCellId(null);
      if (keepAliveRef.current) {
        clearInterval(keepAliveRef.current);
        keepAliveRef.current = null;
      }
    };
    utterance.onerror = (e) => {
      if (targetLang === 'he' && utterance.lang !== 'he') {
        const fallbackUtterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = fallbackUtterance;
        fallbackUtterance.lang = 'he';
        fallbackUtterance.rate = utterance.rate;
        fallbackUtterance.pitch = utterance.pitch;
        fallbackUtterance.volume = utterance.volume;
        fallbackUtterance.onstart = utterance.onstart;
        fallbackUtterance.onend = utterance.onend;
        fallbackUtterance.onerror = () => {
          console.warn('TTS error:', e.error);
          setIsSpeaking(false);
          setSpeakingCellId(null);
          if (keepAliveRef.current) {
            clearInterval(keepAliveRef.current);
            keepAliveRef.current = null;
          }
        };
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(fallbackUtterance);
        return;
      }

      console.warn('TTS error:', e.error);
      setIsSpeaking(false);
      setSpeakingCellId(null);
      if (keepAliveRef.current) {
        clearInterval(keepAliveRef.current);
        keepAliveRef.current = null;
      }
    };

    // Speak SYNCHRONOUSLY - no setTimeout! Preserves user gesture context.
    window.speechSynthesis.speak(utterance);

    // Chrome bug workaround: keep synthesis alive with periodic pause/resume
    keepAliveRef.current = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        if (keepAliveRef.current) {
          clearInterval(keepAliveRef.current);
          keepAliveRef.current = null;
        }
      } else {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 5000);
  }, [findBestVoice, language, voices, settings]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setSpeakingCellId(null);
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    speakingCellId,
    isSupported: typeof window !== 'undefined' && 'speechSynthesis' in window,
    settings,
    updateSettings,
    availableVoices: voices,
  };
}
