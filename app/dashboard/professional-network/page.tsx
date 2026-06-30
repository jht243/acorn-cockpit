import { getProfessionalContacts } from '@/utils/supabase/queries-professional-network'
import ProfessionalNetworkClient from './ProfessionalNetworkClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ProfessionalNetworkPage() {
  const contacts = await getProfessionalContacts()
  return <ProfessionalNetworkClient initialContacts={contacts} />
}
