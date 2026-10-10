'use client'

import { useState } from 'react'
import { Send, MapPin, Mail, Clock } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'
import { useToast } from '@/shared/hooks/use-toast'
import { useScrollReveal } from '@/shared/hooks/use-scroll-effects'
import SectionHeading from '@/shared/ui/section-heading'
import type { SiteSettings } from '@/lib/queries'

interface ContactProps {
  settings: SiteSettings
}

export default function Contact({ settings }: ContactProps) {
  const { toast } = useToast()
  const { ref: formRef, isRevealed: formRevealed } = useScrollReveal(0.1)
  const { ref: infoRef, isRevealed: infoRevealed } = useScrollReveal(0.1)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    /** Honeypot — must remain empty */
    website: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Honeypot check (silently succeed if filled)
    if (formData.website) {
      toast({
        title: 'Message sent',
        description: "Thank you for reaching out. I'll respond within 24 hours.",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        toast({
          title: 'Message sent',
          description: "Thank you for reaching out. I'll respond within 24 hours.",
        })
        setFormData({ name: '', email: '', subject: '', message: '', website: '' })
      } else {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'Failed')
      }
    } catch (err) {
      toast({
        title: 'Error',
        description:
          err instanceof Error
            ? err.message
            : 'Something went wrong. Please try again or email me directly.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputCls =
    'bg-transparent border-0 border-b border-border/60 focus:border-gold rounded-none h-12 px-0 placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:border-gold transition-colors text-foreground'

  const contactInfo = [
    { icon: MapPin, label: 'Based In', value: settings.contact.location },
    { icon: Mail, label: 'Email', value: settings.contact.email },
    { icon: Clock, label: 'Response', value: settings.contact.responseTime },
  ]

  return (
    <section id="contact" className="py-24 sm:py-36 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading
          label="Contact"
          title="Let's Tell Your Story"
          description="Have a story that needs to be told? I'd love to hear about it."
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16 items-start">
          <div ref={formRef} className={`slide-left ${formRevealed ? 'revealed' : ''}`}>
            <form onSubmit={handleSubmit} noValidate>
              {/* Honeypot - hidden from users */}
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <label>
                  Website (leave empty)
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mb-8">
                <div className="space-y-2">
                  <label
                    htmlFor="contact-name"
                    className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground block"
                  >
                    Name
                  </label>
                  <Input
                    id="contact-name"
                    required
                    autoComplete="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    className={inputCls}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="contact-email"
                    className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground block"
                  >
                    Email
                  </label>
                  <Input
                    id="contact-email"
                    required
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <label
                  htmlFor="contact-subject"
                  className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground block"
                >
                  Project
                </label>
                <Input
                  id="contact-subject"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Tell me about your documentary idea"
                  className={inputCls}
                />
              </div>

              <div className="space-y-2 mb-10">
                <label
                  htmlFor="contact-message"
                  className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground block"
                >
                  Message
                </label>
                <Textarea
                  id="contact-message"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Your story, vision, and timeline..."
                  rows={5}
                  className="bg-transparent border-0 border-b border-border/60 focus:border-gold rounded-none px-0 resize-none placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:border-gold transition-colors text-foreground"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gold text-background hover:bg-gold/90 h-13 py-4 text-[11px] uppercase tracking-[0.3em] font-semibold transition-all duration-300 rounded-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-3">
                    Send Message <Send size={14} />
                  </span>
                )}
              </Button>
            </form>
          </div>

          <div
            ref={infoRef}
            className={`slide-right ${infoRevealed ? 'revealed' : ''} space-y-10`}
          >
            {settings.contact.isAvailable && (
              <div className="border border-gold/20 p-6 bg-gold/[0.03]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] uppercase tracking-[0.4em] text-emerald-400 font-semibold">
                    Available for Projects
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Currently accepting documentary projects for{' '}
                  {settings.contact.availabilityYear}. Let&apos;s create something
                  meaningful together.
                </p>
              </div>
            )}

            <div className="space-y-6">
              {contactInfo.map((item) => {
                const Icon = item.icon
                const isEmail = item.label === 'Email'
                return (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-9 h-9 flex items-center justify-center bg-gold/[0.08] border border-gold/15 shrink-0">
                      <Icon size={15} className="text-gold" />
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground mb-0.5">
                        {item.label}
                      </div>
                      {isEmail ? (
                        <a
                          href={`mailto:${item.value}`}
                          className="text-sm text-foreground hover:text-gold transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <div className="text-sm text-foreground">{item.value}</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="section-divider" />

            <div>
              <h3 className="text-[9px] uppercase tracking-[0.4em] text-gold font-medium mb-3">
                Studio Hours
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {settings.contact.studioHours}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
