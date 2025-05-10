"use client"
import { useEffect, useState } from "react"

export default function ClientDate({ dateString }) {
  const [formatted, setFormatted] = useState("")

  useEffect(() => {
    if (dateString) {
      setFormatted(new Date(dateString).toLocaleString())
    }
  }, [dateString])

  return <>{formatted}</>
}
