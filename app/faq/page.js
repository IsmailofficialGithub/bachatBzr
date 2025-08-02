
"use client"
import Layout from "@/components/layout/Layout"
import React, { useState } from 'react';
import Head from 'next/head';

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const faqData = [
    {
      category: "Products",
      questions: [
        {
          question: "What types of fashion products do you sell?",
          answer: "We offer a wide range of fashion items including trendy shoes, stylish t-shirts, comfortable trousers, casual and formal shorts, dresses, accessories, and seasonal collections. Our products cater to men, women, and children with various sizes and styles."
        },
        {
          question: "How do I choose the right size for shoes and clothing?",
          answer: "Each product page includes a detailed size chart with measurements in both inches and centimeters. We recommend measuring yourself and comparing with our size guide. For shoes, measure your foot length and width. If you're between sizes, we generally recommend sizing up for comfort."
        },
        {
          question: "Are your products authentic and original?",
          answer: "Yes, all our products are 100% authentic and sourced directly from authorized distributors and brand partners. We guarantee the authenticity of every item we sell and provide certificates of authenticity for premium brands upon request."
        },
        {
          question: "Do you offer different colors and styles for the same product?",
          answer: "Absolutely! Most of our products are available in multiple colors, patterns, and styles. You can view all available options on the product page by clicking on color swatches or style variants."
        }
      ]
    },
    {
      category: "Delivery & Shipping",
      questions: [
        {
          question: "How long does delivery take?",
          answer: "Standard delivery takes 3-7 business days within the country. Express delivery (1-3 business days) is available for an additional fee. International shipping takes 7-14 business days depending on the destination. Delivery times may vary during peak seasons."
        },
        {
          question: "What are your shipping charges?",
          answer: "We offer free standard shipping on orders over $50. For orders below $50, standard shipping costs $5.99. Express shipping is $12.99 regardless of order value. International shipping rates vary by destination and are calculated at checkout."
        },
        {
          question: "Do you deliver internationally?",
          answer: "Yes, we ship to over 50 countries worldwide. International shipping rates and delivery times vary by destination. Some restrictions may apply to certain countries. Please check our shipping policy for a complete list of supported countries."
        },
        {
          question: "Can I track my order?",
          answer: "Yes! Once your order is shipped, you'll receive a tracking number via email and SMS. You can track your package in real-time using our order tracking page or the carrier's website. You'll also receive updates on key delivery milestones."
        },
        {
          question: "What if I'm not available during delivery?",
          answer: "If you're not available, the courier will attempt redelivery or leave the package with a neighbor (if authorized). You can also reschedule delivery or choose to pick up from the nearest courier facility. We'll notify you of all available options."
        }
      ]
    },
    {
      category: "Orders & Payment",
      questions: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers. For international orders, we also accept various local payment methods depending on your country."
        },
        {
          question: "Can I cancel or modify my order after placing it?",
          answer: "You can cancel or modify your order within 2 hours of placing it, provided it hasn't been processed for shipping. After this time, cancellations may not be possible, but you can return the items once received following our return policy."
        },
        {
          question: "Do you offer installment payment options?",
          answer: "Yes, we partner with several buy-now-pay-later services like Klarna and Afterpay. You can split your purchase into 3-4 interest-free installments. This option is available at checkout for eligible orders."
        }
      ]
    },
    {
      category: "Returns & Exchanges",
      questions: [
        {
          question: "What is your return policy?",
          answer: "We offer a 30-day return policy for unworn, unwashed items in original packaging with tags attached. Items must be in original condition. Return shipping is free for defective items, while customer returns may incur a return shipping fee."
        },
        {
          question: "How do I exchange an item for a different size or color?",
          answer: "To exchange an item, initiate a return request in your account and select 'Exchange' as the reason. Ship the item back to us, and once received, we'll send the replacement. If there's a price difference, we'll charge or refund accordingly."
        },
        {
          question: "How long does it take to process refunds?",
          answer: "Refunds are processed within 5-7 business days after we receive your returned item. The refund will be credited to your original payment method. Bank processing times may add an additional 3-5 business days."
        }
      ]
    },
    {
      category: "Account & Support",
      questions: [
        {
          question: "Do I need to create an account to make a purchase?",
          answer: "While you can checkout as a guest, creating an account offers benefits like order tracking, faster checkout, wish lists, exclusive member discounts, and easy returns management. Account creation is free and takes less than a minute."
        },
        {
          question: "How can I contact customer support?",
          answer: "You can reach our customer support team via live chat (available 24/7), email at help@muchatbzr.com, or phone at 1-800-FASHION. We typically respond to emails within 24 hours and live chat instantly during business hours."
        },
        {
          question: "Do you have a loyalty program?",
          answer: "Yes! Our MuchatBzr Rewards program offers points for every purchase, birthday discounts, early access to sales, and exclusive member-only deals. You earn 1 point for every $1 spent, and 100 points = $5 reward."
        }
      ]
    }
  ];

  const toggleAccordion = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFAQ = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      item =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <>
                <Layout headerStyle={3} footerStyle={1} breadcrumbTitle="Faq">

      

      <div style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        backgroundColor: '#f8fafc',
        minHeight: '100vh'
      }}>
        {/* Header Section */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '80px 20px 60px',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <h1 style={{
              fontSize: '3.5rem',
              fontWeight: '700',
              marginBottom: '20px',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              Frequently Asked Questions
            </h1>
            <p style={{
              fontSize: '1.2rem',
              opacity: '0.9',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Find quick answers to common questions about our fashion products, delivery, returns, and more. Can't find what you're looking for? Contact our support team!
            </p>
          </div>
        </div>

        {/* Search Section */}
        <div style={{
          maxWidth: '800px',
          margin: '-30px auto 0',
          padding: '0 20px',
          position: 'relative',
          zIndex: 10
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '8px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center'
          }}>
            <div style={{
              padding: '0 20px',
              color: '#64748b',
              fontSize: '20px'
            }}>
              🔍
            </div>
            <input
              type="text"
              placeholder="Search FAQ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                padding: '20px 20px 20px 0',
                fontSize: '16px',
                backgroundColor: 'transparent'
              }}
            />
          </div>
        </div>

        {/* FAQ Content */}
        <div style={{
          maxWidth: '800px',
          margin: '60px auto',
          padding: '0 20px'
        }}>
          {filteredFAQ.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🤔</div>
              <h3 style={{
                fontSize: '1.5rem',
                color: '#334155',
                marginBottom: '10px'
              }}>
                No results found
              </h3>
              <p style={{ color: '#64748b' }}>
                Try searching with different keywords or browse all categories below.
              </p>
            </div>
          ) : (
            filteredFAQ.map((category, categoryIndex) => (
              <div key={categoryIndex} style={{ marginBottom: '40px' }}>
                {/* Category Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '15px',
                    fontSize: '18px'
                  }}>
                    {categoryIndex === 0 ? '👕' : 
                     categoryIndex === 1 ? '🚚' : 
                     categoryIndex === 2 ? '💳' : 
                     categoryIndex === 3 ? '↩️' : '👤'}
                  </div>
                  <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: '#1e293b',
                    margin: 0
                  }}>
                    {category.category}
                  </h2>
                </div>

                {/* Questions */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}>
                  {category.questions.map((item, questionIndex) => {
                    const isOpen = openIndex === `${categoryIndex}-${questionIndex}`;
                    return (
                      <div key={questionIndex}>
                        <button
                          onClick={() => toggleAccordion(categoryIndex, questionIndex)}
                          style={{
                            width: '100%',
                            padding: '24px',
                            textAlign: 'left',
                            border: 'none',
                            backgroundColor: isOpen ? '#f1f5f9' : 'white',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: questionIndex < category.questions.length - 1 ? '1px solid #e2e8f0' : 'none'
                          }}
                          onMouseOver={(e) => {
                            if (!isOpen) {
                              e.target.style.backgroundColor = '#f8fafc';
                            }
                          }}
                          onMouseOut={(e) => {
                            if (!isOpen) {
                              e.target.style.backgroundColor = 'white';
                            }
                          }}
                        >
                          <span style={{
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            color: '#1e293b',
                            lineHeight: '1.5',
                            flex: 1,
                            paddingRight: '20px'
                          }}>
                            {item.question}
                          </span>
                          <div style={{
                            fontSize: '20px',
                            color: '#64748b',
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s ease'
                          }}>
                            ⌄
                          </div>
                        </button>
                        {isOpen && (
                          <div style={{
                            padding: '24px',
                            paddingTop: '0',
                            backgroundColor: '#f1f5f9',
                            borderBottom: questionIndex < category.questions.length - 1 ? '1px solid #e2e8f0' : 'none',
                            animation: 'fadeIn 0.3s ease'
                          }}>
                            <p style={{
                              color: '#475569',
                              lineHeight: '1.7',
                              margin: 0,
                              fontSize: '1rem'
                            }}>
                              {item.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Contact Support Section */}
        <div style={{
          backgroundColor: '#1e293b',
          color: 'white',
          padding: '60px 20px',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <h3 style={{
              fontSize: '2rem',
              fontWeight: '600',
              marginBottom: '16px'
            }}>
              Still have questions?
            </h3>
            <p style={{
              fontSize: '1.125rem',
              opacity: '0.8',
              marginBottom: '32px',
              lineHeight: '1.6'
            }}>
              Our friendly support team is here to help you 24/7. Get in touch and we'll get back to you as soon as possible.
            </p>
            <div style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
             <a href="/contact">
                 <button style={{
                padding: '14px 28px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#2563eb';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#3b82f6';
                e.target.style.transform = 'translateY(0)';
              }}>
                💬 Live Chat
              </button>
             </a>
              <a href="/contact">
                <button style={{
                padding: '14px 28px',
                backgroundColor: 'transparent',
                color: 'white',
                border: '2px solid white',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
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
                ✉️ Send Email
              </button>
              </a>
            </div>
          </div>
        </div>
      </div>
</Layout>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        @keyframes fadeIn {
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
          .support-buttons {
            flex-direction: column !important;
          }
        }

        @media (max-width: 480px) {
          h1 {
            font-size: 2rem !important;
          }
          .category-header {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .question-button {
            padding: 20px !important;
          }
        }
      `}</style>
    </>
  );
};

export default FAQPage;