
import { Dialog, DialogContent, IconButton, TextField, FormControl, InputLabel, Select, MenuItem, Box,} from "@mui/material";

import ActionCard from "../../../../components/proposals/create/ActionCard";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Button from "../../../../components/shared/Button";
import { CloseIcon, AvatarIcon, EyeIcon, RemoveIcon } from "../../../../components/ui/icons";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import ProgressBar from "../../../../components/shared/ProgressBar";
import dayjs from "dayjs";
import { guardianProposalActions } from "../../../../utils/data";
import { str2p } from "../../../../utils/functions";
import useProposal from "../../../../hooks/useProposal";
import { useState, useEffect } from "react";
import useCanister from "../../../../hooks/useCanister"
import { useAuth } from "@nfid/identitykit/react";
import { Principal } from "@dfinity/principal";
import { useNavigate } from "react-router";
import { blobToImageUrl } from "../../../../utils/imageManager";

const GuardianProposalCreation = () => {

  const { user } = useAuth();
  const [dao] = useCanister()
  const [allMembers, setAllMembers] = useState([])
  const [selectedMember, setSelectedMember] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) { navigate("/") }
    const fetchMembers = async () => {
      const response = await dao.get_all_members();
      setAllMembers(response);
    }
    if (dao) { fetchMembers() }
  }, [user, dao])

  const [form, setForm] = useState({
    principal: "",
    deadline: dayjs(new Date().toDateString()),
    impact: "",
    title: "",
    description: "",
  });
  const [open, setOpen] = useState(false);
  const [responseDialog, setResponseDialog] = useState({ success: false, error: false });
  const [selectedValue, setSelectedValue] = useState(null);
  const { createProposal, creating } = useProposal();


  const handleRadioChange = (e) => setSelectedValue(e.target.value);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleResponseError = () => setResponseDialog({ success: false, error: true });
  const handleResponseSuccess = () => setResponseDialog({ success: true, error: false });
  const handleCloseResponseDialog = () => setResponseDialog({ success: false, error: false });
  const toggleDialog = () => setOpen(!open);

  const handleSelectMember = (e) => {
    const selectedPrincipalText = e.target.value;
    const memberObject = allMembers.find(m => m.principal.toText() === selectedPrincipalText);
    setSelectedMember(memberObject || null);
    setSelectedValue(null)
    setForm({...form, principal: memberObject?.principal})
  };

  const optionsForCurrentRole = () => {

    const currentRole = Object.keys(selectedMember.role)[0];
    const removeMember = <ActionCard
      key="remove-member-action"
      title="Remove from DAO"
      subtitle="Revoke this user's access entirely."
      description="Remove the person from the DAO. They will no longer have any access."
      Icon= {RemoveIcon}
      selectedValue={selectedValue}
      // className={selectedMember == null ?  "hidden": ""}
      handleRadioChange={handleRadioChange}
    />
    switch(currentRole) {
      case 'Observer':
        return (
          <div className="flex flex-col md:flex-row md:flex-wrap justify-center gap-4">
            <ActionCard
              key="assign-guardian-action"
              title="Assign as Guardian"
              subtitle="Assign the Guardian role to this user"
              description="They will retain view-only access without the ability to vote or propose changes."
              Icon= {EyeIcon}
              selectedValue={selectedValue}
              // className={selectedMember == null ?  "hidden": ""}
              handleRadioChange={handleRadioChange}
            />
            {removeMember}
          </div>
        );
      case 'Guardian':
        return (
          <div className="flex flex-col md:flex-row md:flex-wrap justify-center gap-4">
            <ActionCard
              key=""
              title="Assign as Observer"
              subtitle="Limit this user's role to observer."
              description="The member will have the ability to create proposals and vote on third-party proposals."
              Icon= {EyeIcon}
              selectedValue={selectedValue}
              // className={selectedMember == null ?  "hidden": ""}
              handleRadioChange={handleRadioChange}
            />
            {removeMember}
          </div>
        )
        
    }
  }

  const handleSubmit = async () => {
    try {
      const deadline = BigInt(form.deadline?.unix() * 1_000_000_000)
      const guardianSelectedAction =
        selectedValue === "Assign as Observer"
          ? { AssignAsObserver: [form.principal, deadline] }
          : { RemoveFromDao: [form.principal, deadline] }

      const proposalArgs = {
        title: form.title,
        description: form.description,
        extendedData: [],
        impact: selectedValue,
        extendedData: [],
        kind: {
          Guardian: guardianSelectedAction
        },
        deadline
      }
      const response = await dao.create_proposal(proposalArgs)
      console.log(response)

      toggleDialog();
      handleResponseSuccess();
    } catch (err) {
      console.log("createProposal error:", err);
      handleResponseError();
    }
  };

  return (
    <main>
      <section className="grid md:place-items-center p-6">
        <h4 className="uppercase mb-4">Guardian proposal</h4>
        <p>
          Used to add, update, or remove a Guardian. Requires an approved vote before execution.
        </p>
      </section>

      <section className="grid md:place-items-center gap-8 p-6">

        <FormControl
          variant="outlined"
          className="material_input md:max-w-[500px] md:w-full bg-white"
          required
        >
          <InputLabel id="taonga-select-label">Select Member</InputLabel>

          <Select
            labelId="taonga-select-label"
            value={selectedMember?.principal ? selectedMember.principal.toText() : ""} 
            onChange={handleSelectMember}
            label="Choose Member"
            className="h-14 bg-white!"
            MenuProps={{
              PaperProps: {
                className: "custom-scrollbar",
                style: {
                  maxHeight:500,  
                },
              },
            }}
          >

            {allMembers.map((m) => {
              const principalText = m.principal.toText();
              const avatar = m.profile_pic[0] ?
                <img
                  src={blobToImageUrl(m.profile_pic[0])}
                  alt={m.name}
                  className="w-14 h-14 rounded-full object-cover ml-4" 
                />
                : 
                <AvatarIcon className="w-14 h-14 rounded-full object-cover ml-4"/>;

              return (
                <MenuItem key={principalText} value={principalText} className="">
                  <Box className="flex items-center justify-between w-full pr-4">
                    <span className="text-gray-600 w-20">{m.name[0]? m.name[0]: "No name"}</span>
                    <span className="text-gray-600">({Object.keys(m.role)[0] })</span>
                    
                    {avatar}
                  </Box>
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <TextField
          label="Title"
          variant="outlined"
          onChange={handleChange}
          value={form.title}
          name="title"
          required
          className="material_input md:max-w-[500px] md:w-full"
        />

        <TextField
          label="Description"
          variant="outlined"
          onChange={handleChange}
          value={form.description}
          name="description"
          required
          className="material_input md:max-w-[500px] md:w-full"
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DateTimePicker
              label="Voting deadline"
              onChange={(v) => setForm({ ...form, deadline: v })}
              value={form.deadline}
              name="deadline"
              disablePast
              className="material_input md:w-[500px]"
            />
          </DemoContainer>
        </LocalizationProvider>
      </section>

      {selectedMember && 
        <section className="grid place-items-center gap-4 p-10 ">
          <h4 className="uppercase">What action should be proposed?</h4>
          {/* <p className="text-red-900">Choose the type of role change you want to propose.</p> */}

          
            {optionsForCurrentRole()}

        </section>
      }

      {/* TODO (fran): crear custom dialog */}
      <Dialog onClose={toggleDialog} open={open} fullWidth maxWidth="xs" className="flex flex-col items-center">
        <p className="text-[#525252] font-medium text-[22px]! p-6 ">Proposal summary</p>
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
        <div className="w-[392px] h-[236px] ">
          <DialogContent className="flex flex-col gap-6 w-[344px] h-[173px] mt-6">
            <p className="truncate w-68">
              <span className="font-bold">Member ID:</span> {form.principal.toString()}
            </p>
            <p>
              <span className="font-bold">Action:</span> {selectedValue}
            </p>
            <p>
              <span className="font-bold">Voting eadline:</span> {form.deadline.format("DD/MM/YYYY")}
            </p>
          </DialogContent>
        </div>

        <section className="w-full flex justify-center gap-4 p-4 pb-6">
          <Button size="small" onClick={toggleDialog}>
            Cancel
          </Button>
          <Button
            size="small"
            variant="kokowai"
            onClick={handleSubmit}
            disabled={!form.principal || !form.deadline || !selectedValue || creating}
          >
            Submit
          </Button>
        </section>
      </Dialog>
      {/* TODO (fran): ver que cuando se cierre este dialog deberia mandarlo a la proposal o la lista de proposals */}
      <Dialog
        onClose={handleCloseResponseDialog}
        open={responseDialog.success || responseDialog.error}
        fullWidth
        maxWidth="xs"
      >
        <IconButton
          aria-label="close"
          onClick={handleCloseResponseDialog}
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
          <h5 className="text-center">
            {responseDialog.success ? "Proposal created successfully!" : "Error creating proposal"}
          </h5>
        </DialogContent>

        <section className="w-full flex justify-center gap-4 p-4 pb-6">
          <Button size="small" variant="kokowai" onClick={handleCloseResponseDialog}>
            Accept
          </Button>
        </section>
      </Dialog>

      <div className="grid place-items-center">
        <Button
          className="shadow-[0px_4px_8px_0px_#00000026,0px_1px_3px_0px_#0000004c] border-none"
          variant="kokowai"
          onClick={() => setOpen(true)}
          disabled={!form.principal || !form.deadline || !selectedValue || !form.title || !form.description}
        >
          Create proposal
        </Button>
        <ProgressBar step={2} totalSteps={4} />
      </div>
    </main>
  );
};

export default GuardianProposalCreation;
