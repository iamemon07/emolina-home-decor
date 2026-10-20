import { Sidebar } from "@/components/admin/Sidebar";
import { requireAdminPage } from "@/lib/auth";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminPage();
  return (
    <>
      <Sidebar user={{ name: session.name, email: session.email, role: session.role }} />
      <main className="lg:pl-64 print:pl-0">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10 print:max-w-none print:p-0">{children}</div>
      </main>
    </>
  );
}
