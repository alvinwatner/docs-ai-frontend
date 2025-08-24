import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface StepperProps {
  currentStep: number;
  steps: {
    title: string;
    description?: string;
  }[];
  className?: string;
}

export function Stepper({ currentStep, steps, className }: StepperProps) {
  return (
    <div className={cn('w-full', className)}>
      <nav aria-label="Progress" className="px-4 sm:px-0">
        <ol className="flex items-center">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            const isUpcoming = stepNumber > currentStep;

            return (
              <React.Fragment key={stepNumber}>
                <li className="flex flex-col items-center">
                  {/* Step Circle */}
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                      {
                        'bg-primary text-primary-foreground': isCompleted,
                        'bg-primary text-primary-foreground border-primary border-2':
                          isCurrent,
                        'bg-muted text-muted-foreground border-border border-2':
                          isUpcoming,
                      }
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span>{stepNumber}</span>
                    )}
                  </div>

                  {/* Step Label */}
                  <div className="mt-2 text-center">
                    <div
                      className={cn('text-sm font-medium transition-colors', {
                        'text-primary': isCompleted || isCurrent,
                        'text-muted-foreground': isUpcoming,
                      })}
                    >
                      {step.title}
                    </div>
                    {step.description && (
                      <div className="text-muted-foreground mt-1 text-xs">
                        {step.description}
                      </div>
                    )}
                  </div>
                </li>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-4">
                    <div
                      className={cn(
                        'h-0.5 transition-colors',
                        {
                          'bg-primary': stepNumber < currentStep,
                          'bg-border': stepNumber >= currentStep,
                        }
                      )}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}

// Preset configurations for different workflows
export const DOCUMENT_GENERATION_STEPS = [
  {
    title: 'Upload & Review',
    description: 'Upload template and detect variables',
  },
  {
    title: 'Fill Variables',
    description: 'Enter values for each variable',
  },
  {
    title: 'Export Document',
    description: 'Download as DOCX or PDF',
  },
];
