import { renderToStaticMarkup } from 'react-dom/server'
import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it, vi } from 'vitest'
import en from '@/messages/en.json'
import Services from './services'
import Timeline from '@/features/timeline/timeline'
import AwardsMarquee from '@/features/awards/awards-marquee'

// The language-aware Link needs the Next router, which does not exist in this plain render test
vi.mock('@/i18n/routing', () => ({
  Link: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))

const render = (node: React.ReactNode) =>
  renderToStaticMarkup(
    <NextIntlClientProvider locale="en" messages={en} timeZone="UTC">
      {node}
    </NextIntlClientProvider>
  )

const services = [{ title: 'Svc A', description: 'Does A' }]
const steps = (n: number) => Array.from({ length: n }, (_, i) => ({ title: `Step ${i + 1}`, description: `Does ${i + 1}` }))

describe('Services section', () => {
  it('lists what is offered and no longer carries the process steps', () => {
    const html = render(<Services services={services} />)
    expect(html).toContain('Svc A')
    expect(html).not.toContain('How I Work')
  })
})

describe('Timeline section', () => {
  it('shows every step the editor wrote, in order, with a link to the full page', () => {
    const html = render(<Timeline steps={steps(5)} />)
    for (let i = 1; i <= 5; i++) expect(html).toContain(`Step ${i}`)
    expect(html.indexOf('Step 1')).toBeLessThan(html.indexOf('Step 5'))
    expect(html).toContain('/timeline')
  })
  it('renders nothing (heading included) when there are no steps', () => {
    expect(render(<Timeline steps={[]} />)).toBe('')
  })
  it('the full page variant has no section heading and links to contact', () => {
    const html = render(<Timeline steps={steps(2)} variant="full" />)
    expect(html).not.toContain('From First Idea')
    expect(html).toContain('#contact')
  })
})

describe('awards band', () => {
  it('shows the editor\'s awards (repeated for the endless scroll)', () => {
    const html = render(<AwardsMarquee items={['Prize A', 'Prize B']} />)
    expect(html.match(/Prize A/g)).toHaveLength(2)
  })
  it('renders nothing when the list is empty', () => {
    expect(render(<AwardsMarquee items={[]} />)).toBe('')
  })
})
