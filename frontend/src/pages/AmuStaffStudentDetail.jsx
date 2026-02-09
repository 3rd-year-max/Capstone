import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  User,
  Mail,
  BookOpen,
  Building2,
  AlertTriangle,
  CheckCircle,
  Calendar,
  ClipboardList,
  Users,
} from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'

const STUDENTS = {
  1: { name: 'Alex Chen', email: 'achen@university.edu', department: 'Computer Science', course: 'CS 201', risk: 'High', referredBy: 'Dr. Sarah Johnson', referredDate: 'Jan 28, 2026', gpa: 1.8, attendance: 62 },
  2: { name: 'Jordan Lee', email: 'jlee@university.edu', department: 'Information Tech', course: 'CS 202', risk: 'High', referredBy: 'Dr. Sarah Johnson', referredDate: 'Jan 27, 2026', gpa: 2.1, attendance: 71 },
  3: { name: 'Sam Rivera', email: 'srivera@university.edu', department: 'Computer Science', course: 'CS 201', risk: 'Medium', referredBy: 'Dr. Sarah Johnson', referredDate: 'Jan 26, 2026', gpa: 2.4, attendance: 78 },
  4: { name: 'Taylor Brooks', email: 'tbrooks@university.edu', department: 'Information Tech', course: 'CS 202', risk: 'High', referredBy: 'Dr. Sarah Johnson', referredDate: 'Jan 25, 2026', gpa: 2.0, attendance: 68 },
  5: { name: 'Morgan Kim', email: 'mkim@university.edu', department: 'Mathematics', course: 'MATH 301', risk: 'Medium', referredBy: 'Dr. Emily Davis', referredDate: 'Jan 24, 2026', gpa: 2.3, attendance: 75 },
  6: { name: 'Casey Dunn', email: 'cdunn@university.edu', department: 'Engineering', course: 'ENG 101', risk: 'Medium', referredBy: 'Prof. James Wilson', referredDate: 'Jan 23, 2026', gpa: 2.5, attendance: 80 },
}

const SUPPORT_HISTORY = [
  { id: 1, type: 'Tutoring referral', status: 'in-progress', date: 'Jan 30, 2026', notes: 'Assigned to math tutoring center' },
  { id: 2, type: '1:1 check-in', status: 'completed', date: 'Jan 28, 2026', notes: 'Initial intake completed' },
]

const riskClass = { High: 'bg-red-100 text-red-700', Medium: 'bg-amber-100 text-amber-700', Low: 'bg-blue-100 text-blue-700' }
const statusClass = { 'in-progress': 'bg-teal-100 text-teal-700', completed: 'bg-emerald-100 text-emerald-700' }

export default function AmuStaffStudentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const student = STUDENTS[id] || STUDENTS[1]

  return (
    <DashboardLayout
      title="AMU Staff Dashboard"
      subtitle="Academic support overview"
      icon={Users}
      variant="amu-staff"
    >
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => navigate('/amu-staff')}
          className="inline-flex items-center gap-0.5 px-1.5 py-1 rounded text-[10px] font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-2.5 h-2.5" />
          Back to dashboard
        </button>

        <div className="bg-white rounded-md border border-gray-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden border-l-4 border-l-teal-500">
          <div className="p-2 border-b border-gray-200">
            <div className="flex items-start gap-1.5">
              <div className="w-9 h-9 rounded-md bg-teal-100 flex items-center justify-center text-teal-600 ring-1 ring-teal-200/50">
                <User className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h1 className="text-xs font-bold text-gray-900">{student.name}</h1>
                <p className="text-[10px] text-gray-500 flex items-center gap-0.5 mt-0.5">
                  <Mail className="w-2 h-2" /> {student.email}
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-0.5">
                  <Building2 className="w-2 h-2" /> {student.department} • <BookOpen className="w-2 h-2" /> {student.course}
                </p>
                <span className={`inline-flex items-center gap-0.5 mt-1 px-1 py-0.5 rounded text-[10px] font-medium ${riskClass[student.risk]}`}>
                  <AlertTriangle className="w-2 h-2" /> Risk: {student.risk}
                </span>
              </div>
              <button
                type="button"
                onClick={() => navigate(`/amu-staff/case/1`)}
                className="flex items-center gap-0.5 px-1.5 py-1 rounded bg-teal-600 text-white text-[10px] font-semibold hover:bg-teal-700 shadow-sm transition-all"
              >
                <ClipboardList className="w-2.5 h-2.5" />
                Open case
              </button>
            </div>

            <div className="mt-2 p-2 rounded-md bg-teal-50/80 border border-teal-200/80">
              <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">Referral info</p>
              <p className="text-[10px] text-gray-700 mt-0.5">Referred by <strong>{student.referredBy}</strong> on {student.referredDate}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 mt-2">
              <div className="p-1.5 rounded-md border border-gray-200/80 bg-gray-50/80">
                <p className="text-[8px] text-gray-500 font-semibold uppercase tracking-wider">GPA</p>
                <p className="text-base font-bold text-gray-900">{student.gpa}</p>
                <div className="h-1 bg-gray-200 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-teal-600 rounded-full transition-all" style={{ width: `${(student.gpa / 4) * 100}%` }} />
                </div>
              </div>
              <div className="p-1.5 rounded-md border border-gray-200/80 bg-gray-50/80">
                <p className="text-[8px] text-gray-500 font-semibold uppercase tracking-wider">Attendance</p>
                <p className="text-base font-bold text-gray-900">{student.attendance}%</p>
                <div className="h-1 bg-gray-200 rounded-full mt-0.5 overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full transition-all" style={{ width: `${student.attendance}%` }} />
                </div>
              </div>
              <div className="p-1.5 rounded-md border border-gray-200/80 bg-gray-50/80 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-teal-500" />
                <span className="text-[10px] font-medium text-gray-600 ml-1">Referred to AMU</span>
              </div>
            </div>
          </div>

          <div className="p-2 border-t border-gray-200">
            <h2 className="text-xs font-bold text-gray-900 mb-1.5 flex items-center gap-0.5">
              <span className="w-0.5 h-2.5 rounded-full bg-teal-500" />
              <ClipboardList className="w-3 h-3 text-teal-600" />
              Support history
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-2 py-1.5 text-[10px] font-semibold text-gray-500 uppercase">Type</th>
                    <th className="px-2 py-1.5 text-[10px] font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-2 py-1.5 text-[10px] font-semibold text-gray-500 uppercase">Date</th>
                    <th className="px-2 py-1.5 text-[10px] font-semibold text-gray-500 uppercase">Notes</th>
                    <th className="px-2 py-1.5 text-[10px] font-semibold text-gray-500 uppercase"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {SUPPORT_HISTORY.map((h) => (
                    <tr key={h.id} className="hover:bg-teal-50/50 transition-colors">
                      <td className="px-1.5 py-1 font-medium text-gray-900 text-[10px]">{h.type}</td>
                      <td className="px-1.5 py-1">
                        <span className={`inline-flex px-1 py-0.5 rounded-full text-[9px] font-medium ${statusClass[h.status]}`}>
                          {h.status}
                        </span>
                      </td>
                      <td className="px-1.5 py-1 text-[10px] text-gray-600 flex items-center gap-0.5">
                        <Calendar className="w-2 h-2" /> {h.date}
                      </td>
                      <td className="px-1.5 py-1 text-[10px] text-gray-500">{h.notes}</td>
                      <td className="px-1.5 py-1">
                        <button type="button" className="text-[10px] font-medium text-teal-600 hover:text-teal-700">
                          View case
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
