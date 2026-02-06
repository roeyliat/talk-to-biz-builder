

# Update Click Sound Effect

## Current State

The file `src/hooks/useClickSound.ts` does not exist yet -- the previous plan to add click sounds was approved but not yet implemented. I'll create the hook with the new sound URL and integrate it into the AAC Dashboard.

## Changes

### 1. Create `src/hooks/useClickSound.ts`

Create a new hook with the requested sound URL:

```typescript
const CLICK_SOUND_URL = "http://commondatastorage.googleapis.com/codeskulptor-assets/week7-brrring.m4a";
```

The hook will export a `playClickSound` function that creates a new `Audio` instance and plays it at reduced volume (0.3).

### 2. Update `src/components/aac/AACDashboard.tsx`

- Import and use the `useClickSound` hook
- Call `playClickSound()` at the start of `handleCellClick` and `handleCoreWordClick`

## Files

| File | Action |
|------|--------|
| `src/hooks/useClickSound.ts` | Create -- new hook with the sound URL |
| `src/components/aac/AACDashboard.tsx` | Edit -- import hook, call on tile clicks |

