import { Checkbox } from "@mui/material";
import { MoreOptionsIcon } from "../ui/icons";
import { shortP } from "../../utils/functions";
import { useState } from "react";

const MemberCommunityCard = ({
  principal,
  created_at,
  role,
  selectedMember,
  handleSelectMember,
}) => {
  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    handleSelectMember(principal);
    setChecked(!checked);
  };

  // Convert created_at timestamp to a legible date string
  const formattedDate = new Date(created_at / 1_000_000).toLocaleDateString();

  return (
    <article
      className="px-4 py-2.5 flex items-center gap-4 cursor-pointer hover:bg-gray-200"
      onClick={handleChange}
    >
      <Checkbox checked={checked} inputProps={{ "aria-label": "controlled" }} />

      <div className="w-14 h-14 bg-gray-500" />

      <section>
        <h4>
          {shortP(principal)} ({role})
        </h4>
        <p>Joined at: {formattedDate}</p>
      </section>

      <section className="cursor-pointer grid place-items-center gap-1 ml-auto">
        <MoreOptionsIcon />
        <span>Edit role</span>
      </section>
    </article>
  );
};

export default MemberCommunityCard;
