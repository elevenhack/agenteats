'use client'

import { useState, useRef, useEffect, useTransition } from 'react'
import { X, Clock, User, DollarSign, Phone, Loader2 } from 'lucide-react'
import { getOrders, updateOrderStatus } from '@/app/actions/orders'

interface Order {
  id: string
  customer: string
  phone: string
  items: string[]
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

// Parse database order to UI order format
function parseDbOrder(dbOrder: { id: string; whoItsFor: string; orders: string; status: string; createdAt: Date }): Order {
  // Parse whoItsFor as "name|phone"
  const [customer, phone] = dbOrder.whoItsFor.split('|')
  
  // Parse orders - could be newline or comma separated
  const items = dbOrder.orders
    .split(/[\n,]/)
    .map(item => item.trim())
    .filter(item => item.length > 0)
  
  // Format time from createdAt
  const time = new Date(dbOrder.createdAt).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })

  return {
    id: dbOrder.id,
    customer: customer?.trim() || 'Unknown',
    phone: phone?.trim() || '',
    items,
    time,
    status: dbOrder.status as Order['status']
  }
}

export default function KanbanBoard({ isOpen, onClose }: KanbanBoardProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  const [draggedOrder, setDraggedOrder] = useState<Order | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)

  const dragCounter = useRef(0)

  // Fetch orders from database
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
      getOrders()
        .then((dbOrders) => {
          const parsedOrders = dbOrders.map(parseDbOrder)
          setOrders(parsedOrders)
        })
        .catch((error) => {
          console.error('Failed to fetch orders:', error)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [isOpen])

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
    const order = orders.find(o => o.id === orderId)
    if (!order) return

    const currentIndex = COLUMNS.findIndex(col => col.id === order.status)
    const nextIndex = Math.min(currentIndex + 1, COLUMNS.length - 1)
    const newStatus = COLUMNS[nextIndex].id as Order['status']

    // Optimistic update
    setOrders(prevOrders => {
      return prevOrders.map(o => {
        if (o.id === orderId) {
          return { ...o, status: newStatus }
        }
        return o
      })
    })

    // Persist to database
    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, newStatus)
      } catch (error) {
        console.error('Failed to update order status:', error)
        // Revert on error
        setOrders(prevOrders => {
          return prevOrders.map(o => {
            if (o.id === orderId) {
              return { ...o, status: order.status }
            }
            return o
          })
        })
      }
    })
  }

  const moveOrderToStatus = (orderId: string, newStatus: Order['status']) => {
    const order = orders.find(o => o.id === orderId)
    if (!order) return

    // Optimistic update
    setOrders(prevOrders => {
      return prevOrders.map(o => {
        if (o.id === orderId) {
          return { ...o, status: newStatus }
        }
        return o
      })
    })

    // Persist to database
    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, newStatus)
      } catch (error) {
        console.error('Failed to update order status:', error)
        // Revert on error
        setOrders(prevOrders => {
          return prevOrders.map(o => {
            if (o.id === orderId) {
              return { ...o, status: order.status }
            }
            return o
          })
        })
      }
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
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Loading orders...</span>
            </div>
          ) : (
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
                          <span className="font-semibold text-gray-900">#{order.id.slice(-4)}</span>
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
                          {order.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{order.phone}</span>
                            </div>
                          )}
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
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Total orders: {orders.length} | 
              Active: {orders.filter(o => o.status !== 'done').length} | 
              Completed: {orders.filter(o => o.status === 'done').length}
              {isPending && <span className="ml-2 text-blue-600">(Saving...)</span>}
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
