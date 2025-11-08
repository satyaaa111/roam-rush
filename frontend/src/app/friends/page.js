'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { Search, MapPin, UserPlus, MessageCircle } from 'lucide-react'

const friendsList = [
  { id: 1, name: 'Sarah Johnson', location: 'New York, USA', avatar: 'SJ', mutualFriends: 12, recentTrip: 'Greece' },
  { id: 2, name: 'Michael Chen', location: 'Tokyo, Japan', avatar: 'MC', mutualFriends: 8, recentTrip: 'Thailand' },
  { id: 3, name: 'Emma Williams', location: 'London, UK', avatar: 'EW', mutualFriends: 15, recentTrip: 'Bali' },
  { id: 4, name: 'David Kumar', location: 'Mumbai, India', avatar: 'DK', mutualFriends: 6, recentTrip: 'Switzerland' },
  { id: 5, name: 'Sophie Martin', location: 'Paris, France', avatar: 'SM', mutualFriends: 10, recentTrip: 'Morocco' },
  { id: 6, name: 'James Wilson', location: 'Sydney, Australia', avatar: 'JW', mutualFriends: 9, recentTrip: 'New Zealand' },
  { id: 7, name: 'Lisa Anderson', location: 'Toronto, Canada', avatar: 'LA', mutualFriends: 14, recentTrip: 'Iceland' },
  { id: 8, name: 'Carlos Rodriguez', location: 'Barcelona, Spain', avatar: 'CR', mutualFriends: 7, recentTrip: 'Portugal' },
]

const suggestions = [
  { id: 1, name: 'Alex Thompson', location: 'Berlin, Germany', avatar: 'AT', mutualFriends: 5 },
  { id: 2, name: 'Maria Garcia', location: 'Mexico City', avatar: 'MG', mutualFriends: 3 },
  { id: 3, name: 'Ryan Lee', location: 'Seoul, South Korea', avatar: 'RL', mutualFriends: 8 },
]

export default function FriendsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Friends</h1>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search friends..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Friend Suggestions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suggestions.map((person) => (
              <div key={person.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {person.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{person.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin size={12} />
                      {person.location}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{person.mutualFriends} mutual friends</p>
                <button className="w-full btn-primary text-sm flex items-center justify-center gap-2">
                  <UserPlus size={16} />
                  Add Friend
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">All Friends ({friendsList.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {friendsList.map((friend) => (
              <div key={friend.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {friend.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-lg">{friend.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin size={14} />
                    {friend.location}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Recently traveled to {friend.recentTrip}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
                    <MessageCircle size={16} />
                    Message
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
