import emailjs from '@emailjs/browser';

// Send Booking Cancellation Email
export const sendCancellationEmail = (data) => {
  return emailjs.send(
    'service_c7dzvk5',         // Your EmailJS Service ID
    'template_o6dllf6',        // Your EmailJS Cancellation Template ID
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
    'fu89KzFRCR2gcMiyG'       // Your EmailJS Public Key
  );
};

// Send Booking Acceptance Email
export const sendAcceptanceEmail = (data) => {
  return emailjs.send(
    'service_c7dzvk5',         // Your EmailJS Service ID
    'template_pkqlnim',    // Replace with your EmailJS Acceptance Template ID
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
    'fu89KzFRCR2gcMiyG'       // Your EmailJS Public Key
  );
};
