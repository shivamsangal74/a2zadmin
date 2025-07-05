import DefaultLayout from "../../../layout/DefaultLayout";
import TextInput from "../../../components/Input/TextInput";
import { ButtonLabel } from "../../../components/Button/Button";
import { addApi } from "../../../Services/ApiService";
import { toast } from "react-toastify";
import Loader from "../../../common/Loader";
import { Select, Option, Textarea } from "@material-tailwind/react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import { Switch } from "@mui/material";
import PinInput from "../../../components/VerifyPin/VerifyPin";

interface ApiData {
  apiId: string;
  apiName: string;
  apiType: string;
  apiRechargeUrl: string;
  apiToken: string;
  status: boolean;
  [key: string]: any;
}

const CreateApi = () => {
  const [apiName, setApiName] = useState("");
  const [apiType, setApiType] = useState("");
  const [apiId, setApiId] = useState("");
  const [apiBody, setApiBody] = useState("");
  const [apiHeaders, setApiHeaders] = useState("");
  const [apiMethod, setApiMehod] = useState("get");
  const [apiRechargeUrl, setApiRechargeUrl] = useState("");
  const [apiGasUrl, setApiGasUrl] = useState("");
  const [apiDTHUrl, setApiDTHUrl] = useState("");
  const [apiDataCardUrl, setApiDataCardUrl] = useState("");
  const [apiFastCardUrl, setApiFastCardUrl] = useState("");
  const [planUrl, setPlanUrl] = useState("");
  const [rofferUrl, setRofferUrl] = useState("");
  const [operatorUrl, setOperatorUrl] = useState("");
  const [responseStatus, setResponseStatus] = useState("");
  const [responseTxnid, setResponseTxnid] = useState("");
  const [responseOpCode, setResponseOpCode] = useState("");
  const [responseCircleCode, setResponseCircleCode] = useState("");
  const [responseKey, setResponseKey] = useState("");
  const [responseRDATA, setResponseRDATA] = useState("");
  const [responseCircle, setResponseCircle] = useState("");
  const [apiInsuranceUrl, setApiInsuranceUrl] = useState("");
  const [apiStatus, setApiStatus] = useState("");
  const [apiBalanceCheck, setApiBalanceCheck] = useState("");
  const [checkStatusMethod, setcheckStatusMethod] = useState("");
  const [checkStatusBody, setcheckStatusBody] = useState("");
  const [apiComplaint, setApiComplaint] = useState("");
  const [apiCheckUrl, setAPiCheckUrl] = useState("");
  const [apiTimeout, setApiTimout] = useState("");
  const [isShow, setIsShow] = useState("false");
  const [apiToken, setApiToken] = useState("");
  const [resposeType, setResponseType] = useState("");
  const [params, setParams] = useState([""]);
  const [apiBaseUrl, setApiBaseUrl] = useState("");
  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [responseApiBalance, setResponseApiBalance] = useState("");
  const [responseLappuNo, setResponseLappuNo] = useState("");
  const [responseLappuBal, setResponseLappuBal] = useState("");
  const [responseSuccessValue, setResponseSuccessValue] = useState("");
  const [responseCheckStatus, setResponseCheckStatus] = useState("");
  const [responseFailValue, setResponseFailValue] = useState("");
  const [responsePendingValue, setResponsePendingValue] = useState("");
  const [responseSeprate, setResponseSeprate] = useState("");
  const [responseMsg, setResponseMsg] = useState("");
  const handleAddApi = async () => {
    setShowPin(false);
    setLoading(true);
    const emptyFields: string[] = [];

    if (!apiType) emptyFields.push("Api Type");
    if (!apiName) emptyFields.push("Api Name");
    if (emptyFields.length > 0) {
      toast.error(
        `Please fill in the following fields: ${emptyFields.join(", ")}`
      );
      setLoading(false);
      return;
    }

    const _data: ApiData = {
      apiId: apiId,
      apiName: apiName,
      apiType: apiType,
      apiMethod: apiMethod,
      apiRechargeUrl: apiRechargeUrl,
      apiToken: apiToken,
      status: status,
      apiCompaint: apiComplaint,
      apiTimeout: apiTimeout,
      apiGasUrl: apiGasUrl,
      apiDTHUrl: apiDTHUrl,
      apiBaseUrl: apiBaseUrl,
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
      checkStatusMethod: checkStatusMethod,
      checkStatusBody: checkStatusBody,
      rofferUrl: rofferUrl,
      planUrl: planUrl,
      operatorUrl: operatorUrl,
      resposeType: resposeType,
      responseApiBalance: responseApiBalance,
      responseLappuBal: responseLappuBal,
      responseLappuNo: responseLappuBal,
      responseSuccessValue: responseSuccessValue,
      responsePendingValue: responsePendingValue,
      responseFailValue: responseFailValue,
      responseSeprate: responseSeprate,
      responseMsg: responseMsg,
      apiCheckUrl: apiCheckUrl,
    };
    params.forEach((param, index) => {
      if (param) {
        _data[`param${index + 1}`] = param;
      }
    });

    try {
      await addApi(_data);
      toast.success("Api added successfully.");
    } catch (error) {
      toast.error("Failed to add Api.");
    } finally {
      setLoading(false);
    }
  };

  const handleApiTypeChange = (event: any) => {
    setApiType(event);
  };
  const handleApiMethod = (event: any) => {
    setApiMehod(event);
  };
  const handleCheckStatusApiMethod = (event: any) => {
    setcheckStatusMethod(event);
  };
  const handleShow = (event: any) => {
    setIsShow(event);
  };

  const handleParamChange = (index: number, value: string) => {
    const newParams = [...params];
    newParams[index] = value;
    setParams(newParams);
  };

  const handleResponseType = (event: any) => {
    setResponseType(event);
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

  return (
    <DefaultLayout isList={true}>
      <h1 className="fz-18 font-bold">Add Api</h1>
      <div className="flex p-4">
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
        <div className="mb-6 m-auto grid grid-cols-4 gap-4">
          <TextInput label="Api Name" value={apiName} onChange={setApiName} />
          <TextInput
            label="Api Timeout in Sec"
            value={apiTimeout}
            onChange={setApiTimout}
          />
          <TextInput
            label="Api Token"
            value={apiToken}
            onChange={setApiToken}
          />
          <TextInput
            label="Api Base Url"
            value={apiBaseUrl}
            onChange={setApiBaseUrl}
          />
        </div>
        <div className="mb-6 m-auto grid grid-cols-4 gap-4">
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
            <Select label="Show Other Url" onChange={handleShow} value={isShow}>
              <Option value="true">Show</Option>
              <Option value="false">Hide</Option>
            </Select>
          </div>
        </div>
        {apiMethod == "post" && (
          <>
            <div className="mb-6">
              <TextInput
                multiline
                label="Api Header"
                value={apiHeaders}
                onChange={setApiHeaders}
              />
            </div>
            <div className="mb-6">
              <TextInput
                multiline
                label="Api Body"
                value={apiBody}
                onChange={setApiBody}
              />
            </div>
          </>
        )}
        <div className="mb-6">
          <TextField
            size="small"
            id="outlined-multiline-static"
            label="API Recharge Url"
            multiline
            fullWidth
            value={apiRechargeUrl}
            onChange={(e) => setApiRechargeUrl(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <div className="mb-6 m-auto grid grid-cols-4 gap-4">
            {params.map((param, index) => (
              <div key={index} className="flex mb-2">
                <TextField
                  size="small"
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
          </div>
          <button
            type="button"
            className="p-2 bg-blue-500 text-white"
            onClick={addParamField}
          >
            Add Param
          </button>
        </div>
        {isShow == "true" && (
          <>
            <div className="mb-6 bg-yellow-100">
              <TextField
                size="small"
                id="outlined-multiline-static"
                label="Add Check status Url"
                multiline
                fullWidth
                value={apiCheckUrl}
                onChange={(e) => setAPiCheckUrl(e.target.value)}
              />
            </div>
            <div className="mb-6 bg-yellow-100">
              <Select
                label="Select Check Status Mehod"
                onChange={handleCheckStatusApiMethod}
                value={checkStatusMethod}
              >
                <Option value="get">GET</Option>
                <Option value="post">POST</Option>
              </Select>
            </div>
            <div className="mb-6 bg-yellow-100">
              <TextField
                id="outlined-multiline-static"
                label="Add API Check Status Body"
                multiline
                fullWidth
                value={checkStatusBody}
                onChange={(e) => setcheckStatusBody(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <TextField
                size="small"
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
                size="small"
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
                size="small"
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
                size="small"
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
        <div className="font-bold fz-18 mb-2">Recharge Response</div>
        <div className="mb-6 m-auto grid grid-cols-5 gap-4">
          <TextField
            size="small"
            id="outlined-multiline-static"
            label="Response Trax Id"
            multiline
            fullWidth
            value={responseTxnid}
            onChange={(e) => setResponseTxnid(e.target.value)}
          />
          <TextField
            size="small"
            id="outlined-multiline-static"
            label="Response Status"
            multiline
            fullWidth
            value={responseStatus}
            onChange={(e) => setResponseStatus(e.target.value)}
          />
          <TextField
            size="small"
            id="outlined-multiline-static"
            label="Response Bal Api"
            multiline
            fullWidth
            value={responseApiBalance}
            onChange={(e) => setResponseApiBalance(e.target.value)}
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
            size="small"
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
            label="Response Lappu Bal"
            multiline
            fullWidth
            value={responseLappuBal}
            onChange={(e) => setResponseLappuBal(e.target.value)}
          />
          <TextField
            size="small"
            id="outlined-multiline-static"
            label="Response R-Offer"
            multiline
            fullWidth
            value={responseRDATA}
            onChange={(e) => setResponseRDATA(e.target.value)}
          />

          <TextField
            size="small"
            id="outlined-multiline-static"
            label="Response Succcess Value"
            multiline
            fullWidth
            value={responseSuccessValue}
            onChange={(e) => setResponseSuccessValue(e.target.value)}
          />
          <TextField
            size="small"
            id="outlined-multiline-static"
            label="Response Pending Value"
            multiline
            fullWidth
            value={responsePendingValue}
            onChange={(e) => setResponsePendingValue(e.target.value)}
          />
          <TextField
            size="small"
            id="outlined-multiline-static"
            label="Response Fail Value"
            multiline
            fullWidth
            value={responseFailValue}
            onChange={(e) => setResponseFailValue(e.target.value)}
          />
          <TextField
            size="small"
            id="outlined-multiline-static"
            label="Response Msg"
            multiline
            fullWidth
            value={responseMsg}
            onChange={(e) => setResponseMsg(e.target.value)}
          />
          <TextField
            size="small"
            id="outlined-multiline-static"
            label="Seprater Key"
            multiline
            fullWidth
            value={responseSeprate}
            onChange={(e) => setResponseSeprate(e.target.value)}
          />
        </div>

        <div className="font-bold fz-18 mb-2">Plan Api</div>
        <div className="mb-6 m-auto grid grid-cols-5 gap-4">
          <TextField
            size="small"
            id="outlined-multiline-static"
            label="Response Operator Code"
            multiline
            fullWidth
            value={responseOpCode}
            onChange={(e) => setResponseOpCode(e.target.value)}
          />
          <TextField
            size="small"
            id="outlined-multiline-static"
            label="Response Circle"
            multiline
            fullWidth
            value={responseCircle}
            onChange={(e) => setResponseCircle(e.target.value)}
          />
          <TextField
            size="small"
            id="outlined-multiline-static"
            label="Response Circle Code"
            multiline
            fullWidth
            value={responseCircleCode}
            onChange={(e) => setResponseCircleCode(e.target.value)}
          />
        </div>
        <div className="flex gap-2 items-center">
          <span>Status : </span>
          <Switch
            checked={status}
            onChange={() => setStatus(!status)}
            inputProps={{ "aria-label": "status switch" }}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: status ? "green" : "red",
              },
              "& .MuiSwitch-thumb": {
                backgroundColor: status ? "green" : "red",
              },
              "& .MuiSwitch-track": {
                backgroundColor: status ? "green" : "red",
              },
            }}
          />
        </div>
        <div className="mt-10">
          <ButtonLabel
            onClick={() => setShowPin(!showPin)}
            disabled={loading}
            loader={loading}
            label={"Add Api"}
          />
        </div>
      </div>
      {showPin && <PinInput onComplete={() => handleAddApi()} />}
    </DefaultLayout>
  );
};

export default CreateApi;
