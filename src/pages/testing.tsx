import React, { useState } from 'react';

const efectos = {
  ninguno: 'Ninguno',
  ruido: 'Textura Ruido',
  brillo: 'Brillo Suave',
  desgaste: 'Papel Desgastado',
  borde: 'Borde Irregular',
  doblez: 'Efecto Doblado',
  sombra: 'Sombra Profundidad',
};

const estilosBase: React.CSSProperties = {
  minHeight: '100vh',
  margin: 0,
  padding: '2rem',
  fontFamily: 'Segoe UI, sans-serif',
  color: '#333',
  backgroundColor: '#gray',
  transition: 'all 0.3s ease',
};

const estilosContenido: React.CSSProperties = {
  maxWidth: 700,
  margin: '2rem auto',
  padding: '2rem',
  borderRadius: 12,
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  textAlign: 'center',
  position: 'relative',
};

export const Testing: React.FC = () => {
  const [efectoActivo, setEfectoActivo] = useState<keyof typeof efectos>('ninguno');

  const clasesEfecto = () => {
    switch (efectoActivo) {
      case 'ruido':
        return 'fondo-ruido';
      case 'brillo':
        return 'brillo';
      case 'desgaste':
        return 'papelDesgastado';
      case 'borde':
        return 'borde-irregular';
      case 'doblez':
        return 'doblez';
      case 'sombra':
        return 'sombra-profundidad';
      default:
        return '';
    }
  };

  return (
    <>
      <style>{`
        .fondo-ruido {
          background:
            repeating-radial-gradient(circle at 0 0, rgba(0, 0, 0, 0.03) 1px, transparent 2px),
            repeating-radial-gradient(circle at 5px 5px, rgba(0,0,0,0.03) 1px, transparent 2px);
          background-color:rgb(86, 95, 77);
          background-blend-mode: multiply;
        }

        .brillo {
          position: relative;
          overflow: hidden;
        }
        .brillo::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%);
          animation: brilloMover 4s linear infinite;
          transform: rotate(25deg);
          pointer-events: none;
          z-index: 1;
        }
        @keyframes brilloMover {
          0% { transform: translateX(-100%) rotate(25deg); }
          100% { transform: translateX(100%) rotate(25deg); }
        }

        .papelDesgastado {
          background-color:rgb(64, 55, 104);
          box-shadow:
            inset 10px 0 20px rgba(255, 230, 150, 0.3),
            inset -10px 0 20px rgba(255, 230, 150, 0.3);
        }

        .borde-irregular {
          clip-path: polygon(
            5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%, 0% 5%
          );
          background:rgb(66, 41, 41);
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .doblez {
          position: relative;
          background: #fefefe;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .doblez::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          border-top: 50px solid #ccc;
          border-left: 50px solid transparent;
          box-shadow: -3px 3px 5px rgba(0,0,0,0.1);
          pointer-events: none;
        }

        .sombra-profundidad {
          background:rgb(139, 105, 132);
          box-shadow:
            0 4px 6px rgba(0,0,0,0.1),
            inset 0 1px 0 rgba(255,255,255,0.8);
        }

        button {
          margin: 0 0.5rem 0.5rem 0;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          border: none;
          background-color: #0078d4;
          color: white;
          cursor: pointer;
          font-weight: 600;
          transition: background-color 0.2s ease;
        }
        button:hover {
          background-color: #005ea2;
        }
        button:focus {
          outline: 2px solid #005ea2;
        }
        button.activo {
          background-color: #005ea2;
        }
      `}</style>

      <div style={{ ...estilosBase }} className={clasesEfecto()}>
        <div style={estilosContenido}>
          <h1>Fondo tipo papel con efectos CSS</h1>
          <p>Selecciona un efecto para probar:</p>

          <div style={{ marginBottom: 20 }}>
            {Object.entries(efectos).map(([key, nombre]) => (
              <button
                key={key}
                onClick={() => setEfectoActivo(key as keyof typeof efectos)}
                className={efectoActivo === key ? 'activo' : ''}
                type="button"
              >
                {nombre}
              </button>
            ))}
          </div>

          <p>
            Este es un ejemplo simple para que puedas probar y combinar estilos de fondo tipo papel.
            Prueba cada botón y observa cómo cambia el fondo y los bordes.
          </p>
        </div>
      </div>
    </>
  );
};

export default Testing;

