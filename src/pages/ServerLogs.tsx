import React, { useState } from "react";
import DefaultLayout from "../layout/DefaultLayout";
import moment from "moment";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
  Collapse,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Spin } from "antd";
import { getLogslist, getLogslistById } from "../Services/commonService";
import Loader from "../common/Loader";

export const ServerLogs = () => {
  const [Loading, setLoading] = useState(false);
  const [expandedRowIndex, setExpandedRowIndex] = useState<number | null>(null);
  const [logs, setLogs] = useState([]);
  const [services, setServices] = useState([]);
  const { isLoading, error } = useQuery({
    queryKey: ["filters"],
    queryFn: async () => {
      try {
        const today = new Date();

        // Format date as YYYY-MM-DD
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0"); // Ensure two digits
        const day = String(today.getDate()).padStart(2, "0"); // Ensure two digits

        // Create start and end timestamps
        const startOfDay = `${year}-${month}-${day} 00:00:00`;
        const endOfDay = `${year}-${month}-${day} 23:59:59`;

        const response = await getLogslist(startOfDay, endOfDay);
        const logsData = response;

        if (logsData.length > 0) {
          setLogs(logsData);
        }
        return logsData;
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

  const toggleRow = async (index: number, serviceId: any) => {
    setExpandedRowIndex(expandedRowIndex === index ? null : index);
    await handleFetchCategory(serviceId);
  };
  async function handleFetchCategory(serviceId: any) {
    setLoading(true);
    try {
      const today = new Date();

      // Format date as YYYY-MM-DD
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0"); // Ensure two digits
      const day = String(today.getDate()).padStart(2, "0"); // Ensure two digits

      // Create start and end timestamps
      const startOfDay = `${year}-${month}-${day} 00:00:00`;
      const endOfDay = `${year}-${month}-${day} 23:59:59`;
      const data = await getLogslistById(startOfDay, endOfDay, serviceId);
      setServices(data);
    } catch (error) {
      toast.error("Failed to fetch user");
    } finally {
      setLoading(false);
    }
  }
  return (
    <DefaultLayout isList={true}>
      <div className="container">
        <Typography variant="h4" gutterBottom>
          Server Logs
        </Typography>

        <TableContainer
          component={Paper}
          sx={{ maxWidth: "100%", overflowX: "auto" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>
                  <b>Date</b>
                </TableCell>
                <TableCell>
                  <b>Method</b>
                </TableCell>
                <TableCell>
                  <b>Service</b>
                </TableCell>
                <TableCell>
                  <b>Status</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((service: any, index) => (
                <React.Fragment key={index}>
                  <TableRow>
                    <TableCell>
                      <IconButton onClick={() => toggleRow(index, service.id)}>
                        {expandedRowIndex === index ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell sx={{ verticalAlign: "middle" }}>
                      {moment(service.created_at).format(
                        "DD/MM/YYYY hh:mm:ss a"
                      )}
                    </TableCell>
                    <TableCell sx={{ verticalAlign: "middle" }}>
                      {service.method}
                    </TableCell>
                    <TableCell sx={{ verticalAlign: "middle" }}>
                      {service.request_headers}
                    </TableCell>
                    <TableCell sx={{ verticalAlign: "middle" }}>
                      {service.response_status}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell
                      sx={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={5}
                    >
                      <Collapse
                        in={expandedRowIndex === index}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ margin: 1 }}>
                          {isLoading && <Spin />}
                          <Table sx={{ backgroundColor: "#f0f0f0" }}>
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  <b>Url</b>
                                </TableCell>
                                <TableCell>
                                  <b>Request</b>
                                </TableCell>
                                <TableCell>
                                  <b>Response</b>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {services.map((category: any) => (
                                <TableRow key={category.id}>
                                  <TableCell
                                    sx={{
                                      maxWidth: "250px",
                                      whiteSpace: "normal",
                                      wordBreak: "break-word",
                                      verticalAlign: "top",
                                    }}
                                  >
                                    {category.url}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      maxWidth: "500px",
                                      whiteSpace: "normal",
                                      wordBreak: "break-word",
                                      verticalAlign: "top",
                                    }}
                                  >
                                    {category.request_body}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      maxWidth: "650px",
                                      whiteSpace: "normal",
                                      wordBreak: "break-word",
                                      verticalAlign: "top",
                                    }}
                                  >
                                    {category.response_body}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </DefaultLayout>
  );
};

export default ServerLogs;
