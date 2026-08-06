export const ADMIN_NOTIFICATIONS = [
  {
    id: 1,
    author: 'Jacob Lash',
    avatar: '/icon.png',
    action: 'Commented on your article:',
    articleTitle: "How Taylor Swift's folklore Turned Isolation into Art",
    excerpt:
      'This piece captures the quiet mood of folklore so well. The section about gray emotions really stuck with me.',
    time: '4 hours ago',
    viewTo: '/post/1',
  },
  {
    id: 2,
    author: 'Jacob Lash',
    avatar: '/icon.png',
    action: 'liked your article:',
    articleTitle: "Up: The Beautiful Truth About Life's Real Adventures",
    time: '4 hours ago',
    viewTo: '/post/12',
  },
]

export function getAdminNotifications() {
  return ADMIN_NOTIFICATIONS
}
