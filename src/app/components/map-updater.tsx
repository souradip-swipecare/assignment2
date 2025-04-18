"use client"

import { useEffect } from "react"
import { useMap } from "react-leaflet"

interface MapUpdaterProps {
  center: [number, number]
}

export default function MapUpdater({ center }: MapUpdaterProps) {
  const map = useMap()

  useEffect(() => {
    map.setView(center, 12)
  }, [center, map])

  return null
}
