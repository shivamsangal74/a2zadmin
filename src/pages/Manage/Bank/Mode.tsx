import { useQuery } from "@tanstack/react-query";
import DefaultLayout from "../../../layout/DefaultLayout";
import { getModes, saveMode } from "../../../Services/commonService";
import { useState } from "react";
import Loader from "../../../components/Loader/Loader";
import { toast } from "react-toastify";
import BasicTable from "../../../components/BasicTable/BasicTable";
import Popup from "../../../components/Model/Model";
import { ButtonLabel } from "../../../components/Button/Button";
import TextInput from "../../../components/Input/TextInput";

const Mode = () => {
  const [Loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [modeName, setModeName] = useState("");

  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);
  const columns = [
    {
      header: "Id",
      accessorKey: "id",
    },
    {
      header: "Name",
      accessorKey: "modeName",
    },
  ];

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["modes"],
    queryFn: async () => {
      try {
        const response = await getModes();

        return response;
      } catch (error) {
        throw error;
      }
    },
    refetchOnWindowFocus: false,
  });
  if (isLoading) return <Loader />;
  if (error) return toast.error("Unable to fetch modes.");

  async function handleDeleteCategory(id: string) {
    try {
      setLoading(true);
      console.log(id);
      refetch();
      toast.success("Mode Successfully deleted.");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong!");
    }
  }

  const handleOpenAdd = async () => {
    try {
      openPopup();
    } catch (error) {
      toast.error("something went wrong!");
    }
  };

  async function handleEditBank() {
    setLoading(true);

    try {
      await saveMode({
        modeName,
      });
      toast.success("Mode addeded successfully.");
      refetch();
      closePopup();
      reset();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong.");
    }
  }

  async function reset() {
    setModeName("");
  }
  return (
    <DefaultLayout isList={true}>
      <ButtonLabel label="Add Mode" onClick={handleOpenAdd} />
      {data && (
        <BasicTable data={data} columns={columns} actions={""} filter={[]} />
      )}

      <Popup title={"Bank"} isOpen={isOpen} onClose={closePopup}>
        <div className="flex flex-col gap-3">
          <TextInput
            label="ModeName"
            placeholder="Enter Mode name"
            onChange={setModeName}
            value={modeName}
          />
        </div>

        <div className="flex justify-between mt-10">
          <ButtonLabel onClick={handleEditBank} label="Save Mode" />

          <ButtonLabel
            style={{ backgroundColor: "red" }}
            onClick={closePopup}
            label="Close"
          />
        </div>
      </Popup>
    </DefaultLayout>
  );
};

export default Mode;
