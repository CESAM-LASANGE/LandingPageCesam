import { topBar } from '@/content/site';
import { SmartLink } from './SmartLink';
import styles from './TopBar.module.css';

export function TopBar() {
  return (
    <div className={styles.bar}>
      <div className={`container ${styles.inner}`}>
        <span>{topBar.text}</span>
        <ul className={styles.links}>
          {topBar.links.map((link) => (
            <li key={link.label}>
              <SmartLink link={link} className={styles.link} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
