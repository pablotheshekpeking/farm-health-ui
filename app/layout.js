import { Inter } from "next/font/google"
import { AuthProvider } from "@/components/providers/auth-provider"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import NavBar from "@/components/NavBar"
import QueryProvider from "@/components/providers/query-provider"


const inter = Inter({ subsets: ["latin"] })

const APP_NAME = "LiveStock Health Tracker"
const APP_DEFAULT_TITLE = "LiveStock Health Tracker"
const APP_TITLE_TEMPLATE = "%s - LiveStock Health Tracker"
const APP_DESCRIPTION = "Comprehensive livestock health management system"

export const metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/icon512_maskable.png',
    shortcut: '/icon512_maskable.png',
    apple: '/icon512_maskable.png',
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
}

export const viewport = {
  themeColor: "#8936FF",
  viewportFit: "cover",
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div className="min-h-screen flex flex-col">
                <NavBar />
                <main className="flex-1 container mx-auto py-6 px-4 md:px-6">
                  {children}
                </main>
                <footer className="border-t py-4">
                  <div className="container mx-auto text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} LiveStock Health Tracker. All rights reserved.
                  </div>
                </footer>
              </div>
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
