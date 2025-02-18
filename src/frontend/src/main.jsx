import "./index.css";

import { BrowserRouter, Route, Routes } from "react-router";

import Header from "./components/shared/Header";
import Home from "./pages/Home";
import OnBoarding from "./pages/on boarding/page";
import Proposals from "./pages/proposals/page";
import React from "react";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route index element={<Home />} />
        <Route path="proposals" element={<Proposals />} />
        <Route path="on_boarding" element={<OnBoarding />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
