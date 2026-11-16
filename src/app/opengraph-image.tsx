import { ImageResponse } from 'next/og';
import { site } from '@/lib/site';

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '72px',
          background: 'linear-gradient(135deg, #05060a 0%, #0a1014 55%, #0d1418 100%)',
          color: '#e8edf5',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* auréolas */}
        <div
          style={{
            position: 'absolute',
            top: -160,
            left: 120,
            width: 620,
            height: 620,
            borderRadius: 999,
            background: 'rgba(191,247,71,0.16)',
            filter: 'blur(90px)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -200,
            right: 60,
            width: 520,
            height: 520,
            borderRadius: 999,
            background: 'rgba(94,246,255,0.14)',
            filter: 'blur(90px)',
            display: 'flex',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 46,
              height: 46,
              borderRadius: 12,
              background: '#bff747',
              color: '#060a05',
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            MG
          </div>
          <div style={{ display: 'flex', fontSize: 24, color: '#8b96aa' }}>
            {site.name} · {site.location}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 40,
            fontSize: 68,
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
            maxWidth: 950,
          }}
        >
          Sistemas e automações que devolvem tempo para a sua empresa.
        </div>

        <div style={{ display: 'flex', marginTop: 28, gap: 14 }}>
          {['React', 'Next.js', 'TypeScript', 'Node.js', 'IA'].map((tag) => (
            <div
              key={tag}
              style={{
                display: 'flex',
                padding: '10px 22px',
                borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.12)',
                fontSize: 21,
                color: '#8b96aa',
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginTop: 40,
            fontSize: 22,
            color: '#bff747',
          }}
        >
          ● disponível para novos projetos
        </div>
      </div>
    ),
    size,
  );
}
