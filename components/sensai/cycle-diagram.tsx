"use client"

export function CycleDiagram() {
  // Circle center (200,200), radius 130
  // Nodes equally spaced at -90°, 30°, 150° (top, bottom-right, bottom-left)
  const cx = 200, cy = 200, r = 130
  const nodeR = 48

  // Arrow positions — midpoints between nodes on the circle
  // Between SENSE(-90°) and ACT(30°): midpoint at -30°
  // Between ACT(30°) and LEARN(150°): midpoint at 90°
  // Between LEARN(150°) and SENSE(270°): midpoint at 210°
  const arrows = [
    { angle: -30, rotation: 60 },   // SENSE → ACT
    { angle: 90, rotation: 180 },   // ACT → LEARN
    { angle: 210, rotation: 300 },  // LEARN → SENSE
  ]

  return (
    <div className="relative w-full max-w-[400px] aspect-square mx-auto">
      <svg viewBox="0 0 400 400" className="w-full h-full">
        {/* Main circle path — dashed */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="oklch(0.35 0.12 250 / 0.2)"
          strokeWidth="1.5"
          strokeDasharray="6 5"
        />

        {/* Arrows on the circle between nodes */}
        {arrows.map((a, i) => {
          const rad = (a.angle * Math.PI) / 180
          const ax = cx + r * Math.cos(rad)
          const ay = cy + r * Math.sin(rad)
          return (
            <g key={i} transform={`translate(${ax}, ${ay}) rotate(${a.rotation})`}>
              <polygon
                points="-6 -5, 6 0, -6 5"
                fill="oklch(0.35 0.12 250 / 0.6)"
              />
            </g>
          )
        })}

        {/* SENSE — top */}
        <circle cx={200} cy={70} r={nodeR} fill="oklch(0.97 0.01 240)" stroke="oklch(0.35 0.12 250)" strokeWidth="1.5" />
        <text x={200} y={66} textAnchor="middle" fill="oklch(0.35 0.12 250)" style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em" }}>SENSE</text>
        <text x={200} y={81} textAnchor="middle" fill="oklch(0.4 0.01 260)" style={{ fontSize: "8px" }}>Detect patterns</text>

        {/* ACT — bottom right */}
        <circle cx={313} cy={265} r={nodeR} fill="oklch(0.97 0.01 240)" stroke="oklch(0.35 0.12 250)" strokeWidth="1.5" />
        <text x={313} y={261} textAnchor="middle" fill="oklch(0.35 0.12 250)" style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em" }}>ACT</text>
        <text x={313} y={276} textAnchor="middle" fill="oklch(0.4 0.01 260)" style={{ fontSize: "8px" }}>Full context</text>

        {/* LEARN — bottom left */}
        <circle cx={87} cy={265} r={nodeR} fill="oklch(0.97 0.01 240)" stroke="oklch(0.35 0.12 250)" strokeWidth="1.5" />
        <text x={87} y={261} textAnchor="middle" fill="oklch(0.35 0.12 250)" style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em" }}>LEARN</text>
        <text x={87} y={276} textAnchor="middle" fill="oklch(0.4 0.01 260)" style={{ fontSize: "8px" }}>Adapt &amp; improve</text>

        {/* Center label */}
        <text x={200} y={198} textAnchor="middle" fill="oklch(0.5 0.01 260)" style={{ fontSize: "9px", fontStyle: "italic" }}>continuous</text>
        <text x={200} y={212} textAnchor="middle" fill="oklch(0.5 0.01 260)" style={{ fontSize: "9px", fontStyle: "italic" }}>learning loop</text>
      </svg>
    </div>
  )
}
