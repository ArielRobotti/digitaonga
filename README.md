# `digitaonga-dao`

**DigitaOnga DAO** is a decentralized autonomous organization designed to **preserve, govern, and share cultural and digital heritage** (from the Māori word *taonga*, meaning treasures).  
Built on the **Internet Computer (IC)**, DigitaOnga DAO empowers communities, NGOs, and cultural leaders to take part in transparent decision-making, policy creation, and collective ownership of their digital treasures.  

🌐 **Live App:** [(https://m33pu-aiaaa-aaaap-qqdoq-cai.icp0.io/)](https://m33pu-aiaaa-aaaap-qqdoq-cai.icp0.io/)

---

## ✨ Vision

-   **Community-centric Governance**: Decisions are made transparently, with roles and permissions managed by the DAO.
-   **Cultural Preservation**: Digitally safeguarding indigenous and local knowledge, ensuring its intergenerational continuity.
-   **Decentralized Democracy**: From proposals to votes, every voice counts in the governance of digital assets.

---

## 🚀 Key Features

*   **Community-Driven Governance**: Engage in transparent decision-making through a robust proposal and voting system.
*   **Recursive Commenting System**: Members can participate in detailed discussions on proposals, providing nested comments to foster in-depth dialogue and community feedback.
*   **Interactive Taonga Creation**: Propose the minting of new digital Taongas with advanced preview capabilities.
*   **GLB Preview & Screenshot Tool**: Before submitting a proposal for a new Taonga, users can upload and interactively preview their 3D GLB asset. This feature also allows capturing a screenshot of the GLB model to serve as a compelling visual preview for the proposal itself.
*   **Decentralized Asset Management**: Each digital Taonga is deployed as an independent canister on the Internet Computer, ensuring its sovereignty and long-term preservation.
*   **Transparent Funding**: Clear accounting of cycle costs for Taonga deployment, ensuring sustainability and community oversight.

---

## 🏛️ Core Architecture

The system has evolved to an architecture featuring a single main canister (`dao`) that orchestrates the creation and management of digital "Taongas." Each Taonga is an independent canister containing a 3D digital asset (a `.glb` file).

The workflow for creating a new Taonga is as follows:

1.  **Proposal Creation**: A DAO member with the appropriate permissions creates a proposal to mint a new Taonga.
    *   **GLB Asset Preview**: Users can upload their `.glb` file to a temporary viewer to ensure the 3D model appears as intended.
    *   **Screenshot for Proposal**: During the preview, users can capture a screenshot of their 3D model, which will be included as the visual representation of the Taonga in the proposal.
    *   The proposal includes metadata such as the asset's name, description, and purpose.

    <!-- Placeholder for screenshot: GLB preview and screenshot capture interface -->

2.  **Voting and Approval**: The DAO community votes on the proposal. Pre-defined quorum and approval thresholds are applied. Members can engage in detailed discussions using the **recursive commenting system** to provide feedback and context for their votes.

    <!-- Placeholder for screenshot: Proposal page with recursive comments -->

3.  **Funding and Automated Deployment**: Once a proposal is approved, the process is triggered:
    a.  **Cycle Cost**: A fixed cost of **2 Trillion Cycles (2TC)** is deducted from the main DAO canister. This fee covers the new canister's deployment and provides it with a large operational reserve for long-term autonomy.
    b.  **Canister Creation**: The main DAO canister calls the IC's management canister to create a new, empty canister.
    c.  **Wasm Installation**: The `Taonga` canister's Wasm is installed into the newly created canister. This Wasm contains the logic for storing and managing a single digital asset.

4.  **Digital Asset (GLB) Upload**: After the successful deployment of the new Taonga canister, the proposer (or an assigned role) is notified to upload the main asset file (`.glb`) to the newly created canister.

5.  **Registration and Completion**: The main canister registers the new Taonga canister's address (Principal ID), linking it to the original proposal and marking the process as complete. The Taonga is now visible and managed by the DAO.

This model allows for near-infinite scalability of digital assets, where each resides in its own secure and sovereign environment while being governed collectively by the main DAO.

>   **Note**: The cycles balance of any Taonga canister can be monitored on the [Internet Computer dashboard](https://dashboard.internetcomputer.org/) by looking up its Canister ID and calling the standard `balance` function.

---

## 🛠️ Development and Deployment

This project requires a specific deployment workflow, as the `taonga` canister is a class that gets deployed programmatically by the main DAO canister, not directly from the command line.

### 1. Local Development Setup

To run a full local environment for development and testing:

```bash
# 1. Start the local Internet Computer replica in a clean state
dfx start --background --clean

# 2. Install project dependencies from the root directory
npm install
mops install

# 3. Deploy the development version of the main DAO canister locally
dfx deploy motokoDaoDev

# 4. Navigate to the frontend directory and start the dev server
cd src/frontend
npm start
```

The frontend will be available at `http://localhost:3000`.

### 2. Deployment to the IC (Mainnet)

Deployment to the mainnet is done in two separate stages: deploying the backend canister and deploying the frontend canister.

#### Backend Canister Deployment

Deploy the main DAO canister. Choose the command that matches your target environment:

-   **Development/Testing Canister (`motokoDaoDev`)**:
    ```bash
    dfx deploy motokoDaoDev --ic
    ```
-   **Production Canister (`motokoDao`)**:
    ```bash
    dfx deploy motokoDao --ic
    ```

#### Frontend Canister Deployment

All frontend commands must be run from the `src/frontend` directory.

-   **Development/Testing Canister (`frontend-dev`)**:
    ```bash
    # From inside src/frontend
    npm run deploy:front:dev:ic
    ```
-   **Production Canister (`frontend`)**:
    ```bash
    # From inside src/frontend
    npm run deploy:front:prod:ic
    ```

### Generating Declaration Files

If you make changes to the canister interfaces (`.mo` or `.rs` files), you need to regenerate the Candid and frontend declaration files from the project root:

```bash
dfx generate
```

---

## 📂 Repository Structure

```
digitaonga-dao/
├── src/
│   ├── dao/          # Main DAO canister (Motoko)
│   │   ├── main.mo   # Core logic: proposals, voting, deployment
│   │   └── taonga/   # Logic and types for the Taonga canister
│   ├── digital_asset/ # Digital asset canister (Rust)
│   └── frontend/     # React web application
├── dfx.json          # Project and canister configuration
├── package.json      # Node.js dependencies
├── mops.toml         # Motoko dependencies
└── README.md
```
