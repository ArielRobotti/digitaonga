const ProgressBar = ({ step, totalSteps, className = '' }) => {
  return (
    <div 
      className={`rounded h-2 bg-gray-300 overflow-hidden ${className}`}
       
    >
      <div
        className="h-full bg-kokowai transition-all duration-300"
        style={{ width: `${(step + 1) * (100 / totalSteps)}%` }}
      />
    </div>
  );
};

export default ProgressBar;
