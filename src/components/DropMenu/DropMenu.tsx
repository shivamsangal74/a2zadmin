import React, { useEffect, useRef, useState } from "react";
import { MdMoreVert } from "react-icons/md";
const DropMenu = ({ actions, dataProp }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);
  return (
    <div ref={dropdownRef}>
      <MdMoreVert onClick={() => setOpen(!open)} />
      {open && (
        <ul
          role="menu"
          data-popover="profile-menu"
          data-popover-placement="bottom"
          className="absolute z-10 flex min-w-[130px] flex-col gap-2 overflow-auto rounded-md border border-blue-gray-50 bg-white p-1 font-sans text-sm font-normal text-blue-gray-500 shadow-lg shadow-blue-gray-500/10 focus:outline-none"
        >
          {actions.map((action) => {
            return (
              <button
                onClick={() => action.onClick(dataProp)}
                role="menuitem"
                className="flex w-full cursor-pointer select-none items-center gap-2 rounded-md px-3 pt-[9px] pb-2 text-start leading-tight outline-none transition-all hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
              >
                {action.icon}
                <p className="block font-sans text-sm antialiased font-medium leading-normal text-inherit">
                  {action.label}
                </p>
              </button>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default DropMenu;
