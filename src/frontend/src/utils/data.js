import {
  ActionProposalIcon,
  DigitalTaongaProposalIcon,
  GuardianProposalIcon,
} from "../components/ui/icons";

export const onBoardingSteps = [
  {
    step: 1,
    title: "Invite members to your DAO",
    description:
      "View the NFTs in the gallery. We use 3D scanning to create high resolution digital taonga. These scans preserve taonga for future generations",
  },
  {
    step: 2,
    title: "NFT Management",
    description:
      "You’ll have on-chain storage fpr 3D high-resolution scans of Māori taonga which you can interact with.",
  },
  {
    step: 3,
    title: "Create a proposal",
    description:
      "Create proposals to transfer tokens, edit their description, and manage them, which will be reviewed and voted on by the other members of the DAO.",
  },
  {
    step: 4,
    title: "Vote proposals",
    description:
      "Proposals are created to suggest changes or actions within the DAO and these are voted on and either approved or rejected by other members.",
  },
];

export const proposalTypes = [
  {
    title: "Digital Taonga Proposal",
    subtitle: "For managing cultural assets.",
    description:
      "Guardians can propose the addition, update, or removal of a Digital Taonga. This process ensures that cultural assets are effectively managed within the DAO framework.",
    Icon: DigitalTaongaProposalIcon,
  },
  {
    title: "Action proposal",
    subtitle: "For suggesting and voting on non-executive decisions.",
    description:
      "Guardians can create Motion Proposals to align the DAO on important matters without executing immediate changes. These proposals facilitate discussion and collective decision-making.",
    Icon: ActionProposalIcon,
  },
  {
    title: "Guardian Proposal",
    subtitle: "For managing DAO membership.",
    description:
      "Guardians can create proposals to add, update, or remove a Guardian. This ensures DAO membership remains controlled and secure, maintaining the integrity of the organization.",
    Icon: GuardianProposalIcon,
  },
];
