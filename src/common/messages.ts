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
  },
  PERMISSION_MESSAGES: {
    UNAUTHORIZED: "You do not have permission to perform this action.",
  },
};


export const PROJECT_MESSAGES = {
  CREATE_SUCCESS: 'Project created successfully!',
  CREATE_FAILED: 'Failed to create project.',
  UPDATE_SUCCESS: 'Project updated successfully!',
  DELETE_SUCCESS: 'Project deleted successfully!',
  BAD_REQUEST: 'Invalid project data provided.',
  NOT_FOUND: (id?: number) =>
    id ? `Project with ID ${id} not found.` : 'Project not found.',
};
