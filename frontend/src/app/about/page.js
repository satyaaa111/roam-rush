'use client'

import Navbar from '@/components/Navbar'
import { MapPin, Users, Heart, Globe, Mail, Phone, MapPinned } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gradient-to-r from-primary-600 to-cyan-600 rounded-2xl p-12 text-white text-center mb-8">
          <div className="inline-block bg-white/20 backdrop-blur-sm p-4 rounded-full mb-4">
            <Globe size={64} />
          </div>
          <h1 className="text-5xl font-bold mb-4">About TravelConnect</h1>
          <p className="text-xl text-white/90">Connecting travelers worldwide, one journey at a time</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            TravelConnect was founded in 2024 with a simple mission: to bring travelers together and make 
            every journey more meaningful through shared experiences and connections.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            We believe that travel is not just about visiting places, but about the people you meet, 
            the stories you share, and the memories you create along the way. Our platform enables travelers 
            to connect, share their adventures, and plan their next trips together.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Whether you're a solo backpacker, a family on vacation, or a digital nomad exploring the world, 
            TravelConnect is your home for all things travel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 text-center mb-2">1M+ Travelers</h3>
            <p className="text-gray-600 text-center">Join our global community of passionate explorers</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin size={32} className="text-cyan-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 text-center mb-2">195 Countries</h3>
            <p className="text-gray-600 text-center">Explore destinations across every corner of the globe</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={32} className="text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 text-center mb-2">10M+ Posts</h3>
            <p className="text-gray-600 text-center">Millions of travel stories shared and counting</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPinned size={32} className="text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 text-center mb-2">50K+ Trips</h3>
            <p className="text-gray-600 text-center">Successful trips planned through our platform</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Get in Touch</h2>
          <div className="space-y-4 max-w-md mx-auto">
            <div className="flex items-center gap-4">
              <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center">
                <Mail size={24} className="text-primary-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Email</p>
                <p className="text-gray-600">support@travelconnect.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-cyan-100 w-12 h-12 rounded-full flex items-center justify-center">
                <Phone size={24} className="text-cyan-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Phone</p>
                <p className="text-gray-600">+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center">
                <MapPin size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Address</p>
                <p className="text-gray-600">123 Travel Lane, San Francisco, CA 94102</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
