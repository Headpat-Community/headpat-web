import { ThemeToggle } from '@/components/ThemeToggle'
import { Separator } from '@/components/ui/separator'
import ChangeLanguage from '@/components/system/changeLanguage'

export default function PageLayout({
  children,
  title,
  middleComponent = null,
}) {
  return (
    <>
      <div className={'relative'}>
        <div className="flex flex-col lg:flex-row items-center px-4 py-1.5 justify-between align-middle">
          <h1 className="text-xl font-bold">{title || 'Undefined'}</h1>
          {middleComponent}
          <div className={'align-middle flex gap-2 lg:mt-0 mt-4'}>
            <ChangeLanguage />
            <ThemeToggle />
          </div>
        </div>
        <Separator />
      </div>
      <div className={'p-0 lg:p-4'}>{children}</div>
    </>
  )
}
