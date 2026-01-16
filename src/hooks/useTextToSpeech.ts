import { useCallback, useEffect, useState, useRef } from 'react';
import { useLanguage, Language } from '@/contexts/LanguageContext';

// Map app languages to BCP-47 language tags for speech synthesis
const languageToVoiceMap: Record<Language, string> = {
  he: 'he-IL',
  en: 'en-US',
  ar: 'ar-SA',
  ru: 'ru-RU',
};

export function useTextToSpeech() {
  const { language } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

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

  // Find the best voice for a given language
  const findBestVoice = useCallback((lang: string): SpeechSynthesisVoice | undefined => {
    // First try to find an exact match
    let voice = voices.find(v => v.lang === lang);
    
    // If no exact match, try to find a voice that starts with the language code
    if (!voice) {
      const langCode = lang.split('-')[0];
      voice = voices.find(v => v.lang.startsWith(langCode));
    }
    
    // Fallback to default voice
    if (!voice) {
      voice = voices.find(v => v.default) || voices[0];
    }
    
    return voice;
  }, [voices]);

  const speak = useCallback((text: string, overrideLang?: Language) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    if (!text.trim()) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Set language
    const targetLang = overrideLang || language;
    const voiceLang = languageToVoiceMap[targetLang];
    utterance.lang = voiceLang;

    // Find and set the best voice for this language
    const voice = findBestVoice(voiceLang);
    if (voice) {
      utterance.voice = voice;
    }

    // Configure speech parameters
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;
    utterance.volume = 1;

    // Event handlers
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    // Speak!
    window.speechSynthesis.speak(utterance);
  }, [language, findBestVoice]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported: typeof window !== 'undefined' && 'speechSynthesis' in window,
  };
}
