import { Dialog, DialogContent, IconButton } from "@mui/material";

import Button from "./Button";
import { CloseIcon } from "../ui/icons";

const CustomDialog = ({ children }) => {
  return (
    <Dialog onClose={toggleDialog} open={open} fullWidth>
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
        <Button
          size="small"
          onClick={() => {
            setOpen(false);
            // navigate(`/proposals/create?type=${selectedValue}`);
          }}
        >
          Cancel
        </Button>
        <Button
          size="small"
          variant="kokowai"
          onClick={() => {
            setOpen(false);
            // navigate(`/proposals/create?type=${selectedValue}`);
          }}
        >
          Submit
        </Button>
      </section>
    </Dialog>
  );
};

export default CustomDialog;
