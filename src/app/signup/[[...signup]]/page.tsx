"use client";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B1F3A] via-[#0B1F3A] to-[#1a3a5c]">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">GoldenDoor</h1>
          <p className="text-[#F0A500] text-lg font-medium">CRM Platform</p>
          <p className="text-gray-400 text-sm mt-1">Create your account</p>
        </div>
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-white shadow-2xl rounded-2xl border-0",
              headerTitle: "text-[#0B1F3A] font-bold",
              formButtonPrimary: "bg-[#F0A500] hover:bg-yellow-500 text-[#0B1F3A] font-semibold",
              formFieldInput: "border-gray-300 focus:border-[#F0A500] focus:ring-[#F0A500]",
              footerActionLink: "text-[#F0A500] hover:text-yellow-600 font-medium",
            },
          }}
          routing="path"
          path="/signup"
          signInUrl="/login"
          forceRedirectUrl="/"
        />
      </div>
    </div>
  );
}
