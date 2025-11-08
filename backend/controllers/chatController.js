import Chat from '../models/ChatSchema.js';
import User from '../models/UserSchema.js';

// Return list of chats. Optionally filter by student id via query param ?student=<id>
export const getChats = async (req, res) => {
  try {
    const filter = {};
    if (req.query.student) filter.student = req.query.student;
    if (req.query.teacher) filter.teachers = req.query.teacher;

    const chats = await Chat.find(filter).sort({ updatedAt: -1 }).populate('student teachers', 'name email typeOfUser');
    return res.json(chats);
  } catch (err) {
    console.error('getChats error', err);
    return res.status(500).json({ message: 'Failed to fetch chats' });
  }
};

export const createChat = async (req, res) => {
  try {
    let { chatName, student, teachers, isGroup } = req.body;

    if (!student) {
      // development convenience: substitute a Student user if missing
      let devStudent = await User.findOne({ typeOfUser: 'Student' });
      if (!devStudent) {
        devStudent = new User({
          name: 'Dev Student',
          typeOfUser: 'Student',
          email: `dev-student-${Date.now()}@example.com`,
          password: 'devpass123'
        });
        await devStudent.save();
      }
      student = devStudent._id;
    }

    // Normalize teachers into IDs if emails were provided
    const teacherIds = [];
    if (Array.isArray(teachers)) {
      for (const t of teachers) {
        if (!t) continue;
        if (typeof t === 'string') {
          if (/^[0-9a-fA-F]{24}$/.test(t)) {
            teacherIds.push(t);
            continue;
          }
          if (t.includes('@')) {
            const u = await User.findOne({ email: t });
            if (u) teacherIds.push(u._id);
            continue;
          }
          continue;
        }
        teacherIds.push(t);
      }
    }

    const chat = new Chat({ chatName: chatName || '', student, teachers: teacherIds, isGroup: !!isGroup });
    await chat.save();
    const populated = await Chat.findById(chat._id).populate('student teachers', 'name email typeOfUser');
    return res.status(201).json(populated);
  } catch (err) {
    console.error('createChat error', err);
    return res.status(500).json({ message: 'Failed to create chat' });
  }
};

// POST /:chatId/messages -- echo back a message object (no Message model persisted here)
export const postMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { sender, text } = req.body;
    if (!chatId || !text) return res.status(400).json({ message: 'chatId and text are required' });

    // Return a lightweight message object; not persisted because Message model isn't present
    const message = { id: `m_${Date.now()}`, chatId, sender: sender || null, text, createdAt: new Date().toISOString() };

    // Optionally update chat's updatedAt to bring it to the top; don't touch latestMessage (no Message model)
    try {
      await Chat.findByIdAndUpdate(chatId, { $set: { updatedAt: new Date() } });
    } catch (u) {
      // ignore
    }

    return res.status(201).json(message);
  } catch (err) {
    console.error('postMessage error', err);
    return res.status(500).json({ message: 'Failed to post message' });
  }
};

export default {
  getChats,
  createChat,
  postMessage,
};
