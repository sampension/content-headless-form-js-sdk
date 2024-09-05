import { FormCache, FormConstants } from '@episerver/forms-sdk';
import authService from '../authService';

function LogoutButton({ username }: any) {
  const formCache = new FormCache();

  function logout() {
    authService.logout();
    formCache.remove(FormConstants.FormAccessToken);

  }

  return (
    <button className="btn" onClick={logout}>
      {username},
      Logout
    </button>
  );
}

export default LogoutButton;