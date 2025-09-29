import "./index.css";
import "@nfid/identitykit/react/styles.css";

import { BrowserRouter, Route, Routes } from "react-router";
import { IdentityKitAuthType, InternetIdentity, NFIDW, OISY } from "@nfid/identitykit";

import MotionProposalCreation from "./pages/proposals/create/motion proposal/page";
import { Buffer } from "buffer";
import Community from "./pages/community/page";
import CreateNft from "./pages/digital taonga/create/page";
import CreateProposal from "./pages/proposals/create/page";
import DigitalTaongaProposalCreation from "./pages/proposals/create/digital taonga proposal/page";
import FAQ from "./pages/faq/page";
import FirstSteps from "./pages/first steps/page";
import GuardianProposalCreation from "./pages/proposals/create/guardian proposal/page";
import Home from "./pages/Home";
import { IdentityKitProvider } from "@nfid/identitykit/react";
import Layout from "./components/shared/Layout";
import Login from "./pages/login/page";
import NftDetail from "./pages/digital taonga/[id]/page";
import Nfts from "./pages/digital taonga/page";
import Notifications from "./pages/notifications/page";
import OnBoarding from "./pages/on boarding/page";
import Profile from "./pages/profile/page";
import ProfileDigitalAccess from "./pages/profile/digital access/page";
import ProfileHelp from "./pages/profile/help/page";
import ProfileProposals from "./pages/profile/proposals/page";
import ProfileSettings from "./pages/profile/settings/page";
import ProposalDetail from "./pages/proposals/[id]/page";
import Proposals from "./pages/proposals/page";
import Calendar from "./pages/calendar/page"
import React from "react";
import ReactDOM from "react-dom/client";
import Support from "./pages/profile/help/support/page";
import AssignRole from "./pages/assign role/page";
import InviteNewMemberPage from "./pages/invite new member/page";

global.Buffer = Buffer;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <IdentityKitProvider
      authType={IdentityKitAuthType.DELEGATION}
      signers={[InternetIdentity, NFIDW]}
      theme="light"
      // featureSigner={}
      // signerClientOptions={{
      //   targets: [], // **IMPORTANT**: these are *your* canisters, not ledger canisters
      // }}
    >
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="proposals">
              <Route index element={<Proposals />} />
              <Route path="create">
                <Route index element={<CreateProposal />} />
                <Route path="Motion proposal" element={<MotionProposalCreation />} />
                <Route path="Digital Taonga proposal" element={<DigitalTaongaProposalCreation />} />
                <Route path="Guardian proposal" element={<GuardianProposalCreation />} />
              </Route>
              <Route path=":id" element={<ProposalDetail />} />
            </Route>
            <Route path="on_boarding" element={<OnBoarding />} />
            <Route path="first_steps" element={<FirstSteps />} />
            <Route path="assign-role" element={<AssignRole />} />
            <Route path="invite-new-member" element={<InviteNewMemberPage />} />
            <Route path="digital-taonga">
              <Route index element={<Nfts />} />
              <Route path="create" element={<CreateNft />} />
              <Route path=":id" element={<NftDetail />} />
            </Route>
            <Route path="notifications" element={<Notifications />} />
            <Route path="community" element={<Community />} />
            <Route path="calendar" element={<Calendar />}/> 
            <Route path="profile">
              <Route index element={<Profile />} />
              <Route path="settings" element={<ProfileSettings />} />
              <Route path="proposals" element={<ProfileProposals />} />
              <Route path="help">
                <Route index element={<ProfileHelp />} />
                <Route path="support" element={<Support />} />
              </Route>
              <Route path="digital-access" element={<ProfileDigitalAccess />} />
            </Route>
            <Route path="faqs" element={<FAQ />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </IdentityKitProvider>
  </React.StrictMode>
);
