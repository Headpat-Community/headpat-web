import { ChevronRightIcon } from "@heroicons/react/20/solid";
import {
  BookmarkSquareIcon,
  BookOpenIcon,
  QueueListIcon,
  RssIcon,
} from "@heroicons/react/24/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";

const links = [
  {
    name: "Documentation",
    href: "#",
    description: "Learn how to integrate our tools with your app.",
    icon: BookOpenIcon,
  },
  {
    name: "API Reference",
    href: "#",
    description: "A complete API reference for our libraries.",
    icon: QueueListIcon,
  },
  {
    name: "Guides",
    href: "#",
    description: "Installation guides that cover popular setups.",
    icon: BookmarkSquareIcon,
  },
  {
    name: "Blog",
    href: "#",
    description: "Read our latest news and articles.",
    icon: RssIcon,
  },
];
const social = [
  {
    name: "Discord",
    href: "https://discord.gg/headpatcommunity",
    icon: (props) => (
      <FontAwesomeIcon icon={faDiscord} className="h-6 w-6" {...props} />
    ),
  },
  {
    name: "GitHub",
    href: "https://github.com/docimin/headpat.de",
    icon: (props) => (
      <FontAwesomeIcon icon={faGithub} className="h-6 w-6" {...props} />
    ),
  },
];

export default function Example() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <main className="mx-auto w-full max-w-7xl px-6 pb-16 pt-10 sm:pb-24 lg:px-8">
        <img
          className="mx-auto h-12 w-auto sm:h-16"
          src="/logo.png"
          alt="Headpat Community"
        />
        <div className="mx-auto mt-20 max-w-2xl text-center sm:mt-24">
          <p className="text-base font-semibold leading-8 text-indigo-600">
            404
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
            This page does not exist
          </h1>
          <p className="mt-4 text-base leading-7 text-white/70 sm:mt-6 sm:text-lg sm:leading-8">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-lg sm:mt-20">
          <h2 className="sr-only">Popular pages</h2>
          <ul
            role="list"
            className="-mt-6 divide-y divide-gray-900/5 border-b border-gray-900/5"
          >
            {links.map((link, linkIdx) => (
              <li key={linkIdx} className="relative flex gap-x-6 py-6">
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg shadow-sm ring-1 ring-white/50">
                  <link.icon
                    className="h-6 w-6 text-indigo-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex-auto">
                  <h3 className="text-sm font-semibold leading-6 text-indigo-600">
                    <a href={link.href}>
                      <span className="absolute inset-0" aria-hidden="true" />
                      {link.name}
                    </a>
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white">
                    {link.description}
                  </p>
                </div>
                <div className="flex-none self-center">
                  <ChevronRightIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex justify-center">
            <a
              href="#"
              className="text-sm font-semibold leading-6 text-indigo-600"
            >
              <span aria-hidden="true">&larr;</span>
              Back to home
            </a>
          </div>
        </div>
      </main>
      <footer className="border-t border-gray-100 py-6 sm:py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-8 px-6 sm:flex-row lg:px-8">
          <p className="text-sm leading-7 text-white">
            &copy; Headpat Community.
          </p>
          <div className="hidden sm:block sm:h-7 sm:w-px sm:flex-none sm:bg-gray-200" />
          <div className="flex gap-x-4">
            {social.map((item, itemIdx) => (
              <a
                key={itemIdx}
                href={item.href}
                className="text-white hover:text-gray-500"
              >
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
