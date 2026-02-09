import { createContext, useContext, useReducer, useMemo } from 'react'

const INITIAL = {
  instructor: [
    { id: 1, title: 'New at-risk alerts in CS 201', body: '3 students are showing early warning signs. Review class and consider interventions.', type: 'alert', time: '2 hours ago', read: false },
    { id: 2, title: 'Intervention completed', body: 'Jordan Lee (CS 202) — 1:1 meeting logged. Status updated to improved.', type: 'success', time: '5 hours ago', read: true },
    { id: 3, title: 'CS 201 section roster updated', body: '2 students added to Section A. Sync your risk view.', type: 'class', time: '1 day ago', read: true },
    { id: 4, title: 'Weekly class summary ready', body: 'CS 201, CS 202, CS 301 — at-risk counts and attendance summary available.', type: 'report', time: '1 day ago', read: false },
    { id: 5, title: 'Reminder: Pending interventions', body: 'You have 4 pending interventions due this week.', type: 'alert', time: '2 days ago', read: true },
  ],
  admin: [
    { id: 1, title: '8 new at-risk alerts', body: 'Students require immediate intervention based on AI predictions.', type: 'alert', time: '2 hours ago', read: false },
    { id: 2, title: 'Intervention completed', body: 'Jordan Lee (CS 202) — status updated to improved after 1:1 meeting.', type: 'success', time: '5 hours ago', read: true },
    { id: 3, title: 'Model retrain completed', body: 'XGBoost early warning model retrained successfully. Accuracy: 87.3%.', type: 'system', time: '1 day ago', read: true },
    { id: 4, title: 'Weekly report ready', body: 'Semester At-Risk Summary report is ready for download.', type: 'report', time: '1 day ago', read: false },
    { id: 5, title: 'New instructor onboarded', body: 'Dr. Emily Davis has been added to the Mathematics department.', type: 'system', time: '2 days ago', read: true },
  ],
  'amu-staff': [
    { id: 1, title: 'New referral: Alex Chen', body: 'Referred by Dr. Sarah Johnson (CS 201). High risk. Assign case or review.', type: 'alert', time: '2 hours ago', read: false },
    { id: 2, title: 'Case completed', body: 'Jordan Lee — Study skills workshop marked complete. Outcome logged.', type: 'success', time: '5 hours ago', read: true },
    { id: 3, title: 'Case due tomorrow', body: 'Sam Rivera — 1:1 academic coaching due Feb 5. Reminder.', type: 'case', time: '1 day ago', read: false },
    { id: 4, title: 'Weekly referral summary', body: '12 new referrals this week. 8 assigned, 4 pending assignment.', type: 'report', time: '1 day ago', read: true },
    { id: 5, title: 'Taylor Brooks — Tutoring confirmed', body: 'Tutoring center confirmed session for Feb 4.', type: 'success', time: '2 days ago', read: true },
  ],
}

function notificationsReducer(state, action) {
  const { role, id } = action
  const list = state[role] || []
  switch (action.type) {
    case 'MARK_READ':
      return {
        ...state,
        [role]: list.map((n) => (n.id === id ? { ...n, read: true } : n)),
      }
    case 'MARK_ALL_READ':
      return {
        ...state,
        [role]: list.map((n) => ({ ...n, read: true })),
      }
    default:
      return state
  }
}

const NotificationsContext = createContext(null)

export function NotificationsProvider({ children }) {
  const [notifications, dispatch] = useReducer(notificationsReducer, INITIAL)

  const api = useMemo(
    () => ({
      getNotifications(role) {
        return notifications[role] || []
      },
      getUnreadCount(role) {
        const list = notifications[role] || []
        return list.filter((n) => !n.read).length
      },
      markAsRead(role, id) {
        dispatch({ type: 'MARK_READ', role, id })
      },
      markAllAsRead(role) {
        dispatch({ type: 'MARK_ALL_READ', role })
      },
    }),
    [notifications]
  )

  return (
    <NotificationsContext.Provider value={api}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext)
  return ctx
}
