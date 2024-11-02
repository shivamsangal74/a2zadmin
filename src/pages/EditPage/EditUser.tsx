import React, { useEffect, useState } from "react";
import AddUserEdit from "../AddUser/AddUserEdit";
import {
  getUserInfoByNumber,
  getUserWithId,
} from "../../Services/Axios/UserService";
import Loader from "../../components/Loader/Loader";
import TextInput from "../../components/Input/TextInput";
import { ButtonLabel } from "../../components/Button/Button";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";

type EditUserProps = {
  userid: string;
  setOpen: (value: boolean) => void;
};

const EditUser: React.FC<EditUserProps> = ({ userid, setOpen }) => {
  const [userId, setUserId] = useState(userid);
  const [userNumber, setUserNumber] = useState("");
  const [edit, setEdit] = useState(true);
  const [userData, SetUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  console.log(userid);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserWithId(userid);
        const user = response.user;
        SetUserData(user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userid]);

  const handleNumberSearch = async () => {
    if (!userNumber) {
      toast.error(`Please enter user's mobile number`);
      return;
    }
    setIsLoading(true);
    try {
      SetUserData(null);
      const response = await getUserInfoByNumber(userNumber);
      SetUserData(response.user);
      setUserId(response.user.userUniqueId);
    } catch (error) {
      toast.error(`Something went wrong.`);
      console.error("Error fetching user data:", error);
      setIsLoading(false);
      setOpen(false);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      {userData ? (
        <div>
          <div
            id="default-modal"
            tabIndex={-1}
            aria-hidden="true"
            className="fixed top-0 left-0 w-full h-full bg-black-900 bg-opacity-50 overflow-y-auto z-999 overflow-x-hidden absolute top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
          >
            <div className="relative p-5 w-full max-h-full">
              <div className="absolute top-8 right-20 left-20 bg-white rounded-lg shadow dark:bg-gray-700">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {!edit ? "Edit User" : "View User"}
                    </h3>
                    <h3 className="text-2xs font-semibold text-gray-900">
                      Wallet Balance : {userData.wallet}
                    </h3>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex gap-2">
                      <TextInput
                        name={"mobile"}
                        placeholder="Enter user mobile number."
                        label="Search"
                        onChange={setUserNumber}
                        isModel={true}
                      />
                      <ButtonLabel
                        loader={isLoading}
                        disabled={isLoading}
                        label="Search"
                        onClick={handleNumberSearch}
                      />
                    </div>
                    {edit ? (
                      <ButtonLabel
                        onClick={() => setEdit(false)}
                        type="button"
                        Icon={<CiEdit fontSize={18} />}
                        label="Edit"
                        veriant={"outline"}
                      />
                    ) : (
                      <button
                        onClick={() => setOpen(false)}
                        type="button"
                        className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-2.5 text-center  dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                        data-modal-hide="default-modal"
                      >
                        <div className="flex gap-2 items-center">
                          <span>
                            <IoClose fontSize={18} />
                          </span>
                          Close
                          <span className="sr-only">Close</span>
                        </div>
                      </button>
                    )}
                  </div>
                </div>

                {userData && (
                  <AddUserEdit
                    userid={userId}
                    userInfo={userData}
                    edit={edit}
                    setOpen={setOpen}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default EditUser;
