export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function formatErrorDetail(detail) {
  if (Array.isArray(detail)) {
    return detail.map((d) => d.msg || `${d.loc?.join('.')}: invalid`).join('. ')
  }
  return typeof detail === 'string' ? detail : (detail?.message || 'Request failed')
}

export async function signup({ name, email, password, contact_number, department, role }) {
  const body = {
    name: String(name ?? '').trim(),
    email: String(email ?? '').trim(),
    password: String(password ?? ''),
    contact_number: String(contact_number ?? '').trim(),
    department: String(department ?? '').trim(),
    role: role || 'instructor',
  }
  const res = await fetch(`${API_BASE}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(formatErrorDetail(data.detail) || res.statusText || 'Signup failed')
  }
  return data
}

export async function login({ email, password, role }) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(formatErrorDetail(data.detail) || res.statusText || 'Login failed')
  }
  return data
}

export async function verifyEmail(token) {
  const res = await fetch(`${API_BASE}/api/auth/verify-email?token=${encodeURIComponent(token)}`)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.detail || res.statusText || 'Verification failed')
  }
  return data
}

export async function requestPasswordReset(email) {
  const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: String(email ?? '').trim() }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(formatErrorDetail(data.detail) || res.statusText || 'Request failed')
  }
  return data
}

export async function resetPassword(token, newPassword) {
  const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, new_password: newPassword }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(formatErrorDetail(data.detail) || res.statusText || 'Reset failed')
  }
  return data
}

/** Get a single user by id (any role). */
export async function getUser(userId) {
  const res = await fetch(`${API_BASE}/api/users/${encodeURIComponent(userId)}`)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(formatErrorDetail(data.detail) || res.statusText || 'User not found')
  }
  return data
}

/** List users (all roles or filter by role). Optional search by name/email. */
export async function listUsers(role = 'all', search = '') {
  const params = new URLSearchParams()
  if (role && role !== 'all') params.set('role', role)
  if (search && String(search).trim()) params.set('search', String(search).trim())
  const qs = params.toString()
  const url = `${API_BASE}/api/users${qs ? `?${qs}` : ''}`
  const res = await fetch(url)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(formatErrorDetail(data.detail) || res.statusText || 'Failed to load users')
  }
  return Array.isArray(data) ? data : []
}

export async function updateUser(userId, payload) {
  const res = await fetch(`${API_BASE}/api/users/${encodeURIComponent(userId)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload || {}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(formatErrorDetail(data.detail) || res.statusText || 'Update failed')
  }
  return data
}

export async function listClasses(instructorId) {
  const res = await fetch(`${API_BASE}/api/classes?instructor_id=${encodeURIComponent(instructorId)}`)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(formatErrorDetail(data.detail) || res.statusText || 'Failed to load classes')
  }
  return data
}

export async function getInstructorRiskAlerts(instructorId) {
  const res = await fetch(`${API_BASE}/api/classes/risk-alerts?instructor_id=${encodeURIComponent(instructorId)}`)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(formatErrorDetail(data.detail) || res.statusText || 'Failed to load risk alerts')
  }
  return Array.isArray(data) ? data : []
}

export async function getInstructorStudentList(instructorId) {
  const res = await fetch(`${API_BASE}/api/classes/instructor-students?instructor_id=${encodeURIComponent(instructorId)}`)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(formatErrorDetail(data.detail) || res.statusText || 'Failed to load student list')
  }
  return Array.isArray(data) ? data : []
}

/** List interventions. Pass status or 'all'. Backend may add instructor_id filter later. */
export async function getInstructorInterventions(instructorId, status = 'all') {
  const params = new URLSearchParams()
  if (status && status !== 'all') params.set('status', status)
  const qs = params.toString()
  const url = `${API_BASE}/api/interventions${qs ? `?${qs}` : ''}`
  const res = await fetch(url)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(formatErrorDetail(data.detail) || res.statusText || 'Failed to load interventions')
  }
  return Array.isArray(data) ? data : []
}

