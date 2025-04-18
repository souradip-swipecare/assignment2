import Link from "next/link"
import { Building2 } from "lucide-react"

export default function HomePage() {
    // Popular cities for real estate projects
    const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata", "Ahmedabad"]

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="container mx-auto px-4 py-16">
                <div className="flex items-center justify-center mb-8">
                    <Building2 className="h-8 w-8 mr-2 text-rose-600" />
                    <h1 className="text-3xl font-bold text-gray-900">Real Estate Project Listings</h1>
                </div>

                <div className="max-w-3xl mx-auto text-center mb-12">
                    <p className="text-lg text-gray-700 mb-8">
                        Explore real estate projects across major cities in India. Select a city below to view available projects
                        with interactive maps.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {cities.map((city) => (
                            <Link
                                key={city}
                                href={`/city/${city.toLowerCase()}`}
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 hover:bg-rose-50"
                            >
                                <span className="font-medium text-gray-800">{city}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}
