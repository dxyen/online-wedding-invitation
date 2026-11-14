import type { Wedding } from '../lib/types'

export default function Cover({ wedding, onOpen }: { wedding: Wedding; onOpen: () => void }) {
  return (
    <section id="top" className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-cream px-4 py-16 text-center">
      <div className="pointer-events-none absolute inset-0 opacity-40" style={{ background: 'radial-gradient(circle at 50% 20%, #E6C87A33, transparent 60%)' }} />
      <p className="animate-fade-in font-hand text-3xl text-gold md:text-4xl">Thiệp Mời Cưới</p>
      <div className="animate-fade-up mt-6 flex h-28 w-28 items-center justify-center rounded-full border-2 border-gold/70 font-display text-4xl font-semibold text-brown-dark">
        T <span className="animate-heart mx-1 text-2xl text-gold">♥</span> Y
      </div>
      <h1 className="animate-fade-up mt-8 font-display text-4xl font-semibold leading-tight text-brown-dark md:text-6xl">
        Thanh Trúc <span className="font-hand text-gold">&amp;</span> Xuân Yên
      </h1>
      <p className="mt-4 text-sm tracking-[0.3em] text-brown/70">03 . 01 . 2026</p>
      <p className="mt-2 text-sm text-brown/70">{wedding.venueName} — {wedding.venueAddress}</p>
      <button type="button" onClick={onOpen} className="btn-gold animate-float-slow mt-10">
        ✉ Mở Thiệp
      </button>
      <p className="mt-4 text-xs text-brown/50">Nhấn “Mở Thiệp” để xem toàn bộ nội dung</p>
    </section>
  )
}
