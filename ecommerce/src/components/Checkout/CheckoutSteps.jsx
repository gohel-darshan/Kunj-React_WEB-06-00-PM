import './CheckoutSteps.css';

const CheckoutSteps = ({ steps, activeStep }) => {
  return (
    <div className="checkout-steps">
      <div className="steps-container">
        {steps.map((step) => (
          <div 
            key={step.id} 
            className={`step ${step.id === activeStep ? 'active' : ''} ${step.id < activeStep ? 'completed' : ''}`}
          >
            <div className="step-icon">
              {step.id < activeStep ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ) : (
                step.id
              )}
            </div>
            <div className="step-name">{step.name}</div>
            
            {step.id < steps.length && (
              <div className={`step-connector ${step.id < activeStep ? 'completed' : ''}`}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckoutSteps;