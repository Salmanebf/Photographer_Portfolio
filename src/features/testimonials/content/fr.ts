import type { Testimonial } from '../types'

/** French testimonial translations, keyed by id (draft translation). */
export const testimonials: Record<string, Partial<Pick<Testimonial, 'role' | 'content'>>> = {
  t1: {
    role: 'Linguiste, sujet de « Voix en voie de disparition »',
    content:
      "Alex n'a pas seulement documenté notre travail — elle a fait partie du voyage. Le film a attiré plus d'attention sur la préservation des langues que mille articles universitaires n'auraient pu le faire.",
  },
  t2: {
    role: 'Productrice, « Sous la glace »',
    content:
      "Travailler avec Alex pendant l'expédition arctique a été une leçon de cinéma documentaire. Elle a supporté des températures de -40 °C tout en réalisant certaines des images les plus saisissantes que j'aie jamais vues.",
  },
  t3: {
    role: 'Responsable communautaire, Détroit',
    content:
      "Elle a gagné notre confiance en étant présente — pas seulement avec une caméra, mais les mains dans la terre. « Racines urbaines » raconte notre histoire avec la dignité et l'honnêteté que nous méritons.",
  },
  t4: {
    role: 'Coproductrice, « Le Dernier Artisan »',
    content:
      "Alex a passé trois ans à construire la relation qui a rendu « Le Dernier Artisan » possible. Cette patience et ce respect la distinguent. Un chef-d'œuvre de retenue et de profondeur émotionnelle.",
  },
}
