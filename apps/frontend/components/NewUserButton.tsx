import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import HierarchySelectionModal from './HierarchySelectionModal';
import { checkHierarchyRelationship } from '../lib/hierarchyUtils';

interface NewUserButtonProps {
  role: string;
  className?: string;
  children: React.ReactNode;
}

const NewUserButton: React.FC<NewUserButtonProps> = ({ role, className, children }) => {
  const router = useRouter();
  const [currentUserRole, setCurrentUserRole] = useState<string>('');
  const [showHierarchyModal, setShowHierarchyModal] = useState(false);
  const [hierarchyUpperRole, setHierarchyUpperRole] = useState<string>('');

  useEffect(() => {
    // Get current user's role
    const getCurrentUserRole = async () => {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        if (data.valid) {
          setCurrentUserRole(data.user.role);
        }
      } catch (error) {
        console.error('Error getting current user role:', error);
      }
    };
    getCurrentUserRole();
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!currentUserRole) {
      alert('Unable to determine your role. Please refresh the page.');
      return;
    }

    // Check hierarchy relationship
    const hierarchyCheck = checkHierarchyRelationship(currentUserRole, role);
    
    if (!hierarchyCheck.isDirectSubordinate && hierarchyCheck.upperRole) {
      // Show hierarchy selection modal
      setHierarchyUpperRole(hierarchyCheck.upperRole);
      setShowHierarchyModal(true);
    } else {
      // Direct subordinate - navigate directly
      router.push(`/user/create?role=${role}`);
    }
  };

  const handleHierarchySelection = (selectedUserId: string) => {
    // Navigate to create page with selected parent
    router.push(`/user/create?role=${role}&parentId=${selectedUserId}`);
  };

  return (
    <>
      <button 
        className={className || "btn btn-primary mr-2"} 
        onClick={handleClick}
      >
        {children}
      </button>
      
      <HierarchySelectionModal
        isOpen={showHierarchyModal}
        upperRole={hierarchyUpperRole}
        onClose={() => setShowHierarchyModal(false)}
        onSelect={handleHierarchySelection}
      />
    </>
  );
};

export default NewUserButton; 