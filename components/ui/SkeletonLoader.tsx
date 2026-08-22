'use client'

export function SkeletonConversation() {
  return (
    <div className="flex items-center gap-3 px-3 py-3 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-white/10 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-white/10 rounded-full w-3/4" />
        <div className="h-2.5 bg-white/10 rounded-full w-1/2" />
      </div>
      <div className="h-2.5 bg-white/10 rounded w-8" />
    </div>
  )
}

export function SkeletonMessage({ isMine = false }: { isMine?: boolean }) {
  return (
    <div className={`flex gap-2 animate-pulse ${isMine ? 'flex-row-reverse' : ''}`}>
      {!isMine && <div className="w-7 h-7 rounded-full bg-white/10 flex-shrink-0 mt-1" />}
      <div className={`space-y-1 max-w-xs ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`h-10 bg-white/10 rounded-2xl ${
            isMine ? 'w-40 rounded-tr-sm' : 'w-52 rounded-tl-sm'
          }`}
        />
        <div className="h-2 bg-white/10 rounded w-14" />
      </div>
    </div>
  )
}

export function SkeletonMessageList() {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <SkeletonMessage isMine={false} />
      <SkeletonMessage isMine={true} />
      <SkeletonMessage isMine={false} />
      <SkeletonMessage isMine={true} />
      <SkeletonMessage isMine={false} />
      <SkeletonMessage isMine={true} />
    </div>
  )
}
