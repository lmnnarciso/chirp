import { type AppType } from "next/app";

import { api } from "~/utils/api";
import { SessionProvider } from "next-auth/react";

import type { AppProps } from "next/app";
import "~/styles/globals.css";

const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
