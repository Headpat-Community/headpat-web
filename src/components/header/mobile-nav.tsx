'use client'
import { Button } from '../ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet'
import { MenuIcon } from 'lucide-react'
import * as React from 'react'
import { Separator } from '../ui/separator'
import { Nav1, Nav2, Nav3, NavFooter } from '@/components/header/data'
import { Nav } from '@/components/header/header-nav'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs } from '@/components/ui/tabs'
import Image from 'next/image'
import { useRouter } from '@/navigation'
import ChangeLanguage from '@/components/system/changeLanguage'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useUser } from '@/components/contexts/UserContext'

export default function MobileNav({ translations, children }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(false)
  const { current } = useUser()

  return (
    <>
      <header className={'border-b'}>
        <div className={'flex align-middle justify-between items-center px-2'}>
          <div className={'flex h-[52px] items-center ml-2'}>
            <Image
              src={'/logos/Headpat_Logo_web_128x128_240518-05.png'}
              width={32}
              height={32}
              alt={'Headpat logo'}
              className={'rounded-full'}
            />
            <span className={'ml-2'}>Headpat</span>
          </div>
          <div className={'flex items-center gap-2'}>
            <ChangeLanguage />
            <ThemeToggle />
            <Sheet onOpenChange={(open) => setIsOpen(open)} open={isOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size={'icon'}>
                  <MenuIcon />
                </Button>
              </SheetTrigger>
              <SheetContent
                side={'left'}
                className={'min-w-full lg:min-w-[800px] flex flex-col'}
              >
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Interested in checking stuff out? Click on a link!
                  </SheetDescription>
                </SheetHeader>

                <Separator className={'mt-2'} />

                <ScrollArea className={'flex-grow'}>
                  <div
                    className={
                      'mt-8 w-full h-full justify-items-center text-center'
                    }
                  >
                    <h1 className={'border-b pb-2'}>Pages</h1>
                    <div>
                      <Nav
                        isCollapsed={false}
                        links={Nav1(translations)}
                        setIsOpen={setIsOpen}
                        translations={translations}
                      />
                      <Separator />
                      <Nav
                        isCollapsed={false}
                        links={Nav2(current, translations)}
                        setIsOpen={setIsOpen}
                        translations={translations}
                      />
                      <Separator />
                      <Nav
                        isCollapsed={false}
                        links={Nav3(translations)}
                        setIsOpen={setIsOpen}
                        translations={translations}
                      />
                    </div>
                  </div>
                </ScrollArea>
                <div className={'mt-auto'}>
                  <Separator className={'mb-2'} />
                  <Nav
                    isCollapsed={false}
                    links={NavFooter(current, translations)}
                    setIsOpen={setIsOpen}
                    translations={translations}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main>
        <Tabs
          defaultValue={'normal'}
          onValueChange={(value) => {
            document.cookie = `viewMode=${value}; path=/`
            router.refresh()
          }}
        >
          {children}
        </Tabs>
      </main>
    </>
  )
}
