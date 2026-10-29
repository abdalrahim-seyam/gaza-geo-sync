import { describe, it, expect, vi } from 'vitest';

vi.mock('react-map-gl/maplibre', () => ({
  default: ({ children, ...props }: any) => (
    <div data-testid="mock-map" data-center={JSON.stringify(props.initialViewState)}>
      {children}
    </div>
  ),
  Marker: ({ children, ...props }: any) => <div data-testid="mock-marker" {...props}>{children}</div>,
  Source: ({ children, ...props }: any) => <div data-testid="mock-source" {...props}>{children}</div>,
  Layer: (props: any) => <div data-testid="mock-layer" {...props} />,
}));

vi.mock('maplibre-gl', () => ({
  default: { setRTLTextPlugin: vi.fn() },
  setRTLTextPlugin: vi.fn(),
}));

import { GAZA_CENTER, GAZA_ZOOM } from '@/components/map/GazaMap';

describe('GazaMap Configuration', () => {
  it('centers properly on the Gaza Strip corridor', () => {
    expect(GAZA_CENTER.lng).toBeCloseTo(34.44, 1);
    expect(GAZA_CENTER.lat).toBeCloseTo(31.42, 1);
  });

  it('sets initial zoom level suitable for urban corridor inspection', () => {
    expect(GAZA_ZOOM).toBe(11);
  });
});
