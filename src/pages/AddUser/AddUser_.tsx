import DefaultLayout from "../../layout/DefaultLayout";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import TextInput from "../../components/Input/TextInput";
import StepItem from "../../components/StepItem/StepItem";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useStepCount from "../../hooks/UseStepCount";
import { FaAddressCard } from "react-icons/fa6";
import { HiMiniAcademicCap } from "react-icons/hi2";
import { CiBank } from "react-icons/ci";
import AuthModel from "../../Auth/AuthModel";
import { useEffect, useState } from "react";
import { addUser, getUser } from "../../Services/Axios/UserService";
import { ButtonLabel } from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import DatePicker1 from "../../components/DatePicker/DatePickerOne";
import DropDown from "../../components/DropDown/DropDown";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../common/Loader";
import { ArrowRightIcon } from "@mui/x-date-pickers/icons";
import { toast } from "react-toastify";
import { getState } from "../../Services/commonService";
import { MdVerified } from "react-icons/md";
import { generateAddress, validateAadhar } from "../../Utills/Utility";
import { generateOTP, validateOTP } from "../../Services/AuthServices";
import dayjs from "dayjs";
import SearchDropdown from "../../components/DropDown/Select";
import { SearchDropDown } from "../../components/DropDown/SearchDropDown";

const schema = z.object({
  aadharNo: z
    .string()
    .nonempty("Aadhar number cannot be empty")
    .min(12, "Aadhar number must be 12 digits")
    .max(12, "Aadhar number must be 12 digits"),
  phoneNumber: z.string().nonempty("Phone number cannot be empty"),
  fullName: z.string().nonempty("Full name cannot be empty"),
  emailAddress: z
    .string()
    .nonempty("Email address cannot be empty")
    .email("Invalid email address"),
  panNo: z
    .string()
    .nonempty("PAN number cannot be empty")
    .min(10, "PAN number must be 10 characters")
    .max(10, "PAN number must be 10 characters"),
  dob: z.coerce
    .date()
    .min(new Date(1920, 0, 1), {
      message: "Date cannot go past January 1 1920",
    })
    .max(new Date(), { message: "Date must be in the past" }),
  password: z.string().nonempty("Password cannot be empty"),
  ekycStatus: z.number().nullable().optional(),
  userType: z.string().nullable().optional(),
  sponsorId: z.string().nullable().optional(),
  address: z.string().nonempty("Address cannot be empty"),
  state: z.string().nonempty("State cannot be empty"),
  city: z.string().nullable().optional(),
  fatherName: z.string().nullable().optional(),
  fatherPhoneNumber: z.string().nullable().optional(),
  whatsappNo: z.string().nullable().optional(),
  pinCode: z.string().nonempty("Pin code cannot be empty"),
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
  bankName: z.string().nonempty("Bank name cannot be empty"),
  bankAccount: z.string().nonempty("Bank account number cannot be empty"),
  bankIfscCode: z.string().nonempty("IFSC code cannot be empty"),
  lienAmount: z.number().nullable().optional(),
  cappingAmount: z.number().nullable().optional(),
  autoRefill: z.boolean().nullable().optional(),
  creditLimit: z.number().nullable().optional(),
  instantAutoCredit: z.boolean().nullable().optional(),
  minBalanceAlert: z.number().nullable().optional(),
  minBalanceAutoRefill: z.number().nullable().optional(),
});

