import React from "react";

export default function WelcomePage() {
    return (
        <div style={{
            minHeight: '100vh',
            padding: '2rem',
            backgroundColor: 'rgba(50,50,50,0.85)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                textAlign: 'center'
            }}>
                Welcome to KindHeart!
            </h1>
            <p style={{
                fontSize: '1.125rem',
                textAlign: 'center',
                maxWidth: '600px',
                marginBottom: '2rem',
                color: 'rgba(121,156,178,1)'
            }}>
                Join a growing community of volunteers making a difference every day. Whether you want to lend a hand, donate, or simply get inspired, KindHeart is your platform to spark change.
            </p>

            <div style={{
                display: 'flex',
                gap: '1rem',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: '2rem'
            }}>
                <button
                    style={{
                        padding: '0.75rem 1.5rem',
                        fontSize: '1rem',
                        backgroundColor: 'rgba(121,156,178,1)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}
                    onClick={() => window.location.href = '/getStarted'}>
                    Get Started
                </button>
                <button
                    style={{
                        padding: '0.75rem 1.5rem',
                        fontSize: '1rem',
                        backgroundColor: 'rgba(121, 156, 178, 0.6)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}
                    onClick={() => window.location.href = '/donate'}>
                    Donate Now
                </button>
            </div>

            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                justifyContent: 'center',
                marginBottom: '3rem'
            }}>
                {[
                    { icon: '👥', number: '10,000+', label: 'Active Volunteers' },
                    { icon: '❤️', number: '3,500+', label: 'Successful Projects' },
                    { icon: '😊', number: '15,000+', label: 'Happy Beneficiaries' },
                ].map((card, idx) => (
                    <div key={idx} style={{
                        textAlign: 'center',
                        padding: '1rem',
                        backgroundColor: 'rgba(121, 156, 178, 0.6)',
                        borderRadius: '8px',
                        width: '200px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{ fontSize: '2rem' }}>{card.icon}</div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginTop: '0.5rem', color: 'white' }}>
                            {card.number}
                        </h2>
                        <p style={{ color: 'white' }}>{card.label}</p>
                    </div>
                ))}
            </div>

            <h2 style={{
                fontSize: '1.75rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: 'rgba(121,156,178,1)'
            }}>
                Our Growth Over Time
            </h2>

            <div style={{ width: '100%', maxWidth: '600px', marginBottom: '2rem' }}>
                <svg viewBox="0 0 600 300" width="100%" height="100%">
                    {/* Grid lines */}
                    <line x1="50" y1="0" x2="50" y2="300" stroke="rgba(121,156,178,0.3)" />
                    <line x1="0" y1="250" x2="600" y2="250" stroke="rgba(121,156,178,0.3)" />

                    {/* Signups line */}
                    <polyline
                        fill="none"
                        stroke="rgba(121,156,178,1)"
                        strokeWidth="3"
                        points="50,200 150,170 250,140 350,100 450,80"
                    />

                    {/* Donations line */}
                    <polyline
                        fill="none"
                        stroke="rgba(121,156,178,0.6)"
                        strokeWidth="3"
                        points="50,230 150,210 250,170 350,130 450,100"
                    />

                    {/* Labels */}
                    {["Jan", "Feb", "Mar", "Apr", "May"].map((month, idx) => (
                        <text
                            key={month}
                            x={50 + idx * 100}
                            y={270}
                            fontSize="12"
                            fill="white"
                            textAnchor="middle">
                            {month}
                        </text>
                    ))}
                </svg>
            </div>

            <footer style={{
                marginTop: '2rem',
                textAlign: 'center',
                color: 'rgba(121,156,178,0.6)'
            }}>
                © 2025 KindHeart. Making the world better, together.
            </footer>
        </div>
    );
}
