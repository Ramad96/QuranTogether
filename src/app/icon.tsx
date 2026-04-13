import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function Icon() {
  const png = readFileSync(join(process.cwd(), 'public', 'icon.png'));
  const dataUrl = `data:image/png;base64,${png.toString('base64')}`;

  return new ImageResponse(
    // eslint-disable-next-line @next/next/no-img-element
    <img src={dataUrl} width={512} height={512} alt="" />,
    { ...size },
  );
}
