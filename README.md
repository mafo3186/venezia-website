# Venezia Website

Die Venezia Website dokumentiert Projektarbeiten von Medien- und Design-Studierenden zum interdisziplinären und anthropologischen Diskurs mit Exkursion zur [60. Kunst-Biennale in Venedig 2024](https://www.labiennale.org/en/art/2024) mit dem Thema "Fremde überall". Die Webseite konfrontiert mit dem Thema Fremde durch ein ungewohntes, teilweise irritierendes Nutzererlebnis, das sich erst mit fortschreitender Erkundung verständlicher und zugänglicher gestaltet. Hoffentlich bietet diese Webseite auch über die Erfahrung von „Fremde“ durch die Nutzung hinaus auch Anlass, sich inhaltlich mit dem Thema „Fremde überall“ auseinander zu setzen.

## Inhalt

### Konzept "Fremde entdecken"

Die Webseite selbst ist ebenfalls eine Projektarbeit, die das Thema „Fremde überall“ umsetzt. Unter der Leitidee, dass Fremde etwas Ungewohntes, Unbekanntes ist, mit Desorientiertheit und Unwissen einhergehen kann und vielleicht sogar zu Beginn unfreundlich oder bedrohlich wirken kann, ist die Webseite als ein Nutzererlebnis konzipiert, in dem „Fremde“ erkundet und entdeckt werden kann. Man startet ohne jegliche Hinweise darauf, auf was für einer Webseite man sich befindet in einer 3D-Welt mit Geräuschkulisse, die an Venedig erinnert, düster beleuchtet und vernebelt ist, und muss sich selbstständig orientieren. Beim Erkunden des fiktiven Venedigs können verschiedene Orte aufgesucht und Objekte erkundet werden. Einige Orte spielen auf Erlebnisse und während der Exkursion besuchte Orte an, die zumindest den Exkursions-Teilnehmer\*innen nicht fremd sein werden. Durch Objekte erhält man Zugang zu den Projektarbeiten, die sich alle mit dem Thema „Fremde überall“ beschäftigen. Erst mit fortschreitender Erkundung der Projekte wird die Welt verständlicher und zugänglicher. Der Himmel klart auf, Nebel verschwindet, es gibt weniger Wind, und die Geräuschkulisse wird freundlicher.

### Orientierung

Als einzige Orientierungshilfe auf der Webseite dient der Kompass – das Hauptmenu. Der Kompass stellt eine Informationsseite zur Webseite zur Verfügung, enthält eine Liste besuchbarer, anklickbarer Orte, und außerdem weitere zunächst unlesbare Elemente. Man muss sich ggf. dazu überwinden, etwas Unbekanntes anzuklicken, um herauszufinden, was sich dahinter verbirgt. Es handelt sich um die direkte Navigation zu den Projekten. Auch hier führt erst der Besuch eines Projektes dazu, dass es bekannt, damit auch lesbar im Menu ist und die Welt freundlicher wird. Wer alle Projekte unmittelbar sehen möchte, kann mit einem Klick alle Projekte sichtbar machen. Wer noch mal von vorn alles erkunden möchte, kann die Erkundungstour zurücksetzen auf „fremd“.

Durch den Kompass kann man auch die 3D-Venedig-Welt ganz verlassen, und stattdessen abtauchen in eine sofort lesbare 2D-Listenansicht unter Wasser – im bereits versunkenen Venedig.

### Projektpräsentation

Die Projekte erscheinen transparent über dem Ort in Venedig, an dem man sich gerade befindet. Sie werden durch die Medien Video, Audio, Bild, Text und/oder eingebettete externe Webseiten präsentiert und enthalten jeweils einen Dokumentationsabschnitt. Videos und Webseiten werden unverändert eingebettet, Texte werden schmucklos, schlicht und unformatiert angezeigt, bei Bildern passt sich die Umgebung an deren Farben an, und Audios werden durch ein Kaleidoskop als Sinnbild für sich immer wieder Veränderndes visualisiert.

## Technik

### Verwendete Technologien

Next.js, React, Typescript, Three, Drei, Fiber, Sanity, Module CSS, Sanity, Vercel, Blog-Template, 3D-Modelle

### Installation
Für die Webseitenentwicklung:
* Repository klonen: `git clone git@github.com:mafo3186/venezia-website.git`
* Abhängigkeiten installieren: `npm install`
* In Entwicklungsumgebung starten: `npm run dev`
* Production-Build erstellen: `npm run build`
* Anleitung für die Anbindung vom CMS Sanity und Deployment via Vercel befindet sich in der originalen README.md des verwendeten Blog-Templates: [TEMPLATE.md](TEMPLATE.md)

### Updating the environment model

Exportiere die _Scene_ collection von Blender (4.4.0 and up) nach _public/assets/venice.glb_, dann führe `npm run updatemodel` aus, um die Datei zu transformieren und das assoziierte Javascript-File zu generieren.

### Debug Keys

* `F`: Toggle FPS display und andere Stats.
* `G`: Toggle God Mode (Debug Modus)
* `P`: Aktuelle Position und Drehung in die Zwischenablage kopieren (nützlich für die Erstellung von Hotspots)
* `1` -- `9`: Überschreiben des Wertes für _Fremdheit_ (1.0 -- 0.0)
* `0`: Zurücksetzen des Wertes für _Fremdheit_ auf den berechneten Wert

## Credits
- Verwendetes Webseiten-Template: https://vercel.com/templates/next.js/blog-next-sanity
- Lizenzen verwendeter 3D-Modelle:
  - "Venice Canal Scene" (https://skfb.ly/GUun) by cebraVFX is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
  - "Disney Wish Cruise Ship" (https://skfb.ly/oDp7s) by Gman The Cruise Dude is licensed under Creative Commons Attribution-NoDerivs (http://creativecommons.org/licenses/by-nd/4.0/).
  - "Venetian City Scene Gondola Prop" (https://skfb.ly/6Y8qZ) by Nick Van Bouwel is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).

Diese Website wurde im Rahmen des Kurses mit Exkursion "La Biennale di Venezia 2024 – “Foreigners Everywhere” – Ein interdisziplinärer und anthropologischer Diskurs mit Exkursion & Projektarbeit gemeinsam mit Studierenden des FB Design" von [benthillerkus](https://github.com/benthillerkus), [exploids](https://github.com/exploids) und [mafo3186](https://github.com/mafo3186) entwickelt.

Für die Inhalte der Kursteilnehmer\*innen auf den jeweiligen Projektseiten sind die Entwickler\*innen nicht verantwortlich.
