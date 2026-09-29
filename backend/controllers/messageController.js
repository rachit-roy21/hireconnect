const Message = require('../models/Message');
const User = require('../models/User');
const Notification = require('../models/Notification');

const getConversationId = (id1, id2) => {
  return [id1.toString(), id2.toString()].sort().join('_');
};

exports.sendMessage = async (req, res, next) => {
  try {
    const { recipientId, content } = req.body;

    if (!recipientId || !content) {
      return res.status(400).json({ success: false, message: 'Recipient and message content are required' });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ success: false, message: 'Recipient user not found' });
    }

    const conversationId = getConversationId(req.user.id, recipientId);

    const message = await Message.create({
      sender: req.user.id,
      recipient: recipientId,
      conversationId,
      content,
      isRead: false
    });

    await Notification.create({
      recipient: recipientId,
      title: 'New Message',
      message: `${req.user.name}: "${content.substring(0, 40)}${content.length > 40 ? '...' : ''}"`,
      type: 'message',
      link: `/messages/${req.user.id}`
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name avatar role')
      .populate('recipient', 'name avatar role');

    res.status(201).json({ success: true, message: populatedMessage });
  } catch (error) {
    next(error);
  }
};

exports.getConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }]
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'name avatar role')
      .populate('recipient', 'name avatar role');

    const conversationMap = new Map();

    messages.forEach(msg => {
      const otherUser = msg.sender._id.toString() === userId.toString() ? msg.recipient : msg.sender;
      if (!otherUser) return;
      const otherId = otherUser._id.toString();

      if (!conversationMap.has(otherId)) {
        conversationMap.set(otherId, {
          otherUser,
          lastMessage: msg,
          unreadCount: 0
        });
      }

      if (msg.recipient._id.toString() === userId.toString() && !msg.isRead) {
        const conv = conversationMap.get(otherId);
        conv.unreadCount += 1;
      }
    });

    const conversations = Array.from(conversationMap.values());

    res.status(200).json({ success: true, count: conversations.length, conversations });
  } catch (error) {
    next(error);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const { otherUserId } = req.params;
    const conversationId = getConversationId(req.user.id, otherUserId);

    await Message.updateMany(
      { conversationId, recipient: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .populate('sender', 'name avatar role')
      .populate('recipient', 'name avatar role');

    const otherUser = await User.findById(otherUserId).select('name avatar role email');

    res.status(200).json({ success: true, count: messages.length, messages, otherUser });
  } catch (error) {
    next(error);
  }
};
