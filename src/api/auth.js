import apiClient from './client';

/**
 * Register user / Request OTP
 * @param {string} phone 10-digit mobile number
 * @param {string} dial_code Default '+91'
 */
export async function registerUser(phone, dial_code = '+91') {
  const params = new URLSearchParams({
    phone: phone.trim(),
    dial_code: dial_code.trim()
  });

  try {
    const response = await apiClient.post('/pwa/user/register', params.toString());
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error_message ||
      error.response?.data?.message ||
      error.message ||
      'Failed to register or send OTP';
    throw new Error(message);
  }
}

/**
 * Login with OTP
 * @param {string} phone 10-digit mobile number
 * @param {string} otp 6-digit code
 * @param {string} dial_code Default '+91'
 */
export async function loginWithOtp(phone, otp, dial_code = '+91') {
  const params = new URLSearchParams({
    phone: phone.trim(),
    otp: otp.trim(),
    dial_code: dial_code.trim()
  });

  try {
    const response = await apiClient.post('/pwa/user/login', params.toString());
    const data = response.data;
    // Check if token exists in response
    if (data && data.status === 'Success' && data.data?.token) {
      return data.data;
    }
    if (data && data.status === 'Failed') {
      throw new Error(data.error_message || 'Invalid or expired OTP');
    }
    return data.data || data;
  } catch (error) {
    const message =
      error.response?.data?.error_message ||
      error.response?.data?.message ||
      error.message ||
      'Invalid OTP. Please check and try again.';
    throw new Error(message);
  }
}
