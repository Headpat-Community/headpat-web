import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

const navigation = [
  {
    name: "Discord",
    href: "https://discord.gg/headpat",
    icon: faDiscord,
  },
  {
    name: "GitHub",
    href: "https://github.com/Headpat-Community/headpat.de",
    icon: faGithub,
  },
];
export default function Footer() {
  return (
    <footer className="border-t text-center">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-white hover:text-indigo-600"
              target="_blank"
            >
              <span className="sr-only">{item.name}</span>
              <FontAwesomeIcon icon={item.icon} />
            </Link>
          ))}
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-xs leading-5 text-white">
            &copy; {new Date().getFullYear()} Headpat. All rights reserved.
          </p>
        </div>
        <div className="mt-8 md:order-1 md:mt-0 pr-32">
          <Link
            href="/legal"
            className="text-center text-xs leading-5 text-indigo-600 hover:text-indigo-500"
          >
            Legal
          </Link>
        </div>
      </div>
    </footer>
  );
}
