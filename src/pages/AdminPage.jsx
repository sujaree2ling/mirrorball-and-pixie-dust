import { AdminPanelLayout } from '@/components/AdminPanelLayout'
import { getCurrentUser } from '@/lib/auth'

export function AdminPage() {
  const user = getCurrentUser()

  return (
    <AdminPanelLayout title="Article management" activePage="/admin">
      <p className="text-sm text-[#75716B]">
        Welcome, {user?.name}. Article management coming soon.
      </p>
    </AdminPanelLayout>
  )
}
