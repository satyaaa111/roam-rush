'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { Search, Send, Smile, Paperclip, MoreVertical } from 'lucide-react'

const conversations = [
  { id: 1, name: 'Sarah Johnson', avatar: 'SJ', lastMessage: 'The photos from Greece are amazing!', time: '2m ago', unread: 2, online: true },
  { id: 2, name: 'Michael Chen', avatar: 'MC', lastMessage: 'When are you planning to visit Tokyo?', time: '1h ago', unread: 0, online: true },
  { id: 3, name: 'Emma Williams', avatar: 'EW', lastMessage: 'Thanks for the Bali recommendations!', time: '3h ago', unread: 1, online: false },
  { id: 4, name: 'David Kumar', avatar: 'DK', lastMessage: 'The hiking trail was incredible', time: '1d ago', unread: 0, online: false },
  { id: 5, name: 'Sophie Martin', avatar: 'SM', lastMessage: 'Let\'s plan a trip together!', time: '2d ago', unread: 0, online: true },
]

const messages = [
  { id: 1, sender: 'other', text: 'Hey! How was your trip to Santorini?', time: '10:30 AM' },
  { id: 2, sender: 'me', text: 'It was absolutely incredible! The sunset views were breathtaking.', time: '10:32 AM' },
  { id: 3, sender: 'other', text: 'The photos from Greece are amazing!', time: '10:33 AM' },
  { id: 4, sender: 'other', text: 'Which places did you visit?', time: '10:33 AM' },
  { id: 5, sender: 'me', text: 'I spent most time in Oia and Fira. Also visited some beautiful beaches!', time: '10:35 AM' },
  { id: 6, sender: 'me', text: 'You should definitely go there!', time: '10:35 AM' },
]

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(conversations[0])
  const [message, setMessage] = useState('')

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ height: 'calc(100vh - 150px)' }}>
          <div className="flex h-full">
            <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Messages</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedChat(conv)}
                    className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedChat.id === conv.id ? 'bg-primary-50' : ''
                    }`}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                        {conv.avatar}
                      </div>
                      {conv.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-800">{conv.name}</h3>
                        <span className="text-xs text-gray-500">{conv.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                    </div>
                    {conv.unread > 0 && (
                      <div className="w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                        {conv.unread}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden md:flex md:w-2/3 flex-col">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                      {selectedChat.avatar}
                    </div>
                    {selectedChat.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{selectedChat.name}</h3>
                    <p className="text-sm text-gray-500">{selectedChat.online ? 'Online' : 'Offline'}</p>
                  </div>
                </div>
                <button className="text-gray-600 hover:text-gray-800">
                  <MoreVertical size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs md:max-w-md ${msg.sender === 'me' ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          msg.sender === 'me'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        <p>{msg.text}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 px-2">{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <button className="text-gray-600 hover:text-gray-800">
                    <Paperclip size={20} />
                  </button>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button className="text-gray-600 hover:text-gray-800">
                    <Smile size={20} />
                  </button>
                  <button className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors">
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
