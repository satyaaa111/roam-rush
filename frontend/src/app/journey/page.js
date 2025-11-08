'use client'

import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { MapPin, Calendar, Users, Plane, ArrowRight } from 'lucide-react'

const travelPhotos = [
  { id: 1, location: 'Paris, France', type: 'photo' },
  { id: 2, location: 'Maldives', type: 'photo' },
  { id: 3, location: 'New York, USA', type: 'ad' },
  { id: 4, location: 'Dubai, UAE', type: 'photo' },
  { id: 5, location: 'Iceland', type: 'photo' },
  { id: 6, location: 'Special Offer', type: 'ad' },
]

export default function JourneyPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Explore & Plan Your Journey</h1>
          <p className="text-gray-600">Discover amazing destinations and plan your perfect trip</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {travelPhotos.map((photo) => (
            <div key={photo.id} className={`relative h-72 rounded-lg overflow-hidden shadow-lg group cursor-pointer ${photo.type === 'ad' ? 'border-4 border-yellow-400' : ''}`}>
              <div className={`absolute inset-0 ${photo.type === 'ad' ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gradient-to-br from-primary-400 to-cyan-500'} flex items-center justify-center`}>
                <div className="text-center text-white p-6">
                  <MapPin size={48} className="mx-auto mb-2" />
                  <h3 className="text-xl font-bold">{photo.location}</h3>
                  {photo.type === 'ad' && <p className="mt-2 text-sm">Limited Time Offer!</p>}
                </div>
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"></div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-primary-600 to-cyan-600 rounded-2xl shadow-xl p-8 text-white text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Plan Your Next Adventure?</h2>
          <p className="text-lg mb-6">Choose your trip duration and let us help you create the perfect itinerary</p>
          <button
            onClick={() => router.push('/journey/plan')}
            className="bg-white text-primary-700 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
          >
            Start Planning
            <ArrowRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={32} className="text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Flexible Dates</h3>
            <p className="text-gray-600">Plan trips that fit your schedule perfectly</p>
          </div>

          <div className="card text-center">
            <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-cyan-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Group Travel</h3>
            <p className="text-gray-600">Travel with friends and family</p>
          </div>

          <div className="card text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plane size={32} className="text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Best Deals</h3>
            <p className="text-gray-600">Get the most value for your budget</p>
          </div>
        </div>
      </div>
    </div>
  )
}
