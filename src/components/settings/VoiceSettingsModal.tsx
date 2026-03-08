import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ModalFooter } from '@/components/ui/modal-footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTextToSpeech, VoiceProfile } from '@/hooks/useTextToSpeech';
import { cn } from '@/lib/utils';
import { Volume2, RotateCcw, Play, User, MousePointerClick } from 'lucide-react';
import { useClickSound } from '@/hooks/useClickSound';

interface VoiceSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const voiceProfiles: { key: VoiceProfile; icon: string }[] = [
  { key: 'man', icon: '👨' },
  { key: 'woman', icon: '👩' },
  { key: 'boy', icon: '👦' },
  { key: 'girl', icon: '👧' },
];

export function VoiceSettingsModal({ open, onClose }: VoiceSettingsModalProps) {
  const { language } = useLanguage();
  const { speak, isSpeaking, settings, updateSettings } = useTextToSpeech();
  const { playClickSound, clickVolume, setClickVolume } = useClickSound();

  const resetSettings = () => {
    updateSettings({ profile: 'man', rate: 0.9, pitch: 1.0, volume: 1.0 });
    setClickVolume(0.3);
  };

  const isRtl = language === 'he' || language === 'ar';

  const texts = {
    he: {
      title: 'הגדרות קול',
      voiceProfile: 'פרופיל קולי',
      man: 'גבר',
      woman: 'אישה',
      boy: 'ילד',
      girl: 'ילדה',
      speechRate: 'מהירות דיבור',
      slow: 'איטי',
      fast: 'מהיר',
      pitch: 'גובה הקול',
      low: 'נמוך',
      high: 'גבוה',
      volume: 'עוצמה',
      quiet: 'שקט',
      loud: 'חזק',
      testVoice: 'בדיקת קול',
      testPhrase: 'שלום, אני רוצה להזמין',
      reset: 'איפוס',
      close: 'סגור',
      clickSound: 'צליל לחיצה',
    },
    en: {
      title: 'Voice Settings',
      voiceProfile: 'Voice Profile',
      man: 'Man',
      woman: 'Woman',
      boy: 'Boy',
      girl: 'Girl',
      speechRate: 'Speech Rate',
      slow: 'Slow',
      fast: 'Fast',
      pitch: 'Pitch',
      low: 'Low',
      high: 'High',
      volume: 'Volume',
      quiet: 'Quiet',
      loud: 'Loud',
      testVoice: 'Test Voice',
      testPhrase: 'Hello, I would like to order',
      reset: 'Reset',
      close: 'Close',
      clickSound: 'Click Sound',
    },
    ar: {
      title: 'إعدادات الصوت',
      voiceProfile: 'ملف الصوت',
      man: 'رجل',
      woman: 'امرأة',
      boy: 'ولد',
      girl: 'بنت',
      speechRate: 'سرعة الكلام',
      slow: 'بطيء',
      fast: 'سريع',
      pitch: 'طبقة الصوت',
      low: 'منخفض',
      high: 'مرتفع',
      volume: 'مستوى الصوت',
      quiet: 'هادئ',
      loud: 'عالي',
      testVoice: 'اختبار الصوت',
      testPhrase: 'مرحبًا، أريد أن أطلب',
      reset: 'إعادة تعيين',
      close: 'إغلاق',
      clickSound: 'صوت النقر',
    },
    ru: {
      title: 'Настройки голоса',
      voiceProfile: 'Голосовой профиль',
      man: 'Мужчина',
      woman: 'Женщина',
      boy: 'Мальчик',
      girl: 'Девочка',
      speechRate: 'Скорость речи',
      slow: 'Медленно',
      fast: 'Быстро',
      pitch: 'Высота голоса',
      low: 'Низкий',
      high: 'Высокий',
      volume: 'Громкость',
      quiet: 'Тихо',
      loud: 'Громко',
      testVoice: 'Проверить голос',
      testPhrase: 'Привет, я хотел бы заказать',
      reset: 'Сброс',
      close: 'Закрыть',
    },
  };

  const t = texts[language] || texts.en;

  const handleTestVoice = () => {
    speak(t.testPhrase);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" dir={isRtl ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <User className="h-5 w-5" />
            {t.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Voice Profile Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              {t.voiceProfile}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {voiceProfiles.map((profile) => (
                <button
                  key={profile.key}
                  onClick={() => updateSettings({ profile: profile.key })}
                  className={cn(
                    'flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all',
                    settings.profile === profile.key
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  )}
                >
                  <span className="text-3xl">{profile.icon}</span>
                  <span className="text-xs font-medium">{t[profile.key]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Speech Rate */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground">
                {t.speechRate}
              </label>
              <span className="text-xs text-muted-foreground">
                {settings.rate.toFixed(1)}x
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-10">{t.slow}</span>
              <Slider
                value={[settings.rate]}
                min={0.5}
                max={1.5}
                step={0.1}
                onValueChange={([value]) => updateSettings({ rate: value })}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground w-10 text-end">{t.fast}</span>
            </div>
          </div>

          {/* Pitch */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground">
                {t.pitch}
              </label>
              <span className="text-xs text-muted-foreground">
                {settings.pitch.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-10">{t.low}</span>
              <Slider
                value={[settings.pitch]}
                min={0.5}
                max={2.0}
                step={0.1}
                onValueChange={([value]) => updateSettings({ pitch: value })}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground w-10 text-end">{t.high}</span>
            </div>
          </div>

          {/* Volume */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground">
                {t.volume}
              </label>
              <span className="text-xs text-muted-foreground">
                {Math.round(settings.volume * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-10">{t.quiet}</span>
              <Slider
                value={[settings.volume]}
                min={0.1}
                max={1.0}
                step={0.1}
                onValueChange={([value]) => updateSettings({ volume: value })}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground w-10 text-end">{t.loud}</span>
            </div>
          </div>

          {/* Test & Reset Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={resetSettings}
            >
              <RotateCcw className="h-4 w-4" />
              {t.reset}
            </Button>
            <Button
              className="flex-1 gap-2"
              onClick={handleTestVoice}
              disabled={isSpeaking}
            >
              {isSpeaking ? (
                <Volume2 className="h-4 w-4 animate-pulse" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {t.testVoice}
            </Button>
          </div>

          <ModalFooter />
        </div>
      </DialogContent>
    </Dialog>
  );
}
