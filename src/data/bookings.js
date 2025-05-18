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

export const addBooking = async (data) =>{
    try{
        await addDoc(bookingsCollection, {
            fname: data.firstName,
            lname: data.lastName,
            email: data.email,
            phone: data.phone,
            bookingType: data.type[0]
        })
    }catch(err){
        console.log(err);
    }
}
