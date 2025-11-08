'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])

  const handleLogin = (e) => {
    e.preventDefault()
    if (email && password) {
      setStep(2)
    }
  }

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)
      
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus()
      }
    }
  }

  const handleVerifyOtp = (e) => {
    e.preventDefault()
    if (otp.every(digit => digit !== '')) {
      router.push('/home')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-700 mb-2">TravelConnect</h1>
          <p className="text-gray-600">Your journey begins here</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step === 1 ? (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome Back</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field pl-10"
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
                      className="input-field pl-10"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2">
                  Continue
                  <ArrowRight size={20} />
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <a href="/signup" className="text-primary-600 font-semibold hover:text-primary-700">
                    Sign up
                  </a>
                </p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Two-Step Verification</h2>
              <p className="text-gray-600 mb-6">Enter the 6-digit code sent to your email</p>
              
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  ))}
                </div>

                <button type="submit" className="w-full btn-primary">
                  Verify & Login
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full btn-secondary"
                >
                  Back to Login
                </button>
              </form>

              <div className="mt-4 text-center">
                <button className="text-sm text-primary-600 hover:text-primary-700">
                  Resend Code
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
