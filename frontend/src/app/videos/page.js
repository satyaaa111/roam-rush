'use client'

import Navbar from '@/components/Navbar'
import { Play, Heart, MessageCircle, Share2, MapPin } from 'lucide-react'

const videos = [
  { id: 1, title: 'Exploring the Streets of Tokyo', creator: 'Michael Chen', location: 'Tokyo, Japan', views: '45K', likes: '2.3K', duration: '12:34' },
  { id: 2, title: 'Santorini Sunset Time-lapse', creator: 'Sarah Johnson', location: 'Santorini, Greece', views: '82K', likes: '5.1K', duration: '8:15' },
  { id: 3, title: 'Bali Rice Terraces Drone Footage', creator: 'Emma Williams', location: 'Bali, Indonesia', views: '123K', likes: '8.7K', duration: '10:42' },
  { id: 4, title: 'Swiss Alps Hiking Adventure', creator: 'David Kumar', location: 'Swiss Alps', views: '67K', likes: '4.2K', duration: '15:20' },
  { id: 5, title: 'New York City Food Tour', creator: 'Lisa Anderson', location: 'New York, USA', views: '91K', likes: '6.5K', duration: '18:45' },
  { id: 6, title: 'Iceland Northern Lights', creator: 'Sophie Martin', location: 'Iceland', views: '156K', likes: '12K', duration: '7:30' },
  { id: 7, title: 'Surfing in Australia', creator: 'James Wilson', location: 'Gold Coast, Australia', views: '73K', likes: '5.8K', duration: '11:22' },
  { id: 8, title: 'Morocco Desert Safari', creator: 'Carlos Rodriguez', location: 'Sahara Desert, Morocco', views: '98K', likes: '7.3K', duration: '14:10' },
]

export default function VideosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Travel Videos</h1>
          <p className="text-gray-600">Watch and discover amazing travel content from around the world</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
              <div className="relative h-48 bg-gradient-to-br from-primary-400 to-cyan-500 flex items-center justify-center group">
                <Play size={64} className="text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">{video.title}</h3>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {video.creator.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="text-sm text-gray-600">{video.creator}</span>
                </div>

                <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                  <MapPin size={14} />
                  <span className="line-clamp-1">{video.location}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>{video.views} views</span>
                  <span>{video.likes} likes</span>
                </div>

                <div className="flex gap-2 pt-3 border-t border-gray-200">
                  <button className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors">
                    <Heart size={18} />
                  </button>
                  <button className="flex items-center gap-1 text-gray-600 hover:text-primary-600 transition-colors">
                    <MessageCircle size={18} />
                  </button>
                  <button className="flex items-center gap-1 text-gray-600 hover:text-primary-600 transition-colors">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
