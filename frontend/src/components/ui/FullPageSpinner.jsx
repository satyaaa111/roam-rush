// src/components/ui/FullPageSpinner.jsx
import { Loader2 } from "lucide-react";

export const FullPageSpinner = () => {
  return (
    // This div takes up the full screen and centers the spinner
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );
};