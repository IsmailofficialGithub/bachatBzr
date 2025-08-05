"use client";
import React, { useState, useEffect } from 'react';
import Head from 'next/head';

const ComingSoonPage = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 10,
    hours: 23,
    minutes: 58,
    seconds: 57
  });

  const [email, setEmail] = useState('');

  useEffect(() => {
    // Set target date (you can modify this)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 1);
    targetDate.setHours(23, 58, 57);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        const days = Math.floor(distance / (100 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle email subscription here
    alert('Thank you for subscribing!');
    setEmail('');
  };

  return (
    <>
      <Head>
        <title>Coming Soon - MuchatBzr</title>
        <meta name="description" content="We are launching soon. Subscribe to get notified!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div style={{
        minHeight: '100vh',
        backgroundImage: 'url("/assets/img/banner/comming-soon-1.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        {/* Dark overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1
        }}></div>

        {/* Logo */}
        <div style={{
          position: 'absolute',
          top: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            {/* Placeholder logo - replace with your actual logo */}
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '10px',
              fontSize: '20px'
            }}>
             <img src="/assets/img/logo/logo1.png" alt="Logo" width={150}/>
            </div>
            
          </div>
        </div>

        {/* Main content */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          color: 'white',
          maxWidth: '800px',
          padding: '0 20px'
        }}>
          {/* Coming Soon text */}
          <p style={{
            fontSize: '18px',
            marginBottom: '10px',
            marginTop:"60px",
            opacity: '0.9',
             color:'#0dcaf0',
            fontWeight: '400'
          }}>
            Coming Soon!
          </p>

          {/* Main heading */}
          <h1 style={{
            fontSize: '4rem',
            fontWeight: 'bold',
            marginBottom: '60px',
            lineHeight: '1.1',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}>
            We are Coming Soon
          </h1>

          {/* Countdown timer */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            marginBottom: '80px',
            flexWrap: 'wrap'
          }}>
            {[
              { value: timeLeft.days, label: 'Days' },
              { value: timeLeft.hours, label: 'Hours' },
              { value: timeLeft.minutes, label: 'Minutes' },
              { value: timeLeft.seconds, label: 'Seconds' }
            ].map((item, index) => (
              <div key={index} style={{
                textAlign: 'center',
                minWidth: '80px'
              }}>
                <div style={{
                  fontSize: '4rem',
                  fontWeight: 'bold',
                  lineHeight: '1',
                  marginBottom: '10px',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                }}>
                  {item.value}
                </div>
                <div style={{
                  fontSize: '18px',
                  opacity: '0.9',
                  fontWeight: '500'
                }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {/* Email subscription form */}
          <form onSubmit={handleSubscribe} style={{
            display: 'flex',
            maxWidth: '500px',
            margin: '0 auto',
            gap: '0',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              flex: '1',
              position: 'relative',
              backgroundColor: 'white'
            }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                style={{
                  width: '100%',
                  padding: '18px 20px',
                  paddingLeft: '50px',
                  border: 'none',
                  outline: 'none',
                  fontSize: '16px',
                  backgroundColor: 'white',
                  color: '#333'
                }}
              />
              {/* Email icon */}
              <div style={{
                position: 'absolute',
                left: '18px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#999',
                fontSize: '18px'
              }}>
                ✉️
              </div>
            </div>
            <button
              type="submit"
              style={{
                padding: '18px 30px',
                backgroundColor: '#8B9DC3',
                border: 'none',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
                alignItems: 'center',
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#7A8DB0';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#8B9DC3';
              }}
            >
              Subscribe Now
              <span style={{ fontSize: '14px' }}>→</span>
            </button>
          </form>
        </div>
      </div>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        @media (max-width: 768px) {
          h1 {
            font-size: 2.5rem !important;
          }
          
          .countdown-item {
            font-size: 2.5rem !important;
          }
          
          form {
            flex-direction: column !important;
            border-radius: 8px !important;
          }
          
          button {
            border-radius: 0 0 8px 8px !important;
          }
          
          input {
            border-radius: 8px 8px 0 0 !important;
          }
        }

        @media (max-width: 480px) {
          .countdown-container {
            gap: 20px !important;
          }
          
          h1 {
            font-size: 2rem !important;
            margin-bottom: 40px !important;
          }
          
          .countdown-item {
            font-size: 2rem !important;
            min-width: 60px !important;
          }
        }
      `}</style>
    </>
  );
};

export default ComingSoonPage;