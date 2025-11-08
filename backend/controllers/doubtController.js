import Doubt from '../models/DoubtSchema.js';
import User from '../models/UserSchema.js';
import { getGeminiReply } from '../utils/gemini.js';

// GET /api/doubts
export const getDoubts = async (req, res) => {
  try {
    // Optionally filter by student via query param: ?student=<id>
    const filter = {};
    if (req.query.student) filter.student = req.query.student;
    const doubts = await Doubt.find(filter).sort({ createdAt: -1 }).lean();
    return res.json(doubts);
  } catch (err) {
    console.error('getDoubts error', err);
    return res.status(500).json({ message: 'Failed to fetch doubts' });
  }
};

// POST /api/doubts
export const createDoubt = async (req, res) => {
  try {
    let { subject, title, description, student, teachers, isGroup } = req.body;

    if (!subject || !title || !description) {
      return res.status(400).json({ message: 'subject, title and description are required' });
    }

    // Development convenience: if student is not provided or is the placeholder 'me',
    // try to find an existing Student user. If none exists, create a lightweight dev student.
    if (!student || student === 'me') {
      let devStudent = await User.findOne({ typeOfUser: 'Student' });
      if (!devStudent) {
        // create a minimal student user for dev purposes
        devStudent = new User({
          name: 'Dev Student',
          typeOfUser: 'Student',
          // use a valid-looking test email so Mongoose validators accept it
          email: `dev-student-${Date.now()}@example.com`,
          password: 'devpass123'
        });
        await devStudent.save();
      }
      student = devStudent._id;
    }

    // Normalize teachers array: if client supplied teacher emails, try to resolve them to ids
    const teacherIds = [];
    if (Array.isArray(teachers)) {
      for (const t of teachers) {
        if (!t) continue;
        if (typeof t === 'string') {
          // ObjectId string?
          if (/^[0-9a-fA-F]{24}$/.test(t)) {
            teacherIds.push(t);
            continue;
          }
          // maybe an email
          if (t.includes('@')) {
            const u = await User.findOne({ email: t });
            if (u) teacherIds.push(u._id);
            // skip unresolved emails silently
            continue;
          }
          // otherwise skip non-object ids
          continue;
        }
        // assume t is already an ObjectId
        teacherIds.push(t);
      }
    }

    const doubt = new Doubt({ subject, title, description, student, teachers: teacherIds, isGroup: !!isGroup });
    await doubt.save();

    // Call Gemini AI and update the doubt with the AI's reply
    try {
      const prompt = `A student asked a doubt in ${subject}:\nTitle: ${title}\nDescription: ${description}\n\nAs an expert teacher, provide a clear, well-formatted answer using headings, bullet points, and a summary. Use Markdown for formatting.`;
      const aiReply = await getGeminiReply(prompt);
      doubt.aiReply = aiReply;
      await doubt.save();
    } catch (aiErr) {
      console.error('Gemini AI error (non-fatal)', aiErr);
    }

    return res.status(201).json(doubt);
  } catch (err) {
    console.error('createDoubt error', err);
    return res.status(500).json({ message: 'Failed to create doubt' });
  }
};
