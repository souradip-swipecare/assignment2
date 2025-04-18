"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { ChevronDown, Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useProjects } from "@/context/project-context";
import { useParams } from "next/navigation";

type Project = {
  name: string;
  url?: string;
  location: string;
  price?: string;
  image?: string;
  builder?: string | null;
  video: {
    thumbnail: string | null;
    views: string | null;
    author: string | null;
    followers: string | null;
  };
  tags: {
    title: string;
    description: string;
  }[];
  cta_buttons: string[];
};

export default function PropertyListing() {
  const [hotspots, setHotspots] = useState<Project[]>([]);
  const [selectedCity, setSelectedCity] = useState("hyderabad");

  // const fetchHotspots = async (cityName: string) => {
  //   try {
  //     const { data } = await axios.get(`/api/getcitywisedata?city=${cityName}`);
  //     setHotspots(data);
  //   } catch (error) {
  //     console.error("Error fetching hotspots:", error);
  //   }
  // };
  const { projects,selectedProject, setSelectedProject, loading, isMockData, fetchProjects } = useProjects()
  const params = useParams()
  const cityName = typeof params.cityName === "string" ? params.cityName : ""
  const formattedCityName = cityName.charAt(0).toUpperCase() + cityName.slice(1)
  useEffect(() => {
    fetchProjects();
  }, []);
  useEffect(() => {
    if (projects != null){
      setHotspots(projects)
    };
  }, []);
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Hotspots in</h2>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="ml-2 text-2xl font-bold text-gray-800 bg-transparent focus:outline-none"
          >
            <option value="hyderabad">Hyderabad</option>
            <option value="bangalore">Bangalore</option>
            <option value="mumbai">Mumbai</option>
          </select>
        </div>
        <div className="h-1 w-12 bg-red-500 mb-6"></div>

        {/* Cards */}
        <div className="space-y-8">
          {hotspots.length > 0 ? (
            hotspots.map((project) => (
              <div
                key={project.url || project.name}
                className="bg-white rounded-2xl shadow-lg overflow-hidden lg:flex"
              >
                {/* Image & Title */}
                <div className="lg:w-2/5 relative">
                  <Link href={project.url || "#"}>
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.name}
                      width={400}
                      height={400}
                      className="object-cover w-400 h-400"
                    />
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                      <h3 className="text-2xl font-bold">{project.name}</h3>
                      <p>{project.location}</p>
                      <p className="text-lg font-semibold">{project.price}</p>
                    </div>
                  </Link>
                </div>

                {/* Info */}
                <div className="lg:w-3/5 p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Video */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-blue-800 text-sm font-semibold mb-2">Video Tour</h4>
                    {project.video?.thumbnail ? (
                      <>
                        <Image
                          src={project.video.thumbnail}
                          alt="Video"
                          width={150}
                          height={100}
                          className="rounded"
                        />
                        <p className="text-xs mt-2 text-gray-600">{project.video.views || "0 views"}</p>
                        <p className="text-xs text-gray-600">
                          By {project.video.author || "Unknown"} • {project.video.followers || "0 followers"}
                        </p>
                      </>
                    ) : (
                      <div className="text-gray-500 text-center text-sm py-6">No Video</div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="text-green-800 text-sm font-semibold mb-2">Highlights</h4>
                    {project.tags?.length > 0 ? (
                      project.tags.map((tag, i) => (
                        <p key={i} className="text-sm text-gray-700 mb-1">
                          <strong>{tag.title}</strong>: {tag.description}
                        </p>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No tags available</p>
                    )}
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-col justify-end space-y-4 md:space-y-2 mt-4 md:mt-0">
                    <Link
                      href={project.url || "#"}
                      className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg text-center font-semibold"
                    >
                      View Details
                    </Link>
                    <button className="border border-red-500 text-red-500 hover:bg-red-50 py-3 px-6 rounded-lg font-semibold flex justify-center items-center">
                      <Download className="h-5 w-5 mr-2" />
                      Download Brochure
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No projects found in this city.</p>
          )}
        </div>
      </div>
    </div>

  );
}
