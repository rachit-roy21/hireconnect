const crypto = require('crypto');
const StudentProfile = require('../models/StudentProfile');

exports.createOrder = async (req, res, next) => {
  try {
    const { planType } = req.body;
    const amount = planType === 'annual' ? 199900 : 29900;

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return res.status(503).json({
        success: false,
        configured: false,
        message: 'Payments are not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in the backend environment.'
      });
    }

    const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${authHeader}`
      },
      body: JSON.stringify({
        amount,
        currency: 'INR',
        receipt: `rcpt_${req.user.id.toString().substring(0, 8)}_${Date.now()}`,
        notes: { planType, userId: req.user.id.toString() }
      })
    });

    const orderData = await response.json();
    if (!response.ok) {
      return res.status(502).json({
        success: false,
        message: orderData.error?.description || 'Unable to create payment order'
      });
    }

    res.status(200).json({
      success: true,
      order: orderData,
      keyId
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      return res.status(503).json({
        success: false,
        configured: false,
        message: 'Payments are not configured.'
      });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification details are incomplete' });
    }

    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature. Verification failed.' });
    }

    await StudentProfile.findOneAndUpdate(
      { user: req.user.id },
      { isPremium: true },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully. Premium membership activated.'
    });
  } catch (error) {
    next(error);
  }
};
