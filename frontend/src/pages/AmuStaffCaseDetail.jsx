import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, User, BookOpen, Calendar, ClipboardList, CheckCircle, Clock, Building2, Users } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'

const CASES = {
  1: { student: 'Alex Chen', studentId: 1, department: 'Computer Science', course: 'CS 201', type: 'Tutoring referral', status: 'in-progress', due: 'Feb 3, 2026', notes: 'Referred for data structures. Assigned to tutoring center. Follow-up scheduled.', createdAt: 'Jan 30, 2026' },
  2: { student: 'Jordan Lee', studentId: 2, department: 'Information Tech', course: 'CS 202', type: 'Study skills workshop', status: 'completed', completed: 'Jan 30, 2026', notes: 'Attended workshop. Self-reported improvement in time management.', createdAt: 'Jan 28, 2026' },
  3: { student: 'Sam Rivera', studentId: 3, department: 'Computer Science', course: 'CS 201', type: '1:1 academic coaching', status: 'pending', due: 'Feb 5, 2026', notes: 'Scheduled for first session. Focus: exam preparation strategies.', createdAt: 'Jan 29, 2026' },
  4: { student: 'Taylor Brooks', studentId: 4, department: 'Information Tech', course: 'CS 202', type: 'Tutoring referral', status: 'in-progress', due: 'Feb 4, 2026', notes: 'Database concepts. Waiting for tutoring center confirmation.', createdAt: 'Jan 31, 2026' },
  5: { student: 'Morgan Kim', studentId: 5, department: 'Mathematics', course: 'MATH 301', type: 'LMS follow-up', status: 'completed', completed: 'Jan 29, 2026', notes: 'LMS engagement improved after outreach.', createdAt: 'Jan 27, 2026' },
  6: { student: 'Casey Dunn', studentId: 6, department: 'Engineering', course: 'ENG 101', type: 'Office hours referral', status: 'pending', due: 'Feb 6, 2026', notes: 'Instructor requested AMU to coordinate office hours visit.', createdAt: 'Feb 1, 2026' },
}

const statusConfig = {
  pending: { icon: Clock, label: 'Pending', class: 'bg-amber-100 text-amber-700' },
  'in-progress': { icon: Clock, label: 'In progress', class: 'bg-teal-100 text-teal-700' },
  completed: { icon: CheckCircle, label: 'Completed', class: 'bg-emerald-100 text-emerald-700' },
}

export default function AmuStaffCaseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const caseItem = CASES[id] || CASES[1]
  const config = statusConfig[caseItem.status] || statusConfig.pending
  const StatusIcon = config.icon

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
            <div className="flex items-start justify-between gap-1.5">
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded bg-teal-100 flex items-center justify-center text-teal-600">
                  <ClipboardList className="w-3 h-3" />
                </div>
                <div>
                  <h1 className="text-xs font-bold text-gray-900">{caseItem.type}</h1>
                  <p className="text-gray-500 text-[10px] mt-0.5">Case details</p>
                </div>
              </div>
              <span className={`inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[10px] font-medium ${config.class}`}>
                <StatusIcon className="w-2 h-2" />
                {config.label}
              </span>
            </div>
          </div>

          <div className="p-2 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="p-1.5 rounded-md border border-gray-200/80 bg-gray-50/50 hover:shadow-md transition-shadow">
                <p className="text-[8px] font-semibold text-gray-500 uppercase tracking-wider">Student</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="w-5 h-5 rounded bg-teal-100 flex items-center justify-center text-teal-600">
                    <User className="w-2.5 h-2.5" />
                  </div>
                  <p className="font-bold text-gray-900 text-[10px]">{caseItem.student}</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/amu-staff/student/${caseItem.studentId}`)}
                  className="mt-1 text-[10px] font-semibold text-teal-600 hover:text-teal-700 px-1 py-0.5 rounded hover:bg-teal-50 transition-colors"
                >
                  View student →
                </button>
              </div>
              <div className="p-1.5 rounded-md border border-gray-200/80 bg-gray-50/50 hover:shadow-md transition-shadow">
                <p className="text-[8px] font-semibold text-gray-500 uppercase tracking-wider">Course / Department</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="w-5 h-5 rounded bg-teal-100 flex items-center justify-center text-teal-600">
                    <BookOpen className="w-2.5 h-2.5" />
                  </div>
                  <p className="font-bold text-gray-900 text-[10px]">{caseItem.course}</p>
                </div>
                <p className="text-[10px] text-gray-600 flex items-center gap-0.5 mt-0.5">
                  <Building2 className="w-2.5 h-2.5 text-gray-400" /> {caseItem.department}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="p-1.5 rounded-md border border-gray-200/80 bg-gray-50/50 hover:shadow-md transition-shadow">
                <p className="text-[8px] font-semibold text-gray-500 uppercase tracking-wider">Created</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Calendar className="w-2.5 h-2.5 text-gray-500" />
                  <p className="font-semibold text-gray-900 text-[10px]">{caseItem.createdAt}</p>
                </div>
              </div>
              <div className="p-1.5 rounded-md border border-gray-200/80 bg-gray-50/50 hover:shadow-md transition-shadow">
                <p className="text-[8px] font-semibold text-gray-500 uppercase tracking-wider">
                  {caseItem.status === 'completed' ? 'Completed' : 'Due date'}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Calendar className="w-2.5 h-2.5 text-gray-500" />
                  <p className="font-semibold text-gray-900 text-[10px]">
                    {caseItem.status === 'completed' ? caseItem.completed : caseItem.due}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[8px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Notes</p>
              <p className="text-gray-700 text-[10px] p-1.5 rounded-md bg-gray-50 border border-gray-200/80">{caseItem.notes}</p>
            </div>

            {caseItem.status !== 'completed' && (
              <div className="flex flex-wrap gap-1 pt-1.5 border-t border-gray-200">
                <button
                  type="button"
                  className="px-1.5 py-1 rounded text-[10px] font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition-all"
                >
                  Mark in progress
                </button>
                <button
                  type="button"
                  className="px-1.5 py-1 rounded text-[10px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-all"
                >
                  Mark completed
                </button>
                <button
                  type="button"
                  className="px-1.5 py-1 rounded text-[10px] font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  Update notes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
