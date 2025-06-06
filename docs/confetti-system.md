# Global Confetti Celebration System

The Khronos application includes a global confetti celebration system that triggers beautiful confetti animations for successful actions throughout the app.

## Features

✨ **Always celebrates content creation** - Whether from calendar or content pages  
🎯 **Multiple celebration styles** - Different effects for different occasions  
🌍 **Global context** - Easy to use from any component  
🎨 **Beautiful animations** - Multiple bursts, stars, and glitter effects

## Architecture

### 1. Core Utilities (`src/lib/confetti.ts`)

- `celebrateWithConfetti()` - Full celebration with 4 sequential bursts
- `celebrateSuccess()` - Simple quick success celebration
- `celebrateAchievement()` - Golden celebration with stars

### 2. React Hook (`src/hooks/useConfetti.ts`)

- Provides memoized callbacks for performance
- Direct access to all celebration functions

### 3. Global Context (`src/context/ConfettiContext.tsx`)

- `ConfettiProvider` - Wraps the authenticated layout
- `useGlobalConfetti()` - Hook to access celebrations globally
- Semantic function names for specific events

## Usage

### Basic Usage (any component)

```tsx
import { useGlobalConfetti } from '@/src/context/ConfettiContext';

const MyComponent = () => {
  const { triggerContentCreationCelebration } = useGlobalConfetti();

  const handleSuccess = () => {
    // Triggers full confetti celebration
    triggerContentCreationCelebration();
  };
};
```

### Available Functions

```tsx
const {
  celebrate, // Full celebration
  celebrateSimple, // Quick success
  celebrateGold, // Achievement
  triggerContentCreationCelebration, // Content creation
  triggerSuccessCelebration, // General success
  triggerAchievementCelebration, // Special achievements
} = useGlobalConfetti();
```

### Direct Import (if needed)

```tsx
import { celebrateWithConfetti } from '@/src/lib/confetti';

celebrateWithConfetti(); // Direct function call
```

## Current Implementations

### Content Creation

- **Calendar Page**: Triggers confetti after successful content creation (both scheduled and draft)
- **Content Page**: Triggers confetti after successful content creation
- **Timing**: 100ms delay after success toast for smooth UX

### Future Extensions

The system is designed to be easily extended for:

- User milestones (first content, 100th content, etc.)
- Publishing successes
- Team achievements
- Special events

## Technical Details

### Confetti Effects

#### Full Celebration (`celebrateWithConfetti`)

1. **Center Burst** (0ms): 100 particles, 70° spread, brand colors
2. **Left Stars** (250ms): 50 star particles from left side
3. **Right Stars** (400ms): 50 star particles from right side
4. **Glitter Rain** (600ms): 150 particles falling from top

#### Simple Success (`celebrateSuccess`)

- Single burst, 100 particles, blue color scheme

#### Achievement (`celebrateAchievement`)

- Golden confetti with star shapes, 200 particles

### Performance

- Uses `canvas-confetti` library for optimized WebGL rendering
- Memoized functions prevent unnecessary re-renders
- Timeouts are automatically cleaned up

## Configuration

All colors and timing can be customized in `src/lib/confetti.ts`:

```tsx
colors: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
particleCount: 100;
spread: 70;
origin: {
  y: 0.6;
}
```

The system maintains consistent brand colors and timing for a cohesive user experience.
