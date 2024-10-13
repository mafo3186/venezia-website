import styles from "./staticPages.module.css";
import HomeButtonSwitcher from "@/components/hooks/buttonSwitcher";

export default function Impressum() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.navigationButtons}>
        <HomeButtonSwitcher />
      </div>
      <div className={styles.textContainer}>
        <h1>Impressum</h1>
        <div className={styles.bold}>
          <p>
            Hochschule Düsseldorf<br />
            University of Applied Sciences
          </p>
        </div>
        <p>
          Münsterstraße 156, Gebäude 2<br />
          40476 Düsseldorf<br />
          Tel.: +49 211 4351-0<br />
          Fax: +49 211 4351-19000
        </p>
        <h3>Verantwortlich für den Inhalt</h3>
        <p>
          Studentisches Projektteam unter der Leitung von Prof. Gabriele Schwab-Trapp<br />
          Fachbereich Medien<br />
          Hochschule Düsseldorf
        </p>
        <p>
          Die Hochschule Düsseldorf ist eine Körperschaft des Öffentlichen Rechtes. Sie wird durch die Präsidentin,
          Prof. Dr. Edeltraud Vomberg, gesetzlich vertreten.
        </p>
      </div>
    </div>
  );
}
