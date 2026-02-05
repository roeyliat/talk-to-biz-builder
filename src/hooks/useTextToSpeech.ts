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
const languageToVoiceMap: Record<Language, string> = {
  he: 'he-IL',
  en: 'en-US',
  ar: 'ar-SA',
  ru: 'ru-RU',
};

const STORAGE_KEY = 'talkbiz-voice-settings';

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
  const findBestVoice = useCallback((lang: string, preferFemale: boolean): SpeechSynthesisVoice | undefined => {
    // Filter voices by language
    const langCode = lang.split('-')[0];
    const matchingVoices = voices.filter(v => 
      v.lang === lang || v.lang.startsWith(langCode)
    );

    if (matchingVoices.length === 0) {
      return voices.find(v => v.default) || voices[0];
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

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    if (!text.trim()) return;

    // Chrome bug workaround: small delay after cancel() to prevent silent drop
    setTimeout(() => {
      // Ensure voices are loaded
      let currentVoices = voices;
      if (currentVoices.length === 0) {
        currentVoices = window.speechSynthesis.getVoices();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      // Set language
      const targetLang = overrideLang || language;
      const voiceLang = languageToVoiceMap[targetLang];
      utterance.lang = voiceLang;

      // Get profile modifiers
      const profileMod = PROFILE_MODIFIERS[settings.profile];

      // Find and set the best voice for this language and profile
      const langCode = voiceLang.split('-')[0];
      const matchingVoices = currentVoices.filter(v =>
        v.lang === voiceLang || v.lang.startsWith(langCode)
      );
      let voice: SpeechSynthesisVoice | undefined;
      if (matchingVoices.length > 0) {
        const genderKeywords = profileMod.preferFemale
          ? ['female', 'woman', 'girl', 'נקבה', 'أنثى', 'женщина']
          : ['male', 'man', 'boy', 'זכר', 'ذكر', 'мужчина'];
        voice = matchingVoices.find(v =>
          genderKeywords.some(kw => v.name.toLowerCase().includes(kw))
        ) || matchingVoices[0];
      } else {
        voice = currentVoices.find(v => v.default) || currentVoices[0];
      }
      if (voice) {
        utterance.voice = voice;
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
        console.warn('TTS error:', e.error);
        setIsSpeaking(false);
        setSpeakingCellId(null);
        if (keepAliveRef.current) {
          clearInterval(keepAliveRef.current);
          keepAliveRef.current = null;
        }
      };

      // Speak
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
    }, 50);
  }, [language, voices, settings]);

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
