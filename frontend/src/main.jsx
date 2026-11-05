import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { defineElement } from "@lordicon/element";
import "./index.css";
import App from "./App.jsx";
import ErrorBoundary from "./components/ui/ErrorBoundary.jsx";

// define "lord-icon" custom element with default properties
defineElement();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
