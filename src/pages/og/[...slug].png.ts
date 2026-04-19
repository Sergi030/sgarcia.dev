import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import sharp from 'sharp';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const paths = posts.map((post) => ({
    params: { slug: `blog/${post.id}` },
    props: { title: post.data.title, description: post.data.description },
  }));

  paths.push({
    params: { slug: 'default' },
    props: { title: 'Sergi Garcia Ibañez', description: 'Embedded Software Engineer & Team Lead' },
  });

  return paths;
};

async function fetchFont(): Promise<ArrayBuffer> {
  // Use old User-Agent to get TTF format (satori requires TTF, not woff2)
  const cssResponse = await fetch(
    'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&display=swap',
    { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1' } }
  );
  const css = await cssResponse.text();
  const match = css.match(/url\(([^)]+\.ttf)\)/);

  if (!match) {
    throw new Error('Could not extract TTF font URL from Google Fonts CSS');
  }

  const fontResponse = await fetch(match[1]);
  return fontResponse.arrayBuffer();
}

export const GET: APIRoute = async ({ props }) => {
  const { title, description } = props;
  const fontData = await fetchFont();

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '60px',
          backgroundColor: '#0a0a0b',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: '60px',
                left: '60px',
                fontSize: '20px',
                color: '#00ffc8',
                fontFamily: 'JetBrains Mono',
              },
              children: '~/sergi',
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: '48px',
                fontWeight: 700,
                color: '#e4e4e7',
                lineHeight: 1.2,
                marginBottom: '16px',
                fontFamily: 'JetBrains Mono',
              },
              children: title.length > 50 ? title.slice(0, 50) + '...' : title,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: '20px',
                color: '#71717a',
                fontFamily: 'JetBrains Mono',
              },
              children: description.length > 80 ? description.slice(0, 80) + '...' : description,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                marginTop: '32px',
                fontSize: '16px',
                color: '#00ffc8',
                opacity: 0.6,
                fontFamily: 'JetBrains Mono',
              },
              children: 'sgarcia.dev',
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'JetBrains Mono',
          data: fontData,
          weight: 700,
          style: 'normal' as const,
        },
      ],
    }
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
