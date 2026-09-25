import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#0B1A2F',
          padding: '0 80px',
        }}
      >
        <img
          src="https://dieulinnapoleon.com/images/Dieulin-website.jpg"
          width={400}
          height={400}
          style={{ objectFit: 'cover', borderRadius: 28, border: '4px solid #C4953A' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 64, flex: 1 }}>
          <div style={{ display: 'flex', fontSize: 22, letterSpacing: 6, color: '#C4953A', marginBottom: 18 }}>
            FINANCE · IMPACT · STRATEGY
          </div>
          <div style={{ display: 'flex', fontSize: 72, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.05 }}>
            Dieulin Napoleon
          </div>
          <div style={{ display: 'flex', fontSize: 30, color: 'rgba(255,255,255,0.75)', marginTop: 24, lineHeight: 1.35 }}>
            Building a path in investment research and valuation
          </div>
          <div style={{ display: 'flex', width: 120, height: 4, backgroundColor: '#C4953A', marginTop: 36 }} />
          <div style={{ display: 'flex', fontSize: 24, color: 'rgba(255,255,255,0.55)', marginTop: 24 }}>
            dieulinnapoleon.com
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
