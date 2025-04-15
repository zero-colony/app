import { AnimatePresence } from "motion/react";
import React from "react";
import { useSnapshot } from "valtio";
import { pages, setCurrentPage } from "../lib/state/pages";
import SidebarContent from "./SidebarContent";
import {
  AvatarIcon,
  DiscordIcon,
  GithubIcon,
  HomeIcon,
  LeaderboardIcon,
  NotionIcon,
  XIcon,
} from "./svg/icons";

type NavItem = {
  id: "home" | "leaderboard" | "avatar" | "chat";
  icon: React.FC<{
    color?: string;
    size?: number;
    className?: string;
  }>;
  activeColor: string;
};

const Sidebar: React.FC = () => {
  const { opened, current } = useSnapshot(pages);

  const navItems: NavItem[] = [
    { id: "home", icon: HomeIcon, activeColor: "#FF2E58" },
    { id: "leaderboard", icon: LeaderboardIcon, activeColor: "#FF2E58" },
    { id: "avatar", icon: AvatarIcon, activeColor: "#FF2E58" },
  ];

  const socialItems = [
    { id: "discord", icon: DiscordIcon, href: "https://discord.com" },
    { id: "x", icon: XIcon, href: "https://x.com" },
    { id: "github", icon: GithubIcon, href: "https://github.com" },
    { id: "notion", icon: NotionIcon, href: "https://notion.so" },
  ];

  return (
    <>
      <div className="absolute top-0 left-0 z-20 sm:hidden">
        <div className="m-4 h-6 w-6">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              fill="#FEFEFE"
            />
          </svg>
        </div>
      </div>

      <div className="absolute top-0 right-0 z-20 sm:hidden">
        <div className="m-4 flex gap-6">
          {socialItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="h-6 w-6 cursor-pointer opacity-70 transition-opacity duration-200 hover:opacity-100"
            >
              <item.icon color="#838383" size={24} />
            </a>
          ))}
        </div>
      </div>

      <div className="fixed right-0 bottom-0 left-0 z-30 flex h-16 justify-center border-t border-[#1A1A1A] bg-black/80 backdrop-blur-[30px] sm:absolute sm:h-screen sm:w-13.5 sm:flex-col sm:items-center sm:justify-between sm:border-t-0 sm:border-r sm:px-3 sm:py-4">
        <div className="hidden sm:flex sm:flex-col sm:items-center sm:gap-10">
          <div className="h-6 w-6">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                fill="#FEFEFE"
              />
            </svg>
          </div>

          <div className="flex w-full flex-col items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className="group relative h-6 w-6 cursor-pointer"
              >
                <item.icon
                  color={current === item.id ? item.activeColor : "#838383"}
                  size={24}
                  className="transition-all duration-200 ease-in-out"
                />
                {current === item.id && (
                  <span className="absolute top-1/2 -left-3 h-3 w-1 -translate-y-1/2 transform rounded-r bg-[#FF2E58]"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex w-full items-center justify-around sm:flex-col sm:items-center sm:gap-6">
          <div className="flex gap-8 sm:hidden">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className="group relative h-6 w-6 cursor-pointer"
              >
                <item.icon
                  color={current === item.id ? item.activeColor : "#838383"}
                  size={24}
                  className="transition-all duration-200 ease-in-out"
                />
                {current === item.id && (
                  <span className="absolute -top-3 left-1/2 h-1 w-3 -translate-x-1/2 transform rounded-b bg-[#FF2E58]"></span>
                )}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex sm:w-full sm:flex-col sm:items-center sm:gap-6">
            {socialItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="h-6 w-6 cursor-pointer opacity-70 transition-opacity duration-200 hover:opacity-100"
              >
                <item.icon color="#838383" size={24} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {opened && (
          <div className="absolute top-0 bottom-0 z-20 sm:left-13.5 sm:z-10">
            <SidebarContent />
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
