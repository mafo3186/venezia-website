import styles from "./staticPages.module.css";
import IconKompass from "@/components/iconKompass";
import {BackButton, HomeButton} from "@/components/button";
import Link from "next/link";
import { FaGlobe, FaListAlt } from 'react-icons/fa';


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
        <p>Diese Webseite dient als Projektdokumentation. Alle Projekte beschäftigen sich mit dem Thema der
          Biennale &apos;Fremde überall&apos;. Die Erkundung der Projekte auf dieser Webseite verschreibt sich ebenfalls
          der Fremde.</p>
        <h3>Navigation</h3>
        <div className={styles.iconWrapper}>
          <div className={styles.iconContainer}>
            <div className={styles.circle}>
              <IconKompass height={'80%'} width={'80%'}/>
            </div>
            <h4 className={styles.iconTitle}>Kompass</h4>
            <p className={styles.iconDescription}>
              Mit dem Kompass kann von überall auf der Webseite zu
              jedem bekannten oder unbekannten, erwünschten oder unerwünschten Ziel navigiert werden.
            </p>
          </div>
          <div className={styles.iconContainer}>
            <div className={styles.circle}>
              <FaGlobe className={styles.iconColor} size={ "50%"} /> 
            </div>
            <h4 className={styles.iconTitle}>Welt</h4>
            <p className={styles.iconDescription}>
              Auf einer eigenen Entdeckungsreise durch eine fremde und vielleicht
              doch vertraute Welt können alle Projekte gefunden und erkundet
              werden. Der Weg ist das Ziel.
            </p>
          </div>
          <div className={styles.iconContainer}>
            <div className={styles.circle}>
              <FaListAlt className={styles.iconColor} size={ "50%"} /> 
            </div>
            <h4 className={styles.iconTitle}>Liste</h4>
            <p className={styles.iconDescription}>
              Der vertraute Weg durch eine einfache Liste führt ebenfalls zu allen
              Projekten. Der Weg ist nicht immer das Ziel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
