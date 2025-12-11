'use client'

import { useState, useEffect, useTransition } from 'react'
import { Save, Loader2, FileText, Edit3, Eye } from 'lucide-react'
import { getOrganizationSettings, updateMenu } from '@/app/actions/settings'

export default function MenuPage() {
  const [menu, setMenu] = useState('')
  const [originalMenu, setOriginalMenu] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle')

  useEffect(() => {
    async function loadMenu() {
      try {
        const settings = await getOrganizationSettings()
        if (settings?.menu) {
          setMenu(settings.menu)
          setOriginalMenu(settings.menu)
        }
      } catch (error) {
        console.error('Failed to load menu:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadMenu()
  }, [])

  const handleSave = () => {
    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append('menu', menu)
        await updateMenu(formData)
        setOriginalMenu(menu)
        setSaveStatus('saved')
        setIsEditing(false)
        setTimeout(() => setSaveStatus('idle'), 3000)
      } catch (error) {
        console.error('Failed to save menu:', error)
        setSaveStatus('error')
        setTimeout(() => setSaveStatus('idle'), 3000)
      }
    })
  }

  const hasChanges = menu !== originalMenu

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading menu...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Menu</h1>
                <p className="text-sm text-gray-500">Manage your restaurant menu</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {saveStatus === 'saved' && (
                <span className="text-sm text-green-600 font-medium">
                  ✓ Saved
                </span>
              )}
              {saveStatus === 'error' && (
                <span className="text-sm text-red-600 font-medium">
                  Failed to save
                </span>
              )}
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Menu
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setMenu(originalMenu)
                      setIsEditing(false)
                    }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isPending || !hasChanges}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                  >
                    {isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Tab-like header */}
          <div className="bg-gray-50 border-b px-6 py-3 flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {isEditing ? (
                <>
                  <Edit3 className="w-4 h-4" />
                  <span>Editing</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </>
              )}
            </div>
            <span className="text-gray-300">•</span>
            <span className="text-sm text-gray-500">Markdown format</span>
          </div>

          {/* Content */}
          <div className="p-6">
            {isEditing ? (
              <textarea
                value={menu}
                onChange={(e) => setMenu(e.target.value)}
                rows={20}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent font-mono text-sm transition-shadow resize-none"
                placeholder={`Enter your menu in markdown format...

Example:
# Pizza
- Margherita - $12
- Pepperoni - $14
- Hawaiian - $14

# Sides
- Garlic Bread - $5
- Caesar Salad - $8

# Drinks
- Soda - $2
- Water - $1`}
                autoFocus
              />
            ) : menu ? (
              <div className="bg-gray-50 rounded-lg p-6 font-mono text-sm whitespace-pre-wrap text-gray-800 min-h-[400px]">
                {menu}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="font-medium mb-2">No menu added yet</p>
                <p className="text-sm">Click &quot;Edit Menu&quot; to add your menu in markdown format.</p>
              </div>
            )}

            {isEditing && (
              <p className="text-xs text-gray-500 mt-3">
                Use markdown format: # for categories, - for items with prices
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
