'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Map, Users, Video, MessageCircle, Info, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth' // 1. IMPORT YOUR AUTH HOOK
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog" // 2. IMPORT SHADCN COMPONENTS

export default function Navbar() {
  const pathname = usePathname()
  const { logout } = useAuth() // 3. GET THE LOGOUT FUNCTION

  const navItems = [
    { name: 'Home', path: '/home', icon: Home },
    { name: 'Journey', path: '/journey', icon: Map },
    { name: 'Friends', path: '/friends', icon: Users },
    { name: 'Videos', path: '/videos', icon: Video },
    { name: 'Chat', path: '/chat', icon: MessageCircle },
    { name: 'About', path: '/about', icon: Info },
  ]

  const isActive = (path) => pathname === path

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Map className="text-primary-600" size={32} />
            <span className="text-2xl font-bold text-primary-700">RoamRush</span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary-100 text-primary-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-6">
            <Link href="/profile" className="flex items-center gap-2 hover:opacity-80">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                JD
              </div>
            </Link>

            {/* ▼▼▼ ALL YOUR CHANGES ARE HERE ▼▼▼ */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                {/* 4. This is now a <button> that triggers the modal */}
                <button
                  className="text-gray-600 hover:text-gray-800 flex items-center gap-2 cursor-pointer"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will end your current session and you will be redirected to the login page.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  {/* 5. This button calls the logout function on click */}
                  <AlertDialogAction onClick={logout}>
                    OK
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            {/* ▲▲▲ ALL YOUR CHANGES ARE HERE ▲▲▲ */}
          </div>
        </div>

        <div className="md:hidden flex overflow-x-auto pb-2 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  isActive(item.path)
                    ? 'bg-primary-100 text-primary-700 font-semibold'
                    : 'text-gray-600'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}