import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";

import Button from "../../../components/shared/Button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link } from "react-router";

const data = [
  { description: "This is a sample description", title: "Request N°09123" },
  { description: "This is a sample description 2", title: "Request N°09124" },
];

const ProfileHelp = () => {
  return (
    <main>
      <h1>HELP</h1>
      <h3>SUBMITTED REQUESTS</h3>

      {data.map((r) => (
        <Accordion key={r.title}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${r.title}-content`}
            id={`panel${r.title}-header`}
          >
            <Typography component="span">{r.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography component="span">{r.description}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}

      <div className="absolute bottom-4 inset-x-0 z-10 grid gap-4 place-items-center">
        <Link to="/profile/help/support">
          <Button variant="kokowai">Get Support</Button>
        </Link>
      </div>
    </main>
  );
};

export default ProfileHelp;
