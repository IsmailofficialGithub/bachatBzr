// src/redux/features/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '@/lib/supabaseSetup';
import { toast } from 'react-toastify';


export const fetchAuthSession = createAsyncThunk(
  'auth/fetchSession',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      if(!data.session) {
        return null;
      }
      return data.session;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error){
        throw error;
      }else{
        toast.success("User logout Successfully")
        return null;
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    session: null,
    isLoading: false,
    isInitialized: false,
    error: null,
  },
  reducers: {
    updateAuthState(state, action) {
      state.user = action.payload.user;
      state.session = action.payload.session;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAuthSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.session = action.payload;
        state.user = action.payload?.user || null;
        state.error = null;
      })
      .addCase(fetchAuthSession.rejected, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.error = action.payload;
      })
      .addCase(signOut.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.session = null;
        state.error = null;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { updateAuthState } = authSlice.actions;
export default authSlice.reducer;