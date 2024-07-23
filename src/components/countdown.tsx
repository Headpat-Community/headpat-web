export default function Countdown() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-900 px-4 py-12 text-white">
      <div className="space-y-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Launching in
        </h1>
        <div className="flex items-center justify-center space-x-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="space-y-2">
              <div className="rounded-md bg-gray-800 px-4 py-3 text-6xl font-bold sm:px-6 sm:py-4 md:text-8xl">
                10
              </div>
              <p className="text-sm font-medium text-gray-400">Days</p>
            </div>
            <div className="space-y-2">
              <div className="rounded-md bg-gray-800 px-4 py-3 text-6xl font-bold sm:px-6 sm:py-4 md:text-8xl">
                12
              </div>
              <p className="text-sm font-medium text-gray-400">Hours</p>
            </div>
            <div className="space-y-2">
              <div className="rounded-md bg-gray-800 px-4 py-3 text-6xl font-bold sm:px-6 sm:py-4 md:text-8xl">
                45
              </div>
              <p className="text-sm font-medium text-gray-400">Minutes</p>
            </div>
            <div className="space-y-2">
              <div className="rounded-md bg-gray-800 px-4 py-3 text-6xl font-bold sm:px-6 sm:py-4 md:text-8xl">
                23
              </div>
              <p className="text-sm font-medium text-gray-400">Seconds</p>
            </div>
          </div>
        </div>
        <p className="text-lg font-medium text-gray-400">
          Launching our new product on June 15, 2023
        </p>
      </div>
    </div>
  )
}
