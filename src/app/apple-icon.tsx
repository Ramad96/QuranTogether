import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  const png = readFileSync(join(process.cwd(), 'public', 'apple-touch-icon.png'));
  const dataUrl = `data:image/png;base64,${png.toString('base64')}`;

  return new ImageResponse(
    // eslint-disable-next-line @next/next/no-img-element
    <img src={dataUrl} width={180} height={180} alt="" />,
    { ...size },
  );
}
