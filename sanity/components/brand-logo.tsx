import { siteConfig } from '../../src/lib/site.config'

/** The logo at the top of the Studio: the site's monogram and name, in the brand colour. */
export default function BrandLogo() {
  const { color, logoMark, name } = siteConfig.brand
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <span
        style={{
          width: 28,
          height: 28,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `1px solid ${color}`,
          color,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.12em',
        }}
      >
        {logoMark}
      </span>
      <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
        {name}
      </span>
    </span>
  )
}
