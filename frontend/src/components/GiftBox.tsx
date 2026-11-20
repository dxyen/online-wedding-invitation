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

function QrCard({ account }: { account: GiftAccount }) {
  const [qrUrl, setQrUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [enlarged, setEnlarged] = useState(false)
  const role = account.role || account.side || ''
  const owner = account.ownerName || account.accountHolder
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
    setTimeout(() => setCopied(false), 2000)
  }
  const download = () => {
    if (!qrUrl) return
    const a = document.createElement('a')
    a.href = qrUrl
    a.download = `qr-${role.toLowerCase() || 'thiep-cuoi'}.png`
    a.click()
  }

  return (
    <div className="card mx-auto w-full max-w-[320px] text-center">
      <p className="font-hand text-2xl text-gold">{role === 'BRIDE' ? 'Cô Dâu' : 'Chú Rể'}</p>
      <p className="mt-1 font-display text-2xl font-semibold text-brown-dark">{owner}</p>
      <p className="mt-1 text-sm text-brown/70">{account.bankName}</p>
      {qrUrl ? (
        <button type="button" onClick={() => setEnlarged(true)} className="mx-auto mt-4 block" title="Chạm để xem lớn">
          <img src={qrUrl} alt={`Mã QR chuyển khoản ${owner}`} className="w-[252px] max-w-full" style={{ imageRendering: 'pixelated' }} />
        </button>
      ) : (
        <p className="mt-4 text-sm text-brown/70">Chưa có mã QR cho tài khoản này.</p>
      )}
      <p className="mt-3 font-mono text-xl tracking-wider text-brown-dark">{account.accountNumber}</p>
      <p className="text-xs text-brown/60">{account.accountHolder}</p>
      <div className="mt-4 flex justify-center gap-2">
        <button type="button" onClick={copy} className="btn-outline">{copied ? '✓ Đã chép' : 'Chép STK'}</button>
        <button type="button" onClick={download} disabled={!qrUrl} className="btn-outline disabled:opacity-50">Lưu QR</button>
      </div>
      {enlarged && qrUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setEnlarged(false)}>
          <img src={qrUrl} alt={`Mã QR chuyển khoản ${owner}`} className="w-full max-w-[420px] rounded-2xl bg-white p-3" />
        </div>
      )}
    </div>
  )
}

export default function GiftBox({ accounts }: { accounts: GiftAccount[] }) {
  const ref = useInView<HTMLDivElement>()
  // Cô dâu trước, chú rể sau — như trên thiệp.
  const ordered = [...accounts].sort((a, b) => {
    const rank = (r?: string) => (r === 'BRIDE' ? 0 : 1)
    return rank(a.role || a.side) - rank(b.role || b.side)
  })
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <SectionHeading eyebrow="Hộp Quà Mừng" title="Mừng Cưới" subtitle="Sự hiện diện của bạn đã là món quà quý giá nhất. Nếu muốn gửi quà mừng, bạn có thể quét mã QR dưới đây." />
      <div ref={ref} className="fade-in-section space-y-6">
        {ordered.length > 0 ? (
          ordered.map((a) => <QrCard key={a.id ?? a.accountNumber} account={a} />)
        ) : (
          <p className="text-center text-sm text-brown/70">Chưa có thông tin tài khoản.</p>
        )}
      </div>
    </section>
  )
}
