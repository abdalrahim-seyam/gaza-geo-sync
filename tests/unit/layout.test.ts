import { vi, describe, it, expect } from 'vitest';

vi.mock('next/font/google', () => ({
  Cairo: () => ({ className: 'font-cairo' }),
}));

import { metadata, viewport } from '@/app/layout';

describe('Root Layout Configuration', () => {
  it('configures Apple Web App standalone capabilities', () => {
    expect(metadata.appleWebApp).toEqual({
      capable: true,
      statusBarStyle: 'black-translucent',
      title: 'مشوار',
    });
  });

  it('configures iOS Safari viewport fit cover and prevents zoom', () => {
    expect(viewport.viewportFit).toBe('cover');
    expect(viewport.maximumScale).toBe(1);
    expect(viewport.userScalable).toBe(false);
  });
});
