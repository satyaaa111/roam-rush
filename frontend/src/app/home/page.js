'use client'

import Navbar from '@/components/Navbar'
import { Heart, MessageCircle, Share2, MapPin, Calendar } from 'lucide-react'

const travelPosts = [
  {
    id: 1,
    user: 'Sarah Johnson',
    avatar: 'SJ',
    time: '2 hours ago',
    location: 'Santorini, Greece',
    content: 'Absolutely breathtaking sunset at Oia! The blue domes and white buildings create such a magical atmosphere. This is definitely a must-visit destination! 🌅',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800',
    likes: 234,
    comments: 45,
    isLiked: false
  },
  {
    id: 2,
    user: 'Michael Chen',
    avatar: 'MC',
    time: '5 hours ago',
    location: 'Tokyo, Japan',
    content: 'Street food tour in Shibuya! The ramen here is out of this world. Can\'t wait to explore more of Tokyo tomorrow! 🍜',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    likes: 189,
    comments: 32,
    isLiked: true
  },
  {
    id: 3,
    user: 'Emma Williams',
    avatar: 'EW',
    time: '1 day ago',
    location: 'Bali, Indonesia',
    content: 'Morning yoga session overlooking the rice terraces in Ubud. Feeling so peaceful and connected with nature here! 🧘‍♀️',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    likes: 456,
    comments: 67,
    isLiked: false
  },
  {
    id: 4,
    user: 'David Kumar',
    avatar: 'DK',
    time: '2 days ago',
    location: 'Swiss Alps, Switzerland',
    content: 'Hiking the Swiss Alps was challenging but absolutely worth it! The views are unparalleled. Already planning my next mountain adventure! ⛰️',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800',
    likes: 312,
    comments: 54,
    isLiked: true
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
              JD
            </div>
            <input
              type="text"
              placeholder="Share your travel story..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex gap-4 mt-4 pt-4 border-t border-gray-200">
            <button className="flex items-center gap-2 text-gray-600 hover:text-primary-600 flex-1 justify-center py-2 rounded-lg hover:bg-gray-50">
              <MapPin size={20} />
              <span className="font-medium">Location</span>
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:text-primary-600 flex-1 justify-center py-2 rounded-lg hover:bg-gray-50">
              <Calendar size={20} />
              <span className="font-medium">Trip Dates</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {travelPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                    {post.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{post.user}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin size={14} />
                      <span>{post.location}</span>
                      <span>•</span>
                      <span>{post.time}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{post.content}</p>
              </div>

              <div className="relative h-96 bg-gray-200">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <MapPin size={64} />
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
                  <span>{post.likes} likes</span>
                  <span>{post.comments} comments</span>
                </div>

                <div className="flex gap-2 pt-3 border-t border-gray-200">
                  <button className={`flex items-center gap-2 flex-1 justify-center py-2 rounded-lg hover:bg-gray-50 transition-colors ${post.isLiked ? 'text-red-500' : 'text-gray-600'}`}>
                    <Heart size={20} fill={post.isLiked ? 'currentColor' : 'none'} />
                    <span className="font-medium">Like</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-primary-600 flex-1 justify-center py-2 rounded-lg hover:bg-gray-50">
                    <MessageCircle size={20} />
                    <span className="font-medium">Comment</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-primary-600 flex-1 justify-center py-2 rounded-lg hover:bg-gray-50">
                    <Share2 size={20} />
                    <span className="font-medium">Share</span>
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
