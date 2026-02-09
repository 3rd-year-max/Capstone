import { Link } from 'react-router-dom'
import { Brain, GraduationCap, ArrowLeft, HelpCircle, Mail } from 'lucide-react'

const FAQ = [
  { q: 'What is the Academic Early Warning System?', a: 'A system that uses predictive analytics to identify students at risk and support timely interventions.' },
  { q: 'How do I sign in?', a: 'Use your university email and password. Choose your role: Instructor, Admin, or AMU Staff, then click the corresponding sign-in button.' },
  { q: 'I forgot my password.', a: 'Click "Forgot password?" on the login page and enter your email to receive a reset link.' },
  { q: 'Who can I contact for support?', a: 'Contact your institution\'s IT support or the system administrator.' },
]

export default function Help() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8e0f5] via-[#e5eef7] to-[#d4e8f0] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center gap-4 mb-4">
          <div className="p-2 rounded-lg bg-white/60 shadow-sm">
            <Brain className="w-8 h-8 text-blue-600" strokeWidth={1.8} />
          </div>
          <div className="p-2 rounded-lg bg-white/60 shadow-sm">
            <GraduationCap className="w-8 h-8 text-blue-600" strokeWidth={1.8} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-1">Help &amp; FAQ</h1>
        <p className="text-center text-gray-600 text-base mb-6">Academic Early Warning System</p>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200/80 p-8 space-y-5">
          <div className="flex items-center gap-3 text-blue-600">
            <HelpCircle className="w-6 h-6" />
            <h2 className="font-semibold text-lg text-gray-900">Frequently asked questions</h2>
          </div>
          <ul className="space-y-4">
            {FAQ.map((item, i) => (
              <li key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <p className="font-medium text-gray-900 text-base">{item.q}</p>
                <p className="text-gray-600 text-sm mt-1">{item.a}</p>
              </li>
            ))}
          </ul>
          <div className="pt-3 flex items-center gap-3 text-gray-500 text-sm">
            <Mail className="w-5 h-5 flex-shrink-0" />
            <span>For technical issues, contact your administrator.</span>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-base font-medium text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
