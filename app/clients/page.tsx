import { getClients } from '@/utils/supabase/queries'
import ClientsClient from './ClientsClient'

export const revalidate = 0 // Disable caching for MVP

export default async function ClientsPage() {
  const clients = await getClients()
  return <ClientsClient initialClients={clients} />
}
