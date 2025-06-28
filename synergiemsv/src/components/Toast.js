import React, { useEffect } from 'react';

const Toast = ({ message, type = 'error', onClose, duration = 5000 }) => {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const getToastStyles = () => {
        const baseStyles = {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 9999,
            maxWidth: '400px',
            wordWrap: 'break-word',
            animation: 'slideIn 0.3s ease-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'
        };

        switch (type) {
            case 'success':
                return {
                    ...baseStyles,
                    backgroundColor: '#d4edda',
                    border: '1px solid #c3e6cb',
                    color: '#155724'
                };
            case 'warning':
                return {
                    ...baseStyles,
                    backgroundColor: '#fff3cd',
                    border: '1px solid #ffeaa7',
                    color: '#856404'
                };
            case 'error':
            default:
                return {
                    ...baseStyles,
                    backgroundColor: '#f8d7da',
                    border: '1px solid #f5c6cb',
                    color: '#721c24'
                };
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✅';
            case 'warning':
                return '⚠️';
            case 'error':
            default:
                return '❌';
        }
    };

    return (
        <div style={getToastStyles()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                <span style={{ fontSize: '16px' }}>{getIcon()}</span>
                <span style={{ fontSize: '14px', lineHeight: '1.4' }}>{message}</span>
            </div>
            <button
                onClick={onClose}
                style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '18px',
                    cursor: 'pointer',
                    color: 'inherit',
                    opacity: 0.7,
                    padding: '0',
                    marginLeft: '10px'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '1'}
                onMouseLeave={(e) => e.target.style.opacity = '0.7'}
            >
                ×
            </button>
            <style jsx>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default Toast; 