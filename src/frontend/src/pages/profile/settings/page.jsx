import { AvatarIcon, EditIcon } from "../../../components/ui/icons";

import Button from "../../../components/shared/Button";
import { TextField } from "@mui/material";
import useMemberStore from "../../../store/useMemberStore";
import { useState } from "react";

const ProfileSettings = () => {
  const [form, setForm] = useState({ name: "", avatar: null });
  const { member } = useMemberStore();
  console.log({ member });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };
  const handleChangeAvatar = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prevForm) => ({ ...prevForm, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {};

  return (
    <main>
      <h3 className="uppercase p-6">Account Settings</h3>

      <section className="flex flex-col items-center gap-6 max-w-[340px] m-auto mt-6">
        <div className="relative">
          {form.avatar ? (
            <img src={form.avatar} alt="Avatar" className="w-32 h-32 rounded-full object-cover" />
          ) : (
            <AvatarIcon />
          )}
          <div className="absolute bottom-0 right-0 bg-kokowai rounded-full p-2 cursor-pointer">
            <EditIcon width={32} height={32} className="cursor-pointer" />
            <input
              type="file"
              name="avatar"
              id="avatar"
              className="w-32 h-32 absolute bottom-0 right-0 opacity-0"
              onChange={handleChangeAvatar}
              accept="image/*"
              aria-label="Change avatar"
            />
          </div>
        </div>

        <TextField
          label="Name"
          variant="outlined"
          className="material_input w-full"
          onChange={handleChange}
          name="name"
          value={form.name}
          required
        />

        <div className="absolute bottom-4 inset-x-0 z-10 grid gap-4 place-items-center">
          <Button onClick={handleSubmit} disabled={!form.name} className="" variant="kokowai">
            Save Changes
          </Button>
        </div>
      </section>
    </main>
  );
};

export default ProfileSettings;
