import React, { useEffect, useRef } from 'react';

interface StripeButtonProps {
  buyButtonId: string;
}

const StripeButton = ({ buyButtonId }: StripeButtonProps): React.ReactElement => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (containerRef.current) {
      const stripeButton = document.createElement('stripe-buy-button');
      stripeButton.setAttribute('buy-button-id', buyButtonId);
      stripeButton.setAttribute(
        'publishable-key', 
        'pk_test_51QwMCCLNlRl0GRIdpZwzjPOStuKujVOsMnDE2SGUMHlv2UKriNYYgZuwO7uHsG2EgW2u5TAPafik0DRpAPjQEJbt00c21w8vON'
      );
      
      // Clear the container and append the button
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(stripeButton);
    }
  }, [buyButtonId]);

  return <div ref={containerRef} />;
}

export default StripeButton; 