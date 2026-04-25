'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, MapPin, Phone, Mail, Instagram, Youtube, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import SectionHeading from './section-heading'

export default function Contact() {
  const { toast } = useToast()
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
        throw new Error('Failed to send message')
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
    { icon: MapPin, label: 'Location', value: 'Los Angeles, California' },
    { icon: Phone, label: 'Phone', value: '+1 (323) 555-0147' },
    { icon: Mail, label: 'Email', value: 'hello@alexrivera.com' },
    { icon: Clock, label: 'Response Time', value: 'Within 24 hours' },
  ]

  const socials = [
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Youtube, label: 'YouTube', href: '#' },
  ]

  return (
    <section id="contact" className="py-20 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Contact"
          title="Let's Create Together"
          description="Have a project in mind? I'd love to hear about it. Let's discuss how we can bring your vision to life."
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                    Name
                  </label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    className="bg-muted/50 border-border focus:border-amber focus:ring-amber/20 h-11 placeholder:text-muted-foreground/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                    Email
                  </label>
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="bg-muted/50 border-border focus:border-amber focus:ring-amber/20 h-11 placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                  Subject
                </label>
                <Input
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Project type or inquiry"
                  className="bg-muted/50 border-border focus:border-amber focus:ring-amber/20 h-11 placeholder:text-muted-foreground/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                  Message
                </label>
                <Textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell me about your project, vision, and timeline..."
                  rows={6}
                  className="bg-muted/50 border-border focus:border-amber focus:ring-amber/20 resize-none placeholder:text-muted-foreground/50"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-amber text-amber-foreground hover:bg-amber/90 h-12 px-8 text-sm uppercase tracking-widest font-semibold transition-all duration-300"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-amber-foreground/30 border-t-amber-foreground rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Send Message
                    <Send size={16} />
                  </span>
                )}
              </Button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Info items */}
            <div className="space-y-5">
              {contactInfo.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-sm bg-amber/10 flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-amber" />
                    </div>
                    <div>
                      <h4 className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-0.5">
                        {item.label}
                      </h4>
                      <p className="text-foreground text-sm">{item.value}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Divider */}
            <div className="section-divider" />

            {/* Social Links */}
            <div>
              <h4 className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-4">
                Follow Me
              </h4>
              <div className="flex items-center gap-3">
                {socials.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="w-10 h-10 rounded-sm border border-border flex items-center justify-center text-muted-foreground hover:text-amber hover:border-amber/30 transition-all duration-300"
                    >
                      <Icon size={18} />
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Availability badge */}
            <div className="bg-card border border-border rounded-sm p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs uppercase tracking-widest text-green-500 font-semibold">
                  Available for Bookings
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Currently accepting projects for Q2 2025. Book early to secure your dates.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
