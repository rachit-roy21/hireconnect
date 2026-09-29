import API from './api';

export const messageService = {
  sendMessage: (data) => API.post('/messages', data),
  getConversations: () => API.get('/messages/conversations'),
  getMessages: (otherUserId) => API.get(`/messages/${otherUserId}`)
};
