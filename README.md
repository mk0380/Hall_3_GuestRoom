# Guest Room Booking Portal for Hall of Residence 3, IIT Kanpur

Welcome to the Guest Room Booking Portal for the Hall of Residence 3 at IIT Kanpur. This portal is designed to streamline the booking process for guest rooms, providing a user-friendly interface for residents and visitors to make reservations efficiently and securely.

![image](https://github.com/mk0380/Hall_3_GuestRoom/assets/123063925/d0369d7e-6704-42a2-bbf8-d9a9c18fd27d)


## Features

- **Room Booking**: Users can select rooms, specify arrival and departure dates, and provide details for the visitors.
- **Indentor Details**: Collecting and verifying the details of the indentor including name, email, phone, and roll number.
- **OTP Verification**: Sending OTP for booking confirmation to ensure the authenticity of the request.
- **Form Validation**: Comprehensive validation for room details, visitor details, and indentor details.
- **Data Persistence**: Securely storing booking details in a MongoDB database.
- **Separate Dashboards**: Different dashboards for warden and hall office control to manage bookings and other administrative tasks.
- **Rate Limiter**: Implementing rate limiting to prevent abuse of the booking system.
- **Analytics**: Providing analytics and reports for monitoring and management purposes.

  
## Technology Stack

- **Frontend**: Next.js@14.2.3
- **Backend**: Node.js@20.14.0 with Express
- **Database**: MongoDB Atlas
- **Email Service**: Nodemailer


## Installation

### Prerequisites

- Node.js@20
- npm or yarn
- MongoDB atlas

### Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/mk0380/Hall_3_GuestRoom.git
   cd guest-room-booking
2. **Create Environment Variables File (.env) file**
   ```bash
   MONGODB_URL = ""
   JWT_SECRET = ""
   JWT_EXPIRE_DAY = 0
   NODE_ENV = ""
   EMAIL_SERVICE = ""
   EMAIL_PORT = 000
   EMAIL_USER = ""
   EMAIL_PASSWORD = ""
   OTP_SECRET = ""
   GOOGLE_ANALYTICS = ""
3. **Install Dependencies**
   ```bash
   npm install --force
4. **Running the Application**
   ```bash
   npm run dev
