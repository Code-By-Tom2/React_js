"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function VerificationPendingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="flex justify-center mb-6">
          <AlertCircle className="h-12 w-12 text-yellow-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Verification Pending</h1>
        <p className="text-gray-600 mb-6">
          Your NGO account is currently pending verification. Our team is reviewing your
          submission and will verify your account within 2-3 business days.
        </p>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Need to update your verification details?{" "}
            <a
              href="https://forms.google.com/verification-form"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Click here
            </a>
          </p>
          <Link href="/">
            <Button variant="outline" className="w-full">
              Return to Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}