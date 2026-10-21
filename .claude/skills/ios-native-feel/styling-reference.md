# iOS Native Styling & Tokens Reference

## Safe Area Layout Classes
```css
/* Container root */
.app-shell {
  min-height: 100dvh;
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  overscroll-behavior-y: none;
}

/* Bottom Tab Bar */
.bottom-nav {
  position: fixed;
  bottom: 0;
  inset-inline: 0;
  height: calc(56px + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
}
```

## Input Field Rule
```css
/* Prevents iOS Safari input focus auto-zoom */
input, textarea, select {
  font-size: 16px !important;
  touch-action: manipulation;
}
```

## Design Tokens (Tailwind Logical Properties)
| Token | Light Theme | Dark Theme | Purpose |
|---|---|---|---|
| `--color-surface` | `#FFFFFF` | `#111827` | Card backgrounds |
| `--color-canvas` | `#F9FAFB` | `#030712` | Main page background |
| `--color-primary` | `#059669` | `#10B981` | Transit action buttons |
| `--color-warning` | `#D97706` | `#F59E0B` | Offline & seat alerts |
| `--radius-card` | `1rem` | `1rem` | Standard card border radius |
| `--radius-sheet` | `1.5rem` | `1.5rem` | Top corners of bottom sheets |
