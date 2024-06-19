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
                <Card title="Brain Fog"
                    href="/#/document/english/看了就等于练了.md"
                    subtitle="English Learning"
                    colorUp='#f30100'
                    colorDown='#144384' />
                {/* <NeonBoard color='purple'>
                </NeonBoard> */}
            </div>

        </div>
    );
}

export default Home;
