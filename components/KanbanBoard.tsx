'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Clock, User, DollarSign, Phone } from 'lucide-react'

interface Order {
  id: string
  customer: string
  phone: string
  items: string[]
  total: string
  time: string
  status: 'new' | 'in_progress' | 'waiting_customer' | 'done'
}

interface KanbanBoardProps {
  isOpen: boolean
  onClose: () => void
}

const COLUMNS = [
  { id: 'new', title: 'New', color: 'bg-blue-50 border-blue-200' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-yellow-50 border-yellow-200' },
  { id: 'waiting_customer', title: 'Waiting for Customer', color: 'bg-orange-50 border-orange-200' },
  { id: 'done', title: 'Done', color: 'bg-green-50 border-green-200' }
]

export default function KanbanBoard({ isOpen, onClose }: KanbanBoardProps) {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1247',
      customer: 'John Smith',
      phone: '+1 (555) 123-4567',
      items: ['2x Margherita Pizza', '1x Caesar Salad'],
      total: '$32.50',
      time: '2:15 PM',
      status: 'new'
    },
    {
      id: '1246',
      customer: 'Sarah Johnson',
      phone: '+1 (555) 987-6543',
      items: ['1x Chicken Burger', '1x Fries'],
      total: '$18.75',
      time: '2:08 PM',
      status: 'in_progress'
    },
    {
      id: '1245',
      customer: 'Mike Wilson',
      phone: '+1 (555) 456-7890',
      items: ['3x Tacos', '1x Guacamole'],
      total: '$24.00',
      time: '1:45 PM',
      status: 'waiting_customer'
    },
    {
      id: '1244',
      customer: 'Lisa Brown',
      phone: '+1 (555) 321-9876',
      items: ['1x Pepperoni Pizza', '2x Garlic Bread'],
      total: '$28.99',
      time: '1:30 PM',
      status: 'done'
    },
    {
      id: '1243',
      customer: 'David Lee',
      phone: '+1 (555) 654-3210',
      items: ['1x Chicken Parmesan', '1x Side Salad'],
      total: '$22.50',
      time: '1:15 PM',
      status: 'new'
    }
  ])

  const [draggedOrder, setDraggedOrder] = useState<Order | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)

  const dragCounter = useRef(0)

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const getOrdersByStatus = (status: string) => {
    return orders.filter(order => order.status === status)
  }

  const moveOrderToNextStatus = (orderId: string) => {
    setOrders(prevOrders => {
      return prevOrders.map(order => {
        if (order.id === orderId) {
          const currentIndex = COLUMNS.findIndex(col => col.id === order.status)
          const nextIndex = Math.min(currentIndex + 1, COLUMNS.length - 1)
          return { ...order, status: COLUMNS[nextIndex].id as Order['status'] }
        }
        return order
      })
    })
  }

  const moveOrderToStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prevOrders => {
      return prevOrders.map(order => {
        if (order.id === orderId) {
          return { ...order, status: newStatus }
        }
        return order
      })
    })
  }

  const handleDragStart = (e: React.DragEvent, order: Order) => {
    setDraggedOrder(order)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnd = () => {
    setDraggedOrder(null)
    setDragOverColumn(null)
    dragCounter.current = 0
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnter = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    dragCounter.current++
    setDragOverColumn(columnId)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    dragCounter.current--
    if (dragCounter.current === 0) {
      setDragOverColumn(null)
    }
  }

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    dragCounter.current = 0
    setDragOverColumn(null)
    
    if (draggedOrder) {
      moveOrderToStatus(draggedOrder.id, columnId as Order['status'])
    }
    
    // Clear the dragged order state to remove transparency
    setDraggedOrder(null)
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg w-full h-full max-h-[100vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order Management Board</h2>
            <p className="text-gray-600">Drag orders between columns or click to advance to next step</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-4 h-full">
            {COLUMNS.map((column) => (
              <div
                key={column.id}
                className={`flex flex-col r border-r-2 last:border-r-0 ${column.color} ${
                  dragOverColumn === column.id ? 'border-blue-400 bg-blue-100' : ''
                } transition-colors`}
                onDragOver={handleDragOver}
                onDragEnter={(e) => handleDragEnter(e, column.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {/* Column Header */}
                <div className="p-4 border-b border-gray-200 bg-white rounded-t-lg flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900">{column.title}</h3>
                  <span className="text-md text-gray-500 border px-2 py-1 font-bold rounded-full">
                    {getOrdersByStatus(column.id).length} orders
                  </span>
                </div>

                {/* Column Content */}
                <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                  {getOrdersByStatus(column.id).map((order) => (
                    <div
                      key={order.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, order)}
                      onDragEnd={handleDragEnd}
                      onClick={() => moveOrderToNextStatus(order.id)}
                      className={`bg-white  rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all ${
                        draggedOrder?.id === order.id ? 'opacity-50 rotate-2' : ''
                      }`}
                    >
                      {/* Order Header */}
                      <div className="flex items-center justify-between border-b p-4">
                        <span className="font-semibold text-gray-900">#{order.id}</span>
                        <span className="text-sm text-gray-500">{order.time}</span>
                      </div>        {/* Order Items */}
                      <div className="mb-3">
                        <div className="text-xl text-gray-600 space-y-2 p-4">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center gap-1">
                              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                        
                      </div>


                      {/* Customer Info */}
                      <div className="p-4 border-t flex justify-between">
                        <div>
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{order.customer}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{order.phone}</span>
                        </div>
                      </div>
                    <div className="flex items-center gap-1 text-green-600 font-semibold ">
                          <DollarSign className="w-4 h-4" />
                          <span>{order.total.replace('$', '')}</span>
                        </div>
    </div>  
              
                    
                    </div>
                  ))}

                  {getOrdersByStatus(column.id).length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Clock className="w-6 h-6" />
                      </div>
                      <p className="text-sm">No orders in this stage</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Total orders: {orders.length} | 
              Active: {orders.filter(o => o.status !== 'done').length} | 
              Completed: {orders.filter(o => o.status === 'done').length}
            </div>
            <div className="text-sm text-gray-500">
              💡 Tip: Drag orders between columns or click cards to advance them
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
