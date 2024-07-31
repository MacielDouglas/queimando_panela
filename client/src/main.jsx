import "symbol-observable";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App.jsx";
import { ApolloProvider } from "@apollo/client";
import "./index.css";
import store, { persistor } from "./app/store.js";
import "react-toastify/dist/ReactToastify.css";
import { client } from "./apollo/client.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </PersistGate>
  </Provider>
);

export { client };
