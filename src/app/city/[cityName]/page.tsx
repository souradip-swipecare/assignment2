// "use client"

// import { useEffect, useState } from "react"
// import { useParams } from "next/navigation"
// import { X } from "lucide-react"
// import { ProjectProvider } from "@/context/project-context"
// import ProjectList from "../../components/project-list"
// import dynamic from "next/dynamic"
// import PropertyDetails from "../../components/property-details"
// import LoadingSpinner from "../../components/loading-spinner"
// import ScrapingStatus from "../../components/scraping-status"
// import { useProjects } from "@/context/project-context"

// // Dynamically import the map component with ssr: false
// const ProjectMap = dynamic(() => import("../../components/project-map"), {
//   ssr: false,
//   loading: () => (
//     <div className="h-[calc(100vh-200px)] min-h-[500px] bg-white rounded-lg shadow-md flex items-center justify-center">
//       <div className="text-gray-500">Loading map...</div>
//     </div>
//   ),
// })

// function CityContent() {
//   const { selectedProject, setSelectedProject, loading, isMockData } = useProjects()
//   const params = useParams()
//   const cityName = typeof params.cityName === "string" ? params.cityName : ""
//   const formattedCityName = cityName.charAt(0).toUpperCase() + cityName.slice(1)

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-4">Real Estate Projects in {formattedCityName}</h1>

