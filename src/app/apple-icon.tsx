import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '180px',
          height: '180px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f5c2e',
        }}
      >
        <svg width="120" height="120" viewBox="0 0 200 200">
          {/* Left page */}
          <path d="M100 60 C82 58 50 64 30 76 L30 144 C50 135 82 132 100 134 Z" fill="white" />
          {/* Right page */}
          <path d="M100 60 C118 58 150 64 170 76 L170 144 C150 135 118 132 100 134 Z" fill="#dff0e8" />
          {/* Binding */}
          <line x1="100" y1="60" x2="100" y2="134" stroke="#0f5c2e" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
          {/* Gold dot at binding top */}
          <circle cx="100" cy="57" r="8" fill="#c9a227" />
          <circle cx="100" cy="57" r="4" fill="#0f5c2e" />
          {/* Text lines — left page */}
          <line x1="50" y1="92" x2="90" y2="88" stroke="#0f5c2e" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
          <line x1="47" y1="105" x2="90" y2="101" stroke="#0f5c2e" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
          <line x1="47" y1="118" x2="90" y2="114" stroke="#0f5c2e" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
          {/* Text lines — right page */}
          <line x1="110" y1="88" x2="150" y2="92" stroke="#0f5c2e" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
          <line x1="110" y1="101" x2="153" y2="105" stroke="#0f5c2e" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
          <line x1="110" y1="114" x2="153" y2="118" stroke="#0f5c2e" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
          {/* Gold 8-pointed star */}
          <polygon points="100,148 102.5,154.5 109,157 102.5,159.5 100,166 97.5,159.5 91,157 97.5,154.5" fill="#c9a227" />
          <polygon points="100,148 102.5,154.5 109,157 102.5,159.5 100,166 97.5,159.5 91,157 97.5,154.5" fill="#c9a227" transform="rotate(45, 100, 157)" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
