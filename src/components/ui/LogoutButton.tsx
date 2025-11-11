'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

export const LogoutButton = () => {
  const { logout } = useAuth();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
  };

  return (
    <Button
      variant="danger"
      onClick={handleLogout}
      className="ml-4"
    >
      Log Out
    </Button>
  );
};