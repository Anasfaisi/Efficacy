import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import {
  type AuthState,
  type User,
  type LoginCredentials,
  type RegisterCredentials,
  type LogoutCredentials,
  type GoogleLoginArg,
} from "../types";

const API_URL = import.meta.env.VITE_API_URL || "[invalid url, do not cite]";
export const updateToken = createAction<string>("auth/updateToken");
export const clearUser = createAction("auth/clearUser");

const createApi = () =>
  axios.create({
    baseURL: API_URL,
    withCredentials: true,
  });

export const registerInit = createAsyncThunk<
  { tempUserId: string; email: string },
  RegisterCredentials,
  { rejectValue: string }
>(
  "auth/registerInit",
  async ({ email, password, name, role }, { rejectWithValue }) => {
    try {
      const api = createApi();
      const endpoint =
        role === "mentor" ? "/mentor/register/init" : "/register/init";

      const { data } = await api.post(endpoint, {
        email,
        password,
        name,
        role,
      });
      console.log(data);

      return {
        tempUserId: data.tempUserId,
        email: data.email,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration initiation failed"
      );
    }
  }
);

export const clearRegisterState = createAsyncThunk(
  "auth/clearRegisterState",
  async () => {
    return true;
  }
);

export const verifyOtp = createAsyncThunk<
  { accessToken: string; refreshToken: string; user: any },
  { email: string | null; otp: string | null; tempUserId: string | null },
  { rejectValue: string }
>("auth/verifyOtp", async ({ email, otp, tempUserId }, { rejectWithValue }) => {
  try {
    const api = createApi();
    const response = await api.post("/register/verify", {
      email,
      otp,
    });
    console.log(response.data);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "OTP verification failed"
    );
  }
});

export const resendOtp = createAsyncThunk<
  { tempUserId: string; email: string },
  { email: string | null },
  { rejectValue: string }
>("auth/resendOtp", async ({ email }, { rejectWithValue }) => {
  try {
    const api = createApi();
    const response = await api.post("/register/resend-otp", {
      email,
    })
    console.log(response.data)
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Resend OTP failed");
  }
});

export const login = createAsyncThunk<
  { accessToken: string; user: User },
  LoginCredentials,
  { rejectValue: string }
>("auth/login", async ({ email, password, role }, { rejectWithValue }) => {
  try {
    const api = createApi();
    const endpoint =
      role === "admin"
        ? "/admin/login"
        : role === "mentor"
        ? "/mentor/login"
        : "/login";
    const response = await api.post(endpoint, { email, password, role });
    console.log(response);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

export const logout = createAsyncThunk<
  void,
  LogoutCredentials,
  { rejectValue: string }
>("auth/logout", async ({ role }, { rejectWithValue }) => {
  try {
    const api = createApi();

    const endpoint =
      role === "admin"
        ? "/admin/logout"
        : role === "mentor"
        ? "/mentor/logout"
        : "/logout";

    const result = await api.post(endpoint);
    console.log(result.data);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Logout failed");
  }
});

export const loginWithGoogle = createAsyncThunk<
  { accessToken: string; user: User },
  GoogleLoginArg,
  { rejectValue: string }
>(
  "auth/loginWithGoogle",
  async ({ googleToken, role }, { rejectWithValue }) => {
    try {
      console.log("reached in login with google");

      const api = createApi();
      const endpoint =
        role === "mentor" ? "/mentor/google-login" : "/google-login";
      console.log(endpoint, "endpoint");
      const res = await api.post(endpoint, { googleToken: googleToken, role });
      console.log(res.data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);


export const forgotPasswordRequest = createAsyncThunk<
  { message: string },
  { email: string },
  { rejectValue: string }
>("auth/forgotPasswordRequest", async ({ email }, { rejectWithValue }) => {
  try {
    const response = await createApi().post("/forgot-password/init", { email });
    return { message: response.data.message };
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Request failed");
  }
});

export const resetPassword = createAsyncThunk<
  { message: string },
  { token: string; newPassword: string },
  { rejectValue: string }
>("auth/resetPassword", async ({ token, newPassword }, { rejectWithValue }) => {
  try {
    const response = await createApi().post("/forgot-password/verify", { token, newPassword });
    return { message: response.data.message };
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Reset failed");
  }
});


export const refresh = createAsyncThunk<
  { accessToken: string; user: User },
  void,
  { rejectValue: string }
>("auth/refresh", async (_, { rejectWithValue }) => {
  try {
    const api = createApi();
    const response = await api.post("/refresh");
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Refresh failed");
  }
});

const initialState: AuthState = {
  accessToken: null,
  email: null,
  tempUserId: null,
  user: null,
  isLoading: false,
  error: null,
  successMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
      clearMessages(state) {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerInit.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerInit.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tempUserId = action.payload.tempUserId;
        state.email = action.payload.email;
      })
      .addCase(registerInit.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Registration failed";
      })

      .addCase(clearRegisterState.fulfilled, (state) => {
        state.tempUserId = null;
        state.email = null;
        state.error = null;
        state.isLoading = false;
      })

      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "OTP verification failed";
      })

      // Resend OTP
      .addCase(resendOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tempUserId = action.payload.tempUserId;
        state.email = action.payload.email;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Resend OTP failed";
      })

            // Forgot password request
      .addCase(forgotPasswordRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(forgotPasswordRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(forgotPasswordRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Request failed";
      })
      // Reset password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Reset failed";
      })

      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
        localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Refresh
      .addCase(refresh.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refresh.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
        localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(refresh.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateToken, (state, action: PayloadAction<string>) => {
        state.accessToken = action.payload;
        state.isLoading = false;
        localStorage.setItem("accessToken", action.payload);
      })
      .addCase(clearUser, (state) => {
        state.accessToken = null;
        state.user = null;
        state.isLoading = false;
        state.error = null;
        localStorage.removeItem("accessToken");
      })

      .addCase(logout.fulfilled, (state) => {
        (state.user = null), (state.accessToken = null);
      })

      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(loginWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Google login failed";
      });
  },
});

// export const { logout } = authSlice.actions;
export default authSlice.reducer;
