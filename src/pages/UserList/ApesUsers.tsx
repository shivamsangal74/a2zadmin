import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  LocationOn as LocationIcon,
  Sync as SyncIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import api from "../../Services/Axios/api";
import Loader from "../../components/Loader/Loader";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import MapSelector from "../../components/LocationMap";
import mapIcon from "../../images/maps.svg";
import moment from "moment";
import { toast } from "react-toastify";
import DefaultLayout from "../../layout/DefaultLayout";
import CreateUserDialog from "./AddNewUserForm";

export const ApesUsers = () => {
  const [openMapModal, setOpenMapModal] = useState(false);
  

  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [mapContext, setMapContext] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [merchantDialogOpen, setMerchantDialogOpen] = useState(false);
  const [merchantData, setMerchantData] = useState<any[]>([]);
  const [onboardingDialogOpen, setOnboardingDialogOpen] = useState(false);
  const [onboardingStatus, setOnboardingStatus] = useState<{
    message: string;
    is_approved: string;
  } | null>(null);

  const handleMapClick = (row: any, context: string) => {
    setSelectedRow(row);
    setMapContext(context);
    setOpenMapModal(true);
  };

  const handleSelectLocation = async (location: any) => {
    try {
      await api.post("/apes/updateaepsuser", {
        mobile: selectedRow.mobile,
        ...location,
        type: mapContext,
      });
      refetch();
      toast.success(`Location updated successfully for ${mapContext}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
    setOpenMapModal(false);
  };

  const { isLoading, data, refetch } = useQuery({
    queryKey: ["allaepsusers"],
    queryFn: async () => {
      const response = await api.post("/apes/allaepsusers");
      return response.data;
    },
    refetchOnWindowFocus: true,
  });

  const groupedData = data?.reduce((acc: Record<string, any[]>, item: any) => {
    const id = item.userId;
    if (!acc[id]) acc[id] = [];
    acc[id].push(item);
    return acc;
  }, {});

  const handleGetMerchantData = async (row: any) => {
    setIsFetching(true);
    try {
      const response = await api.post("/apes/instant-merchantList", {
        pan: row.pan,
        mobile: row.mobile,
      });
      debugger;
      const data = response.data.response.records;
      setMerchantData(data); // save data
      setMerchantDialogOpen(true); // open dialog
      toast.success("Merchant data fetched successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsFetching(false);
    }
  };

  async function checkOnBoardingStatus(row: any) {
    setIsFetching(true);
    try {
      const response = await api.post("/apes/get-onboarded-users", {
        userDetails: row.userId,
      });

      const { is_approved, message } = response.data;
      setOnboardingStatus({ is_approved, message });
      setOnboardingDialogOpen(true);

      // Optional toast
      if (["Verification-Pending", "Pending"].includes(is_approved)) {
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsFetching(false);
    }
  }



  async function handleSyncLocation(row: any) {
    setIsFetching(true);
    try {
      const response = await api.post("/apes/updatelocation", {
        userDetails: row.userId,
        type: row.type,
      });

      const {response_code, message } = response.data;
    
     

      // Optional toast
      if (response_code == 1) {
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsFetching(false);
    }
  }
  const [openNewUser, setOpenNewUser] = useState(false);

 async function saveNewUser (userData: any){
    try {
      await api.post("/mpos/saveorupdateuser", userData);
      toast.success("User added successfully");
      setOpenNewUser(false);
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  }
  return (
    <DefaultLayout isList>
      <Box p={2}>
        <Breadcrumb pageName="Apes Users List" />
        <>
      <Button variant="contained" style={{marginBottom: 15}} onClick={() => setOpenNewUser(true)}>
        Add New User
      </Button>
      <CreateUserDialog
        open={openNewUser}
        onClose={() => setOpenNewUser(false)}
        onSubmit={saveNewUser}
      />
    </>
        {isLoading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : groupedData ? (
          Object.entries(groupedData).map(([userId, rows]: any, index) => {
            const mainRow = rows[0];

            return (
              <Accordion key={userId} sx={{ mb: 2, borderRadius: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={0.5}>
                      {index + 1}
                    </Grid>
                    <Grid item xs={2}>
                      <Typography fontWeight="bold">{userId}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      {mainRow.name}
                    </Grid>
                    <Grid item xs={2}>
                      {mainRow.mobile}
                    </Grid>
                    <Grid item xs={3}>
                      {mainRow.email}
                    </Grid>
                    <Grid item xs={2}>
                      <Chip
                        label={mainRow.status}
                        color={
                          mainRow.status === "Approved"
                            ? "success"
                            : mainRow.status === "Pending"
                            ? "warning"
                            : "error"
                        }
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </AccordionSummary>

                <AccordionDetails>
                  {rows.map((row: any, idx: number) => (
                    <Paper
                      key={idx}
                      elevation={2}
                      sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item md={3}>
                          <Typography>
                            <strong>Address:</strong> {row.address}
                          </Typography>
                          <Typography>
                            <strong>Aadhaar:</strong> {row.aadhar}
                          </Typography>
                          <Typography>
                            <strong>PAN:</strong> {row.pan}
                          </Typography>
                        </Grid>

                        <Grid item md={2}>
                          <Typography>
                            <strong>Outlet ID:</strong> {row.outletId}
                          </Typography>
                          <Typography>
                            <strong>Lat:</strong> {row.latitude}
                          </Typography>
                          <Typography>
                            <strong>Long:</strong> {row.longitude}
                          </Typography>
                        </Grid>

                        <Grid item md={2}>
                          <Typography>
                            <strong>Type:</strong> {row.type}
                          </Typography>
                          <Typography>
                            <strong>Reg Date:</strong>{" "}
                            {moment(row.reg_date).format("DD/MM/YYYY")}
                          </Typography>

                          <Box mt={1}>
                            <Chip
                              label={row.status}
                              color={
                                row.status === "Approved"
                                  ? "success"
                                  : row.status === "Pending"
                                  ? "warning"
                                  : "error"
                              }
                              size="small"
                            />
                          </Box>
                        </Grid>

                        <Grid item md={2.5}>
                          <Box display="flex" alignItems="center" gap={2}>
                            {["instantPay", "paySprint", "credoPay"].map(
                              (type) =>
                                row.type
                                  .toLowerCase()
                                  .includes(type.toLocaleLowerCase()) ? (
                                  <Tooltip
                                    title={`Update location for ${type}`}
                                    key={type}>
                                    <IconButton
                                      onClick={() =>
                                        handleMapClick(row, row.type)
                                      }>
                                      <Avatar
                                        src={mapIcon}
                                        sx={{ width: 30, height: 30 }}
                                      />
                                    </IconButton>
                                  </Tooltip>
                                ) : null
                            )}

                            {row.type === "instantpay" && (
                              <div
                                className="flex items-center gap-1"
                                style={{ fontSize: "16px" }}>
                                <div>
                                  <span>InstantPay</span>
                                  <div>
                                    <p style={{ fontSize: "16px" }}>
                                      lat : {row.instantPayLat}
                                    </p>
                                    <p style={{ fontSize: "16px" }}>
                                      {" "}
                                      Long : {row.instantPayLong}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {row.type.toLowerCase().includes("paysprint") && (
                              <div className="flex items-center gap-1">
                                <span></span>
                                <div>
                                  <span>PaySprint</span>
                                  <div>
                                    <p>lat : {row.paySprintLat}</p>
                                    <p>Long : {row.paySprintLong}</p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {row.type === "credopay" && (
                              <div className="flex items-center gap-1">
                                <div>
                                  <span>credoPay</span>
                                  <div>
                                    <p>lat : {row.credoPayLat}</p>
                                    <p>Long : {row.credoPaytLong}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Box>
                        </Grid>

                        <Grid item md={2.5}>
                          <Box>
                            {row.type.toLowerCase().includes("instantpay") && (
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={
                                  isFetching ? (
                                    <CircularProgress />
                                  ) : (
                                    <SyncIcon />
                                  )
                                }
                                fullWidth
                                sx={{ mb: 1 }}
                                
                                onClick={() => handleGetMerchantData(row)}>
                                Get Merchant Data
                              </Button>
                            )}

                            {row.type.toLowerCase().includes("paysprint") && (
                              <>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  startIcon={
                                    isFetching ? (
                                      <CircularProgress />
                                    ) : (
                                      <RefreshIcon />
                                    )
                                  }
                                  fullWidth
                                  onClick={()=> handleSyncLocation(row)}
                                  sx={{ mb: 1 }}>
                                  Sync Location
                                </Button>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  startIcon={
                                    isFetching ? (
                                      <CircularProgress />
                                    ) : (
                                      <RefreshIcon />
                                    )
                                  }
                                  fullWidth
                                  onClick={() => checkOnBoardingStatus(row)}>
                                  Onboarding status
                                </Button>
                              </>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </AccordionDetails>
              </Accordion>
            );
          })
        ) : (
          <Typography>No Records Found</Typography>
        )}

        <Dialog
          open={openMapModal}
          onClose={() => setOpenMapModal(false)}
          maxWidth="md"
          fullWidth>
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              Select Location for <strong>{mapContext}</strong>
            </Typography>
            <MapSelector onLocationSelect={handleSelectLocation} />
          </Box>
        </Dialog>

        <Dialog
          open={merchantDialogOpen}
          onClose={() => setMerchantDialogOpen(false)}
          maxWidth="md"
          fullWidth>
          <Box p={3}>
            <Typography variant="h6" mb={2}>
              Merchant Data
            </Typography>

            {merchantData.map((merchant, idx) => (
              <Paper key={idx} sx={{ display : "flex" ,  mb: 2, p: 2, borderRadius: 2 }}>
               <div>
               <Typography>
                  <strong>Name:</strong> {merchant.name}
                </Typography>
                <Typography>
                  <strong>Mobile:</strong> {merchant.mobile}
                </Typography>
                <Typography>
                  <strong>Email:</strong> {merchant.email}
                </Typography>
                <Typography>
                  <strong>PAN:</strong> {merchant.pan}
                </Typography>
                <Typography>
                  <strong>Outlet ID:</strong> {merchant.outletId}
                </Typography>
                <Typography>
                  <strong>Last Activity:</strong> {merchant.lastActivityDt}
                </Typography>
               </div>
<div>
<Typography>
                  <strong>KYC Status:</strong>{" "}
                  {merchant.KYCStatus ? "Verified" : "Not Verified"}
                </Typography>
                <Typography>
                  <strong>Active:</strong> {merchant.isActive ? "Yes" : "No"}
                </Typography>
                <Typography>
                  <strong>Latitude
                  :</strong>{" "}
                  {merchant?.Latitude}
                </Typography>
                <Typography>
                  <strong>Longitude
                  :</strong> {merchant?.Longitude}
                </Typography>
</div>
                <Box mt={2}>
                  <Typography variant="subtitle1">Bank Accounts</Typography>
                  {merchant.bankAccounts.length > 0 ? (
                    <TableContainer component={Paper} sx={{ mt: 1 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Account Number</TableCell>
                            <TableCell>IFSC</TableCell>
                            <TableCell>Primary</TableCell>
                            <TableCell>Added At</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {merchant.bankAccounts.map((acc: any, i: number) => (
                            <TableRow key={i}>
                              <TableCell>{acc.accountNumber}</TableCell>
                              <TableCell>{acc.ifsc}</TableCell>
                              <TableCell>
                                {acc.isPrimary ? "Yes" : "No"}
                              </TableCell>
                              <TableCell>{acc.addedAt}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography>No bank accounts found</Typography>
                  )}
                </Box>
              </Paper>
            ))}
          </Box>
        </Dialog>

        <Dialog
          open={onboardingDialogOpen}
          onClose={() => setOnboardingDialogOpen(false)}
          maxWidth="xs"
          fullWidth>
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              Onboarding Status
            </Typography>

            {onboardingStatus && (
              <>
                <Typography mb={1}>
                  <strong>Message:</strong> {onboardingStatus.message}
                </Typography>

                <Chip
                  label={onboardingStatus.is_approved}
                  color={
                    onboardingStatus.is_approved === "Approved"
                      ? "success"
                      : onboardingStatus.is_approved === "Verification-Pending"
                      ? "warning"
                      : "error"
                  }
                  variant="outlined"
                  sx={{ mt: 1 }}
                />
              </>
            )}
          </Box>
        </Dialog>
      </Box>
    </DefaultLayout>
  );
};
