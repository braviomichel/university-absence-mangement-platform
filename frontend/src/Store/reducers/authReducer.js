import { createSlice } from "@reduxjs/toolkit";
export const authReducer = createSlice({
  name: "auth",
  initialState: {
    userInfos: {
      role: "ano",
      email: "",
      nom : "none",
      prenom: "",
      roleInfos: {
        
      },
    },
    
    firstAuthentication: false,
    authenticated: false,
    fail: false,
    success: false,
  },
  reducers: {
    failAuthentication: (state) => {
      state.fail = true;
    },

    disconnect: (state) => {
      state.userInfos = {
        email: "",
        role: "ano",
      };
      state.firstAuthentication = false;
      state.authenticated = false;
    },

    authenticate: (state, action) => {
      
      const user = action.payload.user;
     
      state.userInfos = {
        role: user.role,
        emailAdress: user.emailAdress,
        nom: user.nom,
        prenom: user.prenom,
        roleInfos:user.roleInfos,
      };
      state.firstAuthentication = action.payload.firstAuthentication;
      state.authenticated = true;
      state.fail = false;
      state.success = true;
    },
  },
  
});

export const { authenticate, disconnect, failAuthentication} =
  authReducer.actions;

export default authReducer.reducer;
