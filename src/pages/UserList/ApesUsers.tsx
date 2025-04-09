import React, { useState } from "react";
import DefaultLayout from "../../layout/DefaultLayout";
import { useQuery } from "@tanstack/react-query";
import api from "../../Services/Axios/api";
import { toast } from "react-toastify";
import BasicTable from "../../components/BasicTable/BasicTable";
import Loader from "../../components/Loader/Loader";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import MapSelector from "../../components/LocationMap";
import { Dialog } from "@mui/material";
import map from "../../images/maps.svg";
import { AxiosError } from "axios";


export const ApesUsers = () => {
  const [openMapModal, setOpenMapModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [mapContext, setMapContext] = useState("");

  const handleMapClick = (row: any, context: string) => {
    setSelectedRow(row);
    setMapContext(context);
    setOpenMapModal(true);
  };

  const handleSelectLocation = async(location:any) => {
    console.log(`Selected Location for ${mapContext}:`, location);
    // Optional: Update local state or call API

    try {
      const resp = await api.post("/apes/updateaepsuser", {
        mobile: selectedRow.mobile,
        ...location,
        type: mapContext,
      })
      toast.success(`Location updated successfully for ${mapContext}`);
    } catch (error:any) {
      toast.error(error.response.data.message || "Something went wrong");
    }

    setOpenMapModal(false)
  };

  const formatDateToISO = (utcDateString: string) => {
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
      cell: (info: any) => (
        <>
          <span>{info.row.original?.name}</span>
          <br />
          <span>{info.row.original?.mobile}</span>
          <br />
          <span>{info.row.original?.email}</span>
        </>
      ),
    },
    {
      header: "Address",
      accessorKey: "address",
      size: 200,
    },
    {
      header: "Location",
      accessorKey: "latitude",
      size: 200,
      cell: (info: any) => (
        <>
          <span>latitude - {info.row.original.latitude}</span>
          <br />
          <span>longitude - {info.row.original.longitude}</span>
        </>
      ),
    },
    {
      header: "InstantPay",
      accessorKey: "instantpay_latitude",
      cell: (info: any) => (
        <img
          src={map}
          alt=""
          height={30}
          width={30}
          onClick={() => handleMapClick(info.row.original, "instantPay")}
        />
      ),
      size: 100
    },
    {
      header: "paySprint",
      accessorKey: "paySprint_latlong",
      size: 100,

      cell: (info: any) => (
       <div className="w-full flex justify-content-center">
         <img
          src={map}
          alt=""
          height={30}
          width={30}
          onClick={() => handleMapClick(info.row.original, "paySprint")}
        />
       </div>
      ),
    },
    {
      header: "credoPay",
      accessorKey: "credoPay_latlong",
      size: 100,
      cell: (info: any) => (
        <img
          src={map}
          alt=""
          height={30}
          width={30}
          onClick={() => handleMapClick(info.row.original, "credoPay")}
        />
      ),
    },
    {
      header: "aadhar/pan",
      accessorKey: "login_id",
      cell: (info: any) => (
        <>
          <span>Aadhaar - {info.row.original.aadhar}</span>
          <br />
          <span>Pan - {info.row.original.pan}</span>
        </>
      ),
      size: 200,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row: any) => (
        <>
          <span>{row.row.original.status}</span>
          <br />
          <span>{row.row.original.type}</span>
        </>
      ),
    },
    {
      header: "Reg Date",
      accessorKey: "reg_date",
      cell: (row: any) => formatDateToISO(row.row.original.reg_date),
    },
  ];

  const { isLoading, data } = useQuery({
    queryKey: ["allaepsusers"],
    queryFn: async () => {
      try {
        const response = await api.post("/apes/allaepsusers");
        return response.data;
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

      <Dialog
        open={openMapModal}
        onClose={() => setOpenMapModal(false)}
        maxWidth="md"
        fullWidth>
        <div style={{ padding: "1rem" }}>
          <h2 className="text-lg font-semibold mb-4 capitalize">
            Select Location for {mapContext}
          </h2>
          <MapSelector
            onLocationSelect={handleSelectLocation}
            
          />
        </div>
      </Dialog>
    </DefaultLayout>
  );
};