/** List all interventions (admin). Optional status: 'all' | 'pending' | 'in-progress' | 'completed'. */
export async function listInterventions(status = 'all') {
  const params = new URLSearchParams()
  if (status && status !== 'all') params.set('status', status)
  const qs = params.toString()
  const url = `${API_BASE}/api/interventions${qs ? `?${qs}` : ''}`
  const res = await fetch(url)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(formatErrorDetail(data.detail) || res.statusText || 'Failed to load interventions')
  }
  return Array.isArray(data) ? data : []
}

/** Get a single intervention by id. */
export async function getIntervention(interventionId) {
  const res = await fetch(`${API_BASE}/api/interventions/${encodeURIComponent(interventionId)}`)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(formatErrorDetail(data.detail) || res.statusText || 'Intervention not found')
  }
  return data
}

export async function getClass(classId) {
  const res = await fetch(`${API_BASE}/api/classes/${encodeURIComponent(classId)}`)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(formatErrorDetail(data.detail) || res.statusText || 'Failed to load class')
  }
  return data
}

export async function listClassStudents(classId) {
  const res = await fetch(`${API_BASE}/api/classes/${encodeURIComponent(classId)}/students`)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(formatErrorDetail(data.detail) || res.statusText || 'Failed to load students')
  }
  return data
}

export async function createClass({ instructor_id, subject_code, subject_name }) {
  const res = await fetch(`${API_BASE}/api/classes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      instructor_id: String(instructor_id ?? '').trim(),
      subject_code: String(subject_code ?? '').trim(),
      subject_name: String(subject_name ?? '').trim(),
    }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(formatErrorDetail(data.detail) || res.statusText || 'Failed to create class')
  }
  return data
}

export async function addStudentToClass(classId, email) {
  const res = await fetch(`${API_BASE}/api/classes/${encodeURIComponent(classId)}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: String(email ?? '').trim() }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(formatErrorDetail(data.detail) || res.statusText || 'Failed to add student')
  }
  return data
}

export async function batchAddStudentsToClass(classId, emails) {
  const list = Array.isArray(emails) ? emails.map((e) => String(e ?? '').trim()).filter(Boolean) : []
  if (list.length === 0) throw new Error('No emails provided')
  const res = await fetch(`${API_BASE}/api/classes/${encodeURIComponent(classId)}/students/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emails: list }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(formatErrorDetail(data.detail) || res.statusText || 'Failed to add students')
  }
  return data
}

export async function getClassRiskSummary(classId) {
  const res = await fetch(`${API_BASE}/api/classes/${encodeURIComponent(classId)}/risk-summary`)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(formatErrorDetail(data.detail) || res.statusText || 'Failed to load risk summary')
  }
  return data
}

export async function updateEnrollment(classId, studentEmail, payload) {
  const emailEnc = encodeURIComponent(studentEmail)
  const res = await fetch(`${API_BASE}/api/classes/${encodeURIComponent(classId)}/students/${emailEnc}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload || {}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(formatErrorDetail(data.detail) || res.statusText || 'Failed to update')
  }
  return data
}

// ----- Admin system overview (real data from DB) -----

/** Departments from instructors only (not admin/amu-staff). */
export async function getAdminInstructorDepartments() {
  const res = await fetch(`${API_BASE}/api/admin/departments`)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(formatErrorDetail(data.detail) || res.statusText || 'Failed to load departments')
  }
  return Array.isArray(data) ? data : []
}

/** KPIs for system overview. department: 'all' or a department name from instructors. */
export async function getAdminOverview(department = 'all') {
  const params = new URLSearchParams()
  if (department && department !== 'all') params.set('department', department)
  const qs = params.toString()
  const url = `${API_BASE}/api/admin/overview${qs ? `?${qs}` : ''}`
  const res = await fetch(url)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(formatErrorDetail(data.detail) || res.statusText || 'Failed to load overview')
  }
  return data
}

/** Students at risk (High/Medium) with department from instructor. */
export async function getAdminStudentsAtRisk(department = 'all') {
  const params = new URLSearchParams()
  if (department && department !== 'all') params.set('department', department)
  const qs = params.toString()
  const url = `${API_BASE}/api/admin/overview/students-at-risk${qs ? `?${qs}` : ''}`
  const res = await fetch(url)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(formatErrorDetail(data.detail) || res.statusText || 'Failed to load students at risk')
  }
  return Array.isArray(data) ? data : []
}

