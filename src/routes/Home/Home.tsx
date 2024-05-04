import './_style.css'
// import Button from '@/components/Button';
import Card from '@/components/Card';

function Home() {
    return (
        <div className='home'>
            <img src="/logo.svg" className="App-logo" alt="logo" />
            <div className='card-container'>
                <Card title="Home" 
                    href="/#/" 
                    subtitle="主页" />
                <Card title="FastV" 
                    href="/#/document/papers/FastV.md"
                    subtitle="Obsidian Like Document" 
                    colorUp='blue'
                    colorDown='purple'/>
                <Card title="Brain Fog" 
                    href="/#/document/【TED科普】如何长期保持大脑清醒？ .md"
                    subtitle="English Learning"
                    colorUp='chartreuse'
                    colorDown='green'/>
            </div>
        </div>
    );
}

export default Home;
