import styled from 'styled-components';

const ProgressBar = ({ 
  value = 0, 
  max = 100, 
  height = '8px', 
  color,
  backgroundColor,
  showLabel = false,
  labelPosition = 'right',
  labelFormat,
  animated = true,
  striped = false,
  ...props 
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const formattedLabel = labelFormat 
    ? labelFormat(value, max, percentage) 
    : `${Math.round(percentage)}%`;
  
  return (
    <ProgressBarContainer {...props}>
      {showLabel && labelPosition === 'top' && (
        <ProgressLabel position={labelPosition}>{formattedLabel}</ProgressLabel>
      )}
      
      <ProgressBarTrack height={height} backgroundColor={backgroundColor}>
        <ProgressBarFill 
          percentage={percentage} 
          color={color}
          animated={animated}
          striped={striped}
        />
      </ProgressBarTrack>
      
      {showLabel && labelPosition !== 'top' && (
        <ProgressLabel position={labelPosition}>{formattedLabel}</ProgressLabel>
      )}
    </ProgressBarContainer>
  );
};

const ProgressBarContainer = styled.div`
  display: flex;
  flex-direction: ${props => props.labelPosition === 'top' || props.labelPosition === 'bottom' 
    ? 'column' 
    : 'row'
  };
  align-items: center;
  width: 100%;
  gap: ${props => props.labelPosition === 'left' || props.labelPosition === 'right' 
    ? '1rem' 
    : '0.5rem'
  };
`;

const ProgressBarTrack = styled.div`
  width: 100%;
  height: ${props => props.height || '8px'};
  background-color: ${props => props.backgroundColor || props.theme.isDark 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'
  };
  border-radius: 999px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  width: ${props => `${props.percentage}%`};
  background-color: ${props => props.color || props.theme.primary};
  border-radius: 999px;
  transition: width 0.3s ease;
  
  ${props => props.striped && `
    background-image: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.15) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.15) 75%,
      transparent 75%,
      transparent
    );
    background-size: 1rem 1rem;
  `}
  
  ${props => props.animated && props.striped && `
    @keyframes progress-bar-stripes {
      from { background-position: 1rem 0; }
      to { background-position: 0 0; }
    }
    animation: progress-bar-stripes 1s linear infinite;
  `}
`;

const ProgressLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.text};
  order: ${props => {
    if (props.position === 'left') return 0;
    if (props.position === 'top') return 0;
    return 2;
  }};
  min-width: ${props => 
    props.position === 'left' || props.position === 'right' ? '2.5rem' : 'auto'
  };
  text-align: ${props => {
    if (props.position === 'left') return 'right';
    if (props.position === 'right') return 'left';
    return 'center';
  }};
`;

export default ProgressBar;