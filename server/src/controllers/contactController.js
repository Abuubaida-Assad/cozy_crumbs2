import { ContactMessage } from '../models/ContactMessage.js';

// @desc    Submit contact message
// @route   POST /api/contact
// @access  Public
export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and message' });
    }

    if (!/^\S+@\S+\.\S+$/.test(String(email)) || String(message).trim().length > 5000) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email and a message under 5000 characters' });
    }

    const newMsg = await ContactMessage.create({
      name,
      email: String(email).toLowerCase().trim(),
      phone: phone || '',
      subject: subject || req.body.inquiryType || 'General Inquiry',
      message: String(message).trim(),
      status: 'unread',
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting Cozy Crumbs! We will get back to you shortly.',
      data: newMsg,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Sample starter inquiries for preview and testing if none exist
const starterInquiries = [
  {
    name: 'Aisha Khan',
    email: 'aisha.khan@example.com',
    phone: '+91 98765 43210',
    subject: 'Custom Celebration Cake',
    message: 'Hello! I would like to order a 2-tier dark chocolate truffle cake with floral piping for a birthday on Saturday.',
    status: 'unread',
  },
  {
    name: 'Rahul Sharma',
    email: 'rahul.s@example.com',
    phone: '+91 98111 22334',
    subject: 'Catering & Bulk Order',
    message: 'We are hosting an office breakfast event for 40 people next Thursday. Can we get an assortment of croissants, puffs, and cold brew?',
    status: 'unread',
  },
  {
    name: 'Pooja Verma',
    email: 'pooja.verma@example.com',
    phone: '+91 97654 32109',
    subject: 'General Inquiry',
    message: 'Are your breads and sourdough loaves 100% whole wheat and vegan friendly?',
    status: 'read',
  },
];

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
export const getContactMessages = async (req, res) => {
  try {
    let messages = await ContactMessage.find().sort({ createdAt: -1 });

    // If zero messages exist in DB, auto-populate starter messages for initial admin preview
    if (messages.length === 0) {
      try {
        messages = await ContactMessage.insertMany(starterInquiries);
      } catch (seedErr) {
        console.warn('Could not insert starter messages:', seedErr.message);
      }
    }

    res.json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update contact message status
// @route   PATCH /api/contact/:id/status
// @access  Private/Admin
export const updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    let message = null;
    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      message = await ContactMessage.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
    }

    res.json({
      success: true,
      message: 'Status updated',
      data: message || { _id: id, status },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;

    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      await ContactMessage.findByIdAndDelete(id);
    }

    // Always return success (idempotent delete)
    res.json({ success: true, message: 'Message deleted successfully', id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

