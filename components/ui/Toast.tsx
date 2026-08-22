'use client'

import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { CheckCircle, XCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error'
}

interface ToastContextValue {
  showToast: (message: string, type?: Toast['type']) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timeoutRefs = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    clearTimeout(timeoutRefs.current[id])
    delete timeoutRefs.current[id]
  }, [])

  const showToast = useCallback(
    (message: string, type: Toast['type'] = 'error') => {
      const id = `toast_${Date.now()}`
      setToasts((prev) => [...prev, { id, message, type }])
      timeoutRefs.current[id] = setTimeout(() => removeToast(id), 4000)
    },
    [removeToast]
  )

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className={cn(
                'pointer-events-auto flex items-center gap-3 rounded-xl px-4 py-3 shadow-xl text-sm font-medium',
                'border backdrop-blur-md max-w-xs',
                toast.type === 'success'
                  ? 'bg-green-900/80 border-green-500/30 text-green-100'
                  : 'bg-red-900/80 border-red-500/30 text-red-100'
              )}
            >
              {toast.type === 'success' ? (
                <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
              ) : (
                <XCircle size={16} className="text-red-400 flex-shrink-0" />
              )}
              <span className="flex-1">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="opacity-60 hover:opacity-100 transition-opacity"
                aria-label="Dismiss notification"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>')
  return ctx
}
