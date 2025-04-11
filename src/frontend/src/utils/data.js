import {
  ActionProposalIcon,
  DigitalTaongaProposalIcon,
  DownloadIcon,
  GuardianProposalIcon,
  PencilIcon,
  TrashIcon,
  UploadIcon,
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

export const digitalTaongaProposals = [
  {
    title: "Create or Upload a New Digital Taonga",
    subtitle: "For Adding New Cultural Assets.",
    description:
      "Guardians can propose the creation or upload of new Digital Taonga to preserve and share cultural heritage within the DAO framework.",
    Icon: UploadIcon,
  },
  {
    title: "Update an Existing Digital Taonga",
    subtitle: "For Editing Asset Information.",
    description:
      "Guardians can propose updates to the metadata, details, or attributes of an existing Digital Taonga, ensuring its accuracy and relevance.",
    Icon: PencilIcon,
  },
  {
    title: "Delete an Existing Digital Taonga",
    subtitle: "For Removing Cultural Assets.",
    description:
      "Guardians can propose the removal of a Digital Taonga from the DAO. This ensures outdated or inappropriate assets are managed responsibly.",
    Icon: TrashIcon,
  },
  {
    title: "Request Download Permission",
    subtitle: "For Accessing Assigned Cultural Assets.",
    description:
      "Guardians can propose to request download permissions for a specific Digital Taonga. This ensures controlled access to assets, respecting the DAO's governance and security principles.",
    Icon: DownloadIcon,
  },
];

export const updateAnExistingDigitalTaonga = [
  {
    title: "Update Digital Taonga Description",
    subtitle: "For editing the description of an existing asset.",
    description:
      "Propose updates to the description of an existing Digital Taonga to enhance its clarity and accuracy. All changes must be reviewed and approved by the DAO community.",
    Icon: PencilIcon,
  },
  {
    title: "Update Digital Taonga File",
    subtitle: "For modifying files of existing assets.",
    description:
      "Suggest uploading an updated version of an existing file, such as a higher-quality scan, to maintain the asset's quality and relevance. New files require DAO community approval before implementation.",
    Icon: UploadIcon,
  },
];
