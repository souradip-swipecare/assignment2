"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })

interface ProjectMapProps {
  lat: number
  lng: number
}

export default function ProjectMap({ lat, lng }: ProjectMapProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>([lat, lng])
  const [isClient, setIsClient] = useState(false)
  const [markerIcon, setMarkerIcon] = useState<any>(null)

  useEffect(() => {
    setIsClient(true)
    import("leaflet").then((L) => {
      ; (L.Icon.Default.prototype as any)._getIconUrl = undefined
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "/location.png",
        iconUrl: "/location.png",
        shadowUrl: "/location.png",
      })
      setMarkerIcon(
        new L.Icon({
          iconUrl: "/location.png",
          iconRetinaUrl: "/location.png",
          shadowUrl: "/location.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        }),
      )
    })
  }, [])

  useEffect(() => {
    setMapCenter([lat, lng])
  }, [lat, lng])

  useEffect(() => {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
    link.crossOrigin = ""
    document.head.appendChild(link)
    return () => {
      document.head.removeChild(link)
    }
  }, [])

  if (!isClient) {
    return (
      <div className="bg-white rounded-lg shadow-md h-[300px] w-full flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md h-[200px] w-full">
      <MapContainer center={mapCenter} zoom={12} style={{ height: "100%", width: "100%" }} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="w-full"
        />
        {markerIcon && <Marker position={[lat, lng]} icon={markerIcon} />}
      </MapContainer>
    </div>
  )
}

