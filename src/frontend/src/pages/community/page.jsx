import {
  Dialog,
  DialogContent,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useEffect, useState } from "react";

import Button from "../../components/shared/Button";
import { CloseIcon } from "../../components/ui/icons";
import LoadingIcon from "../../components/loading/LoadingIcon";
import MemberCommunityCard from "../../components/community/MemberCommunityCard";
import { memberParser } from "../../utils/parsers";
import { str2p } from "../../utils/functions";
import useCanister from "../../hooks/useCanister";
import useMemberStore from "../../store/useMemberStore";
import { Principal } from "@dfinity/principal"

const Community = () => {
  // State
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [value, setValue] = useState(null);
  const [members, setMembers] = useState({ loading: true, data: [] });
  const [selectedMembers, setSelectedMembers] = useState([]);

  // Store
  const [daoAuth, dao] = useCanister();
  const { member } = useMemberStore();
  const admin = member.data?.role

  // console.log({ member });

  // if (!member.data || member.data?.role === "Admin")
  //   return (
  //     <main className="p-8">
  //       <h1 className="text-center text-2xl mt-10">404 - Page Not Found</h1>
  //       <p className="text-center mt-4">Sorry, the page you are looking for does not exist.</p>
  //     </main>
  //   );

  // Dialog
  const toggleDialog = () => setOpen(!open);
  const toggleOpenDialog = () => setOpenDialog(!openDialog);

  // Handlers
  const handleChange = (e) => setValue(e.target.value);
  const handleSelectMember = (member) => {
    setSelectedMembers((prev) => {
      if (prev.includes(member)) return prev.filter((m) => m !== member);
      return [...prev, member];
    });
  };

  const batchUpdateMemberRole = async () => {
    if (!dao) return;
    try {
      const roles = {
        guardian : { Guardian: null },
        observer : { Observer: null },
        admin : { Admin: null }
      }
      console.log(roles[value])

      await daoAuth.batch_update_member_role(
        selectedMembers.map((p) => Principal.fromText(p)),
        roles[value]
      );
      setSelectedMembers([]);
      toggleDialog();
      toggleOpenDialog();
    } catch (err) {
      console.error("Error updating member roles:", err);
    }
  };

  useEffect(() => {
    const getAllMembers = async () => {
      if (!dao) return;
      try {
        const members = await dao.get_all_members();
        const data = members.map(memberParser);

        setMembers({ loading: false, data });
      } catch (err) {
        console.error("Error fetching members:", err);
        setMembers({ loading: false, data: [] });
      }
    };
    getAllMembers();
  }, [dao]);

  return (
    <main>
      <section className="lg:max-w-[800px] lg:m-auto p-4">
        {members.loading ? (
          <LoadingIcon />
        ) : members.data.length > 0 ? (
          members.data.map((member) => (
            <MemberCommunityCard
              key={member.id}
              {...member}
              handleSelectMember={handleSelectMember}
            />
          ))
        ) : (
          <p>No members found.</p>
        )}
      </section>

      {members.data.length > 0 && !members.loading  && member.data?.role == "Admin" &&(
        <div className="absolute bottom-4 inset-x-0 z-10 grid gap-4 place-items-center">
          <Button
            className="w-[340px]"
            variant="kokowai"
            // disabled={}
            onClick={() => setOpen(true)}
          >
            Update roles
          </Button>

          {/* <ProgressBar step={1} totalSteps={4} /> */}
        </div>
      )}

      <Dialog onClose={toggleDialog} open={open} fullWidth>
        <h3 className="text-[#525252] text-center p-4 pt-6">ASSIGN ROLE</h3>
        <IconButton
          aria-label="close"
          onClick={toggleDialog}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent className="grid gap-4">
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={value}
              onChange={handleChange}
            > 
              <FormControlLabel value="admin" control={<Radio />} label="Admin" />
              <FormControlLabel value="guardian" control={<Radio />} label="Guardian" />
              <FormControlLabel value="observer" control={<Radio />} label="Observer" />

            </RadioGroup>
          </FormControl>
        </DialogContent>

        <section className="w-full flex justify-center gap-4 p-4 pb-6">
          <Button size="small" onClick={ toggleDialog }>
            Cancel
          </Button>
          <Button
            size="small"
            variant="kokowai"
            onClick={ batchUpdateMemberRole }
          >
            Submit
          </Button>
        </section>
      </Dialog>

      <Dialog onClose={toggleOpenDialog} open={openDialog} fullWidth>
        <IconButton
          aria-label="close"
          onClick={toggleOpenDialog}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent>
          <h5 className="text-center">Role assigned successfully!</h5>
        </DialogContent>

        <section className="w-full flex justify-center gap-4 p-4 pb-6">
          <Button size="small" variant="kokowai" onClick={toggleOpenDialog}>
            Accept
          </Button>
        </section>
      </Dialog>
    </main>
  );
};

export default Community;
