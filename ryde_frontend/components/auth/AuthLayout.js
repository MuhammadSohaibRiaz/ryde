import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "../../components/ui/buttons"

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="flex items-center mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>

        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Image src="/logo.png" alt="Ryde5 Logo" width={180} height={35} priority className="mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
            {subtitle && <p className="text-gray-600">{subtitle}</p>}
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}