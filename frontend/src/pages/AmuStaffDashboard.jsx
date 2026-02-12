import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Users as UsersIcon, LayoutDashboard, AlertTriangle, ClipboardList, FileText } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import TutorialModal from '../components/TutorialModal'
import AmuStaffOverview from '../components/amu-staff/AmuStaffOverview'
import {
  hasSeenTutorial,
  setTutorialSeen,
  getPlayTutorialEveryLogin,
  wasTutorialDismissedThisSession,
  setTutorialDismissedThisSession,
} from '../lib/tutorialPrefs'
import { useAuth } from '../context/AuthContext'
import AmuStaffReferrals from '../components/amu-staff/AmuStaffReferrals'
import AmuStaffCases from '../components/amu-staff/AmuStaffCases'
import AmuStaffReports from '../components/amu-staff/AmuStaffReports'

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'referrals', label: 'Referrals', icon: AlertTriangle },
  { id: 'cases', label: 'My Cases', icon: ClipboardList },
  { id: 'reports', label: 'Reports', icon: FileText },
]

export default function AmuStaffDashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [showTutorial, setShowTutorial] = useState(false)

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
      navigate('/amu-staff', { replace: true, state: {} })
    }
  }

  return (
    <DashboardLayout
      title="AMU Staff Dashboard"
      subtitle="Academic support overview"
      icon={UsersIcon}
      variant="amu-staff"
      notificationCount={0}
    >
      {showTutorial && <TutorialModal variant="amu-staff" onClose={handleTutorialClose} />}
      <nav className="flex flex-wrap gap-2 border-b border-gray-200 bg-white/80 -mx-4 px-6 py-3 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-base font-semibold transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === 'overview' && <AmuStaffOverview />}
      {activeTab === 'referrals' && <AmuStaffReferrals />}
      {activeTab === 'cases' && <AmuStaffCases />}
      {activeTab === 'reports' && <AmuStaffReports />}
    </DashboardLayout>
  )
}
