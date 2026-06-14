import { IoClose } from "react-icons/io5";

const Popup = ({ isOpen, onClose, title, children, width, styles }) => {
  if (!isOpen) return null;

  // Define the CSS class based on the width prop
  let widthClass = "max-w-lg"; // Default width
  if (width === "small") {
    widthClass = "max-w-sm";
  } else if (width === "large") {
    widthClass = "max-w-xl";
  } else if (width === "xl") {
    widthClass = "max-w-2xl";
  } else if (width === "xxl") {
    widthClass = "max-w-screen-lg";
  }

  return (
    <div
      className="fixed inset-0 z-50 mt-8 flex w-full items-center justify-center"
      style={{
        maxHeight: "-webkit-fill-available;",
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div
        className={`relative z-50 flex w-full max-h-[90vh] flex-col overflow-hidden rounded-lg bg-white p-5 shadow-lg dark:border dark:border-strokedark dark:bg-boxdark dark:text-bodydark1 ${widthClass}`}
        style={{ ...styles }}
      >
        <div className="mb-4 flex shrink-0 items-center justify-between">
          {title && (
            <h2 className="text-lg font-bold text-black dark:text-white">
              {title}
            </h2>
          )}
          <button
            className="text-gray-600 hover:text-gray-900 dark:text-bodydark dark:hover:text-white"
            onClick={onClose}
            type="button"
          >
            <IoClose />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-1">{children}</div>
      </div>
    </div>
  );
};

export default Popup;
