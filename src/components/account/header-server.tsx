import Link from 'next/link'
import {
  CircleUser,
  Home,
  LayoutDashboard,
  LineChart,
  Menu,
  Package,
  Users,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/ThemeToggle'
import Image from 'next/image'
import AccountAnnouncements from '@/components/account/accountAnnouncements'
//import ChangeLanguage from '@/components/system/changeLanguage'

export default async function Dashboard({ children }) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2 sticky top-0">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href={'/'} className="flex items-center gap-2 font-semibold">
              <Image
                src={'/logos/Headpat_Logo_web_1024x1024_240518-02.png'}
                alt={'Headpat logo'}
                className={'h-8 w-8 rounded-full'}
                width={24}
                height={24}
              />
              <span className="">Headpat</span>
            </Link>
            {/*
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
            */}
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href={'/'}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Home className="h-4 w-4" />
                Homepage
              </Link>
              <Link
                href={'/account'}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
                {/*
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  6
                </Badge>
                */}
              </Link>
              <div className="flex items-center px-4 text-center text-2xl my-2">
                <div className="h-[1px] w-1/2 bg-muted-foreground" />
                <div className="mx-4 text-base text-muted-foreground">
                  Gallery
                </div>
                <div className="h-[1px] w-1/2 bg-muted-foreground" />
              </div>
              <Link
                href={'/account/gallery/upload'}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Package className="h-4 w-4" />
                Upload Image
              </Link>
              <Link
                href={'/account/gallery'}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Users className="h-4 w-4" />
                Manage Gallery
              </Link>
              <div className="flex items-center px-4 text-center text-2xl my-2">
                <div className="h-[1px] w-1/2 bg-muted-foreground" />
                <div className="mx-4 text-base text-muted-foreground">
                  Community
                </div>
                <div className="h-[1px] w-1/2 bg-muted-foreground" />
              </div>
              <Link
                href={'/account/communities'}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <LineChart className="h-4 w-4" />
                Manage Communities
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 sticky top-0 z-10">
          <AccountAnnouncements />
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Image
                    src={'/logos/Headpat_Logo_web_1024x1024_240518-02.png'}
                    alt={'Headpat logo'}
                    className={'h-10 w-10'}
                    width={24}
                    height={24}
                  />
                  <span className="sr-only">Headpat</span>
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Homepage
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                  {/*
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    6
                  </Badge>
                  */}
                </Link>
                <div className="flex items-center px-4 text-center text-2xl my-2">
                  <div className="h-[1px] w-1/2 bg-muted-foreground" />
                  <div className="mx-4 text-base text-muted-foreground">
                    Gallery
                  </div>
                  <div className="h-[1px] w-1/2 bg-muted-foreground" />
                </div>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Package className="h-5 w-5" />
                  Upload Image
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Users className="h-5 w-5" />
                  Manage Gallery
                </Link>
                <div className="flex items-center px-4 text-center text-2xl my-2">
                  <div className="h-[1px] w-1/2 bg-muted-foreground" />
                  <div className="mx-4 text-base text-muted-foreground">
                    Community
                  </div>
                  <div className="h-[1px] w-1/2 bg-muted-foreground" />
                </div>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <LineChart className="h-5 w-5" />
                  Manage Communities
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            {/*

              <form>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search for anything..."
                    className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                  />
                </div>
              </form>
            */}
          </div>
          {/*<ChangeLanguage />*/}
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href={'/account'}>
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </Link>
              <Link href={'/account/support'}>
                <DropdownMenuItem>Support</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <Link href={'/logout'}>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
