import { useRouter } from 'next/navigation';

const EmptyCart = () => {
  const router = useRouter();

  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9fafb',
      padding: '3rem 1rem',
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '28rem',
        margin: '0 auto',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{
          width: '6rem',
          height: '6rem',
          margin: '0 auto 1.5rem auto'
        }}>
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            style={{
              color: '#d1d5db',
              width: '100%',
              height: '100%'
            }}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" 
            />
          </svg>
        </div>
        
        <h3 style={{
          fontSize: '1.5rem',
          lineHeight: '2rem',
          fontWeight: '700',
          color: '#1f2937',
          marginBottom: '0.5rem'
        }}>
          Your BachatBazar Cart is Empty
        </h3>
        
        <p style={{
          color: '#4b5563',
          marginBottom: '1.5rem'
        }}>
          Looks like you haven't added any items to your cart yet.
        </p>
        
        <button
          onClick={() => router.push('/shop')}
          style={{
            width: '100%',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#f9a253',
            color: 'white',
            fontWeight: '500',
            borderRadius: '0.5rem',
            transition: 'background-color 0.2s',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            cursor: 'pointer',
            border: 'none'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e57917'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f9a253'}
        >
          Continue Shopping
        </button>
        
        <div style={{
          marginTop: '1.5rem',
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
          color: '#6b7280'
        }}>
          <p>Need help? <a href="/contact" style={{
            color: '#2563eb',
            textDecoration: 'none'
          }}
          onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
          onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
          >Contact us</a></p>
        </div>
      </div>
    </div>
  );
};

export default EmptyCart;