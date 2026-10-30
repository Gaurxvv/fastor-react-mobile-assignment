# Fastor API Integration Notes

This document records the exact endpoint configurations, content types, request payloads, headers, and response shapes used in the Fastor React Mobile application.

---

## 1. Register / Request OTP
- **Endpoint:** `POST https://staging.fastor.ai/v1/pwa/user/register`
- **Method:** `POST`
- **Content-Type:** `application/x-www-form-urlencoded`
- **Request Body:**
  ```text
  phone=9818979450&dial_code=%2B91
  ```
- **Query / Form Fields:**
  - `phone` (string, required): 10-digit mobile number (e.g. `9818979450`)
  - `dial_code` (string, required): Country dial code with leading plus (e.g. `+91`)

### Sample Response (Success - 200 OK):
```json
{
  "status": "Success",
  "status_code": 200,
  "data": "OTP sent successfully"
}
```

### Sample Response (Error - 400 / 500):
```json
{
  "status": "Failed",
  "status_code": 500,
  "error_message": "Invalid phone number format",
  "error": {}
}
```

---

## 2. Login with OTP
- **Endpoint:** `POST https://staging.fastor.ai/v1/pwa/user/login`
- **Method:** `POST`
- **Content-Type:** `application/x-www-form-urlencoded`
- **Request Body:**
  ```text
  phone=9818979450&otp=123456&dial_code=%2B91
  ```
- **Query / Form Fields:**
  - `phone` (string, required): 10-digit mobile number
  - `otp` (string, required): 6-digit one-time password (Default staging OTP: `123456`)
  - `dial_code` (string, required): `+91`

### Sample Response (Success - 200 OK):
```json
{
  "status": "Success",
  "status_code": 200,
  "data": {
    "user_id": "6625",
    "user_name": "zczxcz",
    "user_mobile": "9818979450",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "is_new_user": false
  }
}
```

### Sample Response (Invalid OTP - 200 OK / 400):
```json
{
  "status": "Failed",
  "status_code": 400,
  "error_message": "Invalid OTP",
  "error": {}
}
```

---

## 3. Fetch Restaurants List
- **Endpoint:** `GET https://staging.fastor.ai/v1/m/restaurant?city_id=118`
- **Method:** `GET`
- **Query Parameters:**
  - `city_id` (number/string, default: `118` for Delhi NCR)
- **Headers:**
  ```http
  Authorization: Bearer <token>
  Content-Type: application/json
  ```

### Sample Response (Success - 200 OK):
```json
{
  "status": "Success",
  "status_code": 200,
  "data": {
    "results": [
      {
        "restaurant_id": "75",
        "restaurant_name": "VYB",
        "address_complete": "Address, ssasasa, Andhra Pradesh, 110009, India",
        "logo": "https://fastor-d2c-shared-bucket-1.s3.ap-south-1.amazonaws.com/sugandham/uploads/1f4e8121-bda8-4c3b-b46f-a21a9389f276.png"
      },
      {
        "restaurant_id": "74",
        "restaurant_name": "Mother India",
        "address_complete": "KAVERI COMPLEX 2ND FLOOR , BM ROAD HASSAN 573201, Bangalore, Karnataka, 573201, India",
        "logo": "https://fastor-d2c-shared-bucket-1.s3.ap-south-1.amazonaws.com/sugandham/uploads/1f4e8121-bda8-4c3b-b46f-a21a9389f276.png"
      }
    ]
  }
}
```

---

## 4. Key Implementation Details
- **Token Storage:** In `localStorage` under key `fastor_auth_token`.
- **Axios Interceptors:** Automatic Bearer token header injection in every request via `src/api/client.js`.
- **401 Response Handling:** Auto-clears token from storage and dispatches `fastor_auth_unauthorized` to redirect user cleanly to `/login`.
