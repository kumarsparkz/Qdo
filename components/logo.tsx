'use client'

export default function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <div className={`${className} rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 p-1.5 flex items-center justify-center`}>
      <div className="grid grid-cols-2 gap-0.5 w-full h-full">
        <div className="bg-white rounded-sm"></div>
        <div className="bg-white/70 rounded-sm"></div>
        <div className="bg-white/70 rounded-sm"></div>
        <div className="bg-white rounded-sm"></div>
      </div>
    </div>
  )
}
