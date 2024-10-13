import styles from "./staticPages.module.css";
import { BackButton}  from "@/components/navigation/button";
import HomeButtonSwitcher from "@/components/hooks/buttonSwitcher";

export default function Datenschutz() {
  return (
    <div className={styles.boxContainer}>
      <div className={styles.navigation}>
        <HomeButtonSwitcher/>
        <BackButton/>
      </div>
      <div className={styles.textContainer}>

        <h1 className={styles.title}>Datenschutz</h1>
        <p className={styles.bold}>
          Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst und möchten, dass Sie wissen, wann wir welche Daten
          speichern und wie wir sie verwenden.
        </p>
        <br/>
        <p className={styles.bold}>Angaben nach Artikel 12 DSGVO</p>
        <p>Verantwortlicher für die Datenverarbeitung im Sinne der DSGVO:</p>
        <p>Hochschule Düsseldorf (HSD)</p>
        <p>Münsterstraße 156</p>
        <p>40476 Düsseldorf</p>
        <p>Tel.: +49 211 4351-0</p>
        <p>Fax: +49 211 4351-19000</p>
        <p>empfang@hs-duesseldorf.de</p>
        <br/>
        <p className={styles.bold}>Datenschutzbeauftragte der HSD:</p>
        <p>Kathrin Schweppe​</p>
        <p>Münsterstraße 156</p>
        <p>40476 Düsseldorf</p>
        <p>datenschutzbeauftragter@hs-duesseldorf.de</p>
        <br/>
        <p className={styles.bold}>Inhalte</p>
        <p>Die Webseite verwendet keine Cookies.</p>
        <p>Die Webseite verwendet Sanity als Content-Management-System. Falls Sie sich im CMS anmelden, wird lokal ein
          Authentifizierungs-Token gespeichert, um die Benutzeranmeldung und -sitzung zu verwalten.</p>
        <p>Die Webseite enthält ggf. Links zu fremden Internetseiten.</p>
        <br/>
        <p className={styles.bold}>Haftungshinweis</p>
        <p>Die Hochschule Düsseldorf hat keinen Einfluss auf Gestaltung und Inhalte fremder Internetseiten. Für die
          Inhalte von Internetseiten, auf die externe Links verweisen, übernimmt die Hochschule Düsseldorf deshalb keine
          Verantwortung.</p>
      </div>
    </div>
  );
}
