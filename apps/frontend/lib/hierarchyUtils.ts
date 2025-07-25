// Hierarchy order from highest to lowest
export const HIERARCHY_ORDER = [
  'SUB_OWNER',
  'SUPER_ADMIN',
  'ADMIN',
  'SUB',
  'MASTER',
  'SUPER_AGENT',
  'AGENT',
  'USER',
] as const;

export type Role = typeof HIERARCHY_ORDER[number];

// Function to get hierarchy index
export function getHierarchyIndex(role: string): number {
  return HIERARCHY_ORDER.indexOf(role as Role);
}

// Function to check if creation is direct subordinate or skip hierarchy
export function checkHierarchyRelationship(creatorRole: string, newUserRole: string): {
  isDirectSubordinate: boolean;
  upperRole: string | null;
  skipLevel: number;
} {
  const creatorIndex = getHierarchyIndex(creatorRole);
  const newUserIndex = getHierarchyIndex(newUserRole);
  
  if (creatorIndex === -1 || newUserIndex === -1) {
    return { isDirectSubordinate: false, upperRole: null, skipLevel: 0 };
  }
  
  const skipLevel = newUserIndex - creatorIndex;
  
  if (skipLevel === 1) {
    // Direct subordinate (e.g., ADMIN creates SUB_OWNER)
    return { isDirectSubordinate: true, upperRole: null, skipLevel: 1 };
  } else if (skipLevel > 1) {
    // Skip hierarchy (e.g., ADMIN creates SUB)
    const upperRoleIndex = newUserIndex - 1;
    const upperRole = HIERARCHY_ORDER[upperRoleIndex];
    return { isDirectSubordinate: false, upperRole, skipLevel };
  } else {
    // Same level or higher level (shouldn't happen in normal flow)
    return { isDirectSubordinate: false, upperRole: null, skipLevel };
  }
}

// Function to get display name for role
export function getRoleDisplayName(role: string): string {
  switch (role) {
    case 'SUB_OWNER': return 'Sub Owner';
    case 'SUPER_ADMIN': return 'Super Admin';
    case 'ADMIN': return 'Admin';
    case 'SUB': return 'Sub Admin';
    case 'MASTER': return 'Master';
    case 'SUPER_AGENT': return 'Super Agent';
    case 'AGENT': return 'Agent';
    case 'USER': return 'Client';
    default: return role;
  }
}

// Function to get modal title for hierarchy selection
export function getHierarchyModalTitle(upperRole: string): string {
  return `Select ${getRoleDisplayName(upperRole)}`;
}

// Function to check if a user can access a specific role's data
export function canAccessRole(userRole: string, targetRole: string): boolean {
  const userIndex = getHierarchyIndex(userRole);
  const targetIndex = getHierarchyIndex(targetRole);
  
  if (userIndex === -1 || targetIndex === -1) {
    return false;
  }
  
  // User can only access roles that are lower in hierarchy (higher index)
  return targetIndex > userIndex;
}

// Function to get accessible roles for a user
export function getAccessibleRoles(userRole: string): string[] {
  const userIndex = getHierarchyIndex(userRole);
  
  if (userIndex === -1) {
    return [];
  }
  
  // Return all roles that are lower in hierarchy (higher index)
  return HIERARCHY_ORDER.slice(userIndex + 1);
}

// Function to check if user can access specific features
export function canAccessFeature(userRole: string, feature: string): boolean {
  // Map features to the minimum role required to access them
  const featureMinRole: Record<string, string> = {
    'login_reports': 'ADMIN',
    'super_admin_management': 'SUPER_ADMIN',
    'admin_management': 'ADMIN',
    'sub_owner_management': 'SUB_OWNER',
    'sub_management': 'SUB',
    'master_management': 'MASTER',
    'super_agent_management': 'SUPER_AGENT',
    'agent_management': 'AGENT',
    'client_management': 'USER',
  };
  const userIndex = getHierarchyIndex(userRole);
  const minRole = featureMinRole[feature];
  if (!minRole) return false;
  const minIndex = getHierarchyIndex(minRole);
  // User can access the feature if the feature's min role is below the user's role
  return minIndex > userIndex;
}

