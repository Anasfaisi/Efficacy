import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { resendOtp, verifyOtp } from "@/redux/slices/authSlice";
// import { verifyOtp, resendOtp } from "@/redux/slices/authSlice";

export function OTPPage() {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30); // 60 seconds countdown
  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  const { email, tempUserId, isLoading } = useAppSelector(
    (state) => state.auth
  );

  // Countdown timer logic
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async () => {
    const result = await dispatch(verifyOtp({ email, otp, tempUserId }));
    if (verifyOtp.fulfilled.match(result)) {
      navigate("/home");
    }
  };

  const handleResend = () => {
    dispatch(resendOtp({ email }));
    setTimer(30); 
    setOtp(""); 
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        textAlign: "center",
        gap: "1rem",
      }}
    >
      <h2>Verify your OTP</h2>
      <p>We sent an OTP to <strong>{email}</strong></p>

      <OtpInput
        value={otp}
        onChange={setOtp}
        numInputs={6}
        inputType="number"
        renderInput={(props) => (
          <input
            {...props}
            style={{
              width: "3rem",
              height: "3rem",
              fontSize: "1.5rem",
              textAlign: "center",
              margin: "0 0.25rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
              outline: "none",
              caretColor: "#1976d2", // blue blinking cursor
            }}
          />
        )}
        containerStyle={{ justifyContent: "center" }}
      />

      <button
        onClick={handleVerify}
        disabled={isLoading || otp.length < 6}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1.5rem",
          fontSize: "1rem",
          cursor: "pointer",
          backgroundColor: "#1976d2",
          color: "white",
          border: "none",
          borderRadius: "4px",
        }}
      >
        {isLoading ? "Verifying..." : "Verify"}
      </button>

      <div style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
        {timer > 0 ? (
          <span>Resend OTP in 00:{timer.toString().padStart(2, "0")}</span>
        ) : (
          <button
            onClick={handleResend}
            style={{
              background: "none",
              border: "none",
              color: "#1976d2",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
}
