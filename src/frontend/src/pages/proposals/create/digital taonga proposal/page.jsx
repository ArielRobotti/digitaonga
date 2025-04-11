import { CloseIcon, UploadIcon } from "../../../../components/ui/icons";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Radio,
  styled,
} from "@mui/material";
import { digitalTaongaProposals, updateAnExistingDigitalTaonga } from "../../../../utils/data";
import { useNavigate, useSearchParams } from "react-router";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Button from "../../../../components/shared/Button";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Button as MUIButton } from "@mui/material";
import ProgressBar from "../../../../components/shared/ProgressBar";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { useState } from "react";

const DigitalTaongaProposalCreation = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    history: "",
    file: null,
    date: dayjs(new Date().toDateString()),
  });
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const action = searchParams.get("action");
  const step = !action ? 0 : !form.name || !form.description || !form.history || !form.file ? 1 : 2;

  // TODO (fran): validar datos de form antes de seguir

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleRadioChange = (e) => setSelectedValue(e.target.value);
  const toggleDialog = () => setOpen(!open);
  const toggleOpenDialog = () => setOpenDialog(!openDialog);

  const Content = ({ title, subtitle, description, Icon }) => (
    <article
      key={title}
      className="grid gap-2 p-4 cursor-pointer rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.30),0px_1px_3px_1px_rgba(0,0,0,0.15)]"
      style={{ boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.30), 0px 1px 3px 1px rgba(0,0,0,0.15)" }}
      onClick={() => handleRadioChange({ target: { value: title } })}
    >
      <section className="flex items-center gap-1">
        <Radio
          checked={selectedValue === title}
          onChange={handleRadioChange}
          value={title}
          name="radio-buttons"
          inputProps={{ "aria-label": title }}
          size="small"
        />
        <p className="font-bold">{title}</p>
      </section>
      <section className="flex items-center gap-2">
        {<Icon />}
        <p>{subtitle}</p>
      </section>
      <p>{description}</p>
    </article>
  );

  const SelectedProposal = () => {
    switch (action) {
      case "Create or Upload a New Digital Taonga":
        return (
          <section className="grid gap-8 p-12">
            <TextField
              label="Name"
              variant="outlined"
              onChange={handleChange}
              value={form.name}
              name="name"
              required
              className="material_input"
            />
            <TextField
              label="Cultural Description"
              variant="outlined"
              onChange={handleChange}
              value={form.description}
              name="description"
              required
              className="material_input"
            />
            <TextField
              label="History"
              variant="outlined"
              onChange={handleChange}
              value={form.history}
              name="history"
              required
              className="material_input"
            />

            <MUIButton
              component="label"
              role={undefined}
              tabIndex={-1}
              endIcon={<UploadIcon />}
              className="!rounded-[5px] !border !border-[#2C131A] !bg-[#F8F8F8] !shadow-[0px_4px_8px_0px_rgba(0,0,0,0.15),0px_1px_3px_0px_rgba(0,0,0,0.30)] !text-black"
            >
              Upload your file
              <VisuallyHiddenInput
                type="file"
                onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
                multiple
              />
            </MUIButton>

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
        );
      case "Update an Existing Digital Taonga":
        return (
          <section className="grid gap-4 p-10">
            {updateAnExistingDigitalTaonga.map(Content)}
          </section>
        );
      default:
        break;
    }
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
    borderRadius: 5,
    border: "1px solid  #2C131A",
    background: "#F8F8F8",
    boxShadow: "0px 4px 8px 0px rgba(0, 0, 0, 0.15), 0px 1px 3px 0px rgba(0, 0, 0, 0.30)",
  });

  return (
    <main>
      <section className="p-6">
        <h4 className="uppercase">
          {action === "Create or Upload a New Digital Taonga"
            ? "Creates a 3D high-resolution Digital Taonga"
            : action === "Update an Existing Digital Taonga"
            ? action
            : "What action should be proposed?"}
        </h4>
        <p>
          {action === "Create or Upload a New Digital Taonga"
            ? "Upload your 3D Artefact file and add description."
            : action === "Update an Existing Digital Taonga"
            ? ""
            : "Choose the type of proposal for managing Digital Taonga."}
        </p>
      </section>

      {action ? (
        SelectedProposal()
      ) : (
        <section className="grid gap-4 p-10">{digitalTaongaProposals.map(Content)}</section>
      )}

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
            <span className="font-bold">Digital Taonga Name:</span> {form.name}
          </p>
          <p>
            <span className="font-bold">Cultural description:</span> {form.description}
          </p>
          <p>
            <span className="font-bold">History:</span> {form.history}
          </p>
          <p>
            <span className="font-bold">File name:</span> {form.file?.name}
          </p>
          <p>
            <span className="font-bold">Deadline:</span> {dayjs(form.date).format("MM/DD/YYYY")}
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
          onClick={() =>
            action
              ? toggleDialog()
              : navigate(`/proposals/create/Digital Taonga proposal?action=${selectedValue}`)
          }
          disabled={
            action ? !form.name || !form.description || !form.history || !form.file : !selectedValue
          }
        >
          {action ? "Create proposal" : "Next"}
        </Button>
        <ProgressBar step={step} totalSteps={4} />
      </div>
    </main>
  );
};

export default DigitalTaongaProposalCreation;
