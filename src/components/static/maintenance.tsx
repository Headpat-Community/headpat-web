export default function Maintenance() {
  return (
    <div className="h-svh mx-auto">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] font-bold leading-tight">503</h1>
        <span className="font-medium">Page is under maintenance!</span>
        <p className="text-center text-muted-foreground">
          This page is not available at the moment. <br />
          We&apos;ll be back online shortly.
        </p>
      </div>
    </div>
  )
}
