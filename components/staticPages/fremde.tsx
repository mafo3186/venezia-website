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
        <h1>Fremde überall</h1>
        <h2>Exkursion zur 60. Kunst-Biennale in Venedig 2024</h2>
        <br/>
        <h3>Exkursion</h3>
        <p>Im Rahmen unserer Exkursion nach Venedig zur Biennale 2024, deren Thema „Fremde überall“ eine zentrale Rolle
          spielte, tauchten wir tief in die Stadt und ihre Atmosphäre ein. Auf der Insel Lido lebend, erkundeten wir
          nicht nur die kunstvollen Ausstellungen in Giardini und Arsenale, sondern auch die vielfältigen, im gesamten
          Stadtgebiet verteilten Pavillons und Kunstwerke. Wir genossen die italienische Küche, ließen uns von der
          einzigartigen Stimmung der Stadt faszinieren und reflektierten über die vielen Facetten des Themas Fremde, das
          sich in den ausgestellten Werken auf eindrucksvolle Weise widerspiegelte. Diese Erfahrung eröffnete uns neue
          Perspektiven auf das Gefühl der Fremdheit und bereicherte unser Verständnis für das künstlerische
          Auseinandersetzen mit diesem bedeutenden und aktuellen Thema.</p>
        <h3>Webseite</h3>
        <p>Diese Webseite dient als Projektdokumentation. Alle Projekte beschäftigen sich mit dem Thema der Biennale &apos;Fremde überall&apos;. Die Erkundung der Projekte auf dieser Webseite verschreibt sich ebenfalls der Fremde.</p>
        <h3>Navigation</h3>
        <p>Zu den Projekten kann entweder mit dem Kompass navigiert werden, oder durch eine eigene Entdeckungsreise durch eine fremde und
          vielleicht doch vertraute Welt, oder über eine Liste.</p>
        <div className={styles["icon-container"]}>
          <IconKompass height={'90%'} width={'90%'}/>
        </div>
      </div>
    </div>
  );
}
