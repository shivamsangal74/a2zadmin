import { Spinner } from "@material-tailwind/react";
import "./loader.css";

export function Loader() {
  return (
    <div className={`flex items-end gap-8 loader`}>
      <Spinner className="h-12 w-12" />
    </div>
  );
}
export default Loader;
