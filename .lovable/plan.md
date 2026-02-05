

# Fix: TTS (Text-to-Speech) Not Producing Sound

## Problem Analysis

After reviewing the code and session replay, I identified several issues causing the TTS to fail silently:

1. **Chrome `cancel()` timing bug**: The `speak` function calls `window.speechSynthesis.cancel()` immediately before `speak()`. Chrome has a known bug where calling `speak()` right after `cancel()` causes the utterance to be silently dropped. The session replay confirms this -- the pulse animation briefly appears (meaning `onstart` fires) but ends almost instantly with no audio.

2. **Voices may not be loaded**: The `findBestVoice` function may return `undefined` if browser voices haven't loaded yet, causing the utterance to fail silently on some devices.

3. **Edit mode blocks clicks**: The user is currently on `?edit=true`, and `handleCellClick` has `if (isEditMode) return;` at the top, which blocks all speech from tile taps in edit mode. (This is less critical but worth noting.)

## Solution

### 1. Fix `useTextToSpeech.ts` - Add delay after cancel

Add a small timeout (50ms) between `cancel()` and `speak()` to work around the Chrome bug. Also add a resume workaround for the known Chrome pause bug, and better error logging.

```typescript
const speak = useCallback((text: string, overrideLang?: Language, cellId?: string) => {
  window.speechSynthesis.cancel();
  
  if (!text.trim()) return;

  // Chrome bug workaround: small delay after cancel()
  setTimeout(() => {
    const utterance = new SpeechSynthesisUtterance(text);
    // ... rest of setup ...
    window.speechSynthesis.speak(utterance);
    
    // Chrome bug workaround: keep synthesis alive
    const keepAlive = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        clearInterval(keepAlive);
      } else {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 5000);
  }, 50);
}, [...]);
```

### 2. Fix `VoiceSettingsModal.tsx` - Add `forwardRef` to `ModalFooter`

The console shows a warning about `ModalFooter` not supporting refs. Update `modal-footer.tsx` to use `forwardRef`.

### 3. Ensure voices are loaded before first speak

Add a check that retries voice loading if the voices array is empty when `speak` is called.

## Files to Modify

| File | Change |
|------|--------|
| `src/hooks/useTextToSpeech.ts` | Add delay after `cancel()`, add Chrome keep-alive workaround, add voice reload fallback |
| `src/components/ui/modal-footer.tsx` | Wrap with `forwardRef` to fix console warning |

