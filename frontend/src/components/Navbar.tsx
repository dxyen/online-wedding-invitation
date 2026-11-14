export default function Navbar() {
  const links = [
    { href: '#invitation', label: 'Lời mời' },
    { href: '#story', label: 'Câu chuyện' },
    { href: '#album', label: 'Album' },
    { href: '#map', label: 'Bản đồ' },
    { href: '#rsvp', label: 'Xác nhận' },
    { href: '#wishes', label: 'Lưu bút' }
  ]
  return (
    <header className="sticky top-0 z-40 border-b border-brown/10 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <a href="#top" className="font-display text-lg font-semibold text-brown-dark">T <span className="text-gold">♥</span> Y</a>
        <nav className="hidden gap-5 text-sm font-medium text-brown md:flex">
          {links.map((l) => <a key={l.href} href={l.href} className="hover:text-gold">{l.label}</a>)}
        </nav>
        <a href="#rsvp" className="rounded-full bg-brown px-4 py-2 text-xs font-semibold text-cream hover:bg-brown-dark">Xác nhận tham dự</a>
      </div>
    </header>
  )
}
