import { Link } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
function Logo({ to = '/' }) {
  return (
    <div className="font-semibold z-10 text-lg flex items-center">
      <Link to={to}>InboxAI</Link>
    </div>
  );
}

export { Logo };
