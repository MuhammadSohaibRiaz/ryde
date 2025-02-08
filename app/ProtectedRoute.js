"use client"

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, user, loading, requires2FA } = useSelector((state) => state.auth);
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Increase timeout to ensure state is properly loaded
      await new Promise(resolve => setTimeout(resolve, 300));

      if (!loading) {
        if (!isLoggedIn || !user) {
          await router.replace("/");
          setIsChecking(false);
          return;
        }

        if (requires2FA) {
          await router.replace("/verify-email");
          setIsChecking(false);
          return;
        }

        if (!allowedRoles.includes(user.role)) {
          if (user.role === USER_TYPES.DRIVER) {
            await router.replace("/driver-profile");
          } else if (user.role === USER_TYPES.USER) {
            await router.replace("/profile");
          } else {
            await router.replace("/");
          }
          setIsChecking(false);
          return;
        }

        setIsChecking(false);
      }
    };

    checkAuth();
  }, [isLoggedIn, user, loading, requires2FA, allowedRoles, router]);

  if (loading || isChecking) {
    return <div>Loading...</div>;
  }

  return (isLoggedIn && user && allowedRoles.includes(user.role)) ? children : null;
};

export default ProtectedRoute;
