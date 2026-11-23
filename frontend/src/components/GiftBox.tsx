import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { useInView } from '../hooks/useInView'
import type { GiftAccount } from '../lib/types'
import SectionHeading from './SectionHeading'

const QR_SIZE = 512

// Vẽ mã QR từ chuỗi payload VietQR, kèm logo tam giác cam ở giữa
// (mức sửa lỗi H chịu được phần logo che ở giữa mã).
async function makeQrDataUrl(payload: string): Promise<string> {
  const canvas = document.createElement('canvas')
  await QRCode.toCanvas(canvas, payload, {
    errorCorrectionLevel: 'H',
    width: QR_SIZE,
    margin: 2,
    color: { dark: '#000000', light: '#ffffff' }
  })
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const cx = QR_SIZE / 2
    const cy = QR_SIZE / 2
    ctx.beginPath()
    ctx.arc(cx, cy, 40, 0, Math.PI * 2)
    ctx.fillStyle = '#ffffff'
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(cx - 26, cy - 18)
    ctx.lineTo(cx + 26, cy - 18)
    ctx.lineTo(cx, cy + 26)
    ctx.closePath()
    ctx.fillStyle = '#F58220'
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(cx - 11, cy - 7)
    ctx.lineTo(cx + 11, cy - 7)
    ctx.lineTo(cx, cy + 12)
    ctx.closePath()
    ctx.fillStyle = '#ffffff'
    ctx.fill()
  }
  return canvas.toDataURL('image/png')
}

// 7 hộp quà mini quanh hộp chính (màu như bản artifact).
const MINI_GIFTS = [
  { color: '#d84f4f', dark: '#b23434', left: 6, bottom: 30, rotate: -8, scale: 1 },
  { color: '#b23a48', dark: '#8e2a38', left: 34, bottom: 96, rotate: 6, scale: 0.9 },
  { color: '#7fae6d', dark: '#5f8a4c', left: 4, bottom: 150, rotate: -4, scale: 0.85 },
  { color: '#f0aec2', dark: '#e28bab', right: 8, bottom: 34, rotate: 7, scale: 1 },
  { color: '#b39ddb', dark: '#9678c9', right: 30, bottom: 100, rotate: -6, scale: 0.9 },
  { color: '#f0cd72', dark: '#e0aa3e', right: 6, bottom: 158, rotate: 5, scale: 0.85 },
  { color: '#f2a18f', dark: '#e07f66', left: 60, bottom: 190, rotate: -10, scale: 0.75 }
]

const SPARKLES = [
  { left: 18, top: 30, size: 16, delay: 0 },
  { left: 216, top: 60, size: 14, delay: 0.8 },
  { left: 46, top: 8, size: 12, delay: 1.6 }
]

function MiniGift({ color, dark }: { color: string; dark: string }) {
  return (
    <svg viewBox="0 0 40 36" width="40" height="36" aria-hidden="true">
      <rect x="4" y="12" width="32" height="22" rx="2" fill={color} />
      <rect x="2" y="6" width="36" height="8" rx="2" fill={dark} />
      <rect x="17" y="6" width="6" height="28" fill="#fff8ee" />
      <rect x="2" y="8" width="36" height="4" fill="#fff8ee" opacity="0.85" />
      <circle cx="20" cy="6" r="3" fill="#fff8ee" />
    </svg>
  )
}

