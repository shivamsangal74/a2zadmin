import { IoClose } from "react-icons/io5";

const Popup = ({ isOpen, onClose, title, children, width,styles }) => {
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
      className="fixed inset-0 flex items-center justify-center z-50 mt-8 w-full"
      style={{
        maxHeight: "-webkit-fill-available;",
        
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50" ></div>
      <div
        className={`relative bg-white rounded-lg p-5 ${widthClass} w-full z-50`}
        style={{...styles}}
      >
        <div className="flex justify-between items-center mb-4">
          {title && <h2 className="text-lg font-bold">{title}</h2>}
          <button className="text-gray-600" onClick={onClose}>
            <IoClose />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

export default Popup;
