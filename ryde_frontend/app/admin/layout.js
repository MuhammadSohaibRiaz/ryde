"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  LayoutDashboard,
  Users,
  Car,
  Star,
  DollarSign,
  LineChart,
  Settings,
  AlertTriangle,
  MessageSquare,
  Bell,
  FileText,
  LogOut,
  UserCog,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/buttons"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useDispatch, useSelector } from "react-redux"
import {  logout } from "@/lib/features/AuthSlice"


const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: UserCog, label: "Drivers", href: "/admin/drivers" },
  { icon: Car, label: "Rides", href: "/admin/rides" },
  { icon: Star, label: "Reviews", href: "/admin/reviews" },
  { icon: DollarSign, label: "Payments", href: "/admin/payments" },
  { icon: LineChart, label: "Analytics", href: "/admin/analytics" },
  { icon: AlertTriangle, label: "Emergency Alerts", href: "/admin/emergency-alerts" },
  { icon: MessageSquare, label: "Support Tickets", href: "/admin/support-tickets" },
  { icon: Bell, label: "Notifications", href: "/admin/notifications" },
  { icon: FileText, label: "Documents", href: "/admin/documents" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
]

function SidebarContent({ pathname, onItemClick, handleLogout }) {
  return (
    <>
      <Link href="/admin" className="flex items-center pl-2.5 mb-5">
        <Image src="/logo.png" alt="Ryde5 Logo" width={180} height={35} priority className="object-contain" />
      </Link>
      <ul className="space-y-2 font-medium">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <li key={item.label}>
              <Link
                href={item.href}
                className={`flex items-center p-4 text-gray-300 rounded-lg hover:bg-gray-700 group ${isActive ? "bg-gray-700 text-white" : ""
                  }`}
                onClick={onItemClick}
              >
                <item.icon className="w-5 h-5" />
                <span className="ml-3">{item.label}</span>
              </Link>
            </li>
          )
        })}
        <li className="pt-4 mt-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-4 text-gray-300 rounded-lg hover:bg-gray-700 group"
          >
            <LogOut className="w-5 h-5" />
            <span className="ml-3">Logout</span>
          </button>
        </li>
      </ul>
    </>
  )
}

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const dispatch = useDispatch()
  const { loading, error, isLoggedIn, user } = useSelector((state) => state.auth)

  if (!isLoggedIn) {
    router.push("/")
  }

  useEffect(() => {
    if (isLoggedIn && !loading && user) {
      if (user.role === "admin") {
        setIsAuthenticated(true)
      }
    }
  }
    , [isLoggedIn, loading, user])


  const handleLogout = async () => {
    try {
      await dispatch(logout())
      router.push("/")
    } catch (error) {
      console.error(error)
      alert(error.message)
    }
  }



  return (

    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#1F2937] z-50 px-4 flex items-center justify-between">
        <Link href="/admin">
          <Image src="/logo.png" alt="Ryde5 Logo" width={120} height={35} priority className="object-contain" />
        </Link>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-[#1F2937]">
            <div className="h-full px-3 py-4 overflow-y-auto">
              <SidebarContent
                pathname={pathname}
                onItemClick={() => setIsMobileMenuOpen(false)}
                handleLogout={handleLogout}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:fixed md:flex top-0 left-0 z-40 w-64 h-screen bg-[#1F2937]">
        <div className="h-full px-3 py-4 overflow-y-auto">
          <SidebarContent pathname={pathname} handleLogout={handleLogout} />
        </div>
      </aside>

      {/* Main Content */}
      <div className="md:ml-64 p-4 mt-16 md:mt-0">
        <div className="p-4 rounded-lg bg-white min-h-[calc(100vh-2rem)]">{children}</div>
      </div>
    </div>

  )
}

