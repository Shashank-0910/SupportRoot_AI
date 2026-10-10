import { createLucideIcon } from 'lucide-react';

export const Carrot = createLucideIcon('carrot', [
  ['path', { d: 'M12 13.5c-1.2 1.2-2.2 2.4-3.5 3.2', key: 'i9pfmq' }],
  ['path', { d: 'M12 13.5c1.2 1.2 2.2 2.4 3.5 3.2', key: '13hxkk' }],
  ['path', { d: 'M12 3v16', key: 'hbotcm' }],
  ['path', { d: 'm13.6 22 5.4-3.3', key: '17aak0' }],
  ['path', { d: 'M18.8 6.3 15 4', key: 'uby54j' }],
  ['path', { d: 'M19 18.7a4.2 4.2 0 002-3.5', key: '1gwro8' }],
  ['path', { d: 'M21 15.2V9.9', key: '1rjqyl' }],
  ['path', { d: 'M21 9.9a4.2 4.2 0 00-2.2-3.6', key: '16tph4' }],
  ['path', { d: 'M3 15.2a4.2 4.2 0 002 3.5', key: 'mtvw47' }],
  ['path', { d: 'M3 9.9v5.3', key: '15mge1' }],
  ['path', { d: 'm5 18.7 5.4 3.3', key: '719ixf' }],
  ['path', { d: 'M5.2 6.3A4.2 4.2 0 003 9.9', key: '1xlmbw' }],
  ['path', { d: 'M9 4 5.2 6.3', key: '1eytxn' }],
  ['path', { d: 'M9.867 21.664a4 4 0 004.266 0', key: '123rd3' }],
  ['path', { d: 'M15 4v6', key: '8b3jif' }],
  ['path', { d: 'M15 9c0 1.8.6 3.4 2 4.3', key: '1eu1yp' }],
  ['path', { d: 'M9 4v6', key: '1gyq2m' }],
  ['path', { d: 'M9 9c0 1.8-.6 3.4-2 4.3', key: '1uh3cm' }],
]);

interface SupportrootLogoProps {
  className?: string;
  strokeWidth?: number;
}

export function SupportrootLogo({ className = 'w-7 h-7', strokeWidth = 1.75 }: SupportrootLogoProps) {
  return <Carrot className={className} strokeWidth={strokeWidth} />;
}
