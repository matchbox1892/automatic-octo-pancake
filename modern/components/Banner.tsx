import styles from './Banner.module.css';

type BannerVariant = 'page' | 'panel';

interface BannerProps {
  variant?: BannerVariant;
}

export default function Banner({ variant = 'page' }: BannerProps) {
  const className = variant === 'panel' ? `${styles.banner} ${styles.panel}` : styles.banner;
  return (
    <div className={className} role="presentation">
      <h1>SOAP Narrative Studio</h1>
      <p>Compose EMS SOAP reports with configurable content, live previews, and legacy parity.</p>
    </div>
  );
}
