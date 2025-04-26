import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {
  const { user, logout } = useAuth0();

  return (
    <div className="profile">
      {user?.picture && <img src={user.picture} alt={user?.name} />}
      <div className="profile-info">
        <h2>{user?.name}</h2>
        <p>{user?.email}</p>
      </div>
      <button 
        onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
        className="logout-button"
      >
        Log Out
      </button>
    </div>
  );
};

export default Profile; 