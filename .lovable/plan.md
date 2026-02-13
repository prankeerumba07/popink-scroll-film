

# PopInk UI Refinement & Stability Fixes

Targeted corrections only -- no redesign. Five specific issues to resolve.

---

## Fix 1: Remove Duplicate WhatsApp Button from Hero

**File:** `src/components/HeroSection.tsx`

Remove the entire WhatsApp CTA block (lines 76-89) that renders the "Book via WhatsApp" button below the tagline. The hero should contain only the video background, logo, tagline, and scroll indicator.

---

## Fix 2: Gallery Auto-Scroll with Hover Pause & Pop-Out

**File:** `src/components/GallerySection.tsx`

Replace the current static horizontal scroll with a CSS-driven infinite marquee animation:

- Duplicate the gallery images array to create a seamless loop
- Use a CSS `@keyframes marquee` animation that translates the container from 0 to -50% (since images are doubled)
- Slow cinematic speed (~40-60 seconds for a full cycle)
- On hover over the gallery container: pause the animation (`animation-play-state: paused`)
- On hover over individual images: scale up to 1.1 with a subtle shadow/glow, dim non-hovered siblings via group styling
- On mobile (`isMobile`): disable auto-scroll entirely, keep the current swipe-based manual scroll
- Add the marquee keyframes to `src/index.css`

---

## Fix 3: Process Video Height Constraint

**File:** `src/components/ProcessSection.tsx`

- Add `max-h-[500px] md:max-h-[600px]` to the video element
- Keep `object-contain` and `w-full` so aspect ratio is preserved
- The `bg-background` class provides cinematic letterboxing automatically
- This prevents portrait-oriented videos from dominating the viewport

---

## Fix 4: Edge Flickering Fix

**File:** `src/index.css`

- Confirm `overflow-x: hidden` is on body (already present at line 58)
- Add `overflow-x: hidden` to the `<main>` wrapper or `html` element as an extra safeguard
- Remove fractional pixel transforms from the film grain animation -- round values to whole pixels
- Ensure the film grain overlay doesn't extend beyond viewport edges by adding `overflow: hidden` to `.film-grain`

---

## Fix 5: Hero Video Stability

**File:** `src/components/HeroSection.tsx`

- Add a `poster` attribute to the hero video element pointing to a solid black frame or the logo image, ensuring no white flash before the video loads
- The existing `preload="auto"` and lazy-loading architecture are already correct

---

## Files Modified

| File | Change |
|------|--------|
| `src/components/HeroSection.tsx` | Remove WhatsApp CTA, add video poster |
| `src/components/GallerySection.tsx` | Add auto-scroll marquee with hover pause/pop-out |
| `src/components/ProcessSection.tsx` | Cap video height at 500-600px |
| `src/index.css` | Add marquee keyframes, fix grain overflow, edge flicker prevention |

