import { useState, useEffect, useCallback } from 'react'
import {
  Shield,
  Users,
  AlertTriangle,
  BookOpen,
  Target,
  Award,
  Activity,
  BarChart3,
  FileText,
  User,
  Zap,
  Building2,
  GraduationCap,
  UsersRound,
  ChevronDown,
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import DashboardLayout from '../components/DashboardLayout'
import AdminSystemAnalytics from '../components/admin/AdminSystemAnalytics'
import AdminInstitutionReports from '../components/admin/AdminInstitutionReports'
import AdminUserAccounts from '../components/admin/AdminUserAccounts'
import AdminPendingAccounts from '../components/admin/AdminPendingAccounts'
import AdminInterventions from '../components/admin/AdminInterventions'
import AdminStudentsAtRisk from '../components/admin/AdminStudentsAtRisk'
import AdminDepartments from '../components/admin/AdminDepartments'
import AdminInstructorsList from '../components/admin/AdminInstructorsList'
import {
  getAdminInstructorDepartments,
  getAdminOverview,
  getAdminOverviewTrends,
} from '../api'

const KPI_CONFIG = [
  { label: 'Total Students', key: 'total_students', sub: 'Across selected departments', icon: Users, color: 'blue', format: (v) => (v != null ? v.toLocaleString() : '—') },
  { label: 'At-Risk Students', key: 'at_risk_students', subKey: 'at_risk_percent', sub: (v, o) => (o?.at_risk_percent != null ? `${o.at_risk_percent}% of total enrollment` : 'Of total enrollment'), icon: AlertTriangle, color: 'orange', valueColor: 'text-orange-600', format: (v) => (v != null ? v.toLocaleString() : '—') },
  { label: 'Instructors', key: 'instructors_count', sub: 'Active (instructor accounts)', icon: BookOpen, color: 'blue', format: (v) => (v != null ? v.toLocaleString() : '—') },
  { label: 'AI Prediction Accuracy', key: null, sub: 'When AI is implemented', icon: Target, color: 'cyan', valueColor: 'text-cyan-600', format: () => '—' },
  { label: 'Intervention Success', key: null, sub: 'When tracking is implemented', icon: Award, color: 'green', valueColor: 'text-emerald-600', format: () => '—' },
  { label: 'Active Alerts', key: 'active_alerts', sub: 'Requiring attention now', icon: Activity, color: 'red', valueColor: 'text-red-600', format: (v) => (v != null ? v.toLocaleString() : '—') },
]

const MAIN_TABS = [
  { id: 'overview', label: 'System Overview', icon: BarChart3 },
  { id: 'pending', label: 'Pending Accounts', icon: User },
  { id: 'analytics', label: 'System Analytics', icon: BarChart3 },
  { id: 'reports', label: 'Institution Reports', icon: FileText },
  { id: 'users', label: 'User Accounts', icon: User },
  { id: 'interventions', label: 'Interventions', icon: Zap },
  // AI Model and AI Performance bypassed until AI is implemented
]

const SUB_TABS = [
  { id: 'at-risk', label: 'Students at Risk', icon: AlertTriangle, active: true },
  { id: 'departments', label: 'Departments', icon: Building2 },
  { id: 'instructors', label: 'Instructors', icon: GraduationCap },
  { id: 'all-instructors', label: 'All Instructors', icon: UsersRound },
]

const colorClasses = {
  blue: 'bg-blue-100 text-blue-700',
  orange: 'bg-amber-100 text-amber-700',
  cyan: 'bg-cyan-100 text-cyan-700',
  green: 'bg-emerald-100 text-emerald-700',
  red: 'bg-red-100 text-red-700',
}

function KpiCard({ label, value, sub, icon: Icon, color, valueColor }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-3 shadow-sm hover:shadow-md hover:border-gray-300/80 transition-all duration-300 group">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${colorClasses[color]} shadow-inner group-hover:scale-105 transition-transform duration-300`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className={`text-lg font-bold tracking-tight ${valueColor || 'text-gray-900'}`}>{value}</p>
      <p className="text-xs font-semibold text-gray-700 mt-0.5">{label}</p>
      <p className="text-[11px] text-gray-500 mt-0.5">{sub}</p>
    </div>
  )
}

