'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Lock, ArrowRight, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth' 
import { toast } from "sonner";
import OtpModal from '@/components/auth/OtpModal';

export default function SignupPage() {
  const router = useRouter();
  // We don't need checkEmailStatus anymore
  const { register, verifyEmail, resendOtp } = useAuth(); 

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isOtpOpen, setIsOtpOpen] = useState(false);

  // We store the OTP context (is it for 'verification' or 'login')? 
  // For signup page, it's always verification.

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      toast.error("Error", { description: "Passwords do not match!" });
      return 
    }

    setIsLoading(true)

    try {
      // 1. TRY TO REGISTER
      await register(formData.email, formData.password, formData.name);
      
      // Success? Great.
      toast.success("Signup Successful", { description: "Please check your email for the code." });
      setIsOtpOpen(true);

    } catch (err) {
      // 2. CATCH 'EMAIL IN USE' ERROR (409) OR (400)
      // Note: Check your exact backend error status. Usually 400 or 409.
      const errorMessage = err.response?.data?.error || "";
      console.log("Signup error:", errorMessage);
      if (errorMessage == 'Email is already in use.' || err.response?.status === 409 || err.response?.status === 400) {
        // 3. AUTOMATICALLY TRY TO RESEND OTP
        try {
          await resendOtp(formData.email);
          toast.info("Account Exists", { description: "Unverified account found. Sending new code..." });
          setIsOtpOpen(true); // Open modal for the unverified user
        } catch (resendErr) {
          const resendMsg = resendErr.response?.data?.error || "";
          console.log("Resend error:", resendMsg);
          // 4. CHECK IF ALREADY VERIFIED
          if (resendMsg.includes("already verified")) {
             toast.info("Account Exists", { description: "You are already verified. Please login." });
             router.push('/login');
          }
          // 5. CHECK IF RATE LIMITED (OTP ALREADY SENT)
          else if (resendMsg.includes("already been sent")) {
             toast.info("Code Sent", { description: "A code was already sent recently. Please check your email." });
             setIsOtpOpen(true); // Open modal anyway so they can enter it
          }
          else {
             setError("This email is already registered. Please login.");
          }
        }
      } else {
        toast.error("Signup Failed", { description: "An unexpected error occurred." });
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (otp) => {
    setIsLoading(true);
    try {
        await verifyEmail(formData.email, otp);
        toast.success("Verification Successful", { description: "Welcome to Roam Rush!" });
        setIsOtpOpen(false);
        router.push('/home'); 
    } catch (err) {
        toast.error("Verification Failed", { description: "Invalid OTP. Please try again." });
    } finally {
        setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
      try {
          await resendOtp(formData.email);
          toast.success("Code Resent", { description: "Check your email for a new code." });
      } catch (err) {
          const msg = err.response?.data?.error || "Please wait before retrying.";
          toast.error("Resend Failed", { description: msg });
      }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-50 via-white to-blue-50 flex items-center justify-center p-4">
      
      <OtpModal 
        isOpen={isOtpOpen}
        onClose={setIsOtpOpen}
        email={formData.email}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        isLoading={isLoading}
      />

      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-700 mb-2">Roam Rush</h1>
          <p className="text-gray-600">Start your travel journey today</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Account</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 flex items-center gap-2">
              <AlertTriangle size={20} />
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ... Inputs remain the same ... */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-300"
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-300"
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
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-300"
                  placeholder="••••••••"
                  required
                  minLength="8"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Create Account'}
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