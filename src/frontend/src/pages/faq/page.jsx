import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "../../components/shared/Accordion";

// FAQ data
const faqs = [
  {
    title: "What is this project about?",
    description: `This project helps indigenous communities safely store, protect, and share their important digital taonga using secure new technologies. We have adopted these new technologies, and are developing them to help create more secure storage options that are community led, and allow for communities to make decisions, guide, and manage their own taonga.\n\nDigitaonga is about using design and technology to enhance intergenerational capacity to exercise tino rangatiratanga and kaitiakitanga. Our approach responds to and seeks to enhance the mana of taonga while responding to the needs of their kaitiaki and communities of origin.`,
  },
  {
    title: "What is a Digital Taonga?",
    description:
      "We use the term Digital Taonga to describe a cultural treasure or prized possession, some may call a cultural artefact, that has been digitised through the process of 3D scanning, imbued with meaning by the community from which it originates, and secured on this digital platform.",
  },
  {
    title: "Why use this technology instead of a regular website or cloud storage?",
    description:
      "Traditional storage can sometimes be controlled by one company or organization. We're using tools that spread the storage across many different locations, making it harder for data to be lost, taken down, or controlled by outsiders. The community remains the true owner.",
  },
  {
    title: "Who gets to make decisions about the digital collections?",
    description: "",
  },
  {
    title: "Is this safe for sensitive cultural material?",
    description: "",
  },
  {
    title: "Will I need special technical skills to use it?",
    description:
      "No. We're designing the system to be simple and user-friendly. Training and ongoing support will also be provided for communities that want it.",
  },
  {
    title: "Who owns the digital materials? ****",
    description:
      "The community always owns their own materials. We place a huge importance on data sovereignty. The technology is just a tool to help store, protect, and manage access - it does not claim any ownership rights.",
  },
  {
    title: "Can digital taonga still be shared publicly if we want?",
    description:
      "Yes. If a community of guardians decides they want to make a digital taonga public, it is their collective choice to share it with the world. But it’s always the community’s choice.",
  },
  {
    title: "What if our community disagrees on how something should be managed?",
    description:
      "The system includes built-in ways for communities to make group decisions, such as voting or council approvals. This way, choices are made fairly and transparently.",
  },
  {
    title: "Is this the same as NFTs or cryptocurrency?",
    description:
      "While some of the underlying ideas and technologies are related, we are focused on storage, governance, and protection - not selling, trading, or making speculative markets. This project is about cultural care, not commercial hype.",
  },
];

const FAQ = () => {
  return (
    <main className="flex flex-col p-5 lg:flex-row lg:p-28">

      {/* Title FAQ*/}
      <div className="w-full h-full pb-8 lg:pb-0 lg:w-1/3">
        <h2>
          FREQUENTLY 
          <br />
          ASKED
          <br />
          QUESTIONS
        </h2>
      </div>

      {/* Content FAQ */}
      <div className="w-full h-full lg:w-2/3">
        <Accordion data={faqs} />
      </div>

    </main>
  );
};

export default FAQ;
