// View Transitions API type declarations
declare global {
  interface Document {
    startViewTransition: (callback: () => void | Promise<void>) => {
      ready: Promise<void>
      finished: Promise<void>
      updateCallbackDone: Promise<void>
      skipTransition(): void
    }
  }
}

export {}
