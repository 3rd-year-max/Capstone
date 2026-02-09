import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Mail, Building2, Shield, GraduationCap, Users } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { getUser } from '../api'

const roleConfig = {
  instructor: { icon: GraduationCap, label: 'Instructor', class: 'bg-blue-100 text-blue-700' },
  admin: { icon: Shield, label: 'Admin', class: 'bg-gray-100 text-gray-700' },
  'amu-staff': { icon: Users, label: 'AMU Staff', class: 'bg-teal-100 text-teal-700' },
}

export default function AdminUserDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    getUser(id)
      .then(setUser)
      .catch((e) => {
        setError(e?.message || 'Failed to load user')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <DashboardLayout title="Administrator Dashboard" subtitle="System Overview & Management" icon={Shield} variant="admin">
        <div className="space-y-2">
          <button type="button" onClick={() => navigate('/admin')} className="inline-flex items-center gap-0.5 px-1.5 py-1 rounded text-[10px] font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-2.5 h-2.5" /> Back to dashboard
          </button>
          <div className="p-4 text-center text-[11px] text-gray-500">Loading user…</div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !user) {
    return (
      <DashboardLayout title="Administrator Dashboard" subtitle="System Overview & Management" icon={Shield} variant="admin">
        <div className="space-y-2">
          <button type="button" onClick={() => navigate('/admin')} className="inline-flex items-center gap-0.5 px-1.5 py-1 rounded text-[10px] font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-2.5 h-2.5" /> Back to dashboard
          </button>
          <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-[11px] text-red-700">{error || 'User not found'}</div>
        </div>
      </DashboardLayout>
    )
  }

  const config = roleConfig[user.role] || roleConfig.instructor
  const Icon = config.icon

  return (
    <DashboardLayout title="Administrator Dashboard" subtitle="System Overview & Management" icon={Shield} variant="admin">
      <div className="space-y-2">
        <button type="button" onClick={() => navigate('/admin')} className="inline-flex items-center gap-0.5 px-1.5 py-1 rounded text-[10px] font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-2.5 h-2.5" /> Back to dashboard
        </button>

        <div className="bg-white rounded-md border border-gray-200/80 shadow-sm overflow-hidden border-l-4 border-l-gray-500">
          <div className="p-2 border-b border-gray-200">
            <div className="flex items-start gap-1.5">
              <div className="w-9 h-9 rounded-md bg-gray-100 flex items-center justify-center text-gray-600">
                <User className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h1 className="text-xs font-bold text-gray-900">{user.name || '—'}</h1>
                <p className="text-[10px] text-gray-500 flex items-center gap-0.5 mt-0.5">
                  <Mail className="w-2 h-2" /> {user.email || '—'}
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-0.5">
                  <Building2 className="w-2 h-2" /> {user.department || '—'}
                </p>
                <span className={`inline-flex items-center gap-0.5 mt-1 px-1 py-0.5 rounded text-[10px] font-medium ${config.class}`}>
                  <Icon className="w-2 h-2" /> {config.label}
                </span>
                <span className={`inline-flex ml-1 px-1 py-0.5 rounded text-[10px] font-medium ${user.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                  {user.status || 'active'}
                </span>
              </div>
            </div>
          </div>
          <div className="p-2 border-t border-gray-100">
            <button type="button" className="text-[10px] font-semibold text-gray-600 hover:text-gray-900 px-1 py-0.5 rounded hover:bg-gray-100">
              Edit user
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
