import { ArrowLeft } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'

export default async function NotFound() {
  const t = await getTranslations('notFound')
  return (
    <main
      id="main"
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
    >
      <span className="text-[9px] uppercase tracking-[0.5em] text-gold mb-4">
        {t('eyebrow')}
      </span>
      <h1 className="text-6xl sm:text-8xl font-bold tracking-tight mb-4 text-gradient">
        {t('title')}
      </h1>
      <p className="text-muted-foreground max-w-md mb-10">{t('description')}</p>
      <Link
        href="/"
        className="inline-flex items-center gap-3 px-6 py-3 border border-gold/30 hover:bg-gold hover:text-background text-gold text-[10px] uppercase tracking-[0.3em] font-semibold transition-all duration-300"
      >
        <ArrowLeft size={14} className="rtl:rotate-180" />
        {t('back')}
      </Link>
    </main>
  )
}
