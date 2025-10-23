import {
  Dialog,
  DialogContent,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";

import Button from "../../components/shared/Button";
import { CloseIcon, FilterIcon } from "../../components/ui/icons";
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

  const [membersShown, setMembersShown] = useState([])
  const [filterModal, setFilterModal] = useState(false)
  // const [searchQuery, setSearchQuery] = useState("")
  const [optionFilterSelected, setOptionFilterSelected] = useState("All Members")

  // Store
  const [daoAuth, dao] = useCanister();
  const { member } = useMemberStore();
  
   const modalRef = useRef(null);


  // Dialog
  const toggleDialog = () => setOpen(!open);
  const toggleOpenDialog = () => setOpenDialog(!openDialog);
  const toggleFilterModal = () => setFilterModal(!filterModal);

  // Handlers
  const handleChange = (e) => setValue(e.target.value);
  const handleSelectMember = (member) => {
    setSelectedMembers((prev) => {
      if (prev.includes(member)) return prev.filter((m) => m !== member);
      return [...prev, member];
    });
  };

  const handleFilter = (op = null) => {
    console.log({op})
    if(!op) {
      setOptionFilterSelected("All Members");
      setMembersShown(members.data)
    } else {
      console.log(op)
      console.log(members.data[0].role)
      setOptionFilterSelected(op + "s");
      setMembersShown(members.data.filter(member => member.role == op))
    }
    toggleFilterModal(false)
  };

  const handleFilterSearch = (query) => {
    if (!query.trim()) return;
    const filtered = members.data.filter(
      (member) => 
        member.name[0]?.toLowerCase().includes(query.trim().toLowerCase()) ||
        member.principal === query 
    );
    setMembersShown(filtered);
    setOptionFilterSelected("Search")
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
        setMembersShown(data)
      } catch (err) {
        console.error("Error fetching members:", err);
        setMembers({ loading: false, data: [] });
      }
    };
    getAllMembers();
  }, [dao]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setFilterModal(false);
      }
    };

    if (filterModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterModal]);


  return (
    <main>
      <header className="w-full flex p-[20px] md:p-[32px] justify-between select-none items-center">
        <h4>MEMBERS</h4>
        <div className="relative" ref={modalRef}>
          <div className="flex items-center cursor-pointer" onClick={toggleFilterModal}>  
            <p>{optionFilterSelected}</p>
            <FilterIcon/>
          </div>

          {filterModal && (
            <div className="absolute top-full right-0  bg-kokowai text-gray-300 w-54 shadow-lg rounded-lg py-4 z-50">
              <p className="mx-4 py-3 hover:text-white cursor-pointer" onClick={() => handleFilter(null)}>All Members</p>
              <p className="mx-4 py-3 hover:text-white cursor-pointer" onClick={() => handleFilter("Admin")}>Admins</p>
              <p className="mx-4 py-3 hover:text-white cursor-pointer" onClick={() => handleFilter("Guardian")}>Guardians</p>
              <p className="mx-4 py-3 hover:text-white cursor-pointer" onClick={() => handleFilter("Observer")}>Observers</p>
              <input
                className="mx-4 mt-2 flex-1 py-1 rounded w-50 bg-transparent text-gray-200 placeholder-gray-400 focus:outline-none focus:border-white"
                type="text"
                placeholder="Search by Name or ID"
                onChange={(e) => handleFilterSearch(e.target.value)}
              />

            </div>
          )}
        </div>
      </header>
      <section className="lg:max-w-[800px] lg:m-auto p-4 pb-20">
        {members.loading ? (
          <LoadingIcon />
        ) : members.data.length > 0 ? (
          membersShown.map((member) => (
            <MemberCommunityCard
              key={member.principal}
              {...member}
              handleSelectMember={handleSelectMember}
            />
          ))
        ) : (
          <p>No members found.</p>
        )}
      </section>

      {members.data.length > 0 && !members.loading  && member.data?.role == "Admin" &&(
        <div className="fixed bottom-4 inset-x-0 z-10 grid gap-4 place-items-center">
          <Button
            className="w-[340px]"
            variant="kokowai"
            // disabled={true}
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
