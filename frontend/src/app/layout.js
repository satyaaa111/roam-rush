import './globals.css'
import { AuthProvider } from '@/hooks/useAuth';

export const metadata = {
  title: 'TravelConnect - Your Travel Social Network',
  description: 'Connect with travelers, share experiences, and plan your next adventure',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body><AuthProvider>{children}</AuthProvider></body>
    </html>
  )
}
