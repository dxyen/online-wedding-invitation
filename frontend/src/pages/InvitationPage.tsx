import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { publicApi } from '../lib/api'
import { fallbackAlbum, fallbackEvents, fallbackGiftAccounts, fallbackWedding, fallbackWishes, handleImgError } from '../lib/fallback'
import type { AlbumPhoto, GiftAccount, Wedding, WeddingEvent, Wish } from '../lib/types'
import Cover from '../components/Cover'
import Countdown from '../components/Countdown'
import Invitation from '../components/Invitation'
import AlbumGallery from '../components/AlbumGallery'
import GiftBox from '../components/GiftBox'
import RsvpForm from '../components/RsvpForm'
import WishBook from '../components/WishBook'
import MusicToggle, { type MusicToggleHandle } from '../components/MusicToggle'
import Footer from '../components/Footer'
import LoadingSpinner from '../components/LoadingSpinner'

export default function InvitationPage() {
  const { slug = 'thanh-truc-xuan-yen' } = useParams()
  const [opened, setOpened] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isFallback, setIsFallback] = useState(false)
  const [wedding, setWedding] = useState<Wedding>(fallbackWedding)
  const [album, setAlbum] = useState<AlbumPhoto[]>(fallbackAlbum)
  const [events, setEvents] = useState<WeddingEvent[]>(fallbackEvents)
  const [wishes, setWishes] = useState<Wish[]>(fallbackWishes)
  const [gifts, setGifts] = useState<GiftAccount[]>(fallbackGiftAccounts)
  const musicRef = useRef<MusicToggleHandle | null>(null)

  // Bấm "Mở Thiệp" là cử chỉ người dùng: phát nhạc nền ngay trong handler
  // để trình duyệt cho phép autoplay có tiếng.
  const handleOpen = () => {
    setOpened(true)
    musicRef.current?.start()
  }

  const loadWishes = async () => {
    try { setWishes(await publicApi.getWishes(slug)) } catch { /* giữ fallback */ }
  }

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const [w, a, e, ws, g] = await Promise.all([
          publicApi.getWedding(slug),
          publicApi.getAlbum(slug).catch(() => fallbackAlbum),
          publicApi.getEvents(slug).catch(() => fallbackEvents),
          publicApi.getWishes(slug).catch(() => fallbackWishes),
          publicApi.getGiftAccounts(slug).catch(() => fallbackGiftAccounts)
        ])
        if (!alive) return
        setWedding(w); setAlbum(a); setEvents(e); setWishes(ws); setGifts(g)
        setIsFallback(false)
      } catch {
        if (!alive) return
        // API chưa chạy / lỗi: dùng fallback DEV và báo rõ trên UI.
        setWedding(fallbackWedding); setAlbum(fallbackAlbum)
        setEvents(fallbackEvents); setWishes(fallbackWishes); setGifts(fallbackGiftAccounts)
        setIsFallback(true)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [slug])

  if (loading) return <LoadingSpinner />

  const coverPhoto = album[0]?.imageUrl
  const heroPhoto = album[1]?.imageUrl

  // MusicToggle nằm ngoài nhánh điều kiện nên chỉ có một instance duy nhất:
  // thẻ <audio> không bị unmount khi chuyển từ Cover sang nội dung thiệp.
  // Dock nhạc chỉ hiện sau khi bấm "Mở Thiệp" (như bản artifact).
  return (
    <>
      {!opened ? (
        <Cover wedding={wedding} coverPhoto={coverPhoto} onOpen={handleOpen} />
      ) : (
        <div className="page">
          {isFallback && (
            <div className="bg-amber-100 px-4 py-2 text-center text-xs font-medium text-amber-800">
              Chế độ xem trước — API chưa kết nối, đang hiển thị dữ liệu mẫu.
            </div>
          )}
          <main>
            <section className="hero">
              <p className="hero-save">Save the Date</p>
              <h1 className="hero-names">
                {wedding.brideName} &amp; {wedding.groomName}
              </h1>
              <div className="hero-date">
                <span className="hero-day">27</span>
                <span className="hero-side">Chủ Nhật<br />08:00</span>
                <span className="hero-side">Tháng 12<br />2026</span>
              </div>
              <div className="wood-frame">
                <div className="wood-inner">
                  {heroPhoto ? (
                    <img src={heroPhoto} alt={`${wedding.brideName} & ${wedding.groomName}`} onError={(e) => handleImgError(e, 1)} />
                  ) : null}
                </div>
              </div>
            </section>
            <Countdown targetDate={`${wedding.weddingDate}T${wedding.ceremonyTime || '08:00'}:00`} />
            <Invitation wedding={wedding} events={events} />
            <AlbumGallery photos={album} />
            <GiftBox accounts={gifts} />
            <RsvpForm slug={slug} />
            <WishBook slug={slug} wishes={wishes} onSent={loadWishes} />
          </main>
          <Footer />
        </div>
      )}
      <MusicToggle ref={musicRef} visible={opened} />
    </>
  )
}
