import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";

import { ColorModeProvider } from "./theme/ColorModeProvider";
import { AuthProvider } from "./auth/AuthContext";
import { RealtimeProvider } from "./realtime/RealtimeProvider";
import AppRouter from "./app/AppRouter";

<<<<<<< HEAD
// Render the application to the DOM, wrapping it with necessary providers
// for theming, authentication, and real-time capabilities.
=======
>>>>>>> 3021c2567a6c53da578b52677e4f94c9ea73a29f
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ColorModeProvider>
      <BrowserRouter>
        <AuthProvider>
          <RealtimeProvider>
            <AppRouter />
          </RealtimeProvider>
        </AuthProvider>
      </BrowserRouter>
    </ColorModeProvider>
<<<<<<< HEAD
  </React.StrictMode>,
=======
  </React.StrictMode>
>>>>>>> 3021c2567a6c53da578b52677e4f94c9ea73a29f
);
