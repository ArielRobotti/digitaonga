import { Dialog, DialogContent, IconButton, TextField } from "@mui/material";

import ActionCard from "../../../../components/proposals/create/ActionCard";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Button from "../../../../components/shared/Button";
import { CloseIcon } from "../../../../components/ui/icons";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
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

const GuardianProposalCreation = () => {

  const { user } = useAuth();
  const [dao] = useCanister()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) { navigate("/") }
  }, [user])

  const [form, setForm] = useState({
    principal: "",
    deadline: dayjs(new Date().toDateString()),
    impact: "",
    description:"",
  });
  const [open, setOpen] = useState(false);
  const [responseDialog, setResponseDialog] = useState({ success: false, error: false });
  const [selectedValue, setSelectedValue] = useState(null);
  const { createProposal, creating } = useProposal();

  // TODO (fran): validar datos de form antes de seguir

  const handleRadioChange = (e) => setSelectedValue(e.target.value);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleResponseError = () => setResponseDialog({ success: false, error: true });
  const handleResponseSuccess = () => setResponseDialog({ success: true, error: false });
  const handleCloseResponseDialog = () => setResponseDialog({ success: false, error: false });
  const toggleDialog = () => setOpen(!open);

  const handleSubmit = async () => {
    try {
      const deadline = BigInt(form.deadline?.unix() * 1_000_000_000)
      const guardianSelectedAction =
        selectedValue === "Assign as Observer"
          ? {AssignAsObserver: [Principal.fromText(form.principal), deadline ]}
          : { RemoveFromDao: [Principal.fromText(form.principal), deadline ]}

      const proposalArgs = {
        title: selectedValue,
        description: form.description,
        extendedData: [],
        impact: form.impact,
        extendedData: [],
        kind: {
          Guardian: guardianSelectedAction
        },
        deadline
      }
      const response = await dao.create_proposal(proposalArgs)
      console.log(response)

      // await createProposal({
      //   title: selectedValue,
      //   description: `${selectedValue} ${form.principal}`,
      //   kind: {
      //     Guardian: {
      //       [guardianSelectedAction]: [
      //         str2p(form.principal),
      //         form.deadline?.unix() * 1_000_000_000,
      //       ],
      //     },
      //   },
      //   deadline: form.deadline?.unix() * 1_000_000_000,
      // });
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
        <TextField
          label="Principal ID"
          variant="outlined"
          onChange={handleChange}
          value={form.principal}
          name="principal"
          required
          className="material_input md:max-w-[500px] md:w-full"
        />

        <TextField
          label="Foundations"
          variant="outlined"
          onChange={handleChange}
          value={form.description}
          name="description"
          required
          className="material_input md:max-w-[500px] md:w-full"
        />

        <TextField
          label="Impact"
          variant="outlined"
          onChange={handleChange}
          value={form.impact}
          name="impact"
          required
          className="material_input md:max-w-[500px] md:w-full"
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
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

      <section className="grid place-items-center gap-4 p-10 ">
        <h4 className="uppercase">What action should be proposed?</h4>
        {/* <p className="text-red-900">Choose the type of role change you want to propose.</p> */}

        <div className="flex flex-col md:flex-row md:flex-wrap justify-center gap-4">
          {guardianProposalActions.map((p) => (
            <ActionCard
              key={p.title}
              {...p}
              selectedValue={selectedValue}
              handleRadioChange={handleRadioChange}
            />
          ))}
        </div>
      </section>

      {/* TODO (fran): crear custom dialog */}
      <Dialog onClose={toggleDialog} open={open} fullWidth maxWidth="xs">
        <h3 className="text-[#525252] text-center p-4 pt-6">PROPOSAL SUMMARY</h3>
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
          <p>
            <span className="font-bold">Principal:</span> {form.principal}
          </p>
          <p>
            <span className="font-bold">Action:</span> {selectedValue}
          </p>
          <p>
            <span className="font-bold">Deadline:</span> {form.deadline.format("DD/MM/YYYY")}
          </p>
        </DialogContent>

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
          disabled={!form.principal || !form.deadline || !selectedValue}
        >
          Create proposal
        </Button>
        <ProgressBar step={2} totalSteps={4} />
      </div>
    </main>
  );
};

export default GuardianProposalCreation;
