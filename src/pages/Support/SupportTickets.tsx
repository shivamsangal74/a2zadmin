import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import BasicTable from "../../components/BasicTable/BasicTable";
import Loader from "../../components/Loader/Loader";
import { toast } from "react-toastify";
import api from "../../Services/Axios/api";
import { Button, Tag } from "antd";
import DefaultLayout from "../../layout/DefaultLayout";



const SupportTicket = () => {
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      try {
        const response = await api.get("/ticket/tickets");

        return response.data;
      } catch (error) {
        toast.error(error.message);
      }
    },
    refetchOnWindowFocus: false,
  });
  const navigate = useNavigate()
  const columns = [
    {
      header: "Ticket NO.",
      accessorKey: "ticketNumber",
      size: 40,
      cell: (row) => {
        return <Button onClick={()=> navigate("/ticketInfo/" + row.row.original.ticketNumber)}>{row.row.original.ticketNumber}</Button>;
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      size: 80,
      cell: (row) => {
        return row.row.original.status == "Pending" ? (
          <Tag color="orange">{row.row.original.status}</Tag>
        ) : row.row.original.status == "In Progress" ? (
          <Tag color="blue">{row.row.original.status}</Tag>
        ) : row.row.original.status == "Resolved" ? (
          <Tag color="green">{row.row.original.status}</Tag>
        ) : (
          <Tag color="red">{row.row.original.status}</Tag>
        );
      },
    },
    {
      header: "Priority",
      accessorKey: "priority",
      size: 80,
      cell: (row) => {
        return row.row.original.priority == "Urgent" ? (
          <Tag color="red">{row.row.original.priority}</Tag>
        ) : row.row.original.priority == "High" ? (
          <Tag color="blue">{row.row.original.priority}</Tag>
        ) : row.row.original.priority == "Medium" ? (
          <Tag color="orange">{row.row.original.priority}</Tag>
        ) : (
          <Tag color="gray">{row.row.original.priority}</Tag>
        );
      },
    },
    {
      header: "Subject",
      accessorKey: "subject",
      size: 80,
    },
    {
      header: "Category",
      accessorKey: "category",
      size: 80,
    },
    {
      header: "Created Date",
      accessorKey: "createdDate",
      size: 80,
    },
  ];
  return (
    <DefaultLayout>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12 mt-5">
            {data && (
              <BasicTable
                data={data}
                columns={columns}
                isFilters={true}
                filter={[]}
                isSeachable={false}
                isReport={false}
              />
            )}
          </div>
        </div>
        {isLoading && <Loader />}
      </div>
    </DefaultLayout>
  );
};

export default SupportTicket;
