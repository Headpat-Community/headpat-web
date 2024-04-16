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
import Link from 'next/link'

export default function MobileNav(): React.JSX.Element {
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size={'icon'}>
            <MenuIcon />
          </Button>
        </SheetTrigger>
        <SheetContent side={'left'} className={'min-w-full lg:min-w-[800px]'}>
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>
              Interested in checking stuff out? Click on a link!
            </SheetDescription>
          </SheetHeader>

          <Separator className={'mt-2'} />

          <div className={'mt-8 w-full justify-items-center text-center'}>
            <h1 className={'border-b pb-2'}>Pages</h1>
            <div
              className={
                'mt-2 flex flex-col items-center justify-center gap-4 text-center'
              }
            >
              <Link href={'/'}>
                <Button className={'w-96'}>Home</Button>
              </Link>
              <Link href={'/'}>
                <Button className={'w-96'}>Gallery</Button>
              </Link>
              {/*
              <Link href={'/'}>
                <Button className={'w-96'}>Pawcraft</Button>
              </Link>
              */}
              <Link href={'/'}>
                <Button className={'w-96'}>Community</Button>
              </Link>
              <Link href={'/'}>
                <Button className={'w-96'}>Users</Button>
              </Link>
              <Link href={'/'}>
                <Button className={'w-96'}>Events</Button>
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
