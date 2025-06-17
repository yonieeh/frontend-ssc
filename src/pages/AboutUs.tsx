import React from 'react';
import { MemberCard } from '../components/MemberCard';
import './aboutus.css';
import Navbar from '../components/Navbar';

export const AboutUs: React.FC = () => {
  const team = [
    {
      name: 'Javi',
      description: 'Estudiante de Ingeniería Civil en Computación. Compilando vida, debugueando decisiones. A veces en modo automático, pero siempre en ejecución.',
      imageUrl: 'javi.jpg',
    },
    {
      name: 'yoniee',
      description: 'Estudiante de la licenciatura en computación en la UC y justiciero de Gotham City.',
      imageUrl: 'yoni.jpg',
    },
    {
      name: 'Pablo',
      description: 'Estudiante LICdC UC. Llego tarde a todos lados porque soy Spider-Man',
      imageUrl: 'pablo.jpg',
    },
  ];

  return (
    <div className="min-h-screen"style={{ textAlign: 'center', backgroundImage: "url('/comic.png')" }}>
      <Navbar />
      <h2 id="team-title" className="text-4xl md:text-5xl font-bold font-[Comic_Neue]">Conoce al Escuadrón Sigma</h2>
      <p style={{ color: '#000000', marginBottom: '2rem' }} className="font-[Comic_Sans_MS] text-2xl md:text-3xl">
        Los arquitectos detrás del universo chatroom más dominante del ciberespacio.
      </p>
      <section
        role="list"
        className="font-[Comic_Sans_MS] pb-10"
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
      </section>
    </div>
  );
};

export default AboutUs;