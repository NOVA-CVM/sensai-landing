"use client"

export function CycleDiagram() {
  const cx = 200, cy = 200, r = 130

  const arrows = [
    { angle: -30, rotation: 60 },
    { angle: 90, rotation: 180 },
    { angle: 210, rotation: 300 },
  ]

  return (
    <div className="relative w-full max-w-[400px] aspect-square mx-auto">
      <svg viewBox="0 0 400 400" className="w-full h-full">
        {/* Main circle path */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="oklch(0.35 0.12 250 / 0.35)"
          strokeWidth="2.5"
          strokeDasharray="8 6"
        />

        {/* Arrows on the circle */}
        {arrows.map((a, i) => {
          const rad = (a.angle * Math.PI) / 180
          const ax = cx + r * Math.cos(rad)
          const ay = cy + r * Math.sin(rad)
          return (
            <g key={i} transform={`translate(${ax}, ${ay}) rotate(${a.rotation})`}>
              <polygon
                points="-8 -7, 8 0, -8 7"
                fill="oklch(0.35 0.12 250 / 0.8)"
              />
            </g>
          )
        })}

        {/* SENSE — top */}
        <circle cx={200} cy={70} r={52} fill="oklch(0.97 0.01 240)" stroke="oklch(0.25 0.10 250)" strokeWidth="2.5" />
        <text x={200} y={66} textAnchor="middle" fill="oklch(0.25 0.10 250)" style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "0.1em" }}>SENSE</text>
        <text x={200} y={83} textAnchor="middle" fill="oklch(0.35 0.02 260)" style={{ fontSize: "10px" }}>Detect patterns</text>

        {/* ACT — bottom right */}
        <circle cx={313} cy={265} r={52} fill="oklch(0.97 0.01 240)" stroke="oklch(0.25 0.10 250)" strokeWidth="2.5" />
        <text x={313} y={261} textAnchor="middle" fill="oklch(0.25 0.10 250)" style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "0.1em" }}>ACT</text>
        <text x={313} y={278} textAnchor="middle" fill="oklch(0.35 0.02 260)" style={{ fontSize: "10px" }}>Full context</text>

        {/* LEARN — bottom left */}
        <circle cx={87} cy={265} r={52} fill="oklch(0.97 0.01 240)" stroke="oklch(0.25 0.10 250)" strokeWidth="2.5" />
        <text x={87} y={261} textAnchor="middle" fill="oklch(0.25 0.10 250)" style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "0.1em" }}>LEARN</text>
        <text x={87} y={278} textAnchor="middle" fill="oklch(0.35 0.02 260)" style={{ fontSize: "10px" }}>Adapt &amp; improve</text>

        {/* Center label */}
        <text x={200} y={195} textAnchor="middle" fill="oklch(0.35 0.02 260)" style={{ fontSize: "11px", fontWeight: 500 }}>continuous</text>
        <text x={200} y={212} textAnchor="middle" fill="oklch(0.35 0.02 260)" style={{ fontSize: "11px", fontWeight: 500 }}>learning loop</text>
      </svg>
    </div>
  )
}
