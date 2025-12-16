"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TestAssessmentPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const createTestSession = async () => {
    setIsCreating(true);
    setError(null);

    try {
      // Step 1: Create a test user
      const userResponse = await fetch("/api/test-assessment/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: `test-${Date.now()}@test.com`,
          firstName: "Test",
        }),
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        throw new Error(errorData.error || "Failed to create test user");
      }

      const { userId } = await userResponse.json();

      // Step 2: Create a session
      const sessionResponse = await fetch("/api/assessment/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!sessionResponse.ok) {
        const errorData = await sessionResponse.json();
        throw new Error(errorData.error || "Failed to create session");
      }

      const { session } = await sessionResponse.json();
      const sessionId = session.id;

      // Step 3: Generate token
      const tokenResponse = await fetch("/api/jwt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          email: `test-${Date.now()}@test.com`,
        }),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        throw new Error(errorData.error || "Failed to generate token");
      }

      const { token } = await tokenResponse.json();

      // Step 4: Redirect to assessment
      router.push(`/assessment/${sessionId}?token=${token}`);
    } catch (err) {
      console.error("Error creating test session:", err);
      setError(err instanceof Error ? err.message : "Failed to create test session");
      setIsCreating(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#F5F1E8" }}
    >
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1
          className="text-2xl font-bold mb-6 text-center"
          style={{
            color: "#3D4D2E",
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 700,
          }}
        >
          Test Assessment
        </h1>

        <p className="text-sm mb-6 text-center" style={{ color: "#666" }}>
          This page creates a test session and redirects you directly to the assessment
          without requiring email verification. Use this for testing when Resend API is not configured.
        </p>

        {error && (
          <div
            className="mb-6 p-4 rounded-lg"
            style={{ backgroundColor: "#FEE2E2", color: "#991B1B" }}
          >
            <p className="text-sm font-medium">Error: {error}</p>
          </div>
        )}

        <button
          onClick={createTestSession}
          disabled={isCreating}
          className="w-full text-white px-6 py-3 rounded-lg text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:opacity-90"
          style={{
            backgroundColor: isCreating ? "#9CA3AF" : "#4A5D23",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
          }}
        >
          {isCreating ? "Creating Test Session..." : "Start Test Assessment"}
        </button>

        <p className="text-xs mt-4 text-center" style={{ color: "#999" }}>
          This will create a temporary test user and session in your database.
        </p>
      </div>
    </div>
  );
}

