import { useState } from 'react'

/* ── palette ── */
const C = {
  bg:        '#0D0D0F',
  card:      '#1C1C1E',
  cardAlt:   '#252527',
  border:    'rgba(255,255,255,0.07)',
  green:     '#30D158',
  greenDim:  'rgba(48,209,88,0.15)',
  greenGlow: 'rgba(48,209,88,0.28)',
  orange:    '#FF9F0A',
  orangeDim: 'rgba(255,159,10,0.15)',
  red:       '#FF453A',
  redDim:    'rgba(255,69,58,0.15)',
  blue:      '#0A84FF',
  blueDim:   'rgba(10,132,255,0.15)',
  purple:    '#BF5AF2',
  t1:        '#FFFFFF',
  t2:        '#8E8E93',
  t3:        '#48484A',
}

/* ════════════════════════════════════
   STATUS BAR
════════════════════════════════════ */
const StatusBar = () => (
  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 26px 0', height:46 }}>
    <span style={{ fontSize:15, fontWeight:600, letterSpacing:-0.3, color:C.t1 }}>9:41</span>
    <div style={{ display:'flex', gap:5, alignItems:'center' }}>
      {/* Cellular bars */}
      <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
        {[[0,3],[4,5],[8,7],[12,11]].map(([x,h],i) => (
          <rect key={i} x={x} y={11-h} width="3.5" height={h} rx="1"
            fill="white" opacity={i===3 ? 0.3 : 1}/>
        ))}
      </svg>
      {/* WiFi */}
      <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
        <circle cx="7.5" cy="9.5" r="1.4" fill="white"/>
        <path d="M4 6.8a5 5 0 0 1 7 0" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M1.2 4.1a9.2 9.2 0 0 1 12.6 0" stroke="white" strokeWidth="1.3" strokeLinecap="round" opacity="0.4"/>
      </svg>
      {/* Battery */}
      <div style={{ display:'flex', alignItems:'center', gap:1 }}>
        <div style={{ width:23, height:11, border:'1.5px solid rgba(255,255,255,0.38)', borderRadius:3.5, padding:'1.5px 2px', display:'flex', alignItems:'center' }}>
          <div style={{ width:'80%', height:'100%', background:'white', borderRadius:1.5 }}/>
        </div>
        <div style={{ width:2, height:5, background:'rgba(255,255,255,0.38)', borderRadius:'0 1px 1px 0' }}/>
      </div>
    </div>
  </div>
)

/* ════════════════════════════════════
   CIRCULAR PROGRESS RING
════════════════════════════════════ */
const ProgressRing = ({ steps, goal }) => {
  const size = 190, sw = 15
  const r    = (size - sw) / 2
  const circ = 2 * Math.PI * r
  const pct  = Math.min(steps / goal, 1)
  const dash = circ * (1 - pct)
  const cx   = size / 2, cy = size / 2

  return (
    <div style={{ position:'relative', width:size, height:size }}>
      <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
        <defs>
          <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#34D399"/>
            <stop offset="55%"  stopColor="#30D158"/>
            <stop offset="100%" stopColor="#16A34A"/>
          </linearGradient>
          <filter id="arcGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {/* outer ambient glow ring */}
        <circle cx={cx} cy={cy} r={r+6} fill="none"
          stroke="rgba(48,209,88,0.05)" strokeWidth={3}/>
        {/* track */}
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke="rgba(255,255,255,0.06)" strokeWidth={sw}/>
        {/* progress arc */}
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke="url(#arcGrad)" strokeWidth={sw}
          strokeDasharray={circ} strokeDashoffset={dash}
          strokeLinecap="round" filter="url(#arcGlow)"/>
      </svg>
      {/* centre labels */}
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <span style={{ fontSize:36, fontWeight:800, letterSpacing:-2, color:C.t1, lineHeight:1 }}>
          {Math.round(pct * 100)}%
        </span>
        <span style={{ fontSize:12, color:C.t2, marginTop:5 }}>of daily goal</span>
        <span style={{ fontSize:11, color:C.t3, marginTop:3 }}>
          {(goal - steps).toLocaleString()} steps left
        </span>
      </div>
    </div>
  )
}

