import Sidebar from "../../../components/Sidebar";
import TopBar from "../../../components/TopBar";
import { createServiceRoleClient } from "@/utils/supabase/service";
import DocumentsClient from "./DocumentsClient";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DocumentsPage() {
  const supabase = createServiceRoleClient();

  const { data: docs } = await supabase
    .from('documents')
    .select('id, name, tag, source, uploaded_at, storage_path, client_id, clients(id, name)')
    .order('uploaded_at', { ascending: false });

  const rows = (docs || []).map((d: any) => ({
    id: d.id,
    name: d.name,
    tag: d.tag,
    source: d.source,
    uploaded: d.uploaded_at ? new Date(d.uploaded_at).toLocaleDateString() : '—',
    storagePath: d.storage_path,
    clientId: Array.isArray(d.clients) ? d.clients[0]?.id : d.clients?.id,
    clientName: Array.isArray(d.clients) ? d.clients[0]?.name : d.clients?.name,
  }));

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Documents" />
        <main className="flex-1 p-4 sm:p-6">
          <DocumentsClient rows={rows} />
        </main>
      </div>
    </div>
  );
}
