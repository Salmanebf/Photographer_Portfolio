'use client'

import { useState } from 'react'
import { Send, MapPin, Mail, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useScrollReveal } from '@/hooks/use-scroll-effects'
import SectionHeading from './section-heading'

const contactInfo = [
  { icon: MapPin, label: 'Based In', value: 'Los Angeles, California' },
  { icon: Mail, label: 'Email', value: 'hello@alexrivera.film' },
  { icon: Clock, label: 'Response', value: 'Within 24 hours' },
]

export default function Contact() {
  const { toast } = useToast()
  const { ref: formRef, isRevealed: formRevealed } = useScrollReveal(0.1)
  const { ref: infoRef, isRevealed: infoRevealed } = useScrollReveal(0.1)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        throw new Error('Failed')
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again or email me directly.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputCls =
    'bg-transparent border-0 border-b border-border/60 focus:border-gold rounded-none h-12 px-0 placeholder:text-muted-foreground/30 focus-visible:ring-0 focus-visible:border-gold transition-colors text-foreground'

  return (
    <section id="contact" className="py-24 sm:py-36 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading
          label="Contact"
          title="Let's Tell Your Story"
          description="Have a story that needs to be told? I'd love to hear about it."
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16 items-start">
          {/* Form */}
          <div ref={formRef} className={`slide-left ${formRevealed ? 'revealed' : ''}`}>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mb-8">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground block">
                    Name
                  </label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    className={inputCls}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground block">
                    Email
                  </label>
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <label className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground block">
                  Project
                </label>
                <Input
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Tell me about your documentary idea"
                  className={inputCls}
                />
              </div>

              <div className="space-y-2 mb-10">
                <label className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground block">
                  Message
                </label>
                <Textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Your story, vision, and timeline..."
                  rows={5}
                  className="bg-transparent border-0 border-b border-border/60 focus:border-gold rounded-none px-0 resize-none placeholder:text-muted-foreground/30 focus-visible:ring-0 focus-visible:border-gold transition-colors text-foreground"
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

          {/* Info panel */}
          <div
            ref={infoRef}
            className={`slide-right ${infoRevealed ? 'revealed' : ''} space-y-10`}
          >
            {/* Availability */}
            <div className="border border-gold/20 p-6 bg-gold/[0.03]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] uppercase tracking-[0.4em] text-emerald-400 font-semibold">
                  Available for Projects
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Currently accepting documentary projects for 2026. Let&apos;s create something
                meaningful together.
              </p>
            </div>

            {/* Contact info */}
            <div className="space-y-6">
              {contactInfo.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-9 h-9 flex items-center justify-center bg-gold/[0.08] border border-gold/15 shrink-0">
                      <Icon size={15} className="text-gold" />
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground mb-0.5">
                        {item.label}
                      </div>
                      <div className="text-sm text-foreground">{item.value}</div>
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
              <p className="text-sm text-muted-foreground leading-relaxed">
                Monday – Friday, 9am – 6pm PST.
                <br />
                In the field globally — replies may take longer during shoots.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
