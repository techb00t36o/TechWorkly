import { useState } from 'react'

export default function NotificationPrefs() {
  const [prefs, setPrefs] = useState({
    emailApplications: true,
    emailPayments: true,
    emailMessages: true,
    emailMarketing: false,
    pushApplications: true,
    pushPayments: true,
    pushMessages: true,
  })
  const [saved, setSaved] = useState(false)

  const toggle = (key) => {
    // Computed property name dynamically targets the correct pref key
    setPrefs({ ...prefs, [key]: !prefs[key] })
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const sections = [
    {
      title: 'Email notifications',
      items: [
        { key: 'emailApplications', label: 'Job applications & offers' },
        { key: 'emailPayments', label: 'Payments & milestones' },
        { key: 'emailMessages', label: 'New messages' },
        { key: 'emailMarketing', label: 'Product updates & tips' },
      ],
    },
    {
      title: 'Push notifications',
      items: [
        { key: 'pushApplications', label: 'Job applications & offers' },
        { key: 'pushPayments', label: 'Payments & milestones' },
        { key: 'pushMessages', label: 'New messages' },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.title}>
          <h3 className="mb-3 text-sm font-semibold text-neutral-900">{section.title}</h3>
          <div className="space-y-3">
            {section.items.map((item) => (
              <label key={item.key} className="flex items-center justify-between">
                <span className="text-sm text-neutral-700">{item.label}</span>
                <button
                  type="button"
                  onClick={() => toggle(item.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    prefs[item.key] ? 'bg-primary' : 'bg-neutral-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      prefs[item.key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          Save Preferences
        </button>
        {saved && (
          <span className="text-sm font-medium text-success">Saved!</span>
        )}
      </div>
    </div>
  )
}
