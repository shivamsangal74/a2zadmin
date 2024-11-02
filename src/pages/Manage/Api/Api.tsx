import DefaultLayout from "../../../layout/DefaultLayout";
import BasicTable from "../../../components/BasicTable/BasicTable";
import Popup from "../../../components/Model/Model";
import { Select, Option } from "@material-tailwind/react";
import TextInput from "../../../components/Input/TextInput";
import { ButtonLabel } from "../../../components/Button/Button";
import {
  addApi,
  getAllApi,
  getApi,
  deleteApi,
  updateApi,
  getOperatorApi,
  saveOperatorApi,
  getCircleApi,
  saveCircleApi,
} from "../../../Services/ApiService";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../../common/Loader";
import { useRef, useState } from "react";
import Switch from "@mui/material/Switch";
import { BsArrowBarDown, BsPencil, BsTrash } from "react-icons/bs";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
} from "@mui/material";

import { styled } from "@mui/system";
import { IoArrowUpCircleSharp } from "react-icons/io5";

const commissionTypes = ["commission", "surcharge"];
const paymentTypes = ["percentage", "rupee"];

interface RowData {
  operator: string;
  apiId: string;
  apiName: string;
  name: string;
  operatorCode: string;
  commission: string;
  commType: string;
  paymentType: string;
}

interface CircleData {
  circle: string;
  apiId: string;
  apiName: string;
  name: string;
  circleCode: string;
}

interface ApiData {
  apiId: string;
  apiName: string;
  apiType: string;
  apiRechargeUrl: string;
  apiToken: string;
  [key: string]: any;
}

const TableContainerStyled = styled(TableContainer)({
  margin: "20px auto",
  maxWidth: 800,
});

const TableHeaderCellStyled = styled(TableCell)({
  fontWeight: "bold",
  backgroundColor: "#f0f0f0",
});

const TableRowStyled = styled(TableRow)(() => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#f9f9f9",
  },
}));

const TextFieldStyled = styled(TextField)({
  width: "100%",
});

