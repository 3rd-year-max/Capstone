import { FileText, Download, Calendar, TrendingUp, Users, CheckCircle } from 'lucide-react'

const SUMMARY_ROWS = [
  { period: 'January 2026', referrals: 48, casesOpened: 42, casesClosed: 38, resolutionRate: '90.5%' },
  { period: 'December 2025', referrals: 52, casesOpened: 45, casesClosed: 41, resolutionRate: '91.1%' },
  { period: 'November 2025', referrals: 44, casesOpened: 40, casesClosed: 36, resolutionRate: '90.0%' },
  { period: 'October 2025', referrals: 39, casesOpened: 35, casesClosed: 32, resolutionRate: '91.4%' },
]

export default function AmuStaffReports() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-teal-50 to-teal-50/80 border border-teal-200/80 shadow-sm ring-1 ring-teal-200/50">
        <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600 shadow-inner">
          <FileText className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1">
            <span className="w-0.5 h-3 rounded-full bg-teal-500" />
            Reports &amp; Summary
          </h2>
          <p className="text-[11px] text-gray-600 mt-0.5">Monthly referral and case resolution summaries</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-teal-600 text-white text-[11px] font-semibold hover:bg-teal-700 shadow-sm transition-all"
        >
          <Download className="w-3 h-3" />
          Export report
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        <div className="px-2 py-2 border-b border-gray-200 bg-gray-50/80 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-teal-600" />
          <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider">Monthly summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 border-b border-gray-200">
              <tr>
                <th className="px-2 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Period</th>
                <th className="px-2 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Referrals</th>
                <th className="px-2 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Cases opened</th>
                <th className="px-2 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Cases closed</th>
                <th className="px-2 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Resolution rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {SUMMARY_ROWS.map((row, i) => (
                <tr key={row.period} className="hover:bg-teal-50/50 transition-colors">
                  <td className="px-2 py-1.5 text-[11px] font-medium text-gray-900 flex items-center gap-0.5">
                    <Calendar className="w-2.5 h-2.5 text-gray-400" /> {row.period}
                  </td>
                  <td className="px-2 py-1.5 text-[11px] text-gray-600 flex items-center gap-0.5">
                    <Users className="w-2.5 h-2.5 text-gray-400" /> {row.referrals}
                  </td>
                  <td className="px-2 py-1.5 text-[11px] text-gray-600">{row.casesOpened}</td>
                  <td className="px-2 py-1.5 text-[11px] text-gray-600 flex items-center gap-0.5">
                    <CheckCircle className="w-2.5 h-2.5 text-emerald-500" /> {row.casesClosed}
                  </td>
                  <td className="px-2 py-1.5 text-[11px] font-semibold text-teal-700 flex items-center gap-0.5">
                    <TrendingUp className="w-2.5 h-2.5" /> {row.resolutionRate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
