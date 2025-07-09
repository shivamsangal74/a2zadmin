import TextInput from "../../components/Input/TextInput";
import StepItem from "../../components/StepItem/StepItem";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useStepCount from "../../hooks/UseStepCount";
import { FaAddressCard } from "react-icons/fa6";
import { HiMiniAcademicCap } from "react-icons/hi2";
import { CiBank } from "react-icons/ci";
import { useEffect, useState } from "react";
import { UpdateUserInfo, getUser } from "../../Services/Axios/UserService";
import { ButtonLabel } from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import DropDown from "../../components/DropDown/DropDown";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../common/Loader";
import KycEdit from "../KYC/KycEdit";
import { toast } from "react-toastify";
import { getState } from "../../Services/commonService";
import { SearchDropDown } from "../../components/DropDown/SearchDropDown";
import RHFInput from "../../components/Input/RHFInput";
import { generateOTP, validateOTP } from "../../Services/AuthServices";
import { generateAddress, validateAadhar } from "../../Utills/Utility";
import AuthModel from "../../Auth/AuthModel";
import DatePicker1 from "../../components/DatePicker/DatePickerOne";
import dayjs from "dayjs";
import {
  getCommissions,
  getCommmissionBySponsor,
} from "../../Services/CommissionServices";
import DropDownCheakBox from "../../components/DropDown/DropDownCheakBox";
import Risk from "../RiskManage/Risk";
import { getDefaultRisk } from "../../Services/riskService";
import api from "../../Services/Axios/api";
import { Modal } from "antd";
import MapSelector from "../../components/LocationMap";
import map from "../../images/maps.svg";
const panSchema = z.string().refine((value) => {
  if (value.length !== 10) return false;

  const firstFiveChars = value.toLowerCase().substring(0, 5);
  if (!/^[a-z]+$/.test(firstFiveChars)) return false;

  const nextFourChars = value.toLowerCase().substring(5, 9);
  if (!/^\d+$/.test(nextFourChars)) return false;

  const lastChar = value.toLowerCase().charAt(9);
  if (!/^[a-z]+$/.test(lastChar)) return false;

  return true;
}, "Invalid PAN card number");

const schema = z
  .object({
    aadharNo: z
      .string()
      .min(12, "Aadhar number must be 12 digits")
      .max(14, "Aadhar number must be 12 digits")
      .nullable()
      .optional(),
    phoneNumber: z
      .string()
      .nonempty("Mobile number cannot be empty")
      .min(10, "Mobile number must be 10 digits")
      .max(10, "Mobile number must be 10 digits"),
    fullName: z.string().optional(),
    emailAddress: z.string().email("Invalid email address").optional(),
    panNo: panSchema.nullable().optional(),
    profile: z.string().nullable().optional(),
    dob: z.coerce
      .date()
      .min(new Date(1920, 0, 1), {
        message: "Date cannot go past January 1 1920",
      })
      .max(new Date(), { message: "Date must be in the past" })
      .nullable()
      .optional(),
    password: z.string().nullable().optional(),
    ekycStatus: z.number().nullable().optional(),
    userType: z.string().nonempty("User type cannot be empty"),
    sponsorId: z.string().nullable().optional(),
    referralId: z.string().nullable().optional(),
    commission: z.string().nullable().optional(),
    riskService: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    state: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    fatherName: z.string().nullable().optional(),
    fatherPhoneNumber: z.string().nullable().optional(),
    whatsappNo: z.string().nullable().optional(),
    pinCode: z
      .string()
      .min(6, "Pin code  must be 6 digits")
      .max(6, "Pin code  must be 6 digits")
      .optional(),
    additional1: z.string().nullable().optional(),
    additional2: z.string().nullable().optional(),
    additional3: z.string().nullable().optional(),
    shopName: z.string().nullable().optional(),
    shopAddress: z.string().nullable().optional(),
    shopPinCode: z.string().nullable().optional(),
    shopCity: z.string().nullable().optional(),
    shopState: z.string().nullable().optional(),
    locationLatitude: z.number().nullable().optional(),
    locationLongitude: z.number().nullable().optional(),
    nearLandmark: z.string().nullable().optional(),
    businessNature: z.string().nullable().optional(),
    nearBank: z.string().nullable().optional(),
    businessType: z.string().nullable().optional(),
    friendMobile: z.string().nullable().optional(),
    gstNo: z.string().nullable().optional(),
    adharUdyog: z.string().nullable().optional(),
    shopOwnership: z.string().nullable().optional(),
    optional1: z.any().nullable().optional(),
    optional2: z.any().nullable().optional(),
    optional3: z.string().nullable().optional(),
    optional4: z.string().nullable().optional(),
    selfVideo: z.string().nullable().optional(),
    documentVideo: z.string().nullable().optional(),
    shopPhotoFront: z.string().nullable().optional(),
    shopPhotoInside: z.string().nullable().optional(),
    optional5: z.string().nullable().optional(),
    optional6: z.string().nullable().optional(),
    optional7: z.string().nullable().optional(),
    bankName: z.string().nullable().optional(),
    bankAccount: z.string().nullable().optional(),
    accHolderName: z.string().nullable().optional(),

    bankIfscCode: z.string().nullable().optional(),
    lienAmount: z.number().nullable().optional(),
    cappingAmount: z.number().nullable().optional(),
    autoRefill: z.boolean().nullable().optional(),
    creditLimit: z.number().nullable().optional(),
    instantAutoCredit: z.boolean().nullable().optional(),
    minBalanceAlert: z.number().nullable().optional(),
    minBalanceAutoRefill: z.number().nullable().optional(),
    userRole: z.string().nullable().optional().default(""),
  })
  .refine((data) => {
    const errors = [];
    if (
      data.sponsorId &&
      data.referralId &&
      data.sponsorId === data.referralId
    ) {
      errors.push({
        message: "SponsorId and ReferralId cannot be the same.",
        path: ["sponsorId"],
        type: "custom",
      });
      errors.push({
        message: "SponsorId and ReferralId cannot be the same.",
        path: ["referralId"],
        type: "custom",
      });
    }
    if (errors.length > 0) {
      throw new z.ZodError(errors);
    }
    return true;
  });

