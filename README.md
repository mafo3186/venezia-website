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

### Aktualisieren des Umgebungsmodells

Exportiere die _Scene_ Collection aus Blender (4.4.0 and up) nach _public/assets/venice.glb_, dann führe `npm run updatemodel` aus, um die Datei zu transformieren und das assoziierte Javascript-File zu generieren.

### Debug-Tasten

* `F`: Schaltet FPS-Anzeige und andere Statistiken um.
* `G`: Schaltet den Gott-Modus (Debug-Modus) ein und aus.
* `P`: Aktuelle Position und Drehung in die Zwischenablage kopieren (nützlich für die Erstellung von Hotspots).
* `1` - `9`: Überschreiben des Wertes für _Fremdheit_ (1.0 - 0.0).
* `0`: Zurücksetzen des Wertes für _Fremdheit_ auf den berechneten Wert.

## Credits
- Verwendetes Webseiten-Template: https://vercel.com/templates/next.js/blog-next-sanity
- Lizenzen verwendeter 3D-Modelle:
  - "Venice Canal Scene" (https://skfb.ly/GUun) by cebraVFX is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
  - "Disney Wish Cruise Ship" (https://skfb.ly/oDp7s) by Gman The Cruise Dude is licensed under Creative Commons Attribution-NoDerivs (http://creativecommons.org/licenses/by-nd/4.0/).
  - "Venetian City Scene Gondola Prop" (https://skfb.ly/6Y8qZ) by Nick Van Bouwel is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
- Lizenzen verwendeter Audiodateien:
  - "ESE - Foot Step - Concrete 1.wav" (https://freesound.org/s/475854/) by EpicSoundEffects is licensed under Creative Commons 0 (https://creativecommons.org/publicdomain/zero/1.0/).
  - "shore1001.wav" (https://freesound.org/s/58408/) by sinatra314 is licensed under Creative Commons Attribution 3.0 (https://creativecommons.org/licenses/by/3.0/).
  - "Spring Birds Loop with Low-Cut (New Jersey)" (https://freesound.org/s/345852/) by hargissssound is licensed under Creative Commons 0 (https://creativecommons.org/publicdomain/zero/1.0/).
  - "cat meow short" (https://freesound.org/s/412017/) by skymary is licensed under Creative Commons Attribution 0 (https://creativecommons.org/publicdomain/zero/1.0/).
  - "Monologue Wind.wav" (https://freesound.org/s/527281/) by dlgebert is licensed under Creative Commons 0 (https://creativecommons.org/publicdomain/zero/1.0/).
- Lizenzen verwendeter Bilddateien:
  - "Drackenstein Quarry (Pure Sky)" (https://polyhaven.com/a/drackenstein_quarry_puresky) by Andreas Mischok and Jarod Guest is licensed under Creative Commons 0 (https://creativecommons.org/publicdomain/zero/1.0/).
  - "Industrial Sunset 02 (Pure Sky)" (https://polyhaven.com/a/industrial_sunset_02_puresky) by Jarod Guest and Sergej Majboroda is licensed under Creative Commons 0 (https://creativecommons.org/publicdomain/zero/1.0/).
  - "Overcast Soil (Pure Sky)" (https://polyhaven.com/a/overcast_soil_puresky) by Jarod Guest and Sergej Majboroda is licensed under Creative Commons 0 (https://creativecommons.org/publicdomain/zero/1.0/).
  - "Snow Field (Pure Sky)" (https://polyhaven.com/a/snow_field_puresky) by Jarod Guest and Sergej Majboroda is licensed under Creative Commons 0 (https://creativecommons.org/publicdomain/zero/1.0/).
  - "Scratches 003" (https://ambientCG.com/a/Scratches003) by ambientCG.com is licensed under Creative Commons 0 (https://creativecommons.org/publicdomain/zero/1.0/).
- Lizenzen verwendeter Schriftarten:
  - "Tilt Neon" (https://fonts.withgoogle.com/tilt#neon) by The Tilt Project Authors is licensed under SIL Open Font License 1.1 (https://github.com/googlefonts/Tilt-Fonts/blob/1c26966d33270e2cd38b2b5ed7e9b576c1458eab/OFL.txt).

Diese Website wurde im Rahmen des Kurses mit Exkursion "La Biennale di Venezia 2024 – “Foreigners Everywhere” – Ein interdisziplinärer und anthropologischer Diskurs mit Exkursion & Projektarbeit gemeinsam mit Studierenden des FB Design" von [benthillerkus](https://github.com/benthillerkus), [exploids](https://github.com/exploids) und [mafo3186](https://github.com/mafo3186) entwickelt.

Für die Inhalte der Kursteilnehmer\*innen auf den jeweiligen Projektseiten sind die Entwickler\*innen nicht verantwortlich.
