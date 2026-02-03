import {
  ActionProposalIcon,
  AddUserIcon,
  ComputerIcon,
  DebateIcon,
  DigitalTaongaProposalIcon,
  DocumentIcon,
  DownloadIcon,
  EyeIcon,
  GuardianProposalIcon,
  PencilIcon,
  RemoveIcon,
  TrashIcon,
  UploadIcon,
} from "../components/ui/icons";

export const onBoardingSteps = [
  {
    step: 1,
    title: "Digital Taonga Guardianship",
    Icon: ComputerIcon,
    description:
      "View and interact with your digital taonga at any time by visiting the archive where they are securely housed.",
  },
  {
    step: 2,
    title: "Create a proposal",
    Icon: DocumentIcon,
    description:
      "As a guardian, you are able to create proposals about how to care for, manage, view, and share your digital taonga",
  },
  {
    step: 3,
    title: "Vote proposals",
    Icon: DebateIcon,
    description:
      "All proposals are then voted on and either approved or rejected by the other guardians in your community",
  },
  {
    step: 4,
    title: "Invite More Guardians",
    Icon: AddUserIcon,
    description:
      "Expand your community by inviting others who should be involved in the decision-making and care of your digital taonga",
  },
];

export const proposalTypes = [
  {
    title: "Digital Taonga Proposal",
    subtitle: "Looking after your taonga",
    description:
    "Guardians can propose the addition, update, or removal of a Digital Taonga. This process ensures that cultural assets are effectively managed within the DAO framework.",
    Icon: DigitalTaongaProposalIcon,
  },
  {
    title: "Motion proposal",
    subtitle: "Propose ideas and share opinions with your community",
    description:
    "Guardians can propose ideas for the community to vote on, sparking discussion, guiding collective decisions, and leading to more formal actions down the track.",
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

export const guardianProposalActions = [
  {
    title: "Assign as Observer",
    subtitle: "Limit this user's role to observer.",
    description:
      "They will retain view-only access without the ability to vote or propose changes.",
    Icon: EyeIcon,
  },
  {
    title: "Remove from DAO",
    subtitle: "Revoke this user's access entirely.",
    description: "Remove the person from the DAO. They will no longer have any access.",
    Icon: RemoveIcon,
  },
];
