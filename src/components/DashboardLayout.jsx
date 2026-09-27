import Sidebar from './Sidebar.jsx'

export default function DashboardLayout({ children, role }) {
  return (
    <div className="min-h-screen bg-neutral-100">
      <Sidebar role={role} />
      <div className="md:pl-64">
        <main className="p-6 pt-20 md:pt-6">{children}</main>
      </div>
    </div>
  )
}
