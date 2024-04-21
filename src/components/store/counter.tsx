import { atom, map, onMount } from 'nanostores';
import { useState } from 'react';

export const count = atom(0);
function parse(asdas: number){
    count.set(asdas)
}
onMount(count, () => {
    parse(0)
    window.addEventListener('popstate', parse)
    return () => {
        window.removeEventListener('popstate', parse)
    }
})
export default function DebugCounter() {
    const [count2, setCount] = useState(0);
    const Increment = () => {
        setCount(count2 + 1)
        count.set(count2)
    }
    const Decrement = () => {
        setCount(count2 - 1)
        
    }
    return (
        <div >
            <h1>Counter</h1>
            <div>Count: {count2}</div>
            <button onClick={Increment}>Increment</button>
            <button onClick={Decrement}>Decrement</button>
        </div>
    )
}