import API from './api';

export const paymentService = {
  createOrder: (planType) => API.post('/payments/create-order', { planType }),
  verifyPayment: (data) => API.post('/payments/verify', data)
};
