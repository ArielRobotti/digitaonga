import { Checkbox } from "@mui/material";
import { MoreOptionsIcon } from "../ui/icons";
import { useState } from "react";

const MemberCommunityCard = () => {
  const [checked, setChecked] = useState(false);

  const handleChange = () => setChecked(!checked);

  return (
    <article className="px-4 py-2.5 flex items-center gap-4" onClick={handleChange}>
      <Checkbox checked={checked} inputProps={{ "aria-label": "controlled" }} />

      <div className="w-14 h-14 bg-gray-500" />

      <section>
        <h4>Name Surname</h4>
        <p>Description</p>
      </section>

      <section className="cursor-pointer grid place-items-center gap-1 ml-auto">
        <MoreOptionsIcon />
        <span>Edit role</span>
      </section>
    </article>
  );
};

export default MemberCommunityCard;
