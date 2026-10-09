import { contact } from '@/content/site';
import { ContactForm } from './ContactForm';
import { MapaLocal } from './MapaLocal';
import { Icon, type AnyIcon } from './Icon';
import { SmartLink } from './SmartLink';
import styles from './Contact.module.css';

export function Contact() {
  const items: { icon: AnyIcon; label: string; value: React.ReactNode }[] = [
    { icon: 'pin', label: 'Endereço', value: contact.address },
    {
      icon: 'mail',
      label: 'E-mail',
      value: <SmartLink link={{ label: contact.email, href: `mailto:${contact.email}` }} />,
    },
    {
      icon: 'phone',
      label: 'Telefone',
      value: <SmartLink link={{ label: contact.phone, href: contact.phoneHref }} />,
    },
  ];

  return (
    <section id="contato" className="section" aria-labelledby="contato-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.info}>
          <p className="eyebrow">{contact.eyebrow}</p>
          <h2 id="contato-title" className="h2">
            {contact.title}
          </h2>
          <p className={`lead ${styles.lead}`}>{contact.lead}</p>
          <ul className={styles.list}>
            {items.map((item) => (
              <li key={item.label} className={styles.item}>
                <span className={styles.icon}>
                  <Icon name={item.icon} size={22} />
                </span>
                <div className={styles.itemBody}>
                  <strong>{item.label}</strong>
                  <span>{item.value}</span>
                </div>
              </li>
            ))}
          </ul>
          <MapaLocal {...contact.mapa} className={styles.map} />
        </div>
        <ContactForm to={contact.email} subjects={contact.subjects} />
      </div>
    </section>
  );
}
