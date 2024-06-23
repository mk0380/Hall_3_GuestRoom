# Guest Room Booking Portal for Hall of Residence 3, IIT Kanpur

Welcome to the Guest Room Booking Portal for the Hall of Residence 3 at IIT Kanpur. This portal is designed to streamline the booking process for guest rooms, providing a user-friendly interface for residents and visitors to make reservations efficiently and securely.

## Features

- **Room Booking**: Users can select rooms, specify arrival and departure dates, and provide details for the visitors.
- **Indentor Details**: Collecting and verifying the details of the indentor including name, email, phone, and roll number.
- **OTP Verification**: Sending OTP to indentor's email for booking confirmation to ensure the authenticity of the request.
- **Form Validation**: Comprehensive validation for room details, visitor details, and indentor details.
- **Data Persistence**: Securely storing booking details in a MongoDB database.

## Technology Stack

- **Frontend**: React with Next.js
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Email Service**: Nodemailer for sending OTP emails


## Installation

### Prerequisites

- Node.js
- npm or yarn
- MongoDB database

### Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-repo/guest-room-booking.git
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