/* ════════════════════════════════════
   MINI PROGRESS BAR
════════════════════════════════════ */
const MiniBar = ({ pct, color }) => (
  <div style={{ height:3, background:'rgba(255,255,255,0.08)', borderRadius:2, overflow:'hidden', marginTop:9 }}>
    <div style={{
      width:`${Math.min(pct*100,100)}%`, height:'100%',
      background:color, borderRadius:2, transition:'width 1s ease',
    }}/>
  </div>
)

/* ════════════════════════════════════
   STAT CARD  (calories / active / HR)
════════════════════════════════════ */
const StatCard = ({ label, value, unit, icon, color, dimColor, pct, sub, heartbeat }) => (
  <div style={{
    flex:1, background:C.card, borderRadius:20, padding:'14px 12px 12px',
    border:`1px solid ${C.border}`, minWidth:0,
    animation:'slideUp 0.4s ease both',
  }}>
    <div style={{
      width:32, height:32, background:dimColor, borderRadius:10,
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize:15, marginBottom:9,
    }}>
      <span style={heartbeat ? { animation:'heartbeat 1.4s ease-in-out infinite', display:'inline-block' } : {}}>
        {icon}
      </span>
    </div>
    <p style={{ fontSize:10, color:C.t2, fontWeight:500, letterSpacing:0.2, marginBottom:3 }}>{label}</p>
    <div style={{ display:'flex', alignItems:'baseline', gap:2 }}>
      <span style={{ fontSize:21, fontWeight:700, letterSpacing:-0.5, color:C.t1 }}>{value}</span>
      <span style={{ fontSize:10, color:C.t2 }}>{unit}</span>
    </div>
    {pct !== undefined && <MiniBar pct={pct} color={color}/>}
    <p style={{ fontSize:10, color:C.t2, marginTop: pct !== undefined ? 5 : 8 }}>{sub}</p>
  </div>
)

