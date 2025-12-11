'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Save, X, DollarSign } from 'lucide-react'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  available: boolean
}

interface MenuCategory {
  id: string
  name: string
  items: MenuItem[]
}

export default function MenuPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([
    {
      id: '1',
      name: 'Appetizers',
      items: [
        { id: '1', name: 'Mozzarella Sticks', description: 'Crispy breaded mozzarella with marinara sauce', price: 8.99, category: 'Appetizers', available: true },
        { id: '2', name: 'Buffalo Wings', description: '8 pieces with choice of sauce', price: 12.99, category: 'Appetizers', available: true },
        { id: '3', name: 'Caesar Salad', description: 'Romaine lettuce, croutons, parmesan, caesar dressing', price: 9.99, category: 'Appetizers', available: true },
      ]
    },
    {
      id: '2',
      name: 'Pizza',
      items: [
        { id: '4', name: 'Margherita Pizza', description: 'Fresh tomato sauce, mozzarella, basil', price: 16.99, category: 'Pizza', available: true },
        { id: '5', name: 'Pepperoni Pizza', description: 'Classic pepperoni with mozzarella cheese', price: 18.99, category: 'Pizza', available: true },
        { id: '6', name: 'Supreme Pizza', description: 'Pepperoni, sausage, peppers, onions, mushrooms', price: 22.99, category: 'Pizza', available: true },
      ]
    },
    {
      id: '3',
      name: 'Entrees',
      items: [
        { id: '7', name: 'Chicken Parmesan', description: 'Breaded chicken breast with marinara and mozzarella', price: 19.99, category: 'Entrees', available: true },
        { id: '8', name: 'Spaghetti Carbonara', description: 'Pasta with bacon, eggs, parmesan cream sauce', price: 17.99, category: 'Entrees', available: true },
        { id: '9', name: 'Grilled Salmon', description: 'Atlantic salmon with lemon herb butter', price: 24.99, category: 'Entrees', available: false },
      ]
    },
    {
      id: '4',
      name: 'Desserts',
      items: [
        { id: '10', name: 'Tiramisu', description: 'Classic Italian coffee-flavored dessert', price: 7.99, category: 'Desserts', available: true },
        { id: '11', name: 'Chocolate Cake', description: 'Rich chocolate layer cake with frosting', price: 6.99, category: 'Desserts', available: true },
      ]
    }
  ])

  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({})
  const [newCategoryName, setNewCategoryName] = useState('')
  const [showAddItem, setShowAddItem] = useState<string | null>(null)
  const [showAddCategory, setShowAddCategory] = useState(false)

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item.id)
    setNewItem({ ...item })
  }

  const handleSaveItem = (categoryId: string) => {
    if (!newItem.name || !newItem.price) return

    setCategories(prev => prev.map(category => {
      if (category.id === categoryId) {
        if (editingItem) {
          // Update existing item
          return {
            ...category,
            items: category.items.map(item => 
              item.id === editingItem 
                ? { ...item, ...newItem } as MenuItem
                : item
            )
          }
        } else {
          // Add new item
          const newMenuItem: MenuItem = {
            id: Date.now().toString(),
            name: newItem.name!,
            description: newItem.description || '',
            price: newItem.price!,
            category: category.name,
            available: newItem.available ?? true
          }
          return {
            ...category,
            items: [...category.items, newMenuItem]
          }
        }
      }
      return category
    }))

    setEditingItem(null)
    setNewItem({})
    setShowAddItem(null)
  }

  const handleDeleteItem = (categoryId: string, itemId: string) => {
    setCategories(prev => prev.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: category.items.filter(item => item.id !== itemId)
        }
      }
      return category
    }))
  }

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return

    const newCategory: MenuCategory = {
      id: Date.now().toString(),
      name: newCategoryName,
      items: []
    }

    setCategories(prev => [...prev, newCategory])
    setNewCategoryName('')
    setShowAddCategory(false)
  }

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(category => category.id !== categoryId))
  }

  const toggleItemAvailability = (categoryId: string, itemId: string) => {
    setCategories(prev => prev.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: category.items.map(item => 
            item.id === itemId 
              ? { ...item, available: !item.available }
              : item
          )
        }
      }
      return category
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">AgentEats</h1>
              <span className="ml-2 text-sm text-gray-500">Menu Management</span>
            </div>
            <button
              onClick={() => setShowAddCategory(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Add Category Modal */}
          {showAddCategory && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
                <input
                  type="text"
                  placeholder="Category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowAddCategory(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCategory}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Category
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Menu Categories */}
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAddItem(category.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Item
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Category
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Add Item Form */}
                {showAddItem === category.id && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-3">Add New Item</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Item name"
                        value={newItem.name || ''}
                        onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Price"
                        value={newItem.price || ''}
                        onChange={(e) => setNewItem(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <textarea
                        placeholder="Description"
                        value={newItem.description || ''}
                        onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                        className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={2}
                      />
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={newItem.available ?? true}
                          onChange={(e) => setNewItem(prev => ({ ...prev, available: e.target.checked }))}
                        />
                        Available
                      </label>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleSaveItem(category.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Save Item
                      </button>
                      <button
                        onClick={() => {
                          setShowAddItem(null)
                          setNewItem({})
                        }}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Menu Items */}
                <div className="space-y-4">
                  {category.items.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      {editingItem === item.id ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                              type="text"
                              value={newItem.name || ''}
                              onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="number"
                              step="0.01"
                              value={newItem.price || ''}
                              onChange={(e) => setNewItem(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <textarea
                              value={newItem.description || ''}
                              onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                              className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              rows={2}
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveItem(category.id)}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center gap-1"
                            >
                              <Save className="w-4 h-4" />
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingItem(null)
                                setNewItem({})
                              }}
                              className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 flex items-center gap-1"
                            >
                              <X className="w-4 h-4" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                              <div className="flex items-center gap-1 text-green-600 font-semibold">
                                <DollarSign className="w-4 h-4" />
                                {item.price.toFixed(2)}
                              </div>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                item.available 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {item.available ? 'Available' : 'Unavailable'}
                              </span>
                            </div>
                            <p className="text-gray-600">{item.description}</p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => toggleItemAvailability(category.id, item.id)}
                              className={`px-3 py-1 rounded text-sm ${
                                item.available 
                                  ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                                  : 'bg-green-600 text-white hover:bg-green-700'
                              }`}
                            >
                              {item.available ? 'Mark Unavailable' : 'Mark Available'}
                            </button>
                            <button
                              onClick={() => handleEditItem(item)}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center gap-1"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteItem(category.id, item.id)}
                              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 flex items-center gap-1"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {category.items.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No items in this category yet. Click &quot;Add Item&quot; to get started.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {categories.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No menu categories yet</h3>
              <p className="text-gray-600 mb-4">Create your first category to start building your menu.</p>
              <button
                onClick={() => setShowAddCategory(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Add Your First Category
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
