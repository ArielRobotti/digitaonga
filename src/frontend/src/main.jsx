import "./index.css";
import "@nfid/identitykit/react/styles.css";

import { BrowserRouter, Route, Routes } from "react-router";
import { IdentityKitAuthType, InternetIdentity, NFIDW, OISY } from "@nfid/identitykit";

import Community from "./pages/community/page";
import CreateNft from "./pages/nfts/create/page";
import CreateProposal from "./pages/proposals/create/page";
import FirstSteps from "./pages/first steps/page";
import Header from "./components/shared/Header";
import Home from "./pages/Home";
import { IdentityKitProvider } from "@nfid/identitykit/react";
import Login from "./pages/login/page";
import Nfts from "./pages/nfts/page";
import Notifications from "./pages/notifications/page";
import OnBoarding from "./pages/on boarding/page";
import ProposalDetail from "./pages/proposals/[id]/page";
import Proposals from "./pages/proposals/page";
import React from "react";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <IdentityKitProvider
      authType={IdentityKitAuthType.DELEGATION}
      signers={[OISY, InternetIdentity, NFIDW]}
      featureSigner={OISY}
      // signerClientOptions={{
      //   targets: [], // **IMPORTANT**: these are *your* canisters, not ledger canisters
      // }}
    >
      <BrowserRouter>
        <Header />
        <Routes>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="proposals">
            <Route index element={<Proposals />} />
            <Route path="create" element={<CreateProposal />} />
            <Route path=":id" element={<ProposalDetail />} />
          </Route>
          <Route path="on_boarding" element={<OnBoarding />} />
          <Route path="first_steps" element={<FirstSteps />} />
          <Route path="nfts">
            <Route index element={<Nfts />} />
            <Route path="create" element={<CreateNft />} />
          </Route>
          <Route path="notifications" element={<Notifications />} />
          <Route path="community" element={<Community />} />
        </Routes>
      </BrowserRouter>
    </IdentityKitProvider>
  </React.StrictMode>
);
