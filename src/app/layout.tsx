/**
 * Pass-through root layout. The `<html>` element lives in the layouts below it
 * (`[locale]/layout.tsx` for the site, `studio/.../layout.tsx` for the CMS) so
 * each can set its own language and direction.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
