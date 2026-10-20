'use server'

import { revalidatePath } from 'next/cache'
import { contactStore } from '@/features/contact/store'
import { assertAdmin } from '@/shared/admin/guard'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function checked(formData: FormData): Promise<string> {
  await assertAdmin()
  const id = formData.get('id')
  if (typeof id !== 'string' || !UUID.test(id)) throw new Error('Bad id')
  return id
}

export async function setReadAction(formData: FormData) {
  const id = await checked(formData)
  await contactStore().setRead(id, formData.get('read') === '1')
  revalidatePath('/admin/messages')
}

export async function deleteAction(formData: FormData) {
  const id = await checked(formData)
  await contactStore().remove(id)
  revalidatePath('/admin/messages')
}
