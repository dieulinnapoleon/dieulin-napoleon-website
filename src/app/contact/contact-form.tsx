'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const REASONS = [
  'Career Opportunities',
  'Consulting Projects',
  'Startup Partnerships',
  'Speaking / Teaching',
  'Investment & Venture Conversations',
  'Haiti-Focused Initiatives',
  'General Inquiry',
];

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  organization: z.string().optional(),
  reason: z.string().min(1, 'Please select a reason'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to submit');
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-emerald/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} className="text-emerald" />
        </div>
        <h2 className="font-display text-2xl font-semibold text-navy mb-3">Message Sent</h2>
        <p className="text-gray-500 mb-8">
          Thank you for reaching out. I will respond within 48 hours.
        </p>
        <Button variant="outline" onClick={() => setStatus('idle')}>
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {status === 'error' && (
        <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-xl text-sm">
          <AlertCircle size={18} />
          Something went wrong. Please try again.
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-navy mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input id="name" {...register('name')} className="input-field" placeholder="Your name" />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-navy mb-1.5">
            Email <span className="text-red-500">*</span>
          </label>
          <input id="email" type="email" {...register('email')} className="input-field" placeholder="you@example.com" />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="organization" className="block text-sm font-medium text-navy mb-1.5">
          Organization <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input id="organization" {...register('organization')} className="input-field" placeholder="Your company or institution" />
      </div>

      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-navy mb-1.5">
          Reason for Contact <span className="text-red-500">*</span>
        </label>
        <select id="reason" {...register('reason')} className="input-field">
          <option value="">Select a reason...</option>
          {REASONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        {errors.reason && <p className="text-xs text-red-500 mt-1">{errors.reason.message}</p>}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-navy mb-1.5">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          rows={5}
          {...register('message')}
          className="input-field resize-none"
          placeholder="How can I help you?"
        />
        {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
      </div>

      <Button type="submit" loading={status === 'loading'} size="lg" className="w-full justify-center">
        <Send size={16} /> Send Message
      </Button>
    </form>
  );
}
