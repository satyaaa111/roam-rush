'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, ArrowRight, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth' 
import { toast } from "sonner";
import OtpModal from '@/components/auth/OtpModal';

export default function LoginPage() {
  const router = useRouter()
  const { login, verifyLoginOtp, verifyEmail, resendOtp } = useAuth() // Import verifyEmail too!

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  // We need to know: Are we verifying 2FA (Login) or Email (Signup)?
  // Default to 'login' (2FA)
  const [otpMode, setOtpMode] = useState('login'); 

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setIsLoading(true);
    setError(null);

    try {
      // 1. Try to Login
      await login(email, password)
      
      // If successful, it means Password matched and User is Verified.
      toast.success("Credentials Verified", { description: "Please enter the 2FA code." });
      setOtpMode('login'); // We are doing 2FA
      setIsOtpOpen(true);

    } catch (err) {
      const msg = err.response?.data?.error || "";
      // 2. CHECK FOR UNVERIFIED EMAIL ERROR
      // Your backend throws: "Please verify your email before logging in."
      if (msg.includes("verify your email")) {
        
        toast.info("Verification Needed", { description: "Sending verification code..." });
        
        // Trigger Resend (which sends EMAIL_VERIFICATION code)
        try {
            await resendOtp(email);
            setOtpMode('verification'); // SWITCH MODE to verification
            setIsOtpOpen(true);
        } catch (resendErr) {
             // Even if rate limited, open modal
             const resendMsg = resendErr.response?.data?.error || "";
             if (resendMsg.includes("already been sent")) {
                setOtpMode('verification');
                setIsOtpOpen(true);
             } else {
                toast.error("Error", { description: "Could not send verification code." });
             }
        }

      } else if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error("Login Failed", { description: "Invalid email or password." });
      } else {
        toast.error("Login Failed", { description: "Unexpected Error Occurred." });
      }
    } finally {
      setIsLoading(false)
    }
  }

  // This function decides which verification to call based on 'otpMode'
  const handleVerifyOtp = async (otp) => {
      setIsLoading(true);
      try {
          if (otpMode === 'login') {
             // 2FA Flow
             await verifyLoginOtp(email, otp);
             toast.success("Login Successful", { description: "Welcome back!" });
          } else {
             // Email Verification Flow (triggered from Login page)
             await verifyEmail(email, otp);
             toast.success("Verified & Logged In", { description: "Welcome to Roam Rush!" });
          }
          
          setIsOtpOpen(false);
          router.push('/home'); 

      } catch (err) {
          toast.error("Verification Failed", { description: "Invalid Code." });
      } finally {
          setIsLoading(false);
      }
  }

  const handleResend = async () => {
      try {
          if (otpMode === 'login') {
             await login(email, password);
          } else {
             await resendOtp(email);
          }
          toast.success("Code Resent", { description: "Check your email." });
      } catch (err) {
          toast.error("Resend Failed", { description: "Please wait before retrying." });
      }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      
      <OtpModal 
        isOpen={isOtpOpen}
        onClose={setIsOtpOpen}
        email={email}
        onVerify={handleVerifyOtp}
        onResend={handleResend}
        isLoading={isLoading}
      />

      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-700 mb-2">Roam Rush</h1>
          <p className="text-gray-600">Your journey begins here</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome Back</h2>
          
          {/* ... Form inputs remain the same ... */}
          {/* Copy form inputs from previous Login page example */}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-300"
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
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-300"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Continue'}
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
        </div>
      </div>
    </div>
  )
}