type FormFields = z.infer<typeof schema>;
const AddUserEdit = ({ userid, userInfo, edit, setOpen }) => {
  const [openAuth, setOpenAuth] = useState(false);
  const [reqID, setReqID] = useState("");
  const [userData, setUserData] = useState<any[]>([]);
  const [service, setService] = useState([]);
  const [commission, setCommissions] = useState([]);
  const [commissionData, setCommissionData] = useState<any[]>([]);
  const [stateData, setStateData] = useState<any[]>([]);
  const [profile, setProfile] = useState("");
  const [openLocation, setOpenLocation] = useState(false);
  const { currentStep, goToStep, goToNextStep, goToPrevStep, isActiveStep } =
    useStepCount(5);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    watch,
    getValues,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: { ...userInfo, dob: dayjs(userInfo.dob) },
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    console.log(errors);
  }, [errors]);
  const onSubmit: SubmitHandler<FormFields> = async (userdata) => {
    try {
      if (data?.aadharNo) {
        userdata.aadharNo = userdata?.aadharNo.replace(/\s/g, "");
        //userdata.profile = profile;
      }
      await UpdateUserInfo(userdata, userid);
      reset(undefined, { keepErrors: false });
      toast.success("User updated successfully.");
      setOpen(false);
    } catch (error) {
      setError("root", {
        message: "Something went wrong ! Try Again",
      });
    }
  };
  const isFormCompleted = (errors: any) => {
    return Object.values(errors).every((error) => !error);
  };
  const userTypeValue = watch("userType");
  const { isLoading, error, data } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const response = await getUser(userTypeValue);
        let stateData = await getState();
        let riskData = await getDefaultRisk();
        let _dataRisk: any = [];
        if (riskData.service.length > 0) {
          riskData.service.forEach((op: any) => {
            _dataRisk.push({
              showvalue: `${op.userId}`,
              value: op.userId,
            });
          });
        }
        setService(_dataRisk);
        let commissionData = [];
        let _dataComm: any = [];
        let uniqueCommissions = new Set();
        if (userInfo.userType === "retailer") {
          commissionData = await getCommmissionBySponsor(userInfo.sponsorId);
          if (commissionData.length > 0) {
            commissionData.forEach((op: any) => {
              _dataComm.push({
                showvalue: `${op}`,
                value: op,
              });
            });
          }
          setCommissionData(_dataComm);
        } else {
          commissionData = await getCommissions();
          if (commissionData.length > 0) {
            commissionData.forEach((op: any) => {
              if (op?.commName && !uniqueCommissions.has(op.commName)) {
                uniqueCommissions.add(op.commName);
                _dataComm.push({
                  showvalue: `${op.commName}`,
                  value: op.commName,
                });
              }
            });
          }
          if (_dataComm.length > 0) {
            setCommissionData(_dataComm);
          }
        }
        const userData = response.users;

        if (_dataComm.length > 0) {
          setCommissionData(_dataComm);
        }
        if (userInfo.profile) {
          setProfile(userInfo.profile);
        }
        if (userInfo.commission) {
          setCommissions(userInfo.commission);
        }
        const formattedStates = stateData.states.map((state: any) => ({
          showvalue: state,
          value: state,
        }));
        setStateData(formattedStates);
        let _data: any[] = [];
        if (userData.length > 0) {
          userData.forEach((user: any) => {
            _data.push({
              showvalue:
                user?.userUniqueId +
                " " +
                user?.fullName +
                "(" +
                user.phoneNumber +
                ")",
              value: user?.userUniqueId,
            });
          });
          // userData.forEach((user: any) => {
          //   _data.push({
          //     showvalue: user?.fullName,
          //     value: user?.userUniqueId,
          //   });
          // });
        }
        setValue("userRole", _data.userType);
        setUserData(_data);
        return userData;
      } catch (error) {
        toast.error("Something went wrong.");
      }
    },
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <Loader />;
  if (error) {
    toast.error("Something went wrong.");
  }

  async function valiadateOTP(code: string, reqID: String) {
    console.log("verifction code", code, reqID);
    try {
      const response = await validateOTP(code, reqID.toString());
      const address = generateAddress(response);
      setProfile(response?.response?.data?.profile_image);
      const aadharData = {
        address: address,
        fullName: response.response.data.full_name,
        fatherName: response.response.data.care_of.split(":")[1],
        pinCode: response.response.data.zip,
        city: response.response.data.address.po,
        state: response.response.data.address.state,
        DOB: response.response.data.dob,
      };

      if (response.status == "error") {
        toast.error(response?.message);
        throw new Error(response.message);
      } else {
        if (aadharData) {
          setValue("ekycStatus", 1);
          Object.entries(aadharData).forEach(([key, value]) => {
            setValue(key, value);
          });
          setValue("profile", response.response.data.profile_image);
          setValue("dob", dayjs(aadharData.DOB));
        } else {
          setValue("ekycStatus", 0);
        }

        setOpenAuth(false);
      }
    } catch (err: any) {
      toast.error(err?.message);
      throw new Error(err);
    }
  }

  async function generateAadharOtpHandler() {
    let aadhar = getValues("aadharNo");
    if (!aadhar) {
      toast.error("Enter aadhar number please.");
      return;
    }
    let _aadhar = JSON.parse(JSON.stringify(aadhar));
    _aadhar = _aadhar.replace(/\s/g, "");

    if (!_aadhar) {
      toast.error("Enter aadhar number please.");
      return;
    }
    try {
      if (validateAadhar(_aadhar)) {
        const response = await generateOTP(_aadhar);
        setReqID(response.request_id);
        setOpenAuth(true);
      } else {
        setOpenAuth(false);
        toast.error("Invalid Aadhar");
      }
    } catch (error) {
      setOpenAuth(false);

      toast.error("Invalid Aadhar");
    }
  }

  const onChange = (e: string) => {
    const numericValue = e.replace(/\D/g, "");
    if (numericValue.length > 12) return;
    const formattedValue = numericValue.match(/.{1,4}/g)?.join(" ") || "";
    setValue("aadharNo", formattedValue);
  };

  async function handleCommission(values: any) {
    setCommissions(values);
    const commaSeparatedValues = values.join(",");
    setValue("commission", commaSeparatedValues);
  }

  const [roleData, setRoleData] = useState([]);
  const { isLoading: roleLoading, error: roleError } = useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      try {
        const response = await api.get("/permissions/getroles");
        let role_Data = [];
        debugger;
        if (response.data.Roles.length > 0) {
          response.data.Roles.forEach((role) => {
            role_Data.push({
              showvalue: role.roleName,
              value: role.id.toString(),
            });
          });
          setRoleData(role_Data);
        }
        return response.data.Roles || [];
      } catch (error: any) {
        toast.error(error.message || "An error occurred while fetching roles.");
        throw error;
      }
    },
    refetchOnWindowFocus: false,
  });
  if (roleLoading) return <Loader />;

  const onLocationSelect = (location: any) => {
    setValue("optional1", location.lat);
    setValue("optional2", location.lng);
  };

  return (
    <div className="w-full flex flex-col sm:flex-row flex-grow overflow-hidden">
      <div className="sm:w-1/4 md:1/4 w-full flex-shrink flex-grow-0 p-8">
        <div className="sticky top-0 px-1 w-full">
          {profile && (
            <div className="ml-5 mb-5">
              <img
                src={`data:image/jpeg;base64,${profile}`}
                alt="Base64"
                height={"100%"}
                width={"50%"}
              />
            </div>
          )}
          <ol className="relative text-gray-500 border-s border-gray-200 dark:border-gray-700 dark:text-gray-400">
            <StepItem
              title="Personal Information"
              description="Personal info of user."
              completed={isFormCompleted(errors)}
              currentStep={currentStep}
              stepNumber={1}
              onClick={() => goToStep(1)}
              icon={<FaAddressCard />}
            />

            <StepItem
              title="Company/Shop Info"
              description="Company/Shop info of user."
              completed={isFormCompleted(errors)}
              currentStep={currentStep}
              stepNumber={2}
              onClick={() => goToStep(2)}
              icon={<HiMiniAcademicCap />}
            />

            <StepItem
              title="Bank Details"
              description="Bank info of user."
              completed={isFormCompleted(errors)}
              currentStep={currentStep}
              stepNumber={3}
              onClick={() => goToStep(3)}
              icon={<CiBank />}
            />

            <StepItem
              title="KYC"
              description="Kyc info of user."
              completed={false}
              currentStep={currentStep}
              stepNumber={4}
              onClick={() => goToStep(4)}
              icon={<CiBank />}
            />
            <StepItem
              title="Manage Service"
              description="manage service."
              completed={false}
              currentStep={currentStep}
              stepNumber={5}
              onClick={() => goToStep(5)}
              icon={<CiBank />}
            />
          </ol>
        </div>
      </div>
      <main role="main" className="w-full h-full flex-grow p-3 overflow-auto">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentStep === 1 && (
              <>
                <DropDown
                  disabledProp={true}
                  required={true}
                  label="Select UserType"
                  registerAction={register("userType")}
                  Options={[
                    { showvalue: "Select UserType", value: undefined },
                    { showvalue: "admin", value: "admin" },
                    {
                      showvalue: "Master Distributor",
                      value: "masterdistributor",
                    },
                    { showvalue: "Distributor", value: "distributor" },
                    { showvalue: "Retailer", value: "retailer" },
                    { showvalue: "Api User", value: "apiuser" },

                    { showvalue: "Referal", value: "Referal" },
                  ]}
                  error={errors.userType?.message}
                  name="userType"
                  controlProp={control}
                />

                <SearchDropDown
                  disabledProp={edit}
                  required={true}
                  placeholder="Select Sponsor"
                  options={[
                    { showvalue: "admin", value: "admin" },
                    ...userData,
                  ]}
                  error={errors.sponsorId?.message}
                  name="sponsorId"
                  controlProp={control}
                />

                <SearchDropDown
                  disabledProp={edit}
                  placeholder="Select Referral"
                  options={[
                    { showvalue: "admin", value: "admin" },
                    ...userData,
                  ]}
                  error={errors.referralId?.message}
                  name="referralId"
                  controlProp={control}
                />
                <RHFInput
                  verificationFn={generateAadharOtpHandler}
                  required={false}
                  isModel={false}
                  disabledProp={getValues("ekycStatus") ? true : false}
                  controlProp={control}
                  label="Aadhar Number"
                  name="aadharNo"
                  onChange={onChange}
                  registerAction={{ ...register("aadharNo") }}
                  placeholder="Enter Aadhar Number"
                  error={errors.aadharNo?.message}
                />
                <RHFInput
                  isModel={false}
                  controlProp={control}
                  disabledProp={edit}
                  label="PAN Number"
                  name="panNo"
                  registerAction={{ ...register("panNo") }}
                  placeholder="Enter PAN Number"
                  error={errors.panNo?.message}
                />
                <RHFInput
                  isModel={false}
                  required={true}
                  controlProp={control}
                  disabledProp={edit}
                  label="Mobile Number"
                  name="phoneNumber"
                  registerAction={{ ...register("phoneNumber") }}
                  placeholder="Enter Mobile Number"
                  error={errors.phoneNumber?.message}
                />
                <RHFInput
                  isModel={false}
                  controlProp={control}
                  disabledProp={edit}
                  label="Full Name"
                  name="fullName"
                  registerAction={{ ...register("fullName") }}
                  placeholder="Enter Full Name"
                  error={errors.fullName?.message}
                />

                <RHFInput
                  isModel={false}
                  controlProp={control}
                  disabledProp={edit}
                  label="Father's Name"
                  name="fatherName"
                  registerAction={{ ...register("fatherName") }}
                  placeholder="Enter Father's Name"
                  error={errors.fatherName?.message}
                />

                <DatePicker1
                  label="Date of Birth"
                  name="dob"
                  disabelProp={edit}
                  registerAction={{ ...register("dob") }}
                  controlProp={control}
                  error={errors.dob?.message}
                />

                <div className="md:col-span-3">
                  <TextInput
                    isModel={true}
                    disabledProp={edit}
                    label="Address"
                    name="address"
                    registerAction={{ ...register("address") }}
                    placeholder="Enter Address"
                    error={errors.address?.message}
                  />
                </div>

                <DropDown
                  label="Select State"
                  registerAction={{ ...register("state") }}
                  Options={stateData}
                  error={errors.state?.message}
                  name="state"
                  controlProp={control}
                  disabledProp={edit}
                  isModel={true}
                />

                {/* <RHFInput
                    isModel={false}
                    controlProp={control}
                  disabledProp={edit}
                  label="State"
                  name="state"
                  registerAction={{ ...register("state") }}
                  placeholder="Enter State"
                  error={errors.state?.message}
                /> */}

                <RHFInput
                  isModel={false}
                  controlProp={control}
                  disabledProp={edit}
                  label="City"
                  name="city"
                  registerAction={{ ...register("city") }}
                  placeholder="Enter City"
                  error={errors.city?.message}
                />

                <RHFInput
                  isModel={false}
                  controlProp={control}
                  disabledProp={edit}
                  label="Pin Code"
                  name="pinCode"
                  registerAction={{ ...register("pinCode") }}
                  placeholder="Enter Pin Code"
                  error={errors.pinCode?.message}
                />

                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextInput
                    isModel={true}
                    disabledProp={edit}
                    label="Email Address"
                    name="emailAddress"
                    registerAction={{ ...register("emailAddress") }}
                    placeholder="Enter Email Address"
                    error={errors.emailAddress?.message}
                  />

                  <TextInput
                    isModel={true}
                    disabledProp={edit}
                    label="Father's Phone Number"
                    name="fatherPhoneNumber"
                    registerAction={{ ...register("fatherPhoneNumber") }}
                    placeholder="Enter Father's Phone Number"
                    error={errors.fatherPhoneNumber?.message}
                  />
                </div>

                <RHFInput
                  isModel={false}
                  controlProp={control}
                  disabledProp={edit}
                  label="WhatsApp Number"
                  name="whatsappNo"
                  registerAction={{ ...register("whatsappNo") }}
                  placeholder="Enter WhatsApp Number"
                  error={errors.whatsappNo?.message}
                />

                <RHFInput
                  isModel={false}
                  controlProp={control}
                  disabledProp={edit}
                  label="Additional Field 1"
                  name="additional1"
                  registerAction={{ ...register("additional1") }}
                  placeholder="Enter Additional Field 1"
                  error={errors.additional1?.message}
                />

                <RHFInput
                  isModel={false}
                  controlProp={control}
                  disabledProp={edit}
                  label="Additional Field 2"
                  name="additional2"
                  registerAction={{ ...register("additional2") }}
                  placeholder="Enter Additional Field 2"
                  error={errors.additional2?.message}
                />

                <RHFInput
                  isModel={false}
                  controlProp={control}
                  disabledProp={edit}
                  label="Additional Field 3"
                  name="additional3"
                  registerAction={{ ...register("additional3") }}
                  placeholder="Enter Additional Field 3"
                  error={errors.additional3?.message}
                />
                {userInfo.userType === "retailer" ? (
                  <SearchDropDown
                    disabledProp={edit}
                    placeholder="Select Commission"
                    options={[...commissionData]}
                    name="commission"
                    controlProp={control}
                  />
                ) : (
                  <DropDownCheakBox
                    label={"Commission"}
                    options={[
                      { showvalue: "Select All", value: "All" },
                      ...commissionData,
                    ]}
                    value={commission}
                    onChange={handleCommission}
                  />
                )}
                <SearchDropDown
                  disabledProp={edit}
                  placeholder="Select Risk Service"
                  options={[...service]}
                  name="riskService"
                  controlProp={control}
                />
                <DropDown
                  disabledProp={edit}
                  required={false}
                  label="Select userRole"
                  registerAction={register("userRole")}
                  Options={[...roleData]}
                  error={errors.userType?.message}
                  name="userRole"
                  controlProp={control}
                />
              </>
            )}

            {currentStep === 2 && (
              <>
                <RHFInput
                  isModel={false}
                  controlProp={control}
                  disabledProp={edit}
                  label="Business Nature"
                  name="businessNature"
                  registerAction={{ ...register("businessNature") }}
                  placeholder="Enter Business Nature"
                  error={errors.businessNature?.message}
                />

                <RHFInput
                  isModel={false}
                  controlProp={control}
                  disabledProp={edit}
                  label="Near Bank"
                  name="nearBank"
                  registerAction={{ ...register("nearBank") }}
                  placeholder="Enter Near Bank"
                  error={errors.nearBank?.message}
                />

                <RHFInput
                  isModel={false}
                  controlProp={control}
                  disabledProp={edit}
                  label="Business Type"
                  name="businessType"
                  registerAction={{ ...register("businessType") }}
                  placeholder="Enter Business Type"
                  error={errors.businessType?.message}
                />

                <RHFInput
                  isModel={false}
                  controlProp={control}
                  disabledProp={edit}
                  label="Friend's Mobile"
                  name="friendMobile"
                  registerAction={{ ...register("friendMobile") }}
                  placeholder="Enter Friend's Mobile"
                  error={errors.friendMobile?.message}
                />

                <RHFInput
                  isModel={false}
                  controlProp={control}
                  disabledProp={edit}
                  label="GST Number"
                  name="gstNo"
                  registerAction={{ ...register("gstNo") }}
                  placeholder="Enter GST Number"
                  error={errors.gstNo?.message}
                />

                <RHFInput
                  isModel={false}
                  controlProp={control}
                  disabledProp={edit}
                  label="Aadhar Udyog"
                  name="adharUdyog"
                  registerAction={{ ...register("adharUdyog") }}
                  placeholder="Enter Aadhar Udyog"
                  error={errors.adharUdyog?.message}
                />

                <RHFInput
                  isModel={false}
                  controlProp={control}
                  disabledProp={edit}
                  label="Shop Ownership"
                  name="shopOwnership"
                  registerAction={{ ...register("shopOwnership") }}
                  placeholder="Enter Shop Ownership"
                  error={errors.shopOwnership?.message}
                />

                <RHFInput
                  isModel={false}
                  controlProp={control}
                  disabledProp={edit}
                  label="Latitude"
                  name="optional1"
                  registerAction={{ ...register("optional1") }}
                  placeholder="Enter Latitude"
                  error={errors.optional1?.message}
                />

                <div className="flex gap-3">
                  <div className="w-100">
                    <RHFInput
                      isModel={false}
                      controlProp={control}
                      disabledProp={edit}
                      label="Longitute"
                      name="optional2"
                      registerAction={{ ...register("optional2") }}
                      placeholder="Enter Longitute"
                      error={errors.optional2?.message}
                    />
                  </div>
                  <img
                    src={map}
                    alt=""
                    height={30}
                    width={30}
                    onClick={() => setOpenLocation(true)}
                  />
                </div>

                <RHFInput
                  isModel={false}
                  controlProp={control}
                  disabledProp={edit}
                  label="Optional Field 3"
                  name="optional3"
                  registerAction={{ ...register("optional3") }}
                  placeholder="Enter Optional Field 3"
                  error={errors.optional3?.message}
                />

                <RHFInput
                  isModel={false}
                  controlProp={control}
                  disabledProp={edit}
                  label="Optional Field 4"
                  name="optional4"
                  registerAction={{ ...register("optional4") }}
                  placeholder="Enter Optional Field 4"
                  error={errors.optional4?.message}
                />

                <RHFInput
                  isModel={false}
                  controlProp={control}
                  disabledProp={edit}
                  label="Self Video"
                  name="selfVideo"
                  registerAction={{ ...register("selfVideo") }}
                  placeholder="Enter Self Video"
                  error={errors.selfVideo?.message}
                />

                <RHFInput
                  isModel={false}
                  controlProp={control}
                  disabledProp={edit}
                  label="Document Video"
                  name="documentVideo"
                  registerAction={{ ...register("documentVideo") }}
                  placeholder="Enter Document Video"
                  error={errors.documentVideo?.message}
                />

                <RHFInput
                  isModel={false}
                  controlProp={control}
                  disabledProp={edit}
                  label="Shop Photo Front"
                  name="shopPhotoFront"
                  registerAction={{ ...register("shopPhotoFront") }}
                  placeholder="Enter Shop Photo Front"
                  error={errors.shopPhotoFront?.message}
                />

                <RHFInput
                  isModel={false}
                  controlProp={control}
                  disabledProp={edit}
                  label="Shop Photo Inside"
                  name="shopPhotoInside"
                  registerAction={{ ...register("shopPhotoInside") }}
                  placeholder="Enter Shop Photo Inside"
                  error={errors.shopPhotoInside?.message}
                />

                <RHFInput
                  isModel={false}
                  controlProp={control}
                  disabledProp={edit}
                  label="Optional Field 5"
                  name="optional5"
                  registerAction={{ ...register("optional5") }}
                  placeholder="Enter Optional Field 5"
                  error={errors.optional5?.message}
                />

                <RHFInput
                  isModel={false}
                  controlProp={control}
                  disabledProp={edit}
                  label="Optional Field 6"
                  name="optional6"
                  registerAction={{ ...register("optional6") }}
                  placeholder="Enter Optional Field 6"
                  error={errors.optional6?.message}
                />

                <RHFInput
                  isModel={false}
                  controlProp={control}
                  disabledProp={edit}
                  label="Optional Field 7"
                  name="optional7"
                  registerAction={{ ...register("optional7") }}
                  placeholder="Enter Optional Field 7"
                  error={errors.optional7?.message}
                />
              </>
            )}

            {currentStep === 3 && (
              <>
                <RHFInput
                  isModel={false}
                  controlProp={control}
                  disabledProp={edit}
                  label="Bank Name"
                  name="bankName"
                  registerAction={{ ...register("bankName") }}
                  placeholder="Enter Bank Name"
                  error={errors.bankName?.message}
                />

                <RHFInput
                  isModel={false}
                  controlProp={control}
                  disabledProp={edit}
                  label="Bank Account Number"
                  name="bankAccount"
                  registerAction={{ ...register("bankAccount") }}
                  placeholder="Enter Bank Account Number"
                  error={errors.bankAccount?.message}
                />

                <RHFInput
                  isModel={false}
                  controlProp={control}
                  disabledProp={edit}
                  label="IFSC Code"
                  name="bankIfscCode"
                  registerAction={{ ...register("bankIfscCode") }}
                  placeholder="Enter IFSC Code"
                  error={errors.bankIfscCode?.message}
                />
              </>
            )}
          </div>
          {currentStep === 4 && (
            <>
              <KycEdit userid={userid} />
            </>
          )}
          {currentStep === 5 && (
            <>
              <Risk userid={userid} />
            </>
          )}
          {currentStep != 5 && (
            <div className="flex gap-3">
              <ButtonLabel
                onClick={() => {}}
                type="submit"
                loader={isSubmitting}
                disabled={isSubmitting}
                label="Save"
              />

              <ButtonLabel
                onClick={() => {
                  setOpen(false);
                }}
                type="cancel"
                loader={isSubmitting}
                disabled={isSubmitting}
                label="Cancel"
                veriant={"outline"}
              />
            </div>
          )}

          {errors.root && (
            <div className="text-red-500">{errors.root.message}</div>
          )}
        </form>
        <Modal
          title={<p>Location</p>}
          width={1200}
          open={openLocation}
          onCancel={() => setOpenLocation(false)}
          onOk={() => setOpenLocation(false)}
        >
          <MapSelector onLocationSelect={(loc) => console.log(loc)} />
        </Modal>
        <AuthModel
          open={openAuth}
          validateOtp={valiadateOTP}
          reqID={reqID}
          setOpen={setOpenAuth}
        />
      </main>
    </div>
  );
};

export default AddUserEdit;
