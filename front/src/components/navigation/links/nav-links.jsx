import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '#', label: 'Service' },
  { to: '#', label: 'About' },
  { to: '/contact-us', label: 'Contact' },
];

NavLinks.propTypes = {
  className: PropTypes.string,
  linkClassName: PropTypes.string,
};

function NavLinks({ className = '', linkClassName = '' }) {
  return (
    <ul className={className}>
      {NAV_LINKS.map(({ to, label }, index) => (
        <li key={index} className={linkClassName}>
          <NavLink to={to}>{label}</NavLink>
        </li>
      ))}
    </ul>
  );
}

export default NavLinks;
