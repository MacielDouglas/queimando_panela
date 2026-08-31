import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Queimando Panela — onde olhômetro vira medida';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#f6f0e4',
        padding: 48,
        fontFamily: 'DM Sans, sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#a85131',
            color: '#1b2920',
            fontWeight: 800,
            fontSize: 20,
            borderRadius: '50% 50% 50% 8px',
            transform: 'rotate(-12deg)',
          }}
        >
          QP
        </div>
        <span
          style={{
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#1b2920',
          }}
        >
          Queimando Panela
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div
          style={{
            fontFamily: 'Fraunces, Georgia, serif',
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 0.95,
            letterSpacing: '-0.04em',
            color: '#1b2920',
          }}
        >
          Onde olhômetro
          <br />
          vira medida.
        </div>
        <div
          style={{
            fontSize: 18,
            color: '#3e4d42',
            maxWidth: 560,
            lineHeight: 1.5,
          }}
        >
          Receitas caseiras, afetivas e autorais — com IA que confere
          utensílios, tempo e nutrição antes de publicar.
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#a85131',
        }}
      >
        <span
          style={{
            width: 36,
            height: 2,
            background: '#a85131',
            display: 'flex',
          }}
        />
        Receitas com história
      </div>
    </div>,
    { ...size },
  );
}
