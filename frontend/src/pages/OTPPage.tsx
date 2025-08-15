import { useState } from "react";
import OtpInput from "react-otp-input";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { verifyOtp } from "@/redux/slices/authSlice";

export function OTPPage() {
  const [otp, setOtp] = useState("");
  const dispatch = useAppDispatch();
  const { email, tempUserId, isLoading } = useAppSelector(
    (state) => state.auth
  );

  const handleVerify = () => {
    dispatch(verifyOtp({ email, otp, tempUserId }));
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Verify your OTP</h2>
      <p>We sent an OTP to {email}</p>
      <OtpInput
        value={otp}
        onChange={setOtp}
        numInputs={6}
        inputType="number"
        renderInput={(props) => <input {...props} />}
        inputStyle={{
          width: "2rem",
          height: "2rem",
          fontSize: "1.5rem",
          textAlign: "center",
        }}
      />
      <button onClick={handleVerify} disabled={isLoading}>
        {isLoading ? "Verifying..." : "Verify"}
      </button>
    </div>
  );
}
