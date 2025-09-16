import { AvatarIcon, EditIcon } from "../../../components/ui/icons";

import Button from "../../../components/shared/Button";
import { TextField } from "@mui/material";
import useMemberStore from "../../../store/useMemberStore";
import { useState } from "react";
import useCanister from "../../../hooks/useCanister";
import { useNavigate } from "react-router";
import { compressAndConvertImage } from "../../../utils/imageManager"


const ProfileSettings = () => {
  const [form, setForm] = useState({ name: "", avatar: null });
  const [ profilePic, setProfilePic] = useState([])
  const { member, setMember } = useMemberStore();

  const navigate = useNavigate();

  console.log({ member });

  const [dao] = useCanister();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleChangeAvatar = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePic(await compressAndConvertImage(file, 128))
    }
  };

  const handleSubmit = async () => {
    const responseEditProfile = await dao.edit_member({name: [form.name], cover_img: [], profile_pic: [profilePic]})
    console.log(responseEditProfile)
    if("Ok" in responseEditProfile) {
      setMember(responseEditProfile.Ok)
    }
    navigate("/profile")
  };

  if(!member){
    navigate("/")
  }

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
          variant="outlined"
          className="material_input w-full"
          onChange={handleChange}
          name="name"
          label="Name"
          placeholder={ member?.data.name[0]?.length > 0 ? member?.data?.name[0] : "NoName"}
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
