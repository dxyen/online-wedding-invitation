import { useEffect, useState } from 'react'

export interface CountdownParts { days: number; hours: number; minutes: number; seconds: number; passed: boolean }

export function useCountdown(targetDate: string): CountdownParts {
  const calc = (): CountdownParts => {
    const diff = new Date(targetDate).getTime() - Date.now()
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true }
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor(diff / 3600000) % 24,
      minutes: Math.floor(diff / 60000) % 60,
      seconds: Math.floor(diff / 1000) % 60,
      passed: false
    }
  }
  const [parts, setParts] = useState<CountdownParts>(calc)
  useEffect(() => {
    const t = setInterval(() => setParts(calc()), 1000)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate])
  return parts
}
