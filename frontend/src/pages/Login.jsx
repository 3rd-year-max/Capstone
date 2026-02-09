import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain, GraduationCap, Mail, Lock, Cog, UserPlus, Users } from 'lucide-react'
import { login as apiLogin } from '../api'
import { useAuth } from '../context/AuthContext'

const ROLES = [
  { value: 'instructor', label: 'Instructor', path: '/instructor', icon: GraduationCap },
  { value: 'admin', label: 'Admin', path: '/admin', icon: Cog },
  { value: 'amu-staff', label: 'AMU Staff', path: '/amu-staff', icon: Users },
]

export default function Login() {
  const navigate = useNavigate()
  const { login: setAuth } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('instructor')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailRequired, setEmailRequired] = useState(false)
  const [passwordRequired, setPasswordRequired] = useState(false)

  const selectedRole = ROLES.find((r) => r.value === role) || ROLES[0]
  const RoleIcon = selectedRole.icon

  const handleSignIn = async (e) => {
    e.preventDefault()
    setError('')
    const emailEmpty = !email.trim()
    const passwordEmpty = !password.trim()
    setEmailRequired(emailEmpty)
    setPasswordRequired(passwordEmpty)
    if (emailEmpty || passwordEmpty) {
      return
    }
    setLoading(true)
    try {
      const data = await apiLogin({ email: email.trim(), password, role })
      setAuth(data)
      navigate(selectedRole.path)
    } catch (err) {
      setError(err.message || 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAccount = (e) => {
    e.preventDefault()
    navigate('/signup')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#e8e0f5] via-[#e5eef7] to-[#d4e8f0] py-8">
      {/* Decorative dots in bottom-right */}
      <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] opacity-40">
        <svg viewBox="0 0 100 100" className="w-full h-full text-lime-300/80">
          {Array.from({ length: 200 }).map((_, i) => {
            const angle = (i / 200) * 90 * (Math.PI / 180)
            const r = 40 + (i % 5) * 2
            const x = 50 + Math.cos(angle) * r
            const y = 50 + Math.sin(angle) * r
            return <circle key={i} cx={x} cy={y} r="0.8" fill="currentColor" />
          })}
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-md px-4 text-center">
        {/* Icons */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="p-2 rounded-lg bg-white/60 shadow-sm">
            <Brain className="w-8 h-8 text-blue-600" strokeWidth={1.8} />
          </div>
          <div className="p-2 rounded-lg bg-white/60 shadow-sm">
            <GraduationCap className="w-8 h-8 text-blue-600" strokeWidth={1.8} />
          </div>
        </div>

        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-1">
          Academic Early Warning System
        </h1>
        <p className="text-gray-600 text-base mb-8">Predictive insights for student success.</p>

        {/* Login card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 text-left">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">Welcome back</h2>
          <p className="text-gray-500 text-base mb-6">Sign in to access your dashboard.</p>

          <form className="space-y-5" onSubmit={handleSignIn}>
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-base text-red-700">
                {error}
              </div>
            )}
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">Email address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailRequired(false) }}
                  placeholder="email@university.edu"
                  className={`w-full pl-12 pr-4 py-3.5 rounded-xl border outline-none transition text-base text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 ${emailRequired ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
                />
              </div>
              {emailRequired && <p className="mt-1 text-sm text-red-600">This is required</p>}
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-base font-medium text-gray-700">Password</label>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setPasswordRequired(false) }}
                  placeholder="•••••••••••"
                  className={`w-full pl-12 pr-4 py-3.5 rounded-xl border outline-none transition text-base text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 ${passwordRequired ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
                />
              </div>
              {passwordRequired && <p className="mt-1 text-sm text-red-600">This is required</p>}
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">Sign in as</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                  <RoleIcon className="w-5 h-5" />
                </div>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition text-base text-gray-900 bg-white appearance-none cursor-pointer"
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm">▼</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition shadow-md hover:shadow-lg hover:shadow-blue-500/20 disabled:opacity-60 disabled:pointer-events-none"
              >
                <RoleIcon className="w-5 h-5" />
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
              <div className="relative my-2">
                <span className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </span>
                <span className="relative flex justify-center text-sm text-gray-400">
                  <span className="bg-white px-2">or</span>
                </span>
              </div>
              <button
                type="button"
                onClick={handleCreateAccount}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition"
              >
                <UserPlus className="w-5 h-5" />
                Create account
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Help icon */}
      <button
        type="button"
        onClick={() => navigate('/help')}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-gray-700 text-white flex items-center justify-center shadow-lg hover:bg-gray-800 transition z-20 text-lg"
        aria-label="Help"
      >
        <span className="text-lg font-medium">?</span>
      </button>
    </div>
  )
}
