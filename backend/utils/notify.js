const Notification = require('../models/Notification');

const createNotification = async ({ recipient, title, message, type = 'system', link = '' }) => {
  if (!recipient) return null;
  return Notification.create({ recipient, title, message, type, link });
};

module.exports = { createNotification };
