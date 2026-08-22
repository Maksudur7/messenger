'use client'

import { useState } from 'react'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, Video } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

export function CalendarTab() {
  const { showToast } = useToast()
  const [currentDate] = useState(new Date())

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const dates = Array.from({ length: 31 }, (_, i) => i + 1)

  const events = [
    { id: '1', title: 'Team Sync & Code Review', time: '10:00 AM - 11:00 AM', type: 'call', date: 22 },
    { id: '2', title: 'Client Requirement Alignment', time: '02:30 PM - 03:30 PM', type: 'meeting', date: 22 },
    { id: '3', title: 'Project Demo & Deployment', time: '05:00 PM - 06:00 PM', type: 'launch', date: 23 },
  ]

  return (
    <div className="flex-1 bg-[#6D9EEE]/15 p-5 md:p-8 overflow-y-auto font-['DM_Sans',sans-serif]">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header (#BCD3F7 Card Background) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#BCD3F7]/40 p-6 rounded-2xl border border-[#6D9EEE]/30 shadow-sm">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
              <CalendarIcon size={22} className="text-blue-600" /> Schedule & Calendar
            </h1>
            <p className="text-xs font-bold text-slate-500 mt-0.5">
              Plan meetings, schedule team discussions, and manage your events.
            </p>
          </div>

          <button
            onClick={() => showToast('New event modal opening...')}
            className="px-4 py-2.5 rounded-xl bg-[#6D9EEE] hover:bg-blue-600 text-white font-extrabold text-xs shadow-md shadow-[#6D9EEE]/30 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Plus size={16} />
            <span>Schedule Event</span>
          </button>
        </div>

        {/* Calendar Grid & Events Section (#BCD3F7 Card Background) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Monthly Interactive Grid */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-[#BCD3F7]/40 border border-[#6D9EEE]/30 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#6D9EEE]/20 pb-4">
              <h2 className="text-base font-black text-slate-900">
                August 2026
              </h2>
              <div className="flex items-center gap-1.5">
                <button className="p-2 rounded-xl bg-white hover:bg-blue-50 text-slate-700 transition-colors border border-[#6D9EEE]/30">
                  <ChevronLeft size={15} />
                </button>
                <button className="p-2 rounded-xl bg-white hover:bg-blue-50 text-slate-700 transition-colors border border-[#6D9EEE]/30">
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-black text-slate-500">
              {days.map((day) => (
                <div key={day} className="py-1">{day}</div>
              ))}
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-7 gap-2">
              {dates.map((d) => {
                const isToday = d === 22
                const hasEvent = events.some((e) => e.date === d)

                return (
                  <button
                    key={d}
                    onClick={() => showToast(`Selected August ${d}, 2026`)}
                    className={`p-3 rounded-xl text-xs font-black transition-all relative flex flex-col items-center justify-center ${
                      isToday
                        ? 'bg-[#6D9EEE] text-white shadow-md shadow-[#6D9EEE]/30'
                        : 'bg-white hover:bg-blue-50 text-slate-800 border border-[#6D9EEE]/20'
                    }`}
                  >
                    <span>{d}</span>
                    {hasEvent && (
                      <span className={`w-1.5 h-1.5 rounded-full mt-1 ${isToday ? 'bg-white' : 'bg-blue-600'}`} />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Upcoming Events List */}
          <div className="p-6 rounded-2xl bg-[#BCD3F7]/40 border border-[#6D9EEE]/30 shadow-sm space-y-4">
            <h2 className="text-xs font-black text-slate-900 flex items-center gap-2 uppercase tracking-wider">
              <Clock size={16} className="text-blue-600" /> Upcoming Events Today
            </h2>

            <div className="space-y-3">
              {events.map((ev) => (
                <div key={ev.id} className="p-4 rounded-xl bg-white border border-[#6D9EEE]/30 space-y-2 hover:border-[#6D9EEE]/60 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#BCD3F7]/60 text-blue-800 text-[10px] font-black uppercase tracking-wider">
                      {ev.type}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">{ev.time}</span>
                  </div>
                  <h4 className="text-xs font-black text-slate-900">{ev.title}</h4>
                  <button
                    onClick={() => showToast('Joining video call room...')}
                    className="w-full py-2 rounded-xl bg-[#6D9EEE] hover:bg-blue-600 text-white font-extrabold text-[11px] transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-[#6D9EEE]/30"
                  >
                    <Video size={13} />
                    <span>Join Room</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
