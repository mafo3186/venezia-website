import { Kotta_One, Noto_Sans_Mono } from 'next/font/google'


export const kotta = Kotta_One({
  variable: "--font-kotta-one",
  subsets: ["latin"],
  weight: '400'
});

export const notoMono = Noto_Sans_Mono({
  variable: "--font-noto-sans-mono",
  subsets: ["latin"],
  weight: '400'
});