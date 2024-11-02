import React from 'react';
import BasicTable from '../../components/BasicTable/BasicTable';
import { ButtonLabel } from '../../components/Button/Button';
import { BsPlusLg } from 'react-icons/bs';
import DefaultLayout from '../../layout/DefaultLayout';
import { Button, Tooltip } from 'antd';
import { Edit } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import api from '../../Services/Axios/api';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader/Loader';
import { useNavigate } from 'react-router-dom'; // Ensure you import this
import { AxiosError } from 'axios';
const Permissions = () => {
  const navigate = useNavigate(); // Initialize navigate function

  const columns = [
    {
      header: "ID",
      accessorKey: "id",
    },
    {
      header: "Role Name",
      accessorKey: "roleName",
    },
    {
      header: "Action",
      cell: (row: any) => (
        <div className="flex gap-1 items-center justify-center">
          <Tooltip title="Edit">
            <div >
              <Edit onClick={()=> navigate(`/manage/edit-role/${row.row.original.id}`, { state: row.row.original.permissions })}  />
            </div>
          </Tooltip>
        </div>
      ),
    },
  ];

  const { isLoading, data, error } = useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      try {
        const response = await api.get('/permissions/getroles');
        return response.data.Roles || []; // Correctly access the data
      } catch (error: any) {
        toast.error(error.message || 'An error occurred while fetching roles.');
        throw error; // Rethrow to handle the error in React Query
      }
    },
    refetchOnWindowFocus: true,
  });

  if (isLoading) return <Loader />; // Loader displayed when loading

  return (
    <div>
      <DefaultLayout isList={true}>
        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 py-2">
          <div className="w-full md:w-1/2"></div>
          <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
            <ButtonLabel
              onClick={() => navigate("/manage/create-role")}
              label="Create New Role"
              Icon={<BsPlusLg fontSize={16} />}
            />
          </div>
        </div>

        {data && data.length > 0 ? (
          <BasicTable
            data={data}
            columns={columns}
            filter={[]}
          />
        ) : (
          <p>No Records Found</p>
        )}
      </DefaultLayout>
    </div>
  );
};

export default Permissions;
