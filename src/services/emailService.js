import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_CANCELLATION_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_CANCELLATION_ID;
const TEMPLATE_ACCEPTANCE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ACCEPTANCE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// Send Booking Cancellation Email
export const sendCancellationEmail = (data) => {
  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_CANCELLATION_ID,
    {
      name: data.name,
      bookingType: data.bookingType,
      booking: data.booking,
      bookingid: data.bookingid,
      event_type: data.event_type,
      date: data.date,
      time: data.time,
      email: data.email,
      phone: data.phone,
      sender_name: data.sender_name,
      sender_position: data.sender_position,
      sender_contact: data.sender_contact,
      organization_name: data.organization_name
    },
    PUBLIC_KEY
  );
};

// Send Booking Acceptance Email
export const sendAcceptanceEmail = (data) => {
  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_ACCEPTANCE_ID,
    {
      name: data.name,
      bookingType: data.bookingType,
      booking: data.booking,
      bookingid: data.bookingid,
      event_type: data.event_type,
      date: data.date,
      time: data.time,
      email: data.email,
      phone: data.phone,
      sender_name: data.sender_name,
      sender_position: data.sender_position,
      sender_contact: data.sender_contact,
      organization_name: data.organization_name
    },
    PUBLIC_KEY
  );
};
