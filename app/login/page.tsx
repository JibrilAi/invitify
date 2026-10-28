"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { setHostAuthenticated } from "@/lib/invitation-store";
import HostLoginModal from "../components/dashboard/HostLoginModal";

export default function LoginPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <HostLoginModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          router.push("/");
        }}
        onSuccess={() => {
          setHostAuthenticated(true);
          router.push("/dashboard");
        }}
      />
    </div>
  );
}
