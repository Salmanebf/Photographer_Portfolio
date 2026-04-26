/* Studio uses its own viewport — minimal layout */
export { metadata } from 'next-sanity/studio'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content',
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children
}
