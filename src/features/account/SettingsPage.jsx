// Account settings with tabs for profile, password, notifications, and deletion.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import PasswordForm from './components/PasswordForm.jsx'
import NotificationPrefs from './components/NotificationPrefs.jsx'

export default function SettingsPage() {
  const { role, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('password')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const tabs = [
    { id: 'password', label: 'Password' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'danger', label: 'Danger Zone' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleDeleteAccount = () => {
    logout()
    navigate('/')
  }

  return (
    <DashboardLayout role={role}>
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-2xl font-bold text-neutral-900">Settings</h1>
        <p className="mb-8 text-sm text-neutral-500">
          Manage your account settings and preferences.
        </p>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-lg border border-neutral-300 bg-neutral-100 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="rounded-2xl border border-neutral-300 bg-white p-8">
          {activeTab === 'password' && (
            <div>
              <h2 className="mb-1 text-lg font-semibold text-neutral-900">Change Password</h2>
              <p className="mb-6 text-sm text-neutral-500">
                Update your password regularly to keep your account secure.
              </p>
              <PasswordForm />
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2 className="mb-1 text-lg font-semibold text-neutral-900">Notification Preferences</h2>
              <p className="mb-6 text-sm text-neutral-500">
                Choose what notifications you receive and how.
              </p>
              <NotificationPrefs />
            </div>
          )}

          {activeTab === 'danger' && (
            <div>
              <h2 className="mb-1 text-lg font-semibold text-danger">Danger Zone</h2>
              <p className="mb-6 text-sm text-neutral-500">
                Irreversible actions for your account.
              </p>

              <div className="space-y-4">
                <div className="rounded-xl border border-neutral-300 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">Log out</p>
                      <p className="text-xs text-neutral-500">Sign out of your account on this device.</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
                    >
                      Log Out
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-danger">Delete account</p>
                      <p className="text-xs text-neutral-500">
                        Permanently delete your account and all associated data. This cannot be undone.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="rounded-lg bg-danger px-4 py-2 text-sm font-semibold text-white hover:bg-danger/90"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Delete confirmation modal — destructive actions require explicit second confirmation */}
              {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                  <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                    <h3 className="text-lg font-bold text-neutral-900">Are you sure?</h3>
                    <p className="mt-2 text-sm text-neutral-500">
                      This action is permanent and cannot be undone. All your data will be deleted.
                    </p>
                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDeleteAccount}
                        className="flex-1 rounded-lg bg-danger px-4 py-2.5 text-sm font-semibold text-white hover:bg-danger/90"
                      >
                        Yes, Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
