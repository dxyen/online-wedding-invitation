export default function LoadingSpinner({ text = 'Đang tải thiệp…' }: { text?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-cream px-4 text-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-brown/20 border-t-brown" />
      <p className="font-hand text-3xl text-brown">{text}</p>
    </div>
  )
}
