// Components/NavigationBar.js
import React from 'react';
import '../Styles/NavBar.css';

export default function NavigationBar() {
    const links = [
        { name: 'Home', url: '/' },
        { name: 'Daily Deals', url: '/deals' },
        { name: 'Customer Service', url: '/service' },
        // Add other links as needed
    ];

    return (
        <div className="nav-container">
            <ul className="nav-list">
                {links.map(link => (
                    <li key={link.name} className="nav-item">
                        <a href={link.url} className="nav-link">{link.name}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
