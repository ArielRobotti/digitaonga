import {
  Dialog,
  DialogContent,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
} from "@mui/material";

import Button from "../../components/shared/Button";
import { CloseIcon } from "../../components/ui/icons";
import MemberCommunityCard from "../../components/community/MemberCommunityCard";
import { useState } from "react";

const Community = () => {
  const [open, setOpen] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [value, setValue] = useState(null);

  const toggleDialog = () => setOpen(!open);
  const toggleOpenDialog = () => setOpenDialog(!openDialog);
  const handleChange = (e) => setValue(e.target.value);

  return (
    <main>
      <MemberCommunityCard />
      <MemberCommunityCard />
      <MemberCommunityCard />

      <Dialog onClose={toggleDialog} open={open} fullWidth>
        <h3 className="text-[#525252] text-center p-4 pt-6">ASSIGN ROLE</h3>
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
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={value}
              onChange={handleChange}
            >
              <FormControlLabel value="guardian" control={<Radio />} label="Guardian" />
              <FormControlLabel value="observer" control={<Radio />} label="Observer" />
            </RadioGroup>
          </FormControl>
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
          <h5 className="text-center">Role assigned successfully!</h5>
        </DialogContent>

        <section className="w-full flex justify-center gap-4 p-4 pb-6">
          <Button size="small" variant="kokowai" onClick={toggleOpenDialog}>
            Accept
          </Button>
        </section>
      </Dialog>
    </main>
  );
};

export default Community;
