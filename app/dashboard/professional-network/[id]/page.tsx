import { getProfessionalContactById, getAllTags } from '@/utils/supabase/queries-professional-network'
import { notFound } from 'next/navigation'
import ContactDetailClient from './ContactDetailClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [contact, allTags] = await Promise.all([
    getProfessionalContactById(id),
    getAllTags(),
  ])
  if (!contact) notFound()
  return <ContactDetailClient contact={contact} allTags={allTags} />
}
