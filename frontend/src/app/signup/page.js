'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Lock, ArrowRight, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth' 
import { toast } from "sonner";
export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  // State for loading and errors
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Simplified formData to match our backend DTO
  const [formData, setFormData] = useState({
    name: '', // This will be sent as 'username'
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // 3. THIS IS THE NEW SUBMIT HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // 4. Client-side validation first
    if (formData.password !== formData.confirmPassword) {
      // setError('Passwords do not match!')
      toast.error("Error", {
          description: "Passwords do not match!",
          action: {
          label: "OK",
          onClick: () => console.log("Undo"),
          },
      });
      return // Stop the submission
    }

    setIsLoading(true)

    try {
      // 5. CALL THE SIGNUP FUNCTION FROM OUR HOOK
      // We pass the 'name' field as the 'username' parameter
      const response = await signup(formData.name, formData.email, formData.password)
      console.log(response.message);
      toast("Signup Successful", {
        description: "Go to login page",
        // You can add action buttons, etc.
        action: {
          label: "OK",
          onClick: () => console.log("Undo"),
        },
      });
      router.push('/login');

    } catch (err) {
      // 7. SIGNUP FAILED!
      setIsLoading(false)
      
      // Check for the specific "duplicate email" error
      // Our backend sends a 409 Conflict for this
      if (err.response && err.response.status === 409) {
        // setError(err.response.data.error || 'This email is already in use.')
        toast.error("Sign up Failed", {
          description: err.response.data.error || "This email is already in use.",
          action: {
          label: "OK",
          onClick: () => console.log("Undo"),
          },
        });
      } else {
        // Generic error for "server is down," etc.
        // setError('An unexpected error occurred. Please try again.')
        toast.error("Sign up Failed", {
          description: 'An unexpected error occurred. Please try again.',
          action: {
          label: "OK",
          onClick: () => console.log("Undo"),
          },
        });
      }
    } finally {
      // 8. ADD A FINALLY BLOCK
      // This runs after 'try' OR 'catch'
      // This ensures the button is re-enabled
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-700 mb-2">Roam Rush</h1>
          <p className="text-gray-600">Start your travel journey today</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Account</h2>
          
          {/* 8. ADDED ERROR DISPLAY */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 flex items-center gap-2">
              <AlertTriangle size={20} />
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="name" // This will be our 'username'
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* 9. PHONE FIELD REMOVED (to match backend) */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                  required
                  minLength="8"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                  required
                  minLength="8"
                />
              </div>
            </div>

            {/* 10. ADDED LOADING/DISABLED STATE TO BUTTON */}
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
              {!isLoading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-blue-600 font-semibold hover:text-blue-700">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}