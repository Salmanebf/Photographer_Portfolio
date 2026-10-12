import { requireAdmin } from '@/shared/admin/guard'
import { adminText } from '@/shared/admin/text'
import { contactStore } from '@/features/contact/store'
import Inbox from '@/features/contact/ui/inbox'
import { deleteAction, setReadAction } from './actions'

export const dynamic = 'force-dynamic'

const LIMIT = 200

export default async function MessagesPage() {
  await requireAdmin('/admin/messages')
  const { t, locale } = await adminText()
  const messages = await contactStore().list(LIMIT)
  return (
    <Inbox
      messages={messages}
      text={t}
      locale={locale}
      limit={LIMIT}
      onSetRead={setReadAction}
      onDelete={deleteAction}
    />
  )
}
