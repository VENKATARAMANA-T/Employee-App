import { configureStore, createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: { isAuthenticated: false, user: null },
  reducers: {
    login(state, action) {
      state.isAuthenticated = true
      state.user = action.payload
    },
    logout(state) {
      state.isAuthenticated = false
      state.user = null
    }
  }
})

const employeeSlice = createSlice({
  name: 'employees',
  initialState: { data: [], loading: false, error: null },
  reducers: {
    setLoading(state) { state.loading = true; state.error = null },
    setData(state, action) { state.data = action.payload; state.loading = false },
    setError(state, action) { state.error = action.payload; state.loading = false }
  }
})

const photoSlice = createSlice({
  name: 'photo',
  initialState: { capturedPhoto: null },
  reducers: {
    setPhoto(state, action) { state.capturedPhoto = action.payload },
    clearPhoto(state) { state.capturedPhoto = null }
  }
})

export const { login, logout } = authSlice.actions
export const { setLoading, setData, setError } = employeeSlice.actions
export const { setPhoto, clearPhoto } = photoSlice.actions

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    employees: employeeSlice.reducer,
    photo: photoSlice.reducer
  }
})