/* ════════════════════════════════════
   WEEKLY BAR CHART
════════════════════════════════════ */
const WeeklyChart = ({ data }) => {
  const DAYS    = ['M','T','W','T','F','S','S']
  const TODAY   = 6
  const maxV    = Math.max(...data)
  const total   = data.reduce((a,b) => a+b, 0)
  const CHART_H = 76

  return (
    <div style={{
      margin:'10px 16px 0', padding:'18px 18px 16px',
      background:C.card, borderRadius:22, border:`1px solid ${C.border}`,
      animation:'slideUp 0.5s ease both',
    }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18 }}>
        <div>
          <p style={{ fontSize:11, color:C.t2, textTransform:'uppercase', letterSpacing:0.9, fontWeight:600 }}>
            Weekly Activity
          </p>
          <p style={{ fontSize:20, fontWeight:700, letterSpacing:-0.5, marginTop:3, color:C.t1 }}>
            {total.toLocaleString()}
            <span style={{ fontSize:13, fontWeight:400, color:C.t2 }}> steps</span>
          </p>
        </div>
        <span style={{
          background:C.greenDim, color:C.green,
          padding:'4px 10px', borderRadius:10, fontSize:12, fontWeight:700,
        }}>↑ 12%</span>
      </div>

      <div style={{ display:'flex', alignItems:'flex-end', gap:6, height:CHART_H+24 }}>
        {data.map((v, i) => {
          const barH    = Math.max(Math.round((v / maxV) * CHART_H), 5)
          const isToday = i === TODAY
          const isGoal  = v >= 10000

          return (
            <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-end', gap:5, height:'100%' }}>
              <div style={{ position:'relative', width:'100%', display:'flex', flexDirection:'column', justifyContent:'flex-end', height:CHART_H }}>
                {isToday && (
                  <div style={{
                    position:'absolute', top:-9, left:'50%', transform:'translateX(-50%)',
                    width:6, height:6, borderRadius:'50%',
                    background:C.green, boxShadow:`0 0 7px ${C.greenGlow}`,
                    animation:'blink 2s ease-in-out infinite',
                  }}/>
                )}
                <div style={{
                  width:'100%', height:barH,
                  borderRadius:'5px 5px 3px 3px',
                  background: isToday
                    ? `linear-gradient(180deg, #43E07A 0%, ${C.green} 100%)`
                    : isGoal
                      ? 'rgba(48,209,88,0.32)'
                      : 'rgba(255,255,255,0.09)',
                  boxShadow: isToday ? `0 2px 14px ${C.greenGlow}` : 'none',
                }}/>
              </div>
              <p style={{ fontSize:10, color: isToday ? C.green : C.t2, fontWeight: isToday ? 700 : 400 }}>
                {DAYS[i]}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ════════════════════════════════════
   WATER INTAKE TRACKER
════════════════════════════════════ */
const WaterTracker = ({ cups, goal, onChange }) => {
  const pct = cups / goal

  return (
    <div style={{
      margin:'10px 16px 0', padding:'16px 18px 18px',
      background:C.card, borderRadius:22, border:`1px solid ${C.border}`,
      animation:'slideUp 0.6s ease both',
    }}>
      {/* header row */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
        <div>
          <p style={{ fontSize:11, color:C.t2, textTransform:'uppercase', letterSpacing:0.9, fontWeight:600, marginBottom:3 }}>
            Water Intake
          </p>
          <p style={{ fontSize:20, fontWeight:700, letterSpacing:-0.5, color:C.t1 }}>
            {cups}
            <span style={{ fontSize:13, fontWeight:400, color:C.t2 }}> / {goal} glasses</span>
          </p>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button
            onClick={() => onChange(Math.max(0, cups - 1))}
            style={{
              width:34, height:34, background:'rgba(255,255,255,0.08)',
              border:'none', borderRadius:11, color:'white',
              fontSize:20, cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', fontWeight:300,
            }}>−</button>
          <button
            onClick={() => onChange(Math.min(goal, cups + 1))}
            style={{
              width:34, height:34, background:C.blueDim,
              border:'none', borderRadius:11, color:C.blue,
              fontSize:20, cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700,
            }}>+</button>
        </div>
      </div>

      {/* cup icons */}
      <div style={{ display:'flex', gap:7, marginBottom:14 }}>
        {Array.from({ length:goal }, (_, i) => (
          <div key={i} onClick={() => onChange(i < cups ? i : i + 1)}
            style={{ flex:1, cursor:'pointer', transition:'transform 0.15s', opacity: i < cups ? 1 : 0.45 }}>
            <svg viewBox="0 0 20 26" fill="none">
              <path d="M3.5 4 L4.8 22 Q5 24 7 24 H13 Q15 24 15.2 22 L16.5 4 Z"
                fill={i < cups ? C.blue : 'rgba(255,255,255,0.12)'}
                style={{ transition:'fill 0.25s' }}/>
              <path d="M2.5 4 H17.5"
                stroke={i < cups ? '#5AC8FA' : 'rgba(255,255,255,0.18)'}
                strokeWidth="1.4" strokeLinecap="round"/>
              {i < cups && (
                <ellipse cx="10" cy="11" rx="3.5" ry="1.3"
                  fill="rgba(255,255,255,0.14)"/>
              )}
            </svg>
          </div>
        ))}
      </div>

      {/* progress bar */}
      <div style={{ height:6, background:'rgba(255,255,255,0.07)', borderRadius:3, overflow:'hidden' }}>
        <div style={{
          width:`${pct*100}%`, height:'100%',
          background:`linear-gradient(90deg, ${C.blue}, #5AC8FA)`,
          borderRadius:3, transition:'width 0.4s ease',
          boxShadow:'0 0 10px rgba(10,132,255,0.5)',
        }}/>
      </div>
      <p style={{ fontSize:11, color:C.t2, marginTop:8 }}>
        {cups >= goal
          ? '🎉 Daily hydration goal achieved!'
          : `${goal - cups} more glass${goal - cups !== 1 ? 'es' : ''} to reach your goal`}
      </p>
    </div>
  )
}

/* ════════════════════════════════════
   MAIN APP
════════════════════════════════════ */
export default function App() {
  const [water, setWater] = useState(5)

  const steps  = 8432,  stepGoal = 10000
  const cals   = 1847,  calGoal  = 2400
  const actMin = 47,    actGoal  = 60
  const weekly = [6200, 9100, 7800, 11200, 8900, 5300, 8432]

  return (
    <div style={{
      width:375, minHeight:'100vh',
      background:`radial-gradient(ellipse at 50% 0%, rgba(48,209,88,0.07) 0%, ${C.bg} 55%)`,
      color:C.t1, overflowY:'auto', WebkitOverflowScrolling:'touch',
      animation:'slideUp 0.3s ease both',
    }}>
      <StatusBar/>

      {/* ── Header ── */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 20px 4px' }}>
        <div>
          <p style={{ fontSize:13, color:C.t2 }}>Sunday, April 25</p>
          <h1 style={{ fontSize:22, fontWeight:700, letterSpacing:-0.5, color:C.t1, marginTop:2 }}>
            Good morning, Alex 👋
          </h1>
        </div>
        <div style={{
          width:43, height:43, borderRadius:14,
          background:'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:17, fontWeight:700, color:'white',
          boxShadow:'0 4px 16px rgba(99,102,241,0.45)',
        }}>A</div>
      </div>

      {/* ── Step Count Hero Card ── */}
      <div style={{
        margin:'12px 16px 0',
        background:'linear-gradient(148deg, #1C1C1E 0%, #252527 100%)',
        borderRadius:24, border:`1px solid ${C.border}`,
        padding:'18px 20px', boxShadow:'0 8px 32px rgba(0,0,0,0.5)',
        animation:'slideUp 0.35s ease both',
      }}>
        {/* top row */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
          <div>
            <p style={{ fontSize:11, color:C.t2, textTransform:'uppercase', letterSpacing:1, fontWeight:600 }}>
              Daily Steps
            </p>
            <p style={{ fontSize:42, fontWeight:800, letterSpacing:-2.5, lineHeight:1.05, color:C.t1, marginTop:4 }}>
              {steps.toLocaleString()}
            </p>
            <p style={{ fontSize:12, color:C.t2, marginTop:3 }}>Goal: {stepGoal.toLocaleString()} steps</p>
          </div>
          <span style={{
            background:C.greenDim, color:C.green,
            padding:'5px 12px', borderRadius:12, fontSize:13, fontWeight:700,
            boxShadow:`0 0 14px ${C.greenDim}`,
          }}>
            {Math.round(steps / stepGoal * 100)}%
          </span>
        </div>

        {/* ring */}
        <div style={{ display:'flex', justifyContent:'center', margin:'4px 0 12px' }}>
          <ProgressRing steps={steps} goal={stepGoal}/>
        </div>

        {/* bottom stats */}
        <div style={{ display:'flex', justifyContent:'space-around', paddingTop:14, borderTop:`1px solid ${C.border}` }}>
          {[
            { v:'5.4 km',  l:'Distance',  c:C.blue   },
            { v:'385 cal', l:'Active Cal', c:C.orange },
            { v:'8\'32"',  l:'Avg Pace',  c:C.purple },
          ].map((x, i) => (
            <div key={i} style={{ textAlign:'center' }}>
              <p style={{ fontSize:16, fontWeight:700, color:x.c, letterSpacing:-0.4 }}>{x.v}</p>
              <p style={{ fontSize:11, color:C.t2, marginTop:2 }}>{x.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Stat Cards Row ── */}
      <div style={{ display:'flex', gap:10, margin:'10px 16px 0' }}>
        <StatCard
          label="Calories" value="1,847" unit="kcal" icon="🔥"
          color={C.orange} dimColor={C.orangeDim}
          pct={cals / calGoal} sub={`${calGoal - cals} kcal left`}
        />
        <StatCard
          label="Active" value="47" unit="min" icon="⚡"
          color={C.green} dimColor={C.greenDim}
          pct={actMin / actGoal} sub={`${actGoal - actMin} min to go`}
        />
        <StatCard
          label="Heart Rate" value="72" unit="bpm" icon="❤️"
          color={C.red} dimColor={C.redDim}
          sub="Resting" heartbeat
        />
      </div>

      <WeeklyChart data={weekly}/>

      <WaterTracker cups={water} goal={8} onChange={setWater}/>

      {/* iOS home indicator */}
      <div style={{ display:'flex', justifyContent:'center', padding:'16px 0 14px' }}>
        <div style={{ width:134, height:5, background:'rgba(255,255,255,0.22)', borderRadius:3 }}/>
      </div>
    </div>
  )
}
