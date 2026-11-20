import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { publicApi } from '../lib/api'
import { fallbackAlbum, fallbackEvents, fallbackGiftAccounts, fallbackTimeline, fallbackWedding, fallbackWishes } from '../lib/fallback'
import type { AlbumPhoto, GiftAccount, TimelineItem, Wedding, WeddingEvent, Wish } from '../lib/types'
import Cover from '../components/Cover'
import Countdown from '../components/Countdown'
import CalendarMonth from '../components/CalendarMonth'
import Invitation from '../components/Invitation'
import Timeline from '../components/Timeline'
import AlbumGallery from '../components/AlbumGallery'
import GiftBox from '../components/GiftBox'
import RsvpForm from '../components/RsvpForm'
import WishBook from '../components/WishBook'
import MusicToggle, { type MusicToggleHandle } from '../components/MusicToggle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import LoadingSpinner from '../components/LoadingSpinner'

export default function InvitationPage() {
  const { slug = 'thanh-truc-xuan-yen' } = useParams()
  const [opened, setOpened] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isFallback, setIsFallback] = useState(false)
  const [wedding, setWedding] = useState<Wedding>(fallbackWedding)
  const [timeline, setTimeline] = useState<TimelineItem[]>(fallbackTimeline)
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
        const [w, t, a, e, ws, g] = await Promise.all([
          publicApi.getWedding(slug),
          publicApi.getTimeline(slug).catch(() => fallbackTimeline),
          publicApi.getAlbum(slug).catch(() => fallbackAlbum),
          publicApi.getEvents(slug).catch(() => fallbackEvents),
          publicApi.getWishes(slug).catch(() => fallbackWishes),
          publicApi.getGiftAccounts(slug).catch(() => fallbackGiftAccounts)
        ])
        if (!alive) return
        setWedding(w); setTimeline(t); setAlbum(a); setEvents(e); setWishes(ws); setGifts(g)
        setIsFallback(false)
      } catch {
        if (!alive) return
        // API chưa chạy / lỗi: dùng fallback DEV và báo rõ trên UI.
        setWedding(fallbackWedding); setTimeline(fallbackTimeline); setAlbum(fallbackAlbum)
        setEvents(fallbackEvents); setWishes(fallbackWishes); setGifts(fallbackGiftAccounts)
        setIsFallback(true)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [slug])

  if (loading) return <LoadingSpinner />

  // MusicToggle nằm ngoài nhánh điều kiện nên chỉ có một instance duy nhất:
  // thẻ <audio> không bị unmount khi chuyển từ Cover sang nội dung thiệp.
  return (
    <>
      {!opened ? (
        <Cover wedding={wedding} onOpen={handleOpen} />
      ) : (
        <div className="min-h-screen bg-cream">
          {isFallback && (
            <div className="bg-amber-100 px-4 py-2 text-center text-xs font-medium text-amber-800">
              Chế độ xem trước — API chưa kết nối, đang hiển thị dữ liệu mẫu.
            </div>
          )}
          <Navbar />
          <main>
            <section className="px-4 pb-4 pt-14 text-center">
              <p className="font-hand text-3xl text-gold md:text-4xl">Save the Date</p>
              <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-brown-dark md:text-6xl">
                Thanh Trúc <span className="font-hand text-gold">&amp;</span> Xuân Yên
              </h1>
              <p className="mt-4 text-sm tracking-[0.3em] text-brown/70">CHỦ NHẬT · 27 . 12 . 2026</p>
              <p className="mt-2 text-sm text-brown/70">{wedding.venueName}</p>
              <p className="mt-1 text-sm text-brown/70">Lễ Thành Hôn &amp; Tiệc Cưới {wedding.ceremonyTime || '08:00'} · Đón khách từ 07:30</p>
            </section>
            <Countdown targetDate={`${wedding.weddingDate}T${wedding.ceremonyTime || '08:00'}:00`} />
            <CalendarMonth />
            <Invitation wedding={wedding} events={events} />
            <Timeline items={timeline} />
            <AlbumGallery photos={album} />
            <GiftBox accounts={gifts} />
            <RsvpForm slug={slug} />
            <WishBook slug={slug} wishes={wishes} onSent={loadWishes} />
          </main>
          <Footer />
        </div>
      )}
      <MusicToggle ref={musicRef} />
    </>
  )
}
