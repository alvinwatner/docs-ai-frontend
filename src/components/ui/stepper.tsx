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
        <ol className="flex items-center justify-between">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            const isUpcoming = stepNumber > currentStep;

            return (
              <li key={stepNumber} className="flex-1 flex items-center">
                <div className="flex flex-col items-center group">
                  {/* Step Circle */}
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                      {
                        'bg-primary text-primary-foreground': isCompleted,
                        'bg-primary text-primary-foreground border-2 border-primary': isCurrent,
                        'bg-muted text-muted-foreground border-2 border-border': isUpcoming,
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
                      className={cn(
                        'text-sm font-medium transition-colors',
                        {
                          'text-primary': isCompleted || isCurrent,
                          'text-muted-foreground': isUpcoming,
                        }
                      )}
                    >
                      {step.title}
                    </div>
                    {step.description && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {step.description}
                      </div>
                    )}
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-4 mt-[-16px]">
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
              </li>
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