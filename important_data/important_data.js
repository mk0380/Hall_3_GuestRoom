// rather than view  use preview or it may unnecessarily ask for permission, even though the link is public
exports.cancel_room_pdf_link = "https://drive.google.com/file/d/1DwxsTCZfzEVdtUhS7x8DVoDJYJ39mvAz/preview?usp=sharing"
exports.feedback_form_link = "https://forms.gle/m63MF9T5JXg8i3Ux8"
exports.prices_pdf_link = "https://drive.google.com/file/d/1VOSaIhvCH-Dq4Qp_FjYOH7VdUcm6roY9/preview?usp=drive_link"
exports.rules_pdf_link = "https://drive.google.com/file/d/1xdI43agz38aWA97FPZ-Ty6mP_7PT_j7a/preview?usp=sharing"



exports.ameneties_heading = "4 double bed rooms and 1 triple bed room."
exports.ameneties_sub_heading = ["They are well furnished rooms.","The rooms feature wide-open spaces, providing ample room to relax.","Additionally, they are equipped with coolers to ensure a comfortable stay."]


exports.rules_heading = "Guest rooms in Hall 3 can be booked by residents of any hall of IIT Kanpur."
exports.rules_sub_heading = ["Key collection time: 10 am to 5 pm except Sunday.","Key submission time: 10 am to 5 pm except Sunday.","Extra Inventory: No extra inventory will be supplied."]



exports.warden_email_list = ["warden@gmail.com"];
exports.hall_office_email_list = ["hall1@gmail.com", "hall2@iitk.ac.in"];


// for mail dashboeard redirect link
exports.frontend_url = "https://hall3guestroom.netlify.app/"


exports.percentage_price_to_be_paid_for_booking_confirmation = 0.1;


// do not change the "id", which will lead to change of internal code structure, where ever applicable, these datas will be used for mailing
exports.hec_hall3 = [{
    "position":"Web Secretary",
    "name":"Mayank Kumar",
    "id":"web"
},{
    "position":"Common Room Secretary",
    "name":"Rishi Ratn",
    "id":"common_room"
}]


exports.bcrypt_password_salt_rounds = 10


// do not change the keys, prices are on per day basis
exports.room_details = [
    {
        code:"R2",
        beds:"Double Bed",
        no:"109",
        max_persons:2,
        price: 500
    },
    {
        code:"R2",
        beds:"Double Bed",
        no:"110",
        max_persons:2,
        price: 500
    },
    {
        code:"R2",
        beds:"Double Bed",
        no:"111",
        max_persons:2,
        price: 500
    },
    {
        code:"R2",
        beds:"Double Bed",
        no:"112",
        max_persons:2,
        price: 500
    },
    {
        code:"R3",
        beds:"Triple Bed",
        no:"113",
        max_persons:3,
        price: 750
    }
]


exports.max_booking_day_period = 6


exports.email_otp_length = 6;
exports.booking_id_length = 6;
exports.email_otp_expiry_time_minutes = 10;


exports.subject_forget_password_email = 'Guest Room Booking Portal - Password Reset OTP - Hall 3'
exports.notify_warden_email = 'Guest Room Booking Portal - Request Pending - Action Required'
exports.indentor_confirmation_otp_email = 'Guest Room Booking Portal - Booking OTP - Hall 3'
exports.warden_approval_email = (id) => `Guest Room Booking Portal - Booking Request Approval [Booking ID:${id}]`
exports.warden_rejection_email = (id) => `Guest Room Booking Portal - Booking Request Rejection [Booking ID:${id}]`
exports.payment_1_email = (id) => `Confirmation: Guest Room Booking [Booking ID: ${id}`
exports.payment_2_email = (id) => `Total Payment Received: Guest Room Booking [Booking ID: ${id}]`
exports.payment_1_confirmation_email = `Booking confirmed`
exports.payment_2_confirmation_email = `Total payment received`
exports.indentor_askfor_otp_email = "Your booking request is being processed. Please check your email for the OTP to confirm your booking."


exports.max_number_persons_message = 'The maximum allowable number of individuals shall not exceed '


// id for conditional rendering for warden and hall office, do not change
exports.code_warden = "warden"
exports.code_hall_office = "hall_office"


exports.indentor_details_checkbox_1 = "I will be held responsible if any of these information is found false. I also undertake all the financial responsibility arising out of non-payment of loss or damage to the hall properties etc. I have read the rules and regulations of the guest room/ordinary room of Hall No. 3, and visitor and I will follow the same."
exports.indentor_details_checkbox_2 = "I declare my complete responsibility for the conduct of my guests throughout their stay in the Guest Room. I, hereby, submit to bear the consequences of any misconduct or damage on the part of my guest during their stay in the Guest Room."


