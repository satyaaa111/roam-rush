import './globals.css'

export const metadata = {
  title: 'TravelConnect - Your Travel Social Network',
  description: 'Connect with travelers, share experiences, and plan your next adventure',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

