import { getProfessionalContactById } from '@/utils/supabase/queries-professional-network'
import { notFound } from 'next/navigation'
import ContactDetailClient from './ContactDetailClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const contact = await getProfessionalContactById(id)
  if (!contact) notFound()
  return <ContactDetailClient contact={contact} />
}
