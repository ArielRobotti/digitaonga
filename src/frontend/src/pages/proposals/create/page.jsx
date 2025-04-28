import { useNavigate, useSearchParams } from "react-router";

import Button from "../../../components/shared/Button";
import ProgressBar from "../../../components/shared/ProgressBar";
import { Radio } from "@mui/material";
import dayjs from "dayjs";
import { proposalTypes } from "../../../utils/data";
import { useState } from "react";

const CreateProposal = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: dayjs(new Date().toDateString()),
  });
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  //   const type = searchParams.get("type");
  //   const filterTypes = proposalTypes.filter((t) => t.title.toLowerCase().includes(type));
  //   const step = !type ? 0 : !form.title || !form.description || !form.date ? 1 : 2;

  // TODO (fran): validar datos de form antes de seguir

  //   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleRadioChange = (e) => setSelectedValue(e.target.value);
  //   const toggleDialog = () => setOpen(!open);
  //   const toggleOpenDialog = () => setOpenDialog(!openDialog);

  console.log({ selectedValue });

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

  return (
    <main>
      <h4 className="uppercase p-6">{"Create a new Proposal"}</h4>

      {/* {type ? (
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
      ) : ( */}
      <section className="grid gap-4 p-10">{proposalTypes.map(Content)}</section>
      {/* )} */}

      {/* TODO (fran): crear custom dialog */}
      {/* <Dialog onClose={toggleDialog} open={open} fullWidth>
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
      </Dialog> */}

      {/* TODO (fran): ver que cuando se cierre este dialog deberia mandarlo a la proposal o la lista de proposals */}
      {/* <Dialog onClose={toggleOpenDialog} open={openDialog} fullWidth>
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
      </Dialog> */}

      <div className="absolute bottom-[72px] left-1/2 transform -translate-x-1/2 grid gap-8 z-0 place-items-center">
        <Button
          className="shadow-[0px_4px_8px_0px_#00000026,0px_1px_3px_0px_#0000004c] border-none"
          variant="kokowai"
          onClick={() => navigate(`/proposals/create/${selectedValue}`)}
          disabled={!selectedValue}
        >
          Next
        </Button>
        <ProgressBar step={0} totalSteps={4} />
      </div>
    </main>
  );
};

export default CreateProposal;
