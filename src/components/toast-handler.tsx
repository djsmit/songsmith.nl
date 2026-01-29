"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function ToastHandler() {
  useEffect(() => {
    // Show toast after page reload if early bird was just claimed
    if (sessionStorage.getItem("earlybird_claimed")) {
      sessionStorage.removeItem("earlybird_claimed");
      toast.success("Welcome to Early Bird Pro!", {
        description: "You now have unlimited songs and setlists.",
      });
    }
  }, []);

  return null;
}
