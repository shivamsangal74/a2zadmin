import React from "react";

type FileUploadProps = {
  label: string;
  onChange: any;
  error: any;
  name: string;
};
const FileUpload: React.FC<FileUploadProps> = ({
  label,
  onChange,
  name,
  error,
}) => {
  return (
    <>
      <label
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        htmlFor="file_input"
      >
        {label}
      </label>
      <input
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        id="file_input"
        type="file"
        name={name}
        onChange={onChange}
      />

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-500">
          <span className="font-medium">{error}</span>
        </p>
      )}
    </>
  );
};

export default FileUpload;
