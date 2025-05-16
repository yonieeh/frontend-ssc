import React from 'react';
import { MemberCard } from '../components/MemberCard';
import '../style/aboutus.css';

export const AboutUs: React.FC = () => {
  const team = [
    {
      name: 'SigmaBoy',
      description: 'Creador del núcleo. Arquitecto del caos.',
      imageUrl: '/assets/images.jpg',
    },
    {
      name: 'NeoKnight',
      description: 'Defensor del backend. Guerrero del código limpio.',
      imageUrl: '/assets/images.jpg',
    },
    {
      name: 'DarkPixel',
      description: 'Maestro del frontend. Hace que el caos se vea bonito.',
      imageUrl: '/assets/images.jpg',
    },
  ];

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Conoce al Escuadrón Sigma</h2>
      <p style={{ color: '#aaa', marginBottom: '2rem' }}>
        Los arquitectos detrás del universo chatroom más dominante del ciberespacio.
      </p>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {team.map((member, index) => (
          <MemberCard key={index} {...member} />
        ))}
      </div>
    </div>
  );
};
