import type { Testimonial } from '../types'

/** Placeholder testimonials (English); French in `fr.ts` (matched by `id`). */
export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Dr. Maria Santos',
    role: 'Linguist, Subject of "Vanishing Voices"',
    content:
      "Alex didn't just document our work — she became part of the journey. The film has brought more attention to language preservation than a thousand academic papers ever could.",
    project: 'Vanishing Voices',
  },
  {
    id: 't2',
    name: 'Ingrid Larsen',
    role: 'Producer, "Beneath the Ice"',
    content:
      "Working with Alex on the Arctic expedition was a masterclass in documentary filmmaking. She endured -40°C temperatures while producing some of the most breathtaking footage I've ever seen.",
    project: 'Beneath the Ice',
  },
  {
    id: 't3',
    name: 'Denise Williams',
    role: 'Community Leader, Detroit',
    content:
      "She earned our trust by showing up — not just with a camera, but with her hands in the soil. 'Urban Roots' tells our story with the dignity and honesty we deserve.",
    project: 'Urban Roots',
  },
  {
    id: 't4',
    name: 'Yuki Tanaka',
    role: 'Co-Producer, "The Last Craftsman"',
    content:
      "Alex spent three years building the relationship that made 'The Last Craftsman' possible. That patience and respect is what sets her apart. A masterpiece of restraint and emotional depth.",
    project: 'The Last Craftsman',
  },
]
