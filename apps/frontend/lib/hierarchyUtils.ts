// Hierarchy order from highest to lowest
export const HIERARCHY_ORDER = ['BOSS', 'SUB', 'MASTER', 'SUPER_AGENT', 'AGENT', 'USER'] as const;

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
    // Direct subordinate (e.g., BOSS creates SUB)
    return { isDirectSubordinate: true, upperRole: null, skipLevel: 1 };
  } else if (skipLevel > 1) {
    // Skip hierarchy (e.g., BOSS creates MASTER)
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
    case 'BOSS': return 'Boss';
    case 'SUB': return 'Sub Agent';
    case 'MASTER': return 'Master Agent';
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