export default function Logo({ width = 120, height = 120, className = '' }: { width?: number, height?: number, className?: string }) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ filter: 'drop-shadow(0 0 10px rgba(64, 224, 208, 0.4))' }}
    >
      <defs>
        <linearGradient id="tetaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7FFFD4" />
          <stop offset="50%" stopColor="#40E0D0" />
          <stop offset="100%" stopColor="#00CED1" />
        </linearGradient>
      </defs>
      
      {/* Top Bar */}
      <path 
        d="M 5 20 L 95 20 L 85 30 L 15 30 Z" 
        fill="url(#tetaGradient)" 
      />
      
      {/* Left Vertical */}
      <path 
        d="M 20 35 L 45 35 L 45 90 L 35 75 L 35 50 L 25 50 L 20 40 Z" 
        fill="url(#tetaGradient)" 
      />
      
      {/* Right Vertical */}
      <path 
        d="M 80 35 L 55 35 L 55 90 L 65 75 L 65 50 L 75 50 L 80 40 Z" 
        fill="url(#tetaGradient)" 
      />
    </svg>
  )
}
