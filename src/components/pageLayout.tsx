import { ThemeToggle } from "@/components/ThemeToggle"
import { Separator } from "@/components/ui/separator"
import ChangeLanguage from "@/components/system/changeLanguage"
import type { ReactNode } from "react"
import { memo } from "react"

interface PageLayoutProps {
  children: ReactNode
  title?: string
  middleComponent?: ReactNode
  className?: string
}

// Memoized header component to prevent unnecessary re-renders
const PageHeader = memo(function PageHeader({
  title,
  middleComponent,
}: {
  title?: string
  middleComponent?: ReactNode
}) {
  return (
    <div className={"relative z-50"}>
      <div className="flex flex-row items-center justify-between px-4 py-1.5 align-middle">
        <h3 className="text-xl font-bold">{title || "Undefined"}</h3>
        {middleComponent}
        <div className={"hidden gap-2 align-middle md:flex"}>
          <ChangeLanguage />
          <ThemeToggle />
        </div>
      </div>
      <Separator />
    </div>
  )
})

// Memoized content wrapper to prevent unnecessary re-renders
const PageContent = memo(function PageContent({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={className}>{children}</div>
})

const PageLayout = memo(function PageLayout({
  children,
  title,
  middleComponent = null,
  className = "",
}: PageLayoutProps) {
  return (
    <>
      <PageHeader title={title} middleComponent={middleComponent} />
      <PageContent className={className}>{children}</PageContent>
    </>
  )
})

export default PageLayout
