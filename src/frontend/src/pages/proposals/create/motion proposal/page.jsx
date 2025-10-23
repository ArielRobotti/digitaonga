import { Dialog, DialogContent, IconButton } from "@mui/material";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Button from "../../../../components/shared/Button";
import { CloseIcon } from "../../../../components/ui/icons";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import ProgressBar from "../../../../components/shared/ProgressBar";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
// import useProposal from "../../../../hooks/useProposal";
import { useState, useEffect } from "react";
import useCanister from "../../../../hooks/useCanister"
import { useAuth } from "@nfid/identitykit/react";
import { useNavigate } from "react-router";

const MotionProposalCreation = () => {
  
  const navigate = useNavigate()
  const { user } = useAuth();

  useEffect(() => {
    if( !user ) { navigate("/") }
  }, [user])

  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: dayjs(new Date().toDateString()),
    impact: "",
  });
  const [open, setOpen] = useState(false);
  const [responseDialog, setResponseDialog] = useState({ success: false, error: false });
  const [disabledButtons, setDisableButtons] = useState(false)
  // const { createProposal, creating } = useProposal();


  const [ dao ] = useCanister()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  // const handleResponseError = () => setResponseDialog({ success: false, error: true });
  // const handleResponseSuccess = () => setResponseDialog({ success: true, error: false });
  const handleCloseResponseDialog = () => setResponseDialog({ success: false, error: false });
  const toggleDialog = () => setOpen(!open); 

  const handleSubmit = async () => {
    setDisableButtons(true)
    
    if ( dao ) {
      const deadline = form.deadline?.unix() * 1_000_000_000
      console.log({deadline})
      try {
        const response = await dao.create_proposal({
          title: form.title,
          description: form.description,
          impact: form.impact,
          extendedData: [],
          kind: {Action: [form.title, form.description, form.deadline?.unix() * 1_000_000_000]},
          deadline: form.deadline?.unix() * 1_000_000_000,
        })
        if(response) {
          navigate("/proposals")
        }
      } catch (e) {
        console.log(e)
      }

    }
  };

  return (
    <main>
      <h4 className="uppercase p-6">Action proposal</h4>
      <p className="px-8">
        This proposals are used for non-binding decisions (e.g. electing a DAO Sheriff)
      </p>

      <section className="grid md:place-items-center gap-8 p-12 w-full">
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
            <span className="font-bold">Title:</span> {form.title}
          </p>
          <p>
            <span className="font-bold">Description:</span> {form.description}
          </p>
          <p>
            <span className="font-bold">Deadline:</span> {form.deadline.format("DD/MM/YYYY")}
          </p>
        </DialogContent>

        <section className="w-full flex justify-center gap-4 p-4 pb-6">
          <Button size="small" onClick={toggleDialog} disabled={disabledButtons}>
            Cancel
          </Button>
          <Button size="small" variant="kokowai" onClick={handleSubmit} disabled={disabledButtons}>
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

      <div className="grid place-items-center inset-x-0 grid gap-8 z-0 place-items-center">
        <Button
          className="shadow-[0px_4px_8px_0px_#00000026,0px_1px_3px_0px_#0000004c] border-none"
          variant="kokowai"
          onClick={() => setOpen(true)}
          disabled={!form.title || !form.description || !form.deadline }
        >
          Create proposal
        </Button>
        <ProgressBar step={2} totalSteps={4} />
      </div>
    </main>
  );
};

export default MotionProposalCreation;
