import React from 'react';
import { Star, ExternalLink, GitBranch } from 'lucide-react';
import { DashboardState, ProductKey } from '../types';
import { PROD_INFO } from '../constants';
import { ago } from '../utils';

interface ProductsSectionProps {
  state: DashboardState;
  onOpenProduct: (id: ProductKey) => void;
  onToggleFavorite: (id: ProductKey) => void;
  onConnectGithub: () => void;
  onOpenActivityDrawer: () => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  state,
  onOpenProduct,
  onToggleFavorite,
  onConnectGithub,
  onOpenActivityDrawer,
}) => {
  const productIds = (Object.keys(PROD_INFO) as ProductKey[]).sort(
    (a, b) => (state.fav[b] ? 1 : 0) - (state.fav[a] ? 1 : 0)
  );

  // Sparkline renderer with product-specific accent color
  const renderSparkline = (id: ProductKey) => {
    const seed = id.length * 7;
    const pts = Array.from({ length: 8 }, (_, i) => 10 + ((seed * (i + 3) * 13) % 17) + i * 1.5);
    const mx = Math.max(...pts);
    const mn = Math.min(...pts);
    const P = pts.map((v, i) => [2 + i * (76 / 7), 30 - ((v - mn) / (mx - mn || 1)) * 24]);
    const L = P[P.length - 1];
    const accent = PROD_INFO[id].accentColor;

    return (
      <svg className="w-20 h-9 flex-shrink-0" viewBox="0 0 80 34" aria-hidden="true">
        <polyline
          points={P.map((q) => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(' ')}
          fill="none"
          stroke="var(--mut2)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={L[0].toFixed(1)} cy={L[1].toFixed(1)} r="3" fill={accent} />
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {productIds.map((id) => {
          const p = PROD_INFO[id];
          const isHidden = state.apps[id] === false;
          const isFav = !!state.fav[id];
          const isLidbridgeUnlinked = id === 'lidbridge' && !state.conn.github;
          const metricValue = p.getValue(state.stats, state.conn);

          return (
            <div
              key={id}
              className={`bg-[var(--card)] border-2 border-slate-300 dark:border-slate-700/80 border-b-4 border-b-slate-400 dark:border-b-slate-600 rounded-2xl p-6 shadow-md hover:shadow-xl hover:border-pink-500 hover:border-b-pink-600 flex flex-col justify-between transition-all duration-200 relative overflow-hidden group ${
                isHidden ? 'opacity-65' : ''
              }`}
            >
              {/* Product Top Accent Line */}
              <div
                className="absolute top-0 left-0 right-0 h-1 transition-opacity opacity-75 group-hover:opacity-100"
                style={{ backgroundColor: p.accentColor }}
              />

              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: p.accentColor }}
                    />
                    <h3 className="text-lg font-bold text-[var(--fg)]">{p.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {isHidden && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--raised)] text-[var(--mut2)]">
                        Hidden
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        isLidbridgeUnlinked
                          ? 'bg-[var(--warn)]/15 text-[var(--warn)]'
                          : 'bg-[var(--ok)]/15 text-[var(--ok)]'
                      }`}
                    >
                      <i className="w-1.5 h-1.5 rounded-full bg-current" />
                      {isLidbridgeUnlinked ? 'Not linked' : 'Active'}
                    </span>
                  </div>
                </div>
                <div className="text-xs font-bold mb-1.5" style={{ color: p.accentColor }}>
                  {p.tagline}
                </div>
                <p className="text-sm text-[var(--mut)] mb-6 leading-relaxed">{p.desc}</p>
              </div>

              <div className="pt-4 border-t border-[var(--line)] flex flex-wrap items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-[var(--mut2)] uppercase tracking-wider block">
                    {p.metric}
                  </span>
                  <strong className="text-2xl font-black text-[var(--fg)] block mt-0.5">
                    {metricValue}
                  </strong>
                </div>

                {renderSparkline(id)}

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={() => onToggleFavorite(id)}
                    className={`w-9 h-9 rounded-xl border border-[var(--line)] flex items-center justify-center transition-colors ${
                      isFav
                        ? 'text-[var(--brand)] border-[var(--brand)] bg-[var(--brand)]/10'
                        : 'text-[var(--mut2)] hover:border-[var(--mut2)]'
                    }`}
                    title={isFav ? 'Unpin' : 'Pin'}
                  >
                    <Star className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                  </button>

                  {isLidbridgeUnlinked ? (
                    <button
                      onClick={onConnectGithub}
                      className="px-4 py-2 bg-[var(--brand)] text-white text-sm font-bold rounded-xl hover:opacity-95 shadow-sm transition-all"
                    >
                      Link GitHub
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenProduct(id)}
                      className="px-4 py-2 bg-[var(--raised)] border border-[var(--line)] text-sm font-bold rounded-xl text-[var(--fg)] hover:border-[var(--mut2)] transition-colors"
                    >
                      Open
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Activity Section */}
      <div className="bg-[var(--card)] border-2 border-slate-300 dark:border-slate-700/80 border-b-4 border-b-slate-400 dark:border-b-slate-600 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base text-[var(--fg)]">Recent activity</h3>
          <button
            onClick={onOpenActivityDrawer}
            className="text-xs font-bold text-[var(--brandtxt)] hover:underline"
          >
            View all
          </button>
        </div>
        <div className="space-y-2.5">
          {state.activity.slice(0, 3).map((act, i) => (
            <div
              key={i}
              className="p-3.5 flex items-center justify-between text-sm bg-white/95 dark:bg-slate-900/80 border-2 border-slate-300 dark:border-slate-700/90 border-b-[3px] border-b-slate-400 dark:border-b-slate-600 rounded-xl shadow-xs hover:border-pink-500 hover:border-b-pink-600 hover:shadow-md transition-all duration-200"
            >
              <b className="font-semibold text-[var(--fg)]">{act.t}</b>
              <small className="text-xs font-medium text-[var(--mut2)]">{ago(act.ts)}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsSection;
