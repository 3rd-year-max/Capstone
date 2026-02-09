import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipboardList, User, Building2, BookOpen, Calendar, CheckCircle, Clock, Filter, ChevronRight } from 'lucide-react'

const CASES = [
  { id: 1, student: 'Alex Chen', department: 'Computer Science', course: 'CS 201', type: 'Tutoring referral', status: 'in-progress', due: 'Feb 3, 2026' },
  { id: 2, student: 'Jordan Lee', department: 'Information Tech', course: 'CS 202', type: 'Study skills workshop', status: 'completed', completed: 'Jan 30, 2026' },
  { id: 3, student: 'Sam Rivera', department: 'Computer Science', course: 'CS 201', type: '1:1 academic coaching', status: 'pending', due: 'Feb 5, 2026' },
  { id: 4, student: 'Taylor Brooks', department: 'Information Tech', course: 'CS 202', type: 'Tutoring referral', status: 'in-progress', due: 'Feb 4, 2026' },
  { id: 5, student: 'Morgan Kim', department: 'Mathematics', course: 'MATH 301', type: 'LMS follow-up', status: 'completed', completed: 'Jan 29, 2026' },
  { id: 6, student: 'Casey Dunn', department: 'Engineering', course: 'ENG 101', type: 'Office hours referral', status: 'pending', due: 'Feb 6, 2026' },
]

const statusConfig = {
  pending: { icon: Clock, label: 'Pending', class: 'bg-amber-100 text-amber-700' },
  'in-progress': { icon: Clock, label: 'In progress', class: 'bg-teal-100 text-teal-700' },
  completed: { icon: CheckCircle, label: 'Completed', class: 'bg-emerald-100 text-emerald-700' },
}

export default function AmuStaffCases() {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = CASES.filter((c) => statusFilter === 'all' || c.status === statusFilter)

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-teal-50 to-teal-50/80 border border-teal-200/80 shadow-sm ring-1 ring-teal-200/50">
        <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600 shadow-inner">
          <ClipboardList className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1">
            <span className="w-0.5 h-3 rounded-full bg-teal-500" />
            My Cases
          </h2>
          <p className="text-[11px] text-gray-600 mt-0.5">Cases assigned to you for academic support</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Filter className="w-3.5 h-3.5 text-gray-500" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-200 px-2 py-1.5 text-[11px] font-medium text-gray-700 bg-white hover:border-gray-300 focus:ring-1 focus:ring-teal-500 outline-none transition-colors"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In progress</option>
          <option value="completed">Completed</option>
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
                <th className="px-2 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-2 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-2 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Due / Done</th>
                <th className="px-2 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((row) => {
                const config = statusConfig[row.status]
                const Icon = config.icon
                return (
                  <tr key={row.id} className="hover:bg-teal-50/50 transition-colors">
                    <td className="px-2 py-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-md bg-teal-100 flex items-center justify-center text-teal-600">
                          <User className="w-3 h-3" />
                        </div>
                        <span className="font-semibold text-gray-900 text-[11px]">{row.student}</span>
                      </div>
                    </td>
                    <td className="px-2 py-1.5 text-[11px] text-gray-600 flex items-center gap-0.5">
                      <Building2 className="w-2.5 h-2.5 text-gray-400" /> {row.department}
                    </td>
                    <td className="px-2 py-1.5 text-[11px] text-gray-600 flex items-center gap-0.5">
                      <BookOpen className="w-2.5 h-2.5 text-gray-400" /> {row.course}
                    </td>
                    <td className="px-2 py-1.5 text-[11px] font-medium text-gray-700">{row.type}</td>
                    <td className="px-2 py-1.5">
                      <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${config.class}`}>
                        <Icon className="w-2 h-2" /> {config.label}
                      </span>
                    </td>
                    <td className="px-2 py-1.5 text-[11px] text-gray-600 flex items-center gap-0.5">
                      <Calendar className="w-2.5 h-2.5 text-gray-400" />
                      {row.status === 'completed' ? row.completed : row.due}
                    </td>
                    <td className="px-2 py-1.5">
                      <button
                        type="button"
                        onClick={() => navigate(`/amu-staff/case/${row.id}`)}
                        className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-teal-600 hover:text-teal-700 px-1.5 py-0.5 rounded hover:bg-teal-50 transition-colors"
                      >
                        View <ChevronRight className="w-2.5 h-2.5" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
