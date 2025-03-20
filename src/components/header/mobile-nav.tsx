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
import { BracesIcon, MenuIcon, ServerIcon, UsersIcon } from 'lucide-react'
import * as React from 'react'
import { Separator } from '../ui/separator'
import { Nav1, Nav2, Nav3, Nav4, NavFooter } from '@/components/header/data'
import { Nav } from '@/components/header/header-nav'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs } from '@/components/ui/tabs'
import { useRouter } from 'next/navigation'
import ChangeLanguage from '@/components/system/changeLanguage'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useUser } from '@/components/contexts/UserContext'
import { team, TeamSwitcher } from '@/components/TeamSwitcher'

export default function MobileNav({ translations, children }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(false)
  const { current } = useUser()

  const teams: team[] = [
    {
      name: 'Place',
      activeName: 'Headpat Place',
      logo: UsersIcon,
      href: 'https://headpat.place',
    },
    {
      name: 'Space',
      logo: ServerIcon,
      href: 'https://headpat.space',
    },
    {
      name: 'Developer',
      logo: BracesIcon,
      plan: 'Documentation for developers',
      href: 'https://headpat.dev',
    },
  ]

  return (
    <>
      <header className={'border-b'}>
        <div className={'flex align-middle justify-between items-center px-2'}>
          <div className={'flex h-[52px] items-center ml-2'}>
            <TeamSwitcher teams={teams} />
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
                    Interested in checking stuff out? Click on a button!
                  </SheetDescription>
                </SheetHeader>

                <Separator className={'mt-2'} />

                <ScrollArea className={''}>
                  <div className={'mt-8 w-full h-full'}>
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
                      <Separator />
                      <Nav
                        isCollapsed={false}
                        links={Nav4()}
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
