import React from 'react';
import '../Styles/HomePage.css'; // Make sure to create a corresponding CSS file for styling

const HomePage = () => {
    return (
        <div className="homepage-container">
            <header className="welcome-header">
                <h1>Welcome to Permanent Memories!</h1>
            </header>
            <main className="main-content">
                <p>This is my first web development project, I hope you like it!</p>
            </main>
            <footer className="special-thanks">
                <p>Special thanks to Şafak Durukan Odabaşı, and Entertech Akademi</p>
            </footer>
        </div>
    );
};

export default HomePage;
