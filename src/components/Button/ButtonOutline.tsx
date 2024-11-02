import { Spinner } from "@material-tailwind/react";

interface ButtonOutlineProps {
  onClickFn: () => void;
  label?: string;
  type?: any;
  disabled?: boolean;
  style?: React.CSSProperties;
  loader?: boolean;
}
const ButtonOutline: React.FC<ButtonOutlineProps> = (
  onClickFn,
  label = "",
  type = "",
  disabled = false,
  style = {},
  loader = false
) => {
  return (
    <div>
      <button
        className=""
        onClick={() => onClickFn}
        disabled={disabled || loader}
        style={style}
        type={type}
      >
        {loader ? <Spinner /> : label}
      </button>
    </div>
  );
};

export default ButtonOutline;