type FormFields = z.infer<typeof schema>;
const AddUser = () => {
  const [open, setOpen] = useState(false);
  const [reqID, setReqID] = useState("");
  const [aadharData, setAadharData] = useState<any[]>([]);
  const [userData, setUserData] = useState<any[]>([]);
  const [stateData, setStateData] = useState<any[]>([]);
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
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await addUser(data);
      reset(undefined, { keepErrors: false });
      navigate("/users/userlist");
    } catch (error) {
      setError("root", {
        message: "Something went wrong ! Try Again",
      });
    }
  };

  const isFormCompleted = (errors: any) => {
    return Object.values(errors).every((error) => !error);
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const response = await getUser();
        let stateData = await getState();
        const userData = response.users;
        let _data: any[] = [];
        if (userData.length > 0) {
          userData.forEach((user: any) => {
            _data.push({
              showvalue: user?.fullName,
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

  if (isLoading) return <Loader />;
  if (error) {
    toast.error("something went wrong!");
  }

  async function valiadateOTP(code: string, reqID: String) {
    console.log("verifction code", code, reqID);
    try {
      const response = await validateOTP(code, reqID.toString());

      const address = generateAddress(response);

      const aadharData = {
        address: address,
        aadharNo: response.data.aadhaar_number,
        fullName: response.data.full_name,
        pinCode: response.data.zip,
        city: response.data.address.po,
        state: response.data.address.state,
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
        } else {
          setValue("ekycStatus", 0);
        }
        setOpen(false);
      }
    } catch (err: any) {
      toast.error(err?.message);
      throw new Error(err);
    }
  }

  async function generateAadharOtpHandler() {
    const aadhar = getValues("aadharNo");
    if (!aadhar) {
      toast.error("Enter aadhar number please.");
      return;
    }

    try {
      if (validateAadhar(aadhar)) {
        const response = await generateOTP(aadhar);
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

  return (
    <DefaultLayout isList={false}>
      <Breadcrumb pageName="Create User" />

      <div className="w-full flex flex-col sm:flex-row flex-grow overflow-hidden">
        <div className="sm:w-1/4 md:1/4 w-full flex-shrink flex-grow-0 p-4">
          <div className="sticky top-0 px-1 w-full">
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
                    options={[
                      { showvalue: "admin", value: "admin" },
                      ...userData,
                    ]}
                    error={errors.sponsorId?.message}
                    name="sponsorId"
                    controlProp={control}
                  />

                  {/* <DropDown
                    label="Select Sponsor"
                    registerAction={{ ...register("sponsorId") }}
                    Options={[
                      { showvalue: "Select Sponsor", value: undefined },
                      { showvalue: "admin", value: "admin" },
                      ...userData,
                    ]}
                    error={errors.sponsorId?.message}
                    name="sponsorId"
                    controlProp={control}
                  /> */}

                  <div className="flex items-center gap-2">
                    <div className="w-full">
                      <TextInput
                        isModel={false}
                        label="Aadhar Number"
                        name="aadharNo"
                        registerAction={{ ...register("aadharNo") }}
                        placeholder="Enter Aadhar Number"
                        error={errors.aadharNo?.message}
                      />
                    </div>
                    <div className="">
                      <MdVerified
                        fontSize={24}
                        onClick={generateAadharOtpHandler}
                      />
                    </div>
                  </div>

                  <TextInput
                    isModel={false}
                    label="Mobile Number"
                    name="phoneNumber"
                    registerAction={{ ...register("phoneNumber") }}
                    placeholder="Enter Mobile Number"
                    error={errors.phoneNumber?.message}
                  />
                  <TextInput
                    isModel={false}
                    label="Full Name"
                    name="fullName"
                    registerAction={{ ...register("fullName") }}
                    placeholder="Enter Full Name"
                    error={errors.fullName?.message}
                  />
                  <TextInput
                    isModel={false}
                    label="Email Address"
                    name="emailAddress"
                    registerAction={{ ...register("emailAddress") }}
                    placeholder="Enter Email Address"
                    error={errors.emailAddress?.message}
                  />

                  <TextInput
                    isModel={false}
                    label="PAN Number"
                    name="panNo"
                    registerAction={{ ...register("panNo") }}
                    placeholder="Enter PAN Number"
                    error={errors.panNo?.message}
                  />

                  <DatePicker1
                    label="Date of Birth"
                    name="dob"
                    controlProp={control}
                    error={errors.dob?.message}
                  />

                  <TextInput
                    isModel={false}
                    label="Password"
                    name="password"
                    registerAction={{ ...register("password") }}
                    placeholder="Enter Password"
                    error={errors.password?.message}
                  />

                  <TextInput
                    isModel={false}
                    label="Address"
                    name="address"
                    registerAction={{ ...register("address") }}
                    placeholder="Enter Address"
                    error={errors.address?.message}
                  />

                  <DropDown
                    label="Select State"
                    registerAction={{ ...register("state") }}
                    Options={stateData}
                    error={errors.state?.message}
                    name="state"
                    controlProp={control}
                  />

                  {/* <TextInput
                    isModel={false}
                    label="State"
                    name="state"
                    registerAction={{ ...register("state") }}
                    placeholder="Enter State"
                    error={errors.state?.message}
                  /> */}

                  <TextInput
                    isModel={false}
                    label="City"
                    name="city"
                    registerAction={{ ...register("city") }}
                    placeholder="Enter City"
                    error={errors.city?.message}
                  />

                  <TextInput
                    isModel={false}
                    label="Father's Name"
                    name="fatherName"
                    registerAction={{ ...register("fatherName") }}
                    placeholder="Enter Father's Name"
                    error={errors.fatherName?.message}
                  />

                  <TextInput
                    isModel={false}
                    label="Father's Phone Number"
                    name="fatherPhoneNumber"
                    registerAction={{ ...register("fatherPhoneNumber") }}
                    placeholder="Enter Father's Phone Number"
                    error={errors.fatherPhoneNumber?.message}
                  />

                  <TextInput
                    isModel={false}
                    label="WhatsApp Number"
                    name="whatsappNo"
                    registerAction={{ ...register("whatsappNo") }}
                    placeholder="Enter WhatsApp Number"
                    error={errors.whatsappNo?.message}
                  />

                  <TextInput
                    isModel={false}
                    label="Pin Code"
                    name="pinCode"
                    registerAction={{ ...register("pinCode") }}
                    placeholder="Enter Pin Code"
                    error={errors.pinCode?.message}
                  />

                  <TextInput
                    isModel={false}
                    label="Additional Field 1"
                    name="additional1"
                    registerAction={{ ...register("additional1") }}
                    placeholder="Enter Additional Field 1"
                    error={errors.additional1?.message}
                  />

                  <TextInput
                    isModel={false}
                    label="Additional Field 2"
                    name="additional2"
                    registerAction={{ ...register("additional2") }}
                    placeholder="Enter Additional Field 2"
                    error={errors.additional2?.message}
                  />

                  <TextInput
                    isModel={false}
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
                  <TextInput
                    isModel={false}
                    label="Business Nature"
                    name="businessNature"
                    registerAction={{ ...register("businessNature") }}
                    placeholder="Enter Business Nature"
                    error={errors.businessNature?.message}
                  />

                  <TextInput
                    isModel={false}
                    label="Near Bank"
                    name="nearBank"
                    registerAction={{ ...register("nearBank") }}
                    placeholder="Enter Near Bank"
                    error={errors.nearBank?.message}
                  />

                  <TextInput
                    isModel={false}
                    label="Business Type"
                    name="businessType"
                    registerAction={{ ...register("businessType") }}
                    placeholder="Enter Business Type"
                    error={errors.businessType?.message}
                  />

                  <TextInput
                    isModel={false}
                    label="Friend's Mobile"
                    name="friendMobile"
                    registerAction={{ ...register("friendMobile") }}
                    placeholder="Enter Friend's Mobile"
                    error={errors.friendMobile?.message}
                  />

                  <TextInput
                    isModel={false}
                    label="GST Number"
                    name="gstNo"
                    registerAction={{ ...register("gstNo") }}
                    placeholder="Enter GST Number"
                    error={errors.gstNo?.message}
                  />

                  <TextInput
                    isModel={false}
                    label="Aadhar Udyog"
                    name="adharUdyog"
                    registerAction={{ ...register("adharUdyog") }}
                    placeholder="Enter Aadhar Udyog"
                    error={errors.adharUdyog?.message}
                  />

                  <TextInput
                    isModel={false}
                    label="Shop Ownership"
                    name="shopOwnership"
                    registerAction={{ ...register("shopOwnership") }}
                    placeholder="Enter Shop Ownership"
                    error={errors.shopOwnership?.message}
                  />

                  <TextInput
                    isModel={false}
                    label="Optional Field 1"
                    name="optional1"
                    registerAction={{ ...register("optional1") }}
                    placeholder="Enter Optional Field 1"
                    error={errors.optional1?.message}
                  />

                  <TextInput
                    isModel={false}
                    label="Optional Field 2"
                    name="optional2"
                    registerAction={{ ...register("optional2") }}
                    placeholder="Enter Optional Field 2"
                    error={errors.optional2?.message}
                  />

                  <TextInput
                    isModel={false}
                    label="Optional Field 3"
                    name="optional3"
                    registerAction={{ ...register("optional3") }}
                    placeholder="Enter Optional Field 3"
                    error={errors.optional3?.message}
                  />

                  <TextInput
                    isModel={false}
                    label="Optional Field 4"
                    name="optional4"
                    registerAction={{ ...register("optional4") }}
                    placeholder="Enter Optional Field 4"
                    error={errors.optional4?.message}
                  />

                  <TextInput
                    isModel={false}
                    label="Self Video"
                    name="selfVideo"
                    registerAction={{ ...register("selfVideo") }}
                    placeholder="Enter Self Video"
                    error={errors.selfVideo?.message}
                  />

                  <TextInput
                    isModel={false}
                    label="Document Video"
                    name="documentVideo"
                    registerAction={{ ...register("documentVideo") }}
                    placeholder="Enter Document Video"
                    error={errors.documentVideo?.message}
                  />

                  <TextInput
                    isModel={false}
                    label="Shop Photo Front"
                    name="shopPhotoFront"
                    registerAction={{ ...register("shopPhotoFront") }}
                    placeholder="Enter Shop Photo Front"
                    error={errors.shopPhotoFront?.message}
                  />

                  <TextInput
                    isModel={false}
                    label="Shop Photo Inside"
                    name="shopPhotoInside"
                    registerAction={{ ...register("shopPhotoInside") }}
                    placeholder="Enter Shop Photo Inside"
                    error={errors.shopPhotoInside?.message}
                  />

                  <TextInput
                    isModel={false}
                    label="Optional Field 5"
                    name="optional5"
                    registerAction={{ ...register("optional5") }}
                    placeholder="Enter Optional Field 5"
                    error={errors.optional5?.message}
                  />

                  <TextInput
                    isModel={false}
                    label="Optional Field 6"
                    name="optional6"
                    registerAction={{ ...register("optional6") }}
                    placeholder="Enter Optional Field 6"
                    error={errors.optional6?.message}
                  />

                  <TextInput
                    isModel={false}
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
                  <TextInput
                    isModel={false}
                    label="Bank Name"
                    name="bankName"
                    registerAction={{ ...register("bankName") }}
                    placeholder="Enter Bank Name"
                    error={errors.bankName?.message}
                  />

                  <TextInput
                    isModel={false}
                    label="Bank Account Number"
                    name="bankAccount"
                    registerAction={{ ...register("bankAccount") }}
                    placeholder="Enter Bank Account Number"
                    error={errors.bankAccount?.message}
                  />

                  <TextInput
                    isModel={false}
                    label="IFSC Code"
                    name="bankIfscCode"
                    registerAction={{ ...register("bankIfscCode") }}
                    placeholder="Enter IFSC Code"
                    error={errors.bankIfscCode?.message}
                  />
                </>
              )}
            </div>

            {currentStep == 3 ? (
              <ButtonLabel
                onClick={() => {}}
                type="submit"
                loader={isSubmitting}
                disabled={isSubmitting}
                label="Submit"
              />
            ) : (
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
