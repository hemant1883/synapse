import { DbConnectionTest } from "@/components/db-connection-test"

export default function TestConnectionPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <DbConnectionTest />
    </div>
  )
}
