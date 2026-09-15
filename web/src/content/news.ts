import type { Locale } from "@/i18n/routing";
import type { L10n } from "@/lib/i18n-types";

/**
 * The three articles carried over from WordPress.
 *
 * `slug` fields are the live site's existing slugs for fr and en, so every
 * current article URL keeps working after the cutover. Do not rename them.
 *
 * When the volume justifies it this moves to MDX files or a CMS; the page
 * components read from this shape either way.
 */

export type Article = {
  id: string;
  date: string; // ISO
  image: string;
  slug: L10n;
  title: L10n;
  excerpt: L10n;
  body: Record<Locale, string[]>;
};

export const articles: Article[] = [
  {
    id: "lpg-expo-2025",
    date: "2025-04-11",
    image: "/images/facility/warehouse-cylinders.jpg",
    slug: {
      fr: "diwa-industries-a-la-6e-edition-du-west-africa-lpg-expo-nigeria-2025-une-participation-marquante-pour-le-developpement-du-secteur-du-gaz-en-afrique-de-louest",
      en: "diwa-industries-at-the-6th-west-africa-lpg-expo-nigeria-2025",
      pt: "diwa-industries-na-6a-west-africa-lpg-expo-nigeria-2025",
    },
    title: {
      fr: "DIWA Industries à la 6e édition du West Africa LPG Expo – Nigeria 2025",
      en: "DIWA Industries at the 6th West Africa LPG Expo – Nigeria 2025",
      pt: "A DIWA Industries na 6.ª West Africa LPG Expo – Nigéria 2025",
    },
    excerpt: {
      fr: "Du 3 au 4 mars 2025, DIWA Industries a participé à la 6e édition du West Africa LPG Expo, un événement clé du secteur énergétique qui s'est tenu à Lagos, au Nigeria.",
      en: "From 3 to 4 March 2025, DIWA Industries took part in the 6th edition of the West Africa LPG Expo, a major energy-sector event held in Lagos, Nigeria.",
      pt: "De 3 a 4 de março de 2025, a DIWA Industries participou na 6.ª edição da West Africa LPG Expo, um evento de referência do setor energético realizado em Lagos, na Nigéria.",
    },
    body: {
      fr: [
        "Du 3 au 4 mars 2025, DIWA Industries a participé à la 6e édition du West Africa LPG Expo, un événement clé du secteur énergétique qui s'est tenu à Lagos, au Nigeria. Cet événement, qui rassemble des acteurs majeurs du secteur du gaz, a permis à DIWA Industries de mettre en avant ses solutions industrielles innovantes et de renforcer sa présence sur le marché ouest-africain.",
        "## Une participation stratégique",
        "La 6e édition du West Africa LPG Expo a offert une plateforme idéale pour DIWA Industries, leader dans la fabrication et la requalification des bouteilles de gaz butane (GPL), ainsi que dans la production de dioxyde de carbone (CO2) alimentaire et industriel. Avec un marché nigérian en pleine expansion et une forte demande de solutions énergétiques durables, la participation de DIWA Industries à cet événement a été stratégique pour étendre son influence dans la région.",
        "## Présentation des produits et services",
        "Lors de l'exposition, DIWA Industries a présenté ses produits phares, notamment les bouteilles de gaz GPL, essentielles pour les besoins domestiques et industriels. L'entreprise a également mis en avant ses services de requalification des bouteilles de gaz, un processus fondamental pour garantir la sécurité et la durabilité des équipements utilisés dans toute la région.",
        "En parallèle, DIWA Industries a exposé son expertise dans la production de CO2 alimentaire et industriel, un gaz inerte de grande importance pour des secteurs tels que l'agroalimentaire, la production de boissons gazeuses et la conservation des produits. Cette diversification de l'offre a renforcé la position de DIWA Industries comme un fournisseur clé pour de nombreux secteurs industriels.",
        "## Engagement envers la qualité et la sécurité",
        "DIWA Industries a réaffirmé son engagement envers la qualité et la sécurité à travers ses produits et services. Lors de l'événement, l'entreprise a souligné ses efforts constants pour améliorer ses processus de fabrication et garantir que tous ses produits répondent aux normes internationales les plus strictes.",
      ],
      en: [
        "From 3 to 4 March 2025, DIWA Industries took part in the 6th edition of the West Africa LPG Expo, a major event in the energy sector held in Lagos, Nigeria. This key gathering of gas industry stakeholders gave DIWA Industries the opportunity to showcase its innovative industrial solutions and strengthen its presence in the West African market.",
        "## A strategic appearance",
        "The 6th West Africa LPG Expo offered an ideal platform for DIWA Industries, a leader in the manufacturing and requalification of butane (LPG) gas cylinders and in the production of food-grade and industrial carbon dioxide. With a rapidly expanding Nigerian market and strong demand for sustainable energy solutions, the company's participation was strategic in extending its influence across the region.",
        "## Products and services on show",
        "At the exhibition, DIWA Industries presented its flagship products, notably LPG gas cylinders, essential for domestic and industrial needs. The company also highlighted its cylinder requalification services, a process fundamental to guaranteeing the safety and durability of equipment in use across the region.",
        "In parallel, DIWA Industries showcased its expertise in food-grade and industrial CO₂ production, an inert gas of considerable importance to sectors such as food processing, carbonated beverages, and product preservation. This diversification reinforced the company's position as a key supplier to numerous industrial sectors.",
        "## A commitment to quality and safety",
        "DIWA Industries reaffirmed its commitment to quality and safety across its products and services. At the event, the company underlined its ongoing efforts to improve its manufacturing processes and ensure that all its products meet the strictest international standards.",
      ],
      pt: [
        "De 3 a 4 de março de 2025, a DIWA Industries participou na 6.ª edição da West Africa LPG Expo, um evento de referência do setor energético realizado em Lagos, na Nigéria. Este encontro dos principais intervenientes do setor do gás permitiu à DIWA Industries apresentar as suas soluções industriais inovadoras e reforçar a sua presença no mercado da África Ocidental.",
        "## Uma participação estratégica",
        "A 6.ª edição da West Africa LPG Expo ofereceu uma plataforma ideal à DIWA Industries, líder no fabrico e na requalificação de botijas de gás butano (GPL) e na produção de dióxido de carbono alimentar e industrial. Com um mercado nigeriano em franca expansão e uma forte procura de soluções energéticas sustentáveis, a participação da empresa foi estratégica para alargar a sua influência na região.",
        "## Apresentação de produtos e serviços",
        "Na exposição, a DIWA Industries apresentou os seus produtos de referência, nomeadamente as botijas de GPL, essenciais para as necessidades domésticas e industriais. A empresa destacou igualmente os seus serviços de requalificação de botijas, um processo fundamental para garantir a segurança e a durabilidade dos equipamentos em circulação em toda a região.",
        "Em paralelo, a DIWA Industries expôs a sua competência na produção de CO₂ alimentar e industrial, um gás inerte de grande importância para setores como a agroalimentação, a produção de bebidas gaseificadas e a conservação de produtos. Esta diversificação reforçou a posição da empresa como fornecedor de referência para numerosos setores industriais.",
        "## Compromisso com a qualidade e a segurança",
        "A DIWA Industries reafirmou o seu compromisso com a qualidade e a segurança nos seus produtos e serviços. Durante o evento, a empresa sublinhou os seus esforços constantes para melhorar os processos de fabrico e garantir que todos os produtos cumprem as normas internacionais mais exigentes.",
      ],
    },
  },
  {
    id: "foire-lome-2024",
    date: "2025-04-11",
    image: "/images/products/branded-cylinders.jpg",
    slug: {
      fr: "diwa-industries-a-la-19e-foire-internationale-de-lome-une-vitrine-pour-linnovation-et-la-qualite",
      en: "diwa-industries-at-the-19th-lome-international-trade-fair",
      pt: "diwa-industries-na-19a-feira-internacional-de-lome",
    },
    title: {
      fr: "DIWA Industries à la 19e Foire Internationale de Lomé",
      en: "DIWA Industries at the 19th Lomé International Trade Fair",
      pt: "A DIWA Industries na 19.ª Feira Internacional de Lomé",
    },
    excerpt: {
      fr: "Du 22 novembre au 8 décembre 2024, DIWA Industries a participé à la 19e Foire Internationale de Lomé, un événement majeur réunissant des entreprises locales et internationales.",
      en: "From 22 November to 8 December 2024, DIWA Industries took part in the 19th Lomé International Trade Fair, a major event bringing together local and international businesses.",
      pt: "De 22 de novembro a 8 de dezembro de 2024, a DIWA Industries participou na 19.ª Feira Internacional de Lomé, um grande evento que reúne empresas locais e internacionais.",
    },
    body: {
      fr: [
        "Du 22 novembre au 08 décembre 2024, DIWA Industries a brillamment participé à la 19e Foire Internationale de Lomé, un événement majeur réunissant des entreprises locales et internationales. Ce fut l'occasion pour l'entreprise de présenter ses produits et services, mettant en avant son expertise dans la fabrication et la requalification des bouteilles de gaz butane (GPL), ainsi que sa production de dioxyde de carbone (CO2) alimentaire et industriel.",
        "## Une participation marquante",
        "La foire internationale de Lomé, reconnue pour son rôle de plateforme de rencontre entre les acteurs économiques de la sous-région, a permis à DIWA Industries de se démarquer. L'entreprise a exposé ses solutions industrielles innovantes, soulignant son rôle clé dans le secteur énergétique, notamment dans la distribution de gaz GPL. Elle a également mis en avant ses capacités de production de gaz inertes, un domaine stratégique pour de nombreux secteurs industriels, tels que l'alimentaire, la chimie et la métallurgie.",
        "## Présentation des produits et services",
        "Au sein de son stand, DIWA Industries a offert une présentation détaillée de ses produits phares : les bouteilles de gaz butane et GPL, qui sont essentielles pour les besoins domestiques et industriels en Afrique de l'Ouest. L'entreprise a également mis en lumière ses services de requalification des bouteilles de gaz, un domaine crucial pour assurer la sécurité et la durabilité de l'utilisation de ces équipements.",
        "## Un engagement pour la qualité et la sécurité",
        "Lors de cette foire, DIWA Industries a réaffirmé son engagement envers l'excellence et la sécurité. La société a souligné l'importance de la rigueur dans ses processus de fabrication et de requalification, afin d'assurer des produits conformes aux normes internationales de qualité. Cet engagement a été largement apprécié par les visiteurs, dont de nombreux professionnels du secteur énergétique.",
      ],
      en: [
        "From 22 November to 8 December 2024, DIWA Industries took part in the 19th Lomé International Trade Fair, a major event bringing together local and international businesses. It was an opportunity for the company to present its products and services, highlighting its expertise in the manufacturing and requalification of butane (LPG) gas cylinders, as well as its production of food-grade and industrial carbon dioxide.",
        "## A notable appearance",
        "The Lomé international fair, recognised for its role as a meeting platform for economic actors across the sub-region, allowed DIWA Industries to stand out. The company exhibited its innovative industrial solutions, underlining its key role in the energy sector, particularly in LPG distribution. It also highlighted its inert gas production capacity, a strategic area for many industrial sectors including food, chemicals, and metallurgy.",
        "## Products and services on show",
        "At its stand, DIWA Industries gave a detailed presentation of its flagship products: butane and LPG gas cylinders, essential for domestic and industrial needs across West Africa. The company also highlighted its cylinder requalification services, a field crucial to ensuring the safety and durability of this equipment in use.",
        "## A commitment to quality and safety",
        "At the fair, DIWA Industries reaffirmed its commitment to excellence and safety. The company underlined the importance of rigour in its manufacturing and requalification processes, in order to guarantee products that comply with international quality standards. This commitment was widely appreciated by visitors, among them many energy sector professionals.",
      ],
      pt: [
        "De 22 de novembro a 8 de dezembro de 2024, a DIWA Industries participou com destaque na 19.ª Feira Internacional de Lomé, um grande evento que reúne empresas locais e internacionais. Foi a ocasião para a empresa apresentar os seus produtos e serviços, salientando a sua competência no fabrico e na requalificação de botijas de gás butano (GPL), bem como na produção de dióxido de carbono alimentar e industrial.",
        "## Uma participação marcante",
        "A feira internacional de Lomé, reconhecida pelo seu papel de plataforma de encontro entre os agentes económicos da sub-região, permitiu à DIWA Industries destacar-se. A empresa expôs as suas soluções industriais inovadoras, sublinhando o seu papel central no setor energético, em especial na distribuição de GPL. Apresentou também a sua capacidade de produção de gases inertes, uma área estratégica para numerosos setores industriais, como a alimentação, a química e a metalurgia.",
        "## Apresentação de produtos e serviços",
        "No seu stand, a DIWA Industries apresentou em detalhe os seus produtos de referência: as botijas de butano e GPL, essenciais para as necessidades domésticas e industriais em toda a África Ocidental. A empresa destacou igualmente os seus serviços de requalificação de botijas, decisivos para assegurar a segurança e a durabilidade destes equipamentos em utilização.",
        "## Um compromisso com a qualidade e a segurança",
        "Nesta feira, a DIWA Industries reafirmou o seu compromisso com a excelência e a segurança. A empresa sublinhou a importância do rigor nos seus processos de fabrico e de requalificação, de forma a garantir produtos conformes às normas internacionais de qualidade. Este compromisso foi amplamente apreciado pelos visitantes, entre os quais numerosos profissionais do setor energético.",
      ],
    },
  },
  {
    id: "visite-adedze",
    date: "2025-04-11",
    // Genuine press photograph of this exact visit, from the Togolese
    // Ministry of Trade's own coverage.
    image: "/images/facility/blitta-plant-visit-2021.jpg",
    slug: {
      fr: "kodjo-adedze-visite-diwa-industries",
      en: "minister-kodjo-adedze-visits-diwa-industries",
      pt: "ministro-kodjo-adedze-visita-a-diwa-industries",
    },
    title: {
      fr: "Kodjo ADEDZE visite DIWA Industries",
      en: "Minister Kodjo ADEDZE visits DIWA Industries",
      pt: "O ministro Kodjo ADEDZE visita a DIWA Industries",
    },
    excerpt: {
      fr: "Le 9 février 2021, le ministre du Commerce, de l'Industrie et de la Consommation locale a visité DIWA Industries à Blitta, dans la région Centrale du Togo.",
      en: "On 9 February 2021, the Minister of Trade, Industry and Local Consumption visited DIWA Industries in Blitta, in Togo's Central Region.",
      pt: "A 9 de fevereiro de 2021, o Ministro do Comércio, da Indústria e do Consumo Local visitou a DIWA Industries em Blitta, na região Central do Togo.",
    },
    body: {
      fr: [
        "Le 9 février 2021, Kodjo ADEDZE, le ministre du Commerce, de l'Industrie et de la Consommation locale a visité DIWA Industries à Blitta, dans la région Centrale du Togo.",
        "DIWA Industries, une filiale du groupe OSEO KAPI, se spécialise dans la fabrication et la requalification d'emballages métalliques ainsi que la production de gaz spéciaux et inertes. L'usine produit 500 000 bouteilles de gaz par an et 1 200 bouteilles par jour pour la requalification.",
        "Ses produits sont destinés au marché local et sous-régional. Le projet, d'une valeur de 7,5 milliards de FCFA, créera 180 emplois permanents.",
        "Le ministre a salué ce projet qui s'inscrit dans le Plan National de Développement, contribuant à la création d'emplois et à la lutte contre la pauvreté.",
      ],
      en: [
        "On 9 February 2021, Kodjo ADEDZE, Minister of Trade, Industry and Local Consumption, visited DIWA Industries in Blitta, in Togo's Central Region.",
        "DIWA Industries, a subsidiary of the OSEO KAPI Group, specialises in the manufacturing and requalification of metal packaging as well as the production of special and inert gases. The plant produces 500,000 gas cylinders per year and requalifies 1,200 cylinders per day.",
        "Its products are destined for the local and sub-regional market. The project, valued at 7.5 billion FCFA, will create 180 permanent jobs.",
        "The minister welcomed the project as part of the National Development Plan, contributing to job creation and the fight against poverty.",
      ],
      pt: [
        "A 9 de fevereiro de 2021, Kodjo ADEDZE, Ministro do Comércio, da Indústria e do Consumo Local, visitou a DIWA Industries em Blitta, na região Central do Togo.",
        "A DIWA Industries, filial do grupo OSEO KAPI, é especializada no fabrico e na requalificação de embalagens metálicas, bem como na produção de gases especiais e inertes. A fábrica produz 500 000 botijas de gás por ano e requalifica 1 200 botijas por dia.",
        "Os seus produtos destinam-se ao mercado local e sub-regional. O projeto, avaliado em 7,5 mil milhões de FCFA, criará 180 empregos permanentes.",
        "O ministro saudou o projeto, inscrito no Plano Nacional de Desenvolvimento, pelo seu contributo para a criação de emprego e para o combate à pobreza.",
      ],
    },
  },
];

export function getArticle(slug: string, locale: Locale) {
  return articles.find((a) => a.slug[locale] === slug);
}
