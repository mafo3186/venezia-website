import './global.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='de'>
      {children}
    </html>
  )
}
