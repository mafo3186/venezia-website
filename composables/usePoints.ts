import bison from "../assets/points/bison.json";
import human from "../assets/points/human.json";
import unicorn from "../assets/points/unicorn.json";
import horse from "../assets/points/horse.json";
import hand from "../assets/points/hand.json";

interface Point {
  x: number;
  y: number;
  z: number;
}

interface ImageData {
  points: Point[];
  description: string;
}

export const usePoints = () => {
  const BACKGROUND_IMAGES: Map<string, ImageData> = new Map();

  // Beispieldaten mit Beschreibungen
  BACKGROUND_IMAGES.set("bison", {
    points: bison.points,
    description:
      "Die Darstellung eines Bisons in den Höhlenmalereien ist oft kraftvoll und lebendig. Typischerweise zeigt das Bild einen Bison in Seitenansicht mit gewölbtem Rücken und sichtbaren Rippen, was eine Bewegung andeutet. Die Hörner und das Fell sind detailliert dargestellt, um die robuste und wilde Natur dieses Tieres zu betonen.",
  });
  BACKGROUND_IMAGES.set("human", {
    points: human.points,
    description:
      "Eine der bemerkenswertesten menschlichen Darstellungen in Lascaux ist die Szene, die als „der gefallene Jäger“ oder „der Vogelmann“ bekannt ist. Dieses Bild zeigt eine menschliche Figur mit einem Vogelkopf oder einer Vogelmaske neben einem Bison, der scheinbar eine Speerspitze in sich hat. Die menschliche Figur scheint am Boden zu liegen, was einige Interpretationen zu einem Jagdunfall oder einem rituellen Akt verleitet. Die Darstellung ist weniger detailliert als die der Tiere und symbolisch in der Natur.",
  });
  BACKGROUND_IMAGES.set("unicorn", {
    points: unicorn.points,
    description:
      "Das sogenannte 'Einhorn' von Lascaux, oft als Fabelwesen interpretiert, zeigt zwei gerade Hörner auf dem Kopf und könnte das Ergebnis einer Überlagerung zweier Bilder oder eine symbolische Darstellung sein.",
  });
  BACKGROUND_IMAGES.set("horse", {
    points: horse.points,
    description:
      "Das Pferd ist Teil einer größeren Komposition in der Höhle von Lascaux, bekannt als die 'gefallene Kuh' Szene. Es ist eigentlich ein Pferd, das neben einer scheinbar am Boden liegenden Kuh dargestellt ist, welche oft fälschlicherweise als 'überkopf' beschrieben wird. Das Pferd ist dynamisch und mit großer Detailgenauigkeit gemalt, mit sichtbaren Muskeln und einer fließenden Mähne, was eine Bewegung darstellt.",
  });
  BACKGROUND_IMAGES.set("hand", {
    points: hand.points,
    description:
      "Handabdrücke sind ein häufiges Motiv in der Höhlenkunst. Diese sind meistens als negative Handabdrücke dargestellt, bei denen die Hand auf die Wand gelegt und dann mit Farbe umspritzt wurde, sodass eine Silhouette der Hand zurückbleibt.",
  });

  const keys = Array.from(BACKGROUND_IMAGES.keys());
  const randomKey = keys[Math.floor(Math.random() * keys.length)];

  const randomEntry = BACKGROUND_IMAGES.get(randomKey)!;
  const currentImage = useState("currentImage", (): string => randomKey);
  const currentPoints = useState(
    "currentPoints",
    (): Point[] => randomEntry.points
  );
  const currentDescription = useState(
    "currentDescription",
    (): string => randomEntry.description
  );

  function setCurrentImageTo(key: string) {
    const entry = BACKGROUND_IMAGES.get(key)!;
    currentImage.value = key;
    currentPoints.value = entry.points;
    currentDescription.value = entry.description;
  }

  const getAllImageNames = computed(() => {
    return Array.from(BACKGROUND_IMAGES.keys());
  });
  
  // get images and descriptions
  function getDescription(key: string) {
    return BACKGROUND_IMAGES.get(key)!.description;
  }

  return {
    currentDescription,
    currentPoints,
    currentImage,
    setCurrentImageTo,
    getAllImageNames,
    getDescription
  };
};