const Api = () => {
  const operatorapi = useRef();
  const circleapi = useRef();
  const columns = [
    {
      header: "Name",
      accessorKey: "apiName",
    },
    {
      header: "Api Type",
      accessorKey: "apiType",
    },
    {
      header: "Api Method",
      accessorKey: "apiMethod",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row: any) => (
        <Switch
          checked={row.row.original.status == "1"}
          onChange={async (e) => {
            const newValue = e.target.checked ? "1" : "0";
            try {
              await updateApi({ status: newValue }, row.row.original.apiId);
              toast.success("Api updated successfully.");
              refetch();
            } catch (error) {
              toast.error("Something went wrong.");
            }
          }}
          inputProps={{ "aria-label": "status switch" }}
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: row.row.original.status == "1" ? "green" : "red",
            },
            "& .MuiSwitch-thumb": {
              backgroundColor: row.row.original.status == "1" ? "green" : "red",
            },
            "& .MuiSwitch-track": {
              backgroundColor: row.row.original.status == "1" ? "green" : "red",
            },
          }}
        />
      ),
    },
    {
      header: "Operator Code",
      cell: (row: any) => (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="flex gap-2">
            <div className="cursor-pointer" title="Add Operator Code Api">
              <BsArrowBarDown
                fontSize={18}
                color="green"
                onClick={() => {
                  handleOperatorApi(row.row.original.apiId);
                  setSelectedApiName(row.row.original.apiName);
                }}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Circle Code",
      cell: (row: any) => (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="flex gap-2">
            <div className="cursor-pointer" title="Add Circle Code Api">
              <BsArrowBarDown
                fontSize={18}
                color="green"
                onClick={() => {
                  handleCircleApi(row.row.original.apiId);
                  setSelectedApiName(row.row.original.apiName);
                }}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Action",
      cell: (row: any) => (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="flex gap-2 ">
            <div className="cursor-pointer">
              <BsPencil
                fontSize={18}
                color="blue"
                onClick={() => handleOpenEdit(row.row.original.apiId)}
              />
            </div>
            <div className="cursor-pointer" title="Delete Api">
              <BsTrash
                fontSize={18}
                color="red"
                onClick={() => openDeleteModal(row.row.original.apiId)}
              />
            </div>

            {showModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
                <div className="bg-white p-6 rounded shadow-lg">
                  <p>
                    <b>Are you sure you want to delete this Api?</b>
                  </p>
                  <div className="flex justify-end mt-4">
                    <button
                      className="px-4 py-2 mr-2 bg-red-500 text-white rounded"
                      onClick={() => {
                        setShowModal(false);
                        handleDeleteApi(deletId);
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
        </div>
      ),
    },
  ];

  const Apicolumns = [
    {
      header: "Operator",
      accessorKey: "operatorImage",
    },
    {
      header: "Operator Code",
      accessorKey: "operatorCode",
    },
    {
      header: "commission",
      accessorKey: "commission",
    },
    {
      header: "commission Type",
      accessorKey: "commType",
    },
    {
      header: "Payment Type",
      accessorKey: "paymentType",
    },
  ];

  const Circlecolumns = [
    {
      header: "Circle ",
      accessorKey: "circle",
    },
    {
      header: "Circle Code",
      accessorKey: "operatorCode",
    },
  ];

  const [_data, setData] = useState<RowData[]>([]);
  const [_cdata, setCdata] = useState<CircleData[]>([]);
  const [deletId, setDeleteId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [apiName, setApiName] = useState("");
  const [apiId, setApiId] = useState("");
  const [apiType, setApiType] = useState("Recharge");
  const [apiRechargeUrl, setApiRechargeUrl] = useState("");
  const [apiBaseUrl, setApiBaseUrl] = useState("");
  const [apitoken, setApitoken] = useState("");
  const [apiGasUrl, setApiGasUrl] = useState("");
  const [apiDTHUrl, setApiDTHUrl] = useState("");
  const [apiBody, setApiBody] = useState("");
  const [apiHeaders, setApiHeaders] = useState("");
  const [apiDataCardUrl, setApiDataCardUrl] = useState("");
  const [apiFastCardUrl, setApiFastCardUrl] = useState("");
  const [apiInsuranceUrl, setApiInsuranceUrl] = useState("");
  const [apiStatus, setApiStatus] = useState("");
  const [apiMethod, setApiMehod] = useState("");
  const [apiBalanceCheck, setApiBalanceCheck] = useState("");
  const [apiComplaint, setApiComplaint] = useState("");
  const [apiTimeout, setApiTimout] = useState("");
  const [selectedApiName, setSelectedApiName] = useState("");
  const [Apis, setApis] = useState(null);
  const [Loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [params, setParams] = useState([""]);
  const [planUrl, setPlanUrl] = useState("");
  const [rofferUrl, setRofferUrl] = useState("");
  const [operatorUrl, setOperatorUrl] = useState("");
  const [responseStatus, setResponseStatus] = useState("");
  const [responseTxnid, setResponseTxnid] = useState("");
  const [responseOpCode, setResponseOpCode] = useState("");
  const [responseCheckStatus, setResponseCheckStatus] = useState("");
  const [responseCircleCode, setResponseCircleCode] = useState("");
  const [responseKey, setResponseKey] = useState("");
  const [responseRDATA, setResponseRDATA] = useState("");
  const [responseCircle, setResponseCircle] = useState("");
  const [responseApiBalance, setResponseApiBalance] = useState("");
  const [responseLappuNo, setResponseLappuNo] = useState("");
  const [responseLappuBal, setResponseLappuBal] = useState("");
  const [isShow, setIsShow] = useState("false");
  const [resposeType, setResponseType] = useState("");
  const [responseBalApi, setResponseBalanceApi] = useState("");
  const [responseSeprate, setResponseSeprate] = useState("");
  const [responseSuccessValue, setResponseSuccessValue] = useState("");
  const [responseFailValue, setResponseFailValue] = useState("");
  const [responsePendingValue, setResponsePendingValue] = useState("");
  const [responseMsg, setResponseMsg] = useState("");
  const [isOpreatorShow, setOperatorShow] = useState("false");
  const [isCircleShow, setCircleShow] = useState("false");
  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);

  async function handleAddApi() {
    const emptyFields = [];
    setLoading(true);
    if (!apiType) emptyFields.push("Api Type");
    if (!apiName) emptyFields.push("Api Name");
    if (emptyFields.length > 0) {
      toast.error(
        `Please fill in the following fields: ${emptyFields.join(", ")}`
      );
      setLoading(false);
      return;
    }

    try {
      const _data: ApiData = {
        apiId: apiId,
        apiName: apiName,
        apiType: apiType,
        apiBody: apiBody,
        apiHeaders: apiHeaders,
        apiMethod: apiMethod,
        apiBaseUrl: apiBaseUrl,
        apiRechargeUrl: apiRechargeUrl,
        apiToken: apitoken,
        apiCompaint: apiComplaint,
        apiTimeout: apiTimeout,
        apiGasUrl: apiGasUrl,
        apiDTHUrl: apiDTHUrl,
        apiDataCardUrl: apiDataCardUrl,
        apiFastCardUrl: apiFastCardUrl,
        apiInsurenceUrl: apiInsuranceUrl,
        apiStatus: apiStatus,
        apiBalanceCheck: apiBalanceCheck,
        responseCircle: responseCircle,
        responseCircleCode: responseCircleCode,
        responseKey: responseKey,
        responseOpCode: responseOpCode,
        responseRDATA: responseRDATA,
        responseTxnid: responseTxnid,
        responseStatus: responseStatus,
        rofferUrl: rofferUrl,
        planUrl: planUrl,
        operatorUrl: operatorUrl,
        resposeType: resposeType,
        responseApiBalance: responseApiBalance,
        responseLappuBal: responseLappuBal,
        responseLappuNo: responseLappuNo,
        responseSeprate: responseSeprate,
        responseSuccessValue: responseSuccessValue,
        responsePendingValue: responsePendingValue,
        responseFailValue: responseFailValue,
        responseMsg: responseMsg,
        // apiMethod: apiMethod,
      };
      params.forEach((param, index) => {
        if (param) {
          _data[`param${index + 1}`] = param;
        }
      });
      await addApi(_data);
      toast.success("Api added successfully.");
      refetch();
      closePopup();
      reset();
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function openDeleteModal(id: string) {
    setDeleteId(id);
    setShowModal(true);
  }
  const handleResponseType = (event: any) => {
    setResponseType(event);
  };

  const handleShow = (event: any) => {
    setIsShow(event);
  };
  async function handleDeleteApi(id: string) {
    try {
      setLoading(true);
      await deleteApi(id);
      refetch();
      toast.success("Api Successfully deleted.");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong!");
    }
  }

  const handleClose = () => {
    closePopup();
    reset();
  };

  const handleApiMethod = (event: any) => {
    setApiMehod(event);
  };

  const handleApiTypeChange = (event: any) => {
    setApiType(event);
  };

  const handleOperatorApi = async (event: any) => {
    setData([]);
    setOperatorShow("true");
    setCircleShow("false");
    const data = await getOperatorApi(event);
    setData(data.api.map((item: any) => ({ ...item, apiId: event })));
    operatorapi.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
      alignToTop: true,
    });
  };

  const handleCircleApi = async (event: any) => {
    setCdata([]);
    setCircleShow("true");
    setOperatorShow("false");
    const data = await getCircleApi(event);
    setCdata(data.api.map((item: any) => ({ ...item, apiId: event })));
    circleapi.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
      alignToTop: true,
    });
  };

  const handleChange = (
    operator: any,
    field: keyof RowData,
    value: string,
    apiId: string
  ) => {
    setData((prevData) =>
      prevData.map((row) =>
        row.operator === operator
          ? { ...row, [field]: value, apiId: apiId }
          : row
      )
    );
  };

  const handleCircleChange = (
    circle: any,
    field: keyof CircleData,
    value: string,
    apiId: string
  ) => {
    setCdata((prevData) =>
      prevData.map((row) =>
        row.circle === circle ? { ...row, [field]: value, apiId: apiId } : row
      )
    );
  };
  const handleSaveApiOperator = async () => {
    try {
      setLoading(true);
      const operatorsWithCode = _data.filter(
        (operator: any) => operator.operatorCode !== null
      );
      await saveOperatorApi(operatorsWithCode);
      toast.success("Opertor api data is saved successful");
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      toast.error("Something went wrong.");
    }
    console.log(_data);
  };

  const handleSaveApiCircle = async () => {
    try {
      setLoading(true);
      const circleWithCode = _cdata.filter(
        (circle: any) => circle.circleCode !== null
      );
      await saveCircleApi(circleWithCode);
      toast.success("Opertor api data is saved successful");
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      toast.error("Something went wrong.");
    }
    console.log(_data);
  };
  const handleOpenEdit = async (id: string) => {
    try {
      setApiId(id);
      let _data = await getApi(id);
      setIsEdit(true);
      if (_data.api.length > 0) {
        setApiName(_data.api[0].apiName);
        setResponseType(_data.api[0].resposeType);
        setApiTimout(_data.api[0].apiTimeout);
        setApiMehod(_data.api[0].apiMethod);
        setApiBody(_data.api[0].apiBody);
        setApiHeaders(_data.api[0].apiHeaders);
        setResponseApiBalance(_data.api[0].responseApiBalance);
        setResponseLappuBal(_data.api[0].responseLappuBal);
        setResponseLappuNo(_data.api[0].responseLappuNo);
        setApiBaseUrl(_data.api[0].apiBaseUrl);
        setApiRechargeUrl(_data.api[0].apiRechargeUrl);
        setApiGasUrl(_data.api[0].apiGasUrl);
        setApiDTHUrl(_data.api[0].apiDTHUrl);
        setApiFastCardUrl(_data.api[0].apiFastCardUrl);
        setApiInsuranceUrl(_data.api[0].apiInsurenceUrl);
        setApiType(_data.api[0].apiType);
        setApitoken(_data.api[0].apiToken);
        setResponseCircle(_data.api[0].responseCircle);
        setResponseCircleCode(_data.api[0].responseCircleCode);
        setResponseKey(_data.api[0].responseKey);
        setResponseOpCode(_data.api[0].responseOpCode);
        setResponseRDATA(_data.api[0].responseRDATA);
        setResponseStatus(_data.api[0].responseStatus);
        setResponseTxnid(_data.api[0].responseTxnid);
        setPlanUrl(_data.api[0].planUrl);
        setRofferUrl(_data.api[0].rofferUrl);
        setOperatorUrl(_data.api[0].operatorUrl);
        setResponseSeprate(_data.api[0].responseSeprate);
        setResponseMsg(_data.api[0].responseMsg);
        setResponseSuccessValue(_data.api[0].responseSuccessValue);
        setResponseFailValue(_data.api[0].responseFailValue);
        setResponsePendingValue(_data.api[0].responsePendingValue);

        const params = Object.keys(_data.api[0])
          .filter((key) => key.startsWith("param") && _data.api[0][key])
          .map((key) => _data.api[0][key]);
        setParams(params.length > 0 ? params : [""]);
      }
      openPopup();
    } catch (error) {
      toast.error("something went wrong!");
    }
  };

  const handleParamChange = (index: number, value: string) => {
    const newParams = [...params];
    newParams[index] = value;
    setParams(newParams);
  };

  const addParamField = () => {
    if (params.length < 10) {
      setParams([...params, ""]);
    } else {
      toast.warning("Maximum 10 parameters allowed");
    }
  };

  const removeParamField = (index: number) => {
    if (params.length > 1) {
      const newParams = params.filter((_, i) => i !== index);
      setParams(newParams);
    } else {
      toast.warning("At least one parameter is required");
    }
  };
  async function reset() {
    setIsEdit(false);
    setApiId("");
    setResponseType("");
    setApiHeaders("");
    setApiMehod("");
    setApiBody("");
    setApiName("");
    setApitoken("");
    setApiBaseUrl("");
    setApiRechargeUrl("");
    setResponseCircle("");
    setResponseCircleCode("");
    setResponseKey("");
    setResponseOpCode("");
    setResponseRDATA("");
    setResponseStatus("");
    setResponseApiBalance("");
    setResponseLappuBal("");
    setResponseLappuNo("");
    setResponseTxnid("");
    setPlanUrl("");
    setRofferUrl("");
    setOperatorUrl("");
    setResponseSeprate("");
    setResponseMsg("");
  }

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["Apis"],
    queryFn: async () => {
      try {
        const response = await getAllApi();
        const apiData = response.apiData;
        if (apiData.length > 0) {
          setApis(apiData);
        }
        return apiData;
      } catch (error: any) {
        setLoading(false);
        toast.error(error?.response?.data?.message);
      }
    },
    refetchOnWindowFocus: true,
  });
  if (isLoading)
    return (
      <DefaultLayout isList>
        <Loader />
      </DefaultLayout>
    );
  if (error) {
    return toast.error("Something went wrong!");
  }

  return (
    <DefaultLayout isList={true}>
      {Apis && <BasicTable data={Apis} columns={columns} actions={""} />}
      {_data && isOpreatorShow == "true" && (
        <>
          <TableContainerStyled ref={operatorapi}>
            Add Operator Code and Commission for {selectedApiName}
            <Table className="mt-4">
              <TableHead>
                <TableRow>
                  {Apicolumns.map((column) => (
                    <TableHeaderCellStyled key={column.accessorKey}>
                      {column.header}
                    </TableHeaderCellStyled>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {_data.map((row) => (
                  <TableRowStyled key={row.operator}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>
                      <TextFieldStyled
                        value={row.operatorCode}
                        onChange={(e: any) =>
                          handleChange(
                            row.operator,
                            "operatorCode",
                            e.target.value,
                            row.apiId
                          )
                        }
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <TextFieldStyled
                        value={row.commission}
                        type="number"
                        onChange={(e: any) =>
                          handleChange(
                            row.operator,
                            "commission",
                            e.target.value,
                            row.apiId
                          )
                        }
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={row.commType}
                        onChange={(value: any) => {
                          handleChange(
                            row.operator,
                            "commType",
                            value,
                            row.apiId
                          );
                        }}
                        size="md"
                        variant="outlined"
                      >
                        {commissionTypes.map((type) => (
                          <Option key={type} value={type}>
                            {type}
                          </Option>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={row.paymentType}
                        onChange={(value: any) =>
                          handleChange(
                            row.operator,
                            "paymentType",
                            value,
                            row.apiId
                          )
                        }
                        size="md"
                        variant="outlined"
                      >
                        {paymentTypes.map((type) => (
                          <Option key={type} value={type}>
                            {type}
                          </Option>
                        ))}
                      </Select>
                    </TableCell>
                  </TableRowStyled>
                ))}
              </TableBody>
            </Table>
          </TableContainerStyled>
          <ButtonLabel
            style={{ marginLeft: "40%" }}
            onClick={handleSaveApiOperator}
            disabled={Loading}
            loader={Loading}
            label="Submit"
          />
        </>
      )}
      {/* Add circle Code */}
      {_data && isCircleShow == "true" && (
        <>
          <TableContainerStyled ref={circleapi}>
            Add Circle Code and Commission for {selectedApiName}
            <Table className="mt-4">
              <TableHead>
                <TableRow>
                  {Circlecolumns.map((column) => (
                    <TableHeaderCellStyled key={column.accessorKey}>
                      {column.header}
                    </TableHeaderCellStyled>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {_cdata.map((row) => (
                  <TableRowStyled key={row.circle}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>
                      <TextFieldStyled
                        value={row.circleCode}
                        onChange={(e: any) =>
                          handleCircleChange(
                            row.circle,
                            "circleCode",
                            e.target.value,
                            row.apiId
                          )
                        }
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                  </TableRowStyled>
                ))}
              </TableBody>
            </Table>
          </TableContainerStyled>
          <ButtonLabel
            style={{ marginLeft: "40%" }}
            onClick={handleSaveApiCircle}
            disabled={Loading}
            loader={Loading}
            label="Submit"
          />
        </>
      )}

      <div className="w-70">
        <Popup
          styles={{ overflowY: "auto", maxHeight: "90%" }}
          title={"Edit Api"}
          isOpen={isOpen}
          onClose={closePopup}
          width="xxl"
        >
          <div className="flex">
            <div className="w-1/2">
              <p>Api Key - @api_key</p>
              <p>Mobile No - @mobileno </p>
              <p>Amount- @amt</p>
              <p>Operator Code - @opdid</p>
              <p>API Ref Id - @apirefid</p>
              <p>Retailer First name- @firstname</p>
              <p>Api UserName/Id - @apiUserName</p>
            </div>
            <div className="w-1/2">
              <p>Status - @status</p>
              <p>Balance - @balance</p>
              <p>@circleid - Circle Id</p>
              <p>Retailer user name- @username</p>
              <p>Parameters - @param1 @param2 @param3 @param4 @param5...</p>
            </div>
          </div>
          <div className="p-4">
            <div className="mb-6 flex gap-6">
              <TextInput
                label="Api Name"
                value={apiName}
                onChange={setApiName}
              />
              <TextInput
                label="Api Timeout in Sec"
                value={apiTimeout}
                onChange={setApiTimout}
              />
              <TextInput
                label="Api Key"
                value={apitoken}
                onChange={setApitoken}
              />
              <TextInput
                label="Api Base Url"
                value={apiBaseUrl}
                onChange={setApiBaseUrl}
              />
            </div>
            <div className="mb-6 flex gap-6">
              <div>
                <Select
                  label="Select Api Type"
                  onChange={handleApiTypeChange}
                  value={apiType}
                >
                  <Option value="Recharge">Recharge</Option>
                  <Option value="Money">Money</Option>
                  <Option value="SMS">SMS</Option>
                  <Option value="Email">Email</Option>
                  <Option value="WhatsApp">WhatsApp</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </div>
              <div>
                <Select
                  label="Select Api Mehod"
                  onChange={handleApiMethod}
                  value={apiMethod}
                >
                  <Option value="get">GET</Option>
                  <Option value="post">POST</Option>
                </Select>
              </div>
              <div>
                <Select
                  label="Select Response Type"
                  onChange={handleResponseType}
                  value={resposeType}
                >
                  <Option value="json">JSON</Option>
                  <Option value="xml">XML</Option>
                  <Option value="string">STRING</Option>
                </Select>
              </div>
              <div>
                <Select
                  label="Show Other Url"
                  onChange={handleShow}
                  value={isShow}
                >
                  <Option value="true">Show</Option>
                  <Option value="false">Hide</Option>
                </Select>
              </div>
            </div>
            {apiMethod == "post" && (
              <>
                <div className="mb-6">
                  <TextInput
                    label="Api Header"
                    value={apiHeaders}
                    onChange={setApiHeaders}
                  />
                </div>
                <div className="mb-6">
                  <TextInput
                    label="Api Body"
                    value={apiBody}
                    onChange={setApiBody}
                  />
                </div>
              </>
            )}
            <div className="mb-6">
              <TextField
                id="outlined-multiline-static"
                label="API Recharge Url"
                multiline
                fullWidth
                value={apiRechargeUrl}
                onChange={(e) => setApiRechargeUrl(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <div className="flex gap-5 flex-wrap">
                {params.map((param, index) => (
                  <div key={index} className="flex mb-2">
                    <TextField
                      label={`Param ${index + 1}`}
                      value={param}
                      onChange={(e) => handleParamChange(index, e.target.value)}
                    />
                    <button
                      type="button"
                      className="ml-2 p-2 bg-red-500 text-white"
                      onClick={() => removeParamField(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="p-2 bg-blue-500 text-white"
                  onClick={addParamField}
                >
                  Add Param
                </button>
              </div>
            </div>
            {isShow == "true" && (
              <>
                <div className="mb-6">
                  <TextField
                    id="outlined-multiline-static"
                    label="Add Complaint Url"
                    multiline
                    fullWidth
                    value={apiComplaint}
                    onChange={(e) => setApiComplaint(e.target.value)}
                  />
                </div>
                <div className="mb-6">
                  <TextField
                    id="outlined-multiline-static"
                    label="Add Balance Check Url"
                    multiline
                    fullWidth
                    value={apiBalanceCheck}
                    onChange={(e) => setApiBalanceCheck(e.target.value)}
                  />
                </div>
                <div className="mb-6">
                  <TextField
                    id="outlined-multiline-static"
                    label="API Plan Url"
                    multiline
                    fullWidth
                    value={planUrl}
                    onChange={(e) => setPlanUrl(e.target.value)}
                  />
                </div>
                <div className="mb-6">
                  <TextField
                    id="outlined-multiline-static"
                    label="API Roffer Url"
                    multiline
                    fullWidth
                    value={rofferUrl}
                    onChange={(e) => setRofferUrl(e.target.value)}
                  />
                </div>
              </>
            )}
            <div className="mb-6 flex gap-6">
              Recharge Response
              <TextField
                id="outlined-multiline-static"
                label="Response Trax Id"
                multiline
                fullWidth
                value={responseTxnid}
                onChange={(e) => setResponseTxnid(e.target.value)}
              />
              <TextField
                id="outlined-multiline-static"
                label="Response Status"
                multiline
                fullWidth
                value={responseStatus}
                onChange={(e) => setResponseStatus(e.target.value)}
              />
              <TextField
                id="outlined-multiline-static"
                label="Response Bal Api"
                multiline
                fullWidth
                value={responseBalApi}
                onChange={(e) => setResponseBalanceApi(e.target.value)}
              />
            </div>
            <div className="mb-6 flex gap-6">
              <TextField
                id="outlined-multiline-static"
                label="Response Lappu Bal "
                multiline
                fullWidth
                value={responseLappuBal}
                onChange={(e) => setResponseLappuBal(e.target.value)}
              />
              <TextField
                id="outlined-multiline-static"
                label="Response Lappu No"
                multiline
                fullWidth
                value={responseLappuNo}
                onChange={(e) => setResponseLappuNo(e.target.value)}
              />
              <TextField
                size="small"
                id="outlined-multiline-static"
                label="Response Key (XML)"
                multiline
                fullWidth
                value={responseKey}
                onChange={(e) => setResponseKey(e.target.value)}
              />
              <TextField
                id="outlined-multiline-static"
                label="Response R-Offer"
                multiline
                fullWidth
                value={responseRDATA}
                onChange={(e) => setResponseRDATA(e.target.value)}
              />
            </div>
            <div className="mb-6 flex gap-6">
              <TextField
                id="outlined-multiline-static"
                label="Response Succcess Value"
                multiline
                fullWidth
                value={responseSuccessValue}
                onChange={(e) => setResponseSuccessValue(e.target.value)}
              />
              <TextField
                id="outlined-multiline-static"
                label="Response Pending Value"
                multiline
                fullWidth
                value={responsePendingValue}
                onChange={(e) => setResponsePendingValue(e.target.value)}
              />
              <TextField
                id="outlined-multiline-static"
                label="Response Fail Value"
                multiline
                fullWidth
                value={responseFailValue}
                onChange={(e) => setResponseFailValue(e.target.value)}
              />
            </div>
            <div className="mb-6 flex gap-6">
              <TextField
                id="outlined-multiline-static"
                label="Response msg "
                multiline
                fullWidth
                value={responseMsg}
                onChange={(e) => setResponseMsg(e.target.value)}
              />
              <TextField
                id="outlined-multiline-static"
                label="Seprater Key"
                multiline
                fullWidth
                value={responseSeprate}
                onChange={(e) => setResponseSeprate(e.target.value)}
              />
            </div>
            <div className="mb-6 flex gap-6">
              Plan Api
              <TextField
                id="outlined-multiline-static"
                label="Response Operator Code"
                multiline
                fullWidth
                value={responseOpCode}
                onChange={(e) => setResponseOpCode(e.target.value)}
              />
              <TextField
                id="outlined-multiline-static"
                label="Response Circle"
                multiline
                fullWidth
                value={responseCircle}
                onChange={(e) => setResponseCircle(e.target.value)}
              />
              <TextField
                id="outlined-multiline-static"
                label="Response Circle Code"
                multiline
                fullWidth
                value={responseCircleCode}
                onChange={(e) => setResponseCircleCode(e.target.value)}
              />
            </div>
            <div className="flex gap-6  mt-10">
              {isEdit ? (
                <ButtonLabel
                  onClick={handleAddApi}
                  disabled={Loading}
                  loader={Loading}
                  label="Edit Api"
                />
              ) : (
                <ButtonLabel
                  onClick={handleAddApi}
                  disabled={Loading}
                  loader={Loading}
                  label="Add Api"
                />
              )}
              <ButtonLabel
                style={{ backgroundColor: "red" }}
                onClick={handleClose}
                disabled={Loading}
                loader={Loading}
                label="Close"
              />
            </div>
          </div>
        </Popup>
      </div>
    </DefaultLayout>
  );
};

export default Api;
