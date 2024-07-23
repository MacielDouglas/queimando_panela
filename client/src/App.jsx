import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ScrollToTop from "./helper/ScrollTotop";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import Footer from "./pages/Footer";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route element={<OnlyAdminPrivateRoute />}></Route>
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
