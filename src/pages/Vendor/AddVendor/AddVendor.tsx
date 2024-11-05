import BasicTable from "../../../components/BasicTable/BasicTable";
import { ButtonLabel } from "../../../components/Button/Button";
import DefaultLayout from "../../../layout/DefaultLayout";
import { useEffect, useState } from "react";
import TextInput from "../../../components/Input/TextInput";
import "./LappuForm.css";
import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import CashModal from "../../../components/modal";
import {
  addStockServices,
  addVendorBankAccount,
  deleteLappuId,
  deleteVendorId,
  getLappu,
  getOprators,
  getStockLedger,
  getVendorBanks,
  getVendorPayments,
  getVendors,
  handleStocksPay,
  reverseStockServices,
  saveLappuNo,
  saveVendor,
  verifyGst,
} from "../../../Services/vendorService";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Loader from "../../../components/Loader/Loader";
import { DropSearch } from "../../../components/DropDown/DropSearch";
import { getUserWithCredits } from "../../../Services/Axios/UserService";
import { getFundsOn } from "../../../Services/categoryServices";
import { IoAdd } from "react-icons/io5";
import Popup from "../../../components/Model/Model";
import { BsEye, BsPencil, BsTrash } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import {
  getInstantPayBank,
  verifyInstantPayBank,
} from "../../../Services/commonService";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface CashAmounts {
  note1000: number;
  note500: number;
  note200: number;
  note100: number;
  note50: number;
  note20: number;
  note10: number;
  note5: number;
  note2: number;
  note1: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 1 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const AddVendor = () => {
  const [loading, setLoading] = useState(false);
  const [value1, setValue] = useState(0);
  const [deletId, setDeleteId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [fileName, setFileName] = useState("");
  const [gstDoc, setGstDoc] = useState<File | null>(null);
  const [gstRes, setGstRes] = useState({});
  const [fullName, setFullName] = useState("");
  const [mobileno, setMobileNo] = useState("");
  const [commissionType, setCommissionType] = useState("");
  const [commissionValue, setCommissionValue] = useState("");
  const [gstin, setGstin] = useState("");
  const [vendors, setVendors] = useState([]);
  const [lappu, setLappu] = useState([]);
  const [op, setOps] = useState([]);
  const [selectedOp, setSelectedOp] = useState("");
  const [openLapu, setOpenLapu] = useState(false);
  const [openBankAccount, setOpenBankAccount] = useState(false);
  const [openPayoutAccount, setOpenPayoutAccount] = useState(false);
  const [openInputLapu, setOpenInputLapu] = useState(false);
  const [openGstInfo, setOpenGstInfo] = useState(false);
  const [selectedGstData, setSelectedGstData] = useState(false);
  const [lapuNumber, setLapuNumber] = useState("");
  const [lapuName, setLapuName] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const [bankData, setBankData] = useState<any[]>([]);
  const [vendorBankData, setVendorBankData] = useState<any[]>([]);

  const [createdDate, setCreatedDate] = useState<string>(today);
  //bank
  const [beneficary, setBeneficary] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [account, setAccount] = useState("");
  //Add Stock
  const [vendorData, setVendorData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [fundData, setFundsData] = useState([]);
  const [fundPayoutData, setFundPayoutData] = useState([]);
  const [fundBankData, setFundBankData] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState("");
  const [amount, setAmount] = useState(0);
  const [addStockApi, setAddStockApi] = useState("");
  const [receiverPaymentType, setReceiverPaymentType] = useState("");
  const [receiverUser, setReceiverUser] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedAddBank, setSelectedAddBank] = useState("");
  const [userLapus, setUserLapus] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisble] = useState(false);
  const [isBankVisible, setIsBankVisble] = useState(false);
  const [transferMode, setTransferMode] = useState("");
  const [stockLedger, setStockLedger] = useState([]);

  const [isRecivedModalOpen, setIsRecivedModalOpen] = useState(false);

  //payments
  const [stockAmount, setStockAmount] = useState(0);
  const [opraterID, setOpraterID] = useState("");
  const [remarks, setRemarks] = useState("");
  const [payments, setPayments] = useState([]);
  const [cashAmounts, setCashAmounts] = useState<CashAmounts>({
    note1000: 0,
    note500: 0,
    note200: 0,
    note100: 0,
    note50: 0,
    note20: 0,
    note10: 0,
    note5: 0,
    note2: 0,
    note1: 0,
  });
  const [paymentOptions, setPaymentOptions] = useState([
    { showvalue: "IMPS", value: "IMPS" },
    { showvalue: "NEFT", value: "NEFT" },
  ]);

  useEffect(() => {
    if (amount > 200000) {
      setPaymentOptions((prevOptions) => {
        // Check if RTGS is already in the options
        if (!prevOptions.some((option) => option.value === "RTGS")) {
          return [...prevOptions, { showvalue: "RTGS", value: "RTGS" }];
        }
        return prevOptions;
      });
    } else {
      // Remove RTGS if amount is less than or equal to 200000
      setPaymentOptions((prevOptions) =>
        prevOptions.filter((option) => option.value !== "RTGS")
      );
    }
  }, [amount]);

  async function handleAddStocks() {
    const filteredLapus = userLapus.filter(
      (lappu: any) => lappu?.amount !== undefined && lappu?.amount !== null
    );
    const addStock = {
      selectedAddBank: selectedAddBank,
      reciverApi: selectedBank,
      account: account,
      ifsc: ifsc,
      beneficary,
      vendor: selectedVendors,
      amount: Number(amount),
      addStockApi,
      receiverPaymentType,
      receiverUser,
      totalAmount,
      commissionType,
      OperatorId: Math.floor(1000 + Math.random() * 9000),
      remarks: remarks,
      userLapus: filteredLapus,
      cashAmounts: cashAmounts,
      createdDate: createdDate,
      transferMode,
    };

    if (
      !selectedVendors ||
      !amount ||
      !addStockApi ||
      !commissionType ||
      !commissionValue
    ) {
      toast.error("Please fill required fields.");
      return;
    }
    try {
      await addStockServices(addStock);
      toast.success("stock added successfully.");
      paymentsRefetch();
      ledgerRefetch();
      reset();
    } catch (error) {
      toast.error(`${error}`);
    }
  }

  const handleCashModalSubmit = (cashAmounts: CashAmounts) => {
    setCashAmounts(cashAmounts);
  };

  async function openDeleteModal(id: string) {
    setDeleteId(id);
    setShowModal(true);
  }
  async function handleStockPayment() {
    const StockPayment = {
      vendor: selectedVendors,
      amount: Number(stockAmount),
      selectedAddBank: selectedAddBank,
      reciverApi: selectedBank,
      account: account,
      ifsc: ifsc,
      beneficary,
      receiverPaymentType,
      receiverUser,
      remarks: remarks,
      OperatorId: opraterID || Math.floor(1000 + Math.random() * 9000),
      cashAmounts: cashAmounts,
      transferMode,
    };

    if (!selectedVendors || !stockAmount || !receiverPaymentType) {
      toast.error("Please fill required fields.");
      return;
    }

    try {
      const paymentResp = await handleStocksPay(StockPayment);
      if (paymentResp.error) {
        toast.error(paymentResp.message);
      } else {
        toast.success("Fund Received successfully.");
        paymentsRefetch();
        reset();
      }
    } catch (error) {
      toast.error("Unable to Received Funds.");
    }
  }

  function reset() {
    setLoading(false);
    setOpraterID("");
    setRemarks("");
    setFileName("");
    setFullName("");
    setMobileNo("");
    setCommissionType("");
    setCommissionValue("");
    setGstin("");
    setGstRes({});
    setSelectedVendors("");
    setAmount(0);
    setAddStockApi("");
    setReceiverPaymentType("");
    setReceiverUser("");
    setSelectedBank("");
    setStockAmount(0);
    setLapuNumber("");
    setLapuName("");
    setSelectedOp("");
    setUserLapus([]);
    setAccount("");
    setIfsc("");
    setBeneficary("");
    setBankData([]);
    setSelectedAddBank("");
    setVendorBankData([]);
  }

  const lappuColumns = [
    {
      header: "Lappu Number",
      accessorKey: "lappuId",
    },
    {
      header: "Operator",
      accessorKey: "operator",
    },
    {
      header: "Vendor",
      accessorKey: "vendor",
    },
    {
      header: "Date",
      accessorKey: "lappuCreatedDate",
    },
    {
      header: "Action",
      cell: (row: any) => (
        <div className="flex gap-2">
          <div className="cursor-pointer" title="Delete Lappu">
            <BsTrash
              fontSize={18}
              color="red"
              onClick={() => openDeleteModal(row.row.original.lappuId)}
            />
          </div>
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-lg">
                <p>
                  <b>Are you sure you want to delete this lappu?</b>
                </p>
                <div className="flex justify-end mt-4">
                  <button
                    className="px-4 py-2 mr-2 bg-red-500 text-white rounded"
                    onClick={() => {
                      setShowModal(false);
                      deleteLappu(deletId);
                    }}
                  >
                    Delete
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ),
    },
  ];
  const columns = [
    {
      header: "Name",
      accessorKey: "fullName",
    },
    {
      header: "Mobile Number",
      accessorKey: "mobileno",
    },
    {
      header: "gst number",
      accessorKey: "gstin",
    },
    {
      header: "Commission Type",
      accessorKey: "commissiontype",
    },
    {
      header: "Commission Value",
      accessorKey: "commissionvalue",
    },
    {
      header: "Action",
      cell: (row: any) => (
        <div className="flex gap-6">
          <div>
            <BsEye
              fontSize={18}
              onClick={() => showGstInfo(row.row.original.vendorUniqueId)}
            />
          </div>
          <div className="cursor-pointer">
            <BsPencil
              fontSize={18}
              color="blue"
              onClick={() => showGstInfo(row.row.original.vendorUniqueId)}
            />
          </div>
          <div className="cursor-pointer" title="Delete Operator">
            <BsTrash
              fontSize={18}
              color="red"
              onClick={() => openDeleteModal(row.row.original.vendorUniqueId)}
            />
          </div>
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-lg">
                <p>
                  <b>Are you sure you want to delete this vendor?</b>
                </p>
                <div className="flex justify-end mt-4">
                  <button
                    className="px-4 py-2 mr-2 bg-red-500 text-white rounded"
                    onClick={() => {
                      setShowModal(false);
                      deleteVendor(deletId);
                    }}
                  >
                    Delete
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ),
    },
  ];

  const columnspayments = [
    {
      header: "Vendor",
      accessorKey: "vendor",
    },
    {
      header: "Stock Amount",
      accessorKey: "stockAmount",
    },
    {
      header: "Total Stock",
      accessorKey: "totalStock",
    },
    {
      header: "Paid Stock",
      accessorKey: "paidStock",
    },
    {
      header: "Remaining Stock",
      accessorKey: "remainingStock",
    },
    {
      header: "Addeds Date",
      accessorKey: "createdDate",
    },
    {
      header: "Action",
      cell: (row) => {
        return (
          <Button
            size="small"
            onClick={() => handleAddStockPayments(row.row.original)}
            variant="outlined"
            startIcon={<IoAdd />}
          >
            Add Stock
          </Button>
        );
      },
    },
  ];

  const columnsStockLedger = [
    {
      header: "createdDate",
      accessorKey: "createdDate",
    },
    {
      header: "Vendor/TraxId",
      accessorKey: "VendorID",
    },
    {
      header: "Stock Qty",
      accessorKey: "amount",
    },
    {
      header: "commission",
      accessorKey: "commission",
    },
    {
      header: "Pay Amount",
      accessorKey: "totalAmount",
    },

    {
      header: "Cr/Db",
      accessorKey: "crdb",
    },
    {
      header: "op/Cl",
      accessorKey: "opcl",
    },
    {
      header: "Fund",
      accessorKey: "fundName",
    },
    {
      header: "FundBal",
      accessorKey: "StockQty",
    },
    {
      header: "Remarks",
      accessorKey: "remarks",
    },
    {
      header: "Status",
      accessorKey: "status",
    },
    {
      header: "Action",
      cell: (row: any) => {
        return (
          <Button
            size="small"
            onClick={() => hanldeReverse(row.row.original)}
            variant="outlined"
            startIcon={<IoAdd />}
          >
            Reverse
          </Button>
        );
      },
    },
  ];

  const { refetch: paymentsRefetch } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      try {
        const response = await getVendorPayments();
        setPayments(response);
        return response; // Return user data from the query function
      } catch (error) {
        toast.error("Something went wrong!");
      }
    },
    refetchOnWindowFocus: false,
  });

  async function handleAddStockPayments(row: any) {
    const bankResponse = await getVendorBanks(row.vendor);
    let formattedBank: any = [];
    if (bankResponse.length > 0) {
      bankResponse.forEach((bank: any) => {
        formattedBank.push({
          showvalue: bank.bankName,
          value: bank.bankName,
          ifsc: bank.branchIsc,
          accountNo: bank.accountNo,
          beneficary: bank.beneficaryName,
        });
      });
    }
    setVendorBankData(formattedBank);
    if (row) {
      if (row.stockAmount) {
        setStockAmount(row.stockAmount);
      }

      if (row.vendor) {
        setSelectedVendors(row.vendor);
      }
    }
  }

  const showGstInfo = (vendorId: any) => {
    const selectedVendor = vendors.find(
      (vendor) => vendor?.vendorUniqueId === vendorId
    );
    if (selectedVendor) {
      setSelectedGstData(selectedVendor);
    }
    setOpenGstInfo(true);
  };

  const editLappu = (lappuId: any) => {
    const selectedVendor = vendors.find(
      (vendor) => vendor?.vendorUniqueId === vendorId
    );
    if (selectedVendor) {
      setSelectedGstData(selectedVendor);
    }
    setOpenGstInfo(true);
  };

  const deleteLappu = async (lappuId: any) => {
    try {
      await deleteLappuId(lappuId);
      toast.success("Lappu deleted successfully.");
      refetch();
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  const deleteVendor = async (vendorId: any) => {
    try {
      await deleteVendorId(vendorId);
      toast.success("Vendor deleted successfully.");
      refetch();
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  const handleChange = async (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setValue(newValue);
    reset();
    refetch();
    paymentsRefetch();
  };

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const fileType = file.type;
      if (fileType === "application/pdf" || fileType.startsWith("image/")) {
        setFileName(file.name);
        setGstDoc(file);
      } else {
        toast.error("Only image and PDF files are allowed.");
      }
    }
  }

  const handleAddVendor = async () => {
    const data = {
      fullName,
      mobileno,
      commissiontype: commissionType,
      commissionvalue: commissionValue,
      vendorApi: addStockApi,
      gstin,
      ...gstRes,
    };

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key as keyof typeof data]);
    });

    formData.append("operator", selectedOp);

    if (gstDoc) {
      formData.append("gstDoc", gstDoc);
      formData.append("gstDocName", fileName);
    }

    if (!data.fullName || !data.mobileno) {
      toast.error("Please fill required fields.");
      return;
    }

    try {
      await saveVendor(formData);
      reset();
      toast.success("Vendor created successfully.");
      refetch();
    } catch (e) {
      toast.error("Failed to create vendor.");
    }
  };

  const handleCommChange = (event: any) => {
    setCommissionType(event);
  };

  const hanldeReverse = async (event: any) => {
    try {
      await reverseStockServices(event);
      toast.success("Reverse Stock sucessfully");
    } catch (e) {
      toast.error("Something went wrong!");
    }
  };

  const { isLoading, refetch } = useQuery({
    queryKey: ["addvendor"],
    queryFn: async () => {
      try {
        const vendorsData = await getVendors();
        const lappuData = await getLappu();
        setLappu(lappuData);

        let _dataOP: any = [];
        if (vendorsData.length > 0) {
          vendorsData.forEach((op: any) => {
            _dataOP.push({
              showvalue: `${op?.fullName} - ${op?.mobileno}`,
              value: op?.vendorUniqueId,
              commissionType: op?.commissiontype,
              commissionValue: op?.commissionvalue,
              vendorApi: op?.vendorApi,
            });
          });
        }
        setVendorData(_dataOP);
        setVendors(vendorsData);

        return vendorsData;
      } catch (error) {
        toast.error("Something went wrong!");
      }
    },
    refetchOnWindowFocus: false,
  });

  const { refetch: ledgerRefetch } = useQuery({
    queryKey: ["oprators"],
    queryFn: async () => {
      try {
        const oprators = await getOprators();
        const stockLedgerData = await getStockLedger();
        setStockLedger(stockLedgerData.stockData);
        let _dataOP: any = [];
        if (oprators.length > 0) {
          oprators.forEach((op: any) => {
            _dataOP.push({
              showvalue: op?.name,
              value: op?.id,
            });
          });
        }
        setOps(_dataOP);

        return oprators;
      } catch (error) {
        toast.error("Something went wrong!");
      }
    },
    refetchOnWindowFocus: false,
  });

  const verifyGstFn = async () => {
    if (!gstin) {
      toast.error("Please enter a valid GST number.");
      return;
    }
    try {
      const gst = await verifyGst(gstin);
      setGstRes({ ...gst, address: Object.values(gst.address).join() });
      toast.success("GST verified successfully.");
    } catch (error) {
      toast.error("Something went wrong in verification!");
    }
  };

  async function handleOpraterChange(value: string | null) {
    setSelectedOp(value);
  }

  async function handleOpenLappu(value: string | null) {
    setSelectedVendors(value);

    const vendorDetails = vendorData.find((vendor) => vendor.value === value);
    if (vendorDetails) {
      if (vendorDetails.commissionType) {
        setCommissionType(vendorDetails.commissionType);
      }

      if (vendorDetails.vendorApi) {
        setAddStockApi(Number(vendorDetails.vendorApi));
      }

      if (vendorDetails.commissionValue) {
        setCommissionValue(vendorDetails.commissionValue);
      }

      if (lappu) {
        const filteredLappus = lappu.filter(
          (lapuItem) => lapuItem.vendorId === vendorDetails.value
        );

        setUserLapus(filteredLappus);
        setOpenInputLapu(true);
      }
      const bankResponse = await getVendorBanks(value);
      let formattedBank: any = [];
      if (bankResponse.length > 0) {
        bankResponse.forEach((bank: any) => {
          formattedBank.push({
            showvalue: bank.bankName,
            value: bank.bankName,
            ifsc: bank.branchIsc,
            accountNo: bank.accountNo,
            beneficary: bank.beneficaryName,
          });
        });
      }
      setVendorBankData(formattedBank);
    }
  }

  async function handleVendorChange(value: any) {
    setSelectedVendors(value);
    setUserLapus([]);
    const bankResponse = await getVendorBanks(value);
    let formattedBank: any = [];
    if (bankResponse.length > 0) {
      bankResponse.forEach((bank: any) => {
        formattedBank.push({
          showvalue: bank.bankName,
          value: bank.bankName,
          ifsc: bank.branchIsc,
          accountNo: bank.accountNo,
          beneficary: bank.beneficaryName,
        });
      });
    }
    setVendorBankData(formattedBank);
    const vendorDetails = vendorData.find((vendor) => vendor.value === value);
    if (vendorDetails) {
      if (vendorDetails.commissionType) {
        setCommissionType(vendorDetails.commissionType);
      }

      if (vendorDetails.commissionValue) {
        setCommissionValue(vendorDetails.commissionValue);
      }
    }
  }

  const { refetch: usersRefetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const response = await getFundsOn();
        const users = await getUserWithCredits();
        let _dataUser: any = [];
        if (users.users.length > 0) {
          users.users.forEach((user: any) => {
            _dataUser.push({
              showvalue:
                user?.userUniqueId +
                " " +
                user?.fullName +
                "(" +
                user.phoneNumber +
                ") \n" +
                "Credit" +
                user.total,
              value: user?.userUniqueId,
              wallet: user?.wallet,
              userUniqueId: user?.userUniqueId,
            });
          });
        }
        setUsersData(_dataUser);
        const fundsData = response.fund;
        let _data: any = [];
        if (fundsData.length > 0) {
          fundsData.forEach((fund: any) => {
            if (fund.fundType.includes("BANK"))
              _data.push({
                showvalue: fund?.name,
                value: fund?.fundCode,
              });
          });
          setFundBankData(_data);
          _data = [];
          fundsData.forEach((fund: any) => {
            _data.push({
              showvalue: fund?.name,
              value: fund?.fundCode,
            });
          });
          setFundsData(_data);
          _data = [];
          if (fundsData.length > 0) {
            fundsData.forEach((fund: any) => {
              if (fund.fundType.includes("PAYOUT"))
                _data.push({
                  showvalue: fund?.name,
                  value: fund?.fundCode,
                });
            });
            setFundPayoutData(_data);
          }
        }

        return _dataUser; // Return user data from the query function
      } catch (error) {
        toast.error("Something went wrong!");
      }
    },
    refetchOnWindowFocus: false,
  });

  const calculateTotalAmount = () => {
    let total = 0;
    if (commissionType === "flat") {
      total = (Number(amount) / (100 + Number(commissionValue))) * 100;
    } else if (commissionType === "variable") {
      total = (Number(amount) * (100 - Number(commissionValue))) / 100;
    }
    return total;
  };

  const totalAmount = calculateTotalAmount();

  const addLapuNumberField = async () => {
    if (lapuNumber) {
      try {
        let data = {
          lappuId: lapuNumber,
          lappuName: lapuName,
          lappuOperator: selectedOp,
          vendorId: selectedVendors,
        };
        await saveLappuNo(data);
        reset();
        toast.success("Lappu No added successfully.");
        refetch();
      } catch (e) {
        toast.error("Failed to create Lappu No.");
      }
    }
  };

  const handleLappuChange = (index, event) => {
    const values = [...userLapus];
    values[index][event.target.name] = event.target.value;
    setUserLapus(values);
  };

  const addBankAccount = async () => {
    if (!beneficary) {
      toast.warn("Please verify your account");
      return;
    }
    const emptyFields = [];
    setLoading(true);
    if (!selectedAddBank) emptyFields.push("Bank");
    if (!account) emptyFields.push("Account No");
    if (!selectedVendors) emptyFields.push("Vendor");
    if (!ifsc) emptyFields.push("Ifsc Code");
    if (emptyFields.length > 0) {
      toast.error(
        `Please fill in the following fields: ${emptyFields.join(", ")}`
      );
      setLoading(false);
      return;
    }
    try {
      let _data = {
        vendor: selectedVendors,
        bankName: selectedAddBank,
        branchIsc: ifsc,
        accountNo: account,
        beneficaryName: beneficary,
      };
      await addVendorBankAccount(_data);
      toast.success("Bank added successfully");
      setOpenBankAccount(false);
      reset();
    } catch (e) {
      toast.error("Something went wrong!");
    }
  };

  const handleLappuSubmit = (e) => {
    const total = userLapus.reduce(
      (acc, lapu) => acc + parseFloat(lapu.amount || 0),
      0
    );
    setAmount(total);
    setOpenInputLapu(false);
  };
  async function handleStockApi(value: any) {
    setAddStockApi(value);
    if (value == "436") {
      setIsModalOpen(true);
    }
  }
  async function handleReceiverPaymentType(value: any) {
    setReceiverPaymentType(value);
    if (value == "436") {
      setIsRecivedModalOpen(true);
    }
    if (value == "536" || value == "100") {
      setIsVisble(true);
    } else {
      setIsVisble(false);
    }
    if (value == "BANK") {
      setIsBankVisble(true);
    } else {
      setIsBankVisble(false);
    }
    if (value == "PAYOUT") {
      setOpenPayoutAccount(true);
    } else {
      setOpenPayoutAccount(false);
    }
  }
  const fetchDataAndOpenPopup = async () => {
    try {
      const bankResponse = await getInstantPayBank();
      console.log(bankResponse);
      setBankData([]);
      const formattedBank = bankResponse.map((bank: any) => ({
        showvalue: bank.name,
        value: bank.name,
        ifsc: bank.ifscGlobal,
      }));
      setBankData(formattedBank);
      setOpenBankAccount(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSelectedAddBank = async (val: any) => {
    setSelectedAddBank(val);
    setIfsc(bankData.find((bank) => bank.value == val).ifsc);
  };

  const handleSelectVendorBank = async (val: any) => {
    setAccount("");
    setBeneficary("");
    setIfsc("");
    setSelectedAddBank(val);
    setAccount(vendorBankData.find((bank) => bank.value == val).accountNo);
    setBeneficary(vendorBankData.find((bank) => bank.value == val).beneficary);
    setIfsc(vendorBankData.find((bank) => bank.value == val).ifsc);
  };

  const verifyAccount = async () => {
    try {
      const response = await verifyInstantPayBank({
        accountNumber: account,
        bankIfsc: ifsc,
        vendorId: selectedVendors,
      });
      if (response.error) {
        toast.error(response.message);
      } else {
        console.log(response.name);
        setBeneficary(response.name);
        toast.success("Bank account verified successfully!");
      }
    } catch (e: any) {
      toast.error("Something went wrong");
    }
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCreatedDate(event.target.value);
  };

  return (
    <DefaultLayout isList={true}>
      <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 py-2">
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <div className="flex justify-between">
              <Tabs
                value={value1}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Add Stock" {...a11yProps(0)} />
                <Tab label="Payment" {...a11yProps(1)} />
                <Tab label="Add Vendor" {...a11yProps(2)} />
                <Tab
                  label="Add Lappu No"
                  onClick={() => setOpenLapu(true)}
                  {...a11yProps(3)}
                />
                <Tab
                  label="Add Bank Acc"
                  onClick={fetchDataAndOpenPopup}
                  {...a11yProps(4)}
                />
              </Tabs>
            </div>
          </Box>
        </Box>
      </div>
      {/* add vendor screen  */}
      <CustomTabPanel value={value1} index={2}>
        <div className="p-6 grid gap-6 md:grid-cols-4">
          <div className="flex gap-2">
            <div className="w-90">
              <TextInput
                value={fullName}
                label={"Vendor Name"}
                name={"fullName"}
                onChange={setFullName}
                required
              />
            </div>
          </div>
          <div>
            <TextInput
              label="Vendor Mobile No"
              onChange={setMobileNo}
              value={mobileno}
              name={"mobileno"}
              required
            />
          </div>

          <div>
            <DropSearch
              value={commissionType}
              onchange={handleCommChange}
              placeholder="Select Commission Type"
              options={[
                { showvalue: "Flat", value: "flat" },
                { showvalue: "Variable", value: "variable" },
              ]}
              error={""}
            />
          </div>

          <div>
            <TextInput
              label="Commission Value"
              onChange={setCommissionValue}
              value={commissionValue}
              name={"commissionvalue"}
            />
          </div>
          <div>
            <DropSearch
              value={addStockApi}
              onchange={(val) => handleStockApi(val)}
              placeholder="Add Stock Api"
              options={[...fundData]}
              error={""}
            />
          </div>
          <div>
            <TextInput
              label="Gst In"
              onChange={setGstin}
              value={gstin}
              name={"gstin"}
              verificationFn={verifyGstFn}
              disabledProp={Object.keys(gstRes).length ? true : false}
            />
          </div>
          <div>
            <div
              style={{ width: "100%" }}
              className="bg-white text-[#333] flex items-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] p-1 min-w-[300px] w-max font-[sans-serif] rounded-md overflow-hidden"
            >
              <div className="px-4 flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 612.675 612.675"
                >
                  <path
                    d="M581.209 223.007 269.839 530.92c-51.592 51.024-135.247 51.024-186.839 0-51.592-51.023-51.592-133.737 0-184.761L363.248 69.04c34.402-34.009 90.15-34.009 124.553 0 34.402 34.008 34.402 89.166 0 123.174l-280.249 277.12c-17.19 17.016-45.075 17.016-62.287 0-17.19-16.993-17.19-44.571 0-61.587L394.37 161.42l-31.144-30.793-249.082 246.348c-34.402 34.009-34.402 89.166 0 123.174 34.402 34.009 90.15 34.009 124.552 0l280.249-277.12c51.592-51.023 51.592-133.737 0-184.761-51.593-51.023-135.247-51.023-186.839 0L36.285 330.784l1.072 1.071c-53.736 68.323-49.012 167.091 14.5 229.88 63.512 62.79 163.35 67.492 232.46 14.325l1.072 1.072 326.942-323.31-31.122-30.815z"
                    data-original="#000000"
                  />
                </svg>
                <p className="text-sm ml-3">
                  {fileName
                    ? fileName.slice(0, 18) + "..."
                    : "Upload GST Certificate"}
                </p>
              </div>

              <label
                htmlFor="uploadFile1"
                className="bg-black hover:bg-gray-700 text-white text-sm px-3 py-2.5 outline-none rounded-md cursor-pointer ml-auto w-max block"
              >
                Upload
              </label>
              <input
                type="file"
                id="uploadFile1"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="ml-8">
            <ButtonLabel
              type="button"
              loader={loading}
              disabled={loading}
              onClick={() => handleAddVendor()}
              label="Add Vendor"
            />
          </div>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <BasicTable data={vendors} columns={columns} />
        )}
      </CustomTabPanel>
      {/* add stock screen  */}
      <CustomTabPanel value={value1} index={0}>
        <div className="p-6 grid gap-6 md:grid-cols-4">
          <CashModal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            onSubmit={handleCashModalSubmit}
            type="Transfer"
            amount={Number(amount)}
            cashAmounts={cashAmounts}
          />
          <CashModal
            isOpen={isRecivedModalOpen}
            onRequestClose={() => setIsRecivedModalOpen(false)}
            onSubmit={handleCashModalSubmit}
            type="Received"
            amount={Number(amount)}
            cashAmounts={cashAmounts}
          />
          <div>
            <DropSearch
              value={selectedVendors}
              onchange={handleOpenLappu}
              placeholder="Select Vendor"
              options={[...vendorData]}
              error={""}
            />
          </div>
          <div>
            <TextInput
              label="Amount"
              onChange={setAmount}
              value={amount}
              name={"amount"}
              type="number"
              required
            />
          </div>
          <div>
            <DropSearch
              value={commissionType}
              onchange={handleCommChange}
              placeholder="Select Commission Type"
              options={[
                { showvalue: "Flat", value: "flat" },
                { showvalue: "Variable", value: "variable" },
              ]}
              error={""}
            />
          </div>
          <div>
            <TextInput
              label="Commission Value"
              onChange={setCommissionValue}
              value={commissionValue}
              name={"commissionvalue"}
              type="number"
            />
          </div>
          <div>
            <TextInput
              label="Total Amount"
              onChange={() => console.log("")}
              value={totalAmount}
              name={"totalAmount"}
              disabledProp={true}
            />
          </div>
          <div>
            <DropSearch
              value={addStockApi}
              onchange={(val) => handleStockApi(val)}
              placeholder="Add Stock Api"
              options={[...fundData]}
              error={""}
            />
          </div>

          <div>
            <DropSearch
              value={receiverPaymentType}
              onchange={(val) => handleReceiverPaymentType(val)}
              placeholder="Receiver Payment Type"
              options={[
                { showvalue: "CASH", value: "436" },
                { showvalue: "BANK", value: "BANK" },
                { showvalue: "CREDIT", value: "536" },
                { showvalue: "WALLET", value: "100" },
                { showvalue: "PAYOUT", value: "PAYOUT" },
              ]}
              error={""}
            />
          </div>
          {isVisible && (
            <>
              <div>
                <DropSearch
                  value={receiverUser}
                  onchange={(val) => setReceiverUser(val)}
                  placeholder="Receiver User"
                  options={[...usersData]}
                  error={""}
                />
              </div>
            </>
          )}

          {isBankVisible && (
            <>
              <div>
                <DropSearch
                  value={receiverUser}
                  onchange={(val) => setReceiverUser(val)}
                  placeholder="Select Bank"
                  options={[...fundBankData]}
                  error={""}
                />
              </div>
            </>
          )}

          {openPayoutAccount && (
            <>
              <div>
                <DropSearch
                  value={selectedBank}
                  onchange={(val) => setSelectedBank(val)}
                  placeholder="Select Bank"
                  options={[...fundPayoutData]}
                  error={""}
                />
              </div>
              <div>
                <DropSearch
                  value={selectedAddBank}
                  onchange={handleSelectVendorBank}
                  placeholder="Select Vendor Bank"
                  options={[...vendorBankData]}
                  error={""}
                />
              </div>
              <div>
                <TextInput
                  label={`Account Number`}
                  value={account}
                  disabledProp={true}
                  name={`accountNumber`}
                  onChange={setAccount}
                  type="number"
                />
              </div>
              <div>
                <TextInput
                  label={`Ifsc Code`}
                  value={ifsc}
                  disabledProp={true}
                  name={`ifsc code`}
                  onChange={setIfsc}
                />
              </div>
              <div>
                <TextInput
                  label={`Beneficary Name`}
                  value={beneficary}
                  name={`lapuname`}
                  disabledProp={true}
                  onChange={setBeneficary}
                />
              </div>
              <div>
                <DropSearch
                  value={transferMode}
                  onchange={(val) => setTransferMode(val)}
                  placeholder="Select Transfer Mode"
                  options={paymentOptions}
                  error={""}
                />
              </div>
            </>
          )}

          {/* <div>
            <TextInput
              label="OpraterID"
              onChange={setOpraterID}
              value={opraterID}
              name={"OpraterID"}
            />
          </div> */}
          <div>
            <TextInput
              label="Remarks"
              onChange={setRemarks}
              value={remarks}
              name={"Remarks"}
            />
          </div>
          <div>
            <input
              id="date-input"
              type="date"
              value={createdDate}
              onChange={handleDateChange}
              className="p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="">
            <ButtonLabel
              type="button"
              loader={loading}
              disabled={loading}
              onClick={() => handleAddStocks()}
              label="Add Stock"
            />
          </div>
        </div>
        <BasicTable data={stockLedger} columns={columnsStockLedger} />
      </CustomTabPanel>
      {/* Payment screen  */}
      <CustomTabPanel value={value1} index={1}>
        <div className="p-6 grid gap-6 md:grid-cols-4">
          <CashModal
            isOpen={isRecivedModalOpen}
            onRequestClose={() => setIsRecivedModalOpen(false)}
            onSubmit={handleCashModalSubmit}
            type="Received"
            amount={Number(amount)}
            cashAmounts={cashAmounts}
          />
          <div>
            <DropSearch
              value={selectedVendors}
              onchange={handleVendorChange}
              placeholder="Select Vendor"
              options={[...vendorData]}
              error={""}
            />
          </div>
          <div>
            <TextInput
              label="Stock Amount"
              onChange={setStockAmount}
              value={stockAmount}
              name={"Stock Amount"}
              type="number"
            />
          </div>
          <div>
            <DropSearch
              value={receiverPaymentType}
              onchange={(val) => handleReceiverPaymentType(val)}
              placeholder="Receiver Payment Type"
              options={[
                { showvalue: "CASH", value: "436" },
                { showvalue: "BANK", value: "BANK" },
                { showvalue: "CREDIT", value: "536" },
                { showvalue: "WALLET", value: "100" },
                { showvalue: "PAYOUT", value: "PAYOUT" },
              ]}
              error={""}
            />
          </div>
          {isVisible && (
            <>
              <div>
                <DropSearch
                  value={receiverUser}
                  onchange={(val) => setReceiverUser(val)}
                  placeholder="Receiver User"
                  options={[...usersData]}
                  error={""}
                />
              </div>
            </>
          )}

          {isBankVisible && (
            <>
              <div>
                <DropSearch
                  value={receiverUser}
                  onchange={(val) => setReceiverUser(val)}
                  placeholder="Select Bank"
                  options={[...fundBankData]}
                  error={""}
                />
              </div>
            </>
          )}

          {openPayoutAccount && (
            <>
              <div>
                <DropSearch
                  value={selectedBank}
                  onchange={(val) => setSelectedBank(val)}
                  placeholder="Select Bank"
                  options={[...fundPayoutData]}
                  error={""}
                />
              </div>
              <div>
                <DropSearch
                  value={selectedAddBank}
                  onchange={handleSelectVendorBank}
                  placeholder="Select Vendor Bank"
                  options={[...vendorBankData]}
                  error={""}
                />
              </div>
              <div>
                <TextInput
                  label={`Account Number`}
                  value={account}
                  disabledProp={true}
                  name={`accountNumber`}
                  onChange={setAccount}
                  type="number"
                />
              </div>
              <div>
                <TextInput
                  label={`Ifsc Code`}
                  value={ifsc}
                  disabledProp={true}
                  name={`ifsc code`}
                  onChange={setIfsc}
                />
              </div>
              <div>
                <TextInput
                  label={`Beneficary Name`}
                  value={beneficary}
                  name={`lapuname`}
                  disabledProp={true}
                  onChange={setBeneficary}
                />
              </div>
              <div>
                <DropSearch
                  value={transferMode}
                  onchange={(val) => setTransferMode(val)}
                  placeholder="Select Transfer Mode"
                  options={paymentOptions}
                  error={""}
                />
              </div>
            </>
          )}

          <div>
            <TextInput
              label="Remarks"
              onChange={setRemarks}
              value={remarks}
              name={"Remarks"}
            />
          </div>
          <div>
            <input
              id="date-input"
              type="date"
              value={createdDate}
              onChange={handleDateChange}
              className="p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="">
            <ButtonLabel
              type="button"
              loader={loading}
              disabled={loading}
              onClick={handleStockPayment}
              label="Receive"
            />
          </div>
        </div>

        <BasicTable data={payments} columns={columnspayments} />
      </CustomTabPanel>
      {/* add lappu screen  */}
      <CustomTabPanel value={value1} index={3}>
        {isLoading ? (
          <Loader />
        ) : (
          <BasicTable data={lappu} columns={lappuColumns} />
        )}
      </CustomTabPanel>

      {/* add lappu popup */}
      <Popup
        isOpen={openLapu}
        onClose={() => setOpenLapu(false)}
        title="Add Lapu Numbers"
      >
        <div className="grid gap-3">
          <DropSearch
            value={selectedVendors}
            onchange={handleVendorChange}
            placeholder="Select Vendor"
            options={[...vendorData]}
            error={""}
          />
          <div className="flex items-center gap-2">
            <div>
              <TextInput
                label={`Lapu Number`}
                value={lapuNumber}
                name={`lapuNumber`}
                onChange={setLapuNumber}
                type="number"
              />
            </div>
            <div>
              <TextInput
                label={`Lapu Name`}
                value={lapuName}
                name={`lapuname`}
                onChange={setLapuName}
              />
            </div>
          </div>
          <div>
            <DropSearch
              value={selectedOp}
              onchange={handleOpraterChange}
              placeholder="Select Opretors"
              options={[...op]}
              error={""}
            />
          </div>
          <div>
            <ButtonLabel
              type="button"
              label="Add Lapu"
              onClick={addLapuNumberField}
            />
          </div>
        </div>
      </Popup>
      {/* Lappu amount popup */}
      <Popup
        isOpen={openInputLapu}
        onClose={() => setOpenInputLapu(false)}
        title="Add Amount in Lapu Numbers"
      >
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid black", padding: "8px" }}>
                Lappu ID
              </th>
              <th style={{ border: "1px solid black", padding: "8px" }}>
                Lappu Name
              </th>
              <th style={{ border: "1px solid black", padding: "8px" }}>
                Operator
              </th>
              <th style={{ border: "1px solid black", padding: "8px" }}>
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {userLapus.map((lapu, index) => (
              <tr key={lapu.lappuId}>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {lapu.lappuId}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {lapu.lappuName}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {lapu.operator}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={lapu.amount || ""}
                    onChange={(event) => handleLappuChange(index, event)}
                    style={{ width: "100%", border: "1px solid black" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button
          size="large"
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
          }}
          onClick={handleLappuSubmit}
          type="submit"
          variant="outlined"
        >
          Submit
        </Button>
      </Popup>

      {/* show gst info  */}
      <Popup
        isOpen={openGstInfo}
        onClose={() => setOpenGstInfo(false)}
        title="Gst Information"
      >
        <div className="grid gap-3">
          <div className="flex flex-col gap-2">
            <p>
              <b>GST NO:</b> {selectedGstData?.gstin}
            </p>
            <p>
              <b>Legal Name:</b> {selectedGstData?.legal_name}
            </p>
            <p>
              <b>Trade Name:</b> {selectedGstData?.trade_name}
            </p>
            <p>
              <b>Taxpayer Type:</b> {selectedGstData?.taxpayer_type}
            </p>
            <p>
              <b>Reg Date:</b> {selectedGstData?.reg_date}
            </p>
            <p>
              <b>State Code:</b> {selectedGstData?.state_code}
            </p>
            <p>
              <b>Nature:</b> {selectedGstData?.nature}
            </p>
            <p>
              <b>Jurisdiction:</b> {selectedGstData?.jurisdiction}
            </p>
            <p>
              <b>Business Type:</b> {selectedGstData?.business_type}
            </p>
            <p>
              <b>State Code:</b> {selectedGstData?.state_code}
            </p>
          </div>
        </div>
      </Popup>

      {/* Add Bank Account */}
      {/* add lappu popup */}
      <Popup
        isOpen={openBankAccount}
        onClose={() => setOpenBankAccount(false)}
        title="Add Bank Account"
      >
        <div className="grid gap-3">
          <DropSearch
            value={selectedVendors}
            onchange={handleVendorChange}
            placeholder="Select Vendor"
            options={[...vendorData]}
            error={""}
          />
          <div className="grid gap-3">
            <DropSearch
              value={selectedAddBank}
              onchange={handleSelectedAddBank}
              placeholder="Select Bank"
              options={[...bankData]}
              error={""}
            />
          </div>
          <div className="flex items-center gap-2">
            <div>
              <TextInput
                label={`Account Number`}
                value={account}
                name={`accountNumber`}
                onChange={setAccount}
                type="number"
              />
            </div>
            <div>
              <TextInput
                label={`IFSC Code`}
                value={ifsc}
                name={`ifsc code`}
                onChange={setIfsc}
              />
            </div>
          </div>
          <div>
            <TextInput
              label={`Beneficary Name`}
              value={beneficary}
              name={`lapuname`}
              disabledProp={true}
              onChange={setBeneficary}
            />
          </div>
          <div className="flex items-center gap-12">
            <ButtonLabel
              type="button"
              label="Verify Account"
              onClick={verifyAccount}
            />
            <ButtonLabel
              type="button"
              label="Add Account"
              onClick={addBankAccount}
            />
          </div>
        </div>
      </Popup>
    </DefaultLayout>
  );
};

export default AddVendor;
