type DatePickerProps = {
  label: string;
  registerAction: any;
  error: any;
  name: string;
};

const DatePickerTwo: React.FC<DatePickerProps> = ({
  label,
  name,
  registerAction,
  error,
}) => {
  {
    return (
      <div>
        <div className="relative z-0 w-full mb-5">
          <input
            type="date"
            placeholder=" "
            name={name}
            {...registerAction}
            className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
          />
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-500">
            <span className="font-medium">{error}</span>
          </p>
        )}
      </div>
    );
  }
};

export default DatePickerTwo;
