import Button from "../../../components/shared/Button";
import { TextField } from "@mui/material";
import { useState } from "react";

const ProfileSettings = () => {
  const [form, setForm] = useState({ name: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  return (
    <main>
      <section className="flex flex-col items-center gap-6 max-w-[340px] m-auto">
        <TextField
          label="Name"
          variant="outlined"
          className="material_input w-full"
          onChange={handleChange}
          name="name"
          value={form.name}
          required
        />

        <Button onClick={() => {}} disabled={!form.name} className="" variant="kokowai">
          Save Changes
        </Button>
      </section>
    </main>
  );
};

export default ProfileSettings;
