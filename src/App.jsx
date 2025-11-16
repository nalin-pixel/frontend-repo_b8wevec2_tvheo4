import { useState } from 'react'
import Hero from './components/Hero'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import Uploader from './components/Uploader'

function App() {
  const [token, setToken] = useState('')
  const [started, setStarted] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {!started ? (
        <Hero onGetStarted={()=>setStarted(true)} />
      ) : !token ? (
        <div className="max-w-5xl mx-auto px-4 -mt-24 relative z-20">
          <Auth onAuth={setToken} />
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-extrabold">PFA – שליטה פיננסית מלאה</h1>
            <button onClick={()=>setToken('')} className="text-sm text-blue-700 underline">יציאה</button>
          </div>
          <Uploader token={token} onUploaded={()=>{ /* handled in dashboard refresh */ }} />
          <Dashboard token={token} />
        </div>
      )}
    </div>
  )
}

export default App
