import { getAccount } from "@/utils/actions/user-actions";
import AnnouncementNotification from "components/announcementNotification";
import { BellIcon } from "lucide-react";
import Sidebar from "./sidebar";
import { ThemeToggle } from "components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import { Button } from "components/ui/button";

export default async function Header({ children }) {
  const jwtBool: boolean = await getAccount();

  return (
    <div>
      <AnnouncementNotification />
      <header className="shrink-0 bg-gray-900">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <img
            className="h-8 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
            alt="Your Company"
          />
          <div className="flex items-center gap-x-8">
            <Button variant={"ghost"} size={"icon"}>
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </Button>
            <ThemeToggle />
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your profile</span>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-screen-2xl grow lg:flex xl:px-2">
        <div className="flex-1 flex">
          {/* Left sidebar */}
          <div className="border-b border-gray-200 px-4 py-6 sm:px-6 lg:pl-8 xl:shrink-0 xl:border-b-0 xl:border-r xl:pl-6 w-96 hidden lg:block">
            <Sidebar />
          </div>

          {/* Main wrapper */}
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
