import DefaultLayout from "../../layout/DefaultLayout";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import RHFInput from "../../components/Input/RHFInput";
import StepItem from "../../components/StepItem/StepItem";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useStepCount from "../../hooks/UseStepCount";
import { FaAddressCard } from "react-icons/fa6";
import { HiMiniAcademicCap } from "react-icons/hi2";
import { CiBank, CiUser } from "react-icons/ci";
import AuthModel from "../../Auth/AuthModel";
import { useEffect, useState } from "react";
import { addUser, getUser } from "../../Services/Axios/UserService";
import { ButtonLabel } from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import DatePicker1 from "../../components/DatePicker/DatePickerOne";
import DropDown from "../../components/DropDown/DropDown";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../common/Loader";
import { toast } from "react-toastify";
import { getState } from "../../Services/commonService";
import { generateAddress, validateAadhar } from "../../Utills/Utility";
import { generateOTP, validateOTP } from "../../Services/AuthServices";

import { SearchDropDown } from "../../components/DropDown/SearchDropDown";
import { MdOutlineVerifiedUser } from "react-icons/md";
import dayjs from "dayjs";

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
      .min(14, "Aadhar number must be 12 digits")
      .max(14, "Aadhar number must be 12 digits")
      .optional(),
    phoneNumber: z
      .string()

      .min(10, "Mobile number must be 10 digits")
      .max(10, "Mobile number must be 10 digits"),
    fullName: z.string().optional(),
    emailAddress: z.string().nullable().optional(),
    panNo: panSchema.optional(),
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
    address: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    fatherName: z.string().nullable().optional(),
    fatherPhoneNumber: z.string().nullable().optional(),
    whatsappNo: z.string().nullable().optional(),
    pinCode: z
      .string()

      .min(6, "Pin code  must be 6 digits")
      .max(6, "Pin code  must be 6 digits")
      .optional(),
    profile: z.string().nullable().optional(),
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
    optional1: z.string().nullable().optional(),
    optional2: z.string().nullable().optional(),
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
const AddUser = () => {
  const [open, setOpen] = useState(false);
  const [reqID, setReqID] = useState("");
  const [userData, setUserData] = useState<any[]>([]);
  const [stateData, setStateData] = useState<any[]>([]);
  const [profile, setProfile] = useState("");
  const [showUser, setShowUser] = useState([]);
  const { currentStep, goToStep, goToNextStep, goToPrevStep, isActiveStep } =
    useStepCount(4);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    setValue,
    getValues,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });
  const userTypeValue = watch("userType");
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      if (data?.aadharNo) {
        data.aadharNo = data?.aadharNo.replace(/\s/g, "");
        data.profile = profile;
      }

      await addUser(data);
      reset(undefined, { keepErrors: false });
      navigate("/users/userlist");
    } catch (error: any) {
      setError("root", {
        message: error?.response?.data?.message,
      });
    }
  };
  console.log(userTypeValue);

  const isFormCompleted = (errors: any) => {
    return Object.values(errors).every((error) => !error);
  };

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const response = await getUser(userTypeValue);
        let stateData = await getState();
        const userData = response.users;
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
        }
        const formattedStates = stateData.states.map((state: any) => ({
          showvalue: state,
          value: state,
        }));
        setStateData([
          { showvalue: "Select State", value: undefined },
          ...formattedStates,
        ]);
        setUserData(_data);
        return userData;
      } catch (error) {
        toast.error("something went wrong!");
      }
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    refetch();
  }, [userTypeValue]);

  if (isLoading)
    return (
      <DefaultLayout isList>
        <Loader />
      </DefaultLayout>
    );
  if (error) {
    toast.error("something went wrong!");
  }

  async function valiadateOTP(code: string, reqID: String) {
    console.log("verifction code", code, reqID);
    try {
      const response = await validateOTP(code, reqID.toString());
      const address = generateAddress(response);
      setProfile(response.data.profile_image);
      const aadharData = {
        address: address,
        fullName: response.data.full_name,
        fatherName: response.data.care_of.split(":")[1],
        pinCode: response.data.zip,
        city: response.data.address.po,
        state: response.data.address.state,
        DOB: response.data.dob,
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
          setValue("dob", dayjs(aadharData.DOB));
        } else {
          setValue("ekycStatus", 0);
        }
        setOpen(false);
      }
    } catch (err: any) {
      toast.error(err?.message || err);
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
        setOpen(true);
      } else {
        setOpen(false);
        toast.error("Invalid Aadhar");
      }
    } catch (error) {
      setOpen(false);

      toast.error("Invalid Aadhar");
    }
  }

  const onChange = (e: string) => {
    const numericValue = e.replace(/\D/g, "");
    if (numericValue.length > 12) return;

    const formattedValue = numericValue.match(/.{1,4}/g)?.join(" ") || "";
    setValue("aadharNo", formattedValue);
  };

  return (
    <DefaultLayout isList={false}>
      <Breadcrumb pageName="Create User" />

      <div className="w-full flex flex-col sm:flex-row flex-grow overflow-hidden">
        <div className="sm:w-1/4 md:1/4 w-full flex-shrink flex-grow-0 p-4">
          <div className="sticky top-0 px-1 w-full">
            <ol className="relative text-gray-500 border-s border-gray-200 dark:border-gray-700 dark:text-gray-400">
              {profile && (
                <img src={`data:image/jpeg;base64,${profile}`} alt="Base64" />
              )}

              <StepItem
                title="Personal Information"
                description="Personal info of user."
                completed={
                  !error?.aadharNo ||
                  !error?.phoneNumber ||
                  !error?.fullName ||
                  !error?.dob ||
                  !error?.userType ||
                  !error?.address ||
                  !error?.state ||
                  !error?.city ||
                  !error?.pinCode
                }
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
            </ol>
          </div>
        </div>
        <main role="main" className="w-full h-full flex-grow p-3 overflow-auto">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentStep === 1 && (
                <>
                  <DropDown
                    label="Select UserType"
                    required={true}
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
                    placeholder="Select Sponsor"
                    options={[...userData]}
                    required={true}
                    error={errors.sponsorId?.message}
                    name="sponsorId"
                    controlProp={control}
                  />
                  <SearchDropDown
                    placeholder="Select Referral"
                    options={[...userData]}
                    error={errors.referralId?.message}
                    name="referralId"
                    controlProp={control}
                  />
                  <RHFInput
                    isModel={false}
                    controlProp={control}
                    required={true}
                    label="Mobile Number"
                    name="phoneNumber"
                    registerAction={{ ...register("phoneNumber") }}
                    placeholder="Enter Mobile Number"
                    error={errors.phoneNumber?.message}
                  />
                  <div className="flex items-center gap-2">
                    <div className="w-full">
                      <RHFInput
                        verificationFn={generateAadharOtpHandler}
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
                    </div>
                  </div>
                  <RHFInput
                    isModel={false}
                    controlProp={control}
                    label="PAN Number"
                    name="panNo"
                    registerAction={{ ...register("panNo") }}
                    placeholder="Enter PAN Number"
                    error={errors.panNo?.message}
                  />
                  <RHFInput
                    isModel={false}
                    controlProp={control}
                    label="Full Name"
                    name="fullName"
                    registerAction={{ ...register("fullName") }}
                    placeholder="Enter Full Name"
                    error={errors.fullName?.message}
                  />
                  <RHFInput
                    isModel={false}
                    controlProp={control}
                    label="Father's Name"
                    name="fatherName"
                    registerAction={{ ...register("fatherName") }}
                    placeholder="Enter Father's Name"
                    error={errors.fatherName?.message}
                  />
                  <DatePicker1
                    label="Date of Birth"
                    name="dob"
                    controlProp={control}
                    error={errors.dob?.message}
                  />

                  <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <RHFInput
                        isModel={false}
                        controlProp={control}
                        label="City"
                        name="city"
                        registerAction={{ ...register("city") }}
                        placeholder="Enter City"
                        error={errors.city?.message}
                      />
                    </div>
                    <div className="col-span-1">
                      <DropDown
                        label="Select State"
                        registerAction={{ ...register("state") }}
                        Options={stateData}
                        error={errors.state?.message}
                        name="state"
                        controlProp={control}
                      />
                    </div>
                    <div className="col-span-1">
                      <RHFInput
                        isModel={false}
                        controlProp={control}
                        label="Pin Code"
                        name="pinCode"
                        registerAction={{ ...register("pinCode") }}
                        placeholder="Enter Pin Code"
                        error={errors.pinCode?.message}
                      />
                    </div>
                  </div>
                  <div className="md:col-span-3">
                    <RHFInput
                      isModel={false}
                      controlProp={control}
                      label="Address"
                      name="address"
                      registerAction={{ ...register("address") }}
                      placeholder="Enter Address"
                      error={errors.address?.message}
                    />
                  </div>
                  <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-1 w-full">
                      <div className="w-full">
                        <RHFInput
                          isModel={false}
                          controlProp={control}
                          label="Email Address"
                          name="emailAddress"
                          registerAction={{ ...register("emailAddress") }}
                          placeholder="Enter Email Address"
                          error={errors.emailAddress?.message}
                        />
                      </div>
                    </div>

                    <RHFInput
                      isModel={false}
                      controlProp={control}
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
                    label="WhatsApp Number"
                    name="whatsappNo"
                    registerAction={{ ...register("whatsappNo") }}
                    placeholder="Enter WhatsApp Number"
                    error={errors.whatsappNo?.message}
                  />
                  <RHFInput
                    isModel={false}
                    controlProp={control}
                    label="Additional Field 1"
                    name="additional1"
                    registerAction={{ ...register("additional1") }}
                    placeholder="Enter Additional Field 1"
                    error={errors.additional1?.message}
                  />
                  <RHFInput
                    isModel={false}
                    controlProp={control}
                    label="Additional Field 2"
                    name="additional2"
                    registerAction={{ ...register("additional2") }}
                    placeholder="Enter Additional Field 2"
                    error={errors.additional2?.message}
                  />
                  <RHFInput
                    isModel={false}
                    controlProp={control}
                    label="Additional Field 3"
                    name="additional3"
                    registerAction={{ ...register("additional3") }}
                    placeholder="Enter Additional Field 3"
                    error={errors.additional3?.message}
                  />
                </>
              )}

              {currentStep === 2 && (
                <>
                  <RHFInput
                    isModel={false}
                    controlProp={control}
                    label="Business Nature"
                    name="businessNature"
                    registerAction={{ ...register("businessNature") }}
                    placeholder="Enter Business Nature"
                    error={errors.businessNature?.message}
                  />

                  <RHFInput
                    isModel={false}
                    controlProp={control}
                    label="Near Bank"
                    name="nearBank"
                    registerAction={{ ...register("nearBank") }}
                    placeholder="Enter Near Bank"
                    error={errors.nearBank?.message}
                  />

                  <RHFInput
                    isModel={false}
                    controlProp={control}
                    label="Business Type"
                    name="businessType"
                    registerAction={{ ...register("businessType") }}
                    placeholder="Enter Business Type"
                    error={errors.businessType?.message}
                  />

                  <RHFInput
                    isModel={false}
                    controlProp={control}
                    label="Friend's Mobile"
                    name="friendMobile"
                    registerAction={{ ...register("friendMobile") }}
                    placeholder="Enter Friend's Mobile"
                    error={errors.friendMobile?.message}
                  />

                  <RHFInput
                    isModel={false}
                    controlProp={control}
                    label="GST Number"
                    name="gstNo"
                    registerAction={{ ...register("gstNo") }}
                    placeholder="Enter GST Number"
                    error={errors.gstNo?.message}
                  />

                  <RHFInput
                    isModel={false}
                    controlProp={control}
                    label="Aadhar Udyog"
                    name="adharUdyog"
                    registerAction={{ ...register("adharUdyog") }}
                    placeholder="Enter Aadhar Udyog"
                    error={errors.adharUdyog?.message}
                  />

                  <RHFInput
                    isModel={false}
                    controlProp={control}
                    label="Shop Ownership"
                    name="shopOwnership"
                    registerAction={{ ...register("shopOwnership") }}
                    placeholder="Enter Shop Ownership"
                    error={errors.shopOwnership?.message}
                  />

                  <RHFInput
                    isModel={false}
                    controlProp={control}
                    label="Optional Field 1"
                    name="optional1"
                    registerAction={{ ...register("optional1") }}
                    placeholder="Enter Optional Field 1"
                    error={errors.optional1?.message}
                  />

                  <RHFInput
                    isModel={false}
                    controlProp={control}
                    label="Optional Field 2"
                    name="optional2"
                    registerAction={{ ...register("optional2") }}
                    placeholder="Enter Optional Field 2"
                    error={errors.optional2?.message}
                  />

                  <RHFInput
                    isModel={false}
                    controlProp={control}
                    label="Optional Field 3"
                    name="optional3"
                    registerAction={{ ...register("optional3") }}
                    placeholder="Enter Optional Field 3"
                    error={errors.optional3?.message}
                  />

                  <RHFInput
                    isModel={false}
                    controlProp={control}
                    label="Optional Field 4"
                    name="optional4"
                    registerAction={{ ...register("optional4") }}
                    placeholder="Enter Optional Field 4"
                    error={errors.optional4?.message}
                  />

                  <RHFInput
                    isModel={false}
                    controlProp={control}
                    label="Optional Field 5"
                    name="optional5"
                    registerAction={{ ...register("optional5") }}
                    placeholder="Enter Optional Field 5"
                    error={errors.optional5?.message}
                  />

                  <RHFInput
                    isModel={false}
                    controlProp={control}
                    label="Optional Field 6"
                    name="optional6"
                    registerAction={{ ...register("optional6") }}
                    placeholder="Enter Optional Field 6"
                    error={errors.optional6?.message}
                  />

                  <RHFInput
                    isModel={false}
                    controlProp={control}
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
                    label="Bank Name"
                    name="bankName"
                    registerAction={{ ...register("bankName") }}
                    placeholder="Enter Bank Name"
                    error={errors.bankName?.message}
                  />

                  <RHFInput
                    isModel={false}
                    controlProp={control}
                    label="Bank Account Number"
                    name="bankAccount"
                    registerAction={{ ...register("bankAccount") }}
                    placeholder="Enter Bank Account Number"
                    error={errors.bankAccount?.message}
                  />

                  <RHFInput
                    isModel={false}
                    controlProp={control}
                    label="IFSC Code"
                    name="bankIfscCode"
                    registerAction={{ ...register("bankIfscCode") }}
                    placeholder="Enter IFSC Code"
                    error={errors.bankIfscCode?.message}
                  />
                </>
              )}
            </div>

            <div className="flex justify-between">
              <ButtonLabel
                type="submit"
                loader={isSubmitting}
                disabled={isSubmitting}
                label="Register"
              />
              {currentStep != 3 && (
                <button
                  onClick={() => goToNextStep()}
                  type="button"
                  className="relative inline-flex items-center justify-center p-4 px-9 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out border-2 border-purple-500 rounded-2xl shadow-md group"
                >
                  <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-buttonColor group-hover:translate-x-0 ease">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      ></path>
                    </svg>
                  </span>
                  <span className="absolute flex items-center justify-center w-full h-full text-purple-500 transition-all duration-300 transform group-hover:translate-x-full ease">
                    Next
                  </span>
                  <span className="relative invisible">Next</span>
                </button>
              )}
            </div>

            {errors.root && (
              <div className="text-red-500">{errors.root.message}</div>
            )}
          </form>
          <AuthModel
            open={open}
            validateOtp={valiadateOTP}
            reqID={reqID}
            setOpen={setOpen}
          />
        </main>
      </div>
    </DefaultLayout>
  );
};

export default AddUser;
