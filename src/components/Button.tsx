import { CSSProperties } from 'react';
import './Button.scss'

export interface ButtonProps {
    color?: string; // 按钮颜色
    onClick?: () => void;
    navigateTo?: string,
    children: string | React.ReactNode;
}

export default function Button(props: ButtonProps) {
    const { color, children, onClick, navigateTo } = props;
    console.log(children)
    const _style = {
        '--btn-color': color || 'red'
    } as CSSProperties
    return (
        <div className='button-container'>
            <div className='button-link' style={_style}>
                {navigateTo
                ? <a className='a' href={navigateTo}>{children}</a>
                : <div className='a' onClick={onClick}>{children}</div>}
            </div>
        </div>
    )
}