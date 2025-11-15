import './globals.css'
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: 'RoamRush - Your Travel Social Network',
  description: 'Connect with travelers, share experiences, and plan your next adventure',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster 
            position="top-right"
            // duration={5000}
            // toastOptions={{
            //   classNames: {
            //     toast: 'w-auto md:w-[400px]', // Sets width for medium screens and up
            //     // You could also add padding, e.g., 'p-6'
            //   },
            // }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
