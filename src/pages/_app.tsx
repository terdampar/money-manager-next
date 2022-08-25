import "../styles/globals.css";
import type { AppType } from "next/dist/shared/lib/utils";
import { SessionProvider } from "next-auth/react";
import BottomNavigation from "../components/BottomNavigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const queryClient = new QueryClient()

const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gray-100">
          <main className="max-w-lg mx-auto bg-white min-h-screen">
            <BottomNavigation />
            <Component {...pageProps} />
            {/* <div className="max-w-lg mx-auto">
          </div> */}
          </main>
        </div>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default MyApp;
