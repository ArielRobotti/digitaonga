import "./index.css";

import { BrowserRouter, Route, Routes } from "react-router";

import CreateProposal from "./pages/proposals/create/page";
import FirstSteps from "./pages/first steps/page";
import Header from "./components/shared/Header";
import Home from "./pages/Home";
import Nfts from "./pages/nfts/page";
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
        <Route path="proposals">
          <Route index element={<Proposals />} />
          <Route path="create" element={<CreateProposal />} />
        </Route>
        <Route path="on_boarding" element={<OnBoarding />} />
        <Route path="first_steps" element={<FirstSteps />} />
        <Route path="nfts" element={<Nfts />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