function MainGift() {
  return (
    <svg viewBox="0 0 200 220" className="gift-main" aria-hidden="true">
      <defs>
        <linearGradient id="giftBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffaf0" />
          <stop offset="100%" stopColor="#f6e7d0" />
        </linearGradient>
      </defs>
      {/* Nơ — vòng nơ #d99a4e, nút giữa giữ #b97f36 (như bản artifact) */}
      <ellipse cx="80" cy="50" rx="20" ry="12" fill="#d99a4e" transform="rotate(-25 80 50)" />
      <ellipse cx="120" cy="50" rx="20" ry="12" fill="#d99a4e" transform="rotate(25 120 50)" />
      <path d="M100 58 L88 78 L100 72 Z" fill="#d99a4e" />
      <path d="M100 58 L112 78 L100 72 Z" fill="#d99a4e" />
      <circle cx="100" cy="58" r="9" fill="#b97f36" />
      {/* Nắp + thân hộp */}
      <rect x="30" y="64" width="140" height="30" rx="6" fill="#f1dfc0" />
      <rect x="38" y="94" width="124" height="96" rx="6" fill="url(#giftBody)" />
      {/* Ruy băng */}
      <rect x="91" y="64" width="18" height="126" fill="#d99a4e" />
      <rect x="30" y="76" width="140" height="8" fill="#d99a4e" />
      {/* Họa tiết cành trang trí */}
      <path d="M56 118 q10 20 0 40" stroke="#dcbd8f" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M144 118 q-10 20 0 40" stroke="#dcbd8f" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function QrCard({ account }: { account: GiftAccount }) {
  const [qrUrl, setQrUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [enlarged, setEnlarged] = useState(false)
  const role = account.role || account.side || ''
  const owner = account.ownerName || account.accountHolder
  const displayName = role === 'BRIDE' ? 'Thanh Trúc' : 'Xuân Yên'
  const plainNumber = account.accountNumber.replace(/\s/g, '')

  useEffect(() => {
    let alive = true
    if (account.qrPayload) {
      makeQrDataUrl(account.qrPayload)
        .then((u) => { if (alive) setQrUrl(u) })
        .catch(() => { /* giữ khung trống nếu vẽ lỗi */ })
    }
    return () => { alive = false }
  }, [account.qrPayload])

  const copy = async () => {
    try { await navigator.clipboard.writeText(plainNumber); setCopied(true) } catch { alert(account.accountNumber) }
    setTimeout(() => setCopied(false), 1800)
  }
  const download = () => {
    if (!qrUrl) return
    const a = document.createElement('a')
    a.href = qrUrl
    a.download = role === 'BRIDE' ? 'qr-mung-cuoi-co-dau.png' : 'qr-mung-cuoi-chu-re.png'
    a.click()
  }

  return (
    <div className="gift-card">
      <p className="g-who">{role === 'BRIDE' ? 'Cô Dâu' : 'Chú Rể'} · {displayName}</p>
      <div className="g-qr">
        {qrUrl ? (
          <button type="button" onClick={() => setEnlarged(true)} className="block h-full w-full" title="Chạm để xem lớn">
            <img src={qrUrl} alt={`Mã QR chuyển khoản ${owner}`} />
          </button>
        ) : (
          <p className="flex h-full items-center justify-center text-sm text-brown/70">Chưa có mã QR cho tài khoản này.</p>
        )}
      </div>
      <p className="g-bank">
        {account.bankName} · <span className="num">{account.accountNumber}</span>
        <br />
        {account.accountHolder}
      </p>
      <div className="mt-3 flex justify-center gap-2">
        <button type="button" onClick={download} disabled={!qrUrl} className="mini-btn">Lưu QR</button>
        <button type="button" onClick={copy} className="mini-btn">{copied ? 'Đã chép ✓' : 'Chép STK'}</button>
      </div>
      {enlarged && qrUrl && (
        <div className="qr-zoom" onClick={() => setEnlarged(false)} role="dialog" aria-label="Mã QR lớn">
          <img src={qrUrl} alt={`Mã QR chuyển khoản ${owner}`} />
          <p>{account.bankName} · {account.accountNumber}<br />{account.accountHolder}</p>
          <button type="button" className="qr-zoom-btn" onClick={() => setEnlarged(false)}>Đóng</button>
        </div>
      )}
    </div>
  )
}

export default function GiftBox({ accounts }: { accounts: GiftAccount[] }) {
  const ref = useInView<HTMLDivElement>()
  const [open, setOpen] = useState(false)

  // Modal hộp quà: đóng bằng phím Esc (như bản artifact).
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Cô dâu trước, chú rể sau — như trên thiệp.
  const ordered = [...accounts].sort((a, b) => {
    const rank = (r?: string) => (r === 'BRIDE' ? 0 : 1)
    return rank(a.role || a.side) - rank(b.role || b.side)
  })
  return (
    <section className="inv-section">
      <SectionHeading eyebrow="Mừng Cưới Online" title="HỘP QUÀ MỪNG" uppercase />
      <div ref={ref} className="fade-in-section">
        <div className="gift-stage" onClick={() => setOpen(true)} role="button" aria-label="Mở hộp quà mừng" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpen(true) }}>
          <div className="gift-shadow" aria-hidden="true" />
          <div className="gift-bob">
            <div className="gift-bob-inner">
              <MainGift />
            </div>
          </div>
          {MINI_GIFTS.map((g, i) => (
            <div
              key={i}
              className="gift-mini"
              style={{
                left: g.left !== undefined ? g.left : undefined,
                right: g.right !== undefined ? g.right : undefined,
                bottom: g.bottom,
                transform: `rotate(${g.rotate}deg) scale(${g.scale})`
              }}
              aria-hidden="true"
            >
              <MiniGift color={g.color} dark={g.dark} />
            </div>
          ))}
          {SPARKLES.map((s, i) => (
            <span
              key={i}
              className="gift-sparkle"
              style={{ left: s.left, top: s.top, fontSize: s.size, animationDelay: `${s.delay}s` }}
              aria-hidden="true"
            >
              ✦
            </span>
          ))}
        </div>
        <p className="gift-hint">Nhấn để mở</p>
      </div>
      {open && (
        <div className="gift-modal" onClick={() => setOpen(false)} role="dialog" aria-label="Hộp quà mừng">
          <div className="gift-panel" onClick={(e) => e.stopPropagation()}>
            <div className="gift-panel-head">
              <h3>Hộp Quà Mừng</h3>
              <button type="button" onClick={() => setOpen(false)} className="gift-panel-close" aria-label="Đóng">✕</button>
            </div>
            <div className="gift-cards">
              {ordered.length > 0 ? (
                ordered.map((a) => <QrCard key={a.id ?? a.accountNumber} account={a} />)
              ) : (
                <p className="text-center text-sm text-brown/70">Chưa có thông tin tài khoản.</p>
              )}
            </div>
            <p className="gift-modal-note">Chạm vào mã QR để xem lớn cho dễ quét</p>
          </div>
        </div>
      )}
    </section>
  )
}
