import styles from './ProfileLarge.module.scss';

export function ProfileLarge() {

  return (
    <div className={styles.profileSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>Профиль</div>
      </div>
      
      <div className={styles.profileContent}>
        <div className={styles.profileAvatar}>
          <img 
            src="/images/icons/person.png" 
            alt="Profile" 
            className={styles.avatarImage}
          />
        </div>
        
        <div className={styles.profileFields}>
          <div className={styles.field}>
            <label>Имя</label>
            <input
              type="text"
              placeholder="Телефон"
              readOnly
            />
          </div>
          
          <div className={styles.field}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Телефон"
              readOnly
            />
          </div>
          
          <div className={styles.field}>
            <label>Телефон</label>
            <input
              type="tel"
              placeholder="Телефон"
              readOnly
            />
          </div>
          
          <div className={styles.field}>
            <label>Адрес</label>
            <input
              type="text"
              placeholder="Телефон"
              readOnly
            />
          </div>
          
          <button className={styles.editButton}>
            Редактировать
          </button>
        </div>
      </div>
    </div>
  );
}
