import React, { useState } from "react";
import DefaultLayout from "../../../layout/DefaultLayout";

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
  Input,
} from "@mui/material";
import Chip from "@mui/material/Chip";
import Loader from "../../../common/Loader";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Spin } from "antd";
import { getCategoryByServiceId } from "../../../Services/categoryServices";
import {
  deleteUserBank,
  getAllUserBankList,
  getUserBankList,
  updateUserBank,
} from "../../../Services/commonService";
import { BsTrash } from "react-icons/bs";
import { Select, Option } from "@material-tailwind/react";

interface Service {
  id: string;
  userId: string;
  bankName: string;
  branchIfsc: boolean;
  accountNo: string;
  beneficaryName: string;
  active: boolean;
  status: boolean;
  type: string;
  LimitSettlement: boolean;
  LiveSettlement: Number;
}

const UserBank = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [expandedRowIndex, setExpandedRowIndex] = useState<number | null>(null);
  const [lvalue, setLvalue] = useState("");
  const [banks, setBanks] = useState([]);
  const [Loading, setLoading] = useState(false);
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["filters"],
    queryFn: async () => {
      try {
        const response = await getUserBankList();
        const serviceData = response;

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

  const handleLimitChange = async (
    column: any,
    value: any,
    userId: any,
    col1: any
  ) => {
    try {
      await updateUserBank(userId, column, value, col1);
      refetch();
      toast.success("Value updated");
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  const deleteBank = async (userId: any, col1: any) => {
    try {
      await deleteUserBank(userId, col1);
      toast.success("Value deleted");
      refetch();
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  async function handleFetchCategory(serviceId: any) {
    setLoading(true);
    try {
      const data = await getAllUserBankList(serviceId);
      setBanks(data);
    } catch (error) {
      toast.error("Failed to fetch user");
    } finally {
      setLoading(false);
    }
  }

  const toggleRow = async (index: number, serviceId: any) => {
    setExpandedRowIndex(expandedRowIndex === index ? null : index);
    await handleFetchCategory(serviceId);
  };

  return (
    <DefaultLayout isList={true}>
      <div className="container">
        <Typography variant="h4" gutterBottom>
          User Settlement
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>
                  <b>User Id</b>
                </TableCell>
                <TableCell>
                  <b>Account No</b>
                </TableCell>
                <TableCell>
                  <b>IFSC Code</b>
                </TableCell>
                <TableCell>
                  <b>Bank</b>
                </TableCell>
                <TableCell>
                  <b>Beneficiary Name</b>
                </TableCell>
                <TableCell>
                  <b>Type</b>
                </TableCell>
                <TableCell>
                  <b>Set. Limit</b>
                </TableCell>
                <TableCell>
                  <b>Live Set. Limit</b>
                </TableCell>
                <TableCell>
                  <b>Set. Status</b>
                </TableCell>
                <TableCell>
                  <b>Live Settlement</b>
                </TableCell>
                <TableCell>
                  <b>Action</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.map((service: any, index) => (
                <>
                  <TableRow key={index}>
                    <TableCell>
                      <IconButton
                        onClick={() => toggleRow(index, service.userId)}>
                        {expandedRowIndex === index ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell>{service.userId}</TableCell>
                    <TableCell>{service.bankName}</TableCell>
                    <TableCell>
                      <TableCell>{service.branchIfsc}</TableCell>
                    </TableCell>
                    <TableCell>{service.bankName}</TableCell>
                    <TableCell>{service.beneficaryName}</TableCell>

                    <TableCell>
                      {service.type == "Primary" && (
                        <Chip label={service.type} color="primary" />
                      )}
                      {service.type == "Relative" && (
                        <Chip label={service.type} color="success" />
                      )}
                    </TableCell>
                    <TableCell style={{ width: "125px" }}>
                      <Input
                        value={service.LimitSettlement}
                        onChange={(e) => {
                          setLvalue(e.target.value);
                          const newValue = e.target.value; // Get the new value from the input
                          handleLimitChange(
                            "LimitSettlement",
                            Number(newValue), // Convert the new value to a number
                            service.userId,
                            "userId"
                          );
                          service.LimitSettlement = newValue; // Directly update the service object if necessary
                        }}
                      />
                    </TableCell>
                    <TableCell style={{ width: "125px" }}>
                      <Input value={service.liveLimitSettlement} disabled />
                    </TableCell>

                    <TableCell>
                      <Switch
                        checked={service.status == "Approved"}
                        onChange={async (e) => {
                          const newValue = e.target.checked
                            ? "Approved"
                            : "Pending";
                          handleLimitChange(
                            "status",
                            newValue,
                            service.userId,
                            "userId"
                          );
                        }}
                        inputProps={{ "aria-label": "status switch" }}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color:
                              service.status == "Approved" ? "green" : "red",
                          },
                          "& .MuiSwitch-thumb": {
                            backgroundColor:
                              service.status == "Approved" ? "green" : "red",
                          },
                          "& .MuiSwitch-track": {
                            backgroundColor:
                              service.status == "Approved" ? "green" : "red",
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={service.LiveSettlement == "1"}
                        onChange={async (e) => {
                          const newValue = e.target.checked ? "1" : "0";
                          handleLimitChange(
                            "LiveSettlement",
                            Number(newValue),
                            service.userId,
                            "userId"
                          );
                        }}
                        inputProps={{ "aria-label": "status switch" }}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color:
                              service.LiveSettlement == "1" ? "green" : "red",
                          },
                          "& .MuiSwitch-thumb": {
                            backgroundColor:
                              service.LiveSettlement == "1" ? "green" : "red",
                          },
                          "& .MuiSwitch-track": {
                            backgroundColor:
                              service.LiveSettlement == "1" ? "green" : "red",
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <BsTrash
                        onClick={async (e: any) => {
                          deleteBank(service.userId, "userId");
                        }}
                        fontSize={18}
                        color="red"
                      />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={10}>
                      <Collapse
                        in={expandedRowIndex === index}
                        timeout="auto"
                        unmountOnExit>
                        <Box margin={1}>
                          {isLoading && <Spin />}

                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>S No. </TableCell>
                                <TableCell>userId</TableCell>
                                <TableCell>Account No</TableCell>
                                <TableCell>Branch Ifsc</TableCell>
                                <TableCell>Bank Name</TableCell>
                                <TableCell>Bene Name</TableCell>
                                <TableCell>Type</TableCell>

                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {banks.map((category: any, index) => {
                                return (
                                  <TableRow key={category.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{category.userId}</TableCell>
                                    <TableCell>{category.accountNo}</TableCell>
                                    <TableCell>{category.branchIfsc}</TableCell>
                                    <TableCell>{category.bankName}</TableCell>
                                    <TableCell>
                                      {category.beneficaryName}
                                    </TableCell>
                                    <TableCell size="medium">
                                      <Select
                                        label="Select AccounType"
                                        onChange={(e) => {
                                          handleLimitChange(
                                            "type",
                                            e,
                                            category.userId,
                                            "userId"
                                          );
                                        }}
                                        value={category.type}>
                                        <Option key={index} value={"Primary"}>
                                          Primary
                                        </Option>
                                        <Option key={index} value={"Relative"}>
                                          Relative
                                        </Option>
                                      </Select>
                                    </TableCell>
                                    <TableCell>
                                      <Switch
                                        checked={category.active == "1"}
                                        onChange={async (e) => {
                                          const newValue = e.target.checked
                                            ? "1"
                                            : "0";
                                          handleLimitChange(
                                            "active",
                                            Number(newValue),
                                            category.id,
                                            "id"
                                          );
                                        }}
                                        inputProps={{
                                          "aria-label": "status switch",
                                        }}
                                        sx={{
                                          "& .MuiSwitch-switchBase.Mui-checked":
                                            {
                                              color:
                                                category.active == "1"
                                                  ? "green"
                                                  : "red",
                                            },
                                          "& .MuiSwitch-thumb": {
                                            backgroundColor:
                                              category.active == "1"
                                                ? "green"
                                                : "red",
                                          },
                                          "& .MuiSwitch-track": {
                                            backgroundColor:
                                              category.active == "1"
                                                ? "green"
                                                : "red",
                                          },
                                        }}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <BsTrash
                                        onClick={async (e: any) => {
                                          deleteBank(category.id, "id");
                                        }}
                                        fontSize={18}
                                        color="red"
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
      </div>
    </DefaultLayout>
  );
};

export default UserBank;
