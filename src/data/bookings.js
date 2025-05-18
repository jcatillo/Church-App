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
  // Get the date object
  const dateObj = new Date(data.date);
  
  // Format the date in YYYY-MM-DD format preserving the selected date 
  // regardless of timezone by using local date methods
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  // Process the time
  const timeDate = new Date(data.time);
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
      status: "pending",
    });
  } catch (err) {
    console.log(err);
  }
};
