import { memo } from 'react'

// Memoized SVG component to prevent unnecessary re-renders
const SeparatorDot = memo(() => (
  <svg
    viewBox="0 0 2 2"
    className="mx-2 inline h-0.5 w-0.5 fill-current"
    aria-hidden="true"
  >
    <circle cx={1} cy={1} r={1} />
  </svg>
))

SeparatorDot.displayName = 'SeparatorDot'

interface ErrorMessageProps {
  attentionError: string
}

export default memo(function ErrorMessage({
  attentionError
}: ErrorMessageProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-10">
      <div className="flex items-center justify-center gap-x-6 bg-red-900 px-6 py-2.5 sm:px-3.5">
        <p className="text-sm leading-6 text-white">
          <strong className="font-semibold">Attention needed</strong>
          <SeparatorDot />
          {attentionError}
        </p>
      </div>
    </div>
  )
})
