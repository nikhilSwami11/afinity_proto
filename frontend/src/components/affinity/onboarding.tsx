'use client';

import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { t } from '@/lib/tokens';
import { promptSet } from './data';

type Answers = Record<string, string>;

type OnboardingProps = {
  answers: Answers;
  setAnswers: Dispatch<SetStateAction<Answers>>;
  onFinish: () => void;
};

export default function Onboarding({
  answers,
  setAnswers,
  onFinish
}: OnboardingProps) {
  const [step, setStep] = useState(0);
  const progress = ((step + 1) / (promptSet.length + 1)) * 100;

  if (step === promptSet.length) {
    return (
      <div className={cn('flex items-center justify-center px-6', t.page)}>
        <Card className={cn('w-full max-w-2xl', t.card)}>
          <CardHeader>
            <CardTitle className={cn('text-2xl', t.fg)}>
              Your writing feels reflective, independent, and open to unresolved
              questions.
            </CardTitle>
            <CardDescription className={t.fgMuted}>
              This is only an initial reading. Your position evolves as you
              publish more thoughts.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div>
              <div className={cn('mb-2 text-sm', t.fgMuted)}>
                Does this feel accurate?
              </div>
              <div className="flex flex-wrap gap-3">
                <Button className={t.btnPrimary}>Yes</Button>
                <Button variant="outline" className={t.btnOutline}>
                  Somewhat
                </Button>
                <Button variant="outline" className={t.btnOutline}>
                  Not really
                </Button>
              </div>
            </div>

            <div>
              <div className={cn('mb-2 text-sm', t.fgMuted)}>
                Add one more thought to refine your position
              </div>
              <Textarea
                value={answers.refinement || ''}
                onChange={(e) =>
                  setAnswers((prev) => ({
                    ...prev,
                    refinement: e.target.value
                  }))
                }
                placeholder="What did we miss about how you see the world?"
                className={cn('min-h-36 rounded-2xl', t.input)}
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={onFinish} className={t.btnPrimary}>
                Enter the space <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center justify-center px-6', t.page)}>
      <Card className={cn('w-full max-w-3xl', t.card)}>
        <CardHeader>
          <div className={cn('mb-3 flex items-center justify-between text-sm', t.fgMuted)}>
            <span>
              Thought {step + 1} of {promptSet.length}
            </span>
            <span>Write naturally. A few honest sentences are enough.</span>
          </div>

          <Progress value={progress} className={cn('mb-6 h-2', 'bg-app-surface-hover')} />

          <CardTitle className={cn('text-3xl leading-tight', t.fg)}>
            {promptSet[step]}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Textarea
            value={answers[String(step)] || ''}
            onChange={(e) =>
              setAnswers((prev) => ({
                ...prev,
                [String(step)]: e.target.value
              }))
            }
            placeholder="Start with whatever feels true."
            className={cn(
              'min-h-72 rounded-3xl p-5 text-base leading-7',
              t.input
            )}
          />

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className={t.btnGhost}
            >
              Back
            </Button>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep((s) => s + 1)}
                className={t.btnOutline}
              >
                Skip
              </Button>

              <Button
                onClick={() => setStep((s) => s + 1)}
                className={t.btnPrimary}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
