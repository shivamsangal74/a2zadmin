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
  DialogContent,
  DialogTitle,
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
  Close as CloseIcon,
  VerifiedUser as VerifiedUserIcon,
  GppBad as GppBadIcon,
  AccountBalance as AccountBalanceIcon,
  Person as PersonIcon,
  MyLocation as MyLocationIcon,
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
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={1}>
                <PersonIcon color="primary" />
                <Typography variant="h6" fontWeight={700}>
                  Merchant Details
                </Typography>
                <Chip
                  label={`${merchantData.length} record${merchantData.length !== 1 ? "s" : ""}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
              <IconButton onClick={() => setMerchantDialogOpen(false)} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent dividers sx={{ p: 0 }}>
            {merchantData.map((merchant, idx) => (
              <Box key={idx} sx={{ p: 3, ...(idx > 0 && { borderTop: "1px solid #e5e7eb" }) }}>

                {/* ── top row: avatar + name + status chips ── */}
                <Box display="flex" alignItems="center" gap={2} mb={2.5}>
                  <Avatar
                    sx={{ width: 52, height: 52, bgcolor: "primary.main", fontWeight: 700, fontSize: 20 }}
                  >
                    {merchant.name?.charAt(0)?.toUpperCase() ?? "M"}
                  </Avatar>
                  <Box flex={1}>
                    <Typography fontWeight={700} fontSize={17} lineHeight={1.2}>
                      {merchant.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {merchant.email}
                    </Typography>
                  </Box>
                  <Box display="flex" gap={1} flexWrap="wrap" justifyContent="flex-end">
                    <Chip
                      icon={merchant.KYCStatus ? <VerifiedUserIcon /> : <GppBadIcon />}
                      label={merchant.KYCStatus ? "KYC Verified" : "KYC Pending"}
                      color={merchant.KYCStatus ? "success" : "warning"}
                      size="small"
                      variant="filled"
                    />
                    <Chip
                      label={merchant.isActive ? "Active" : "Inactive"}
                      color={merchant.isActive ? "success" : "error"}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>

                {/* ── info grid ── */}
                <Grid container spacing={2} mb={2.5}>
                  {[
                    { label: "Mobile", value: merchant.mobile },
                    { label: "PAN", value: merchant.pan },
                    { label: "Outlet ID", value: merchant.outletId },
                    { label: "Last Activity", value: merchant.lastActivityDt },
                  ].map(({ label, value }) => (
                    <Grid item xs={6} sm={3} key={label}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: "grey.50",
                          border: "1px solid",
                          borderColor: "grey.200",
                          height: "100%",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" display="block" mb={0.3}>
                          {label}
                        </Typography>
                        <Typography fontWeight={600} fontSize={13} sx={{ wordBreak: "break-all" }}>
                          {value ?? "—"}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                {/* ── location row ── */}
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  mb={2.5}
                  sx={{ p: 1.5, borderRadius: 2, bgcolor: "blue.50", border: "1px solid #dbeafe" }}
                >
                  <MyLocationIcon sx={{ color: "#3b82f6", fontSize: 18 }} />
                  <Typography variant="body2" color="text.secondary">
                    <strong>Lat:</strong> {merchant?.Latitude ?? "—"}
                    &nbsp;&nbsp;
                    <strong>Long:</strong> {merchant?.Longitude ?? "—"}
                  </Typography>
                </Box>

                {/* ── bank accounts ── */}
                <Box>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <AccountBalanceIcon sx={{ fontSize: 17, color: "text.secondary" }} />
                    <Typography fontWeight={600} fontSize={14}>
                      Bank Accounts
                    </Typography>
                    <Chip
                      label={merchant.bankAccounts?.length ?? 0}
                      size="small"
                      sx={{ height: 18, fontSize: 11 }}
                    />
                  </Box>

                  {merchant.bankAccounts?.length > 0 ? (
                    <TableContainer
                      component={Paper}
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    >
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ bgcolor: "grey.50" }}>
                            {["Account Number", "IFSC", "Primary", "Added At"].map((h) => (
                              <TableCell
                                key={h}
                                sx={{ fontWeight: 700, fontSize: 12, color: "text.secondary", py: 1 }}
                              >
                                {h}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {merchant.bankAccounts.map((acc: any, i: number) => (
                            <TableRow
                              key={i}
                              sx={{ "&:last-child td": { border: 0 }, "&:hover": { bgcolor: "grey.50" } }}
                            >
                              <TableCell sx={{ fontFamily: "monospace", fontSize: 13 }}>
                                {acc.accountNumber}
                              </TableCell>
                              <TableCell sx={{ fontSize: 13 }}>{acc.ifsc}</TableCell>
                              <TableCell>
                                {acc.isPrimary ? (
                                  <Chip label="Primary" color="primary" size="small" variant="outlined" />
                                ) : (
                                  <Typography variant="body2" color="text.secondary">—</Typography>
                                )}
                              </TableCell>
                              <TableCell sx={{ fontSize: 12, color: "text.secondary" }}>
                                {acc.addedAt}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Box
                      sx={{
                        p: 2,
                        textAlign: "center",
                        borderRadius: 2,
                        border: "1px dashed #d1d5db",
                        color: "text.secondary",
                        fontSize: 13,
                      }}
                    >
                      No bank accounts found
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
          </DialogContent>
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
