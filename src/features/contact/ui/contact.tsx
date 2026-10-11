'use client'

import { useState } from 'react'
import { Send, MapPin, Mail, Clock } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'
import { useToast } from '@/shared/hooks/use-toast'
import { useScrollReveal } from '@/shared/hooks/use-scroll-effects'
import SectionHeading from '@/shared/ui/section-heading'
import type { SiteSettings } from '@/shared/content/types'
import { isContactErrorCode } from '../error-codes'

/** A failed submission, carrying the server's error code so it can be shown in the visitor's language. */
class ContactError extends Error {
  constructor(readonly code?: string) {
    super(code)
  }
}

interface ContactProps {
  settings: SiteSettings
}

export default function Contact({ settings }: ContactProps) {
  const t = useTranslations('contact')
  const locale = useLocale()
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
      toast({ title: t('successTitle'), description: t('successBody') })
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, locale }),
      })
      if (res.ok) {
        toast({ title: t('successTitle'), description: t('successBody') })
        setFormData({ name: '', email: '', subject: '', message: '', website: '' })
      } else {
        const body = await res.json().catch(() => ({}))
        throw new ContactError(body.code)
      }
    } catch (err) {
      const code = err instanceof ContactError ? err.code : undefined
      toast({
        title: t('errorTitle'),
        description:
          isContactErrorCode(code) && t.has(`errors.${code}`)
            ? t(`errors.${code}`)
            : t('errorGeneric'),
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputCls =
    'bg-transparent border-0 border-b border-border/60 focus:border-gold rounded-none h-12 px-0 placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:border-gold transition-colors text-foreground'

  const contactInfo = [
    { icon: MapPin, label: t('basedIn'), value: settings.contact.location },
    { icon: Mail, label: t('emailLabel'), value: settings.contact.email, isEmail: true },
    { icon: Clock, label: t('response'), value: settings.contact.responseTime },
  ]

  return (
    <section id="contact" className="py-24 sm:py-36 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading
          label={t('label')}
          title={t('title')}
          description={t('description')}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16 items-start">
          <div ref={formRef} className={`slide-left ${formRevealed ? 'revealed' : ''}`}>
            <form onSubmit={handleSubmit} noValidate>
              {/* Honeypot - hidden from users */}
              <div className="absolute -start-[9999px]" aria-hidden="true">
                <label>
                  {t('honeypot')}
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
                    {t('name')}
                  </label>
                  <Input
                    id="contact-name"
                    required
                    autoComplete="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t('namePlaceholder')}
                    className={inputCls}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="contact-email"
                    className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground block"
                  >
                    {t('email')}
                  </label>
                  <Input
                    id="contact-email"
                    required
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t('emailPlaceholder')}
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <label
                  htmlFor="contact-subject"
                  className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground block"
                >
                  {t('project')}
                </label>
                <Input
                  id="contact-subject"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder={t('projectPlaceholder')}
                  className={inputCls}
                />
              </div>

              <div className="space-y-2 mb-10">
                <label
                  htmlFor="contact-message"
                  className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground block"
                >
                  {t('message')}
                </label>
                <Textarea
                  id="contact-message"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t('messagePlaceholder')}
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
                    {t('sending')}
                  </span>
                ) : (
                  <span className="flex items-center gap-3">
                    {t('send')} <Send size={14} className="rtl:-scale-x-100" />
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
                    {t('available')}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t('availableBody', { year: settings.contact.availabilityYear })}
                </p>
              </div>
            )}

            <div className="space-y-6">
              {contactInfo.map((item) => {
                const Icon = item.icon
                const isEmail = 'isEmail' in item && item.isEmail
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
                {t('studioHours')}
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
