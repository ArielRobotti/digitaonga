import { useNavigate, useSearchParams } from "react-router";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Button from "../../../components/shared/Button";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import ProgressBar from "../../../components/shared/ProgressBar";
import React from "react";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { proposalTypes } from "../../../utils/data";
import { useState } from "react";

const CreateProposal = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: dayjs(new Date().toDateString()),
  });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const type = searchParams.get("type");
  const filterTypes = proposalTypes.filter((t) => t.type.toLowerCase().includes(type));

  // TODO (fran): validar datos de form antes de seguir

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const Content = ({ type, description }) => (
    <section key={type} className="p-6">
      <h4 className="uppercase">{type}</h4>
      <p>{description}</p>
    </section>
  );

  return (
    <main>
      {filterTypes.length ? filterTypes.map(Content) : proposalTypes.map(Content)}

      {type ? (
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

          <div className="absolute bottom-[72px] left-1/2 transform -translate-x-1/2 grid gap-8 z-0 place-items-center">
            <Button className="shadow-[0px_4px_8px_0px_#00000026,0px_1px_3px_0px_#0000004c] border-none">
              Next
            </Button>
            <ProgressBar step={0} totalSteps={4} />
          </div>
        </section>
      ) : (
        <section className="absolute bottom-[72px] left-1/2 transform -translate-x-1/2 grid place-items-center gap-4 z-0">
          {proposalTypes.map(({ type }) => (
            <Button
              key={type}
              onClick={() => navigate(`/proposals/create?type=${type.split(" ")[0].toLowerCase()}`)}
            >
              {type}
            </Button>
          ))}
        </section>
      )}
    </main>
  );
};

export default CreateProposal;
