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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New User</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={1}>
          {[
            { label: "User ID", name: "userId" },
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
