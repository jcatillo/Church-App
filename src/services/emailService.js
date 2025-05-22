import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_BOOKING_NOTIFICATION;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const CONTACT_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_CONTACT_US;



export const sendBookingNotification = (data) => {
  const { status } = data;

   const getAcceptedHtml = (data) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Booking Confirmation</title>
  <style>
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.5; padding: 20px; }
    h2 { color: #27ae60; }
    p { margin-bottom: 1em; }
    .booking-details { background-color: #f1f9f5; border: 1px solid #d4e9d6; padding: 15px; border-radius: 5px; margin-top: 20px; }
    .booking-details h3 { margin-top: 0; color: #2ecc71; }
    .detail-row { margin-bottom: 8px; }
    .label { font-weight: bold; }
    .signature { margin-top: 30px; font-style: italic; }
  </style>
</head>
<body>
  <h2>Booking Confirmation</h2>
  <p>Dear ${data.name},</p>
  <p>Thank you for choosing our services for your <strong>${data.bookingType}</strong> booking on <strong>${data.date}</strong> at <strong>${data.time}</strong>.</p>
  <p>We are pleased to confirm that your booking has been <strong>accepted</strong> and is now scheduled.</p>

  <div class="booking-details">
    <h3>Booking Details:</h3>
    <div class="detail-row"><span class="label">Event Type:</span> ${data.event_type}</div>
    <div class="detail-row"><span class="label">Date:</span> ${data.date}</div>
    <div class="detail-row"><span class="label">Time:</span> ${data.time}</div>
    <div class="detail-row"><span class="label">Name:</span> ${data.name}</div>
    <div class="detail-row"><span class="label">Email:</span> ${data.email}</div>
    <div class="detail-row"><span class="label">Phone:</span> ${data.phone}</div>
  </div>

  <p>If you have any questions or need to make any changes, please don’t hesitate to reach out to us at this email or call us at your convenience.</p>
  <p>We look forward to serving you and making your event special!</p>

  <div class="signature">
    <p>Warm regards,</p>
    <p>Rey Angelo Ramilo<br />
       STVP Administrator<br />
       stvpdanao55@gmail.com<br />
       Sto Tomas De Villanueva - Danao
    </p>
  </div>
</body>
</html>
`;

const getDeclinedHtml = (data) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Booking Cancellation</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; }
    h2 { color: #c0392b; }
    p { margin-bottom: 1em; }
    .booking-details { background-color: #f8f8f8; border: 1px solid #ddd; padding: 15px; margin-top: 20px; border-radius: 5px; }
    .booking-details h3 { margin-top: 0; }
    .detail-row { margin-bottom: 8px; }
    .label { font-weight: bold; }
  </style>
</head>
<body>
  <h2>Booking Cancellation Notice</h2>
  <p>Dear ${data.name},</p>
  <p>Thank you for your interest in booking our services for your <strong>${data.bookingType}</strong> booking on <strong>${data.date}</strong> at <strong>${data.time}</strong>.</p>
  <p>We regret to inform you that your booking has been <strong>cancelled</strong>. If this was unintentional or if you would like to reschedule due to scheduling conflict, please don’t hesitate to reach out to us at this email or call us at your convenience.</p>

  <div class="booking-details">
    <h3>Booking Details:</h3>
    <div class="detail-row"><span class="label">Event Type:</span> ${data.event_type}</div>
    <div class="detail-row"><span class="label">Date:</span> ${data.date}</div>
    <div class="detail-row"><span class="label">Time:</span> ${data.time}</div>
    <div class="detail-row"><span class="label">Name:</span> ${data.name}</div>
    <div class="detail-row"><span class="label">Email:</span> ${data.email}</div>
    <div class="detail-row"><span class="label">Phone:</span> ${data.phone}</div>
  </div>
</body>
</html>
`;


  const message = status === 'ACCEPTED' ? getAcceptedHtml(data) : getDeclinedHtml(data);

  console.log(message);
 

  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      ...data,
      message,
    },
    PUBLIC_KEY
  );
};

export const sendContactUsEmail = ({ name, email, subject, message }) => {
  // Optionally build a formatted HTML message if you want, or send raw fields
  return emailjs.send(
    SERVICE_ID,
    CONTACT_TEMPLATE_ID,
    {
      name,
      email,
      subject,
      message,
    },
    PUBLIC_KEY
  );
};
