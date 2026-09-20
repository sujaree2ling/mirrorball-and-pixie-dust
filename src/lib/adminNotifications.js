import { getNotifications } from '@/api/notificationsApi'

export async function fetchAdminNotifications() {
  return getNotifications()
}

export async function fetchDropdownNotifications() {
  const notifications = await getNotifications()

  return notifications.map((notification) => ({
    id: notification.id,
    author: notification.author,
    avatar: notification.avatar || '/icon.png',
    message: notification.message,
    time: notification.time,
    viewTo: notification.viewTo,
  }))
}
