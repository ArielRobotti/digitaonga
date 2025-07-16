const StatusBallProposal = ({ status }) => {
  return (
    <div
      className={`w-2 h-2 rounded-full ${
        status === "Open" ? "bg-[#F19126]" : status === "Approved" ? "bg-[#006920]" : "bg-[#B00000]"
      }`}
    />
  );
};

export default StatusBallProposal;
