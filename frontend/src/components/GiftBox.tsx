import { useState } from 'react'
import { useInView } from '../hooks/useInView'
import type { GiftAccount } from '../lib/types'
import SectionHeading from './SectionHeading'

export default function GiftBox({ accounts }: { accounts: GiftAccount[] }) {
  const ref = useInView<HTMLDivElement>()
  const [tab, setTab] = useState<'GROOM' | 'BRIDE'>('GROOM')
  const [copied, setCopied] = useState<string | null>(null)
  const current = accounts.find((a) => a.role === tab) || accounts[0]
  const copy = async (num: string) => {
    try { await navigator.clipboard.writeText(num.replace(/\s/g, '')); setCopied(num) } catch { setCopied(null); alert(num) }
    setTimeout(() => setCopied(null), 2000)
  }
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <SectionHeading eyebrow="Hộp Quà Mừng" title="Mừng Cưới" subtitle="Sự hiện diện của bạn đã là món quà quý giá nhất. Nếu muốn gửi quà mừng, bạn có thể dùng thông tin dưới đây." />
      <div ref={ref} className="fade-in-section card text-center">
        <p className="rounded-full bg-amber-50 px-3 py-2 text-xs text-amber-800">⚠ Thông tin tài khoản dưới đây là SỐ MẪU để xem trước giao diện — không phải số tài khoản thật.</p>
        <div className="mt-5 flex justify-center gap-2">
          <button type="button" onClick={() => setTab('GROOM')} className={`rounded-full px-5 py-2 text-sm font-semibold ${tab === 'GROOM' ? 'bg-brown text-cream' : 'bg-cream-dark text-brown'}`}>Chú Rể</button>
          <button type="button" onClick={() => setTab('BRIDE')} className={`rounded-full px-5 py-2 text-sm font-semibold ${tab === 'BRIDE' ? 'bg-brown text-cream' : 'bg-cream-dark text-brown'}`}>Cô Dâu</button>
        </div>
        {current ? (
          <div className="mt-6">
            <p className="font-display text-2xl font-semibold text-brown-dark">{current.accountHolder || current.ownerName}</p>
            <p className="mt-1 text-sm text-brown/70">{current.bankName}</p>
            <p className="mt-3 font-mono text-xl tracking-wider text-brown-dark">{current.accountNumber}</p>
            <button type="button" onClick={() => copy(current.accountNumber)} className="btn-outline mt-4">
              {copied === current.accountNumber ? '✓ Đã sao chép' : '📋 Sao chép số tài khoản'}
            </button>
          </div>
        ) : (
          <p className="mt-6 text-sm text-brown/70">Chưa có thông tin tài khoản.</p>
        )}
      </div>
    </section>
  )
}
