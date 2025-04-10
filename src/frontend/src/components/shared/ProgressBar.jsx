const ProgressBar = ({ step, totalSteps }) => {
  return (
    <div className="rounded w-[288px] h-2 bg-gray-300 overflow-hidden">
      <div
        className="h-full bg-kokowai transition-all duration-300"
        style={{ width: `${(step + 1) * (100 / totalSteps)}%` }}
      />
    </div>
  );
};

export default ProgressBar;
