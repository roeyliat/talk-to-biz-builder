import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface FirstLaunchDisclaimerProps {
  onAccept: () => void;
}

export function FirstLaunchDisclaimer({ onAccept }: FirstLaunchDisclaimerProps) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div
      className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center overflow-y-auto bg-background px-4 py-8"
      dir="rtl"
    >
      <div className="flex w-full max-w-md flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-xl md:p-8">
        <div className="flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-primary">
            <img src="/favicon.png" alt="TalkBiz Logo" className="h-full w-full object-cover" />
          </div>
          <span className="text-xl font-bold text-foreground">TalkBiz</span>
        </div>

        <div className="space-y-3 text-sm leading-relaxed text-foreground">
          <p>תודה שבחרתם להשתמש ב־TalktoBiz.</p>
          <p>האפליקציה נמצאת בשלב בטא (Beta) ועשויה לכלול שינויים או תקלות.</p>
          <p>השימוש באפליקציה באחריות המשתמש ובהתאם לשיקול דעתו.</p>
          <p>TalktoBiz אינה אחראית לכל נזק ישיר או עקיף שעלול להיגרם כתוצאה מהשימוש באפליקציה.</p>
        </div>

        <label className="flex cursor-pointer items-start gap-3 text-sm font-medium text-foreground">
          <Checkbox
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(checked === true)}
            className="mt-0.5"
            aria-label="קראתי ואני מסכים/ה לתנאי השימוש."
          />
          <span>קראתי ואני מסכים/ה לתנאי השימוש.</span>
        </label>

        <Button size="lg" disabled={!agreed} onClick={onAccept} className="w-full">
          המשך
        </Button>
      </div>
    </div>
  );
}
