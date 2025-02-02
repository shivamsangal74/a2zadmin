
import React from "react";
import DefaultLayout from "../../layout/DefaultLayout";
import { useQuery } from "@tanstack/react-query";
import api from "../../Services/Axios/api";
import { toast } from "react-toastify";
import BasicTable from "../../components/BasicTable/BasicTable";
import Loader from "../../components/Loader/Loader";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";

export const ApesUsers = () => {


  const formatDateToISO = (utcDateString:string) => {
    const utcDate = new Date(utcDateString);
  const localDate = new Date(utcDate.getTime() + 330 * 60000);
  return localDate.toISOString().replace("Z", "").replace("T", " ");
  };

  const columns = [
    {
      header: "User ID",
      accessorKey: "userId",
    },
    {
      header: "Name",
      accessorKey: "name",
      cell: (info:any) => {
        return <>
            <span>{info.row.original.name}</span><br />
            <span>{info.row.original.mobile}</span>
        </>
      },
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Address",
      accessorKey: "address",
      size: 200
    },
    {
      header: "Location",
      accessorKey: "latitude",
      size: 200,
      cell: (info:any) => {
        return <>
            <span>latitude - {info.row.original.latitude}</span><br />
            <span>longitude - {info.row.original.longitude}</span>
        </>
      },
    },
    {
      header: "aadhar/pan",
      accessorKey: "login_id",
      cell: (info:any) => {
        return <>
            <span>Aadhaar - {info.row.original.aadhar}</span><br />
            <span>Pan - {info.row.original.pan}</span>
        </>
      },
      size: 200
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row:any)=>{
        return <>

            <span>{row.row.original.status}</span><br />
            <span>{row.row.original.type}</span>
        </>
      }
    },
    {
      header: "Reg Date",
      accessorKey: "reg_date",
      cell: (row: any) => {
        console.log(row.row);
        return formatDateToISO(row.row.original.reg_date);
      }
    }
  ];

  const { isLoading, error, data,refetch } = useQuery({
    queryKey: ["allaepsusers"],
    queryFn: async () => {
      try {
        const response = await api.post("/apes/allaepsusers");
        const userData = response.data;
        return userData;
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    },
    refetchOnWindowFocus: true,
  });



  return (
    <DefaultLayout isList={false}>
      <Breadcrumb pageName="Credopay Users List" />
      {isLoading && <Loader />}
     
      {data && data.length > 0 ? (
        <BasicTable data={data} columns={columns} filter={[]} />
      ) : (
        <p>No Records Found</p>
      )}
    </DefaultLayout>
  );
};
