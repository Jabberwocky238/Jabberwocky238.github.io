import Card from '@/components/Card';

import './_style.css'
// import NeonBoard from '@/components/NeonBoard';
// window.confirm('hello')
function Home() {
    return (
        <div className='home'>
            <div className='App-logo-container'>
                <img src="/logo.svg" className="App-logo" alt="logo" />
            </div>
            <div className='card-container'>
                <Card title="Bird"
                    href="/#/bird"
                    subtitle="bird"
                    colorUp='#f30100'
                    colorDown='#144384' />
                <Card title="Brain Fog"
                    href="/#/document/english/新概念/39-Nothing to worry about.md"
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
