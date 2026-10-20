import { redirect } from 'next/navigation'

/** `/admin` itself has nothing to show: the sign-in page decides where to go (back to the last page, or the inbox). */
export default function AdminIndex() {
  redirect('/admin/login')
}
