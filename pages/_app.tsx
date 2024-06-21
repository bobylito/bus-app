import { ThemeProvider } from "@/components/ThemeProvider";
import "@/styles/globals.css";

import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Component {...pageProps} />
      <Analytics />
    </ThemeProvider>
  );
}
