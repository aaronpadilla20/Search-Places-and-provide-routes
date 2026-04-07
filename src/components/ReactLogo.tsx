import reactLogo from '../assets/react.svg'

export const ReactLogo = () => {
    return (
        <img
            src={reactLogo}
            alt="React Logo"
            style={{
                position: 'fixed',
                bottom: '50px',
                right: '20px',
                width: '65px'
            }}
        />
    );
};
