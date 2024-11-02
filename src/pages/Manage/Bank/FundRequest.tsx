import { useQuery } from "@tanstack/react-query";
import DefaultLayout from "../../../layout/DefaultLayout";
import { useState } from "react";
import {
  cancelFundRequest,
  getFundRequest,
  updateFundRequest,
} from "../../../Services/commonService";
import { BsCheckCircle, BsCheckCircleFill, BsDashCircle, BsDashCircleFill } from "react-icons/bs";
import { Select, Option } from "@material-tailwind/react";
import Loader from "../../../components/Loader/Loader";
import { toast } from "react-toastify";
import { apiUrl } from "../../../Utills/constantt";
import BasicTable from "../../../components/BasicTable/BasicTable";
import DocumentViewer from "../../../components/DocumentViewer/DocumentViewer";
import { Tag } from "antd";

const ManageFundRequest = () => {
  const columns = [
    {
      header: "userId",
      accessorKey: "userId",
      size: 80,
    },
    {
      header: "Amount",
      accessorKey: "amount",
      size: 80,
    },
    {
      header: "Mode",
      accessorKey: "paymentMode",
      size: 80,
    },
    {
      header: "Bank",
      accessorKey: "bank",
    },
    {
      header: "Account No",
      accessorKey: "accountNo",
    },
    {
      header: "Info",
      accessorKey: "paymentInfo",
    },
    {
      header: "remarks",
      accessorKey: "remarks",
    },
    {
      header: "Status",
      accessorKey: "status",
      size: 80,
    },
    {
      header: "Req Date",
      accessorKey: "createdDate",
      size: 80,
    },
    {
      header: "Approve Date",
      accessorKey: "approveDate",
      size: 80,
    },
    {
      header: "Approve By",
      accessorKey: "approveBy",
      size: 80,
    },
    {
      header: "Recipt",
      accessorKey: "icon",
      cell: (row: any) => (
        <div className="flex justify-center" onClick={()=> handleOpenDocument(`${apiUrl}/${row.row.original.recipt}`)}>
          <span className="h-6 w-6 rounded-full">
            <img
              crossOrigin="anonymous"
              className="rounded-full"
              height={40}
              width={40}
              src={`${apiUrl}/${row.row.original.recipt}`}
              alt="User"
            />
          </span>
        </div>
      ),
    },
    {
      header: "Remarks",
      cell: (row: any) => (
        <div className="flex gap-2 justify-center">
          <Select
            label="Select Remarks"
            onChange={handleRemarks}
            value={remarks || row.row.original.remarks}
          >
            <Option key="1" value="Amount dose not match">
              Amount dose not match
            </Option>
            <Option key="2" value="Incorrect fund request bank">
              Incorrect fund request bank
            </Option>
            <Option key="3" value="Wrong recipet uploaded">
              Wrong recipet uploaded
            </Option>
            <Option key="4" value="CDM ID NOT MATCH">
              CDM ID NOT MATCH
            </Option>
            <Option key="5" value="payment not received">
              Payment not received
            </Option>
            <Option key="6" value="BRANCH LOCTION NOT MATCH">
              BRANCH LOCTION NOT MATCH
            </Option>
            <Option key="8" value="Duplicate request found">
              Duplicate request found
            </Option>
          </Select>
        </div>
      ),
      size: 250
    },
    {
      header: "Actions",
      cell: (row: any) => (
        <div className="flex gap-2 justify-center">
          <div className="cursor-pointer flex gap-6">
            {row.row.original.status == "Pending" ?  (
              <>
                <BsCheckCircleFill
                size={30}
                title="Approve"
                color="green"
                  onClick={() => handleOpenEdit(row.row.original)}
                />
                <BsDashCircleFill size={30} title="Reject"
                color="red" onClick={() => handleCancel(row.row.original)} />
              </>
            ) : <Tag color={row.row.original.status == "Rejected" ? "red" :row.row.original.status == "Success" ? "green" : "orange"}>{row.row.original.status}</Tag>}
          </div>
        </div>
      ),
    },
  ];
  const [documentPath, setDocumentPath] = useState('')
  const [open, setOpen] = useState(false);

  const [remarks, setRemarks] = useState("");
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["funds"],
    queryFn: async () => {
      try {
        const response = await getFundRequest();
        return response.funds;
      } catch (error) {
        throw error;
      }
    },
    refetchOnWindowFocus: false,
  });
  if (isLoading) return <Loader />;
  if (error) return toast.error("Unable to fetch banks.");

  const handleOpenEdit = async (data: any) => {
    try {
      await updateFundRequest({ data });
      toast.success("Approved Successfully.");
      refetch();
    } catch (error) {
      toast.error("something went wrong!");
    }
  };

  const handleRemarks = (event: any) => {
    setRemarks(event);
  };

  const handleCancel = async (data: any) => {
    try {
      await cancelFundRequest({ id: data.id, remarks });
      toast.success("Rejected Successfully.");
      refetch();
    } catch (error) {
      toast.error("something went wrong!");
    }
  };

  const handleOpenDocument = (path: string) => {
    setDocumentPath(path);
    setOpen(true);
  };
  const handleCloseDialog = () => {
    setOpen(false);
  };

  return (
    <DefaultLayout isList={true}>
      {data && (
        <BasicTable data={data} columns={columns} actions={""} filter={[]} />
      )}
      <DocumentViewer
        path={documentPath}
        open={open}
        onClose={handleCloseDialog}
      />
    </DefaultLayout>
  );
};

export default ManageFundRequest;
