// Shared marketing page shell with header, content slot, and footer.
import Header from './Header.jsx'
import Footer from './Footer.jsx'

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-white text-neutral-700">
      {/* ─── Header ─── */}
      <Header />
      {/* ─── Page content ─── */}
      <main>{children}</main>
      {/* ─── Footer ─── */}
      <Footer />
    </div>
  )
}
