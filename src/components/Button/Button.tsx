import { Spinner } from "@material-tailwind/react";

interface ButtonLabelProps {
  onClick: () => void;
  label?: string;
  type?:any;
  disabled?: boolean;
  style?: React.CSSProperties;
  loader?: boolean;
  Icon?: any;
  veriant?: any
}

export const ButtonLabel: React.FC<ButtonLabelProps> = ({
  onClick,
  label = '',
  type ='',
  disabled = false,
  style = {},
  loader = false,
  Icon,
  veriant="fill"
}) => {
  const varin = {
    fill: "h-11 min-w-32 text-white bg-buttonColor hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
    outline: "h-11 min-w-32 text-buttonColor hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4  focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-700 dark:focus:ring-blue-800"
  }
  return (
    <button className={varin[veriant]}
     onClick={onClick} disabled={disabled || loader} style={style}  type={type}>
      <div className="inline-flex gap-2">
      {Icon && <div className="w-3.5 h-3.5 me-2 mb-1">{Icon}</div>}
      {loader ? <Spinner  /> : label}

      </div>
      
    </button>
  );
};
