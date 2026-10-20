export const getAdminToken = () => {
  return (
    localStorage.getItem("zinoraAdminToken") ||
    localStorage.getItem("adminToken") ||
    localStorage.getItem("zinoraToken") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("zinoraAdminToken") ||
    ""
  ).trim();
};

export const getAdminUsername = () => {
  return (
    localStorage.getItem("zinoraAdminUsername") ||
    localStorage.getItem("zinoraUsername") ||
    sessionStorage.getItem("zinoraAdminUsername") ||
    "Admin"
  );
};