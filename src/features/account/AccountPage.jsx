import { useAuth } from '../../context/AuthContext.jsx'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import ProfileForm from './components/ProfileForm.jsx'

export default function AccountPage() {
  const { role } = useAuth()

  return (
    <DashboardLayout role={role}>
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-2xl font-bold text-neutral-900">Profile</h1>
        <p className="mb-8 text-sm text-neutral-500">
          Manage your public profile information.
        </p>

        <div className="rounded-2xl border border-neutral-300 bg-white p-8">
          <ProfileForm />
        </div>
      </div>
    </DashboardLayout>
  )
}
