import type { Wedding } from '../lib/types'
import { handleImgError } from '../lib/fallback'

// 14 cánh hoa rơi trên bìa (artifact #cover): rơi 7–14s, delay 0–6s.
const PETALS = [
  { left: 4, dur: 9, delay: 0 },
  { left: 12, dur: 12, delay: 1.5 },
  { left: 20, dur: 8, delay: 3 },
  { left: 28, dur: 13, delay: 0.5 },
  { left: 36, dur: 10, delay: 2 },
  { left: 44, dur: 14, delay: 4 },
  { left: 52, dur: 9.5, delay: 1 },
  { left: 60, dur: 11, delay: 5 },
  { left: 68, dur: 8.5, delay: 2.5 },
  { left: 74, dur: 12.5, delay: 0.8 },
  { left: 82, dur: 10.5, delay: 3.5 },
  { left: 88, dur: 13.5, delay: 1.2 },
  { left: 94, dur: 7, delay: 4.5 },
  { left: 97, dur: 11.5, delay: 6 }
]

export default function Cover({ wedding, coverPhoto, onOpen }: { wedding: Wedding; coverPhoto?: string; onOpen: () => void }) {
  return (
    <section className="cover-overlay" aria-label="Bìa thiệp cưới">
      {PETALS.map((p, i) => (
        <span
          key={i}
          className="petal"
          style={{ left: `${p.left}%`, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` }}
          aria-hidden="true"
        />
      ))}
      <div className="cover-card">
        <p className="kicker">Thiệp Mời Cưới</p>
        <p className="cover-orn" aria-hidden="true">❦</p>
        <h1 className="cover-names">
          {wedding.brideName} <span className="amp">&amp;</span> {wedding.groomName}
        </h1>
        <p className="cover-date">27 · 12 · 2026</p>
        <div className="arch">
          {coverPhoto ? (
            <img src={coverPhoto} alt={`${wedding.brideName} & ${wedding.groomName}`} onError={(e) => handleImgError(e, 0)} />
          ) : null}
        </div>
        <div className="cover-guest">
          <p className="lbl">Thân Mời</p>
          <p className="name">Quý khách</p>
          <p>Đến dự buổi tiệc chung vui cùng gia đình</p>
        </div>
        <button type="button" onClick={onOpen} className="inv-btn cover-btn">
          Mở Thiệp
        </button>
      </div>
    </section>
  )
}
