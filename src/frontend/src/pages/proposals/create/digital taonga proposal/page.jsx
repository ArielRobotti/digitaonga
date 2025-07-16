import { CloseIcon, SimpleCheckIcon, UploadIcon } from "../../../../components/ui/icons";
import { Dialog, DialogContent, IconButton, styled } from "@mui/material";
import { digitalTaongaProposals, updateAnExistingDigitalTaonga } from "../../../../utils/data";
import { useNavigate, useSearchParams } from "react-router";

import ActionCard from "../../../../components/proposals/create/ActionCard";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Button from "../../../../components/shared/Button";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Button as MUIButton } from "@mui/material";
import ProgressBar from "../../../../components/shared/ProgressBar";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import useProposal from "../../../../hooks/useProposal";
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
  const [responseDialog, setResponseDialog] = useState({ success: false, error: false });
  const [selectedValue, setSelectedValue] = useState(null);
  const [updateType, setUpdateType] = useState(null);
  const [updatedValue, setUpdatedValue] = useState(null);
  const { createProposal, creating } = useProposal();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const action = searchParams.get("action");
  const step = !action ? 0 : !form.name || !form.description || !form.history || !form.file ? 1 : 2;

  // TODO (fran): validar datos de form antes de seguir

  const handleRadioChange = (e) => setSelectedValue(e.target.value);
  const handleRadioUpdateChange = (e) => setUpdateType(e.target.value);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleResponseError = () => setResponseDialog({ success: false, error: true });
  const handleResponseSuccess = () => setResponseDialog({ success: true, error: false });
  const handleCloseResponseDialog = () => setResponseDialog({ success: false, error: false });
  const toggleDialog = () => setOpen(!open);

  const handleSubmit = async () => {
    let digitalTaongaProposalAction;
    let proposalData;
    switch (selectedValue) {
      case "":
        digitalTaongaProposalAction = "CreateDigitalTaonga";
        // TODO (fran): subir el archivo a canister y obtener el key
        const key = "";
        proposalData = [form.name, form.description, form.history, key];
        break;
      case "":
        digitalTaongaProposalAction = "UpdateDigitalTaonga";
        proposalData = {
          UpdateDigitalTaongaProposal: {
            [updateType]: [updatedValue],
          },
        };
        break;
      case "":
        digitalTaongaProposalAction = "DeleteDigitalTaonga";
        proposalData = ""; // id
        break;
      case "":
        digitalTaongaProposalAction = "RequestDownloadPermision";
        break;
      default:
        break;
    }

    try {
      await createProposal({
        title: selectedValue,
        description: `${selectedValue} ${form.principal}`,
        kind: {
          DigitalTaonga: {
            DigitalTaongaProposal: { [digitalTaongaProposalAction]: proposalData },
          },
        },
        deadline: form.deadline?.unix(),
      });
      toggleDialog();
      handleResponseSuccess();
    } catch (err) {
      console.log("createProposal error:", err);
      handleResponseError();
    }
  };

  console.log({ selectedValue, updateType });

  const SelectedProposal = () => {
    switch (action) {
      case "Create or Upload a New Digital Taonga":
        return (
          <section className="flex flex-col md:items-center gap-8 p-12">
            <TextField
              label="Name"
              variant="outlined"
              onChange={handleChange}
              value={form.name}
              name="name"
              required
              className="material_input md:max-w-[500px] md:w-full"
            />
            <TextField
              label="Cultural Description"
              variant="outlined"
              onChange={handleChange}
              value={form.description}
              name="description"
              required
              className="material_input md:max-w-[500px] md:w-full"
            />
            <TextField
              label="History"
              variant="outlined"
              onChange={handleChange}
              value={form.history}
              name="history"
              required
              className="material_input md:max-w-[500px] md:w-full"
            />

            <MUIButton
              component="label"
              role={undefined}
              tabIndex={-1}
              endIcon={form.file ? <SimpleCheckIcon /> : <UploadIcon />}
              className="!rounded-[5px] !border !border-[#2C131A] !bg-[#F8F8F8] !shadow-[0px_4px_8px_0px_rgba(0,0,0,0.15),0px_1px_3px_0px_rgba(0,0,0,0.30)] !text-black md:max-w-[500px] md:w-full"
            >
              {form.file ? form.file.name : "Upload your file"}
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
                  className="material_input md:w-[500px]"
                />
              </DemoContainer>
            </LocalizationProvider>
          </section>
        );
      case "Update an Existing Digital Taonga":
        return (
          <section className="flex flex-col md:flex-row md:justify-center gap-4 p-10">
            {updateAnExistingDigitalTaonga.map((p) => (
              <ActionCard
                key={p.title}
                {...p}
                selectedValue={updateType}
                handleRadioChange={handleRadioUpdateChange}
              />
            ))}
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
        <section className="flex flex-col md:flex-row md:flex-wrap md:justify-center gap-4 p-10 md:p-0 md:max-w-[800px] md:mx-auto mb-40">
          {digitalTaongaProposals.map((p) => (
            <ActionCard
              key={p.title}
              {...p}
              selectedValue={selectedValue}
              handleRadioChange={handleRadioChange}
            />
          ))}
        </section>
      )}

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
          <Button size="small" variant="kokowai" onClick={handleSubmit}>
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

      <div className="fixed bottom-[72px] inset-x-0 grid gap-8 z-0 place-items-center">
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
