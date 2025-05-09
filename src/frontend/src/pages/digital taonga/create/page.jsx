import { useEffect, useState } from "react";

import Button from "../../../components/shared/Button";
import ProgressBar from "../../../components/shared/ProgressBar";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router";

const CreateNft = () => {
  const [nftData, setNftData] = useState({ name: "", description: "", history: "", file: null });
  const navigate = useNavigate();

  const handleChange = (e) => setNftData({ ...nftData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setNftData({ ...nftData, file: e.target.files[0] });

  useEffect(() => {
    console.log(nftData);
  }, [nftData]);

  return (
    <main className="p-4 grid gap-6">
      <h4 className="uppercase text-center">Creates a 3D high-resolution NFT</h4>
      <p className="max-w-[378px] m-auto">
        Upload your 3D Artefact file, add description and assign ownership
      </p>

      <section className="flex flex-col gap-6 max-w-[340px] m-auto">
        <TextField
          label="NFT Name"
          variant="outlined"
          className="material_input"
          onChange={handleChange}
          name="name"
          value={nftData.name}
          required
        />

        <TextField
          label="Cultural description"
          variant="outlined"
          className="material_input"
          onChange={handleChange}
          name="description"
          value={nftData.description}
          required
          multiline
        />

        <TextField
          label="History"
          variant="outlined"
          className="material_input"
          onChange={handleChange}
          name="history"
          value={nftData.history}
          required
          multiline
        />

        <TextField
          variant="outlined"
          type="file"
          className="material_input"
          onChange={handleFileChange}
          name="file"
          required
        />

        {/* <input type="file" /> */}
      </section>

      <div className="absolute bottom-4 inset-x-0 z-10 grid gap-4 place-items-center">
        <Button
          className="w-[340px]"
          disabled={!nftData.name || !nftData.description || !nftData.history || !nftData.file}
          onClick={() => navigate(`/proposals/create?type=motion`)} // TODO (fran): ver como pasar los datos
        >
          Create proposal
        </Button>

        <ProgressBar step={1} totalSteps={4} />
      </div>
    </main>
  );
};

export default CreateNft;
