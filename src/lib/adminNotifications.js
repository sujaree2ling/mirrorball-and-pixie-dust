export const ADMIN_NOTIFICATIONS = [
  {
    id: 1,
    author: 'Jacob Lash',
    avatar: '/author-icon.jpg',
    action: 'Commented on your article:',
    articleTitle: 'The Fascinating World of Cats: Why We Love Our Furry Friends',
    excerpt:
      'I loved this article! It really explains why my cat is so independent yet loving. The purring section was super interesting.',
    time: '4 hours ago',
    viewTo: '/post/1',
  },
  {
    id: 2,
    author: 'Jacob Lash',
    avatar: '/author-icon.jpg',
    action: 'liked your article:',
    articleTitle: 'The Fascinating World of Cats: Why We Love Our Furry Friends',
    time: '4 hours ago',
    viewTo: '/post/1',
  },
]

export function getAdminNotifications() {
  return ADMIN_NOTIFICATIONS
}
