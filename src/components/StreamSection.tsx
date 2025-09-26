import styles from './StreamSection.module.scss';

export default function StreamSection() {

  return (
    <section className={styles.streamSection}>
      <div className={styles.header}>
        <div className={styles.titleBar}></div>
        <h2 className={styles.title}>Трансляция</h2>
        <img 
          src="/images/icons/Live.png" 
          alt="Live" 
          className={styles.liveIcon}
        />
      </div>

      <div className={styles.streamContent}>
        <div className={styles.videoContainer}>
          <img 
            src="/images/vid.png" 
            alt="Video Stream" 
            className={styles.videoImage}
          />
        </div>
      </div>
    </section>
  );
}
