"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Loader2, Database } from "lucide-react"

export function DbConnectionTest() {
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<any>(null)

  const testConnection = async () => {
    setTesting(true)
    setResult(null)

    try {
      const response = await fetch("/api/test-db")
      const data = await response.json()
      setResult(data)
    } catch (error: any) {
      setResult({
        success: false,
        message: "Failed to reach the API",
        error: error.message,
      })
    } finally {
      setTesting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Connection Test
        </CardTitle>
        <CardDescription>Test your MongoDB connection and troubleshoot issues</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testConnection} disabled={testing} className="w-full">
          {testing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing Connection...
            </>
          ) : (
            "Test Database Connection"
          )}
        </Button>

        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            {result.success ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            <AlertTitle>{result.success ? "Connection Successful" : "Connection Failed"}</AlertTitle>
            <AlertDescription className="mt-2 space-y-2">
              <p>{result.message}</p>

              {result.success && result.collections && (
                <div className="mt-3">
                  <p className="font-medium">Database: {result.database}</p>
                  <p className="text-sm">Collections: {result.collections.join(", ") || "None yet"}</p>
                </div>
              )}

              {!result.success && result.troubleshooting && (
                <div className="mt-3">
                  <p className="font-medium mb-2">Troubleshooting Steps:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {result.troubleshooting.map((step: string, index: number) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.error && <p className="mt-2 text-sm font-mono bg-muted p-2 rounded">Error: {result.error}</p>}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
