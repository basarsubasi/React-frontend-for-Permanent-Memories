// Components/Layout.js
import React from 'react';
import NavigationBar from './NavigationBar';
import SearchBar from './SearchBar';
import '../Styles/Layout.css';

export default function Layout({ children }) {
    return (
        <div className="layout">
            <header className="header">
                <SearchBar />
                <NavigationBar />
            </header>
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}
