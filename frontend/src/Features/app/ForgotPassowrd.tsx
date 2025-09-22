import { useNavigate } from 'react-router-dom';

export function ForgotPasswordLink() {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to the forgot password page
    navigate('/forgot-password');
  };

  return (
    <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
      <button
        onClick={handleClick}
        style={{
          background: 'none',
          border: 'none',
          color: '#007bff',
          cursor: 'pointer',
          textDecoration: 'underline',
          padding: 0,
          fontSize: '0.9rem',
        }}
      >
        Forgot Password?
      </button>
    </div>
  );
}
