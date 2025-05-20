import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Document, Page } from "react-pdf";
import { Img } from "react-image";

const DocumentViewer = ({
  path,
  open,
  onClose,
}: {
  path: string;
  open: boolean;
  onClose: () => void;
}) => {
  console.log(path);

  const getFileExtension = (filePath: string): string => {
    return (filePath.split(".").pop() || "").toLowerCase();
  };

  const renderDocument = () => {
    const extension = getFileExtension(path);
    if (extension === "pdf") {
      return (
        <Document file={path}>
          <Page pageNumber={1} />
        </Document>
      );
    } else if (["jpg", "jpeg", "png", "gif"].includes(extension)) {
      const imagePaths = path.split(",");
      return (
        <>
          {imagePaths.map((imagePath, index) => (
            <Img key={index} src={imagePath.trim()} />
          ))}
        </>
      );
    } else if (extension === "mp4") {
      return (
        <video controls width="100%">
          <source src={path} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return <p className="text-red-500">Unsupported file format</p>;
    }
  };

  return (
    <div className="!z-9999">
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Document Viewer</DialogTitle>
        <DialogContent>{renderDocument()}</DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentViewer;
