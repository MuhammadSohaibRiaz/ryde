import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { multipartApi } from "../axios"; // Your Axios instance
import { USER_TYPES } from "../../types/profiles";

const loadUserFromStorage = () => {
  if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      return {
        user: userData,
        token: userData.token,
        requires2FA: !!userData.requires2FA, // Ensure boolean value
        isLoggedIn: !!userData.token,
      };
    }
  }
  return null;
};

// Load user when the Redux store initializes
const initialUser = loadUserFromStorage();

const initialState = {
  isLoggedIn: !!initialUser?.token,
  user: initialUser?.user || null,
  token: initialUser?.token || null,
  requires2FA: initialUser?.requires2FA || false,
  loading: false,
  error: null,
};

// Async thunk for registration
export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const response = await api.post("/users/register", userData);
      if (response.status !== 201) {
        return thunkAPI.rejectWithValue(response.data.message);
      }
      const { user } = response.data;

      // Store in localStorage with requires2FA flag
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          token: null,
          role: "user",
          requires2FA: true,
        })
      );

      return { user, requires2FA: true };
    } catch (error) {
      console.log(error.response.data);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// for login
export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const response = await api.post("/users/login", userData);

      // If 2FA is enabled, user object will be returned without token
      if (response.data.user && !response.data.token) {
        // Store partial auth state with requires2FA flag
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...response.data.user._doc,
            token: null,
            role: "user",
            requires2FA: true,
          })
        );
        return { user: response.data.user._doc, requires2FA: true };
      }

      const { user, token } = response.data;
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          token,
          role: "user",
          requires2FA: false,
        })
      );
      return { user, token, requires2FA: false };
    } catch (error) {
      console.log(error.response.data);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// for driver registration
export const driverRegister = createAsyncThunk(
  "auth/driverRegister",
  async (userData, thunkAPI) => {
    try {
      console.log(userData);
      // return {};
      const response = await multipartApi.post("/drivers/register", userData);
      if (response.status !== 201) {
        return thunkAPI.rejectWithValue(response.data.message);
      }
      const { captain } = response.data;

      // Store in localStorage with requires2FA flag
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...captain,
          token: null,
          role: "driver",
          requires2FA: true,
        })
      );

      return { captain, requires2FA: true };
    } catch (error) {
      console.log(error.response.data);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// for driver login

export const driverLogin = createAsyncThunk(
  "auth/driverLogin",
  async (userData, thunkAPI) => {
    try {
      const response = await api.post("/drivers/login", userData);

      // If 2FA is enabled, captain object will be returned without token
      if (response.data.captain && !response.data.token) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...response.data.captain,
            token: null,
            role: "driver",
            requires2FA: true,
          })
        );
        return { captain: response.data.captain._doc, requires2FA: true };
      }

      const { captain, token } = response.data;
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...captain,
          token,
          role: "driver",
          requires2FA: false,
        })
      );
      return { captain, token, requires2FA: false };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

//  verify email, change the api endpoint according to user type
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (userData, thunkAPI) => {
    try {
      const url =
        userData.role === "driver" ? "/drivers/verify" : "/users/verify";
      const response = await api.post(url, userData);

      if (response.status !== 200) {
        return thunkAPI.rejectWithValue(response.data.message);
      }

      // Handle both user and driver responses
      const data = response.data;
      const verifiedUser = data.user || data.driver;
      const token = data.token;

      // add token role  and requires2FA to the user object

      verifiedUser.token = token;
      verifiedUser.role = userData.role;
      verifiedUser.requires2FA = false;

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...verifiedUser,
          token,
          role: userData.role,
          requires2FA: false,
        })
      );

      return {
        user: verifiedUser,
        token,
        requires2FA: false,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Verification failed" }
      );
    }
  }
);

