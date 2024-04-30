

interface CardProps {
    href: string;
    title: string;
    subtitle?: string;
}

export default function Card(props: CardProps) {
    const { href, title, subtitle } = props;
    return (
        <a
            href={href}
            className="card"
            target="_self"
            rel="noopener noreferrer"
        >
            <h2 className="title">{title}</h2>
            <div className="subtitle">{subtitle}</div>
        </a >
    );
}