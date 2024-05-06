import { CSSProperties, PropsWithChildren, useEffect, useState } from "react"

import './NeonBoard.scss'

type NeonBoardProps = {
    color?: string,
    className?: string,
} & PropsWithChildren

export default function NeonBoard(props: NeonBoardProps) {
    const { color, className, children } = props
    const [mounted, setMounted] = useState(false)
    
    if (!mounted) {
        setMounted(true)
    }
    useEffect(() => {
        console.log("NeonBoard渲染")
        let cards: NodeListOf<HTMLElement> = document.querySelectorAll('.neon-board');
        cards.forEach((card: HTMLElement) => {
            const evfunc = (e: MouseEvent) => {
                // let x = e.offsetX
                // let y = e.offsetY
                let x = e.pageX - card.offsetLeft
                let y = e.pageY - card.offsetTop
                // console.log(`1 e.offsetX:${e.offsetX}, card.offsetLeft:${card.offsetLeft}, card.offsetWidth: ${card.offsetWidth},x:${x}`);
                // console.log(`2 e.offsetY:${e.offsetY}, card.offsetTop:${card.offsetTop}, card.offsetHeight: ${card.offsetHeight}, y:${y}`)
                card.style.setProperty('--x', `${x}px`);
                card.style.setProperty('--y', `${y}px`);
            }
            card.onmousemove = evfunc
            // card.onmouseleave = evfunc
            // card.onmouseenter = evfunc
        })
    }, [mounted])

    return (
        <div className={`neon-board ${className}`} style={{ '--clr': color ?? 'red' } as CSSProperties}>
            {children}
        </div>
    );
}