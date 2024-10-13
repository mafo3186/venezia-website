import styles from "./staticPages.module.css";
import HomeButtonSwitcher from "@/components/hooks/buttonSwitcher";

export default function Datenschutz() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.navigationButtons}>
        <HomeButtonSwitcher />
      </div>
      <div className={styles.textContainer}>
        <h1 className={styles.title}>Datenschutz</h1>
        <p className={styles.bold}>
          Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst und möchten, dass Sie wissen, wann wir welche
          Daten speichern und wie wir sie verwenden. Diese Datenschutzerklärung gilt für die Webseite
          <a href="https://venezia-website.vercel.app/" target="_blank"
             rel="noopener noreferrer"> https://venezia-website.vercel.app/</a>.
        </p>
        <h3>Angaben nach Artikel 12 DSGVO</h3>
        <h4>Verantwortlicher für die Datenverarbeitung im Sinne der DSGVO</h4>
        <p>
          Dieses Projekt wurde im Rahmen einer Veranstaltung des Fachbereichs Medien an der Hochschule Düsseldorf (HSD)
          erstellt.
          Die Verantwortung für den Datenschutz und die Verarbeitung von personenbezogenen Daten liegt beim Projektteam.
        </p>
        <h4>Kontakt:</h4>
        <p>
          Hochschule Düsseldorf<br/>
          Fachbereich Medien<br/>
          Prof. Gabriele Schwab-Trapp<br/>
          Münsterstraße 156<br/>
          40476 Düsseldorf<br/>
        </p>

        <h3>Allgemeine Informationen zur Datenverarbeitung</h3>
        <p>
          Die Webseite wird auf Vercel gehostet und verwendet Cookies, um die Funktionsfähigkeit der Seite
          sicherzustellen. Folgende Cookies werden gesetzt:
        </p>
        <ul>
          <li><strong>__vercel_live_token:</strong> Ein Cookie, das von Vercel gesetzt wird, um die Live-Umgebung zu
            unterstützen.
          </li>
          <li><strong>__vercel-toolbar:</strong> Ein Cookie von Vercel, das für die Benutzeroberfläche und
            Entwicklungswerkzeuge verantwortlich ist.
          </li>
          <li><strong>rs_ga:</strong> Ein Cookie von Google Analytics, das verwendet wird, um das Nutzerverhalten auf
            der Webseite zu verfolgen.
          </li>
          <li><strong>private_state_token:</strong> Ein Token von Google, das möglicherweise zur Verwaltung von
            Sitzungen verwendet wird.
          </li>
        </ul>
        <br/>
        <p>
          Diese Cookies sind notwendig für den Betrieb der Webseite und können nicht abgelehnt werden. Sie helfen uns,
          die Funktionsfähigkeit und Leistung unserer Webseite sicherzustellen.
        </p>
        <p>
          Die Webseite verwendet Sanity als Content-Management-System. Falls Sie sich im CMS anmelden, wird lokal ein
          Authentifizierungs-Token gespeichert, um die Benutzeranmeldung und -sitzung zu verwalten.<br/>
          Die Webseite enthält ggf. Links zu fremden Internetseiten.
        </p>
        <h3>Haftungshinweis</h3>
        <p>Die Hochschule Düsseldorf und das Projektteam haben keinen Einfluss auf Gestaltung und Inhalte fremder
          Internetseiten. Für die Inhalte von Internetseiten, auf die externe Links verweisen, übernehmen die Hochschule
          Düsseldorf und das Projektteam deshalb keine
          Verantwortung.</p>
      </div>
    </div>
  );
}