//         <ScrapingStatus isLoading={loading} isMockData={isMockData} />

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-1">
//             <ProjectList />
//           </div>
//           <div className="lg:col-span-2">
//             {selectedProject ? (
//               <div className="relative">
//                 <button
//                   onClick={() => setSelectedProject(null)}
//                   className="absolute right-4 top-4 z-10 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
//                   aria-label="Close details"
//                 >
//                   <X className="h-5 w-5" />
//                 </button>
//                 <PropertyDetails project={selectedProject} onClose={() => setSelectedProject(null)} />
//               </div>
//             ) : (
//               <div className="h-[calc(100vh-200px)] min-h-[500px] sticky top-8">
//                 <ProjectMap />
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default function CityPage() {
//   const [isLoading, setIsLoading] = useState(true)
//   const params = useParams()
//   const cityName = typeof params.cityName === "string" ? params.cityName : ""
//   const formattedCityName = cityName.charAt(0).toUpperCase() + cityName.slice(1)

//   useEffect(() => {
//     // Simulate initial loading time
//     const timer = setTimeout(() => {
//       setIsLoading(false)
//     }, 1500)

//     return () => clearTimeout(timer)
//   }, [])

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <LoadingSpinner />
//       </div>
//     )
//   }

//   return (
//     <ProjectProvider cityName={formattedCityName}>
//       <CityContent />
//     </ProjectProvider>
//   )
// }


"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { ChevronDown, Download, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProjectProvider, useProjects } from "@/context/project-context";
import { useParams } from "next/navigation";
import LoadingSpinner from "@/app/components/loading-spinner";
import ProjectMap from "@/app/components/project-map";

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
  coordinates: {
    lat: number
    lng: number
  };
};
function CityContent() {
  const [hotspots, setHotspots] = useState<Project[]>([]);
  const { projects, selectedProject, setSelectedProject, loading, isMockData, fetchProjects } = useProjects();

  const params = useParams();
  const cityName = typeof params.cityName === "string" ? params.cityName : "";
  const formattedCityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (projects?.length) {
      setHotspots(projects);
    }
  }, [projects]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Real Estate Projects in {formattedCityName}
        </h1>
        {
          loading ? <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner />
          </div> 
          :
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Side – List */}
              <div className="lg:col-span-12 space-y-8">
                {hotspots.length > 0 ? (
                  hotspots.map((project) => (
                    <div
                      key={project.url || project.name}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden grid md:grid-cols-3"
                    >
                      {/* Image */}
                      <div className="relative md:col-span-1">
                        <Link href={project.url || "#"}>
                          <img
                            src={project.image}
                            alt="Base64 SVG"
                            width={600}
                            height={400}
                            className="object-cover h-full w-full"
                          />
                          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                            <h3 className="text-xl font-bold">{project.name}</h3>
                            <p>{project.location}</p>
                            <p className="text-lg font-semibold">{project.price}</p>
                          </div>
                        </Link>
                      </div>

                      {/* Info */}
                      <div className="col-span-2 p-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Video */}
                        {/* <div className="bg-blue-50 p-4 rounded-lg">
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
                    </div> */}

                        {/* Highlights */}
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

                        {/* maps */}
                        <div className="flex flex-col justify-end space-y-4 md:space-y-2 mt-4 md:mt-0">
                          <ProjectMap lat={project.coordinates.lat} lng={project.coordinates.lng} />

                        </div>
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

              {/* Right Side – Sticky Info/Map */}

            </div>
        }
        
      </div>
    </div>

  );
}

export default function PropertyListing() {
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams()
  const cityName = typeof params.cityName === "string" ? params.cityName : ""
  const formattedCityName = cityName.charAt(0).toUpperCase() + cityName.slice(1)

  useEffect(() => {
    // Simulate initial loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <LoadingSpinner />
  //     </div>
  //   )
  // }

  return (
    <ProjectProvider cityName={formattedCityName}>
      <CityContent />
    </ProjectProvider>
  )
}
// export default function PropertyListin() {
//   const [hotspots, setHotspots] = useState<Project[]>([]);
//   const [selectedCity, setSelectedCity] = useState("hyderabad");

//   // const fetchHotspots = async (cityName: string) => {
//   //   try {
//   //     const { data } = await axios.get(`/api/getcitywisedata?city=${cityName}`);
//   //     setHotspots(data);
//   //   } catch (error) {
//   //     console.error("Error fetching hotspots:", error);
//   //   }
//   // };
  
//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       {/* Header */}
      // <div className="mb-12">
      //   <div className="flex items-center mb-6">
      //     <h2 className="text-2xl font-bold text-gray-800">Hotspots in</h2>
      //     <select
      //       value={selectedCity}
      //       onChange={(e) => setSelectedCity(e.target.value)}
      //       className="ml-2 text-2xl font-bold text-gray-800 bg-transparent focus:outline-none"
      //     >
      //       <option value="hyderabad">Hyderabad</option>
      //       <option value="bangalore">Bangalore</option>
      //       <option value="mumbai">Mumbai</option>
      //     </select>
      //   </div>
      //   <div className="h-1 w-12 bg-red-500 mb-6"></div>

      //   {/* Cards */}
      //   <div className="space-y-8">
      //     {hotspots.length > 0 ? (
      //       hotspots.map((project) => (
      //         <div
      //           key={project.url || project.name}
      //           className="bg-white rounded-2xl shadow-lg overflow-hidden lg:flex"
      //         >
      //           {/* Image & Title */}
      //           <div className="lg:w-2/5 relative">
      //             <Link href={project.url || "#"}>
      //               <Image
      //                 src={project.image || "/placeholder.svg?height=400&width=600"}
      //                 alt={project.name}
      //                 width={600}
      //                 height={400}
      //                 className="object-cover w-full h-full"
      //               />
      //               <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
      //                 <h3 className="text-2xl font-bold">{project.name}</h3>
      //                 <p>{project.location}</p>
      //                 <p className="text-lg font-semibold">{project.price}</p>
      //               </div>
      //             </Link>
      //           </div>

      //           {/* Info */}
      //           <div className="lg:w-3/5 p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      //             {/* Video */}
      //             <div className="bg-blue-50 p-4 rounded-lg">
      //               <h4 className="text-blue-800 text-sm font-semibold mb-2">Video Tour</h4>
      //               {project.video?.thumbnail ? (
      //                 <>
      //                   <Image
      //                     src={project.video.thumbnail}
      //                     alt="Video"
      //                     width={150}
      //                     height={100}
      //                     className="rounded"
      //                   />
      //                   <p className="text-xs mt-2 text-gray-600">{project.video.views || "0 views"}</p>
      //                   <p className="text-xs text-gray-600">
      //                     By {project.video.author || "Unknown"} • {project.video.followers || "0 followers"}
      //                   </p>
      //                 </>
      //               ) : (
      //                 <div className="text-gray-500 text-center text-sm py-6">No Video</div>
      //               )}
      //             </div>

      //             {/* Tags */}
      //             <div className="bg-green-50 p-4 rounded-lg">
      //               <h4 className="text-green-800 text-sm font-semibold mb-2">Highlights</h4>
      //               {project.tags?.length > 0 ? (
      //                 project.tags.map((tag, i) => (
      //                   <p key={i} className="text-sm text-gray-700 mb-1">
      //                     <strong>{tag.title}</strong>: {tag.description}
      //                   </p>
      //                 ))
      //               ) : (
      //                 <p className="text-sm text-gray-500">No tags available</p>
      //               )}
      //             </div>

      //             {/* CTAs */}
      //             <div className="flex flex-col justify-end space-y-4 md:space-y-2 mt-4 md:mt-0">
      //               <Link
      //                 href={project.url || "#"}
      //                 className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg text-center font-semibold"
      //               >
      //                 View Details
      //               </Link>
      //               <button className="border border-red-500 text-red-500 hover:bg-red-50 py-3 px-6 rounded-lg font-semibold flex justify-center items-center">
      //                 <Download className="h-5 w-5 mr-2" />
      //                 Download Brochure
      //               </button>
      //             </div>
      //           </div>
      //         </div>
      //       ))
      //     ) : (
      //       <p className="text-gray-500 text-center">No projects found in this city.</p>
      //     )}
      //   </div>
      // </div>
//     </div>

//   );
// }