exports.rate_limit_request = 5;
exports.rate_limit_time = 1000;
exports.rate_limit_msg = 'Rate limit exceeded. Please try again in few minutes.';


exports.toast_timer = 10000 //in ms
exports.wrongURL_redirect_timer = 4000 //inms


exports.timezone_date = "Asia/Kolkata"


// messages to dispaly to user, register page
exports.token_verified = "Token verified successfully";
exports.invalid_or_expired_token = "Invalid or expired token";
exports.token_not_provided = "Token not provided";
exports.invalid_request_method = "Invalid request method";
exports.validation_error = (errorMessage) => `Validation error: ${errorMessage}`;
exports.email_not_authorized = "Email not authorized";
exports.email_already_registered = "Email already registered";
exports.error_creating_user = "Error creating new user";
exports.registration_successful = "Registration successful";
exports.internal_server_error = "Internal server error";
exports.wrong_credentials = "Wrong credentials";
exports.login_successful = "Login successful";
exports.email_not_registered = "Email not registered";
exports.error_occurred = "Some error occurred";
exports.otp_sent = "Please check your email for OTP";
exports.otp_validated = "OTP successfully validated";
exports.email_send_error = "Failed to send OTP code via email. Please try again later.";
exports.email_booking_request_success = "Your request is pending with the warden for review. You will be notified once a decision has been made.";
exports.wrong_otp = "Incorrect OTP";
exports.invalid_otp = "Invalid OTP";
exports.otp_expired = "OTP expired";
exports.otp_required = "OTP is required";
exports.otp_only_numbers = "OTP must contain only numbers";
exports.password_changed_successfully = "Password changed successfully.";
exports.invalid_request = "Invalid request.";
exports.invalid_date_format = "Invalid date format.";
exports.date_required = "Date is required.";
exports.date_incorrcet = "Incorrect dates selected.";
exports.date_conflict = "Dates already booked by someone else. Please choose another.";
exports.booking_id_not_found = "Booking ID not found.";
exports.booking_id_invalid = "Booking ID is invalid.";
exports.form_incomplete = "Please provide all required details";
exports.invalid_room_details = "Invalid room details";
exports.invalid_visitor_details = "Invalid visitor details";
exports.logout_successfull = "Logout successful.";
exports.password_updated = "Password updated";
exports.req_accepted = "Request already accepted";
exports.req_accepted_first_time = "Request accepted";
exports.req_rejected = "Request already rejected";
exports.req_rejected_first_time = "Request rejected";


// validationMessages
exports.min_password_length = 6;
exports.invalid_email = "Invalid email";
exports.invalid_email_iitk = "IITK email required";
exports.email_required = "Email is required";
exports.password_trim_spaces = "Password should not contain any spaces";
exports.email_trim_spaces = "Email should not contain any spaces";
exports.password_min_length = "Password must be at least 6 characters long";
exports.password_required = "Password is required";
exports.room_number_error = "Please enter a valid room number.";
exports.room_type_error = "Please select a valid room type.";
exports.arrival_date_error = "Please enter a valid arrival date in DD/MM/YYYY format.";
exports.departure_date_error = "Please enter a valid departure date in DD/MM/YYYY format.";
exports.number_of_persons_error = "Please enter a valid number of persons.";
exports.phone_error = "Phone number must be exactly 10 digits";
exports.phone_array_error = "Phone numbers array must have at least one value";
exports.phone_required_error = "Phone number is required";
exports.purpose_error = "Purpose must only contain letters and spaces and must have at least 1 character after trimming";
exports.purpose_required_error = "Purpose is required";
exports.relationship_error = "Relationship must only contain letters and spaces and must have at least 1 character after trimming";
exports.relationship_array_error = "Relationship array must have at least one value";
exports.relationship_required = "Relationship is required";
exports.name_error = "Name must only contain letters and spaces and must have at least 1 character after trimming";
exports.name_array_error = "Name array must have at least one value";
exports.name_required = "Name is required";
exports.roll_required = "Roll number is required";
exports.roll_invalid = "Should contain only digits";
exports.phone_required = "Phone number is required";
exports.phone_invalid = "Phone number must be exactly 10 digits";


// databases error
exports.db_connection_failed = "Database connection failed.";
exports.db_connection_error = "Database connection error.";
exports.db_url_not_defined_error = "Database URL not defined.";


//rooms color codes msg
exports.rooms_vacant = "Rooms available for booking.";
exports.rooms_booked = "Rooms already booked. Not available.";
exports.rooms_reserved = "Rooms unavailable now. Check back in 3-4 days.";
