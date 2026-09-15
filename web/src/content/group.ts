import type { L10n } from "@/lib/i18n-types";

/**
 * Groupe OSEOR S.A. — the group Diwa Industries belongs to.
 *
 * Read from kapiconsult.tg/a-propos, which publishes the full list of
 * subsidiaries. Only the ones that sit on the same value chain as Diwa are
 * listed here: Diwa manufactures and requalifies the cylinders, and sibling
 * companies store, fill and distribute the gas that goes into them. That
 * vertical integration is the point of the section, so the consulting and
 * agri-food subsidiaries are left out.
 */

export type GroupCompany = {
  name: string;
  highlight?: boolean;
  role: L10n;
};

export const GROUP_COMPANIES: GroupCompany[] = [
  {
    name: "DIWA Industries",
    highlight: true,
    role: {
      fr: "Fabrication et requalification de bouteilles de gaz, emballages métalliques et accessoires.",
      en: "Manufacturing and requalification of gas cylinders, metal packaging and accessories.",
      pt: "Fabrico e requalificação de botijas de gás, embalagens metálicas e acessórios.",
    },
  },
  {
    name: "ZENER SA",
    role: {
      fr: "Stockage, emplissage et distribution de GPL. Leader du secteur au Togo avec plus de 65 % de part de marché.",
      en: "LPG storage, filling and distribution. Sector leader in Togo with over 65% market share.",
      pt: "Armazenamento, enchimento e distribuição de GPL. Líder do setor no Togo com mais de 65 % de quota de mercado.",
    },
  },
  {
    name: "PLS",
    role: {
      fr: "Stockage, reconditionnement et distribution du gaz butane.",
      en: "Butane storage, reconditioning and distribution.",
      pt: "Armazenamento, recondicionamento e distribuição de gás butano.",
    },
  },
  {
    name: "PGS",
    role: {
      fr: "Stockage, reconditionnement et distribution du gaz propane.",
      en: "Propane storage, reconditioning and distribution.",
      pt: "Armazenamento, recondicionamento e distribuição de gás propano.",
    },
  },
  {
    name: "Zen Grupo",
    role: {
      fr: "Stockage, emplissage et distribution de GPL.",
      en: "LPG storage, filling and distribution.",
      pt: "Armazenamento, enchimento e distribuição de GPL.",
    },
  },
  {
    name: "TRFS",
    role: {
      fr: "Transport de marchandises sur l'hinterland et le plan national.",
      en: "Freight transport across the hinterland and nationally.",
      pt: "Transporte de mercadorias no interior e a nível nacional.",
    },
  },
  {
    name: "DIWA International",
    role: {
      fr: "Représentation commerciale, lubrification industrielle et équipements technologiques.",
      en: "Commercial representation, industrial lubrication and technical equipment.",
      pt: "Representação comercial, lubrificação industrial e equipamentos tecnológicos.",
    },
  },
  {
    name: "KAPI Consult",
    role: {
      fr: "Cabinet d'études et de conseils en management, organisation et compétitivité.",
      en: "Management, organisation and competitiveness consulting firm.",
      pt: "Gabinete de estudos e consultoria em gestão, organização e competitividade.",
    },
  },
];

/**
 * Milestones, all from published sources: the ministerial visit and the
 * investment figures from the Ministry of Commerce and Togo First, the
 * certification dates from Diwa's own site.
 */
export type Milestone = {
  year: string;
  title: L10n;
  body: L10n;
};

export const MILESTONES: Milestone[] = [
  {
    year: "2021",
    title: {
      fr: "L'usine de Blitta entre en service",
      en: "The Blitta plant enters service",
      pt: "A fábrica de Blitta entra em funcionamento",
    },
    body: {
      fr: "Le 9 février 2021, le ministre du Commerce, de l'Industrie et de la Consommation locale visite les installations. Le projet représente un investissement de 7,5 milliards de FCFA et 180 emplois permanents.",
      en: "On 9 February 2021 the Minister of Trade, Industry and Local Consumption visits the facility. The project represents an investment of 7.5 billion FCFA and 180 permanent jobs.",
      pt: "A 9 de fevereiro de 2021, o Ministro do Comércio, da Indústria e do Consumo Local visita as instalações. O projeto representa um investimento de 7,5 mil milhões de FCFA e 180 empregos permanentes.",
    },
  },
  {
    year: "2022",
    title: {
      fr: "Certification ISO 9001",
      en: "ISO 9001 certification",
      pt: "Certificação ISO 9001",
    },
    body: {
      fr: "Le système de management de la qualité est certifié ISO 9001:2015, première des trois certifications du système intégré QSE.",
      en: "The quality management system is certified to ISO 9001:2015, the first of the three certifications making up the integrated QSE system.",
      pt: "O sistema de gestão da qualidade é certificado segundo a ISO 9001:2015, a primeira das três certificações que compõem o sistema integrado QSA.",
    },
  },
  {
    year: "2023",
    title: {
      fr: "Audits majors et adhésion WLPGA",
      en: "Major audits and WLPGA membership",
      pt: "Auditorias das majors e adesão à WLPGA",
    },
    body: {
      fr: "Audits par TotalEnergies (Paris) et Oryx (Genève), puis agrément et adhésion à l'Association Mondiale du GPL.",
      en: "Audited by TotalEnergies (Paris) and Oryx (Geneva), then approved as a member of the World LPG Association.",
      pt: "Auditorias pela TotalEnergies (Paris) e pela Oryx (Genebra), seguidas da aprovação e adesão à Associação Mundial do GPL.",
    },
  },
  {
    year: "2024",
    title: {
      fr: "ISO 45001 et ISO 14001",
      en: "ISO 45001 and ISO 14001",
      pt: "ISO 45001 e ISO 14001",
    },
    body: {
      fr: "Certification santé-sécurité au travail et management environnemental, complétant le système intégré QSE.",
      en: "Occupational health and safety and environmental management certification, completing the integrated QSE system.",
      pt: "Certificação em saúde e segurança no trabalho e em gestão ambiental, completando o sistema integrado QSA.",
    },
  },
  {
    year: "2025",
    title: {
      fr: "Expansion régionale",
      en: "Regional expansion",
      pt: "Expansão regional",
    },
    body: {
      fr: "Participation à la 19e Foire Internationale de Lomé puis à la 6e édition du West Africa LPG Expo à Lagos, au Nigeria.",
      en: "Participation in the 19th Lomé International Trade Fair, then the 6th West Africa LPG Expo in Lagos, Nigeria.",
      pt: "Participação na 19.ª Feira Internacional de Lomé e, em seguida, na 6.ª edição da West Africa LPG Expo em Lagos, na Nigéria.",
    },
  },
];
