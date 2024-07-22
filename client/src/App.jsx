import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ScrollToTop from "./helper/ScrollTotop";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import Footer from "./pages/Footer";

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
