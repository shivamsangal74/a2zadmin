import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Switch,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import DefaultLayout from "../../layout/DefaultLayout";
import { ButtonLabel } from "../../components/Button/Button";
import { toast } from "react-toastify";
import api from "../../Services/Axios/api";
import { useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
const permissionPages = [
  {
    category: "dashboard",
    pages: ["dashboard"],
  },
  {
    category: "users",
    pages: ["createUser", "userList", "editUser", "deleteUser"],
  },
  {
    category: "manage",
    pages: [
      "category",
      "operators",
      "funds",
      "fundTransfer",
      "commission",
      "api",
      "createApi",
      "smsTemplates",
      "bank",
      "adminBank",
      "bankMode",
      "fundRequest",
      "userSettlement",
      "createRoles",
    ],
  },
  {
    category: "reports",
    pages: [
      "ledger",
      "partyDue",
      "virtualBalanceReport",
      "lappuStatusReport",
      "rechargeReport",
      "moneyReport",
      "mabReport",
      "userInactiveReport",
      "businessReport",
      "upiHistoryReport",
      "apesReport",
      "settlementReport",
    ],
  },
  {
    category: "vendor",
    pages: ["addVendor"],
  },
  {
    category: "filter",
    pages: ["amountFilter", "circleRofferFilter", "userWiseFilter"],
  },
  {
    category: "service",
    pages: ["service", "riskManage"],
  },
  {
    category: "supportTickets",
    pages: ["supportTickets"],
  },
];

const UserPermissions = () => {
  const [permissions, setPermissions] = useState<
    Record<string, Record<string, boolean>>
  >(() =>
    permissionPages.reduce(
      (acc, category) => {
        acc[category.category] = category.pages.reduce(
          (accPages, page) => {
            accPages[page] = false; // Initialize all permissions as false (off)
            return accPages;
          },
          {} as Record<string, boolean>
        );
        return acc;
      },
      {} as Record<string, Record<string, boolean>>
    )
  );
  const navigate = useNavigate();

  const [roleName,setRoleName] = useState('')

  const handlePermissionToggle = (category: string, page: string) => {
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [category]: {
        ...prevPermissions[category],
        [page]: !prevPermissions[category][page],
      },
    }));
  };
  const savePermissions = async() => {
    if(!roleName) return toast.error("Role name is required");
    if(!permissions) return toast.error("Permissions is required");

   try {
    await api.post('/permissions/create-role',{
        roleName: roleName,
        permissions: permissions
    })
    toast.success("Role created successfully.");
   } catch (error:any) {
    toast.error(error.response.data.message);
   }
  };
  return (
    <DefaultLayout isList={false}>
         <div className="d-flex justify-content-between mb-4">
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate("/manage/roles")}
          >
            Back
          </Button>
        </div>
    <div className="w-100 mb-5">
        <TextField name="Role Name" size="small" fullWidth label="Role Name" onChange={(e)=> setRoleName(e.target.value)} value={roleName}/>
    </div>
      {permissionPages.map((section, index) => (
        <Accordion key={index}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index}-content`}
            id={`panel${index}-header`}
          >
            <Typography>{section.category}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {section.pages.map((page, pageIndex) => (
              <FormControlLabel
                key={pageIndex}
                control={
                  <Switch
                    checked={permissions[section.category][page]}
                    onChange={() =>
                      handlePermissionToggle(section.category, page)
                    }
                  />
                }
                label={page}
              />
            ))}
          </AccordionDetails>
        </Accordion>
      ))}

      <ButtonLabel
        type="submit"
        onClick={savePermissions}
        loader={false}
        disabled={false}
        label="Create Role"
        style={{marginTop: '15px'}}
      />
    </DefaultLayout>
  );
};

export default UserPermissions;
