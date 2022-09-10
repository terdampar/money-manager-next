import "../styles/globals.css";
import type { AppType } from "next/dist/shared/lib/utils";
import BottomNavigation from "../components/BottomNavigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SideNavigation from "../components/SideNavigation";

export const queryClient = new QueryClient()

const MyApp: AppType = ({
  Component,
  pageProps,
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-base">
        {/* <main className="max-w-lg mx-auto bg-white min-h-screen"> */}
        {/* <BottomNavigation /> */}
        <div className="flex">
          <SideNavigation />
          <main className="w-full">
            <Component {...pageProps} />
          </main>
        </div>
        {/* <div className="max-w-lg mx-auto">
          </div> */}
        {/* </main> */}
      </div>
    </QueryClientProvider>
  );
};

export default MyApp;
