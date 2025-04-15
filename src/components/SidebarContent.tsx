import { X as CloseIcon } from "lucide-react";
import { LazyMotion, domAnimation } from "motion/react";
import * as m from "motion/react-m";
import React from "react";
import { useMediaQuery } from "usehooks-ts";
import { useSnapshot } from "valtio";
import { Page, pages, togglePage } from "../lib/state/pages";
import Avatar from "./pages/Avatar";
import Chat from "./pages/Chat";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";

const PageComponents: Record<Page, React.ComponentType<{ className?: string }>> = {
  home: Home,
  leaderboard: Leaderboard,
  avatar: Avatar,
  chat: Chat,
};

const PageTitles: Record<Page, string> = {
  home: "Zerocolony Lands",
  leaderboard: "Leaderboard",
  avatar: "Avatar",
  chat: "Chat",
};

const SidebarContent: React.FC = () => {
  const { current } = useSnapshot(pages);
  const CurrentPage = PageComponents[current];
  const isMobile = useMediaQuery("(max-width: 640px)");

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className="h-screen w-screen flex-1 overflow-auto bg-black/80 text-white backdrop-blur-[30px] sm:w-[540px]"
        initial={isMobile ? {} : { x: -540 }}
        animate={isMobile ? {} : { x: 0 }}
        exit={isMobile ? {} : { x: -540 }}
        transition={isMobile ? {} : { duration: 0.5, type: "spring", bounce: 0 }}
      >
        <m.div
          exit={isMobile ? {} : { filter: "blur(4px)" }}
          transition={isMobile ? {} : { duration: 0.3, ease: "easeOut" }}
          className="flex w-full flex-col"
        >
          <div className="flex w-full justify-between p-5 pb-3.5">
            <h2 className="font-semibold uppercase">{PageTitles[current]}</h2>

            <button className="cursor-pointer" onClick={() => togglePage()}>
              <CloseIcon color="#616161" size={20} />
            </button>
          </div>

          <div className="px-5 pb-5">
            <CurrentPage />
          </div>
        </m.div>
      </m.div>
    </LazyMotion>
  );
};

export default SidebarContent;
