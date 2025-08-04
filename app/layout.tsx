import '../styless/globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Hitung Pesangon PHK',
  description: 'Aplikasi Hitung Pesangon PHK'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-gray-50 text-gray-800">
        <div className="min-h-screen flex flex-col items-center p-4">
          {children}
        </div>
      </body>
    </html>
  )
}
