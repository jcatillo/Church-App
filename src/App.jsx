import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/home";
import { Events } from "./pages/events";
import { Schedule } from "./pages/schedule";
import { Booking } from "./pages/booking";
import { AboutUs } from "./pages/aboutus";
import { ContactUs } from "./pages/contactus";
import { Layout } from "./Layout";

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route element={<Layout/>}>
            <Route path="/" element={<Home/>}/>
            <Route path="/events" element={<Events/>}/>
            <Route path="/schedule" element={<Schedule/>}/>
            <Route path="/booking" element={<Booking/>}/>
            <Route path="/about-us" element={<AboutUs/>}/>
            <Route path="/contact-us" element={<ContactUs/>}/>
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
