// "use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Users, Car } from "lucide-react"

import { Button } from "@/components/ui/buttons"
import { Card, CardContent } from "@/components/ui/Card"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"

export default function LandingPage() {

  // const { isLoggedIn, user } = useSelector((state) => state.auth)

  // const router = useRouter()

  // if (isLoggedIn) {
  //   if(user.role == "user"){
  //     router.push("/user-dashboard")
  //   }
  //   else if(user.role == "driver"){
  //     router.push("/driver-dashboard")
  //   }
  //   else if(user.role == "guest"){
  //     router.push("/guest-dashboard")
  //   }
  // }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col">
      <header className="container mx-auto px-4 py-6">
        <Image src="/logo.png" alt="Ryde5 Logo" width={180} height={35} priority className="object-contain" />
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Choose Your Ryde5 Experience</h1>
          <p className="text-xl text-gray-300 mb-12">Whether you're looking to ride or drive, we've got you covered</p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* // this is card for passenger */}
            <Card className="bg-white/10 border-0 hover:bg-white/20 transition-colors">
              <CardContent className="p-6">
                <div className="mb-4">
                  <Users className="w-12 h-12 text-orange-500 mx-auto" />
                </div>
                <h2 className="text-2xl font-semibold text-white mb-4">Ride with Us</h2>
                <p className="text-gray-300 mb-6">
                  Get to your destination safely and comfortably with our trusted drivers
                </p>
                <Link href="/auth/passenger/login">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">
                    Continue as Passenger
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* // this card is for driver */}
            <Card className="bg-white/10 border-0 hover:bg-white/20 transition-colors">
              <CardContent className="p-6">
                <div className="mb-4">
                  <Car className="w-12 h-12 text-orange-500 mx-auto" />
                </div>
                <h2 className="text-2xl font-semibold text-white mb-4">Drive with Us</h2>
                <p className="text-gray-300 mb-6">Turn your car into an income source and be your own boss</p>
                <Link href="/auth/driver/login">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">
                    Continue as Driver
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

          </div>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-6 text-center text-gray-400">
        © 2025 Ryde5 | All Rights Reserved
      </footer>
    </div>
  )
}

