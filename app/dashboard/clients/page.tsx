import { getClients } from '@/utils/supabase/queries'
import ClientsClient from './ClientsClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ClientsPage() {
  const clients = await getClients()
  return <ClientsClient initialClients={clients} />
}
