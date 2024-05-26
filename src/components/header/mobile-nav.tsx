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
import { MenuIcon, Triangle } from 'lucide-react'
import * as React from 'react'
import { Separator } from '../ui/separator'
import { Nav1, Nav2, Nav3, NavFooter } from '@/components/header/data'
import { Nav } from '@/components/header/header-nav'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs } from '@/components/ui/tabs'
import { useRouter } from 'next/navigation'

export default function MobileNav({
  accountData,
  children,
}): React.JSX.Element {
  const router = useRouter()

  return (
    <>
      <header className={'border-b'}>
        <div className={'flex align-middle justify-between items-center px-2'}>
          <div className={'flex h-[52px] items-center ml-2'}>
            <Triangle />
            <span className={'ml-2'}>Headpat</span>
          </div>
          <Sheet>
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
                    <Nav isCollapsed={false} links={Nav1()} />
                    <Separator />
                    <Nav isCollapsed={false} links={Nav2(accountData)} />
                    <Separator />
                    <Nav isCollapsed={false} links={Nav3()} />
                  </div>
                </div>
              </ScrollArea>
              <div className={'mt-auto'}>
                <Separator className={'mb-2'} />
                <Nav isCollapsed={false} links={NavFooter(accountData)} />
              </div>
            </SheetContent>
          </Sheet>
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
