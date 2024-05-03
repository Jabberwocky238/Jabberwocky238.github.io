// import { NavLink } from 'react-router-dom';
import Card from '@/routes/Home/Card';
import './_style.css'

function Home() {
    return (
        <div className='home'>
            <img src="/logo.svg" className="App-logo" alt="logo" />
            <div className='grid'>
                <Card title="Home" 
                    href="/#/" 
                    subtitle="主页" />
                <Card title="Notes" 
                    href="/#/document/papers/FastV.md"
                    subtitle="Obsidian Like Document" />
                <Card title="Notes" 
                    href="/#/document/【TED科普】如何长期保持大脑清醒？ .md"
                    subtitle="Obsidian Like Document" />
            </div>
        </div>
    );
}

export default Home;
