import { X, BookOpen, AlertTriangle, ClipboardList, Users, BarChart3, HelpCircle } from 'lucide-react'

const INSTRUCTOR_ITEMS = [
  { icon: BookOpen, term: 'My Classes', desc: 'Your courses. Each card shows student count and how many students are at risk.' },
  { icon: AlertTriangle, term: 'At-risk / Risk level', desc: 'Students may be flagged as High, Medium, or Low risk based on grades, attendance, and engagement. Focus on High and Medium for follow-up.' },
  { icon: ClipboardList, term: 'Interventions', desc: 'Recommended or required actions (e.g. meeting with a student, referral). Status: Pending → In progress → Completed.' },
  { icon: AlertTriangle, term: 'Risk Alerts', desc: 'List of students who need attention. Use this tab to see who to reach out to first.' },
  { icon: Users, term: 'Student List', desc: 'All students across your classes with risk level and status in one place.' },
]

const AMUSTAFF_ITEMS = [
  { icon: BarChart3, term: 'Overview', desc: 'Summary of referrals and cases. Your home view after login.' },
  { icon: AlertTriangle, term: 'Referrals', desc: 'Students referred to AMU for support. You can track and manage these referrals.' },
  { icon: ClipboardList, term: 'My Cases', desc: 'Cases assigned to you. Track progress and outcomes.' },
  { icon: Users, term: 'Reports', desc: 'Generate or view reports for your work.' },
]

export default function TutorialModal({ variant = 'instructor', onClose }) {
  const items = variant === 'amu-staff' ? AMUSTAFF_ITEMS : INSTRUCTOR_ITEMS
  const title = variant === 'amu-staff' ? 'Welcome to the AMU Staff dashboard' : 'Welcome to the Instructor dashboard'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" role="dialog" aria-modal="true" aria-labelledby="tutorial-title">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-blue-600" />
            <h2 id="tutorial-title" className="text-lg font-bold text-slate-900">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-5 py-4 overflow-y-auto">
          <p className="text-sm text-slate-600 mb-4">
            Here are the main features and terms you’ll see so nothing feels confusing:
          </p>
          <ul className="space-y-4">
            {items.map((item, i) => {
              const Icon = item.icon
              return (
                <li key={i} className="flex gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{item.term}</p>
                    <p className="text-slate-600 text-sm mt-0.5">{item.desc}</p>
                  </div>
                </li>
              )
            })}
          </ul>
          <p className="text-xs text-slate-500 mt-4">
            You can replay this from Settings anytime, or open Help (?) on the login page for FAQ.
          </p>
        </div>
        <div className="px-5 py-4 border-t border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}
