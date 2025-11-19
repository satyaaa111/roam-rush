'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function OtpModal({ 
  isOpen, 
  onClose, 
  email, 
  onVerify, 
  onResend, 
  isLoading 
}) {
  const [otp, setOtp] = useState("");

  const handleVerify = () => {
    if (otp.length === 6) {
      onVerify(otp);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify your account</DialogTitle>
          <DialogDescription>
            Enter the 6-digit code sent to <span className="font-medium text-blue-600">{email}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center space-y-6 py-4 text-gray-900">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          <div className="text-sm text-muted-foreground">
            Didn't receive code?{" "}
            <button
              onClick={onResend}
              className="text-blue-600 hover:underline font-medium"
              type="button"
            >
              Resend OTP
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3">
            {/* Using shadcn Button component */}
            <Button variant="outline" onClick={() => onClose(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button 
              onClick={handleVerify} 
              disabled={otp.length !== 6 || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}