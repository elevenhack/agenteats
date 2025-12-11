'use client'

import { useState, useEffect, useTransition } from 'react'
import { Eye, Package, Settings, Phone, Activity, DollarSign, Clock, Menu, Loader2 } from 'lucide-react'
import Link from 'next/link'
import KanbanBoardWrapper from './KanbanBoardWrapper'
import { getOrders, updateOrderStatus } from '@/app/actions/orders'

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
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    getOrders()
      .then((dbOrders) => {
        setOrders(dbOrders)
      })
      .catch((error) => {
        console.error('Failed to fetch orders:', error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  // Get orders from today
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayOrders = orders.filter(order => new Date(order.createdAt) >= today)
  
  // Get 5 most recent orders
  const recentOrders = orders.slice(0, 5)

  const parseOrder = (order: Order) => {
    const [customer] = order.whoItsFor.split('|')
    const items = order.orders
      .split(/[\n,]/)
      .map(item => item.trim())
      .filter(item => item.length > 0)
      .join(', ')
    
    // Calculate time ago
    const now = new Date()
    const orderTime = new Date(order.createdAt)
    const diffMs = now.getTime() - orderTime.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    let timeAgo = ''
    if (diffMins < 1) timeAgo = 'Just now'
    else if (diffMins < 60) timeAgo = `${diffMins} min ago`
    else if (diffMins < 1440) timeAgo = `${Math.floor(diffMins / 60)} hr ago`
    else timeAgo = `${Math.floor(diffMins / 1440)} days ago`

    return {
      customer: customer?.trim() || 'Unknown',
      items,
      timeAgo
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'waiting_customer': return 'bg-orange-100 text-orange-800'
      case 'done': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'New'
      case 'in_progress': return 'In Progress'
      case 'waiting_customer': return 'Waiting'
      case 'done': return 'Done'
      default: return status
    }
  }

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
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? '...' : orders.length}
              </p>
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
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? '...' : todayOrders.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? '...' : orders.filter(o => o.status === 'in_progress').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">New Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? '...' : orders.filter(o => o.status === 'new').length}
              </p>
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
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Loading orders...</span>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <Package className="w-10 h-10 mb-3 text-gray-300" />
              <p className="font-medium">No orders yet</p>
              <p className="text-sm">Orders will appear here when customers place them.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => {
                const parsed = parseOrder(order)
                return (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-900">#{order.id.slice(-6)}</span>
                        <span className="text-gray-600">{parsed.customer}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{parsed.items}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{parsed.timeAgo}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


interface Order {
  id: string
  orgId: string
  whoItsFor: string
  orders: string
  status: string
  createdAt: Date
}

type FilterStatus = 'all' | 'new' | 'in_progress' | 'waiting_customer' | 'done'

function OrdersView() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setIsLoading(true)
    getOrders()
      .then((dbOrders) => {
        setOrders(dbOrders)
      })
      .catch((error) => {
        console.error('Failed to fetch orders:', error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    // Optimistic update
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    )

    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, newStatus)
      } catch (error) {
        console.error('Failed to update status:', error)
        // Reload orders on error
        getOrders().then(setOrders)
      }
    })
  }

  const getNextStatus = (currentStatus: string): string => {
    const statusFlow = ['new', 'in_progress', 'waiting_customer', 'done']
    const currentIndex = statusFlow.indexOf(currentStatus)
    return currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1] : currentStatus
  }

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter)

  const parseOrder = (order: Order) => {
    // Parse whoItsFor as "name|phone"
    const [customer, phone] = order.whoItsFor.split('|')
    
    // Parse orders - could be newline or comma separated
    const items = order.orders
      .split(/[\n,]/)
      .map(item => item.trim())
      .filter(item => item.length > 0)
    
    // Format time from createdAt
    const time = new Date(order.createdAt).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })

    const date = new Date(order.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })

    return {
      customer: customer?.trim() || 'Unknown',
      phone: phone?.trim() || '',
      items,
      time,
      date
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'waiting_customer': return 'bg-orange-100 text-orange-800'
      case 'done': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'New'
      case 'in_progress': return 'In Progress'
      case 'waiting_customer': return 'Waiting'
      case 'done': return 'Done'
      default: return status
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Orders</h2>
        <p className="text-gray-600">Manage and track all your orders.</p>
      </div>

      {/* Order Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex gap-4">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button 
            onClick={() => setFilter('new')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'new' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            New ({orders.filter(o => o.status === 'new').length})
          </button>
          <button 
            onClick={() => setFilter('in_progress')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'in_progress' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            In Progress ({orders.filter(o => o.status === 'in_progress').length})
          </button>
          <button 
            onClick={() => setFilter('waiting_customer')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'waiting_customer' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Waiting ({orders.filter(o => o.status === 'waiting_customer').length})
          </button>
          <button 
            onClick={() => setFilter('done')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'done' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Done ({orders.filter(o => o.status === 'done').length})
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {filter === 'all' ? 'All Orders' : `${getStatusLabel(filter)} Orders`}
          </h3>
          {isPending && (
            <span className="text-sm text-blue-600 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </span>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Loading orders...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <Package className="w-12 h-12 mb-4 text-gray-300" />
            <p className="text-lg font-medium">No orders found</p>
            <p className="text-sm">
              {filter === 'all' 
                ? 'Orders will appear here when customers place them.' 
                : `No orders with status "${getStatusLabel(filter)}".`}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredOrders.map((order) => {
              const parsed = parseOrder(order)
              return (
                <div key={order.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-gray-900">#{order.id.slice(-6)}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      <p className="text-gray-900 font-medium">{parsed.customer}</p>
                      {parsed.phone && (
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Phone className="w-3 h-3" />
                          {parsed.phone}
                        </p>
                      )}
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-900 mb-1">Items:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {parsed.items.map((item, index) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{parsed.date}</p>
                      <p className="text-sm text-gray-500">{parsed.time}</p>
                      {order.status !== 'done' && (
                        <button 
                          onClick={() => handleStatusUpdate(order.id, getNextStatus(order.status))}
                          disabled={isPending}
                          className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                          {order.status === 'new' && 'Start Order'}
                          {order.status === 'in_progress' && 'Mark Waiting'}
                          {order.status === 'waiting_customer' && 'Complete'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
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
