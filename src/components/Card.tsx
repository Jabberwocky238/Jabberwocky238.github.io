import { CSSProperties } from 'react';
import './Card.css'

interface CardProps {
    href: string;
    title: string;
    subtitle?: string;
    colorUp?: string;
    colorDown?: string;
}

export default function Card(props: CardProps) {
    const { href, title, subtitle, colorUp, colorDown } = props;
    const _colorUp = colorUp || '#ff0058';
    const _colorDown = colorDown || '#ffbc00';
    const _style = {
        '--card-color-up': _colorUp,
        '--card-color-down': _colorDown,
    } as CSSProperties
    return (
        <div className="card-box" style={_style}>
            <span></span>
            <div className="card-content">
                <h2>{title}</h2>
                <p>{subtitle}</p>
                <a href={href} target="_self" rel="noopener noreferrer">Link</a>
            </div>
        </div>
    );
}