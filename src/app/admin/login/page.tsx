import { notFound, redirect } from 'next/navigation'
import { adminState, safeNext } from '@/shared/admin/session'
import { isSignedIn } from '@/shared/admin/guard'
import { adminText } from '@/shared/admin/text'
import { signIn } from '../actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>
}) {
  if (adminState() === 'closed') notFound()
  const { next, error } = await searchParams
  const target = safeNext(next)
  // Already signed in (or open in development): nothing to ask
  if (await isSignedIn()) redirect(target)
  const { t } = await adminText()

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-3">{t.signInTitle}</h1>
      <p className="text-sm text-muted-foreground mb-8">{t.signInIntro}</p>
      <form action={signIn} className="space-y-5">
        <input type="hidden" name="next" value={target} />
        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{t.password}</span>
          <input
            type="password"
            name="password"
            required
            autoFocus
            autoComplete="current-password"
            className="mt-2 w-full bg-transparent border-b border-border focus:border-gold outline-none py-2"
          />
        </label>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error === 'rate' ? t.tooManyAttempts : t.wrongPassword}
          </p>
        )}
        <button className="inline-flex items-center px-8 py-3 bg-gold text-background text-[11px] uppercase tracking-[0.25em] font-semibold hover:bg-gold/90 transition-colors">
          {t.signIn}
        </button>
      </form>
    </div>
  )
}
