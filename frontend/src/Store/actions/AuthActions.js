import axios from "../../axios";
import { LOGIN } from "../../Routes";
import {
  authenticate,
  disconnect,
  failAuthentication,

} from "../../Store/reducers/authReducer";
import { decodeToken } from "react-jwt";

export const disconnectUser = () => (dispatch) => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("token_type");
  dispatch(disconnect());
};
export const authenticateUser = (email, password) => async (dispatch) => {
  return axios
    .post(LOGIN, {
      password: password,
      email: email,
    })
    .then((response) => {
      if (response.status === 200) {
        localStorage.setItem("access_token", response.data["access_token"]);
        localStorage.setItem("token_type", response.data["type"]);
        
        const credentials = decodeToken(response.data["access_token"]);         
        
        let credentialItems = {
          user: {
            role: credentials.user["role"],
            emailAdress: credentials.user["email"],
            nom: credentials.user["nom"],
            prenom: credentials.user["prenom"],
            roleInfos: {},
          },
          firstAuthentication: credentials.user["first_register"],
        };
    
        if (credentials.user["role"] === "etudiant") {
          credentialItems.user.roleInfos = {
            filiere: credentials.user["filiere"],
            cin: credentials.user["cin"],
          };
        } else if (credentials.user["role"] === "professeur") {
          credentialItems.user.roleInfos = {
            tel: credentials.user["filiere"],
          };
        }else if (credentials.user["role"] === "admin") {
          credentialItems.firstAuthentication= false
        
        }
        

        dispatch(authenticate(credentialItems));

        return true;
      }
    })
    .catch(() => {
      dispatch(failAuthentication());
      return false;
    });
};
