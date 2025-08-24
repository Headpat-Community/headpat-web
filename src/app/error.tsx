"use client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

export default function NotFoundComponent() {
  const router = useRouter()
  return (
    <div className={cn("h-svh w-full")}>
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] font-bold leading-tight">500</h1>
        <span className="font-medium">Oops! Something went wrong {`:')`}</span>
        <p className="text-muted-foreground text-center">
          We apologize for the inconvenience. <br /> Please try again later.
        </p>
        <div className="mt-6 flex gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
          <Button onClick={() => router.push("/")}>Back to Home</Button>
        </div>
      </div>
    </div>
  )
}
