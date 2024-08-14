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
import Recipe from "./pages/Recipe";
import Category from "./pages/Category";
import Recipes from "./pages/Recipes";
import Search from "./pages/Search";
import About from "./pages/About";
import EditRecipe from "./components/dashboard/recipes/EditRecipe";

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipe/:slug" element={<Recipe />} />
        <Route path="/category/:category" element={<Category />} />
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/search" element={<Search />} />
        <Route path="/about" element={<About />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/dashboard?tab=/editedRecipe/:recipeSlug"
            element={<EditRecipe />}
          />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
