import {
  addDoc,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  setDoc
} from "firebase/firestore";
import { db } from "@/config/firebase";

const bookingsCollection = collection(db, "Calendar");

export const getCalendar = async () => {
  try {
    const data = await getDocs(bookingsCollection);
    const filteredData = data.docs.map((doc) => {
      const event = doc.data();
      return {
        ...event,
        id: doc.id,
      };
    });
    return filteredData;
  } catch (err) {
    console.error("Error fetching bookings:", err);
    throw err;
  }
};
export const getEvents = async () => {
  try {
    const data = await getDocs(bookingsCollection);
    const filteredData = data.docs
      .filter((doc) => doc.data().calendarId === "event")
      .map((doc) => {
        const event = doc.data();
        return {
          ...event,
          id: doc.id,
        };
      });
    return filteredData;
  } catch (err) {
    console.error("Error fetching bookings:", err);
    throw err;
  }
};

export const addToCalendar = async (data) => {
  try {
    const docRef = await addDoc(bookingsCollection, {
      title: data.title,
      start: data.start,
      end: data.end,
      description: data.description || "",
      calendarId: data.calendarId || null,
      rrule: data.rrule || null,
    });
    console.log("Event added with ID:", docRef.id);
    return { id: docRef.id, ...data };
  } catch (err) {
    console.error("Error adding event to calendar:", err);
    throw err;
  }
};

export const addBookingToCalendar = async (data) => {
  try {
    const id = data.id || crypto.randomUUID(); // fallback to random ID if not provided
    const docRef = doc(bookingsCollection, id); // create a reference with the custom ID

    await setDoc(docRef, {
      title: data.title,
      start: data.start,
      end: data.end,
      description: data.description || "",
      calendarId: data.calendarId || null,
      rrule: data.rrule || null,
    });

    console.log("Event added with ID:", id);
    return { id, ...data };
  } catch (err) {
    console.error("Error adding event to calendar:", err);
    throw err;
  }
};



export const updateCalendarEvent = async (id, data) => {
  try {
    const docRef = doc(db, "Calendar", id);
    await updateDoc(docRef, {
      title: data.title,
      start: data.start,
      end: data.end,
      description: data.description || "",
      calendarId: data.calendarId || null,
      rrule: data.rrule || null,
    });
    console.log("Event updated with ID:", id);
    return { id, ...data };
  } catch (err) {
    console.error("Error updating event:", err);
    throw err;
  }
};

export const deleteCalendarEvent = async (id) => {
  try {
    const docRef = doc(db, "Calendar", id);
    await deleteDoc(docRef);
    console.log("Event deleted with ID:", id);
    return id;
  } catch (err) {
    console.error("Error deleting event:", err);
    throw err;
  }
};
