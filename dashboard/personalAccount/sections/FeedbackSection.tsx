import React, { useState } from 'react';
import { FeedbackItem, FeedbackType } from '../types';

interface FeedbackSectionProps {
  feedbackList: FeedbackItem[];
  onSubmitFeedback: (type: FeedbackType, title: string, details: string) => Promise<boolean>;
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  feedbackList,
  onSubmitFeedback,
}) => {
  const [type, setType] = useState<FeedbackType>('Idea');
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (title.trim().length < 3) {
      newErrors.title = 'Enter a title of at least 3 characters.';
    }
    if (details.trim().length < 10) {
      newErrors.details = 'Add a few details, at least 10 characters.';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    const ok = await onSubmitFeedback(type, title.trim(), details.trim());
    setSubmitting(false);
    if (ok) {
      setTitle('');
      setDetails('');
      setErrors({});
    }
  };

  const getStatusChip = (status: FeedbackItem['status']) => {
    switch (status) {
      case 'In review':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--warn)]/15 text-[var(--warn)]">
            In review
          </span>
        );
      case 'Responded':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--ok)]/15 text-[var(--ok)]">
            Responded
          </span>
        );
      case 'Received':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--info)]/15 text-[var(--info)]">
            Received
          </span>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Share Feedback Form */}
      <div className="bg-[var(--card)] border-2 border-slate-300 dark:border-slate-700/80 border-b-4 border-b-slate-400 dark:border-b-slate-600 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-200">
        <h3 className="font-bold text-base text-[var(--fg)] mb-4">Share feedback</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <span className="block text-xs font-semibold text-[var(--mut2)] mb-2">Type</span>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'Idea' as FeedbackType, label: 'Idea', emoji: '💡' },
                { id: 'Bug' as FeedbackType, label: 'Bug', emoji: '🐛' },
                { id: 'Request' as FeedbackType, label: 'Request', emoji: '✨' },
              ].map(({ id, label, emoji }) => {
                const isSelected = type === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setType(id)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-pink-500 to-rose-600 border-pink-600 text-white shadow-md ring-2 ring-pink-500/30 scale-[1.02]'
                        : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-pink-500 hover:text-[var(--fg)] shadow-xs'
                    }`}
                  >
                    <span>{emoji}</span>
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--mut2)] mb-1">Title</label>
            <input
              type="text"
              maxLength={80}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Short summary"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-[var(--inbg)] text-[var(--fg)] text-sm focus:border-pink-500 outline-none"
            />
            {errors.title && <p className="text-xs text-[var(--bad)] mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--mut2)] mb-1">Details</label>
            <textarea
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="What should we know?"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-[var(--inbg)] text-[var(--fg)] text-sm focus:border-pink-500 outline-none resize-y"
            />
            {errors.details && <p className="text-xs text-[var(--bad)] mt-1">{errors.details}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 text-white text-sm font-bold rounded-xl hover:opacity-95 shadow-md shadow-pink-500/20 border-b-4 border-b-pink-700 active:border-b-0 transition-all cursor-pointer"
          >
            {submitting ? 'Sending...' : 'Send feedback'}
          </button>
        </form>
      </div>

      {/* Your Feedback Submissions */}
      <div className="bg-[var(--card)] border-2 border-slate-300 dark:border-slate-700/80 border-b-4 border-b-slate-400 dark:border-b-slate-600 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-200 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-[var(--fg)]">Your feedback</h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-slate-300 dark:border-slate-700">
              {feedbackList.length} items
            </span>
          </div>

          {feedbackList.length ? (
            <div className="space-y-3">
              {feedbackList.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-white/95 dark:bg-slate-900/80 border-2 border-slate-300 dark:border-slate-700/90 border-b-[3px] border-b-slate-400 dark:border-b-slate-600 shadow-xs hover:border-pink-500 hover:border-b-pink-600 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between gap-3 text-sm"
                >
                  <div>
                    <b className="font-semibold text-[var(--fg)] block">
                      {item.type}: {item.title}
                    </b>
                  </div>
                  {getStatusChip(item.status)}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-[var(--mut2)]">
              Nothing submitted yet.
            </div>
          )}
        </div>

        <p className="text-xs text-[var(--mut2)] pt-4 border-t-2 border-slate-200 dark:border-slate-800">
          We read every single submission and prioritize product roadmap features from community
          ideas.
        </p>
      </div>
    </div>
  );
};

export default FeedbackSection;
