// Role picker screen letting users choose between worker and company accounts.
import { Link } from 'react-router-dom'
import AppLayout from '../../components/AppLayout.jsx'

const roles = [
  {
    value: 'worker',
    label: 'I want to find work',
    desc: 'Apply to jobs, join teams, get hired.',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
    ),
  },
  {
    value: 'company',
    label: 'I want to hire',
    desc: 'Post jobs, build teams, hire talent.',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
  },
]

export default function RoleSelectionPage() {
  return (
    <AppLayout>
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          <div className="rounded-2xl border border-neutral-300 bg-white p-8 shadow-sm">
            <h1 className="text-center text-2xl font-bold text-neutral-900">
              How do you want to use TechWorkly?
            </h1>
            <p className="mt-2 text-center text-sm text-neutral-500">
              Choose your path to get started. You can always switch later.
            </p>

            {/* ─── Role option cards ─── */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {roles.map((r) => (
                <Link
                  key={r.value}
                  to={`/signup?role=${r.value}`}
                  className="group flex flex-col items-center rounded-2xl border border-neutral-300 bg-white p-6 text-center transition hover:border-primary hover:shadow-sm"
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-primary transition group-hover:bg-primary group-hover:text-white">
                    {r.icon}
                  </div>
                  <p className="text-lg font-semibold text-neutral-900">{r.label}</p>
                  <p className="mt-1 text-sm text-neutral-500">{r.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* ─── Login link ─── */}
          <p className="mt-4 text-center text-sm text-neutral-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:text-primary-dark">
              Log In
            </Link>
          </p>
        </div>
      </main>
    </AppLayout>
  )
}
