'use client'

import dynamic from 'next/dynamic'

const KanbanBoard = dynamic(() => import('./KanbanBoard'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading order board...</p>
      </div>
    </div>
  )
})

interface KanbanBoardWrapperProps {
  isOpen: boolean
  onClose: () => void
}

export default function KanbanBoardWrapper({ isOpen, onClose }: KanbanBoardWrapperProps) {
  if (!isOpen) return null
  
  return <KanbanBoard isOpen={isOpen} onClose={onClose} />
}
