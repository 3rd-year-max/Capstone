import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Building2, BookOpen, AlertTriangle, ChevronRight, Search } from 'lucide-react'

const REFERRALS = [
  { id: 1, name: 'Alex Chen', email: 'achen@university.edu', department: 'Computer Science', course: 'CS 201', risk: 'High', referredBy: 'Dr. Sarah Johnson', referredDate: 'Jan 28, 2026' },
  { id: 2, name: 'Jordan Lee', email: 'jlee@university.edu', department: 'Information Tech', course: 'CS 202', risk: 'High', referredBy: 'Dr. Sarah Johnson', referredDate: 'Jan 27, 2026' },
  { id: 3, name: 'Sam Rivera', email: 'srivera@university.edu', department: 'Computer Science', course: 'CS 201', risk: 'Medium', referredBy: 'Dr. Sarah Johnson', referredDate: 'Jan 26, 2026' },
  { id: 4, name: 'Taylor Brooks', email: 'tbrooks@university.edu', department: 'Information Tech', course: 'CS 202', risk: 'High', referredBy: 'Dr. Sarah Johnson', referredDate: 'Jan 25, 2026' },
  { id: 5, name: 'Morgan Kim', email: 'mkim@university.edu', department: 'Mathematics', course: 'MATH 301', risk: 'Medium', referredBy: 'Dr. Emily Davis', referredDate: 'Jan 24, 2026' },
  { id: 6, name: 'Casey Dunn', email: 'cdunn@university.edu', department: 'Engineering', course: 'ENG 101', risk: 'Medium', referredBy: 'Prof. James Wilson', referredDate: 'Jan 23, 2026' },
]

const riskClass = { High: 'bg-red-100 text-red-700', Medium: 'bg-amber-100 text-amber-700', Low: 'bg-blue-100 text-blue-700' }

export default function AmuStaffReferrals() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState('all')

  const filtered = REFERRALS.filter((r) => {
    if (riskFilter !== 'all' && r.risk !== riskFilter) return false
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.email.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-teal-50 to-teal-50/80 border border-teal-200/80 shadow-sm ring-1 ring-teal-200/50">
        <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600 shadow-inner">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1">
            <span className="w-0.5 h-3 rounded-full bg-teal-500" />
            Student Referrals
          </h2>
          <p className="text-[11px] text-gray-600 mt-0.5">Students referred to AMU for academic support</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[140px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
          <input
            type="search"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1.5 rounded-lg border border-gray-200 text-[11px] hover:border-gray-300 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors"
          />
        </div>
        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="rounded-lg border border-gray-200 px-2 py-1.5 text-[11px] font-medium text-gray-700 bg-white hover:border-gray-300 focus:ring-1 focus:ring-teal-500 outline-none transition-colors"
        >
          <option value="all">All risk levels</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <div className="bg-white rounded-lg border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 border-b border-gray-200">
              <tr>
                <th className="px-2 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-2 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-2 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-2 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Risk</th>
                <th className="px-2 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Referred by</th>
                <th className="px-2 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-2 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-teal-50/50 transition-colors">
                  <td className="px-2 py-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-md bg-teal-100 flex items-center justify-center text-teal-600">
                        <User className="w-3 h-3" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-[11px]">{r.name}</p>
                        <p className="text-[10px] text-gray-500 flex items-center gap-0.5">
                          <Mail className="w-2 h-2" /> {r.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-1.5 text-[11px] text-gray-600 flex items-center gap-0.5">
                    <Building2 className="w-2.5 h-2.5 text-gray-400" /> {r.department}
                  </td>
                  <td className="px-2 py-1.5 text-[11px] text-gray-600 flex items-center gap-0.5">
                    <BookOpen className="w-2.5 h-2.5 text-gray-400" /> {r.course}
                  </td>
                  <td className="px-2 py-1.5">
                    <span className={'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ' + riskClass[r.risk]}>
                      <AlertTriangle className="w-2 h-2" /> {r.risk}
                    </span>
                  </td>
                  <td className="px-2 py-1.5 text-[11px] text-gray-600">{r.referredBy}</td>
                  <td className="px-2 py-1.5 text-[11px] text-gray-600">{r.referredDate}</td>
                  <td className="px-2 py-1.5">
                    <button
                      type="button"
                      onClick={() => navigate(`/amu-staff/student/${r.id}`)}
                      className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-teal-600 hover:text-teal-700 px-1.5 py-0.5 rounded hover:bg-teal-50 transition-colors"
                    >
                      View <ChevronRight className="w-2.5 h-2.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
