const { default: api } = require("../axios");



// registerDriver method

const registerDriver = (data) => {
  return api.post("/driver/register", data);
}

// registerUser method

const registerUser = async (data) => {
  const response = await api.post("/users/register", data);
  return response;
}

// login method

const login = (data) => {
  return api.post("/users/login", data);
};


const AuthService = {
  registerDriver,
  registerUser,
  login
};
export default AuthService;