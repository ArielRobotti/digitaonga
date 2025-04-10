import { Dialog, DialogContent, IconButton } from "@mui/material";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Button from "../../../../components/shared/Button";
import { CloseIcon } from "../../../../components/ui/icons";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import ProgressBar from "../../../../components/shared/ProgressBar";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { useState } from "react";

const ActionProposalCreation = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: dayjs(new Date().toDateString()),
  });
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  // TODO (fran): validar datos de form antes de seguir

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const toggleDialog = () => setOpen(!open);
  const toggleOpenDialog = () => setOpenDialog(!openDialog);

  return (
    <main>
      <h4 className="uppercase p-6">Action proposal</h4>

      <section className="grid gap-8 p-12">
        <TextField
          label="Title"
          variant="outlined"
          onChange={handleChange}
          value={form.title}
          name="title"
          required
          className="material_input"
        />
        <TextField
          label="Description"
          variant="outlined"
          onChange={handleChange}
          value={form.description}
          name="description"
          required
          className="material_input"
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              label="Voting deadline"
              onChange={(v) => setForm({ ...form, date: v })}
              value={form.date}
              name="date"
              disablePast
              className="material_input"
            />
          </DemoContainer>
        </LocalizationProvider>
      </section>

      {/* TODO (fran): crear custom dialog */}
      <Dialog onClose={toggleDialog} open={open} fullWidth>
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
            <span className="font-bold">Deadline:</span> {form.date.format("DD/MM/YYYY")}
          </p>
        </DialogContent>

        <section className="w-full flex justify-center gap-4 p-4 pb-6">
          <Button size="small" onClick={toggleDialog}>
            Cancel
          </Button>
          <Button
            size="small"
            variant="kokowai"
            onClick={() => {
              toggleDialog();
              toggleOpenDialog();
              // navigate(`/proposals/create?type=${selectedValue}`);
            }}
          >
            Submit
          </Button>
        </section>
      </Dialog>

      {/* TODO (fran): ver que cuando se cierre este dialog deberia mandarlo a la proposal o la lista de proposals */}
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
          <h5 className="text-center">Proposal created successfully!</h5>
        </DialogContent>

        <section className="w-full flex justify-center gap-4 p-4 pb-6">
          <Button size="small" variant="kokowai" onClick={toggleOpenDialog}>
            Accept
          </Button>
        </section>
      </Dialog>

      <div className="absolute bottom-[72px] left-1/2 transform -translate-x-1/2 grid gap-8 z-0 place-items-center">
        <Button
          className="shadow-[0px_4px_8px_0px_#00000026,0px_1px_3px_0px_#0000004c] border-none"
          variant="kokowai"
          onClick={() => setOpen(true)}
          disabled={!form.title || !form.description || !form.date}
        >
          Create proposal
        </Button>
        <ProgressBar step={2} totalSteps={4} />
      </div>
    </main>
  );
};

export default ActionProposalCreation;
