import React from "react";

interface SwitcherThreeProps {
  enabled: boolean;
  onchange: any;
  id: any;
}

const SwitcherThree: React.FC<SwitcherThreeProps> = ({
  id,
  enabled,
  onchange,
}) => {
  return (
    <div>
      <label className="inline-flex items-center me-5 cursor-pointer">
        <input
          type="checkbox"
          value=""
          className="sr-only peer"
          checked={enabled}
          onChange={() => onchange()}
        />
        <div className={`relative w-11 h-6 rounded-full peer ${enabled ? 'bg-green-600' : 'bg-red-500'} dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600`}></div>
        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
         
        </span>
      </label>
    </div>
  );
};

export default SwitcherThree;
