import {
  FormControl,
  FormHelperText,
  InputLabel,
  Button as MUIButton,
  MenuItem,
  Select,
  TextField,
  styled,
} from "@mui/material";
import { SimpleCheckIcon, UploadIcon } from "../../../../components/ui/icons";

import Button from "../../../../components/shared/Button";
import { useState } from "react";

const issueCategories = ["Technical Issue", "Account Issue", "Feedback/Suggestion", "Other"];

const Support = () => {
  const [form, setForm] = useState({ email: "", issue: "", category: "", file: null });
  const [error, setError] = useState({ email: "", issue: "", category: "", file: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
    setError((prevError) => ({ ...prevError, [name]: "" })); // Reset error for the field being changed
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setForm((prevForm) => ({ ...prevForm, file }));
    } else {
      setForm((prevForm) => ({ ...prevForm, file: null }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted:", form);

    // check email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email)) {
      setError((prevError) => ({ ...prevError, email: "Invalid email format" }));
      alert("Please enter a valid email address.");
      return;
    }

    // check category selection
    if (!form.category) {
      setError((prevError) => ({ ...prevError, category: "Category is required" }));
      alert("Please select an issue category.");
      return;
    }

    // check issue length
    if (form.issue.length < 10) {
      setError((prevError) => ({
        ...prevError,
        issue: "Issue description must be at least 10 characters long",
      }));
      alert("Issue description must be at least 10 characters long.");
      return;
    }

    if (!form.file) {
      setError((prevError) => ({ ...prevError, file: "File is required" }));
      alert("Please attach a file.");
      return;
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
    <main className="px-6">
      <h3 className="py-6">Need Help?</h3>
      <p>
        Check our FAQs for quick answers to common questions. <br /> Still stuck? Describe the issue
        below and we’ll get back to you as soon as possible. If possible, attach a screenshot or
        file to help us understand the problem better.
      </p>

      <form
        className="grid gap-4 mt-12 max-w-[332px] place-items-center w-full m-auto "
        onSubmit={handleSubmit}
      >
        <FormControl className="w-full">
          <TextField
            label="Mail for contact"
            variant="outlined"
            className="material_input w-full"
            onChange={handleChange}
            name="email"
            value={form.email}
            required
            error={!!error.email}
          />
        </FormControl>

        <FormControl className="w-full" variant="filled">
          <InputLabel id="issue-select-label" className="issue-category">
            Issue Category
          </InputLabel>
          <Select
            labelId="issue-select-label"
            id="issue-select"
            value={form.category}
            label="Issue Category"
            onChange={handleChange}
            className="material_select"
            name="category"
            error={!!error.category}
          >
            <MenuItem value="">
              <em>Issue Category</em>
            </MenuItem>
            {issueCategories.map((category) => (
              <MenuItem key={category} value={category} className="material_menu-item">
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className="w-full">
          <TextField
            label="Issue Description"
            variant="outlined"
            className="material_input w-full"
            onChange={handleChange}
            name="issue"
            value={form.issue}
            required
            error={!!error.issue}
          />
          <FormHelperText>Describe the issue in as much detail as possible.</FormHelperText>
        </FormControl>

        <MUIButton
          component="label"
          role={undefined}
          tabIndex={-1}
          endIcon={form.file ? <SimpleCheckIcon /> : <UploadIcon />}
          className="!rounded-[5px] !border !border-[#2C131A] !bg-[#F8F8F8] !shadow-[0px_4px_8px_0px_rgba(0,0,0,0.15),0px_1px_3px_0px_rgba(0,0,0,0.30)] !text-black md:max-w-[500px] w-full !py-3"
          onChange={handleFileChange}
        >
          {form.file ? form.file.name : "Attachments (Optional)"}
          <VisuallyHiddenInput
            type="file"
            onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
            multiple
          />
        </MUIButton>

        <div className="absolute bottom-4 inset-x-0 z-10 grid gap-4 place-items-center">
          <Button
            type="submit"
            disabled={!form.email || !form.issue || !form.category || !form.file}
            variant="kokowai"
          >
            Submit Request
          </Button>
        </div>
      </form>
    </main>
  );
};

export default Support;
