export interface User {
    _id: string;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    numberOfFailedLoginAttempts: number;
    passwordResetToken?: string;
    passwordResetTokenExpiration?: Date;
    isAdmin: boolean;
}

import axios from "axios";
import { UserRowPassword } from "../components/pages/Users";

const USER_SERVICE_URL = "http://localhost:4000";
const USERS_BASE_URL = "/users";
const AUTH_BASE_URL = "/authentication";
const LOGIN_API = "/login";
const LOGOUT_API = "/logout";
const SIGNUP_API = "/";
const CREATE_USER_API = "/new";
const FORGOT_PASSWORD_API = "/forgot-password";
const RESET_PASSWORD_API = "/reset-password";
const UPDATE_ACCOUNT_API = "/update";
const DELETE_ACCOUNT_API = "/";
const UPDATE_PRIVILEGE_API = "/privilege";

const api = axios.create({
  baseURL: USER_SERVICE_URL,
  withCredentials: true
});

/**
 * An async function for sending a login request to the backend.
 * @param email The email address.
 * @param password The password.
 * @param captcha The captcha value (when required).
 * @returns An object containing the HTTP status code of the request, the responded message from the backend and the user's information.
 */
async function sendLoginRequest(email : string, password : string, captcha : string) {
  const loginData = {
    email : email,
    password : password,
    captcha : captcha
  }
  return await api.post(AUTH_BASE_URL + LOGIN_API, loginData).then(response =>
  {
    const userInfo = {
      token : response.data.token,
      id: response.data.id,
      isAdmin: response.data.isAdmin ? true : false,
      username: response.data.username,
      email: response.data.email,
    }
    return {status: response.status, message: response.data.message, userInfo: userInfo};
  }).catch(error =>
  {
    return {status: error.status, message: error.response.data.message, userInfo: null};
  })
}

/**
 * An async function for sending a forgot password request to the backend.
 * @param emailAddress The email address of the account for resetting password.
 * @returns An object containing the HTTP status code of the request and the responded message from the backend.
 */
async function sendForgotPasswordRequest(emailAddress : string) {
  const requestBody = {
    email : emailAddress
  }
  return await api.post(AUTH_BASE_URL + FORGOT_PASSWORD_API, requestBody).then(response => {
    return {status: response.status, message: response.data.message};
  }).catch(error => {
    return {status: error.status, message: error.response.data.message};
  })
}

/**
 * An async function for sending a signup request to the backend.
 * @param username The username.
 * @param emailAddress The email address.
 * @param password The password.
 * @returns An object containing the HTTP status code of the request and the responded message from the backend.
 */
async function sendSignupRequest(username : string, emailAddress : string, password : string) {
  const signupData = {
    username : username,
    email : emailAddress,
    password : password
  }

  try {
    const response = await api.post(USERS_BASE_URL + SIGNUP_API, signupData);
    return {status: response.status, message: response.data.message};
  } catch (error : any) {
    return {status: error.response.status, message: error.response.data.message};
  }
}

export async function createNewUser(details: UserRowPassword) {
  try {
    const submitDetails = {
      username: details.name,
      email: details.email, 
      phoneNumber: details.phonenumber, 
      gender: details.sex, 
      isActive: details.isActive, 
      isAdmin: details.admin, 
      password: details.newPassword
    }
    const response = await api.post(USERS_BASE_URL + CREATE_USER_API, submitDetails);
    return {status: response.status, message: response.data.message};
  } catch (error : any) {
    return {status: error.response.status, message: error.response.data.message};
  }
}

/**
 * An async function to send a logout request to the backend.
 * 
 * @returns An object containing the HTTP status code of the request and the responded message from the backend.
 */
async function sendLogoutRequest() {
  try {
    const response = await api.post(AUTH_BASE_URL + LOGOUT_API, {});
    return {status: response.status, message: response.data.message};
  } catch (error : any) {
    console.error("Logout error:", error);
    return {status: error.response.status, message: error.response.data.message};
  }
}

async function getUserById(id: string) {
  try {
    // console.log(USERS_BASE_URL + `/${id}`);
    const response = await api.get(USERS_BASE_URL + `/${id}`)
    return {status: response.status, message: response.data.message, data: response.data.data};
  } catch (error : any) {
    console.error("Error retrieving user" , error);
    return {status: error.response.status, message: error.response.data.message, data: null};
  }
}

/**
 * An async function that gets the list of users from the backend.
 */
async function getUsers() {
  try {
    const response = await api.get(USERS_BASE_URL);
    return {status: response.status, message: response.data.message, data: response.data.data};
  } catch (error: any) {
    console.error("Error when retrieving user list", error);
    return {status: error.response.status, message: error.response.data.message, data: error.response.data.data};
  }
}

/**
 * An async function that gets the user by the password reset token.
 */
async function getUserFromToken(token : string) {
  try {
    const response = await api.get(AUTH_BASE_URL + RESET_PASSWORD_API + "/" + token);
    return {status: response.status, username: response.data.username, email: response.data.email};
  } catch (error: any) {
    console.error("Error when retrieving user from token", error);
    return {status: error.response.status, message: error.response.data.message};
  }
}

/**
 * An async function that resets a password given the token and new password.
 */
async function resetPassword(token : string, password: string) {
  const resetPasswordData = {
    password: password
  };
  try {
    const response = await api.post(AUTH_BASE_URL + RESET_PASSWORD_API + "/" + token, resetPasswordData);
    return {status: response.status, message: response.data.message};
  } catch (error: any) {
    console.error("Error when resetting password", error);
    return {status: error.response.status, message: error.response.data.message};
  }
}

/**
 * An async function that updates a user's details.
 */
async function updateAccount(details: { id: string, username? : string, email? : string, phoneNumber? : string, gender?: string, isActive?: boolean, newPassword?: string }) {
  const updateAccountData = details;
  try {
    const response = await api.patch(USERS_BASE_URL + UPDATE_ACCOUNT_API, updateAccountData);
    console.log("Successfully updated account!");
    return {status: response.status, message: response.data.message};
  } catch (error: any) {
    console.error("Error when updating account", error);
    return {status: error.response.status, message: error.response.data.message};
  }
}

/**
 * An async function that deletes a user given the user ID.
 */
async function deleteAccount(id : string) {
  try {
    const response = await api.delete(USERS_BASE_URL + DELETE_ACCOUNT_API + '/' + id);
    return {status: response.status, message: response.data.message};
  } catch (error: any) {
    console.error(`Error when deleting account ID ${id}\n`, error);
    return {status: error.response.status, message: error.response.data.message};
  }
}

/**
 * An async function to update a specific user's privilege given the user ID.
 */
async function updateUserPrivilege(id : string, isAdmin : boolean) {
  try {
    const response = await api.patch(USERS_BASE_URL + '/' + id + UPDATE_PRIVILEGE_API, {
      isAdmin: isAdmin
    });
    return {status: response.status, message: response.data.message};
  } catch (error: any) {
    console.error(`Error when updating privilege of account ID ${id}\n`, error);
    return {status: error.response.status, message: error.response.data.message};
  }
}

export { 
  sendLoginRequest, 
  sendForgotPasswordRequest, 
  sendSignupRequest, 
  sendLogoutRequest, 
  getUsers, 
  getUserById, 
  getUserFromToken, 
  resetPassword, 
  updateAccount, 
  deleteAccount, 
  updateUserPrivilege, 
};