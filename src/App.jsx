import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./pages/home";
import { Events } from "./pages/events";
import { Schedule } from "./pages/schedule";
import { Booking } from "./pages/booking";
import { AboutUs } from "./pages/aboutus";
import { ContactUs } from "./pages/contactus";
import { Layout } from "./Layout";
import { Login } from "./pages/admin/login";
import { AdminLayout } from "./AdminLayout";
import { AdminHome } from "./pages/admin/AdminHome";
import { auth } from "./config/firebase";
import { useState, useEffect } from "react";
import { Calendar } from "./pages/admin/calendar";
import { AdminBooking } from "./pages/admin/bookings";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return <div>Loading...</div>;
    }
    
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  return (
    <>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/login" element={<Login />} />
          </Route>

          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="home" />} />
            <Route path="home" element={<AdminHome />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="booking" element={<AdminBooking />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
