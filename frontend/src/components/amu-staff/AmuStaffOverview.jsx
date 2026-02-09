import { Users as UsersIcon, AlertTriangle, BookOpen, CheckCircle } from 'lucide-react'

const KPI_CARDS = [
  { label: 'Students Supported', value: '2,340', sub: 'This academic year', icon: UsersIcon, color: 'teal' },
  { label: 'At Risk Referred', value: '412', sub: 'Referred for intervention', icon: AlertTriangle, color: 'amber' },
  { label: 'Courses Monitored', value: '89', sub: 'Across departments', icon: BookOpen, color: 'teal' },
  { label: 'Cases Resolved', value: '1,856', sub: 'Successful outcomes', icon: CheckCircle, color: 'green' },
]

const colorClasses = {
  teal: 'bg-teal-100 text-teal-700',
  amber: 'bg-amber-100 text-amber-800',
  green: 'bg-emerald-100 text-emerald-700',
}

function KpiCard({ label, value, sub, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-3 shadow-sm hover:shadow-md hover:border-gray-300/80 transition-all duration-300 group">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${colorClasses[color]} shadow-inner group-hover:scale-105 transition-transform duration-300`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
      <p className="text-sm font-semibold text-gray-700 mt-0.5">{label}</p>
      <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
    </div>
  )
}

export default function AmuStaffOverview() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-teal-50 border border-teal-200/80 ring-1 ring-teal-200/50 shadow-sm">
        <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600 flex-shrink-0">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <p className="text-sm font-medium text-teal-800">
          Welcome to the AMU Staff dashboard. Use this view to monitor student support metrics and referrals.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CARDS.map((card) => (
          <KpiCard key={card.label} {...card} />
        ))}
      </div>
    </div>
  )
}
