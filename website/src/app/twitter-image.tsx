import { ImageResponse } from 'next/og';

export const alt = 'Media Picker - React Media Picker for AIGC Apps';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '60px',
          textAlign: 'center',
        }}
      >
        {/* Logo/Icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 100,
            height: 100,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 24,
            marginBottom: 40,
            fontSize: 56,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="56"
            height="56"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            marginBottom: 20,
            background: 'linear-gradient(90deg, #ffffff 0%, #e0e7ff 100%)',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Media Picker
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 32,
            color: '#94a3b8',
            marginBottom: 40,
            maxWidth: 800,
          }}
        >
          React Media Picker for AIGC Apps
        </div>

        {/* Features */}
        <div
          style={{
            display: 'flex',
            gap: 32,
            fontSize: 20,
            color: '#cbd5e1',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 24px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 12,
            }}
          >
            Pexels Powered
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 24px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 12,
            }}
          >
            Zero Config
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 24px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 12,
            }}
          >
            MIT Licensed
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 18,
            color: '#64748b',
          }}
        >
          by LarryKoo
        </div>
      </div>
    ),
    { ...size }
  );
}
