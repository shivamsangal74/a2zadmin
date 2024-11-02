import React from 'react';

type StepItemProps = {
  title: string;
  description: string;
  completed: boolean;
  currentStep: number;
  stepNumber: number;
  icon?: React.ReactNode;
  onClick: (stepNumber: number) => void;
};

const StepItem: React.FC<StepItemProps> = ({
  title,
  description,
  completed,
  currentStep,
  stepNumber,
  icon, 
  onClick
}) => {
  const isActive = currentStep === stepNumber;
  const isCompleted = completed;

  const iconColor = isActive
    ? "text-blue-500"
    : isCompleted
    ? "text-green-500"
    : "text-red-500";
  const bgColor = isActive
    ? "bg-blue-200"
    : isCompleted
    ? "bg-green-200"
    : "bg-red-100";

  const handleClick = () => {
    onClick(stepNumber);
  };

  // Default icon when completed
  const CompletedIcon = (
    <svg
      className={`w-3.5 h-3.5 ${iconColor}`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 16 12"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M1 5.917 5.724 10.5 15 1.5"
      />
    </svg>
  );

  return (
    <li className="mb-10 ms-6" onClick={handleClick}>
      <span
        className={`absolute flex items-center justify-center w-8 h-8 rounded-full -start-4 ring-4 ring-white ${bgColor}`}
      >
        {/* Render the icon if provided, otherwise render the default icon */}
        {completed && !isActive ? CompletedIcon : icon}
      </span>
      <h3 className="font-medium leading-tight">{title}</h3>
      <p className="text-sm">{description}</p>
    </li>
  );
};

export default StepItem;
