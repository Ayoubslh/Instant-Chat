import { useUser } from '@/hooks/redux/use-user';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

RouteProtection.propTypes = {
  permission: PropTypes.string,
  children: PropTypes.node.isRequired,
  redirect: PropTypes.string,
};

function RouteProtection({ permission = 'client', redirect = '/', children }) {
  const { data } = useUser();
  const navigate = useNavigate();

  const role = data?.role?.toLowerCase() || 'guest';
  const requiredPermission = permission.toLowerCase();

  const hasAccess =
    role === requiredPermission ||
    (requiredPermission === 'client' && role !== 'guest') ||
    (role === 'client' && requiredPermission !== 'guest');

  useEffect(() => {
    if (!hasAccess) {
      navigate(redirect);
    }
  }, [hasAccess, navigate, redirect]);

  return hasAccess ? <>{children}</> : null;
}

export default RouteProtection;
