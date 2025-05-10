"use client"

import Link from "next/link"
import { PawPrint, Bell, Scale, Calendar, HeartPulse, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-purple-50 px-4">
      <section className="max-w-2xl w-full mx-auto text-center py-16">
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-semibold text-lg">
            <PawPrint className="h-6 w-6" />
            LiveStock Health Tracker
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">
          The Smart Way to Manage Your Farm Animals
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8">
          LiveStock Health Tracker is your all-in-one solution for modern livestock management.
          Effortlessly track every animal on your farm, monitor their weight, age, and health status,
          and receive instant notifications when an animal needs attention.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/auth/signup">
              <UserPlus className="mr-2 h-5 w-5" />
              Get Started Free
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
            <Link href="/auth/login">
              Demo Login
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <FeatureCard
            icon={<PawPrint className="h-7 w-7 text-primary" />}
            title="Animal Inventory"
            description="Easily add, edit, and view all your farm animals in one place. Keep detailed records for each animal, including breed, sex, and unique notes."
          />
          <FeatureCard
            icon={<Scale className="h-7 w-7 text-primary" />}
            title="Track Weight & Age"
            description="Monitor the growth and health of your animals by recording their weight and age over time. Spot trends and make informed decisions."
          />
          <FeatureCard
            icon={<HeartPulse className="h-7 w-7 text-primary" />}
            title="Health Status & History"
            description="Log health checks, treatments, and vaccinations. Instantly see which animals are healthy, sick, or quarantined, and review their full medical history."
          />
          <FeatureCard
            icon={<Bell className="h-7 w-7 text-primary" />}
            title="Smart Notifications"
            description="Receive real-time alerts when an animal is marked as sick or needs a vaccine. Stay on top of your herd's health and never miss a critical update."
          />
        </div>
      </section>
    </main>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white/80 rounded-xl shadow-md p-6 flex flex-col gap-3 border border-gray-100 hover:shadow-lg transition">
      <div className="flex items-center justify-center mb-2">
        {icon}
      </div>
      <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}