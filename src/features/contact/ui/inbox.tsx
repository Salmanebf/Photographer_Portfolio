import type { StoredContactMessage } from '../store'

type Action = (formData: FormData) => void | Promise<void>

interface InboxProps {
  messages: StoredContactMessage[]
  /** The `admin` messages in the owner's language */
  text: Record<string, string>
  locale: string
  /** How many messages were asked for (to say when the list may be cut) */
  limit: number
  onSetRead: Action
  onDelete: Action
}

const fill = (s: string, values: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? ''))

/** The owner's list of contact-form messages. Plain server-rendered HTML; buttons post to server actions. */
export default function Inbox({ messages, text: t, locale, limit, onSetRead, onDelete }: InboxProps) {
  const when = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  })
  const languageName = (code: string | null) =>
    code ? (new Intl.DisplayNames([locale], { type: 'language' }).of(code) ?? code) : null
  const unread = messages.filter((m) => !m.read).length

  return (
    <section>
      <h1 className="text-3xl font-bold tracking-tight mb-2">{t.messagesTitle}</h1>
      <p className="text-sm text-muted-foreground mb-2">{t.messagesIntro}</p>
      <p className="text-[11px] uppercase tracking-[0.25em] text-gold mb-10">
        {fill(t.unreadCount, { count: unread })}
      </p>

      {messages.length === 0 && <p className="text-muted-foreground">{t.empty}</p>}

      <ul className="space-y-6">
        {messages.map((m) => {
          const lang = languageName(m.locale)
          const details = Object.entries(m.details ?? {})
          return (
            <li
              key={m.id}
              className={`border p-6 ${m.read ? 'border-border/40' : 'border-gold/40 bg-gold/[0.03]'}`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 mb-4">
                <h2 className="text-lg font-semibold">
                  {!m.read && (
                    <span className="me-3 align-middle text-[9px] uppercase tracking-[0.3em] text-gold">
                      {t.newBadge}
                    </span>
                  )}
                  {m.subject}
                </h2>
                <time dateTime={m.createdAt} className="text-xs text-muted-foreground tabular-nums">
                  {when.format(new Date(m.createdAt))} UTC
                </time>
              </div>

              <p className="text-sm mb-1">
                {m.name} ·{' '}
                <a href={`mailto:${m.email}`} className="text-gold hover:underline">
                  {m.email}
                </a>
              </p>
              {lang && (
                <p className="text-xs text-muted-foreground mb-4">
                  {t.language}: {lang} — {fill(t.replyIn, { language: lang })}
                </p>
              )}

              <p className="whitespace-pre-wrap break-words text-sm leading-relaxed mt-4 mb-4">{m.message}</p>

              {details.length > 0 && (
                <dl className="text-xs text-muted-foreground mb-4">
                  <dt className="uppercase tracking-[0.25em] mb-1">{t.extraAnswers}</dt>
                  {details.map(([k, v]) => (
                    <dd key={k}>
                      {k}: {v}
                    </dd>
                  ))}
                </dl>
              )}

              <div className="flex flex-wrap items-center gap-6 text-[11px] uppercase tracking-[0.2em]">
                <a
                  href={`mailto:${m.email}?subject=${encodeURIComponent('Re: ' + m.subject)}`}
                  className="text-gold hover:underline"
                >
                  {t.reply}
                </a>
                <form action={onSetRead}>
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="read" value={m.read ? '0' : '1'} />
                  <button className="uppercase tracking-[0.2em] hover:text-gold transition-colors">
                    {m.read ? t.markUnread : t.markRead}
                  </button>
                </form>
                {/* two steps without any script: open, then confirm */}
                <details className="group">
                  <summary className="cursor-pointer list-none text-muted-foreground hover:text-destructive transition-colors">
                    {t.delete}
                  </summary>
                  <form action={onDelete} className="mt-3 flex items-center gap-4 normal-case tracking-normal">
                    <input type="hidden" name="id" value={m.id} />
                    <span className="text-xs text-muted-foreground">{t.deleteConfirm}</span>
                    <button className="uppercase tracking-[0.2em] text-destructive hover:underline">
                      {t.delete}
                    </button>
                  </form>
                </details>
              </div>
            </li>
          )
        })}
      </ul>

      {messages.length >= limit && (
        <p className="text-xs text-muted-foreground mt-8">{fill(t.showingLatest, { count: limit })}</p>
      )}
    </section>
  )
}
