function NoProductsAvailable({  message = "No products available at the moment" }) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'auto', // Takes full viewport height
        width: '100%',      // Takes full width
        padding: '20px',
        textAlign: 'center',
        backgroundColor: '#f8f9fa', // Light gray background
        boxSizing: 'border-box',
      }}>
        <div style={{
          fontSize: 'clamp(48px, 8vw, 64px)',
          marginBottom:"4rem" ,
          marginTop:"2rem",// Responsive font size
          color: '#6c757d',
          marginBottom: '3rem'
        }}>
          ☹️
        </div>
        
        <h2 style={{ 
          fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', // Responsive heading
          fontWeight: '500',
          margin: '0 0 12px 0',
          color: '#343a40'
        }}>
          {message}
        </h2>
        
        <p style={{ 
          color: '#6c757d',
          maxWidth: '500px',
          width: '90%', // Responsive width
          margin: '0 auto 24px',
          lineHeight: '1.5',
          fontSize: 'clamp(0.9rem, 2vw, 1rem)' // Responsive text
        }}>
          We couldn't find any products matching your criteria. Please check back later or try adjusting your search.
        </p>
        
      </div>
    );
  }
  
  export default NoProductsAvailable;