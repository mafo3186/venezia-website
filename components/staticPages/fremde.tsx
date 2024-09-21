import styles from "./staticPages.module.css";
import IconKompass from "@/components/iconKompass";
import {BackButton, HomeButton} from "@/components/button";
import Link from "next/link";

export default function Fremde() {
  return (
    <div className={styles.boxContainer}>
      <div className={styles.textContainer}>
        <div className={styles.navigation}>
          <HomeButton/>
          <BackButton/>
        </div>
        <h1 className={styles.title}>Fremde überall</h1>
        <h2 className={styles.title}>Biennale Venedig 2024</h2>
        <br/>
        <p className={styles.bold}>Exkursion</p>
        <p>Im Rahmen unserer Exkursion nach Venedig zur Biennale 2024, deren Thema „Fremde überall“ eine zentrale Rolle
          spielte, tauchten wir tief in die Stadt und ihre Atmosphäre ein. Auf der Insel Lido lebend, erkundeten wir
          nicht nur die kunstvollen Ausstellungen in Giardina und Arenale, sondern auch die vielfältigen, im gesamten
          Stadtgebiet verteilten Pavillons und Kunstwerke. Wir genossen die italienische Küche, ließen uns von der
          einzigartigen Stimmung der Stadt faszinieren und reflektierten über die vielen Facetten des Themas Fremde, das
          sich in den ausgestellten Werken auf eindrucksvolle Weise widerspiegelte. Diese Erfahrung eröffnete uns neue
          Perspektiven auf das Gefühl der Fremdheit und bereicherte unser Verständnis für das künstlerische
          Auseinandersetzen mit diesem bedeutenden und aktuellen Thema.</p>
        <p className={styles.bold}>Webseite</p>
        <p>Diese Webseite dient als Projektdokumentation. Zu den Projekten mit dem Thema &apos;Fremde überall&apos; kann
          entweder mit dem Kompass navigiert werden, oder durch eine eigene Entdeckungsreise durch eine fremde und
          vielleicht doch vertraute Welt.</p>
        <IconKompass height={'50%'} width={'50%'}/>
      </div>
    </div>
  );
}
