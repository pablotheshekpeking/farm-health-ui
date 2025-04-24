"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, PawPrint, PlusCircle, BarChart3, User, LogOut, Menu, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { signOut } from "next-auth/react"
import { ThemeToggle } from "../app/components/ThemeToggle"
const NavItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Animals", href: "/animals", icon: PawPrint },
  { name: "Add Animal", href: "/animals/new", icon: PlusCircle },
  //{ name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Profile", href: "/settings/profile", icon: User },
]

export default function NavBar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (path) => pathname === path

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
              <PawPrint className="h-6 w-6" />
              <span>LiveStock Health Tracker</span>
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
                    <span>LiveStock Health Tracker</span>
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
                    <Link
                      href="/auth/login"
                      className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                      onClick={() => setOpen(false)}
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </Link>
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
