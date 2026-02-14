

# Add Studio Timings -- PopInk Studios

Minimal, luxury-integrated addition of operating hours in two locations, plus a dynamic open/closed indicator.

---

## Changes Overview

### 1. Update `src/data/media.ts` -- Add Studio Hours Data

Add to the `studioInfo` object:
- `hours: { open: 10, close: 23, label: "10:00 AM - 11:00 PM", daily: true }`

This centralizes the timing data for reuse across components.

### 2. Update `src/components/ContactSection.tsx` -- Visible Timings

Below the contact cards grid, add a new animated block:

- **"STUDIO HOURS"** label in uppercase, tracking `[0.2em]`, muted foreground
- **"Open Daily"** line
- **"10:00 AM - 11:00 PM"** line
- A small dynamic dot indicator:
  - Green dot + "OPEN NOW" if current time is between 10 AM and 11 PM (IST)
  - Muted red dot + "CLOSED" otherwise
- Fade-in animation matching existing section timing
- Centered, elegant spacing, no icons or emoji

### 3. Update `src/components/EndingSection.tsx` -- Footer Timings

In the footer metadata block (alongside address and phone), add one line:

```
OPEN DAILY -- 10:00 AM - 11:00 PM
```

- Same `text-[10px] tracking-[2px]` styling as existing footer text
- Muted foreground color at 0.3 opacity (matching existing lines)
- Placed between the phone number and copyright line

---

## Technical Details

### Open/Closed Logic

A simple helper using `Intl.DateTimeFormat` with `Asia/Kolkata` timezone:

```text
const now = new Date();
const kolkataHour = Number(
  new Intl.DateTimeFormat('en', { hour: 'numeric', hour12: false, timeZone: 'Asia/Kolkata' }).format(now)
);
const isOpen = kolkataHour >= 10 && kolkataHour < 23;
```

This ensures accurate IST-based status regardless of the visitor's local timezone.

### Files Modified

| File | Change |
|------|--------|
| `src/data/media.ts` | Add `hours` to `studioInfo` |
| `src/components/ContactSection.tsx` | Add studio hours block with open/closed indicator below cards |
| `src/components/EndingSection.tsx` | Add one-line timing in footer metadata |

