/*** exports ***/
export const mainContentAbove: IMainContentAbove = {
  title: "Faite parler de vous, pendant que vous dormez",
  content: [
    {
      text: "Pionier dans le domaine de la décoration de devanture de magasin, nous sommes en mesure de créer des visuels captivants qui captureront l'imagination de vos clients. Mais ce n'est pas tout ! Nous repoussons les limites de la créativité en utilisant",
      color: "primary-dark",
    },
    {
      text: "l'intelligence artificielle",
      color: "white",
    },
    {
      text: "pour concevoir des designs uniques et percutants.",
      color: "primary-dark",
    },
  ],
};

export const mainContentBelow: IMainContentBelow = {
  content: [
    {
      text: "Êtes-vous prêt à donner à votre magasin une devanture qui attire l'attention et reflète",
      color: "secondary",
    },
    { text: " l'essence ", color: "white" },
    {
      text: "de votre marque ? Nous sommes une entreprise innovante qui combine",
      color: "secondary",
    },
    { text: " l'art ", color: "white" },
    { text: "de la décoration avec la puissance de", color: "secondary" },
    { text: " l'intelligence artificielle", color: "white" },
    { text: ".", color: "secondary" },
  ],
  description:
    "Laissez-nous transformer votre devanture de magasin en une véritable œuvre d'art qui attirera les regards et suscitera la curiosité. Contactez-nous dès aujourd'hui pour une consultation gratuite et découvrez comment notre combinaison unique de décoration de devanture et d'intelligence artificielle peut propulser votre entreprise vers de nouveaux sommets .",
};

/*** interfaces ***/
interface IMainContentAbove {
  title: string;
  content: IContent[];
}

interface IContent {
  text: string;
  color: string;
}

interface IMainContentBelow {
  content: IContent[];
  description: string;
}
