import React from 'react';
type LoginLogoutButtonProps = {
    colour: string;
    label: string;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
};
const LoginLogoutButton: React.FC<LoginLogoutButtonProps> = ({
    colour,
    onClick,
    label,
}) => {
    return (
        <button className={colour} onClick={onClick}>
            {label}
        </button>
    );
};
