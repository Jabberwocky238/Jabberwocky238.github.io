import { CSSProperties, PropsWithChildren } from 'react';
import './Button.scss'
import { checkClrName } from './_basefunc';

export type ButtonProps = {
    color?: string; // 按钮颜色
    onClick?: () => void;
    navigateTo?: string,
} & PropsWithChildren

export default function Button(props: ButtonProps) {
    const { color, onClick, navigateTo, children } = props;
    // console.log(children)

    const _clr = color || 'red'
    const _style = {
        '--btn-color': checkClrName(_clr)
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