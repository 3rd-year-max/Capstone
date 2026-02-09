import { useState, useEffect } from 'react'
import { FileText, Download, Calendar, Building2, Users, TrendingUp } from 'lucide-react'
import { getAdminReports, getAdminReportDownloadUrl } from '../../api'

const typeIcon = { 'At-Risk': Users, Performance: TrendingUp, AI: TrendingUp, Interventions: Users }
const typeColor = { 'At-Risk': 'bg-amber-100 text-amber-700', Performance: 'bg-blue-100 text-blue-700', AI: 'bg-cyan-100 text-cyan-700', Interventions: 'bg-emerald-100 text-emerald-700' }

export default function AdminInstitutionReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getAdminReports()
      .then(setReports)
      .catch((e) => {
        setError(e?.message || 'Failed to load reports')
        setReports([])
      })
      .finally(() => setLoading(false))
  }, [])

  const handleDownload = (reportId) => {
    const url = getAdminReportDownloadUrl(reportId)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-1.5">
          <div>
            <h2 className="text-xs font-bold text-gray-900 flex items-center gap-1">
              <span className="w-0.5 h-2.5 rounded-full bg-blue-500" />
              Institution Reports
            </h2>
            <p className="text-[10px] text-gray-500 mt-0.5">Generate and download system-wide reports</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 py-8 text-[11px] text-gray-500">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          Loading reports…
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-[11px] text-red-700">
          {error}
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <div>
          <h2 className="text-xs font-bold text-gray-900 flex items-center gap-1">
            <span className="w-0.5 h-2.5 rounded-full bg-blue-500" />
            Institution Reports
          </h2>
          <p className="text-[10px] text-gray-500 mt-0.5">Reports built from current data (instructor departments + system data)</p>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200/80 p-4 text-center text-[11px] text-gray-500">
          No reports available yet. Add instructors with departments to see at-risk and department reports.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
          {reports.map((r) => {
            const Icon = typeIcon[r.type] || FileText
            const canDownload = ['at-risk-summary', 'department-performance', 'interventions'].includes(r.id) || (r.id && r.id.startsWith('at-risk-'))
            return (
              <div key={r.id} className="bg-white rounded-lg border border-gray-200/80 shadow-sm hover:shadow-md transition-all p-2 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-1.5 flex-1 min-w-0">
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 shadow-inner ${typeColor[r.type] || 'bg-gray-100 text-gray-700'}`}>
                      <Icon className="w-3 h-3" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900 text-[11px]">{r.name}</h3>
                      <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${typeColor[r.type] || 'bg-gray-100 text-gray-700'}`}>
                        {r.type}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => canDownload && handleDownload(r.id)}
                    disabled={!canDownload}
                    className="p-1 rounded hover:bg-gray-100 text-gray-600 flex-shrink-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title={canDownload ? 'Download CSV' : 'Download not available'}
                  >
                    <Download className="w-3 h-3" />
                  </button>
                </div>
                <p className="mt-1.5 text-[10px] text-gray-600 line-clamp-2">{r.description}</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5 text-[10px] text-gray-500">
                  <span className="flex items-center gap-0.5">
                    <Calendar className="w-2.5 h-2.5" /> {r.date}
                  </span>
                  {r.department && r.department !== 'N/A' && (
                    <span className="flex items-center gap-0.5">
                      <Building2 className="w-2.5 h-2.5" /> {r.department}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
