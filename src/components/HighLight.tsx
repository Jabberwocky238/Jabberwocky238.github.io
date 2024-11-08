interface HighlightProps {
    children: JSX.Element;
    color: string;
}

const Highlightd = ({ children, color }: HighlightProps) => (
    <span
        style={{
            backgroundColor: color,
            borderRadius: '2px',
            color: '#fff',
            padding: '0.2rem',
        }}>
        {children}
    </span>
);

export default Highlightd;