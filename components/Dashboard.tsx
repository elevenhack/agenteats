'use client'

import { useState } from 'react'
import { Eye, Package, Settings, Phone, Activity, DollarSign, Clock, Menu } from 'lucide-react'
import Link from 'next/link'
import KanbanBoardWrapper from './KanbanBoardWrapper'

type DashboardView = 'overview' | 'live' | 'orders' | 'settings'

export default function Dashboard() {
  const [activeView, setActiveView] = useState<DashboardView>('overview')
  const [showKanban, setShowKanban] = useState(false)

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'live', label: 'Live View', icon: Eye },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return <OverviewView />
      case 'live':
        // Open kanban immediately and switch back to overview
        if (!showKanban) {
          setShowKanban(true)
          setActiveView('overview')
        }
        return <OverviewView />
      case 'orders':
        return <OrdersView />
      case 'settings':
        return <SettingsView />
      default:
        return <OverviewView />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
 

      <div className=" grid grid-cols-[320px_1fr] gap-4">
    
          {/* Sidebar Navigation */}
          <nav className=" bg-white h-[calc(100vh-64px)] border-r p-6  sticky top-[64px]">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id as DashboardView)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeView === item.id
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                )
              })}
              
              {/* Menu Management Link */}
              <Link href="/menu">
                <div className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-50 cursor-pointer">
                  <Menu className="w-5 h-5" />
                  Menu Management
                </div>
              </Link>
            </div>
          </nav>

          {/* Main Content */}
          <div className="flex-1 mt-12 mx-auto max-w-6xl w-full">
            {renderContent()}
   
        </div>
      </div>

      {/* Kanban Board Overlay */}
      <KanbanBoardWrapper 
        isOpen={showKanban} 
        onClose={() => setShowKanban(false)} 
      />
    </div>
  )
}

function OverviewView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
        <p className="text-gray-600">Here&apos;s what&apos;s happening with your restaurant today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Calls Today</p>
              <p className="text-2xl font-bold text-gray-900">47</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Orders Today</p>
              <p className="text-2xl font-bold text-gray-900">42</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenue Today</p>
              <p className="text-2xl font-bold text-gray-900">$1,247</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Call Time</p>
              <p className="text-2xl font-bold text-gray-900">2:34</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { id: '#1247', customer: 'John Smith', items: '2x Margherita Pizza, 1x Caesar Salad', total: '$32.50', time: '2 min ago', status: 'confirmed' },
              { id: '#1246', customer: 'Sarah Johnson', items: '1x Chicken Burger, 1x Fries', total: '$18.75', time: '8 min ago', status: 'preparing' },
              { id: '#1245', customer: 'Mike Wilson', items: '3x Tacos, 1x Guacamole', total: '$24.00', time: '15 min ago', status: 'ready' },
            ].map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900">{order.id}</span>
                    <span className="text-gray-600">{order.customer}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{order.items}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{order.total}</p>
                  <p className="text-sm text-gray-500">{order.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


function OrdersView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Orders</h2>
        <p className="text-gray-600">Manage and track all your orders.</p>
      </div>

      {/* Order Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg font-medium">All Orders</button>
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Pending</button>
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Confirmed</button>
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Ready</button>
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Completed</button>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Today&apos;s Orders</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {[
            { id: '#1247', customer: 'John Smith', phone: '+1 (555) 123-4567', items: ['2x Margherita Pizza ($24.00)', '1x Caesar Salad ($8.50)'], total: '$32.50', time: '2:15 PM', status: 'confirmed' },
            { id: '#1246', customer: 'Sarah Johnson', phone: '+1 (555) 987-6543', items: ['1x Chicken Burger ($14.75)', '1x Fries ($4.00)'], total: '$18.75', time: '2:08 PM', status: 'preparing' },
            { id: '#1245', customer: 'Mike Wilson', phone: '+1 (555) 456-7890', items: ['3x Tacos ($18.00)', '1x Guacamole ($6.00)'], total: '$24.00', time: '1:45 PM', status: 'ready' },
          ].map((order) => (
            <div key={order.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-gray-900">{order.id}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-gray-900 font-medium">{order.customer}</p>
                  <p className="text-sm text-gray-600">{order.phone}</p>
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-900 mb-1">Items:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {order.items.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-900">{order.total}</p>
                  <p className="text-sm text-gray-500">{order.time}</p>
                  <button className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                    Update Status
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

function SettingsView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-600">Configure your AgentEats AI phone agent.</p>
      </div>

      {/* Restaurant Information */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Restaurant Information</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Name</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue="Mario&apos;s Pizza" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue="+1 (555) 123-PIZZA" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue="123 Main St, Anytown, ST 12345" />
          </div>
        </div>
      </div>

      {/* AI Agent Settings */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">AI Agent Settings</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Agent Voice</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Professional Female</option>
              <option>Professional Male</option>
              <option>Friendly Female</option>
              <option>Friendly Male</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Greeting Message</label>
            <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} defaultValue="Thank you for calling Mario's Pizza! How can I help you today?" />
          </div>
          <div>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" defaultChecked />
              <span className="text-sm text-gray-700">Enable order confirmations via SMS</span>
            </label>
          </div>
        </div>
      </div>

      {/* Menu Management */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Menu Management</h3>
        </div>
        <div className="p-6">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Upload Menu
          </button>
          <p className="text-sm text-gray-600 mt-2">Upload your current menu so the AI can take accurate orders.</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Save Changes
        </button>
      </div>
    </div>
  )
}
