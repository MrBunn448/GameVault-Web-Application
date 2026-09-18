import React from 'react';

export default function Navbar({ onOpenAddModal, isConnected, onRefresh }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-logo">🎮</div>
          <div className="brand-info">
            <h1 className="brand-title">GameVault</h1>
            <span className="brand-tagline">Personal Library & Progress Tracker</span>
          </div>
        </div>

        <div className="navbar-actions">
          <div className={`status-pill ${isConnected ? 'online' : 'offline'}`} title={isConnected ? 'Backend connected' : 'Backend unavailable'}>
            <span className="status-dot"></span>
            <span className="status-text">{isConnected ? 'API Online' : 'API Offline'}</span>
          </div>

          <button 
            className="btn btn-secondary btn-icon" 
            onClick={onRefresh}
            title="Refresh library"
            aria-label="Refresh library"
          >
            🔄 Refresh
          </button>

          <button 
            className="btn btn-primary" 
            onClick={onOpenAddModal}
            aria-label="Add new game"
          >
            <span className="btn-icon-symbol">＋</span> Add Game
          </button>
        </div>
      </div>
    </header>
  );
}
