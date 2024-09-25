export const administratorPermissions = {
  General: {
    renderAsTable: true,
    permissions: [
      "VIEW_ADMIN_DASHBOARD",
      "MANAGE_ADMIN_PROFILE",
      "CHANGE_ADMIN_PASSWORD",
    ],
  },

  "User Management": {
    renderAsTable: true,
    permissions: [
      "CREATE_ADMIN_USERS",
      "EDIT_ADMIN_USERS",
      "DELETE_ADMIN_USERS",
      "ASSIGN_ADMIN_ROLES",
      "MANAGE_ADMIN_GROUPS",
      "VIEW_ADMIN_LIST",
    ],
  },

  "Role Management": {
    renderAsTable: true,
    permissions: ["CREATE_ROLES", "EDIT_ROLES", "DELETE_ROLES", "ASSIGN_PERMISSIONS"],
  },

  "Permission Management": {
    renderAsTable: true,
    permissions: ["VIEW_PERMISSIONS", "EDIT_PERMISSIONS", "ASSIGN_PERMISSIONS"],
  },

  "System Configuration": {
    renderAsTable: false,  // Custom rendering
    permissions: [
      "MANAGE_SERVER_SETTINGS",
      "CONFIGURE_SECURITY",
      "UPDATE_SOFTWARE",
      "BACKUP_DATA",
      "RESTORE_DATA",
    ],
  },

  "Content Management": {
    renderAsTable: true,
    permissions: [
      "MANAGE_CONTENT_CATEGORIES",
      "MANAGE_CONTENT_TAGS",
      "APPROVE_CONTENT",
      "REJECT_CONTENT",
    ],
  },

  "Reporting Analytics": {
    renderAsTable: true,
    permissions: ["VIEW_ADMIN_REPORTS", "GENERATE_ADMIN_REPORTS", "ACCESS_ADMIN_ANALYTICS"],
  },

  "Financial Management": {
    renderAsTable: true,
    permissions: [
      "MANAGE_PAYMENTS",
      "VIEW_TRANSACTIONS",
      "REFUND_TRANSACTIONS",
      "MANAGE_INVOICES",
    ],
  },

  Security: {
    renderAsTable: false,  // Custom rendering
    permissions: [
      "VIEW_AUDIT_LOGS",
      "MANAGE_FIREWALL_RULES",
      "CONFIGURE_TWO_FACTOR_AUTH",
    ],
  },

  Settings: {
    renderAsTable: false,  // Custom rendering
    permissions: ["VIEW_SETTINGS", "EDIT_SETTINGS", "MANAGE_CONFIGURATION"],
  },
};
