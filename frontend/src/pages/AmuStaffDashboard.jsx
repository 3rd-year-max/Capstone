import { useState } from 'react'
import { Users as UsersIcon, LayoutDashboard, AlertTriangle, ClipboardList, FileText } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import AmuStaffOverview from '../components/amu-staff/AmuStaffOverview'
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
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <DashboardLayout
      title="AMU Staff Dashboard"
      subtitle="Academic support overview"
      icon={UsersIcon}
      variant="amu-staff"
      notificationCount={0}
    >
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
