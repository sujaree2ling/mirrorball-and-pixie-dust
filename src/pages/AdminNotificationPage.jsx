import { Link } from 'react-router-dom'

import { AdminPanelLayout } from '@/components/AdminPanelLayout'
import { getAdminNotifications } from '@/lib/adminNotifications'

export function AdminNotificationPage() {
  const notifications = getAdminNotifications()

  return (
    <AdminPanelLayout
      title="Notification"
      activePage="/admin/notification"
      contentClassName="px-0 py-0 lg:px-0 lg:pt-0"
    >
      <ul>
        {notifications.map((notification) => (
          <li
            key={notification.id}
            className="flex items-start justify-between gap-8 border-b border-[#DAD6D1] px-6 py-8 lg:px-12"
          >
            <div className="flex min-w-0 flex-1 items-start gap-4">
              <img
                src={notification.avatar}
                alt={notification.author}
                className="mt-0.5 h-10 w-10 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="text-[14px] leading-relaxed text-[#26231E]">
                  <span className="font-semibold">{notification.author}</span>{' '}
                  {notification.action}{' '}
                  <span className="font-semibold">{notification.articleTitle}</span>
                </p>

                {notification.excerpt && (
                  <p className="mt-3 text-[14px] leading-relaxed text-[#26231E]">
                    &ldquo;{notification.excerpt}&rdquo;
                  </p>
                )}

                <p className="mt-3 text-[13px] text-[#F2B68C]">{notification.time}</p>
              </div>
            </div>

            <Link
              to={notification.viewTo}
              className="shrink-0 text-[14px] text-[#26231E] underline underline-offset-2"
            >
              View
            </Link>
          </li>
        ))}
      </ul>
    </AdminPanelLayout>
  )
}
