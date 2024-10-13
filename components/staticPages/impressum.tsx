import styles from "./staticPages.module.css";
import {BackButton} from "@/components/navigation/button";
import HomeButtonSwitcher from "@/components/hooks/buttonSwitcher";

export default function Impressum() {
  return (
    <div className={styles.boxContainer}>
      <div className={styles.navigation}>
        <HomeButtonSwitcher/>
        <BackButton/>
      </div>
      <div className={styles.textContainer}>

        <h1>Impressum</h1>
        <div className={styles.bold}>
          <p>Hochschule Düsseldorf</p>
          <p>University of Applied Sciences</p>
        </div>
        <p>Münsterstraße 156, Gebäude 2</p>
        <p>Tel.: +49 211 4351-0</p>
        <p>Fax: +49 211 4351-19000</p>
        <p>empfang@hs-duesseldorf.de</p>
        <br/>
        <p>Die Hochschule Düsseldorf ist eine Körperschaft des Öffentlichen Rechtes. Sie wird durch die Präsidentin,
          Prof. Dr. Edeltraud Vomberg, gesetzlich vertreten.</p>
      </div>
    </div>
  );
}
