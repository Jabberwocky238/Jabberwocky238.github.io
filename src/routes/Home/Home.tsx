// import { NavLink } from 'react-router-dom';
import Card from '@/routes/Home/Card';
import './_style.css'
import Button from '@/components/Button';

function Home() {
    return (
        <div className='home'>
            <img src="/logo.svg" className="App-logo" alt="logo" />
            <Button navigateTo='/#/document/【TED科普】如何长期保持大脑清醒？ .md'>
                Brain Fog
            </Button>
            <div className='grid'>
                <Card title="Home" 
                    href="/#/" 
                    subtitle="主页" />
                <Card title="Notes" 
                    href="/#/document/papers/FastV.md"
                    subtitle="Obsidian Like Document" />
                <Card title="【TED科普】如何长期保持大脑清醒" 
                    href="/#/document/【TED科普】如何长期保持大脑清醒？ .md"
                    subtitle="English Learning" />
            </div>
        </div>
    );
}

export default Home;