// Function to get role-based navigation items
export function getRoleBasedNavigation(userRole: string) {
  const userIndex = getHierarchyIndex(userRole);
  const allNavigation = {
    'USER DETAILS': [
      { label: 'Super Admin Master', href: '/user_details/super_admin', icon: 'fas fa-user-tie', role: 'SUPER_ADMIN' },
      { label: 'Admin Master', href: '/user_details/admin', icon: 'fas fa-user-shield', role: 'ADMIN' },
      { label: 'Sub Owner Master', href: '/user_details/sub_owner', icon: 'fas fa-user-tie', role: 'SUB_OWNER' },
      { label: 'Sub Agent Master', href: '/user_details/sub', icon: 'fas fa-chess-rook', role: 'SUB' },
      { label: 'MasterAgent Master', href: '/user_details/master', icon: 'fas fa-crown', role: 'MASTER' },
      { label: 'SuperAgent Master', href: '/user_details/super', icon: 'fas fa-user-tie', role: 'SUPER_AGENT' },
      { label: 'Agent Master', href: '/user_details/agent', icon: 'fas fa-user-shield', role: 'AGENT' },
      { label: 'Client Master', href: '/user_details/client', icon: 'fas fa-user', role: 'USER' },
      { label: 'Dead Agent Users', href: '/user_details/agent/dead', icon: 'fa fa-user-slash', role: 'AGENT' },
    ],
    'GAMES': [
      { label: 'InPlay Game', href: '/game/inPlay', icon: 'fas fa-play', role: 'USER' },
      { label: 'Complete Game', href: '/game/completeGame', icon: 'far fa-stop-circle', role: 'USER' },
    ],
    'Casino': [
      { label: 'Live Casino Position', href: '#', icon: 'fas fa-chart-line', role: 'USER' },
      { label: 'Casino Details', href: '#', icon: 'fas fa-wallet', role: 'USER' },
      { label: 'Int. Casino Details', href: '#', icon: 'fas fa-chart-line', role: 'USER' },
    ],
    'CASH TRANSACTION': [
      { label: 'Debit/Credit Entry (Super Admin)', href: '/ct/super_admin', icon: 'fas fa-angle-right', role: 'SUPER_ADMIN' },
      { label: 'Debit/Credit Entry (Admin)', href: '/ct/admin', icon: 'fas fa-angle-right', role: 'ADMIN' },
      { label: 'Debit/Credit Entry (Sub Owner)', href: '/ct/sub_owner', icon: 'fas fa-angle-right', role: 'SUB_OWNER' },
      { label: 'Debit/Credit Entry (Sub)', href: '/ct/sub', icon: 'fas fa-angle-right', role: 'SUB' },
      { label: 'Debit/Credit Entry (M)', href: '/ct/master', icon: 'fas fa-angle-right', role: 'MASTER' },
      { label: 'Debit/Credit Entry (S)', href: '/ct/super', icon: 'fas fa-angle-right', role: 'SUPER_AGENT' },
      { label: 'Debit/Credit Entry (A)', href: '/ct/agent', icon: 'fas fa-angle-right', role: 'AGENT' },
      { label: 'Debit/Credit Entry (C)', href: '/ct/client', icon: 'fas fa-angle-right', role: 'USER' },
    ],
    'LEDGER': [
      { label: 'My Ledger', href: '/ledger', icon: 'fas fa-angle-right', role: 'USER' },
      { label: 'All Super Admin Ledger', href: '/ledger/super_admin', icon: 'fas fa-angle-right', role: 'SUPER_ADMIN' },
      { label: 'All Admin Ledger', href: '/ledger/admin', icon: 'fas fa-angle-right', role: 'ADMIN' },
      { label: 'All Sub Owner Ledger', href: '/ledger/sub_owner', icon: 'fas fa-angle-right', role: 'SUB_OWNER' },
      { label: 'All Sub Ledger', href: '/ledger/sub', icon: 'fas fa-angle-right', role: 'SUB' },
      { label: 'All Master Ledger', href: '/ledger/master', icon: 'fas fa-angle-right', role: 'MASTER' },
      { label: 'All Super Ledger', href: '/ledger/super', icon: 'fas fa-angle-right', role: 'SUPER_AGENT' },
      { label: 'All Agent Ledger', href: '/ledger/agent', icon: 'fas fa-angle-right', role: 'AGENT' },
      { label: 'All Client Ledger', href: '/ledger/client', icon: 'fas fa-angle-right', role: 'USER' },
      { label: 'Client Plus/Minus', href: '/ledger/client/pm', icon: 'fas fa-angle-right', role: 'USER' },
    ],
    'COMMISSIONS': [
      { label: 'Commission Dashboard', href: '/commissions', icon: 'fas fa-coins', role: 'USER' },
    ],
    'OLD DATA': [
      { label: 'Old Ledger', href: '#', icon: 'fas fa-angle-right', role: 'USER' },
      { label: 'Old Casino Data', href: '#', icon: 'fas fa-angle-right', role: 'USER' },
    ],
    'Login Reports': [
      { label: 'All Login Reports', href: '/reports/login-reports', icon: 'fas fa-clipboard-list', role: 'ADMIN' },
      { label: 'Super Admin Login Reports', href: '/reports/login-reports?role=SUPER_ADMIN', icon: 'fas fa-clipboard-list', role: 'SUPER_ADMIN' },
      { label: 'Admin Login Reports', href: '/reports/login-reports?role=ADMIN', icon: 'fas fa-clipboard-list', role: 'ADMIN' },
      { label: 'Sub Owner Login Reports', href: '/reports/login-reports?role=SUB_OWNER', icon: 'fas fa-clipboard-list', role: 'SUB_OWNER' },
      { label: 'Sub Login Reports', href: '/reports/login-reports?role=SUB', icon: 'fas fa-clipboard-list', role: 'SUB' },
      { label: 'Master Login Reports', href: '/reports/login-reports?role=MASTER', icon: 'fas fa-clipboard-list', role: 'MASTER' },
      { label: 'Super Login Reports', href: '/reports/login-reports?role=SUPER_AGENT', icon: 'fas fa-clipboard-list', role: 'SUPER_AGENT' },
      { label: 'Agent Login Reports', href: '/reports/login-reports?role=AGENT', icon: 'fas fa-clipboard-list', role: 'AGENT' },
    ],
  };
  const filteredNavigation: Record<string, any[]> = {};
  Object.entries(allNavigation).forEach(([section, links]) => {
    const filteredLinks = links.filter(link => {
      const linkIndex = getHierarchyIndex(link.role);
      return linkIndex > userIndex; // Only show links for roles below the user
    });
    if (filteredLinks.length > 0) {
      filteredNavigation[section] = filteredLinks;
    }
  });
  return filteredNavigation;
} 