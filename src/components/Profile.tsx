import styles from './Profile.module.scss';

export function Profile() {

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
              defaultValue="Джолдаспаев Алимжан"
              readOnly
            />
          </div>
          
          <div className={styles.field}>
            <label>Email</label>
            <input
              type="email"
              defaultValue="name@mail.ru"
              readOnly
            />
          </div>
          
          <div className={styles.field}>
            <label>Телефон</label>
            <input
              type="tel"
              defaultValue="+7 (123) 456-78-90"
              readOnly
            />
          </div>
          
          <div className={styles.field}>
            <label>Адрес</label>
            <input
              type="text"
              placeholder="Адрес"
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
}
