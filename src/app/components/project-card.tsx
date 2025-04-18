"use client"

import Image from "next/image"
import { Building, MapPin, IndianRupee, Home } from "lucide-react"
import type { Project } from "@/types/project"

interface ProjectCardProps {
  project: Project
  isLoading?: boolean
  onClick?: () => void
}

export default function ProjectCard({ project, isLoading = false, onClick }: ProjectCardProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
    )
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-rose-500"
      onClick={onClick}
    >
      <div className="relative h-40 bg-gray-200">
        {/* {project.images.length > 0 ? (
          <Image src={project.images[0] || "/placeholder.svg"} alt={project.name} fill className="object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Home className="h-12 w-12 text-gray-400" />
          </div>
        )} */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <h3 className="text-lg font-semibold text-white">{project.name}</h3>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center text-gray-600 mb-1">
          <MapPin className="h-4 w-4 mr-2 text-rose-500 flex-shrink-0" />
          <span className="text-sm truncate">{project.location}</span>
        </div>

        {/* <div className="flex items-center text-gray-600 mb-1">
          <IndianRupee className="h-4 w-4 mr-2 text-rose-500 flex-shrink-0" />
          <span className="text-sm">{project.priceRange}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <Building className="h-4 w-4 mr-2 text-rose-500 flex-shrink-0" />
          <span className="text-sm truncate">{project.builder}</span>
        </div>

        <div className="mt-2 flex justify-between items-center">
          <span className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-full">{project.propertyType}</span>
          <span className="text-xs text-gray-500">{project.size}</span>
        </div> */}
      </div>
    </div>
  )
}
