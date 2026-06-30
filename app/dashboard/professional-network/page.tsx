import { getProfessionalContacts, getAllTags } from '@/utils/supabase/queries-professional-network'
import ProfessionalNetworkClient from './ProfessionalNetworkClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ProfessionalNetworkPage() {
  const [contacts, allTags] = await Promise.all([
    getProfessionalContacts(),
    getAllTags(),
  ])
  const professionTags = allTags.filter((t) => t.category === 'profession')
  return <ProfessionalNetworkClient initialContacts={contacts} professionTags={professionTags} />
}