// resend email, change the api endpoint according to user type
export const resendEmail = createAsyncThunk(
  "auth/resendEmail",
  async (userData, thunkAPI) => {
    try {
      const url =
        userData.role == "driver" ? "/drivers/requestOtp" : "/users/requestOtp";
      const response = await api.post(url, {
        userId: userData._id,
        driverId: userData._id,
      });
      if (response.status !== 200) {
        return thunkAPI.rejectWithValue(response.data.message);
      }
      return response.data;
    } catch (error) {
      console.log(error.response.data);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const sendResetCode = ()=>{
  
}

export const set2fa = createAsyncThunk(
  "auth/set2fa",
  async (userData, thunkAPI) => {
    try {
      // for different user types
      console.log("set2fa");
      const url =
        userData.role === "driver" ? "/drivers/set2FA" : "/users/set2FA";
      const response = await api.post(
        url,
        {
          userId: userData._id,
          driverId: userData._id,
          status: !userData.twoFactor,
        },
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      if (response.status !== 200) {
        console.log(response);
        return thunkAPI.rejectWithValue(response.data.message);
      }
      return response.data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// admin login
export const adminLogin = createAsyncThunk(
  "auth/adminLogin",
  async (userData, thunkAPI) => {
    try {
      const response = await api.post("/admin/login", userData);
      if (response.status !== 200) {
        return thunkAPI.rejectWithValue(response.data.message);
      }
      // user may or may not have a token
      const { admin, token } = response.data;

      localStorage.setItem(
        "user",
        JSON.stringify({ ...admin, token, role: "admin" })
      );

      return { admin, token };
    } catch (error) {
      console.log(error.response.data);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// add logut method for all users in one , check roles and send the request to the correct endpoint, clear the local storage
export const adminLogout = createAsyncThunk(
  "auth/adminLogout",
  async (userData, thunkAPI) => {
    try {
      const url =
        userData.role === "driver"
          ? "/drivers/logout"
          : userData.role === "admin"
          ? "/admin/logout"
          : "/users/logout";
      const response = await api.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      if (response.status !== 200) {
        return thunkAPI.rejectWithValue(response.data.message);
      }
      localStorage.removeItem("user");
      return response.data;
    } catch (error) {
      console.log(error.response.data);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Add this new thunk after other thunk definitions and before the authSlice creation
export const fetchUserData = createAsyncThunk(
  "auth/fetchUserData",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const user = state.auth.user;

      if (!user || !user.token) {
        return thunkAPI.rejectWithValue("No authenticated user");
      }
      // check for admin too
      const url =
        user.role === "driver"
          ? "/drivers/profile"
          : user.role === "admin"
          ? "/admin/profile"
          : "/users/profile";
      const response = await api.get(url, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.status !== 200) {
        return thunkAPI.rejectWithValue(response.data.message);
      }

      // Update localStorage with new user data while preserving token and role
      const updatedUser = {
        ...(user.role === "driver"
          ? response.data.captain
          : response.data.user),
        token: user.token,
        role: user.role,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return { user: updatedUser };
    } catch (error) {
      console.error("Error fetching user data:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch user data"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("user");
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
    },
    clearAuth: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
      state.requires2FA = false;
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.requires2FA = true;
        state.isLoggedIn = false;
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.user = null;
        state.token = null;
        state.loading = false;
        // the error is present in the 400 respone response.data
        state.error = action.payload?.message || "Registration failed";
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      // Fix login.fulfilled to use user instead of captain
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.requires2FA) {
          state.user = action.payload.user;
          state.requires2FA = true;
          state.isLoggedIn = false;
        } else {
          state.isLoggedIn = true;
          state.user = {
            ...action.payload.user,
            role: "user", // Ensure role is explicitly set
          };
          state.token = action.payload.token;
          state.requires2FA = false;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.user = null;
        state.token = null;
        state.loading = false;
        // the error is present in the 400 respone response.data
        state.error = action.payload?.message || "Login failed";
      })
      .addCase(driverRegister.pending, (state) => {
        state.loading = true;
      })
      .addCase(driverRegister.fulfilled, (state, action) => {
        state.user = action.payload.captain;
        state.requires2FA = true;
        state.isLoggedIn = false;
        state.loading = false;
      })
      .addCase(driverRegister.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.user = null;
        state.token = null;
        state.loading = false;
        // the error is present in the 400 respone response.data
        state.error = action.payload?.message || "Registration failed";
      })
      .addCase(driverLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(driverLogin.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.requires2FA) {
          state.user = action.payload.captain;
          state.requires2FA = true;
          state.isLoggedIn = false;
        } else {
          state.isLoggedIn = true;
          state.user = {
            ...action.payload.captain,
            role: "driver", // Ensure role is explicitly set
          };
          state.token = action.payload.token;
          state.requires2FA = false;
        }
      })
      .addCase(driverLogin.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.user = null;
        state.token = null;
        state.loading = false;
        // the error is present in the 400 respone response.data
        state.error = action.payload?.message || "Login failed";
      })
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.requires2FA = false;
        state.loading = false;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.token = null;
        state.loading = false;
        // the error is present in the 400 respone response.data
        state.error =
          action.payload?.message || "We could not verify your email";
      })
      .addCase(resendEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(resendEmail.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendEmail.rejected, (state, action) => {
        state.loading = false;
        // the error is present in the 400 respone response.data
        state.error =
          action.payload?.message || "We could not resend the email";
      })
      .addCase(set2fa.pending, (state) => {
        state.loading = true;
      })
      .addCase(set2fa.fulfilled, (state) => {
        state.loading = false;
        state.user.twoFactor = !state.user.twoFactor;
      })
      .addCase(set2fa.rejected, (state, action) => {
        state.loading = false;
        // the error is present in the 400 respone response.data
        state.error = action.payload?.message || "We could not set";
      })
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.user = action.payload.admin;
        state.token = action.payload.token;
        state.loading = false;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.user = null;
        state.token = null;
        state.loading = false;
        // the error is present in the 400 respone response.data
        state.error = action.payload?.message || "Login failed";
      })
      .addCase(adminLogout.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminLogout.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.user = null;
        state.token = null;
        state.loading = false;
      })
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch user data";
      })
      // Add matchers last, after all addCase calls
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.error = null;
          state.loading = true;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload?.message || "An error occurred";
        }
      );
  },
});


export const { logout, clearAuth } = authSlice.actions;
export default authSlice.reducer;
