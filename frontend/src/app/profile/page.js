'use client'

import Navbar from '@/components/Navbar'
import { MapPin, Calendar, Camera, Users, Heart } from 'lucide-react'

const userStats = [
  { label: 'Countries Visited', value: '23', icon: MapPin },
  { label: 'Travel Posts', value: '147', icon: Camera },
  { label: 'Friends', value: '892', icon: Users },
  { label: 'Likes Received', value: '5.2K', icon: Heart },
]

const travelPosts = [
  { id: 1, location: 'Paris, France', date: 'March 2024' },
  { id: 2, location: 'Tokyo, Japan', date: 'February 2024' },
  { id: 3, location: 'Bali, Indonesia', date: 'January 2024' },
  { id: 4, location: 'Swiss Alps', date: 'December 2023' },
  { id: 5, location: 'Santorini, Greece', date: 'November 2023' },
  { id: 6, location: 'New Zealand', date: 'October 2023' },
]

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gradient-to-r from-primary-500 to-cyan-500 rounded-t-2xl h-48"></div>
        
        <div className="bg-white rounded-b-2xl shadow-lg p-6 -mt-16 relative">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
            <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-cyan-500 rounded-full border-4 border-white flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              JD
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800">John Doe</h1>
              <p className="text-gray-600 flex items-center gap-2 mt-1">
                <MapPin size={16} />
                Travel Enthusiast • San Francisco, CA
              </p>
              <p className="text-gray-700 mt-3">
                Passionate traveler exploring the world one destination at a time. 
                Love connecting with fellow travelers and sharing experiences! ✈️🌍
              </p>
            </div>

            <button className="btn-primary whitespace-nowrap">
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {userStats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="text-center p-4 bg-gray-50 rounded-lg">
                  <Icon className="mx-auto text-primary-600 mb-2" size={24} />
                  <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Travel Gallery</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold">Photos</button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold">Videos</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {travelPosts.map((post) => (
              <div key={post.id} className="relative h-64 bg-gradient-to-br from-primary-300 to-cyan-400 rounded-lg overflow-hidden shadow-md group cursor-pointer">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                  <MapPin size={48} className="mb-2" />
                  <h3 className="text-lg font-bold text-center">{post.location}</h3>
                  <p className="text-sm flex items-center gap-1 mt-1">
                    <Calendar size={14} />
                    {post.date}
                  </p>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
