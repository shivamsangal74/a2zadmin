import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
} from "@mui/material";
import { SearchDropDown } from "../../components/DropDown/SearchDropDown";
import { toast } from "react-toastify";
import api from "../../Services/Axios/api";
import { useQuery } from "@tanstack/react-query";
import { DropSearch } from "../../components/DropDown/DropSearch";

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: UserForm) => void;
}

export interface UserForm {
  userId: string;
  name: string;
  mobile: string;
  aadhar: string;
  pan: string;
  email: string;
  address: string;
  outletId: string;
  latitude: string;
  longitude: string;
  status: string;
  type: "instantpay" | "paysprintBank2" | "paysprintBank3";
  reg_date: string;
  hash: string;
}

const initialForm: UserForm = {
  userId: "",
  name: "",
  mobile: "",
  aadhar: "",
  pan: "",
  email: "",
  address: "",
  outletId: "",
  latitude: "",
  longitude: "",
  status: "Active",
  type: "instantpay",
  reg_date: "",
  hash: "",
};

const CreateUserDialog: React.FC<CreateUserDialogProps> = ({ open, onClose, onSubmit }) => {
  const [form, setForm] = useState<UserForm>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof UserForm, string>>>({});
  const [users , setUsers] = useState<any[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = (): typeof errors => {
    const errs: typeof errors = {};
    if (!form.userId) errs.userId = "User ID is required";
    if (!form.name) errs.name = "Name is required";
    if (!/^\d{10}$/.test(form.mobile)) errs.mobile = "Invalid mobile number";
    if (!/^\d{12}$/.test(form.aadhar)) errs.aadhar = "Aadhar must be 12 digits";
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(form.pan)) errs.pan = "Invalid PAN";
    if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
    if (!form.address) errs.address = "Address is required";
    if (!form.outletId) errs.outletId = "Outlet ID is required";
    if (!form.latitude) errs.latitude = "Latitude is required";
    if (!form.longitude) errs.longitude = "Longitude is required";
    if (!form.reg_date) errs.reg_date = "Registration date is required";
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit(form);
    setForm(initialForm);
    setErrors({});
    onClose();
  };

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        debugger
        const response = await api.get("/users/");
        const userData = response.data.users;
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
        setUsers(userData)
        return _data;
      } catch (error) {
        toast.error("something went wrong!");
      }
    },
    refetchOnWindowFocus: false,
  });


  const handleChangeUsers = (e: React.ChangeEvent<HTMLInputElement>) => {
    debugger
    let name = "userId"
    setForm((prev) => ({ ...prev, [name]: e }));
    const selectedUser = users.find(user => user.userUniqueId === e);
    if (selectedUser) {
      setForm((prev) => ({
        ...prev,
        name: selectedUser.fullName || "",
        mobile: selectedUser.phoneNumber || "",
        aadhar: selectedUser.aadharNo || "",
        pan: selectedUser.panNo || "",
        email: selectedUser.emailAddress || "",
        address: selectedUser.address || "",
        outletId: selectedUser.outletId || "",
        latitude: selectedUser.latitude || "",
        longitude: selectedUser.longitude || "",
        reg_date: new Date().toISOString().split("T")[0], // Set current date as default
      }));
    } else {
      setForm(initialForm);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New User</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={1}>

        <Grid item xs={12} sm={6}>
        <DropSearch
                    placeholder="Select User"
                    options={data || []}
                    required={true}
                    value={form.userId}
                    error={Boolean(errors["userId" as keyof UserForm])}
                helperText={errors["userId" as keyof UserForm]}
                    name="userId"
                    onchange={handleChangeUsers}
                    
                  />
            </Grid>

          {[
            { label: "Name", name: "name" },
            { label: "Mobile", name: "mobile", type: "tel" },
            { label: "Aadhar", name: "aadhar", type: "number" },
            { label: "PAN", name: "pan" },
            { label: "Email", name: "email", type: "email" },
            { label: "Address", name: "address" },
            { label: "Outlet ID", name: "outletId" },
            { label: "Latitude", name: "latitude" },
            { label: "Longitude", name: "longitude" },
            { label: "Hash", name: "hash" },
            { label: "Registration Date", name: "reg_date", type: "date" },
          ].map((field) => (
            <Grid item xs={12} sm={6} key={field.name}>
              <TextField
                fullWidth
                type={field.type || "text"}
                size="small"
                label={field.label}
                name={field.name}
                value={(form as any)[field.name]}
                onChange={handleChange}
                error={Boolean(errors[field.name as keyof UserForm])}
                helperText={errors[field.name as keyof UserForm]}
                InputLabelProps={field.type === "date" ? { shrink: true } : {}}
              />
            </Grid>
          ))}

          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Status"
              fullWidth
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Type"
              fullWidth
              name="type"
              value={form.type}
              onChange={handleChange}
            >
              <MenuItem value="instantpay">instantpay</MenuItem>
              <MenuItem value="paysprintBank2">paysprintBank2</MenuItem>
              <MenuItem value="paysprintBank3">paysprintBank3</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Create User
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateUserDialog;
