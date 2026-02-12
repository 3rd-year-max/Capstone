import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  BookOpen,
  Bell,
  Users,
  ClipboardList,
  Users as UsersIcon,
  AlertTriangle,
  ChevronRight,
  Plus,
  Search,
  GraduationCap,
} from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import TutorialModal from '../components/TutorialModal'
import InstructorRiskAlerts from '../components/instructor/InstructorRiskAlerts'
import {
  hasSeenTutorial,
  setTutorialSeen,
  getPlayTutorialEveryLogin,
  wasTutorialDismissedThisSession,
  setTutorialDismissedThisSession,
} from '../lib/tutorialPrefs'
import InstructorStudentList from '../components/instructor/InstructorStudentList'
import InstructorInterventions from '../components/instructor/InstructorInterventions'
import { useAuth } from '../context/AuthContext'
import { listClasses, createClass } from '../api'

const TABS = [
  { id: 'classes', label: 'My Classes', icon: BookOpen },
  { id: 'alerts', label: 'Risk Alerts', icon: Bell },
  { id: 'students', label: 'Student List', icon: Users },
]

const colorClasses = {
  gray: 'bg-gray-100 text-gray-700',
  amber: 'bg-amber-100 text-amber-800',
}

function CourseCard({ course, onViewDetails }) {
  const atRisk = course.at_risk_count ?? 0
  return (
    <div className="group bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-200/80 transition-all duration-200 overflow-hidden border-l-4 border-l-blue-500 hover:-translate-y-0.5">
      <div className="p-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 text-sm truncate">
                {course.subject_code}: {course.subject_name}
              </h3>
              <div className="flex flex-wrap gap-1 mt-0.5">
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-medium">
                  <UsersIcon className="w-3 h-3 text-slate-500" />
                  {course.student_count} student{course.student_count !== 1 ? 's' : ''}
                </span>
                {atRisk > 0 && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[11px] font-semibold">
                    <AlertTriangle className="w-3 h-3" />
                    {atRisk} at risk
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onViewDetails(course)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-sm text-xs flex-shrink-0 transition-colors"
          >
            View class
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function InstructorDashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [showTutorial, setShowTutorial] = useState(false)
  // Landing page is My Classes (overview page was removed)
  const [activeTab, setActiveTab] = useState('classes')
  const [classesList, setClassesList] = useState([])
  const [classesLoading, setClassesLoading] = useState(false)
  const [classesError, setClassesError] = useState('')
  const [showAddClassModal, setShowAddClassModal] = useState(false)
  const [addClassCode, setAddClassCode] = useState('')
  const [addClassName, setAddClassName] = useState('')
  const [addClassSubmitting, setAddClassSubmitting] = useState(false)
  const [addClassError, setAddClassError] = useState('')
  const [classSearch, setClassSearch] = useState('')

  const fetchClasses = useCallback(async () => {
    if (!user?.id) return
    setClassesLoading(true)
    setClassesError('')
    try {
      const data = await listClasses(user.id)
      setClassesList(Array.isArray(data) ? data : [])
    } catch (err) {
      setClassesError(err.message || 'Failed to load classes')
      setClassesList([])
    } finally {
      setClassesLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    if (activeTab === 'classes' && user?.id) {
      fetchClasses()
    }
  }, [activeTab, user?.id, fetchClasses])

  useEffect(() => {
    if (!user?.id) return
    const fromSettings = location.state?.showTutorial
    const playEvery = getPlayTutorialEveryLogin(user.id)
    const dismissedThisSession = wasTutorialDismissedThisSession()
    const seen = hasSeenTutorial(user.id)
    if (fromSettings || (playEvery && !dismissedThisSession) || (!playEvery && !seen)) {
      setShowTutorial(true)
    }
  }, [user?.id, location.state?.showTutorial])

  const handleTutorialClose = () => {
    if (user?.id) {
      if (getPlayTutorialEveryLogin(user.id)) {
        setTutorialDismissedThisSession()
      } else {
        setTutorialSeen(user.id)
      }
    }
    setShowTutorial(false)
    if (location.state?.showTutorial) {
      navigate('/instructor', { replace: true, state: {} })
    }
  }

  const handleCreateClass = async (e) => {
    e.preventDefault()
    setAddClassError('')
    const code = addClassCode.trim()
    const name = addClassName.trim()
    if (!code || !name) {
      setAddClassError('Subject code and subject name are required.')
      return
    }
    setAddClassSubmitting(true)
    try {
      await createClass({ instructor_id: user.id, subject_code: code, subject_name: name })
      setAddClassCode('')
      setAddClassName('')
      setShowAddClassModal(false)
      fetchClasses()
    } catch (err) {
      setAddClassError(err.message || 'Failed to create class')
    } finally {
      setAddClassSubmitting(false)
    }
  }

  const totalStudents = classesList.reduce((sum, c) => sum + (c.student_count || 0), 0)
  const totalAtRisk = classesList.reduce((sum, c) => sum + (c.at_risk_count || 0), 0)
  const searchLower = classSearch.trim().toLowerCase()
  const filteredClasses = searchLower
    ? classesList.filter(
        (c) =>
          (c.subject_code || '').toLowerCase().includes(searchLower) ||
          (c.subject_name || '').toLowerCase().includes(searchLower)
      )
    : classesList

  return (
    <DashboardLayout
      title="Instructor Dashboard"
      subtitle={user ? [user.name, user.department].filter(Boolean).join(' - ') || 'Instructor' : 'Instructor'}
      notificationCount={3}
    >
      {showTutorial && <TutorialModal variant="instructor" onClose={handleTutorialClose} />}
      {/* Page selection at top of content, below header */}
      <nav className="flex flex-wrap gap-1 p-1 mb-5 rounded-xl bg-slate-100/80 border border-slate-200/60 shadow-inner w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white text-blue-700 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
            {tab.badge != null && (
              <span className="ml-0.5 px-1 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setActiveTab('interventions')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${activeTab === 'interventions' ? 'bg-white text-blue-700 shadow-sm border border-slate-200/80' : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'}`}
        >
          <ClipboardList className="w-3.5 h-3.5" />
          Interventions
        </button>
      </nav>

      <div className="space-y-5">
        {activeTab === 'classes' && (
          <>
            {/* Hero for My Classes */}
            <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-4 py-3.5 text-white shadow-md">
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold tracking-tight">My Classes</h2>
                  <p className="mt-0.5 text-blue-100 text-xs max-w-md">
                    Manage courses, rosters, and at-risk students.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(true)}
                  className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-sm hover:bg-blue-50 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Class
                </button>
              </div>
              <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent pointer-events-none" aria-hidden />
            </section>

            {classesLoading && (
              <div className="flex items-center gap-2 py-6 text-slate-500 rounded-xl bg-white border border-slate-200/80 shadow-sm justify-center">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Loading classes…</span>
              </div>
            )}
            {classesError && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-700">
                {classesError}
              </div>
            )}
            {!classesLoading && !classesError && classesList.length > 0 && (
              <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl bg-white border border-slate-200/80 p-3 shadow-sm flex items-center gap-3 ring-1 ring-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">{classesList.length}</p>
                    <p className="text-xs font-medium text-slate-500">Classes</p>
                  </div>
                </div>
                <div className="rounded-xl bg-white border border-slate-200/80 p-3 shadow-sm flex items-center gap-3 ring-1 ring-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                    <UsersIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">{totalStudents}</p>
                    <p className="text-xs font-medium text-slate-500">Total students</p>
                  </div>
                </div>
                <div className="rounded-xl bg-white border border-slate-200/80 p-3 shadow-sm flex items-center gap-3 ring-1 ring-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">{totalAtRisk}</p>
                    <p className="text-xs font-medium text-slate-500">At-risk students</p>
                  </div>
                </div>
              </section>
            )}

            {!classesLoading && !classesError && classesList.length > 0 && (
              <div className="mb-1">
                <label className="sr-only" htmlFor="class-search">Search classes</label>
                <div className="relative max-w-xs">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    id="class-search"
                    type="text"
                    value={classSearch}
                    onChange={(e) => setClassSearch(e.target.value)}
                    placeholder="Search by code or name…"
                    className="w-full pl-8 pr-2.5 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2.5">
              {!classesLoading && !classesError && filteredClasses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onViewDetails={(c) => navigate(`/instructor/class/${c.id}`)}
                />
              ))}
              {!classesLoading && !classesError && classesList.length > 0 && filteredClasses.length === 0 && (
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-6 text-center">
                  <Search className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-700">No classes match your search.</p>
                  <p className="text-xs text-slate-500 mt-0.5">Try a different code or name.</p>
                  <button
                    type="button"
                    onClick={() => setClassSearch('')}
                    className="mt-3 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50 border border-blue-200/60"
                  >
                    Clear search
                  </button>
                </div>
              )}
              {!classesLoading && !classesError && classesList.length === 0 && (
                <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-8 text-center">
                  <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 mx-auto mb-3">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">No classes yet</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Create your first class to start managing students and tracking at-risk alerts.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowAddClassModal(true)}
                    className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition"
                  >
                    <Plus className="w-4 h-4" />
                    Add your first class
                  </button>
                </div>
              )}
            </div>

            {/* Add Class Modal */}
            {showAddClassModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={() => !addClassSubmitting && setShowAddClassModal(false)}>
                <div className="bg-white rounded-xl shadow-2xl border border-slate-200/80 max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Add Class</h3>
                  <form onSubmit={handleCreateClass} className="space-y-4">
                    {addClassError && (
                      <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-xs text-red-700">{addClassError}</div>
                    )}
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">Subject Code</label>
                      <input
                        type="text"
                        value={addClassCode}
                        onChange={(e) => setAddClassCode(e.target.value)}
                        placeholder="e.g. CS 201"
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">Subject Name</label>
                      <input
                        type="text"
                        value={addClassName}
                        onChange={(e) => setAddClassName(e.target.value)}
                        placeholder="e.g. Data Structures & Algorithms"
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div className="flex gap-2 justify-end pt-2">
                      <button type="button" onClick={() => setShowAddClassModal(false)} disabled={addClassSubmitting} className="px-4 py-2 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-50">Cancel</button>
                      <button type="submit" disabled={addClassSubmitting} className="px-4 py-2 rounded-lg text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">{addClassSubmitting ? 'Creating…' : 'Add Class'}</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'alerts' && <InstructorRiskAlerts />}
        {activeTab === 'students' && <InstructorStudentList />}
        {activeTab === 'interventions' && <InstructorInterventions />}
      </div>
    </DashboardLayout>
  )
}