export default function AdminDashboard() {
  const [department, setDepartment] = useState('all')
  const [mainTab, setMainTab] = useState('overview')
  const [subTab, setSubTab] = useState('at-risk')
  const [chartMounted, setChartMounted] = useState(false)
  const [departmentsList, setDepartmentsList] = useState([])
  const [overview, setOverview] = useState(null)
  const [overviewLoading, setOverviewLoading] = useState(true)
  const [overviewError, setOverviewError] = useState(null)
  const [trendData, setTrendData] = useState([])

  useEffect(() => setChartMounted(true), [])

  useEffect(() => {
    getAdminInstructorDepartments()
      .then(setDepartmentsList)
      .catch(() => setDepartmentsList([]))
  }, [])

  const fetchOverview = useCallback(async () => {
    setOverviewLoading(true)
    setOverviewError(null)
    try {
      const data = await getAdminOverview(department)
      setOverview(data)
    } catch (e) {
      setOverviewError(e?.message || 'Failed to load overview')
      setOverview(null)
    } finally {
      setOverviewLoading(false)
    }
  }, [department])

  const fetchTrends = useCallback(async () => {
    try {
      const data = await getAdminOverviewTrends(department)
      setTrendData(Array.isArray(data) ? data : [])
    } catch {
      setTrendData([])
    }
  }, [department])

  useEffect(() => {
    if (mainTab === 'overview') {
      fetchOverview()
      fetchTrends()
    }
  }, [mainTab, fetchOverview, fetchTrends])

  const kpiCards = KPI_CONFIG.map((config) => {
    const value = config.key != null && overview ? overview[config.key] : null
    const sub = typeof config.sub === 'function' ? config.sub(value, overview) : (config.subKey && overview ? `${overview[config.subKey]}% of total` : config.sub)
    return {
      label: config.label,
      value: config.format ? config.format(value) : String(value ?? '—'),
      sub,
      icon: config.icon,
      color: config.color,
      valueColor: config.valueColor,
    }
  })

  return (
    <DashboardLayout
      title="Administrator Dashboard"
      subtitle="System Overview & Management"
      icon={Shield}
      variant="admin"
      notificationCount={3}
    >
      <div className="space-y-4">
        {overviewError && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-700">
            {overviewError}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {overviewLoading && !overview ? (
            <>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200/80 p-3 shadow-sm animate-pulse">
                  <div className="w-8 h-8 rounded-lg bg-gray-200 mb-2" />
                  <div className="h-6 w-16 bg-gray-200 rounded mb-1" />
                  <div className="h-4 w-24 bg-gray-100 rounded" />
                </div>
              ))}
            </>
          ) : (
            kpiCards.map((card) => (
              <KpiCard key={card.label} {...card} />
            ))
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="appearance-none pl-3 pr-9 py-2 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-colors"
            >
              <option value="all">All Departments</option>
              {departmentsList.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <nav className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
          {MAIN_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMainTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                mainTab === tab.id ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        {mainTab === 'overview' && (
          <>
            <nav className="flex flex-wrap gap-2 mb-3">
              {SUB_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSubTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    subTab === tab.id ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>

            {subTab === 'at-risk' && <AdminStudentsAtRisk department={department} />}
            {subTab === 'departments' && <AdminDepartments department={department} />}
            {(subTab === 'instructors' || subTab === 'all-instructors') && <AdminInstructorsList department={department} />}

            <section className="mt-4 bg-white rounded-xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50/80">
                  <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                    <span className="w-1 h-4 rounded-full bg-blue-500" />
                    System-Wide Trends
                  </h2>
                  <p className="text-[11px] text-gray-500 mt-0.5">{department === 'all' ? 'All Departments' : department}</p>
                </div>
                <div className="p-3">
                  <div className="h-44 min-h-[176px] w-full">
                    {chartMounted && (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={trendData.length ? trendData : [{ name: '—', atRisk: 0, total: 0, improved: 0 }]} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 10 }} />
                          <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} />
                          <Tooltip
                            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                            formatter={(value) => [value, '']}
                            labelFormatter={(label) => `Month: ${label}`}
                          />
                          <Legend />
                          <Bar dataKey="atRisk" name="At Risk" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="total" name="Total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="improved" name="Improved" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
            </section>
          </>
        )}

        {mainTab === 'pending' && <AdminPendingAccounts />}
        {mainTab === 'analytics' && <AdminSystemAnalytics />}
        {mainTab === 'reports' && <AdminInstitutionReports />}
        {mainTab === 'users' && <AdminUserAccounts />}
        {mainTab === 'interventions' && <AdminInterventions />}
      </div>
    </DashboardLayout>
  )
}
