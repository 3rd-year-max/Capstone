import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Shield, GraduationCap, Users, Search, MoreVertical, ChevronRight } from 'lucide-react'
import { listUsers } from '../../api'

const roleConfig = {
  instructor: { icon: GraduationCap, label: 'Instructor', class: 'bg-blue-100 text-blue-700' },
  admin: { icon: Shield, label: 'Admin', class: 'bg-blue-100 text-blue-700' },
  'amu-staff': { icon: Users, label: 'AMU Staff', class: 'bg-teal-100 text-teal-700' },
}

export default function AdminUserAccounts() {
  const navigate = useNavigate()
  const [roleFilter, setRoleFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    listUsers(roleFilter, search)
      .then(setUsers)
      .catch((e) => {
        setError(e?.message || 'Failed to load users')
        setUsers([])
      })
      .finally(() => setLoading(false))
  }, [roleFilter, search])

  return (
    <div className="space-y-2">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-[11px] text-red-700">
          {error}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[140px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
          <input
            type="search"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1.5 rounded-lg border border-gray-200 text-[11px] hover:border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-lg border border-gray-200 px-2 py-1.5 text-[11px] font-medium text-gray-700 bg-white hover:border-gray-300 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
        >
          <option value="all">All roles</option>
          <option value="instructor">Instructor</option>
          <option value="admin">Admin</option>
          <option value="amu-staff">AMU Staff</option>
        </select>
        <button type="button" className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600 text-white text-[11px] font-semibold hover:bg-blue-700 shadow-sm transition-all">
          <User className="w-3 h-3" />
          Add user
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        {loading ? (
          <div className="p-4 text-center text-[11px] text-gray-500 flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            Loading users…
          </div>
        ) : users.length === 0 ? (
          <div className="p-4 text-center text-[11px] text-gray-500">
            No users match the current filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/80 border-b border-gray-200">
                <tr>
                  <th className="px-2 py-1.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-2 py-1.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-2 py-1.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-2 py-1.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-2 py-1.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => {
                  const config = roleConfig[u.role] || roleConfig.instructor
                  const Icon = config.icon
                  return (
                    <tr key={u.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-2 py-1.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center text-blue-600">
                            <User className="w-3 h-3" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-[11px]">{u.name || '—'}</p>
                            <p className="text-[10px] text-gray-500 flex items-center gap-0.5">
                              <Mail className="w-2 h-2" /> {u.email || '—'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-1.5">
                        <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${config.class}`}>
                          <Icon className="w-2.5 h-2.5" /> {config.label}
                        </span>
                      </td>
                      <td className="px-2 py-1.5 text-[11px] text-gray-600">{u.department || '—'}</td>
                      <td className="px-2 py-1.5">
                        <span className={`inline-flex px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${u.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                          {u.status || 'active'}
                        </span>
                      </td>
                      <td className="px-2 py-1.5 flex items-center gap-1">
                        <button type="button" onClick={() => navigate(`/admin/user/${u.id}`)} className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-blue-600 hover:text-blue-700 px-1.5 py-0.5 rounded hover:bg-blue-50 transition-colors">
                          View <ChevronRight className="w-2.5 h-2.5" />
                        </button>
                        <button type="button" className="p-1.5 rounded hover:bg-gray-100 text-gray-500 transition-colors">
                          <MoreVertical className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
