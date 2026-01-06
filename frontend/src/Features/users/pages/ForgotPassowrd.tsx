import { useNavigate } from 'react-router-dom';

export function ForgotPasswordLink() {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate('/forgot-password')}
            className="text-sm font-bold text-accent hover:underline decoration-2 underline-offset-4 transition-all"
        >
            Forgot Password?
        </button>
    );
}
