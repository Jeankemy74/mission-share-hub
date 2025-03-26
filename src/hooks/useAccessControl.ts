
import { useAuth } from "@/contexts/AuthContext";

export type MissionAccess = {
  canView: boolean;
  canEdit: boolean;
  canManageMembers: boolean;
  canModifyDueDate: boolean;
};

export const useAccessControl = () => {
  const { user } = useAuth();
  
  // Check if user is a member of the mission
  const isMissionMember = (missionMembers: Array<{ id: string }>) => {
    if (!user) return false;
    return missionMembers.some(member => member.id === user.id);
  };
  
  // Check if user is chief of the mission
  const isMissionChief = (missionMembers: Array<{ id: string, role: string }>) => {
    if (!user) return false;
    return missionMembers.some(member => member.id === user.id && member.role === 'mission_chief');
  };
  
  // Get mission access permissions based on user role and mission membership
  const getMissionAccess = (missionMembers: Array<{ id: string, role: string }>): MissionAccess => {
    if (!user) {
      return {
        canView: false,
        canEdit: false,
        canManageMembers: false,
        canModifyDueDate: false
      };
    }
    
    // Admin has full access to everything
    if (user.role === 'admin') {
      return {
        canView: true,
        canEdit: true,
        canManageMembers: true,
        canModifyDueDate: true
      };
    }
    
    // Mission chief can modify due date and has other permissions
    if (isMissionChief(missionMembers)) {
      return {
        canView: true,
        canEdit: true,
        canManageMembers: true,
        canModifyDueDate: true
      };
    }
    
    // Regular mission members can only view
    if (isMissionMember(missionMembers)) {
      return {
        canView: true,
        canEdit: false,
        canManageMembers: false,
        canModifyDueDate: false
      };
    }
    
    // Non-members have no access
    return {
      canView: false,
      canEdit: false,
      canManageMembers: false,
      canModifyDueDate: false
    };
  };
  
  // Check if user can access all missions and documents (admin only)
  const hasFullSystemAccess = (): boolean => {
    return user?.role === 'admin';
  };
  
  return {
    isMissionMember,
    isMissionChief,
    getMissionAccess,
    hasFullSystemAccess,
  };
};
