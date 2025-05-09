export const MESSAGES = {
  USER_MESSAGES: {
    ALREADY_EXISTS: "User already exists.",
    NOT_FOUND: (id?: number) =>
      id ? `User doesn't exist for the given id ${id}.` : "User doesn't exist!",
    NOT_FOUND_BY_EMAIL: "User does not exist for the given email.",
    DELETE_SUCCESS: "User deleted successfully!",
  },
  AUTH_MESSAGES: {
    LOGIN_SUCCESS: "Login successful!",
  }
};
