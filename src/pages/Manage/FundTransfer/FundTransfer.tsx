import React, { useState, useEffect } from "react";
import DefaultLayout from "../../../layout/DefaultLayout";
import BasicTable from "../../../components/BasicTable/BasicTable";
import TextInput from "../../../components/Input/TextInput";
import { ButtonLabel } from "../../../components/Button/Button";
import { getFundsOn } from "../../../Services/categoryServices";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../../common/Loader";
import { BsEye, BsPlus } from "react-icons/bs";
import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import { DropSearch } from "../../../components/DropDown/DropSearch";
import {
  getCreditsData,
  getUser,
  getUsers,
} from "../../../Services/Axios/UserService";
import { addTranx, getAllTranx } from "../../../Services/transaction";
import moment from "moment";
import CashModal from "../../../components/modal";
import { IoAdd } from "react-icons/io5";

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

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ManageFundTransfer = () => {
  const columns = [
    {
      header: "Date",
      accessorKey: "createdDate",
    },
    {
      header: "TranxId",
      accessorKey: "tranxId",
    },
    {
      header: "User Id",
      accessorKey: "userId",
      cell: (row: any) => <span>{row.row.original.userId}</span>,
    },
    {
      header: "Amount",
      accessorKey: "amount",
    },
    {
      header: "Comm/Sur",
      accessorKey: "commission",
    },
    {
      header: "OpBal",
      accessorKey: "openingBalance",
    },
    {
      header: "ClBal",
      accessorKey: "closingBalance",
    },
    {
      header: "OperatorId",
      accessorKey: "operatorId",
    },
    {
      header: "Status",
      accessorKey: "status",
    },
    {
      header: "FundBal",
      accessorKey: "fund_balance",
    },
    {
      header: "FundType",
      accessorKey: "name",
    },
    {
      header: "Remarks",
      cell: (row: any) => (
        <div className="flex gap-2">
          <div className="cursor-pointer" title="Delete Operator">
            <BsEye
              fontSize={18}
              color="blue"
              onClick={() => setShowModal(true)}
            />
          </div>
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-lg">
                <p>
                  <b>{row.row.original.remarks}</b>
                </p>
                <div className="flex justify-end mt-4">
                  <button
                    className="px-4 py-2 mr-2 bg-red-500 text-white rounded"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ),
    },
  ];
  const creditColumns = [
    {
      header: "Date",
      accessorKey: "createdDate",
    },
    {
      header: "User Id",
      accessorKey: "userId",
      cell: (row: any) => <span>{row.row.original.userId}</span>,
    },
    {
      header: "Name",
      accessorKey: "fullName",
    },
    {
      header: "Mobile",
      accessorKey: "phoneNumber",
    },
    {
      header: "Credit",
      accessorKey: "totalCredit",
    },
    {
      header: "Received",
      accessorKey: "totalRecieved",
    },
    {
      header: "Remaining",
      accessorKey: "total",
    },
    {
      header: "Received",
      cell: (row: any) => (
        <Button
          size="small"
          onClick={() => handleRecivedCredit(row.row.original)}
          variant="outlined"
          startIcon={<IoAdd />}
        >
          Recieved
        </Button>
      ),
    },
  ];

  const [selectedFund, setSelectedFund] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedPaymentType, setSelectedPaymentType] = useState<string | null>(
    null
  );
  const [showModal, setShowModal] = React.useState(false);
  const [amount, setAmount] = useState("");
  const [creditAmount, setCreditAmount] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [remarks, setRemarks] = useState("");
  const [commission, setCommission] = useState("");
  const [_password, setPassword] = useState("");
  const [OperatorId, setOperatorId] = useState("");
  const [bankFund, setBankFund] = useState("");
  const [fundsData, setFundsData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [creditData, setCreditData] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [value, setValue] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  function handleRecivedCredit(row: any) {
    if (row) {
      if (row.total) {
        setAmount(row.total);
        setSelectedUser(row.userId);
      }
    }
  }
  async function handleFund(value: string | null) {
    if (!amount) {
      toast.error("First enter amount");
      return;
    } else {
      setSelectedFund(value);
      if (isCash(value)) {
        setIsModalOpen(true);
      } else {
        setIsModalOpen(false);
      }
    }
  }

  async function handleUser(value: string | null) {
    setSelectedUser(value);
  }
  async function handleCreditUser(value: string | null) {
    setSelectedUser(value);
  }
  async function handlePaymentType(value: string | null) {
    setSelectedPaymentType(value);
  }
  async function reset() {
    setSelectedPaymentType("");
    setSelectedFund("");
    setAmount("");
    setCommission("");
    setSelectedUser("");
    setOperatorId("");
    setRemarks("");
    setCashAmounts({
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
  }
  function isCash(value: any) {
    const fund = fundsData.find((fund: any) => fund.value === value);
    return fund && fund?.showvalue === "Cash";
  }
  const handleSubmit = async (type: any, tranxType: string) => {
    const emptyFields = [];
    setLoading(true);
    if (!selectedFund) emptyFields.push("Fund");
    if (!selectedUser) emptyFields.push("User");
    // if (!selectedPaymentType) emptyFields.push("Payment Type");
    if (!amount) emptyFields.push("Amount");
    if (!_password) emptyFields.push("Password");
    if (selectedFund == "436") {
      const randomNum = Math.floor(Math.random() * 100) + 1;
      setOperatorId(randomNum.toString());
    } else {
      if (!OperatorId) emptyFields.push("OperatorId");
    }

    if (emptyFields.length > 0) {
      toast.error(
        `Please fill in the following fields: ${emptyFields.join(", ")}`
      );
      setLoading(false);
      return;
    }
    const wallet = userData.find((user) => user?.userUniqueId === selectedUser);
    const payload = {
      userId: selectedUser,
      fundType: selectedFund,
      amount: amount,
      commission: Number(totalAmount) - Number(amount) || 0,
      remarks: remarks,
      password: _password,
      operatorId: OperatorId,
      paymentType: selectedPaymentType,
      openingBalance: Number(wallet?.wallet) || 0,
      closingBalance:
        type === "Received" || type === "CreditReceived"
          ? Number(wallet?.wallet || 0) - totalAmount
          : Number(wallet?.wallet || 0) + totalAmount,
      totalAmount: totalAmount,
      tranxType: tranxType,
      status: type,
      cashAmounts: cashAmounts,
      isTypeCash: isCash(selectedFund),
    };
    try {
      await addTranx(payload);
      reset();
      refetch();
      setLoading(false);
      toast.success("Data Saved Successfully.");
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    calculateTotalAmount();
  }, [amount, commission, selectedPaymentType]);

  const calculateTotalAmount = () => {
    let newTotalAmount = 0;
    if (selectedPaymentType === "commission") {
      newTotalAmount =
        Number(amount) + (Number(amount) * Number(commission)) / 100 || 0;
    } else {
      newTotalAmount =
        Number(amount) - (Number(amount) * Number(commission)) / 100 || 0;
    }
    setTotalAmount(newTotalAmount);
  };

  const handleCashModalSubmit = (cashAmounts: CashAmounts) => {
    setCashAmounts(cashAmounts);
  };

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["categorys"],
    queryFn: async () => {
      try {
        const transactionData = await getAllTranx();
        const response = await getFundsOn();
        const creditData = await getCreditsData();
        setCreditData(creditData.credits);
        const users = await getUsers();
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
                ")",
              value: user?.userUniqueId,
              wallet: user?.wallet,
              userUniqueId: user?.userUniqueId,
            });
          });
        }
        setUserData(_dataUser);
        const fundsData = response.fund;
        let _data: any = [];
        if (fundsData.length > 0) {
          fundsData.forEach((user: any) => {
            _data.push({
              showvalue: user?.name,
              value: user?.fundCode,
            });
          });
          setFundsData(_data);
          let _data1: any = [];
          fundsData.forEach((user: any) => {
            if (
              user.fundType == "BANK" ||
              user.fundType == "CASH" ||
              user.fundType == "WALLET"
            ) {
              _data1.push({
                showvalue: user?.name,
                value: user?.fundCode,
              });
            }
          });
          setBankFund(_data1);
        }
        if (transactionData.transaction.length > 0) {
          transactionData.transaction = transactionData.transaction.map(
            (item: any) => ({
              ...item,
              createdDate: moment(item.createdDate).format(
                "DD/MM/YYYY hh:mm:ss a"
              ),
            })
          );
        }
        return transactionData.transaction; // Return user data from the query function
      } catch (error) {
        toast.error("Something went wrong!");
      }
    },
    refetchOnWindowFocus: true,
  });
  if (isLoading) return <Loader />;
  if (error) {
    return toast.error("Something went wrong!");
  }
  return (
    <DefaultLayout isList={true}>
      <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 py-2">
        <div className="w-full">
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <div className="flex justify-between">
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  <Tab label="Fund Transfer" {...a11yProps(0)} />
                  <Tab label="Fund Debit" {...a11yProps(1)} />
                  <Tab label="Credit Recieve" {...a11yProps(2)} />
                </Tabs>
                <div>
                  Virtual Balance:- <b>{data[0]?.virtualAmount}</b>
                </div>
              </div>
            </Box>
            {/* Fund Transfer */}
            <CustomTabPanel value={value} index={0}>
              <div className="w-full flex gap-2">
                <CashModal
                  isOpen={isModalOpen}
                  onRequestClose={() => setIsModalOpen(false)}
                  onSubmit={handleCashModalSubmit}
                  type="Recived"
                  amount={Number(amount)}
                  cashAmounts={cashAmounts}
                />
                <div className="w-[650px]">
                  <DropSearch
                    value={selectedUser}
                    onchange={handleUser}
                    placeholder="Select User"
                    options={[...userData]}
                    error={""}
                  />
                </div>

                <div className="w-[350px]">
                  <DropSearch
                    value={selectedPaymentType}
                    onchange={handlePaymentType}
                    placeholder="Payment Type"
                    options={[
                      { showvalue: "Commission", value: "commission" },
                      { showvalue: "SurCharge", value: "surcharge" },
                    ]}
                    error={""}
                  />
                </div>
                <TextInput
                  value={amount}
                  label={"Amount"}
                  style={{ width: "200px" }}
                  name={"Amount"}
                  type={"number"}
                  onChange={setAmount}
                  isModel={false}
                />
                <TextInput
                  value={commission}
                  label={"Comm/Charge"}
                  name={"Comm"}
                  type={"number"}
                  style={{ width: "100px" }}
                  onChange={setCommission}
                  isModel={false}
                />
              </div>
              <div className="w-full flex gap-2 mt-4 mb-4">
                <TextInput
                  label={"Total Amount"}
                  name={"total"}
                  type={"number"}
                  value={totalAmount}
                  isModel={false}
                />
                <div className="w-[250px]">
                  <DropSearch
                    value={selectedFund}
                    onchange={handleFund}
                    placeholder="Select Fund"
                    options={[...fundsData]}
                    error={""}
                  />
                </div>

                <TextInput
                  value={_password}
                  label={"Password"}
                  name={"Password"}
                  type={"password"}
                  onChange={setPassword}
                  isModel={false}
                />
                <TextInput
                  value={OperatorId}
                  label={"OperatorId"}
                  name={"OperatorId"}
                  onChange={setOperatorId}
                  isModel={false}
                />
                <TextInput
                  value={remarks}
                  label={"Remarks"}
                  style={{ width: "180px" }}
                  name={"Remarks"}
                  onChange={setRemarks}
                  isModel={false}
                />
                <ButtonLabel
                  onClick={() => handleSubmit("Transfer", "credit")}
                  type="button"
                  loader={Loading}
                  disabled={Loading}
                  label="Transfer"
                  Icon={<BsPlus fontSize={18} />}
                />
              </div>

              <div className="w-full">
                {data && (
                  <BasicTable
                    data={data}
                    columns={columns}
                    actions={""}
                    filter={["status"]}
                  />
                )}
              </div>
            </CustomTabPanel>
            {/* Fund Debit */}
            <CustomTabPanel value={value} index={1}>
              <div className="w-full flex gap-2">
                <CashModal
                  isOpen={isModalOpen}
                  onRequestClose={() => setIsModalOpen(false)}
                  onSubmit={handleCashModalSubmit}
                  type="Received"
                  amount={Number(amount)}
                  cashAmounts={cashAmounts}
                />
                <div className="w-[650px]">
                  <DropSearch
                    value={selectedUser}
                    onchange={handleUser}
                    placeholder="Select User"
                    options={[...userData]}
                    error={""}
                  />
                </div>

                <div className="w-[350px]">
                  <DropSearch
                    value={selectedPaymentType}
                    onchange={handlePaymentType}
                    placeholder="Payment Type"
                    options={[
                      { showvalue: "Commission", value: "commission" },
                      { showvalue: "SurCharge", value: "surcharge" },
                    ]}
                    error={""}
                  />
                </div>
                <TextInput
                  value={amount}
                  label={"Amount"}
                  style={{ width: "200px" }}
                  name={"Amount"}
                  type={"number"}
                  onChange={setAmount}
                  isModel={false}
                />
                <TextInput
                  value={commission}
                  label={"Comm/Charge"}
                  name={"Comm"}
                  type={"number"}
                  style={{ width: "100px" }}
                  onChange={setCommission}
                  isModel={false}
                />
              </div>
              <div className="w-full flex gap-2 mt-4 mb-4">
                <TextInput
                  label={"Total Amount"}
                  name={"total"}
                  type={"number"}
                  value={totalAmount}
                  isModel={false}
                />
                <div className="w-[250px]">
                  <DropSearch
                    value={selectedFund}
                    onchange={handleFund}
                    placeholder="Select Fund"
                    options={[...fundsData]}
                    error={""}
                  />
                </div>

                <TextInput
                  value={_password}
                  label={"Password"}
                  name={"Password"}
                  type={"password"}
                  onChange={setPassword}
                  isModel={false}
                />
                <TextInput
                  value={OperatorId}
                  label={"OperatorId"}
                  name={"OperatorId"}
                  onChange={setOperatorId}
                  isModel={false}
                />
                <TextInput
                  value={remarks}
                  label={"Remarks"}
                  style={{ width: "180px" }}
                  name={"Remarks"}
                  onChange={setRemarks}
                  isModel={false}
                />
                <ButtonLabel
                  onClick={() => handleSubmit("Received", "Debit")}
                  type="button"
                  label="Received"
                  loader={Loading}
                  disabled={Loading}
                  Icon={<BsPlus fontSize={18} />}
                />
              </div>

              <div className="w-full">
                {data && (
                  <BasicTable
                    data={data}
                    columns={columns}
                    actions={""}
                    filter={["status"]}
                  />
                )}
              </div>
            </CustomTabPanel>

            <CustomTabPanel value={value} index={2}>
              {/* Credit Recieve */}
              <div className="w-full flex gap-2">
                <CashModal
                  isOpen={isModalOpen}
                  onRequestClose={() => setIsModalOpen(false)}
                  onSubmit={handleCashModalSubmit}
                  type="Received"
                  amount={Number(amount)}
                  cashAmounts={cashAmounts}
                />
                <div className="w-[650px]">
                  <DropSearch
                    value={selectedUser}
                    onchange={handleCreditUser}
                    placeholder="Select User"
                    options={[...userData]}
                    error={""}
                  />
                </div>
                <TextInput
                  value={amount}
                  label={"Amount"}
                  style={{ width: "200px" }}
                  name={"Amount"}
                  type={"number"}
                  onChange={setAmount}
                  isModel={false}
                />
                <div className="w-[250px]">
                  <DropSearch
                    value={selectedFund}
                    onchange={handleFund}
                    placeholder="Select Fund"
                    options={[...bankFund]}
                    error={""}
                  />
                </div>
                <TextInput
                  value={_password}
                  label={"Password"}
                  name={"Password"}
                  type={"password"}
                  onChange={setPassword}
                  isModel={false}
                />
                <TextInput
                  value={OperatorId}
                  label={"OperatorId"}
                  name={"OperatorId"}
                  onChange={setOperatorId}
                  isModel={false}
                />
                <TextInput
                  value={remarks}
                  label={"Remarks"}
                  style={{ width: "180px" }}
                  name={"Remarks"}
                  onChange={setRemarks}
                  isModel={false}
                />
                <ButtonLabel
                  onClick={() => handleSubmit("CreditReceived", "Debit")}
                  type="button"
                  label="Received"
                  loader={Loading}
                  disabled={Loading}
                  Icon={<BsPlus fontSize={18} />}
                />
              </div>

              <div className="w-full">
                {creditData && (
                  <BasicTable
                    data={creditData}
                    columns={creditColumns}
                    actions={""}
                    filter={[""]}
                  />
                )}
              </div>
            </CustomTabPanel>
          </Box>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ManageFundTransfer;
