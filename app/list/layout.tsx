import '@/app/global.css'

import styles from "./styles.module.css";
import { draftMode } from "next/headers";
import AlertBanner from "../(home)/alert-banner";
import { VisualEditing } from "next-sanity";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = {
  title: 'Index of /~venice/projects/',
  description: 'Generated by Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <meta name="color-scheme" content="dark light"></meta>
      <body className={styles.body} >
        <section>
          {draftMode().isEnabled && <AlertBanner />}
          <main>
            {children}
          </main>
        </section>
        {draftMode().isEnabled && <VisualEditing />}
        <SpeedInsights />
      </body>
    </html>
  )
}
