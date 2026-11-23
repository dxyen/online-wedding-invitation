import type { ReactNode } from 'react'
import { useInView } from '../hooks/useInView'

export default function SectionHeading({ eyebrow, title, subtitle, script, uppercase }: { eyebrow?: string; title: string; subtitle?: ReactNode; script?: boolean; uppercase?: boolean }) {
  const ref = useInView<HTMLDivElement>()
  return (
    <div ref={ref} className="fade-in-section inv-heading">
      {eyebrow && <p className="kicker">{eyebrow}</p>}
      <h2 className={script ? 'script-title' : `inv-title${uppercase ? ' inv-title-upper' : ''}`}>{title}</h2>
      <div className="orn" aria-hidden="true">
        <span className="orn-line" /><span>❦</span><span className="orn-line" />
      </div>
      {subtitle && <p className="sub">{subtitle}</p>}
    </div>
  )
}
