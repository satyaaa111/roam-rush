'use client'

import Navbar from '@/components/Navbar'
import { Calendar, MapPin, Sparkles } from 'lucide-react'

const journeyTypes = [
  {
    id: 1,
    title: 'Week Plan',
    duration: '7 Days',
    description: 'Perfect for a quick getaway or exploring a single destination',
    color: 'from-blue-400 to-blue-600',
    icon: '🌴',
    popular: true
  },
  {
    id: 2,
    title: 'More Than a Week',
    duration: '8-14 Days',
    description: 'Ideal for multi-city adventures and deeper exploration',
    color: 'from-purple-400 to-purple-600',
    icon: '✈️',
    popular: false
  },
  {
    id: 3,
    title: 'More Than a Month',
    duration: '30+ Days',
    description: 'Extended travel for immersive cultural experiences',
    color: 'from-orange-400 to-orange-600',
    icon: '🌍',
    popular: false
  }
]

export default function PlanPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-12">
          <div className="inline-block bg-primary-100 text-primary-700 px-4 py-2 rounded-full font-semibold mb-4">
            <Sparkles className="inline mr-2" size={20} />
            Trip Planning
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            How Long Do You Want to Travel?
          </h1>
          <p className="text-xl text-gray-600">
            Choose your trip duration and we'll help create the perfect itinerary
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {journeyTypes.map((journey) => (
            <div
              key={journey.id}
              className="relative group cursor-pointer"
            >
              {journey.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-800 px-4 py-1 rounded-full text-sm font-bold z-10">
                  Most Popular
                </div>
              )}
              <div className={`bg-gradient-to-br ${journey.color} rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 h-full flex flex-col`}>
                <div className="text-6xl mb-4 text-center">{journey.icon}</div>
                <h3 className="text-2xl font-bold mb-2 text-center">{journey.title}</h3>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Calendar size={20} />
                  <span className="text-lg font-semibold">{journey.duration}</span>
                </div>
                <p className="text-white/90 text-center mb-6 flex-1">{journey.description}</p>
                <button className="w-full bg-white text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-100 transition-colors">
                  Select Plan
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">What's Included in Your Trip Plan?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="text-primary-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Destination Recommendations</h3>
                <p className="text-gray-600">Curated locations based on your interests and travel style</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-cyan-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="text-cyan-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Day-by-Day Itinerary</h3>
                <p className="text-gray-600">Detailed schedule with activities and attractions</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🏨</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Accommodation Suggestions</h3>
                <p className="text-gray-600">Hotels and stays that match your budget</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Budget Planning</h3>
                <p className="text-gray-600">Cost estimates and money-saving tips</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
