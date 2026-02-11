

# The PopInk Studios -- Full Production Polish

## Current State Assessment

The site has a working foundation with all 8 sections, but several issues need fixing and features are missing compared to the spec:

### Issues Found

1. **Scroll Engine Bug**: The custom wheel dampening adds scroll ON TOP of normal scrolling (missing `e.preventDefault()`), causing janky double-scroll behavior
2. **Console Warnings**: `EndingSection` and `MobileBar` components receive refs they can't handle (React warning)
3. **Process Video**: Shows unrelated content (car footage) -- the uploaded tattoo process video needs to be correctly placed
4. **No scroll-based transitions**: Sections don't blend into each other -- they just stack with hard cuts
5. **Gallery counter shows "0004"**: Should display the currently visible card number, not always the last

### Missing Features (from spec)

1. **Background color "floods"**: Scroll-triggered transitions between deep blacks and charcoal greys (Simone Snickers style)
2. **"Curtain" image reveals**: Images should reveal via scroll-driven mask/clip animations
3. **Hero scroll transition**: Video should zoom slightly and fade as user scrolls (currently stays static)
4. **Cinematic text fade-out**: Text currently stays visible once triggered -- should fade out when scrolled past
5. **Gallery entry animation**: First tattoo should appear full-screen with cinematic pan/zoom before the stack "unlocks"

---

## Implementation Plan

### Step 1: Fix the Scroll Engine
- Add `e.preventDefault()` to the wheel handler so dampening actually replaces default scroll instead of doubling it
- Fine-tune dampening factor for premium resistance feel

### Step 2: Fix Console Warnings
- Remove stray ref forwarding expectations from `EndingSection` and `MobileBar`

### Step 3: Add Scroll-Driven Hero Transition
- Use Framer Motion's `useScroll` + `useTransform` on the hero section
- As user scrolls: video scales up slightly (1.0 to 1.08), opacity fades (1 to 0), tagline slides up and fades
- Creates seamless blend into the next section

### Step 4: Improve Cinematic Text
- Change from `once: true` to `once: false` so text fades OUT when scrolled past
- Add subtle parallax Y-offset driven by scroll position
- Slow zoom effect on the background spotlight gradient

### Step 5: Add Background Color Floods
- Create a scroll-progress-driven background system in `Index.tsx`
- Interpolate between color stops: pure black (#0A0A0A) for hero, charcoal (#1A1A1A) for gallery, back to black for ending
- Smooth transitions tied to scroll position using `useScroll` and `useTransform`

### Step 6: Gallery Entry Cinematic Reveal
- Before the interactive stack, show the first tattoo image full-bleed with a slow CSS `object-position` pan animation
- On continued scroll, this image scales down and the card stack fades in
- Use scroll-linked opacity and scale transforms

### Step 7: Curtain / Mask Reveals for Process Section
- Process videos and the About section use a `clip-path` reveal tied to scroll progress
- `clip-path: inset(50% 0)` to `clip-path: inset(0% 0)` as the element enters the viewport
- Creates a vertical "curtain opening" effect

### Step 8: Mobile Polish
- Ensure swipe hint auto-hides after first interaction (not just time-based)
- Verify sticky bottom bar doesn't overlap ending section content
- Add padding-bottom to last section to account for mobile bar height

---

## Technical Details

### Key Framer Motion APIs Used
- `useScroll({ target, offset })` for per-section scroll tracking
- `useTransform()` for mapping scroll progress to visual properties
- `useSpring()` for smooth physics-based interpolation
- `motion.div` with `style` prop for GPU-accelerated transforms

### File Changes
- `src/components/ScrollEngine.tsx` -- Fix wheel handler with preventDefault
- `src/components/HeroSection.tsx` -- Add scroll-driven zoom/fade transition
- `src/components/CinematicText.tsx` -- Bidirectional fade + parallax
- `src/components/GallerySection.tsx` -- Add cinematic entry reveal before stack
- `src/components/ProcessSection.tsx` -- Curtain clip-path reveal
- `src/components/AboutSection.tsx` -- Curtain reveal effect
- `src/components/EndingSection.tsx` -- Fix ref warning
- `src/components/MobileBar.tsx` -- Fix ref warning, improve bottom spacing
- `src/pages/Index.tsx` -- Add scroll-driven background color interpolation

### Performance Considerations
- All scroll-driven animations use `transform` and `opacity` only (GPU composited)
- No layout-triggering properties animated
- `will-change: transform` applied to animated elements
- Lazy loading preserved for all non-hero media

