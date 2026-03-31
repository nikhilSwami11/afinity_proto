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
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
        <Card className="w-full max-w-2xl rounded-[32px] border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-2xl">
              Your writing feels reflective, independent, and open to unresolved
              questions.
            </CardTitle>
            <CardDescription className="text-slate-400">
              This is only an initial reading. Your position evolves as you
              publish more thoughts.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div>
              <div className="mb-2 text-sm text-slate-400">
                Does this feel accurate?
              </div>
              <div className="flex flex-wrap gap-3">
                <Button className="rounded-2xl bg-white text-slate-950 hover:bg-slate-200">
                  Yes
                </Button>
                <Button
                  variant="outline"
                  className="rounded-2xl border-white/15 bg-white/5 text-slate-100 hover:bg-white/10"
                >
                  Somewhat
                </Button>
                <Button
                  variant="outline"
                  className="rounded-2xl border-white/15 bg-white/5 text-slate-100 hover:bg-white/10"
                >
                  Not really
                </Button>
              </div>
            </div>

            <div>
              <div className="mb-2 text-sm text-slate-400">
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
                className="min-h-36 rounded-2xl border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-500"
              />
            </div>

            <div className="flex justify-end">
              <Button
                onClick={onFinish}
                className="rounded-2xl bg-white text-slate-950 hover:bg-slate-200"
              >
                Enter the space <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
      <Card className="w-full max-w-3xl rounded-[32px] border-white/10 bg-white/5">
        <CardHeader>
          <div className="mb-3 flex items-center justify-between text-sm text-slate-400">
            <span>
              Thought {step + 1} of {promptSet.length}
            </span>
            <span>Write naturally. A few honest sentences are enough.</span>
          </div>

          <Progress value={progress} className="mb-6 h-2 bg-white/10" />

          <CardTitle className="text-3xl leading-tight">
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
            className="min-h-72 rounded-3xl border-white/10 bg-white/5 p-5 text-base leading-7 text-slate-100 placeholder:text-slate-500"
          />

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="rounded-2xl text-slate-300 hover:bg-white/10 hover:text-white"
            >
              Back
            </Button>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep((s) => s + 1)}
                className="rounded-2xl border-white/15 bg-white/5 text-slate-100 hover:bg-white/10"
              >
                Skip
              </Button>

              <Button
                onClick={() => setStep((s) => s + 1)}
                className="rounded-2xl bg-white text-slate-950 hover:bg-slate-200"
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