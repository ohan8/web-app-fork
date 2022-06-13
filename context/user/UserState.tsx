/* eslint-disable import/no-duplicates */
import { useReducer, useEffect, useState } from 'react';
import UserContext from './UserContext';
import userReducer from './UserReducer';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import firebase from 'firebase/auth';
import { auth } from '../../config/firebase';

import { GET_USER, SET_LOADING, LOGOUT, userCreditionals } from '../types';

const UserState = (props: any) => {
  const initialState = {
    username: null,
    role: null,
    isAuthenticated: false,
    loading: false,
  };
  const [user, setUser] = useState<firebase.User | null>(null);

  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    return auth.onIdTokenChanged(async (user) => {
      if (!user) {
        setUser(null);
      } else {
        setUser(user);
      }
    });
  }, []);

  // Trigger loading state
  const setLoading = () => {
    dispatch({ type: SET_LOADING });
  };

  // Login User
  const login = async (loginForm: userCreditionals) => {
    setLoading();
    try {
      await signInWithEmailAndPassword(
        auth,
        loginForm.email,
        loginForm.password
      );
    } catch (error: any) {
      return error.code;
    }
    await dispatch({
      type: GET_USER,
      payload: {
        username: loginForm.email,
        // TODO Role
        role: null,
      },
    });
    // This will be implemented to keep the User logged in the next Pull request with just a bit more testing
    // localStorage.setItem(
    //   'userData',
    //   JSON.stringify({
    //     type: GET_USER,
    //     payload: {
    //       username: loginForm.email,
    //       role: null,
    //     },
    //   })
    // );
  };
  const signup = async (loginForm: userCreditionals) => {
    setLoading();
    try {
      await createUserWithEmailAndPassword(
        auth,
        loginForm.email,
        loginForm.password
      );
    } catch (error: any) {
      return error.code;
    }
    await dispatch({
      type: GET_USER,
      payload: {
        username: loginForm.email,
        // TODO Role
        role: null,
      },
    });
    // This will be implemented to keep the User logged in the next Pull request with just a bit more testing
    // localStorage.setItem(
    //   'userData',
    //   JSON.stringify({
    //     type: GET_USER,
    //     payload: {
    //       username: loginForm.email,
    //       role: null,
    //     },
    //   })
    // );
  };

  const logoutUser = async () => {
    await signOut(auth);
    setUser(null);
    dispatch({ dispatch: LOGOUT });
    // This will be implemented to keep the User logged in the next Pull request with just a bit more testing
    // localStorage.setItem('userData', JSON.stringify({ dispatch: LOGOUT }));
  };

  return (
    <UserContext.Provider
      value={{
        username: state.username,
        user: user,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        role: state.role,
        login,
        signup,
        logoutUser,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserState;
