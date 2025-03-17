import { Box } from "@mui/material";
import { Key } from "react";

const shapeStyles = { width: '0.5rem', height: '0.5rem' };
const shapeCircleStyles = { borderRadius: '50%' };

interface StepperCircleProps {
  active: boolean,
}

function StepperCircle({active}: StepperCircleProps): React.ReactNode {
    return <Box component="span"
                sx={{ 
                  bgcolor: (active) ? 'primary.main' : 'lightgray',
                  ...shapeStyles, 
                  ...shapeCircleStyles,}} />
}

interface StepperProgressProps {
  numSteps: number
  currentStep: number
}

export default function StepperProgress({numSteps, currentStep}: StepperProgressProps) {
  let stepperDots: JSX.Element[] = [];
  for (let i=0; i < numSteps; i++) {
    stepperDots.push(
      <StepperCircle active={(i <= currentStep)} key={'stepdot' + i} />
    )
  }
  return (
    <Box display={'flex'} flexDirection={'row'} gap={0.5} 
        role="progressbar" aria-valuemin={0} 
        aria-valuemax={numSteps} aria-valuenow={currentStep}
        aria-valuetext={`Step ${currentStep+1}`}
        >
      {stepperDots}
    </Box>
  )
}