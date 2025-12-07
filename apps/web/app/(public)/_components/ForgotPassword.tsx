import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/apiClient";
import { Typography } from "@mui/material";
import {
  RequestPasswordResetInput,
  requestPasswordResetSchema,
} from "@repo/shared";

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

export default function ForgotPassword({
  open,
  handleClose,
}: ForgotPasswordProps) {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState("");

  const { register, handleSubmit, formState, setError, reset } =
    useForm<RequestPasswordResetInput>({
      resolver: zodResolver(requestPasswordResetSchema),
    });

  const onSubmit = async (data: RequestPasswordResetInput) => {
    setLoading(true);

    try {
      const res = await api.post("/auth/request-password-reset", data);

      setLoading(false);

      setSuccess(res.data.message);

      // Close after delay
      setTimeout(() => {
        reset();
        handleClose();
      }, 10000);
    } catch (err) {
      setLoading(false);
      console.error(err);

      setError("root", {
        message: "If an account exists, a reset link will be sent.",
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        reset();
        handleClose();
      }}
      slotProps={{
        paper: {
          component: "form",
          onSubmit: handleSubmit(onSubmit),
          sx: { backgroundImage: "none" },
        },
      }}
    >
      <DialogTitle>Reset password</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
      >
        <DialogContentText>
          Enter your account&apos;s email address, and we&apos;ll send you a
          link to reset your password.
        </DialogContentText>

        {/* Error message */}
        {formState.errors.root && (
          <Typography
            color="error"
            sx={{
              mb: 1,
              color: "error.light",
              fontWeight: "600",
            }}
          >
            {formState.errors.root.message}
          </Typography>
        )}

        {/* Success message */}
        {formState.isSubmitSuccessful && (
          <Typography
            color="success"
            sx={{
              mb: 1,
              color: "success.light",
              fontWeight: "600",
            }}
          >
            {success}
          </Typography>
        )}

        <OutlinedInput
          placeholder="Email address"
          type="email"
          {...register("email")}
          error={!!formState.errors.email}
          fullWidth
        />

        {formState.errors.email && (
          <Typography variant="body2" sx={{ color: "error.light" }}>
            {formState.errors.email.message}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button
          onClick={() => {
            reset();
            handleClose();
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          type="submit"
          disabled={loading}
          sx={(theme) => ({
            "&:disabled": {
              color: theme.palette.info.contrastText,
              cursor: "not-allowed",
            },
            ...theme.applyStyles("dark", {
              "&:disabled": {
                color: theme.palette.action.disabled,
              },
            }),
          })}
        >
          {loading ? "Sending..." : "Continue"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
