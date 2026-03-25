type LogoMarkSize = 'xs' | 'sm' | 'md' | 'lg';

const sizes: Record<LogoMarkSize, { box: string; font: string; radius: string }> = {
  xs: { box: 'h-6 w-6',   font: '22px', radius: '6px'  },
  sm: { box: 'h-8 w-8',   font: '30px', radius: '8px'  },
  md: { box: 'h-10 w-10', font: '36px', radius: '10px' },
  lg: { box: 'h-12 w-12', font: '43px', radius: '14px' },
};

export default function LogoMark({
  size = 'sm',
  className = '',
  shadow = true,
}: {
  size?: LogoMarkSize;
  className?: string;
  shadow?: boolean;
}) {
  const { box, font, radius } = sizes[size];
  return (
    <span
      className={`logo-mark inline-flex shrink-0 items-center justify-center leading-none select-none ${box} ${shadow ? 'shadow-sm' : ''} ${className}`}
      style={{
        fontFamily: 'var(--font-lateef), serif',
        fontSize: font,
        borderRadius: radius,
        fontWeight: 300,
      }}
      aria-hidden="true"
    >
      <span style={{ display: 'block', transform: 'translateY(-10%)' }}>ختم</span>
    </span>
  );
}
