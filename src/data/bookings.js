import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";

const bookingsCollection = collection(db, "Booking");

export const getBookings = async () => {
  try {
    const data = await getDocs(bookingsCollection);
    const filteredData = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return filteredData;
  } catch (err) {
    console.error("Error fetching bookings:", err);
    throw err;
  }
};

export const addBooking = async (data) => {
  const dateStr = data.date; // "2025-05-21T16:00:00.000Z"
  const timeStr = data.time; // "May 18, 2025 at 2:30:00 PM UTC+8"

  const formattedDate = dateStr ? dateStr.substring(0, 10) : null;

  const timeDate = new Date(timeStr);
  const hours = timeDate.getHours().toString().padStart(2, "0");
  const minutes = timeDate.getMinutes().toString().padStart(2, "0");
  const formattedTime = `${hours}:${minutes}`;

  try {
    await addDoc(bookingsCollection, {
      fname: data.firstName,
      lname: data.lastName,
      email: data.email,
      phone: data.phone,
      bookingType: data.type[0],
      date: formattedDate,
      time: formattedTime,
    });
  } catch (err) {
    console.log(err);
  }
};
