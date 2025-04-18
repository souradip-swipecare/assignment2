export interface Project1 {
  id: string
  name: string
  location: string
  priceRange: string
  builder: string
  coordinates: {
    lat: number
    lng: number
  }
  images: string[]
  description: string
  amenities: string[]
  propertyType: string
  size: string
  status: string
  possession: string
  detailedLocation: {
    address: string
    landmarks: string[]
    connectivity: string[]
  }
}

export interface Project  {
  name: string;
  url?: string;
  location: string;
  price?: string;
  image?: string;
  builder: string | null;
  video: {
    thumbnail: string | null;
    views: string | null;
    author: string | null;
    followers: string | null;
  };
  tags: { title: string; description: string }[];
  cta_buttons: string[];
  coordinates: {
    lat: number
    lng: number
  };
};

