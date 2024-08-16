import { useEffect, useState } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "./../firebase";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useToast from "../hooks/useToast";
import { loginGoogle } from "../features/auth/authActions";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth(app);
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      await handleGoogleSignInResults(resultsFromGoogle.user);
    } catch (error) {
      showError(error);
      throw new Error(error);
    }
  };

  const handleGoogleSignInResults = async (user) => {
    const { displayName, email, photoURL } = user;

    try {
      setLoading(true);
      const resultAction = await dispatch(
        loginGoogle({
          user: {
            email: email,
            profilePicture: photoURL,
            displayName: displayName,
          },
        })
      );

      if (!loginGoogle.fulfilled.match(resultAction)) {
        setLoading(false);
        showSuccess("Login efetuado com sucesso!");
      }
    } catch (error) {
      showError(error);
      console.error(error.message);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      disabled={loading}
      className="w-56 bg-red-700 text-white rounded-md py-2 px-4 hover:bg-red-600 focus:outline-none focus:bg-red-500 disabled:bg-red-500 mt-4"
    >
      {loading ? "Loading..." : "Entrar com Google"}
    </button>
  );
}
