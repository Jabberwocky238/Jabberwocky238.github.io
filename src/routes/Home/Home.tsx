import Card from '@/components/Card';

import './_style.css'
// import NeonBoard from '@/components/NeonBoard';

function Home() {
    return (
        <div className='home'>
            <div className='App-logo-container'>
                <img src="/logo.svg" className="App-logo" alt="logo" />
            </div>
            <div className='card-container'>
                <Card title="Graph"
                    href="/#/graph"
                    subtitle="ForceGraph demo" 
                    colorUp='#be1e3e'
                    colorDown='#24130D' />
                {/* <NeonBoard color='purple'>
                </NeonBoard> */}
                <Card title="FastV"
                    href="/#/document/ai/papers/FastV.md"
                    subtitle="Obsidian Like Document"
                    colorUp='ffc639'
                    colorDown='#50d0d0' />
                <Card title="Brain Fog"
                    href="/#/document/english/【TED科普】如何长期保持大脑清醒？ .md"
                    subtitle="English Learning"
                    colorUp='#144384'
                    colorDown='#a846fb' />
            </div>

        </div>
    );
}

export default Home;
