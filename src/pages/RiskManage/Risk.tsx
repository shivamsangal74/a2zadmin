import React, { useState } from "react";
import {
  Container,
  Typography,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Box,
  IconButton,
  Collapse,
} from "@mui/material";
import Loader from "../../common/Loader";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getRisk, saveRisk, updateRisk } from "../../Services/riskService";
import TextInput from "../../components/Input/TextInput";
import { Add, ExpandLess, ExpandMore } from "@mui/icons-material";
import { Spin } from "antd";
import api from "../../Services/Axios/api";
import { getCategoryByServiceId } from "../../Services/categoryServices";
interface Service {
  id: string;
  service: string;
  serviceName: string;
  enabled: boolean;
  dailyLimit: string;
  weeklyLimit: string;
  monthlyLimit: string;
  status: string;
  kycStatus: string;
  apesStatus: string;
  purchaseStatus: string;
  userId: string;
  perMaxLimit: string;
  categorys: any;
}

const Risk = ({ userid }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [expandedRowIndex, setExpandedRowIndex] = useState<number | null>(null);
  const [categorys, setcategorys] = useState([]);
  const [Loading, setLoading] = useState(false);
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["filters"],
    queryFn: async () => {
      try {
        const response = await getRisk(userid);
        const serviceData = response.service;
        //   const filteredData = serviceData.map((item:any) => {
        //   return {
        //     ...item,
        //     categorys: typeof item.categorys == "string"
        //       ? JSON.parse(item.categorys)
        //       : JSON.stringify([]),
        //   };
        // });
        if (serviceData.length > 0) {
          setServices(serviceData);
        }
        return serviceData;
      } catch (error) {
        throw error;
      }
    },
    refetchOnWindowFocus: true,
  });
  if (isLoading) return <Loader />;
  if (error) {
    return toast.error("Something went wrong!");
  }

  const handleLimitChange = (
    index: number,
    field:
      | "dailyLimit"
      | "monthlyLimit"
      | "weeklyLimit"
      | "perMaxLimit"
      | "status"
      | "kycStatus"
      | "apesStatus"
      | "purchaseStatus",
    value: any
  ) => {
    const updatedServices = [...services];
    updatedServices[index][field] = value;
    updatedServices[index]["userId"] = userid;

    setServices(updatedServices);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const filteredData = services
        .filter((item) => item.userId !== null)
        .map((item) => {
          return {
            ...item,
            categorys: Array.isArray(item.categorys)
              ? JSON.stringify(item.categorys)
              : JSON.parse(item.categorys),
          };
        });

      await saveRisk(filteredData);
      toast.success("Risk added successfully.");
      refetch();
    } catch (error) {
      refetch();
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  async function handleFetchCategory(serviceId: any) {
    setLoading(true);
    try {
      const res = await getCategoryByServiceId(serviceId);
      console.log("====================================");
      console.log(res.category);
      console.log("====================================");
      setcategorys(res.category);
    } catch (error) {
      toast.error("Failed to fetch category");
    } finally {
      setLoading(false);
    }
  }

  // Function to handle adding/removing the category ID
  const handleCategoryId = (serviceIndex: number, categoryId: string) => {
    const updatedServices = [...services];
    const selectedService = updatedServices[serviceIndex];

    let currentCategories: any[] = JSON.parse(selectedService.categorys) || [];

    const existingCategoryIndex = currentCategories.findIndex(
      (category) => category.id === categoryId
    );

    if (existingCategoryIndex > -1) {
      // Remove the category if it exists
      currentCategories.splice(existingCategoryIndex, 1);
    } else {
      // Add the category with default values for outletId and registrationStatus
      currentCategories.push({
        id: categoryId,
        registrationStatus: false, // Default registration status
        outletId: "", // Default outlet ID
      });
    }

    selectedService.categorys = JSON.stringify(currentCategories); // Save the categories as JSON string
    setServices(updatedServices);
  };

  // Function to handle updating the outlet ID
  const handleOutletId = (
    serviceIndex: number,
    categoryId: string,
    outletId: string
  ) => {
    const updatedServices = [...services];
    const selectedService = updatedServices[serviceIndex];

    let currentCategories: any[] = JSON.parse(selectedService.categorys) || [];

    const existingCategoryIndex = currentCategories.findIndex(
      (category) => category.id === categoryId
    );

    if (existingCategoryIndex > -1) {
      // Update the outlet ID for the existing category
      currentCategories[existingCategoryIndex].outletId = outletId;
    }

    selectedService.categorys = JSON.stringify(currentCategories); // Save the categories as JSON string
    setServices(updatedServices);
  };

  // Function to handle toggling the registration status
  const handleRegistrationStatus = (
    serviceIndex: number,
    categoryId: string,
    registrationStatus: boolean
  ) => {
    const updatedServices = [...services];
    const selectedService = updatedServices[serviceIndex];

    let currentCategories: any[] = JSON.parse(selectedService.categorys) || [];

    const existingCategoryIndex = currentCategories.findIndex(
      (category) => category.id === categoryId
    );

    if (existingCategoryIndex > -1) {
      // Toggle the registration status for the existing category
      currentCategories[existingCategoryIndex].registrationStatus =
        registrationStatus;
    }

    selectedService.categorys = JSON.stringify(currentCategories); // Save the categories as JSON string
    setServices(updatedServices);
  };

  const toggleRow = async (index: number, serviceId: any) => {
    setExpandedRowIndex(expandedRowIndex === index ? null : index);
    await handleFetchCategory(serviceId);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Risk Management
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Daily Limit</TableCell>
              <TableCell>Weekly Limit</TableCell>
              <TableCell>Monthly Limit</TableCell>
              <TableCell>Max Trans Limit</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Purchase Status</TableCell>
              <TableCell>Kyc Status</TableCell>
              <TableCell>Apes Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service: any, index) => (
              <>
                <TableRow key={index}>
                  <TableCell>
                    <IconButton
                      onClick={() => toggleRow(index, service.serviceId)}
                    >
                      {expandedRowIndex === index ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell>{service.serviceName}</TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      style={{ minWidth: "100px" }}
                      type="number"
                      value={service.dailyLimit}
                      onChange={(e) =>
                        handleLimitChange(index, "dailyLimit", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      style={{ minWidth: "100px" }}
                      type="number"
                      value={service.weeklyLimit}
                      onChange={(e) =>
                        handleLimitChange(index, "weeklyLimit", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      style={{ minWidth: "100px" }}
                      type="number"
                      value={service.monthlyLimit}
                      onChange={(e) =>
                        handleLimitChange(index, "monthlyLimit", e.target.value)
                      }
                      // disabled={!service.enabled}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      style={{ minWidth: "100px" }}
                      type="number"
                      value={service.perMaxLimit}
                      onChange={(e) =>
                        handleLimitChange(index, "perMaxLimit", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={service.status == "1"}
                      onChange={async (e) => {
                        const newValue = e.target.checked ? "1" : "0";
                        handleLimitChange(index, "status", Number(newValue));
                      }}
                      inputProps={{ "aria-label": "status switch" }}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: service.status == "1" ? "green" : "red",
                        },
                        "& .MuiSwitch-thumb": {
                          backgroundColor:
                            service.status == "1" ? "green" : "red",
                        },
                        "& .MuiSwitch-track": {
                          backgroundColor:
                            service.status == "1" ? "green" : "red",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={service.purchaseStatus == "1"}
                      onChange={async (e) => {
                        const newValue = e.target.checked ? "1" : "0";
                        handleLimitChange(
                          index,
                          "purchaseStatus",
                          Number(newValue)
                        );
                      }}
                      inputProps={{ "aria-label": "status switch" }}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color:
                            service.purchaseStatus == "1" ? "green" : "red",
                        },
                        "& .MuiSwitch-thumb": {
                          backgroundColor:
                            service.purchaseStatus == "1" ? "green" : "red",
                        },
                        "& .MuiSwitch-track": {
                          backgroundColor:
                            service.purchaseStatus == "1" ? "green" : "red",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={service.kycStatus == "1"}
                      onChange={async (e) => {
                        const newValue = e.target.checked ? "1" : "0";
                        handleLimitChange(index, "kycStatus", Number(newValue));
                      }}
                      inputProps={{ "aria-label": "status switch" }}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: service.kycStatus == "1" ? "green" : "red",
                        },
                        "& .MuiSwitch-thumb": {
                          backgroundColor:
                            service.kycStatus == "1" ? "green" : "red",
                        },
                        "& .MuiSwitch-track": {
                          backgroundColor:
                            service.kycStatus == "1" ? "green" : "red",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={service.apesStatus == "1"}
                      inputProps={{ "aria-label": "status switch" }}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: service.apesStatus == "1" ? "green" : "red",
                        },
                        "& .MuiSwitch-thumb": {
                          backgroundColor:
                            service.apesStatus == "1" ? "green" : "red",
                        },
                        "& .MuiSwitch-track": {
                          backgroundColor:
                            service.apesStatus == "1" ? "green" : "red",
                        },
                      }}
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={10}
                  >
                    <Collapse
                      in={expandedRowIndex === index}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box margin={1}>
                        {isLoading && <Spin />}

                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Category </TableCell>
                              <TableCell>status</TableCell>
                              <TableCell>Registration Status</TableCell>
                              <TableCell>Outlet ID</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {categorys.map((category: any) => {
                              debugger;
                              const currentCategories =
                                JSON.parse(service.categorys) || [];

                              const existingCategory = currentCategories.find(
                                (cat: any) => cat.id === category.id
                              );

                              return (
                                <TableRow key={category.id}>
                                  <TableCell>{category.name}</TableCell>

                                  <TableCell>
                                    <Switch
                                      checked={!!existingCategory}
                                      onChange={() =>
                                        handleCategoryId(index, category.id)
                                      }
                                      inputProps={{
                                        "aria-label": "status switch",
                                      }}
                                      sx={{
                                        "& .MuiSwitch-switchBase.Mui-checked": {
                                          color: existingCategory
                                            ? "green"
                                            : "red",
                                        },
                                        "& .MuiSwitch-thumb": {
                                          backgroundColor: existingCategory
                                            ? "green"
                                            : "red",
                                        },
                                        "& .MuiSwitch-track": {
                                          backgroundColor: existingCategory
                                            ? "green"
                                            : "red",
                                        },
                                      }}
                                    />
                                  </TableCell>

                                  <TableCell>
                                    <Switch
                                      checked={
                                        existingCategory?.registrationStatus ||
                                        false
                                      }
                                      onChange={(e) =>
                                        handleRegistrationStatus(
                                          index,
                                          category.id,
                                          e.target.checked
                                        )
                                      }
                                      inputProps={{
                                        "aria-label":
                                          "registration status switch",
                                      }}
                                      sx={{
                                        "& .MuiSwitch-switchBase.Mui-checked": {
                                          color:
                                            existingCategory?.registrationStatus
                                              ? "green"
                                              : "red",
                                        },
                                        "& .MuiSwitch-thumb": {
                                          backgroundColor:
                                            existingCategory?.registrationStatus
                                              ? "green"
                                              : "red",
                                        },
                                        "& .MuiSwitch-track": {
                                          backgroundColor:
                                            existingCategory?.registrationStatus
                                              ? "green"
                                              : "red",
                                        },
                                      }}
                                    />
                                  </TableCell>

                                  <TableCell>
                                    <TextField
                                      label="Outlet ID"
                                      size="small"
                                      placeholder="Enter Outlet ID"
                                      value={existingCategory?.outletId || ""}
                                      onChange={(e) =>
                                        handleOutletId(
                                          index,
                                          category.id,
                                          e.target.value
                                        )
                                      }
                                    />
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={4}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </Box>
    </Container>
  );
};

export default Risk;
