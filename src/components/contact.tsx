'use client'

import { useState } from 'react'
import { Send, MapPin, Phone, Mail, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useScrollReveal } from '@/hooks/use-scroll-effects'
import SectionHeading from './section-heading'

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
          title: 'Message Sent!',
          description: "Thank you for reaching out. I'll get back to you within 24 hours.",
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

  const contactInfo = [
    { icon: MapPin, label: 'Based In', value: 'Los Angeles, California' },
    { icon: Phone, label: 'Phone', value: '+1 (323) 555-0147' },
    { icon: Mail, label: 'Email', value: 'hello@alexrivera.film' },
    { icon: Clock, label: 'Response Time', value: 'Within 24 hours' },
  ]

  return (
    <section id="contact" className="py-24 sm:py-36 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Contact"
          title="Let's Tell Your Story"
          description="Have a story that needs to be told? I'd love to hear about it. Let's discuss your documentary project."
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Form */}
          <div ref={formRef} className={`lg:col-span-3 slide-left ${formRevealed ? 'revealed' : ''}`}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Name</label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    className="bg-muted/30 border-border/50 focus:border-[#ffb005] focus:ring-[#ffb005]/20 h-11 placeholder:text-muted-foreground/40"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Email</label>
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="bg-muted/30 border-border/50 focus:border-[#ffb005] focus:ring-[#ffb005]/20 h-11 placeholder:text-muted-foreground/40"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Subject</label>
                <Input
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Documentary project inquiry"
                  className="bg-muted/30 border-border/50 focus:border-[#ffb005] focus:ring-[#ffb005]/20 h-11 placeholder:text-muted-foreground/40"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Message</label>
                <Textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell me about your story, vision, and timeline..."
                  rows={6}
                  className="bg-muted/30 border-border/50 focus:border-[#ffb005] focus:ring-[#ffb005]/20 resize-none placeholder:text-muted-foreground/40"
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-[#ffb005] text-black hover:bg-[#ffb005]/90 h-12 px-8 text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Send Message <Send size={16} />
                  </span>
                )}
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div ref={infoRef} className={`lg:col-span-2 space-y-8 slide-right ${infoRevealed ? 'revealed' : ''}`}>
            <div className="space-y-5">
              {contactInfo.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-[#ffb005]/10 shrink-0">
                      <Icon size={18} className="text-[#ffb005]" />
                    </div>
                    <div>
                      <h4 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium mb-0.5">{item.label}</h4>
                      <p className="text-foreground text-sm">{item.value}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="section-divider" />

            {/* Availability */}
            <div className="bg-card/50 border border-border/50 p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-green-500 font-semibold">
                  Available for Projects
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Currently accepting documentary projects for 2025. Let&apos;s create something meaningful together.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