/** Department-level stats (instructor departments only). */
export async function getAdminDepartmentsStats(department = 'all') {
  const params = new URLSearchParams()
  if (department && department !== 'all') params.set('department', department)
  const qs = params.toString()
  const url = `${API_BASE}/api/admin/overview/departments${qs ? `?${qs}` : ''}`
  const res = await fetch(url)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(formatErrorDetail(data.detail) || res.statusText || 'Failed to load department stats')
  }
  return Array.isArray(data) ? data : []
}

/** Instructors with class/student/at-risk counts. Filter by department (instructor's). */
export async function getAdminOverviewInstructors(department = 'all') {
  const params = new URLSearchParams()
  if (department && department !== 'all') params.set('department', department)
  const qs = params.toString()
  const url = `${API_BASE}/api/admin/overview/instructors${qs ? `?${qs}` : ''}`
  const res = await fetch(url)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(formatErrorDetail(data.detail) || res.statusText || 'Failed to load instructors')
  }
  return Array.isArray(data) ? data : []
}

/** Trend data for chart (current snapshot; no historical data in DB). */
export async function getAdminOverviewTrends(department = 'all') {
  const params = new URLSearchParams()
  if (department && department !== 'all') params.set('department', department)
  const qs = params.toString()
  const url = `${API_BASE}/api/admin/overview/trends${qs ? `?${qs}` : ''}`
  const res = await fetch(url)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(formatErrorDetail(data.detail) || res.statusText || 'Failed to load trends')
  }
  return Array.isArray(data) ? data : []
}

// ----- Admin System Analytics (real data) -----

/** At-risk and total by department for bar chart. department: 'all' or instructor department. */
export async function getAdminAnalyticsDepartmentChart(department = 'all') {
  const params = new URLSearchParams()
  if (department && department !== 'all') params.set('department', department)
  const qs = params.toString()
  const url = `${API_BASE}/api/admin/analytics/department-chart${qs ? `?${qs}` : ''}`
  const res = await fetch(url)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(formatErrorDetail(data.detail) || res.statusText || 'Failed to load department chart')
  }
  return Array.isArray(data) ? data : []
}

/** Risk level distribution (High, Medium, Low) for pie chart. */
export async function getAdminAnalyticsRiskDistribution(department = 'all') {
  const params = new URLSearchParams()
  if (department && department !== 'all') params.set('department', department)
  const qs = params.toString()
  const url = `${API_BASE}/api/admin/analytics/risk-distribution${qs ? `?${qs}` : ''}`
  const res = await fetch(url)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(formatErrorDetail(data.detail) || res.statusText || 'Failed to load risk distribution')
  }
  return Array.isArray(data) ? data : []
}

/** AI accuracy over time. Returns [] until AI pipeline stores history. */
export async function getAdminAnalyticsAccuracy() {
  const res = await fetch(`${API_BASE}/api/admin/analytics/accuracy`)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(formatErrorDetail(data.detail) || res.statusText || 'Failed to load accuracy')
  }
  return Array.isArray(data) ? data : []
}

// ----- Admin Institution Reports (real data) -----

/** List available institution reports (from DB: instructor departments + fixed types). */
export async function getAdminReports() {
  const res = await fetch(`${API_BASE}/api/admin/reports`)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(formatErrorDetail(data.detail) || res.statusText || 'Failed to load reports')
  }
  return Array.isArray(data) ? data : []
}

/** URL to download a report as CSV (open in new tab or use as link href). */
export function getAdminReportDownloadUrl(reportId) {
  return `${API_BASE}/api/admin/reports/${encodeURIComponent(reportId)}/download`
}

/** Get student enrollment summary by email (admin). id param from Students at Risk is email. */
export async function getAdminStudentByEmail(studentEmail) {
  const encoded = encodeURIComponent(studentEmail)
  const res = await fetch(`${API_BASE}/api/admin/students/${encoded}`)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(formatErrorDetail(data.detail) || res.statusText || 'Student not found')
  }
  return data
}
