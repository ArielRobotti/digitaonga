import { AvatarIcon, EditIcon } from "../../../components/ui/icons";
import Button from "../../../components/shared/Button";
import { TextField } from "@mui/material";
import useMemberStore from "../../../store/useMemberStore";
import { useState } from "react";
import useCanister from "../../../hooks/useCanister";
import { useNavigate } from "react-router";
import { compressAndConvertImage, blobToImageUrl } from "../../../utils/imageManager";

const ProfileSettings = () => {
  const { member, setMember } = useMemberStore();
  const navigate = useNavigate();
  const [dao] = useCanister();

  // Redirect if member data is not available
  if (!member) {
    navigate("/");
    return null; // Return null to prevent rendering
  }

  // Safely get the initial name from the array, defaulting to an empty string
  const initialName = member.data.name?.[0] || "";
  const [name, setName] = useState(initialName);
  const [profilePic, setProfilePic] = useState(member.data.profile_pic);

  const handleChange = (event) => {
    // The value is in event.target.value, not event.target
    setName(event.target.value);
  };

  const handleChangeAvatar = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePic([await compressAndConvertImage(file, 32, 256, 256)]);
    }
  };

  const handleSubmit = async () => {
    // Use the current state values directly
    const responseEditProfile = await dao.edit_member({
      name: [name],
      cover_img: [],
      profile_pic: profilePic,
    });

    console.log(responseEditProfile);

    if ("Ok" in responseEditProfile) {
      setMember(responseEditProfile.Ok);
    }
    navigate("/profile");
  };

  // Check if anything has changed to enable the button
  const isFormChanged = name !== initialName || JSON.stringify(profilePic) !== JSON.stringify(member.data.profile_pic);

  return (
    <main>
      <h3 className="uppercase p-6">Account Settings</h3>

      <section className="flex flex-col items-center gap-6 max-w-[340px] m-auto mt-6">
        <div className="relative">
          {/* Check for profilePic and ensure it's not an empty array */}
          {profilePic && profilePic[0] ? (
            <img
              src={blobToImageUrl(profilePic[0])}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover"
            />
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
          placeholder={initialName || "NoName"} // Use the initialName for placeholder
          value={name} // The value prop should be the state variable
          required
        />

        <div className="absolute bottom-4 inset-x-0 z-10 grid gap-4 place-items-center">
          <Button onClick={handleSubmit} disabled={!isFormChanged} className="" variant="kokowai">
            Save Changes
          </Button>
        </div>
      </section>
    </main>
  );
};

export default ProfileSettings;