import React, { useEffect, useState } from 'react';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    // Fetch profile data from the server
    const fetchProfileData = async () => {
      try {
        const response = await fetch('http://localhost:8000/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
        } else {
          // Handle error case
          console.log('Failed to fetch profile data');
        }
      } catch (error) {
        // Handle error case
        console.log('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Profile</h2>
      {profileData ? (
        <div>
          <p>Name: {profileData.username}</p>
          <p>Email: {profileData.email}</p>
          {/* Add additional profile information here */}
        </div>
      ) : (
        <p>Loading profile data...</p>
      )}
    </div>
  );
};

export default ProfilePage;
