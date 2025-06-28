import React from 'react';

const Loading = ({ message = 'Chargement...', size = 'medium' }) => {
    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return { width: '20px', height: '20px', borderWidth: '2px' };
            case 'large':
                return { width: '40px', height: '40px', borderWidth: '4px' };
            case 'medium':
            default:
                return { width: '30px', height: '30px', borderWidth: '3px' };
        }
    };

    const spinnerStyles = {
        ...getSizeStyles(),
        border: `${getSizeStyles().borderWidth} solid #f3f3f3`,
        borderTop: `${getSizeStyles().borderWidth} solid #3498db`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto'
    };

    const containerStyles = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: '20px'
    };

    const messageStyles = {
        fontSize: '14px',
        color: '#666',
        textAlign: 'center',
        margin: 0
    };

    return (
        <div style={containerStyles}>
            <div style={spinnerStyles}></div>
            {message && <p style={messageStyles}>{message}</p>}
            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Loading; 