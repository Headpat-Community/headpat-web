import AnnouncementNotification from '../announcementNotification'
import { getAccount } from 'utils/actions/user-actions'
import Link from 'next/link'
import Image from 'next/image'
import { NavigationMenuExport } from 'components/header/nav'
import { ThemeToggle } from 'components/ThemeToggle'
import { Button } from 'components/ui/button'
import { ArrowRightIcon } from 'lucide-react'
import MobileNav from 'components/header/mobile-nav'

export default async function Header() {
  const accountData = await getAccount()
  const jwtBool = !accountData

  console.log(jwtBool)

  return (
    <div>
      <AnnouncementNotification />
      <header className="relative">
        <nav aria-label="Top">
          {/* Secondary navigation */}
          <div>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {/* Mobile Logo */}
              <div className="flex flex-1 items-center justify-center border-b border-gray-200 pb-2 pt-2 lg:hidden">
                <Link href="/">
                  <span className="sr-only">DutchBoxx Golfkarton</span>
                  <Image
                    className="h-8 w-auto"
                    src="/logos/Headpat_new_logo.webp"
                    alt="DutchBoxx Logo"
                    width={200}
                    height={50}
                  />
                </Link>
              </div>

              <div className="border-b border-gray-200">
                <div className="flex h-20 items-center justify-between">
                  {/* Logo (lg+) */}
                  <div className="hidden lg:flex lg:flex-1 lg:items-center">
                    <Link href="/">
                      <span className="sr-only">DutchBoxx Golfkarton</span>
                      <Image
                        className="h-12 w-auto"
                        src="/logos/Headpat_new_logo.webp"
                        alt="DutchBoxx Logo"
                        width={200}
                        height={50}
                      />
                    </Link>
                  </div>

                  <div className="z-10 hidden h-full lg:flex" /*ref={menuRef}*/>
                    {/* Flyout menus */}
                    <NavigationMenuExport />
                  </div>

                  {/* Desktop menu and search (lg+) */}
                  <div className="flex flex-1 items-center justify-center lg:justify-end">
                    <div className={'mr-2 lg:hidden'}>
                      <MobileNav />
                    </div>

                    <ThemeToggle />

                    {/* Search */}
                    {/*
                    <Button
                      variant={"outline"}
                      size={"icon"}
                      aria-label="Search"
                      //onClick={openSearchModal}
                      className={"ml-2"}
                    >
                      <MagnifyingGlassIcon
                        className="h-6 w-6 hover:text-gray-500"
                        aria-hidden="true"
                      />
                    </Button>
                    */}
                    {jwtBool ? (
                      <>
                        <div className="ml-2 flex items-center space-x-2">
                          <Link href={'/logout'}>
                            <Button variant={'ghost'}>Sign out</Button>
                          </Link>
                          <Link href={'/account'}>
                            <Button variant={'ghost'}>
                              Account <span aria-hidden="true">&rarr;</span>
                            </Button>
                          </Link>
                        </div>
                      </>
                    ) : (
                      <Link href={'/login'} className="ml-2">
                        <Button variant={'outline'}>
                          Sign in <ArrowRightIcon className={'h-4'} />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
