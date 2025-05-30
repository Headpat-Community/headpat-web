import { ThemeToggle } from '@/components/ThemeToggle'
import { Separator } from '@/components/ui/separator'
import ChangeLanguage from '@/components/system/changeLanguage'

export default function PageLayout({
  children,
  title,
  middleComponent = null,
  className = ''
}) {
  return (
    <>
      <div className={'relative z-50'}>
        <div className="flex flex-row items-center px-4 py-1.5 justify-between align-middle">
          <h3 className="text-xl font-bold">{title || 'Undefined'}</h3>
          {middleComponent}
          <div className={'align-middle gap-2 hidden md:flex'}>
            <ChangeLanguage />
            <ThemeToggle />
          </div>
        </div>
        <Separator />
      </div>
      <div className={className}>{children}</div>
    </>
  )
}
