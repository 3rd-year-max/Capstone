import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  BookOpen,
  Users,
  Mail,
  UserPlus,
  Upload,
  BarChart3,
  Flag,
  TrendingUp,
} from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { useAuth } from '../context/AuthContext'
import {
  getClass,
  listClassStudents,
  addStudentToClass,
  batchAddStudentsToClass,
  getClassRiskSummary,
  updateEnrollment,
} from '../api'

const RISK_CLASS = {
  High: 'bg-red-100 text-red-800',
  Medium: 'bg-amber-100 text-amber-800',
  Low: 'bg-slate-100 text-slate-700',
}

export default function ClassDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const classId = id
  const instructorSubtitle = user ? [user.name, user.department].filter(Boolean).join(' - ') || 'Instructor' : 'Instructor'

  const [classData, setClassData] = useState(null)
  const [classLoading, setClassLoading] = useState(true)
  const [classError, setClassError] = useState('')
  const [roster, setRoster] = useState([])
  const [rosterLoading, setRosterLoading] = useState(true)
  const [rosterError, setRosterError] = useState('')
  const [riskSummary, setRiskSummary] = useState(null)
  const [riskSummaryLoading, setRiskSummaryLoading] = useState(false)

  const [showAddStudentsModal, setShowAddStudentsModal] = useState(false)
  const [addStudentEmail, setAddStudentEmail] = useState('')
  const [addStudentSubmitting, setAddStudentSubmitting] = useState(false)
  const [addStudentError, setAddStudentError] = useState('')

  const [showBatchModal, setShowBatchModal] = useState(false)
  const [batchEmails, setBatchEmails] = useState('')
  const [batchSubmitting, setBatchSubmitting] = useState(false)
  const [batchError, setBatchError] = useState('')

  const [flagLoading, setFlagLoading] = useState(null)

  const fetchClass = useCallback(async () => {
    if (!classId) return
    setClassLoading(true)
    setClassError('')
    try {
      const data = await getClass(classId)
      setClassData(data)
    } catch (err) {
      setClassError(err.message || 'Failed to load class')
      setClassData(null)
    } finally {
      setClassLoading(false)
    }
  }, [classId])

  const fetchRoster = useCallback(async () => {
    if (!classId) return
    setRosterLoading(true)
    setRosterError('')
    try {
      const data = await listClassStudents(classId)
      setRoster(Array.isArray(data) ? data : [])
    } catch (err) {
      setRosterError(err.message || 'Failed to load students')
      setRoster([])
    } finally {
      setRosterLoading(false)
    }
  }, [classId])

  const fetchRiskSummary = useCallback(async () => {
    if (!classId) return
    setRiskSummaryLoading(true)
    try {
      const data = await getClassRiskSummary(classId)
      setRiskSummary(data)
    } catch {
      setRiskSummary(null)
    } finally {
      setRiskSummaryLoading(false)
    }
  }, [classId])

  useEffect(() => {
    fetchClass()
  }, [fetchClass])

  useEffect(() => {
    fetchRoster()
  }, [fetchRoster])

  useEffect(() => {
    fetchRiskSummary()
  }, [fetchRiskSummary])

  const handleAddStudent = async (e) => {
    e.preventDefault()
    setAddStudentError('')
    const email = addStudentEmail.trim()
    if (!email) {
      setAddStudentError('Please enter the student\'s email.')
      return
    }
    setAddStudentSubmitting(true)
    try {
      await addStudentToClass(classId, email)
      setAddStudentEmail('')
      setShowAddStudentsModal(false)
      fetchClass()
      fetchRoster()
      fetchRiskSummary()
    } catch (err) {
      setAddStudentError(err.message || 'Failed to add student')
    } finally {
      setAddStudentSubmitting(false)
    }
  }

  const handleBatchAdd = async (e) => {
    e.preventDefault()
    setBatchError('')
    const lines = batchEmails.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean)
    if (lines.length === 0) {
      setBatchError('Enter at least one email (one per line or comma-separated).')
      return
    }
    setBatchSubmitting(true)
    try {
      await batchAddStudentsToClass(classId, lines)
      setBatchEmails('')
      setShowBatchModal(false)
      fetchClass()
      fetchRoster()
      fetchRiskSummary()
    } catch (err) {
      setBatchError(err.message || 'Failed to add students')
    } finally {
      setBatchSubmitting(false)
    }
  }

  const handleToggleFlag = async (studentEmail, current) => {
    setFlagLoading(studentEmail)
    try {
      await updateEnrollment(classId, studentEmail, { flagged_for_mentoring: !current })
      fetchRoster()
    } finally {
      setFlagLoading(null)
    }
  }

  if (classLoading && !classData) {
    return (
      <DashboardLayout
        title="Instructor Dashboard"
        subtitle={instructorSubtitle}
        notificationCount={3}
      >
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => navigate('/instructor')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to My Classes
          </button>
          <p className="text-base text-gray-500 py-8">Loading class…</p>
        </div>
      </DashboardLayout>
    )
  }

  if (classError && !classData) {
    return (
      <DashboardLayout
        title="Instructor Dashboard"
        subtitle={instructorSubtitle}
        notificationCount={3}
      >
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => navigate('/instructor')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Classes
          </button>
          <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-sm text-red-700">
            {classError}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const course = classData || {}
  const subjectCode = course.subject_code ?? ''
  const subjectName = course.subject_name ?? ''
  const studentCount = course.student_count ?? 0

  return (
    <DashboardLayout
      title="Instructor Dashboard"
      subtitle={instructorSubtitle}
      notificationCount={3}
    >
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate('/instructor')}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Classes
        </button>

        {/* Class hero */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-6 py-6 text-white shadow-lg overflow-hidden relative">
          <div className="relative z-10 flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">
                  {subjectCode}: {subjectName}
                </h1>
                <p className="text-blue-100 text-sm mt-0.5">{studentCount} student{studentCount !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setShowAddStudentsModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-blue-700 text-xs font-semibold hover:bg-blue-50 shadow-md transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Add Students
              </button>
              <button
                type="button"
                onClick={() => { setBatchEmails(''); setShowBatchModal(true) }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/20 text-white border border-white/40 text-xs font-semibold hover:bg-white/30 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload batch
              </button>
            </div>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent pointer-events-none" aria-hidden />
        </div>

        {/* Class-level risk summary */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden p-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-3">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            Class risk summary
          </h2>
            {riskSummaryLoading ? (
              <p className="text-xs text-slate-500">Loading…</p>
            ) : riskSummary ? (
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <span className="text-xs font-medium text-slate-500">Total</span>
                  <span className="text-base font-bold text-slate-900">{riskSummary.total}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200/80">
                  <span className="text-xs font-medium text-red-700">High risk</span>
                  <span className="text-base font-bold text-red-800">{riskSummary.high_risk}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200/80">
                  <span className="text-xs font-medium text-amber-700">Medium risk</span>
                  <span className="text-base font-bold text-amber-800">{riskSummary.medium_risk}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200/80">
                  <span className="text-xs font-medium text-slate-600">Low risk</span>
                  <span className="text-base font-bold text-slate-800">{riskSummary.low_risk}</span>
                </div>
                {riskSummary.at_risk_list && riskSummary.at_risk_list.length > 0 && (
                  <div className="w-full mt-1.5 pt-3 border-t border-slate-200">
                    <p className="text-xs font-semibold text-slate-700 mb-1.5">At-risk students</p>
                    <div className="flex flex-wrap gap-1.5">
                      {riskSummary.at_risk_list.map((s) => (
                        <span
                          key={s.student_email}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${RISK_CLASS[s.risk] || 'bg-slate-100 text-slate-700'}`}
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                          {s.student_email}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500">Risk is computed in the background; the summary will appear when data is available.</p>
            )}
        </div>

        {/* Class roster */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/60">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-1 h-3.5 rounded-full bg-blue-500" />
              Class roster
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Risk is computed automatically. You can flag students for mentoring.</p>
          </div>
          {rosterLoading ? (
            <div className="p-6 text-center text-sm text-slate-500 flex items-center justify-center gap-2">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              Loading roster…
            </div>
          ) : rosterError ? (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 mx-4 my-3 text-sm text-red-700">
              {rosterError}
            </div>
          ) : roster.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500">
              No students enrolled yet. Click &quot;Add Students&quot; or &quot;Upload batch&quot; to add students to this class.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Student email</th>
                    <th className="px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">GPA</th>
                    <th className="px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Attendance %</th>
                    <th className="px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">LMS %</th>
                    <th className="px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Risk</th>
                    <th className="px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Mentoring</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {roster.map((row, index) => (
                    <tr key={row.student_email ?? index} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-2.5">
                        <span className="flex items-center gap-1.5 text-sm text-slate-900">
                          <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          {row.student_email}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-sm text-slate-700">{row.gpa != null ? row.gpa : '—'}</td>
                      <td className="px-4 py-2.5 text-sm text-slate-700">{row.attendance != null ? `${row.attendance}%` : '—'}</td>
                      <td className="px-4 py-2.5 text-sm text-slate-700">{row.lms_activity != null ? `${row.lms_activity}%` : '—'}</td>
                      <td className="px-4 py-2.5">
                        {row.risk ? (
                          <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-semibold ${RISK_CLASS[row.risk] || ''}`}>
                            {row.risk}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        <button
                          type="button"
                          onClick={() => handleToggleFlag(row.student_email, row.flagged_for_mentoring)}
                          disabled={flagLoading === row.student_email}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold transition-colors disabled:opacity-50 ${
                            row.flagged_for_mentoring
                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <Flag className="w-3.5 h-3.5" />
                          {row.flagged_for_mentoring ? 'Flagged' : 'Flag'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Students Modal */}
        {showAddStudentsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={() => !addStudentSubmitting && setShowAddStudentsModal(false)}>
            <div className="bg-white rounded-xl shadow-2xl border border-slate-200/80 max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-slate-900 mb-4">Add Student to this Class</h3>
              <p className="text-sm text-slate-500 mb-3">
                Add a student to <span className="font-semibold text-slate-700">{subjectCode}: {subjectName}</span> by entering their email.
              </p>
              <form onSubmit={handleAddStudent} className="space-y-4">
                {addStudentError && (
                  <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-xs text-red-700">{addStudentError}</div>
                )}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Student&apos;s Email</label>
                  <input
                    type="email"
                    value={addStudentEmail}
                    onChange={(e) => setAddStudentEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button type="button" onClick={() => setShowAddStudentsModal(false)} disabled={addStudentSubmitting} className="px-4 py-2 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-50">Cancel</button>
                  <button type="submit" disabled={addStudentSubmitting} className="px-4 py-2 rounded-lg text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">{addStudentSubmitting ? 'Adding…' : 'Add Student'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Batch upload modal */}
        {showBatchModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={() => !batchSubmitting && setShowBatchModal(false)}>
            <div className="bg-white rounded-xl shadow-2xl border border-slate-200/80 max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-slate-900 mb-4">Upload batch of students</h3>
              <p className="text-sm text-slate-500 mb-3">
                Add multiple students by entering one email per line, or comma/semicolon-separated. Duplicates in this class will be skipped.
              </p>
              <form onSubmit={handleBatchAdd} className="space-y-4">
                {batchError && (
                  <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-xs text-red-700">{batchError}</div>
                )}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Emails</label>
                  <textarea
                    value={batchEmails}
                    onChange={(e) => setBatchEmails(e.target.value)}
                    placeholder={"student1@university.edu\nstudent2@university.edu"}
                    rows={5}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-y"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button type="button" onClick={() => setShowBatchModal(false)} disabled={batchSubmitting} className="px-4 py-2 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-50">Cancel</button>
                  <button type="submit" disabled={batchSubmitting} className="px-4 py-2 rounded-lg text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">{batchSubmitting ? 'Adding…' : 'Add students'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}
