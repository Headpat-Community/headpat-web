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

export const ErrorMessage = memo(function ErrorMessage({
  attentionError
}: ErrorMessageProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40">
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

interface SuccessMessageProps {
  attentionSuccess: string
}

export const SuccessMessage = memo(function SuccessMessage({
  attentionSuccess
}: SuccessMessageProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      <div className="flex items-center justify-center gap-x-6 bg-green-900 px-6 py-2.5 sm:px-3.5">
        <p className="text-sm leading-6 text-white">
          <strong className="font-semibold">Success!</strong>
          <SeparatorDot />
          {attentionSuccess}
        </p>
      </div>
    </div>
  )
})
