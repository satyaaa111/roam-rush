'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, ArrowRight, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth' // <-- 1. IMPORT THE AUTH HOOK
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth() // <-- 2. GET THE LOGIN FUNCTION

  // State for the form fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // State for loading and errors
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // 3. THIS IS THE NEW LOGIN HANDLER
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    setIsLoading(true);
    setError(null);

    try {
      // 4. CALL THE LOGIN FUNCTION FROM OUR HOOK
      // This calls our axios interceptor, hits /api/v1/auth/login,
      // saves the token, and fetches the user.
      await login(email, password)

      toast("Login Successful", {
        description: "Welcome back!",
        // You can add action buttons, etc.
        action: {
          label: "OK",
          onClick: () => console.log("Undo"),
        },
      });
      // 5. LOGIN SUCCESS!
      // Redirect to the homepage
      router.push('/home');

    } catch (err) {
      // 6. LOGIN FAILED!
      // The interceptor or login function threw an error.
      // We check for the specific "401 Unauthorized" error.
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setError('Invalid email or password. Please try again.')
      } else {
        // Generic error for "server is down," etc.
        setError('An unexpected error occurred. Please try again.')
      }
      setIsLoading(false)
    }
  }

  // We have removed the 'step', 'otp', 'handleOtpChange', 
  // and 'handleVerifyOtp' logic for this 1-step login.

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          {/* We'll use the real app name from our plan */}
          <h1 className="text-4xl font-bold text-blue-700 mb-2">Roam Rush</h1>
          <p className="text-gray-600">Your journey begins here</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* 7. REMOVED THE TERNARY: We only show the login form */}
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome Back</h2>
            
            {/* 8. ADDED ERROR DISPLAY */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 flex items-center gap-2">
                <AlertTriangle size={20} />
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    // Tailwind 'input-field' class (assuming you defined it)
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    // Tailwind 'input-field' class (assuming you defined it)
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* 9. ADDED LOADING/DISABLED STATE TO BUTTON */}
              <button 
                type="submit" 
                // Tailwind 'btn-primary' (assuming you defined it)
                className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Continue'}
                {!isLoading && <ArrowRight size={20} />}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <a href="/signup" className="text-blue-600 font-semibold hover:text-blue-700">
                  Sign up
                </a>
              </p>
            </div>
          </>
        </div>
      </div>
    </div>
  )
}