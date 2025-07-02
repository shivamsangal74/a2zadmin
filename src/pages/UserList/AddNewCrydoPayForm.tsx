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
import { useQuery } from "@tanstack/react-query";
import { getUser, getUsers } from "../../Services/Axios/UserService";
import { toast } from "react-toastify";
interface CreateCrydoDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: UserForm) => void;
}

export interface UserForm {
  userid: string;
  tid: string;
  cpId: string;
  login_id: string;
  password: string;
  merchant_cpId: string;
  mobile: string;
  terminal_status: string;
}

const initialForm: UserForm = {
  userid: "",
  tid: "",
  cpId: "",
  login_id: "",
  password: "",
  merchant_cpId: "",
  mobile: "",
  terminal_status: "Active",
};

const CreateCrydoDialogProps: React.FC<CreateCrydoDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<UserForm>(initialForm);
  const [userData, setUserData] = useState<any[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof UserForm, string>>>(
    {}
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const response = await getUsers();
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
        setUserData(_data);
        return userData;
      } catch (error) {
        toast.error("something went wrong!");
      }
    },
    refetchOnWindowFocus: false,
  });

  const validate = (): typeof errors => {
    const errs: typeof errors = {};
    if (!form.userid) errs.userid = "User ID is required";
    if (!form.tid) errs.tid = "TID is required";
    if (!form.cpId) errs.cpId = "CP ID is required";
    if (!form.login_id) errs.login_id = "Login ID is required";
    if (!form.password) errs.password = "Password is required";
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
      <DialogTitle>Create New Onboarding</DialogTitle>
      <DialogContent>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Userid"
            fullWidth
            name="userid"
            value={form.userid}
            onChange={handleChange}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  style: {
                    maxHeight: 200, // Limit the height for scrolling
                  },
                },
              },
            }}
          >
            {userData.map((user) => (
              <MenuItem key={user.value} value={user.value}>
                {user.showvalue}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid container spacing={2} mt={1}>
          {[
            { label: "TID", name: "tid" },
            { label: "CP ID", name: "cpId" },
            { label: "Login ID", name: "login_id" },
            { label: "Password", name: "password", type: "password" },
            { label: "Merchant CP ID", name: "merchant_cpId" },
            { label: "Mobile", name: "mobile", type: "tel" },
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
              label="status"
              fullWidth
              name="terminal_status"
              value={form.terminal_status}
              onChange={handleChange}
            >
              <MenuItem value="activated">activated</MenuItem>
              <MenuItem value="deactivated">deactivated</MenuItem>
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

export default CreateCrydoDialogProps;
