export const userPermissions = {
  General: {
    renderAsTable: true,  // Indicates that this category should render a table
    permissions: [
      "VIEW_ACCOUNT_INFORMATION",
      "EDIT_ACCOUNT_INFORMATION",
      "DELETE_ACCOUNT",
      "CHANGE_PASSWORD",
      "VIEW_USER_PROFILE",
      "EDIT_USER_PROFILE",
    ],
  },

  "Content Management": {
    renderAsTable: true,
    permissions: [
      "CREATE_CONTENT",
      "EDIT_CONTENT",
      "DELETE_CONTENT",
      "PUBLISH_CONTENT",
      "UNPUBLISH_CONTENT",
      "VIEW_CONTENT",
    ],
  },

  "Settings Management": {
    renderAsTable: false,  // Custom rendering, no table
    permissions: ["VIEW_SETTINGS", "EDIT_SETTINGS", "MANAGE_CONFIGURATION"],
  },

  Moderation: {
    renderAsTable: true,
    permissions: [
      "MODERATE_COMMENTS",
      "MANAGE_FORUMS",
      "BAN_USERS",
      "VIEW_MODERATION_LOGS",
    ],
  },

  "System Administration": {
    renderAsTable: false,  // Custom rendering
    permissions: [
      "MANAGE_SERVER_SETTINGS",
      "CONFIGURE_SECURITY",
      "UPDATE_SOFTWARE",
      "BACKUP_DATA",
      "RESTORE_DATA",
    ],
  },
};
