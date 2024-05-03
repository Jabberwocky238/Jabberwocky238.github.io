import './Button.css'

export interface ButtonProps {
    color?: string; // 按钮颜色
    onClick?: () => void;
    navigateTo?: string,
    children: string;
}

export default function Button(props: ButtonProps) {
    const { color, children, onClick, navigateTo } = props;
    console.log(children)
    const style = {
        '--btn-color': color || 'red'
    }
    return (
        <div className='button-container'>
            <div className='button-link' style={style}>
                {navigateTo
                ? <a className='a' href={navigateTo}>{children}</a>
                : <div className='a' onClick={onClick}>{children}</div>}
            </div>
        </div>
    )
}