"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Project } from "@/types/project"

interface ProjectContextType {
  projects: Project[]
  loading: boolean
  isMockData: boolean
  selectedProject: Project | null
  fetchProjects: () => Promise<void>
  setSelectedProject: (project: Project | null) => void
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({
  children,
  cityName,
}: {
  children: ReactNode
  cityName: string
}) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [isMockData, setIsMockData] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const fetchProjects = useCallback(async () => {
    setLoading(true)

    try {
      // Call our API route for scraping
      const response = await fetch(`/api/getcitywisedata?city=${cityName.toLowerCase()}`)
      const data = await response.json()

      if (data) {
        setProjects(data)

        // Determine if we're using mock data
        // In a real implementation, the API would return this information
        // For now, we'll assume it's mock data since we know real scraping is blocked
        setIsMockData(false)
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
      setIsMockData(true)
    } finally {
      setLoading(false)
    }
  }, [cityName])

  return (
    <ProjectContext.Provider
      value={{
        projects,
        loading,
        isMockData,
        selectedProject,
        fetchProjects,
        setSelectedProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export function useProjects() {
  const context = useContext(ProjectContext)

  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectProvider")
  }

  return context
}
