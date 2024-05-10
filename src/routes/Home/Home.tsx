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
                <Card title="CV"
                    href="/#/document/ai/models/CV/VISION TRANSFORMERS NEED REGISTERS.md"
                    subtitle="probably my work"
                    colorUp='7967c3'
                    colorDown='a6ceb6' />
                <Card title="Brain Fog"
                    href="/#/document/english/Joey Schweitzer(youtube Better Ideas)/【TED科普】在变好的路上就行，没必要给自己太大压力.md"
                    subtitle="English Learning"
                    colorUp='#f30100'
                    colorDown='#144384' />
                <Card title="Graph"
                    href="/#/graph"
                    subtitle="ForceGraph demo"
                    colorUp='#f54275'
                    colorDown='#ffc602' />
                {/* <NeonBoard color='purple'>
                </NeonBoard> */}
            </div>

        </div>
    );
}

export default Home;
