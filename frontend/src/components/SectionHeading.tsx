import { useInView } from '../hooks/useInView'

export default function SectionHeading({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  const ref = useInView<HTMLDivElement>()
  return (
    <div ref={ref} className="fade-in-section mx-auto mb-10 max-w-2xl text-center">
      {eyebrow && <p className="font-hand text-2xl text-gold md:text-3xl">{eyebrow}</p>}
      <h2 className="mt-1 font-display text-3xl font-semibold text-brown-dark md:text-4xl">{title}</h2>
      <div className="mx-auto mt-4 flex items-center justify-center gap-2 text-gold">
        <span className="h-px w-10 bg-gold/60" /><span>♥</span><span className="h-px w-10 bg-gold/60" />
      </div>
      {subtitle && <p className="mt-4 text-sm leading-relaxed text-brown/80 md:text-base">{subtitle}</p>}
    </div>
  )
}
