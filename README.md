# `digitaonga-dao`

**DigitaOnga DAO** is a decentralized autonomous organization designed to **preserve, govern, and share cultural and digital heritage** (from the Māori word *taonga*, meaning treasures).  
Built on the **Internet Computer (IC)**, DigitaOnga DAO empowers communities, NGOs, and cultural leaders to take part in transparent decision-making, policy creation, and collective ownership of their digital treasures.  

🌐 **Live App:** [https://ep6bk-xaaaa-aaaal-qsmxq-cai.icp0.io/](https://m33pu-aiaaa-aaaap-qqdoq-cai.icp0.io/)

---

## ✨ Vision

- **Community-first governance**: decisions made transparently, with roles and permissions managed by the DAO.  
- **Cultural preservation**: safeguard indigenous and local knowledge digitally and ensure its intergenerational continuity.  
- **Decentralized democracy**: from proposals to petitions, every voice counts.  
- **Scalable infrastructure**: modular canister architecture to support future growth (treasury, NFT registries, cultural archives).  

---

## 🚀 Roadmap & Progress

| Milestone | Duration | Owner | Status | Highlights |
|-----------|----------|-------|--------|------------|
| **1. UX/UI Design** | 3 weeks | Aldana Cueva | ✔ Completed | Redesigned IA, onboarding, roles, proposals, voting, treasury, full prototype |
| **2. Backend Development** | 6 weeks | Francisco Rappazzini | ✔ Completed | Governance canister, role management, proposal & voting logic |
| **3. DigitaOnga 3D NFTs** | 1 week | Lucía Mamud & Francisco Rappazzini | ⬜ Pending | NERF scans cleanup, metadata docs, NFT engine integration, asset optimization |

---

## 🧑‍🤝‍🧑 Community Elements

### **User Personas**
- **Cultural Leaders / Archivists**  
  - Safeguard heritage, educate others, seek secure governance platforms.  
- **Community Members**  
  - Participate in governance, motivated to protect identity and knowledge.  
- **NGOs / Activists**  
  - Require democratic, transparent policy-making tools for advocacy.  

### **Community Modules in App**
- **Community Tab**: browse members, roles, and active contributors.  
- **Profiles**: basic user metadata, role, and proposal history.  
- **Calendar**: track upcoming votes, governance events, and community meetings.  
- **Feedback Channels**: comments, votes, and non-binding “sentiment reactions” for inclusivity.  

---

## 🧩 Canister Architecture

DigitaOnga DAO is designed with modular canisters:

1. **Identity Canister** – login, verification, onboarding.  
2. **Membership Canister** – manage roles (Admin, Member, Delegate).  
3. **Proposal Canister** – create, list, comment, vote on proposals.  
4. **Voting Canister** – thresholds, quorum, execution logic.  
5. **Policy Canister** (Phase 2) – structured policy-making with delegate/community feedback.  
6. **Petition Canister** (Phase 2) – petition creation and escalation.  
7. **Treasury Canister** (Future) – manage DAO funds and grant allocations.  

---

## 📡 Candid APIs (Examples)

### Membership Canister
```candid
service : {
  create_role: (text) -> (bool);
  assign_role: (principal, text) -> ();
  get_roles: (principal) -> (vec text);
  remove_role: (principal, text) -> ();
}
```

### Proposal Canister
```candid
service : {
  submit_proposal: (record {
    title: text;
    description: text;
    created_by: principal;
  }) -> (nat);

  get_proposals: () -> (vec record {
    id: nat;
    title: text;
    status: text;
  });

  vote: (nat, variant { Approve; Reject; Abstain }) -> ();
  comment: (nat, text) -> ();
}
```

### Policy Canister
```candid
service : {
  create_policy: (text, text) -> (nat);
  provide_feedback: (nat, text) -> ();
  delegate_review: (nat, text) -> ();
  finalize_policy: (nat) -> (bool);
}
```

---

## ⚙️ Data Flow

1. **Login** → Identity Canister authenticates user.  
2. **Membership** → Role/permissions validated.  
3. **Proposal Submission** → Stored in Proposal Canister.  
4. **Voting** → Handled by Voting Canister using thresholds.  
5. **Execution** → If passed, actions triggered (role updates, treasury actions, policy adjustments).  
6. **Petitions** → Escalated into proposals if sufficient support.  

---

## 📂 Repository Structure

```
digitaonga-dao/
├── canisters/
│   ├── identity/       # Authentication, login flows
│   ├── membership/     # Roles, permissions, registry
│   ├── proposals/      # Proposal creation, comments, states
│   ├── voting/         # Voting rules, thresholds
│   ├── policy/         # Policy-making system (Phase 2)
│   ├── petitions/      # Petition system (Phase 2)
│   └── treasury/       # DAO treasury (Future)
├── frontend/           # React/Next.js app (agent-js integration)
├── candid/             # .did files for APIs
├── dfx.json            # Project config
└── README.md
```

---

## 🛠️ Running the Project Locally

```bash
# Start local replica
dfx start --background

# Deploy canisters
dfx deploy
```

Local frontend:  
`http://localhost:8080` → proxies backend at `:4943`  

Generate Candid after backend changes:  
```bash
npm run generate
```

---

## 📌 Next Steps

- Collect feedback from Amnesty NZ pilot.  
- Expand **Policy** & **Petition** modules.  
- Launch **Treasury** for community-driven funding.  
- Connect to cultural digital assets (NFT registries, archives).  

---

## 📚 Resources

- [Internet Computer Quick Start](https://internetcomputer.org/docs/current/developer-docs/setup/deploy-locally)  
- [Rust Canister Development](https://internetcomputer.org/docs/current/developer-docs/backend/rust/)  
- [ic-cdk](https://docs.rs/ic-cdk)  
- [Candid Intro](https://internetcomputer.org/docs/current/developer-docs/backend/candid/)  
