/** Pages of the owner area that sit in a normal centred column (the Studio takes the whole screen instead). */
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return <main className="max-w-5xl mx-auto px-6 py-12">{children}</main>
}
