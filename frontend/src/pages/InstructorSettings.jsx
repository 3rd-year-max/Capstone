import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Lock, Save, CheckCircle, Mail, KeyRound, GraduationCap, ArrowLeft, Phone, Building2 } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { useAuth } from '../context/AuthContext'
import { updateUser as updateUserApi } from '../api'

const labelClass = 'block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1'
const inputClass =
  'w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-slate-900 placeholder:text-slate-400'

export default function InstructorSettings() {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [profileError, setProfileError] = useState('')

  useEffect(() => {
    if (user) {
      setName(user.name ?? '')
      setEmail(user.email ?? '')
      setContactNumber(user.contact_number ?? '')
    }
  }, [user])

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setProfileError('')
    setSaving(true)
    setSaved(false)
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    if (!trimmedName || !trimmedEmail) {
      setProfileError('Name and email are required.')
      setSaving(false)
      return
    }
    try {
      await updateUserApi(user.id, { name: trimmedName, email: trimmedEmail, contact_number: contactNumber.trim() })
      updateUser({ name: trimmedName, email: trimmedEmail, contact_number: contactNumber.trim() })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setProfileError(err.message || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const handleGoToForgotPassword = () => {
    navigate('/forgot-password')
  }

  if (!user) {
    return (
      <DashboardLayout
        title="Instructor Dashboard"
        subtitle="Settings"
        icon={GraduationCap}
        variant="instructor"
      >
        <div className="max-w-2xl mx-auto px-4 py-8 text-center text-slate-500">
          Loading…
        </div>
      </DashboardLayout>
    )
  }

  const subtitle = [user.name, user.department].filter(Boolean).join(' - ') || 'Instructor'

  return (
    <DashboardLayout
      title="Instructor Dashboard"
      subtitle={subtitle}
      icon={GraduationCap}
      variant="instructor"
    >
      <div className="space-y-5 w-full">
        <button
          type="button"
          onClick={() => navigate('/instructor')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg transition-colors -ml-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to dashboard
        </button>
        <div className="max-w-xl mx-auto space-y-5 w-full px-4 sm:px-0">
        <div className="text-center pb-1">
          <h2 className="text-lg font-bold text-slate-900 flex items-center justify-center gap-1.5">
            <span className="w-1 h-5 rounded-full bg-blue-500" />
            Settings
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage your profile and account security.
          </p>
        </div>

        {/* Profile – blue accent */}
        <section className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden border-l-4 border-l-blue-500">
          <div className="px-4 py-2.5 border-b border-slate-200 bg-slate-50/60 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
              <User className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Profile
            </h3>
          </div>
          <form onSubmit={handleSaveProfile} className="p-4 space-y-3">
            <p className="text-xs text-slate-500 -mt-0.5 mb-2">
              Your name, email, and contact number. Department was set at signup and cannot be changed here.
            </p>
            {profileError && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
                {profileError}
              </div>
            )}
            <div>
              <label className={labelClass}>Display name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@university.edu"
                  className={`${inputClass} pl-9`}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Contact number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className={`${inputClass} pl-9`}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Department</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={user.department ?? ''}
                  readOnly
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm bg-slate-50 text-slate-600"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Set during signup and cannot be changed here.
              </p>
            </div>
            <div className="pt-1">
              <button
                type="submit"
                disabled={saving}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors ${
                  saved
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
                }`}
              >
                {saved ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    Saved
                  </>
                ) : saving ? (
                  'Saving…'
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    Save profile
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Security – red accent */}
        <section className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden border-l-4 border-l-red-500">
          <div className="px-4 py-2.5 border-b border-slate-200 bg-red-50/50 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Change password
            </h3>
          </div>
          <div className="p-4 space-y-3">
            <p className="text-xs text-slate-500">
              To change your password, we send a secure link to your email. You’ll set a new
              password from that link.
            </p>
            <button
              type="button"
              onClick={handleGoToForgotPassword}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200/80 transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5" />
              Send password reset link
            </button>
          </div>
        </section>
        </div>
      </div>
    </DashboardLayout>
  )
}
