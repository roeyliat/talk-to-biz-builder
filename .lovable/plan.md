

# Fix: TTS Still Not Producing Sound

## Root Cause (Confirmed)

The previous fix introduced a `setTimeout(..., 50)` delay between `cancel()` and `speak()` to work around a Chrome bug. However, this **breaks the user gesture chain**. Modern browsers require `speechSynthesis.speak()` to be called **synchronously** inside a click handler. The `setTimeout` makes it asynchronous, so the browser silently blocks the audio.

Additionally, `CustomerModeOverlay` auto-speaks inside a `useEffect` (no user gesture at all), which will always be blocked.

## Solution

### 1. Remove setTimeout from speak() in `useTextToSpeech.ts`

Call `speechSynthesis.speak()` synchronously to preserve the user gesture context. For the Chrome cancel-then-speak bug, instead of delaying, we simply avoid calling `cancel()` unless speech is actually in progress.

```typescript
const speak = useCallback((text: string, overrideLang?: Language, cellId?: string) => {
  // Only cancel if actually speaking (avoids Chrome cancel-then-speak bug)
  if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
    window.speechSynthesis.cancel();
  }

  if (!text.trim()) return;

  // Load voices synchronously if needed
  let currentVoices = voices;
  if (currentVoices.length === 0) {
    currentVoices = window.speechSynthesis.getVoices();
  }

  const utterance = new SpeechSynthesisUtterance(text);
  // ... voice selection, settings, event handlers (same as before) ...

  // Speak SYNCHRONOUSLY - no setTimeout!
  window.speechSynthesis.speak(utterance);

  // Keep-alive workaround remains the same
}, [language, voices, settings]);
```

### 2. Fix CustomerModeOverlay auto-speak

Remove the `useEffect` auto-speak (it cannot work without a gesture). Instead, trigger speech from the parent component (`AACDashboard`) at click time, before setting the selected cell.

In `AACDashboard.tsx`, update `handleCellClick` for customer mode:
```typescript
if (isCustomerMode) {
  if (!cell.linkToBoardId) {
    // Speak immediately during user gesture
    const text = language === 'he' || language === 'ar' ? cell.text : cell.textEn;
    speak(text);
    setSelectedCell(cell);
  }
}
```

In `CustomerModeOverlay.tsx`, remove the auto-speak `useEffect` and keep only the manual "Repeat" button.

## Files to Modify

| File | Change |
|------|--------|
| `src/hooks/useTextToSpeech.ts` | Remove `setTimeout` wrapper; call `speak()` synchronously; only call `cancel()` when speech is active |
| `src/components/aac/AACDashboard.tsx` | Call `speak()` in `handleCellClick` for customer mode before setting selected cell |
| `src/components/aac/CustomerModeOverlay.tsx` | Remove `useEffect` auto-speak; keep only manual Repeat button |

## Technical Details

- The `setTimeout` is removed entirely -- the Chrome cancel bug is avoided by conditionally calling `cancel()` only when speech is active
- The keep-alive `setInterval` with `pause()/resume()` is preserved for long utterances
- The "Repeat" button in the overlay will still work because it is triggered by a direct user click

