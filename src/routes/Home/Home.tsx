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
                    subtitle="ForceGraph demo" />
                {/* <NeonBoard color='purple'>
                </NeonBoard> */}
                <Card title="FastV"
                    href="/#/document/papers/FastV.md"
                    subtitle="Obsidian Like Document"
                    colorUp='aqua'
                    colorDown='fuchsia' />
                <Card title="Brain Fog"
                    href="/#/document/【TED科普】如何长期保持大脑清醒？ .md"
                    subtitle="English Learning"
                    colorUp='chartreuse'
                    colorDown='green' />
            </div>

        </div>
    );
}

export default Home;
