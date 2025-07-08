// Dummy data for users, chats, and messages
export const currentUser = {
  id: 'u1',
  name: 'You',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  status: '80% sexy, 20% disgusting',
};

export const users = [
  currentUser,
  {
    id: 'u2',
    name: 'Jotaro',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    status: 'Backrolls?!',
  },
  {
    id: 'u3',
    name: 'Dio',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    status: 'Typing...'
  },
  {
    id: 'u4',
    name: 'Polnareff',
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    status: 'Just now',
  },
];

export const chats = [
  {
    id: 'c1',
    userId: 'u2',
    lastMessage: 'Yare yare daze.',
    lastTimestamp: '2:45',
    unread: 2,
  },
  {
    id: 'c2',
    userId: 'u3',
    lastMessage: 'Za Warudo!',
    lastTimestamp: 'Just now',
    unread: 0,
  },
  {
    id: 'c3',
    userId: 'u4',
    lastMessage: 'I am Polnareff.',
    lastTimestamp: 'Yesterday',
    unread: 1,
  },
];

export const messages = {
  c1: [
    { id: 1, from: 'u2', text: 'Yare yare daze.', time: '2:45' },
    { id: 2, from: 'u1', text: 'Star Platinum!', time: '2:46' },
  ],
  c2: [
    { id: 1, from: 'u3', text: 'Za Warudo!', time: 'Just now' },
    { id: 2, from: 'u1', text: 'No, Dio!', time: 'Just now' },
  ],
  c3: [
    { id: 1, from: 'u4', text: 'I am Polnareff.', time: 'Yesterday' },
    { id: 2, from: 'u1', text: 'Bonjour!', time: 'Yesterday' },
  ],
};
