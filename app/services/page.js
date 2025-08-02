"use client";
import Layout from "@/components/layout/Layout"
import React, { useState } from 'react';
import Head from 'next/head';
import Link from "next/link";

const ServicesPage = () => {
  const [activeService, setActiveService] = useState(null);

  const services = [
    {
      id: 1,
      title: "Personal Styling Consultation",
      icon: "👗",
      description: "Get personalized fashion advice from our expert stylists",
      longDescription: "Our professional stylists will work with you one-on-one to understand your style preferences, body type, and lifestyle needs. We'll help you create the perfect wardrobe that reflects your personality and fits your budget.",
      features: ["Virtual or in-person consultations", "Style assessment & analysis", "Wardrobe planning", "Color palette recommendations", "Shopping guidance"],
      price: "Starting from $99",
      duration: "60-90 minutes"
    },
    {
      id: 2,
      title: "Custom Tailoring & Alterations",
      icon: "✂️",
      description: "Perfect fit guaranteed with our professional tailoring services",
      longDescription: "Transform your clothing with our expert tailoring services. Whether you need alterations for a perfect fit or custom-made pieces, our skilled tailors ensure every garment fits you perfectly.",
      features: ["Hemming & adjustments", "Custom fitting", "Size modifications", "Style alterations", "Repair services"],
      price: "Starting from $25",
      duration: "3-7 days"
    },
    {
      id: 3,
      title: "Express Delivery & Same-Day Shipping",
      icon: "🚀",
      description: "Get your fashion fixes delivered lightning fast",
      longDescription: "Need your outfit urgently? Our express delivery service ensures you get your fashion items when you need them most. Available in major cities with same-day and next-day delivery options.",
      features: ["Same-day delivery", "Express shipping", "Real-time tracking", "Flexible delivery slots", "Priority handling"],
      price: "Starting from $12.99",
      duration: "Same day - 24 hours"
    },
    {
      id: 4,
      title: "Size Exchange Program",
      icon: "🔄",
      description: "Free size exchanges to ensure the perfect fit",
      longDescription: "Not sure about sizing? Our hassle-free size exchange program lets you order multiple sizes and return the ones that don't fit, or easily exchange for a different size within 30 days.",
      features: ["Free size exchanges", "30-day return window", "Pre-paid return labels", "Quick processing", "Size consultation"],
      price: "FREE",
      duration: "Instant processing"
    },
    {
      id: 5,
      title: "Virtual Try-On Technology",
      icon: "📱",
      description: "See how clothes look on you before buying",
      longDescription: "Experience the future of online shopping with our AR-powered virtual try-on technology. Upload your photo or use your camera to see how different outfits look on you before making a purchase.",
      features: ["AR-powered fitting", "Real-time preview", "Multiple angles view", "Size recommendations", "Share with friends"],
      price: "FREE",
      duration: "Instant"
    },
    {
      id: 6,
      title: "Wardrobe Refresh Service",
      icon: "👔",
      description: "Complete wardrobe makeover by fashion experts",
      longDescription: "Let our fashion experts transform your entire wardrobe. We'll assess your current clothing, identify gaps, and curate new pieces that work together to create a cohesive, stylish wardrobe.",
      features: ["Wardrobe audit", "Style consultation", "Curated selections", "Mix & match guide", "Seasonal updates"],
      price: "Starting from $199",
      duration: "2-3 weeks"
    },
    {
      id: 7,
      title: "Loyalty Rewards Program",
      icon: "⭐",
      description: "Earn points and unlock exclusive benefits",
      longDescription: "Join our exclusive loyalty program and earn points with every purchase. Unlock VIP benefits, early access to sales, birthday discounts, and exclusive member-only collections.",
      features: ["Points on every purchase", "VIP member benefits", "Early sale access", "Birthday rewards", "Exclusive collections"],
      price: "FREE to join",
      duration: "Lifetime membership"
    },
    {
      id: 8,
      title: "Personal Shopping Assistant",
      icon: "🛍️",
      description: "Dedicated shopping assistant for personalized service",
      longDescription: "Get your own personal shopping assistant who understands your style and preferences. They'll curate selections, notify you of new arrivals that match your taste, and provide personalized recommendations.",
      features: ["Dedicated assistant", "Personalized curation", "New arrival alerts", "Style matching", "Priority support"],
      price: "Starting from $49/month",
      duration: "Ongoing service"
    }
  ];

  const additionalServices = [
    {
      title: "Gift Wrapping & Cards",
      icon: "🎁",
      description: "Beautiful gift wrapping with personalized messages"
    },
    {
      title: "Clothing Care Guide",
      icon: "🧽",
      description: "Expert tips on maintaining your fashion items"
    },
    {
      title: "Style Blog & Trends",
      icon: "📝",
      description: "Latest fashion trends and styling tips"
    },
    {
      title: "Mobile App Shopping",
      icon: "📲",
      description: "Shop on-the-go with our mobile application"
    }
  ];

  return (
    <>
                  <Layout headerStyle={3} footerStyle={1} breadcrumbTitle="Faq">


      <div style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        backgroundColor: '#f8fafc',
        minHeight: '100vh'
      }}>
        {/* Hero Section */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '100px 20px 80px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            pointerEvents: 'none'
          }}></div>
          
          <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 2
          }}>
            <h1 style={{
              fontSize: '4rem',
              fontWeight: '700',
              marginBottom: '24px',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              lineHeight: '1.1'
            }}>
              Premium Fashion Services
            </h1>
            <p style={{
              fontSize: '1.3rem',
              opacity: '0.9',
              lineHeight: '1.6',
              maxWidth: '700px',
              margin: '0 auto 40px'
            }}>
              Experience luxury fashion shopping with our comprehensive range of personalized services designed to make your style journey exceptional.
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              flexWrap: 'wrap'
            }}>
             <Link href="/coming-soon" >
              <button style={{
                padding: '16px 32px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.3)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
                e.target.style.transform = 'translateY(0)';
              }}>
                Explore Services
              </button>
             </Link>
             <Link href="/contact" >
              <button style={{
                padding: '16px 32px',
                backgroundColor: 'white',
                color: '#667eea',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}>
                Contact Us
              </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Services Grid */}
        <div style={{
          maxWidth: '1200px',
          margin: '-40px auto 0',
          padding: '0 20px',
          position: 'relative',
          zIndex: 10
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '30px',
            marginBottom: '80px'
          }}>
            {services.map((service, index) => (
              <div
                key={service.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '20px',
                  padding: '30px',
                  boxShadow: activeService === service.id 
                    ? '0 20px 60px rgba(0,0,0,0.15)' 
                    : '0 8px 30px rgba(0,0,0,0.08)',
                  transition: 'all 0.4s ease',
                  cursor: 'pointer',
                  transform: activeService === service.id ? 'translateY(-8px)' : 'translateY(0)',
                  border: activeService === service.id ? '2px solid #667eea' : '2px solid transparent'
                }}
                onClick={() => setActiveService(activeService === service.id ? null : service.id)}
                onMouseOver={(e) => {
                  if (activeService !== service.id) {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.12)';
                  }
                }}
                onMouseOut={(e) => {
                  if (activeService !== service.id) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)';
                  }
                }}
              >
                {/* Service Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    fontSize: '3rem',
                    marginRight: '20px',
                    flexShrink: 0
                  }}>
                    {service.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: '#1e293b',
                      marginBottom: '8px',
                      lineHeight: '1.3'
                    }}>
                      {service.title}
                    </h3>
                    <p style={{
                      color: '#64748b',
                      fontSize: '1rem',
                      lineHeight: '1.5',
                      margin: 0
                    }}>
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Price and Duration */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                  padding: '12px 16px',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '10px'
                }}>
                  <div>
                    <span style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: '#3b82f6'
                    }}>
                      {service.price}
                    </span>
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#64748b'
                  }}>
                    ⏱️ {service.duration}
                  </div>
                </div>

                {/* Expandable Content */}
                {activeService === service.id && (
                  <div style={{
                    animation: 'slideIn 0.3s ease',
                    borderTop: '1px solid #e2e8f0',
                    paddingTop: '20px'
                  }}>
                    <p style={{
                      color: '#475569',
                      lineHeight: '1.6',
                      marginBottom: '20px'
                    }}>
                      {service.longDescription}
                    </p>
                    
                    <h4 style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: '#1e293b',
                      marginBottom: '12px'
                    }}>
                      What's Included:
                    </h4>
                    
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0
                    }}>
                      {service.features.map((feature, idx) => (
                        <li key={idx} style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '8px',
                          color: '#475569'
                        }}>
                          <span style={{
                            color: '#10b981',
                            marginRight: '10px',
                            fontSize: '16px'
                          }}>
                            ✓
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button style={{
                      marginTop: '20px',
                      padding: '12px 24px',
                      backgroundColor: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      width: '100%'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#5a67d8';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = '#667eea';
                    }}>
                      Get Started
                    </button>
                  </div>
                )}

                {/* Expand/Collapse Indicator */}
                <div style={{
                  textAlign: 'center',
                  marginTop: '15px'
                }}>
                  <span style={{
                    color: '#94a3b8',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {activeService === service.id ? 'Click to collapse' : 'Click to learn more'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Services */}
        <div style={{
          backgroundColor: 'white',
          padding: '80px 20px',
          borderTop: '1px solid #e2e8f0'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '60px'
            }}>
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: '#1e293b',
                marginBottom: '16px'
              }}>
                Additional Services
              </h2>
              <p style={{
                fontSize: '1.1rem',
                color: '#64748b',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Discover more ways we enhance your fashion shopping experience
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '30px'
            }}>
              {additionalServices.map((service, index) => (
                <div
                  key={index}
                  style={{
                    textAlign: 'center',
                    padding: '30px 20px',
                    borderRadius: '16px',
                    border: '2px solid #f1f5f9',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#667eea';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#f1f5f9';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    fontSize: '2.5rem',
                    marginBottom: '16px'
                  }}>
                    {service.icon}
                  </div>
                  <h4 style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: '#1e293b',
                    marginBottom: '8px'
                  }}>
                    {service.title}
                  </h4>
                  <p style={{
                    color: '#64748b',
                    lineHeight: '1.5',
                    margin: 0
                  }}>
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          color: 'white',
          padding: '80px 20px',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <h3 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              marginBottom: '20px'
            }}>
              Ready to Experience Premium Fashion?
            </h3>
            <p style={{
              fontSize: '1.2rem',
              opacity: '0.9',
              marginBottom: '40px',
              lineHeight: '1.6'
            }}>
              Join thousands of satisfied customers who trust us with their fashion needs. 
              Start your premium shopping experience today!
            </p>
            <div style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Link href="/shop" style={{
                padding: '18px 36px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#2563eb';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#3b82f6';
                e.target.style.transform = 'translateY(0)';
              }}>
                🛍️ Start Shopping
              </Link>
              <Link href={'/contact'} style={{
                padding: '18px 36px',
                backgroundColor: 'transparent',
                color: 'white',
                border: '2px solid white',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.color = '#1e293b';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(0)';
              }}>
                💬 Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          h1 {
            font-size: 2.5rem !important;
          }
          
          h2 {
            font-size: 2rem !important;
          }
          
          .service-grid {
            grid-template-columns: 1fr !important;
          }
          
          .cta-buttons {
            flex-direction: column !important;
          }
        }

        @media (max-width: 480px) {
          h1 {
            font-size: 2rem !important;
          }
          
          .service-card {
            padding: 20px !important;
          }
          
          .hero-section {
            padding: 60px 20px 40px !important;
          }
        }
      `}</style>
      </Layout>
    </>
  );
};

export default ServicesPage;