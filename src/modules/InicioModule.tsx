import { useState, useEffect } from 'react';
import { Sparkles, FileText, MessageCircle, Dice3, Mic } from 'lucide-react';

export default function InicioModule({ setModule }: { setModule: (m: string) => void }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const styles = {
    container: {
      padding: isMobile ? '20px 15px' : '40px 30px',
      width: '100%',
      margin: '0',
      minHeight: 'calc(100vh - 140px)',
      background: 'white',
      boxSizing: 'border-box' as const
    },
    innerContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%'
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: isMobile ? '2rem' : '3rem',
      padding: isMobile ? '1rem' : '2rem',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      borderRadius: '20px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
      marginTop: isMobile ? '0' : '1rem'
    },
    title: {
      fontSize: isMobile ? '2rem' : '2.8rem',
      color: '#166088',
      marginBottom: '1rem',
      fontWeight: '900',
      lineHeight: '1.2'
    },
    subtitle: {
      fontSize: isMobile ? '1.1rem' : '1.3rem',
      color: '#444',
      maxWidth: '800px',
      margin: '0 auto',
      lineHeight: '1.5'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: isMobile ? '1.5rem' : '2rem',
      width: '100%'
    },
    card: {
      background: 'white',
      borderRadius: '20px',
      padding: isMobile ? '1.5rem' : '2rem',
      boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
      textAlign: 'center' as const,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: '3px solid transparent',
      height: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'space-between'
    },
    cardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
    },
    icon: {
      marginBottom: isMobile ? '1rem' : '1.5rem'
    },
    cardTitle: {
      fontSize: isMobile ? '1.3rem' : '1.6rem',
      color: '#166088',
      marginBottom: '1rem',
      fontWeight: '600'
    },
    cardText: {
      color: '#555',
      marginBottom: isMobile ? '1.5rem' : '2rem',
      lineHeight: '1.6',
      fontSize: isMobile ? '0.9rem' : '1rem',
      flexGrow: 1
    },
    button: {
      padding: isMobile ? '10px 20px' : '12px 24px',
      border: 'none',
      borderRadius: '8px',
      fontSize: isMobile ? '0.9rem' : '1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      background: '#4a6fa5',
      color: 'white',
      width: '100%'
    },
    whatsappButton: {
      background: '#25D366',
      color: 'white'
    },
    ocioButton: {
      background: '#4fc3a1',
      color: 'white'
    },
    notasButton: {
      background: '#9b59b6',
      color: 'white'
    }
  };

  const Card = ({ 
    icon, 
    title, 
    description, 
    buttonText = "Acceder al módulo →", 
    buttonStyle = {}, 
    borderColor,
    onClick 
  }: any) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        onClick={onClick}
        style={{
          ...styles.card,
          border: `3px solid ${isHovered ? borderColor : 'transparent'}`,
          ...(isHovered ? styles.cardHover : {})
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
      >
        <div>
          <div style={styles.icon}>
            {icon}
          </div>
          <h3 style={styles.cardTitle}>{title}</h3>
          <p style={styles.cardText}>{description}</p>
        </div>
        <button 
          style={{
            ...styles.button,
            ...buttonStyle,
            ...(isHovered ? { transform: 'scale(1.05)' } : {})
          }}
        >
          {buttonText}
        </button>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.innerContainer}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            Bienvenido a <span style={{ color: '#4a6fa5' }}>SERGEXA-IA</span>
          </h2>
          <p style={styles.subtitle}>
            Tu asistente personal con IA: gestión laboral, mensajes automáticos, notas de reuniones y entretenimiento.
          </p>
        </div>

        <div style={styles.grid}>
          {/* Tarjeta Laboral */}
          <Card
            icon={<FileText size={isMobile ? 45 : 60} style={{ color: '#4a6fa5' }} />}
            title="Laboral"
            description="Inventario, novedades de personal y generación automática de informes profesionales."
            borderColor="#4a6fa5"
            onClick={() => setModule('laboral')}
          />

          {/* Tarjeta Mensajes WhatsApp */}
          <Card
            icon={<MessageCircle size={isMobile ? 45 : 60} style={{ color: '#25D366' }} />}
            title="Mensajes WhatsApp"
            description="Escribe tus ideas desordenadas y la IA las convierte en mensajes perfectos con emojis y formato."
            buttonStyle={styles.whatsappButton}
            borderColor="#25D366"
            onClick={() => setModule('mensajes')}
          />

          {/* NUEVA Tarjeta Notas con IA */}
          <Card
            icon={<Mic size={isMobile ? 45 : 60} style={{ color: '#9b59b6' }} />}
            title="Notas con IA"
            description="Graba reuniones y obtén notas estructuradas automáticamente con puntos clave y acciones."
            buttonStyle={styles.notasButton}
            borderColor="#9b59b6"
            onClick={() => setModule('notas')}
          />

          {/* Tarjeta Ocio */}
          <Card
            icon={<Dice3 size={isMobile ? 45 : 60} style={{ color: '#4fc3a1' }} />}
            title="Ocio"
            description="Predicción de loterías, juegos y consejos diarios para desconectar."
            buttonStyle={styles.ocioButton}
            borderColor="#4fc3a1"
            onClick={() => setModule('ocio')}
          />
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: isMobile ? '2rem' : '3rem',
          padding: isMobile ? '1rem' : '2rem',
          background: '#f8f9fa',
          borderRadius: '15px',
          border: '2px solid #e9ecef'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '10px'
          }}>
            <Sparkles size={isMobile ? 20 : 24} style={{ color: '#4fc3a1' }} />
            <span style={{
              fontSize: isMobile ? '0.9rem' : '1rem',
              color: '#666',
              fontWeight: '500'
            }}>
              Asistente Personal con IA
            </span>
          </div>
          <p style={{
            fontSize: isMobile ? '0.8rem' : '0.9rem',
            color: '#888',
            margin: 0
          }}>
            Diseñado para simplificar tu día a día • Totalmente responsive • PWA optimizada
          </p>
        </div>
      </div>
    </div>
  );
}