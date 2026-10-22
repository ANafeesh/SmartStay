import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { defineElement } from "@lordicon/element";
import "./index.css";
import App from "./App.jsx";

// define "lord-icon" custom element with default properties
defineElement();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
