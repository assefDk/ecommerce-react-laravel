export const apiUrl = "http://localhost:8000/api";

export const adminToken = () => {
  const data = JSON.parse(localStorage.getItem("adminInfo"));
  return data.token;
};


// export const userToken = () => {
//   const data = JSON.parse(localStorage.getItem("userInfo"));
//   return data.token;
// };

export const userToken = () => {
  try {
    const user = localStorage.getItem("userInfo");
    if (!user) return null;
    
    const userData = JSON.parse(user);
    return userData?.token || null;
  } catch (error) {
    console.error("Error getting user token:", error);
    return null;
  }
};