import { useEffect, useRef, useState } from 'react'

// Nhạc nền tự tạo bằng WebAudio: giai điệu piano đơn giản, không cần file mp3.
const MELODY = [523.25, 587.33, 659.25, 783.99, 659.25, 587.33, 523.25, 392.0, 440.0, 523.25]

export default function MusicToggle() {
  const [playing, setPlaying] = useState(false)
  const ctxRef = useRef<AudioContext | null>(null)
  const timerRef = useRef<number | null>(null)
  const noteRef = useRef(0)

  const playNote = (ctx: AudioContext, freq: number, when: number) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.0001, when)
    gain.gain.exponentialRampToValueAtTime(0.18, when + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.0001, when + 1.4)
    osc.connect(gain).connect(ctx.destination)
    osc.start(when)
    osc.stop(when + 1.5)
  }

  const stop = () => {
    if (timerRef.current) window.clearInterval(timerRef.current)
    timerRef.current = null
    setPlaying(false)
  }

  const toggle = async () => {
    if (playing) { stop(); return }
    if (!ctxRef.current) ctxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const ctx = ctxRef.current
    await ctx.resume()
    noteRef.current = 0
    setPlaying(true)
    timerRef.current = window.setInterval(() => {
      const freq = MELODY[noteRef.current % MELODY.length]
      noteRef.current += 1
      playNote(ctx, freq, ctx.currentTime)
    }, 700)
  }

  useEffect(() => () => { if (timerRef.current) window.clearInterval(timerRef.current); void ctxRef.current?.close() }, [])

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
      className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-brown text-xl text-cream shadow-lg transition hover:bg-brown-dark"
      title={playing ? 'Tắt nhạc nền' : 'Bật nhạc nền (giai điệu piano)'}
    >
      {playing ? '♪' : '♫'}
      <span className="sr-only">{playing ? 'Tắt nhạc' : 'Bật nhạc'}</span>
    </button>
  )
}
