import { X as CloseIcon } from "lucide-react";
import { LazyMotion, domAnimation } from "motion/react";
import * as m from "motion/react-m";
import React from "react";
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

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className="h-screen w-[540px] flex-1 overflow-auto bg-black/80 text-white backdrop-blur-[30px]"
        initial={{ x: -540 }}
        animate={{ x: 0 }}
        exit={{ x: -540 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0 }}
      >
        <m.div
          exit={{ filter: "blur(4px)" }}
          transition={{ duration: 0.5, type: "spring", bounce: 0 }}
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
