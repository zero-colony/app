import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { useEffect } from "react";
import { Web3Provider } from "~/components/Web3Provider";
import appCss from "~/lib/styles/app.css?url";
import { TRPCRouter } from "~/trpc/init/router";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  trpc: TRPCOptionsProxy<TRPCRouter>;
}>()({
  ssr: true,
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "React TanStarter",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Web3Provider>
        <Outlet />
      </Web3Provider>
    </RootDocument>
  );
}

const isDev = import.meta.env.DEV;
const isErudaEnabled = import.meta.env.VITE_ERUDA_ENABLED === "true";

function RootDocument({ children }: { readonly children: React.ReactNode }) {
  useEffect(() => {
    if (isDev && isErudaEnabled) {
      import("eruda").then((eruda) => {
        eruda.default.init();
      });
    }
  }, []);

  return (
    // suppress since we're updating the "dark" class in a custom script below
    <html suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body style={{ backgroundColor: "black", color: "white" }}>
        {children}

        {/* {isDev && <ReactQueryDevtools buttonPosition="bottom-left" />}
        {isDev && <TanStackRouterDevtools position="bottom-right" />} */}

        <Scripts />
      </body>
    </html>
  );
}
