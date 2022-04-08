import React, { useCallback, useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { fetchAuthStatus, flaskClient } from '../fetcher';
import Spinner from './Spinner';

const INITIAL_AUTH = {
  email: null, is_auth: false, status: 'loading', username: null,
};
export const UNAUTHENTICATED = {
  email: null, is_auth: false, status: 'unauthenticated', username: null,
};

const initialContext = {
  user: INITIAL_AUTH, signIn: () => null, signOut: () => null, fetchAuth: () => null,
};

const AuthContext = React.createContext(initialContext);

function AuthProvider({ children }) {
  const [authStatus, setAuthStatus] = useState({ ...INITIAL_AUTH });
  const [authError, setAuthError] = useState(undefined);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchAuth = useCallback(async () => {
    try {
      setAuthStatus({ ...await fetchAuthStatus() });
    } catch (error) {
      setAuthStatus({ ...UNAUTHENTICATED });
    }
  }, [setAuthStatus]);

  useEffect(() => {
    if (authStatus.status === 'loading') {
      fetchAuth();
    }
  }, [fetchAuth, authStatus]);

  const signIn = useCallback(async (credentials) => {
    try {
      const authResult = await flaskClient.post('/login', credentials);
      setAuthStatus({ ...authResult.data });
      if (authResult.data.is_auth) {
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    } catch (error) {
      setAuthStatus({ ...UNAUTHENTICATED });
      setAuthError(error?.response?.data?.message);
      // setAuthError()
    }
  }, [setAuthStatus, location, navigate]);

  const signOut = useCallback(() => {
    try {
      flaskClient.post('/logout');
      setAuthStatus({ ...UNAUTHENTICATED });
    } catch (error) {
      setAuthStatus({ ...UNAUTHENTICATED });
    }
  }, [setAuthStatus]);

  const contextValue = React.useMemo(() => ({
    user: authStatus,
    signIn,
    signOut,
    fetchAuth,
    authError,
  }), [signIn, signOut, authStatus, fetchAuth, authError]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return React.useContext(AuthContext);
}

const PUBLIC_URLS = ['/login', '/register'];

export function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (user.status === 'unauthenticated' && !PUBLIC_URLS.includes(location.pathname)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (user.status === 'loading') {
    return <Spinner />;
  }
  return children;
}

export function Auth() {
  const {
    user, fetchAuth, signOut,
  } = useAuth();

  return (
    <div>
      <div>Below is what the current `user` that is returned from `useAuth` </div>
      <div>{JSON.stringify(user, null, 2)}</div>
      <button onClick={fetchAuth} type="button">
        Fetch Auth Status
      </button>
      <br />
      <button onClick={signOut} type="button">Attempt logout</button>
      <br />
    </div>
  );
}

export default AuthProvider;
