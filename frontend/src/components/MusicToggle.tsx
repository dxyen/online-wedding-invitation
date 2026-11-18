import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'

// Nhạc nền: bản thu gốc "Em Đồng Ý (I Do)" — Đức Phúc × 911 × Khắc Hưng,
// nhúng sẵn dưới dạng file MP3 trong frontend (public/audio/em-dong-y-i-do.mp3).
// Phát bằng thẻ <audio> có sẵn của trình duyệt, không dùng WebAudio.
export const MUSIC_START_SECONDS = 16
const MUSIC_SRC = '/audio/em-dong-y-i-do.mp3'
const SONG_LABEL = 'Em Đồng Ý (I Do) — Đức Phúc × 911'

export interface MusicToggleHandle {
  /** Bắt đầu phát từ giây 16. Gọi trong cử chỉ người dùng (bấm "Mở Thiệp") để trình duyệt cho phép phát. */
  start: () => void
}

const MusicToggle = forwardRef<MusicToggleHandle>(function MusicToggle(_, ref) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const startedRef = useRef(false)

  const seekToStart = useCallback(() => {
    const audio = audioRef.current
    if (audio) audio.currentTime = MUSIC_START_SECONDS
  }, [])

  const start = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (startedRef.current) {
      // Đã bắt đầu rồi: chỉ phát tiếp, không tua lại giây 16.
      void audio.play().catch(() => undefined)
      return
    }
    startedRef.current = true
    const playFromStart = () => {
      seekToStart()
      audio.play().catch(() => { startedRef.current = false })
    }
    if (audio.readyState >= 1) {
      playFromStart()
    } else {
      audio.addEventListener('loadedmetadata', playFromStart, { once: true })
    }
  }, [seekToStart])

  useImperativeHandle(ref, () => ({ start }), [start])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      // Phát tiếp đúng chỗ đang dừng, không tua lại giây 16.
      void audio.play().catch(() => undefined)
    } else {
      audio.pause()
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onEnded = () => {
      // Hết bài: lặp lại từ giây 16 thay vì về đầu bài.
      seekToStart()
      void audio.play().catch(() => undefined)
    }
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnded)
    }
  }, [seekToStart])

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2">
      <span className="max-w-[220px] truncate rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-brown-dark shadow backdrop-blur">
        {SONG_LABEL}
      </span>
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? 'Tạm dừng nhạc nền' : 'Phát nhạc nền'}
        aria-pressed={playing}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-brown text-xl text-cream shadow-lg transition hover:bg-brown-dark"
        title={`${SONG_LABEL} — ${playing ? 'đang phát, bấm để tạm dừng' : 'bấm để phát'}`}
      >
        {playing ? '♪' : '♫'}
      </button>
    </div>
  )
})

export default MusicToggle
