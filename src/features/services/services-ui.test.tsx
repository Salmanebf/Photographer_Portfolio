import { renderToStaticMarkup } from 'react-dom/server'
import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it } from 'vitest'
import en from '@/messages/en.json'
import Services from './services'
import AwardsMarquee from '@/features/awards/awards-marquee'

const render = (node: React.ReactNode) =>
  renderToStaticMarkup(
    <NextIntlClientProvider locale="en" messages={en} timeZone="UTC">
      {node}
    </NextIntlClientProvider>
  )

const services = [{ title: 'Svc A', description: 'Does A' }]
const steps = (n: number) => Array.from({ length: n }, (_, i) => ({ title: `Step ${i + 1}`, description: `Does ${i + 1}` }))

describe('"How I work" section', () => {
  it('shows every step the editor wrote', () => {
    const html = render(<Services services={services} process={steps(3)} />)
    for (const t of ['Step 1', 'Step 2', 'Step 3']) expect(html).toContain(t)
    expect(html).toContain('How I Work')
  })
  it('hides the whole section (heading included) when there are no steps', () => {
    const html = render(<Services services={services} process={[]} />)
    expect(html).toContain('Svc A')
    expect(html).not.toContain('How I Work')
  })
  it('adapts the grid to the number of steps', () => {
    const cols = (n: number) => render(<Services services={services} process={steps(n)} />).match(/lg:grid-cols-(\d)/)?.[0]
    expect(cols(2)).toBe('lg:grid-cols-2')
    expect(cols(3)).toBe('lg:grid-cols-3')
    expect(cols(4)).toBe('lg:grid-cols-4')
    expect(cols(6)).toBe('lg:grid-cols-3')
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
