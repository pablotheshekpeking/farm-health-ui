"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, PawPrint, PlusCircle, User, LogOut, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { signOut, useSession } from "next-auth/react"
import { ThemeToggle } from "../app/components/ThemeToggle"
import NotificationDropdown from "@/components/NotificationDropdown"

// --- Skeleton Loader ---
function NavBarSkeleton() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Skeleton */}
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-muted rounded-full animate-pulse" />
            <div className="h-6 w-32 bg-muted rounded animate-pulse hidden sm:block" />
          </div>
          {/* Desktop Nav Skeleton */}
          <div className="hidden md:flex items-center gap-6">
            <div className="h-6 w-20 bg-muted rounded animate-pulse" />
            <div className="h-6 w-20 bg-muted rounded animate-pulse" />
            <div className="h-6 w-24 bg-muted rounded animate-pulse" />
            <div className="h-6 w-20 bg-muted rounded animate-pulse" />
            <div className="h-8 w-8 bg-muted rounded-full animate-pulse" /> {/* Notification */}
            <div className="h-8 w-16 bg-muted rounded animate-pulse" /> {/* Logout */}
          </div>
          {/* Mobile Nav Skeleton */}
          <div className="md:hidden flex items-center">
            <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </header>
  )
}
// -----------------------

const NavItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Animals", href: "/animals", icon: PawPrint },
  { name: "Add Animal", href: "/animals/new", icon: PlusCircle },
  { name: "Profile", href: "/settings/profile", icon: User },
]

export default function NavBar() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (path) => pathname === path

  // Show skeleton while session is loading
  if (status === "loading") return <NavBarSkeleton />

  // Public navbar if not logged in
  if (!session) {
    return (
      <header className="border-b">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <PawPrint className="h-6 w-6" />
              <span className="hidden xs:inline-block sm:inline-block md:inline-block lg:inline-block xl:inline-block 2xl:inline-block text-base sm:text-lg md:text-xl">LiveStock Health Tracker</span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                href="/auth/login"
                className="text-sm font-medium text-primary hover:underline"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="text-sm font-medium text-primary hover:underline"
              >
                Register
              </Link>
              <ThemeToggle />
            </nav>
          </div>
        </div>
      </header>
    )
  }

  // Authenticated navbar
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
              <PawPrint className="h-6 w-6" />
              <span className="hidden xs:inline-block sm:inline-block md:inline-block lg:inline-block xl:inline-block 2xl:inline-block text-base sm:text-lg md:text-xl">LiveStock Health Tracker</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {NavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.href) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
            <NotificationDropdown />
            <Button variant="ghost" size="sm" className="gap-2" onClick={() => signOut()}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </nav>

          {/* Mobile Navigation */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 py-4">
                <div className="flex items-center justify-between">
                  <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
                    <PawPrint className="h-6 w-6" />
                    <span className="text-base sm:text-lg md:text-xl">LiveStock Health Tracker</span>
                  </Link>
                  <SheetClose asChild>
                  </SheetClose>
                </div>
                <nav className="flex flex-col gap-4">
                  {NavItems.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                          isActive(item.href) ? "text-primary" : "text-muted-foreground"
                        }`}
                        onClick={() => setOpen(false)}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    </SheetClose>
                  ))}
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                      onClick={() => {
                        setOpen(false)
                        signOut()
                      }}
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <ThemeToggle />
                  </SheetClose>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
