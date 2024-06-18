import {
  invalid_email,
  email_required,
  password_trim_spaces,
  password_min_length,
  min_password_length,
  password_required,
  otp_required,
  invalid_date_format,
  date_required,
  email_otp_length,
  booking_id_length,
  invalid_email_iitk,
  room_number_error,
  room_type_error,
  arrival_date_error,
  departure_date_error,
  number_of_persons_error,
  phone_error,
  phone_required_error,
  phone_array_error,
  purpose_error,
  purpose_required_error,
  relationship_error,
  relationship_array_error,
  relationship_required,
  name_error,
  name_array_error,
  name_required,
  roll_invalid,
  roll_required,
  phone_invalid,
  phone_required,
  invalid_otp,
  booking_id_not_found,
  booking_id_invalid,
  email_trim_spaces,
} from "@/important_data/important_data";
const yup = require("yup");
import { parse, isValid } from "date-fns";

exports.userSchema = yup.object().shape({
  email: yup.string().trim(email_trim_spaces).email(invalid_email).required(email_required),
  password: yup
    .string()
    .trim(password_trim_spaces)
    .min(min_password_length, password_min_length)
    .required(password_required),
});

exports.dateSchema = yup.object().shape({
  date: yup
    .string()
    .required(date_required)
    .test("is-valid-date", invalid_date_format, (value) => {
      if (!value) return false;
      const parsedDate = parse(
        value,
        "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
        new Date()
      );
      return isValid(parsedDate) && value === parsedDate.toISOString();
    }),
});

exports.emailSchema = yup.object().shape({
  email: yup.string().trim(email_trim_spaces).email(invalid_email).required(email_required),
});

exports.passwordSchema = yup.object().shape({
  password: yup
    .string()
    .trim(password_trim_spaces)
    .min(min_password_length, password_min_length)
    .required(password_required),
});


exports.otpSchema = yup.object().shape({
  otp: yup.string()
    .trim()
    .matches(new RegExp(`^\\d{${email_otp_length}}$`), invalid_otp)
    .required(otp_required)
});


exports.bookingIdSchema = yup.object().shape({
  bookingId: yup.string()
    .trim()
    .matches(new RegExp(`^\\d{${booking_id_length}}$`), booking_id_invalid)
    .required(booking_id_not_found)
});


exports.indentorDetailsSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .matches(/^[A-Za-z\s]+$/, name_error)
    .min(1, name_required)
    .required(name_required),

  phone: yup
    .string()
    .trim()
    .matches(/^\d{10}$/, phone_invalid)
    .required(phone_required),

  roll: yup
    .string()
    .trim()
    .matches(/^\d+$/, roll_invalid)
    .required(roll_required),

  email: yup
    .string()
    .trim()
    .required(email_required)
    .email(invalid_email)
    .matches(/@iitk\.ac\.in$/, invalid_email_iitk),
});

exports.visitorDetailsSchema = yup.object().shape({
  name: yup
    .array()
    .of(
      yup
        .string()
        .trim()
        .matches(/^[A-Za-z\s]+$/, name_error)
        .min(1, name_array_error)
        .required(name_required)
    )
    .min(1, name_array_error)
    .required(name_required),

  relationship: yup
    .array()
    .of(
      yup
        .string()
        .trim()
        .matches(
          /^[A-Za-z\s]+$/, relationship_error)
        .min(1, relationship_array_error)
        .required(relationship_required)
    )
    .min(1, relationship_array_error)
    .required(relationship_required),

  purpose: yup
    .string()
    .trim()
    .matches(/^[A-Za-z\s]+$/, purpose_error)
    .min(1, purpose_error)
    .required(purpose_required_error),

  phone: yup
    .array()
    .of(
      yup
        .string()
        .trim()
        .matches(/^\d{10}$/, phone_error)
        .required(phone_required_error)
    )
    .min(1, phone_array_error)
    .required(phone_required_error),
});

exports.roomDetailsSchema = yup.object().shape({
  room_no: yup
    .string()
    .trim()
    .required(room_number_error),
  room_type: yup
    .string()
    .trim()
    .required(room_type_error),
  arrival_date: yup
    .string()
    .trim()
    .matches(
      /^\d{2}\/\d{2}\/\d{4}$/,
      arrival_date_error
    )
    .required(arrival_date_error),
  departure_date: yup
    .string()
    .trim()
    .matches(
      /^\d{2}\/\d{2}\/\d{4}$/,
      departure_date_error
    )
    .required(departure_date_error),
  no_of_persons: yup
    .string()
    .trim()
    .matches(/^\d+$/, number_of_persons_error)
    .required(number_of_persons_error),
});
