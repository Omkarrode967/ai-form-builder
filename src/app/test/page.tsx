"use client";

import { useState } from "react";
import { testCohereAPI } from "../actions/testCohere";
import { Button } from "@/components/ui/button";

export default function TestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    try {
      const response = await testCohereAPI();
      setResult(response);
    } catch (error) {
      setResult({ success: false, error: "Failed to run test" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Cohere API Test</h1>
      <Button 
        onClick={handleTest} 
        disabled={loading}
        className="mb-4"
      >
        {loading ? "Testing..." : "Test Cohere API"}
      </Button>

      {result && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Result:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 