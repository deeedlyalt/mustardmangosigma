import { BannerEffect } from '@/data/shopItems';

interface BannerEffectLayerProps {
  effect: BannerEffect;
  gradient: string;
  className?: string;
}

/**
 * Renders the visual effect layer for a banner.
 * Sits absolutely inside a `relative overflow-hidden` parent.
 */
const BannerEffectLayer = ({ effect, gradient, className = '' }: BannerEffectLayerProps) => {
  if (effect === 'none') {
    return <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-40 ${className}`} />;
  }

  if (effect === 'shimmer') {
    return (
      <>
        <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-50`} />
        <div
          className="absolute inset-0 opacity-70 animate-shimmer pointer-events-none"
          style={{
            background:
              'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.85) 50%, transparent 70%)',
            backgroundSize: '200% 100%',
          }}
        />
      </>
    );
  }

  if (effect === 'flame') {
    return (
      <>
        <div className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-60 animate-flame-flicker`} />
        <div className="absolute inset-0 bg-gradient-to-t from-red-600/40 via-orange-400/20 to-transparent animate-flame-flicker" style={{ animationDelay: '0.2s' }} />
      </>
    );
  }

  if (effect === 'pulse') {
    return (
      <>
        <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-50 animate-premium-pulse rounded-2xl`} />
        <div
          className="absolute inset-0 opacity-60 animate-shimmer pointer-events-none"
          style={{
            background:
              'linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.9) 50%, transparent 60%)',
            backgroundSize: '250% 100%',
          }}
        />
      </>
    );
  }

  if (effect === 'glitter') {
    return (
      <>
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-60`} />
        <div
          className="absolute inset-0 opacity-80 pointer-events-none animate-glitter-spin"
          style={{
            background:
              'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.9) 0%, transparent 8%), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.8) 0%, transparent 6%), radial-gradient(circle at 40% 80%, rgba(255,255,255,0.7) 0%, transparent 5%), radial-gradient(circle at 85% 20%, rgba(255,255,255,0.9) 0%, transparent 7%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-60 animate-shimmer pointer-events-none"
          style={{
            background:
              'linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.7) 50%, transparent 65%)',
            backgroundSize: '200% 100%',
          }}
        />
      </>
    );
  }

  if (effect === 'rainbow') {
    return (
      <>
        <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-60 animate-rainbow-shift`} />
        <div
          className="absolute inset-0 opacity-50 animate-shimmer pointer-events-none"
          style={{
            background:
              'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.7) 50%, transparent 70%)',
            backgroundSize: '200% 100%',
          }}
        />
      </>
    );
  }

  return null;
};

export default BannerEffectLayer;
