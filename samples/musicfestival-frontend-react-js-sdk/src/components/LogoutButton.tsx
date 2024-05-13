import authService from '../authService';

function LogoutButton({ username }: any) {
    
  function logout() {
    const storage = window.sessionStorage;
    authService.logout();
    storage.removeItem("form_access_token")
  }

  return (
    <button className="btn" onClick={logout}>
      {username},
      Logout
    </button>
  );
}

export default LogoutButton;