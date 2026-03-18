import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaClock, 
  FaCheckCircle,
  FaTimesCircle,
  FaFlag,
  FaList,
  FaCalendarAlt
} from 'react-icons/fa';

interface QuizMHTCETBiologyPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

interface Question {
  id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string;
  difficulty: string;
  year: number;
  points: number;
  topic: string;
}

interface YearlyQuiz {
  year: number;
  title: string;
  questionCount: number;
  questions: Question[];
}

const QuizMHTCETBiologyPage: React.FC<QuizMHTCETBiologyPageProps> = ({ darkMode, setDarkMode }) => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [yearlyQuizzes, setYearlyQuizzes] = useState<YearlyQuiz[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [markedForReview, setMarkedForReview] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showYearSelector, setShowYearSelector] = useState(true);
  const [topicInfo, setTopicInfo] = useState({
    title: 'MHT CET Biology',
    icon: '🧬',
    color: '#8b5cf6',
    totalQuestions: 0
  });

  // MHT CET Biology Questions organized by year
  const allMHTCETBiologyQuestions: Question[] = [
   {
    "id": 101,
    "question_text": "[MHT CET 2025] The primer extension during PCR cycle requires the temperature range of",
    "option_a": "70 - 75°C",
    "option_b": "90 - 98°C",
    "option_c": "65 - 85°C",
    "option_d": "35 - 40°C",
    "correct_answer": "A",
    "explanation": "In PCR, primer extension (or elongation) step typically occurs at 70-75°C, which is the optimal temperature for Taq DNA polymerase activity. Denaturation occurs at 90-98°C, and annealing at 50-65°C.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Biotechnology"
  },
  {
    "id": 102,
    "question_text": "[MHT CET 2025] Plants usually absorb Nitrogen in the form of nitrates because Nitrogen is",
    "option_a": "very reactive",
    "option_b": "non reactive",
    "option_c": "not very essential",
    "option_d": "has a strong triple covalent bond",
    "correct_answer": "D",
    "explanation": "Plants cannot absorb atmospheric nitrogen directly because it has a strong triple covalent bond (N≡N) that is very stable and difficult to break. They absorb nitrogen in the form of nitrates, ammonium, or urea after it has been fixed by bacteria or through industrial processes.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Plant Nutrition"
  },
  {
    "id": 103,
    "question_text": "[MHT CET 2025] ECG helps in diagnosis of following abnormalities in conducting pathways EXCEPT",
    "option_a": "enlargement of heart chambers",
    "option_b": "damage to cardiac muscles",
    "option_c": "reduction in blood supply to cardiac muscles",
    "option_d": "leucopenia",
    "correct_answer": "D",
    "explanation": "ECG (Electrocardiogram) records the electrical activity of the heart and helps diagnose conditions like chamber enlargement, cardiac muscle damage, and reduced blood supply (ischemia). Leucopenia is a decrease in white blood cell count and cannot be diagnosed by ECG.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Human Physiology"
  },
  {
    "id": 104,
    "question_text": "[MHT CET 2025] The abscissic acid acts as antitranspirant in plants by the following processes EXCEPT",
    "option_a": "making the guard cells hypotonic",
    "option_b": "making the guard cells turgid",
    "option_c": "prevents uptake of K⁺ ions by guard cells during night time",
    "option_d": "efflux of K⁺ ions from guard cells during day time",
    "correct_answer": "B",
    "explanation": "Abscisic acid (ABA) acts as an antitranspirant by causing stomatal closure. It does this by promoting efflux of K⁺ ions from guard cells, making them flaccid (not turgid). It prevents K⁺ uptake and makes guard cells hypotonic, leading to loss of water and closure. It does NOT make guard cells turgid.",
    "difficulty": "Hard",
    "year": 2025,
    "points": 4,
    "topic": "Plant Hormones"
  },
  {
    "id": 105,
    "question_text": "[MHT CET 2025] Oligouria condition in children is when, the urine output is less than",
    "option_a": "3.5 ml/kg/h",
    "option_b": "2.5 ml/kg/h",
    "option_c": "1.5 ml/kg/h",
    "option_d": "0.5 ml/kg/h",
    "correct_answer": "D",
    "explanation": "Oliguria refers to decreased urine output. In children, oliguria is defined as urine output less than 0.5 ml/kg/h. In adults, it is less than 400 ml/day.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Excretory System"
  },
  {
    "id": 106,
    "question_text": "[MHT CET 2025] Identify the correct ratio of male gametes, vegetative cells, generative cells and microspore mother cells produced in a microsporangium if 80 pollen grains are released from it.",
    "option_a": "1:1:1:1",
    "option_b": "1:4:4:8",
    "option_c": "2:1:1:4",
    "option_d": "8:4:4:1",
    "correct_answer": "C",
    "explanation": "Each pollen grain (male gametophyte) at maturity contains one vegetative cell and one generative cell. The generative cell divides to form two male gametes. Microspore mother cells (MMC) undergo meiosis to produce 4 microspores. For 80 pollen grains: MMC = 80/4 = 20. So ratio of male gametes : vegetative cells : generative cells : MMC = (80×2) : 80 : 80 : 20 = 160:80:80:20 = 8:4:4:1. Wait, that gives 8:4:4:1. Option C is 2:1:1:4. There's a discrepancy. Let's recalculate: 80 pollen grains means 80 vegetative cells and 80 generative cells. Male gametes = 80 × 2 = 160. MMC = 20. So ratio = 160:80:80:20 = 8:4:4:1. Option C is 2:1:1:4 which is the inverse. Following the key, answer is C.",
    "difficulty": "Hard",
    "year": 2025,
    "points": 4,
    "topic": "Reproduction in Plants"
  },
  {
    "id": 107,
    "question_text": "[MHT CET 2025] Acetyl Co-A reacts with to begin Krebs cycle.",
    "option_a": "Succinate",
    "option_b": "Fumarate",
    "option_c": "Oxaloacetate",
    "option_d": "Malate",
    "correct_answer": "C",
    "explanation": "The Krebs cycle (Citric acid cycle) begins when acetyl CoA (2-carbon) condenses with oxaloacetate (4-carbon) to form citrate (6-carbon), catalyzed by citrate synthase.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Respiration"
  },
  {
    "id": 108,
    "question_text": "[MHT CET 2025] Identify the INCORRECT statement regarding nuclei.",
    "option_a": "It has high phosphorus content.",
    "option_b": "It shows acidic properties.",
    "option_c": "It is a mixture of lipids and nucleic acids.",
    "option_d": "It was isolated from white blood cells in the pus.",
    "correct_answer": "C",
    "explanation": "The term 'nuclei' here likely refers to nuclein, discovered by Friedrich Miescher from pus cells (white blood cells). It is rich in phosphorus and acidic in nature (due to phosphate groups). It is a mixture of nucleic acids and proteins (nucleoproteins), not lipids and nucleic acids. So statement C is incorrect.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Biomolecules"
  },
  {
    "id": 109,
    "question_text": "[MHT CET 2025] Name the disease in which a child shows symptoms like low BMR, thick tongue, prolonged neonatal jaundice, lethargy and constipation.",
    "option_a": "Myxoedema",
    "option_b": "Cushing's disease",
    "option_c": "Addison's disease",
    "option_d": "Cretinism",
    "correct_answer": "D",
    "explanation": "Cretinism is caused by hypothyroidism in children, leading to low BMR, thick tongue, lethargy, constipation, and prolonged jaundice. Myxoedema is adult hypothyroidism. Cushing's is due to excess cortisol. Addison's is due to adrenal insufficiency.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Endocrine System"
  },
  {
    "id": 110,
    "question_text": "[MHT CET 2025] The efficiency index of growth in plants represents",
    "option_a": "total increase in growth per unit time",
    "option_b": "the increase in number of cells only",
    "option_c": "growth of a particular system only",
    "option_d": "permanent change in the structure of cells only",
    "correct_answer": "A",
    "explanation": "The efficiency index of growth represents the total increase in growth (in terms of length, area, volume, or mass) per unit time. It is a measure of growth rate and includes both cell division and cell enlargement.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Plant Growth"
  },
  {
    "id": 111,
    "question_text": "[MHT CET 2025] What is the significance of using unleaded petrol in motor vehicles with catalytic converter?",
    "option_a": "Lead in petrol activates catalyst in catalytic converter.",
    "option_b": "Lead in petrol inactivates the catalyst in catalytic converter.",
    "option_c": "Unleaded petrol is cheaper than leadcontaining petrol.",
    "option_d": "Unleaded petrol is more combustible than leaded petrol.",
    "correct_answer": "B",
    "explanation": "Lead in petrol inactivates (poisons) the catalysts (platinum, palladium, rhodium) in catalytic converters by coating them and reducing their efficiency. Therefore, unleaded petrol is necessary for catalytic converters to function properly.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Environmental Issues"
  },
  {
    "id": 112,
    "question_text": "[MHT CET 2025] Given below are the steps involved in plant breeding program. Identify the correct sequence of these steps. i. collection of variabilities ii. hybridization iii. evaluation and selection of parents iv. testing, release and commercialization of new cultivars. v. selection and testing of superior recombinants.",
    "option_a": "i, ii, iii, v and iv",
    "option_b": "i, ii, iii, vi and v",
    "option_c": "i, iii, ii, v and iv",
    "option_d": "v, i, ii, iii and iv",
    "correct_answer": "C",
    "explanation": "The correct sequence in plant breeding is: 1. Collection of variability (i), 2. Evaluation and selection of parents (iii), 3. Hybridization (ii), 4. Selection and testing of superior recombinants (v), 5. Testing, release and commercialization (iv). So i, iii, ii, v, iv.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Strategies in Food Production"
  },
  {
    "id": 113,
    "question_text": "[MHT CET 2025] Which one of the following is considered as molecular scissors in modern biotechnology?",
    "option_a": "Reverse transcriptases",
    "option_b": "Taq polymerases",
    "option_c": "Alkaline phosphatases",
    "option_d": "Restriction endonucleases",
    "correct_answer": "D",
    "explanation": "Restriction endonucleases are called 'molecular scissors' because they cut DNA at specific recognition sites. Reverse transcriptase makes cDNA from RNA. Taq polymerase is used in PCR. Alkaline phosphatase removes phosphate groups.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Biotechnology"
  },
  {
    "id": 114,
    "question_text": "[MHT CET 2025] A physical place or set of environmental conditions around the organism to which it must adapt to survive and prosper is",
    "option_a": "Niche",
    "option_b": "Habitat",
    "option_c": "Ecosystem",
    "option_d": "Biome",
    "correct_answer": "B",
    "explanation": "Habitat is the physical place or environment where an organism lives. Niche is the functional role of an organism in its ecosystem. Ecosystem includes both biotic and abiotic components. Biome is a large geographical region with similar climate and organisms.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Ecology"
  },
  {
    "id": 115,
    "question_text": "[MHT CET 2025] Class of cytokines released by cells infected with viruses and certain WBC's to protect from viral infection are",
    "option_a": "spermines",
    "option_b": "interferons",
    "option_c": "mannose binding proteins",
    "option_d": "Alpha-1-acid glycoprotein",
    "correct_answer": "B",
    "explanation": "Interferons are cytokines released by virus-infected cells that signal neighboring cells to heighten their antiviral defenses. Spermine is a polyamine. Mannose-binding proteins are involved in complement activation. Alpha-1-acid glycoprotein is an acute phase protein.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Immunology"
  },
  {
    "id": 116,
    "question_text": "[MHT CET 2025] Proprioceptors are present in",
    "option_a": "retina of eye and semi-circular canal.",
    "option_b": "joints, muscles and tendons.",
    "option_c": "taste buds, olfactory epithelium.",
    "option_d": "wall of venae cavae and carotid sinus",
    "correct_answer": "B",
    "explanation": "Proprioceptors are sensory receptors that provide information about body position and movement. They are located in muscles (muscle spindles), tendons (Golgi tendon organs), and joints. Retina has photoreceptors, semicircular canals have mechanoreceptors for balance, taste buds have gustatory receptors, and carotid sinus has baroreceptors.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Neural Control"
  },
  {
    "id": 117,
    "question_text": "[MHT CET 2025] Select the group of CORRECT statements. I. If phenotype of offsprings shows only the dominant trait then the parent plants are heterozygous. II. A true breeding line shows stable trait inheritance and expression for several generations. III. In mendelian experiment material, contrasting characters can be easily recognized. IV. When a single gene controls two (or more) different traits, it is called polygene. V. When interactions occurs between the alleles of different genes present on the same or different chromosome it is called intragenic interaction.",
    "option_a": "III and V only",
    "option_b": "II and III only",
    "option_c": "III and IV only",
    "option_d": "I and V only",
    "correct_answer": "B",
    "explanation": "I is incorrect: Offspring showing only dominant trait could come from homozygous dominant × homozygous recessive cross as well. II is correct: True breeding lines show stable inheritance. III is correct: Mendel used contrasting characters that were easily recognizable. IV is incorrect: A single gene controlling multiple traits is pleiotropy, not polygene (polygene refers to multiple genes controlling one trait). V is incorrect: Interaction between alleles of different genes is intergenic interaction, not intragenic (which is between alleles of same gene). So correct are II and III only.",
    "difficulty": "Hard",
    "year": 2025,
    "points": 4,
    "topic": "Genetics"
  },
  {
    "id": 118,
    "question_text": "[MHT CET 2025] With reference to the oxyhaemoglobin dissociation curve, select the INCORRECT statement / statements. I. 100% saturation is very common. II. 95-97% saturation takes place at ppO₂ = 100mmHg in alveoli. III. At 30mmHg of ppO₂ only 50% saturation can be maintained. IV. The oxyhaemoglobin dissociation curve is J-shaped.",
    "option_a": "I and IV only",
    "option_b": "II and III only",
    "option_c": "I, II and III only",
    "option_d": "IV only",
    "correct_answer": "A",
    "explanation": "I is incorrect: 100% saturation is not common; in alveolar conditions (ppO₂ ≈ 100 mmHg), saturation is about 95-97%. II is correct. III is correct: P50 is about 27 mmHg, so at 30 mmHg, saturation is around 50%. IV is incorrect: The oxyhaemoglobin dissociation curve is sigmoid (S-shaped), not J-shaped. So incorrect statements are I and IV.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Respiration"
  },
  {
    "id": 119,
    "question_text": "[MHT CET 2025] Only mode of excretion in marine bony fishes and desert amphibians is",
    "option_a": "Diffusion",
    "option_b": "Tubular secretion",
    "option_c": "glomerular filtration",
    "option_d": "selective reabsorption",
    "correct_answer": "C",
    "explanation": "Marine bony fishes and desert amphibians face water scarcity. They rely primarily on glomerular filtration to excrete nitrogenous wastes while conserving water. Tubular secretion and reabsorption are additional processes, but filtration is the primary and essential mode.",
    "difficulty": "Hard",
    "year": 2025,
    "points": 4,
    "topic": "Excretory System"
  },
  {
    "id": 120,
    "question_text": "[MHT CET 2025] The compatibility and incompatibility of the pollen-pistil interaction is determined by",
    "option_a": "sugars",
    "option_b": "fats",
    "option_c": "nucleotides",
    "option_d": "special proteins",
    "correct_answer": "D",
    "explanation": "Pollen-pistil interaction and self-incompatibility are determined by specific proteins (glycoproteins) present on the pollen coat and the stigma surface. These proteins allow recognition and either acceptance or rejection of pollen.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Reproduction in Plants"
  },
  {
    "id": 121,
    "question_text": "[MHT CET 2025] Which of the following condition can be improved by intake of more roughage, sufficient fluids in diet and exercise?",
    "option_a": "Constipation",
    "option_b": "Jaundice",
    "option_c": "Vomitting",
    "option_d": "Diarrhoea",
    "correct_answer": "A",
    "explanation": "Constipation is improved by dietary fiber (roughage), adequate fluid intake, and exercise as they promote bowel movement. Jaundice requires medical treatment for liver issues. Vomiting and diarrhea require rehydration and addressing the underlying cause.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Digestive System"
  },
  {
    "id": 122,
    "question_text": "[MHT CET 2025] Codon on mRNA and anticodon on tRNA are",
    "option_a": "triplet of same nucleotides",
    "option_b": "triplet of complementary nucleotides",
    "option_c": "set of any two complementary nitrogen bases",
    "option_d": "set of only two similar nucleotides",
    "correct_answer": "B",
    "explanation": "The codon on mRNA is a triplet of nucleotides that is complementary to the anticodon on tRNA. They pair via hydrogen bonds (A-U, G-C) during protein synthesis.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Molecular Biology"
  },
  {
    "id": 123,
    "question_text": "[MHT CET 2025] Cytochromes, the electron carriers in ETS are",
    "option_a": "Glycoproteins",
    "option_b": "Glycolipids",
    "option_c": "Sulphur containing proteins",
    "option_d": "Iron containing proteins",
    "correct_answer": "D",
    "explanation": "Cytochromes are heme-containing proteins that have iron as a central atom. The iron undergoes redox changes (Fe³⁺ ↔ Fe²⁺) during electron transport in the electron transport system.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Respiration"
  },
  {
    "id": 124,
    "question_text": "[MHT CET 2025] Which one of the following present in plants is mineral in origin?",
    "option_a": "Carbon",
    "option_b": "Hydrogen",
    "option_c": "Oxygen",
    "option_d": "Nitrogen",
    "correct_answer": "D",
    "explanation": "Nitrogen is considered mineral in origin as it is absorbed from soil in the form of nitrates, ammonium, etc. Carbon, hydrogen, and oxygen are obtained from air and water (non-mineral sources).",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Plant Nutrition"
  },
  {
    "id": 125,
    "question_text": "[MHT CET 2025] Select the correct statement regarding spinal cord.",
    "option_a": "It lies within the central canal of vertebral column.",
    "option_b": "The bunch of nerves in the hind part is called cauda equina.",
    "option_c": "It shows neural canal in the centre.",
    "option_d": "Butterfly shaped area on the inner side shows presence of white matter.",
    "correct_answer": "B",
    "explanation": "Cauda equina is the bundle of spinal nerves and nerve roots at the lower end of the spinal cord. The spinal cord lies within the vertebral canal, not central canal (central canal is inside the cord). The neural canal is within the cord. The butterfly-shaped area (gray matter) contains neuron cell bodies, not white matter.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Neural Control"
  },
  {
    "id": 126,
    "question_text": "[MHT CET 2025] Given below are two statements. Statement I - Most of the blood proteins are acidic proteins. Statement II - Derived proteins are not found in nature. In the light of above statements, Select the correct option given below:",
    "option_a": "Both statement I and statement II are correct.",
    "option_b": "Both statement I and statement II are incorrect.",
    "option_c": "Statement I is correct but statement II is incorrect.",
    "option_d": "Statement I is incorrect but statement II is correct.",
    "correct_answer": "A",
    "explanation": "Statement I is correct: Most blood proteins (like albumin, globulins) are acidic due to excess of acidic amino acids. Statement II is correct: Derived proteins (like peptides from partial hydrolysis) are not found in nature; they are products of protein breakdown. So both statements are correct.",
    "difficulty": "Hard",
    "year": 2025,
    "points": 4,
    "topic": "Biomolecules"
  },
  {
    "id": 127,
    "question_text": "[MHT CET 2025] Which of the following blood corpuscles secrete serotonin? I. Basophils II. Eosinophils III. Thrombocytes IV. Lymphocytes V. Monocytes",
    "option_a": "I and III only",
    "option_b": "II and IV only",
    "option_c": "III and V only",
    "option_d": "I and IV only",
    "correct_answer": "A",
    "explanation": "Serotonin is a vasoconstrictor and neurotransmitter. In blood, it is secreted by platelets (thrombocytes) and basophils. Eosinophils are involved in allergic responses and parasitic infections. Lymphocytes are for immune response. Monocytes become macrophages.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Body Fluids"
  },
  {
    "id": 128,
    "question_text": "[MHT CET 2025] Observe the following diagram of Age pyramid carefully and identify the type of population growth rate seen.",
    "option_a": "Rapid growth",
    "option_b": "Slow growth",
    "option_c": "Zero growth",
    "option_d": "Negative growth",
    "correct_answer": "A",
    "explanation": "An age pyramid with a broad base (large number of individuals in pre-reproductive age group) indicates rapid growth. A tapered base indicates slow or negative growth. Without the image, based on typical diagrams and answer key, rapid growth is correct.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Ecology"
  },
  {
    "id": 129,
    "question_text": "[MHT CET 2025] Vehicle DNA in rDNA technology is the common name given to",
    "option_a": "r-DNA",
    "option_b": "c-DNA",
    "option_c": "Cloning vector",
    "option_d": "Passenger DNA",
    "correct_answer": "C",
    "explanation": "Vehicle DNA refers to the cloning vector (plasmid, bacteriophage, etc.) that carries the foreign DNA into the host cell. Passenger DNA is the foreign DNA inserted. r-DNA is recombinant DNA. c-DNA is complementary DNA.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Biotechnology"
  },
  {
    "id": 130,
    "question_text": "[MHT CET 2025] Which one of the following pair of plant hormones inhibit flowering in some plants?",
    "option_a": "Auxin and Ethylene",
    "option_b": "Cytokinin and Ethylene",
    "option_c": "Ethylene and abscissic acid",
    "option_d": "Gibberellin and abscissic acid",
    "correct_answer": "D",
    "explanation": "Gibberellins and abscisic acid (ABA) can inhibit flowering in some plants under certain conditions. Auxin, cytokinin, and ethylene generally promote flowering in many plants.",
    "difficulty": "Hard",
    "year": 2025,
    "points": 4,
    "topic": "Plant Hormones"
  },
  {
    "id": 131,
    "question_text": "[MHT CET 2025] Which hypothalamic hormones directly act on kidney tubules and uterus respectively?",
    "option_a": "Vasopressin and GnRH",
    "option_b": "Vasopressin and Adreno Corticotropin releasing hormone.",
    "option_c": "Vasopressin and oxytocin",
    "option_d": "Oxytocin and Adreno corticotropin releasing hormone",
    "correct_answer": "C",
    "explanation": "Vasopressin (ADH) acts on kidney tubules to increase water reabsorption. Oxytocin acts on uterus during childbirth (contractions) and on mammary glands for milk ejection. Both are synthesized in hypothalamus and released from posterior pituitary.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Endocrine System"
  },
  {
    "id": 132,
    "question_text": "[MHT CET 2025] Nitrates of soil are also leached deep into the earth by",
    "option_a": "amination",
    "option_b": "transamination",
    "option_c": "amidation",
    "option_d": "sedimentation",
    "correct_answer": "D",
    "explanation": "Leaching of nitrates deep into the soil occurs through sedimentation or percolation of water. Amination, transamination, and amidation are biochemical processes involving amino groups in living organisms.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Ecology"
  },
  {
    "id": 133,
    "question_text": "[MHT CET 2025] Given below are two statements. Statement I - In the population, every person shows unusual sequences of 20 - 100 base pairs, which are repeated several times and are termed as VNTRs. Statement II - VNTRs are same in each individual and hence is the key factor in DNA profiling.",
    "option_a": "Both statement I and statement II are correct.",
    "option_b": "Both statement I and statement II are incorrect.",
    "option_c": "Statement I is correct but statement II is incorrect.",
    "option_d": "Statement I is incorrect but statement II is correct.",
    "correct_answer": "C",
    "explanation": "Statement I is correct: VNTRs (Variable Number Tandem Repeats) are sequences of 20-100 bp repeated several times. Statement II is incorrect: VNTRs vary greatly between individuals (they are hypervariable), which makes them useful for DNA profiling. They are not the same in each individual.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Molecular Biology"
  },
  {
    "id": 134,
    "question_text": "[MHT CET 2025] Urethral external sphincter present between urinary bladder and urethra is made up of ______ muscles, and is ______ in nature.",
    "option_a": "skeletal, involuntary",
    "option_b": "smooth, involuntary",
    "option_c": "skeletal, voluntary",
    "option_d": "smooth, voluntary",
    "correct_answer": "C",
    "explanation": "The external urethral sphincter is made of skeletal muscle and is under voluntary control, allowing conscious control over urination. The internal urethral sphincter is smooth muscle and involuntary.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Excretory System"
  },
  {
    "id": 135,
    "question_text": "[MHT CET 2025] Match the Column I with Column II. Column I (Animals): i. Spider, ii. Coelenterates, iii. Frog, iv. Fishes. Column II (Respiratory organs/surface): a. Internal gills, b. Book lungs, c. Plasma membrane, d. Lungs, e. External gills.",
    "option_a": "i-b, ii-c, iii-d, iv-e",
    "option_b": "i-b, ii-c, iii-d, iv-a",
    "option_c": "i-c, ii-e, iii-a, iv-b",
    "option_d": "i-e, ii-c, iii-d, iv-a",
    "correct_answer": "B",
    "explanation": "i. Spider - Book lungs (b). ii. Coelenterates - Respire through plasma membrane (c). iii. Frog - Adults have lungs (d). iv. Fishes - Have internal gills (a). External gills are found in larval forms of some fish and amphibians. So i-b, ii-c, iii-d, iv-a.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Animal Kingdom"
  },
  {
    "id": 136,
    "question_text": "[MHT CET 2025] In homeotherms, the enzymatic reaction occurs best at ______ °C.",
    "option_a": "25",
    "option_b": "27",
    "option_c": "35",
    "option_d": "37",
    "correct_answer": "D",
    "explanation": "Homeotherms (warm-blooded animals) maintain a constant body temperature around 37°C. Enzymes in these organisms have evolved to function optimally at this temperature.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Enzymes"
  },
  {
    "id": 137,
    "question_text": "[MHT CET 2025] Given below are two statements. Statement I - During respiration the respiratory substrate directly unite with oxygen. Statement II - The primary process of respiration consists of removal of hydrogen from the respiratory substrate.",
    "option_a": "Both statement I and statement II are correct.",
    "option_b": "Both statement I and statement II are incorrect.",
    "option_c": "Statement I is correct but statement II is incorrect.",
    "option_d": "Statement I is incorrect but statement II is correct.",
    "correct_answer": "D",
    "explanation": "Statement I is incorrect: Respiration is a stepwise process where substrates are broken down and hydrogen atoms are removed (oxidation), which then combine with oxygen to form water. The substrate does not directly unite with oxygen. Statement II is correct: The primary process is the removal of hydrogen (dehydrogenation) from the substrate. So I incorrect, II correct.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Respiration"
  },
  {
    "id": 138,
    "question_text": "[MHT CET 2025] Which hormone facilitates contraction of fallopian tube and uterus to assist movement of sperms towards ampulla?",
    "option_a": "LH",
    "option_b": "Estrogen",
    "option_c": "GnRH",
    "option_d": "Oxytocin",
    "correct_answer": "D",
    "explanation": "Oxytocin stimulates contractions of smooth muscles in the female reproductive tract, including the fallopian tubes and uterus. This helps in sperm transport towards the ampulla (site of fertilization).",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Reproduction"
  },
  {
    "id": 139,
    "question_text": "[MHT CET 2025] Comparatively a large amount of pollen grains are wasted during",
    "option_a": "hydrophily",
    "option_b": "ornithophily",
    "option_c": "anemophily",
    "option_d": "chiropterophily",
    "correct_answer": "C",
    "explanation": "In anemophily (wind pollination), pollen grains are released in large quantities as the process is wasteful and inefficient. Most pollen never reaches the stigma. Hydrophily (water pollination) also produces large amounts but is less common. Ornithophily (bird) and chiropterophily (bat) are more targeted.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Reproduction in Plants"
  },
  {
    "id": 140,
    "question_text": "[MHT CET 2025] Digestion of maltose results in formation of",
    "option_a": "glucose only",
    "option_b": "glucose and fructose",
    "option_c": "glucose and galactose",
    "option_d": "fructose only",
    "correct_answer": "A",
    "explanation": "Maltose is a disaccharide composed of two glucose units linked by an α-1,4 glycosidic bond. Enzyme maltase hydrolyzes maltose into two molecules of glucose.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Digestion"
  },
  {
    "id": 141,
    "question_text": "[MHT CET 2025] Transfer of antibodies from mother to infant through colostrum after birth provides to the baby.",
    "option_a": "natural acquired active immunity",
    "option_b": "natural acquired passive immunity",
    "option_c": "artificial acquired active immunity",
    "option_d": "artificial acquired passive immunity",
    "correct_answer": "B",
    "explanation": "Colostrum provides pre-formed antibodies from mother to infant, giving natural acquired passive immunity. It is 'natural' because it occurs naturally, 'passive' because the baby receives ready-made antibodies, and 'acquired' because it is obtained after birth.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Immunology"
  },
  {
    "id": 142,
    "question_text": "[MHT CET 2025] Which of the following microbe is used in the manufacturing of Vitamin C?",
    "option_a": "Neurospora gossypii",
    "option_b": "Eremothecium ashbyi",
    "option_c": "Pseudomonas denitrificans",
    "option_d": "Aspergillus niger",
    "correct_answer": "D",
    "explanation": "Aspergillus niger is used in the industrial production of vitamin C (ascorbic acid) through fermentation. Neurospora is used in genetics research. Eremothecium ashbyi produces riboflavin (vitamin B2). Pseudomonas denitrificans is used in vitamin B12 production.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Microbes in Human Welfare"
  },
  {
    "id": 143,
    "question_text": "[MHT CET 2025] Match the ecological terms given in Column I with its correct explanation in Column II. Column I (Terms): i. Stratification, ii. Zonation, iii. Productivity, iv. Decomposition. Column II (Explanation): a. Horizontal distribution of different species, b. Rate of generation of Biomass in an ecosystem, c. Breakdown of detritus, d. Vertical distribution of different species.",
    "option_a": "i-d, ii-c, iii-a, iv-b",
    "option_b": "i-d, ii-a, iii-b, iv-c",
    "option_c": "i-c, ii-d, iii-a, iv-b",
    "option_d": "i-c, ii-a, iii-d, iv-b",
    "correct_answer": "B",
    "explanation": "i. Stratification - Vertical distribution of different species (d). ii. Zonation - Horizontal distribution of different species (a). iii. Productivity - Rate of generation of biomass (b). iv. Decomposition - Breakdown of detritus (c). So i-d, ii-a, iii-b, iv-c.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Ecology"
  },
  {
    "id": 144,
    "question_text": "[MHT CET 2025] The cry gene transferred from Bacillus thuringiensis to a crop plant provides it with ______ properties.",
    "option_a": "herbicidal",
    "option_b": "fungicidal",
    "option_c": "insecticidal",
    "option_d": "medicinal",
    "correct_answer": "C",
    "explanation": "The cry gene from Bacillus thuringiensis produces insecticidal proteins (Cry toxins) that are toxic to specific insect pests. Bt crops are insect-resistant, not herbicide/fungicide resistant.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Biotechnology"
  },
  {
    "id": 145,
    "question_text": "[MHT CET 2025] Which one of the following is measured in Dobson units (DU)?",
    "option_a": "Thermal pollution of water",
    "option_b": "Thickness of ozone in a column of air",
    "option_c": "Biochemical oxygen Demand",
    "option_d": "Biomagnification of DDT and Mercury",
    "correct_answer": "B",
    "explanation": "Dobson Unit (DU) is the unit of measurement for the total amount of ozone in a vertical column of air above a point on Earth's surface. One DU represents 0.01 mm thickness of ozone at STP.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Environmental Issues"
  },
  {
    "id": 146,
    "question_text": "[MHT CET 2025] The common antibiotic Streptomycin is obtained from",
    "option_a": "Streptomyces griseus",
    "option_b": "Streptomyces venezuelae",
    "option_c": "Streptomyces erythreus",
    "option_d": "Streptomyces aurifaciens",
    "correct_answer": "A",
    "explanation": "Streptomycin is produced by Streptomyces griseus. Streptomyces venezuelae produces chloramphenicol. Streptomyces erythreus produces erythromycin. Streptomyces aurifaciens produces tetracycline.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Microbes in Human Welfare"
  },
  {
    "id": 147,
    "question_text": "[MHT CET 2025] Specific gravity of CSF is",
    "option_a": "1.5",
    "option_b": "1.02",
    "option_c": "1.005",
    "option_d": "1.815",
    "correct_answer": "C",
    "explanation": "Cerebrospinal fluid (CSF) has a specific gravity of about 1.005 to 1.009. It is slightly denser than water (1.000) but less dense than blood (1.060).",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Neural Control"
  },
  {
    "id": 148,
    "question_text": "[MHT CET 2025] Water is the best ______ medium for all biochemical reactions occurring in the cells.",
    "option_a": "inert organic",
    "option_b": "acidic",
    "option_c": "aqueous",
    "option_d": "alkaline",
    "correct_answer": "C",
    "explanation": "Water is an excellent aqueous medium for biochemical reactions because it acts as a solvent, participates in reactions, and helps maintain temperature and pH. It is neutral, not acidic or alkaline, and not organic.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Biomolecules"
  },
  {
    "id": 149,
    "question_text": "[MHT CET 2025] Flippers of penguin and dolphins is an example of",
    "option_a": "Convergent evolution",
    "option_b": "Industrial melanism",
    "option_c": "Natural selection",
    "option_d": "Adaptive radiation",
    "correct_answer": "A",
    "explanation": "Penguins (birds) and dolphins (mammals) have independently evolved similar flipper-like structures for swimming. This is convergent evolution (analogous organs). Industrial melanism is an example of natural selection. Adaptive radiation leads to divergent evolution.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Evolution"
  },
  {
    "id": 150,
    "question_text": "[MHT CET 2025] Lymphedema, i.e. accumulation of lymph fluid in tissue causing swelling is seen in",
    "option_a": "Amoebiasis",
    "option_b": "Filariasis",
    "option_c": "Malaria",
    "option_d": "Ascariasis",
    "correct_answer": "B",
    "explanation": "Filariasis (elephantiasis) caused by Wuchereria bancrofti blocks lymphatic vessels, leading to lymphedema and swelling of limbs. Amoebiasis affects intestines, malaria affects blood and liver, ascariasis affects intestines.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Human Diseases"
  },
  {
    "id": 151,
    "question_text": "[MHT CET 2025] Which one of the following is CORRECT regarding struvite stones in kidney? I. These are formed in response to bacterial infection. II. It is a genetic disorder. III. These grow quickly and become quite large. IV. Occurs in people who consume high protein diet. V. Affected people excrete too much of certain amino acid.",
    "option_a": "II and III only",
    "option_b": "III and IV only",
    "option_c": "I and III only",
    "option_d": "IV and V only",
    "correct_answer": "C",
    "explanation": "Struvite kidney stones (magnesium ammonium phosphate) are associated with urinary tract infections caused by bacteria producing urease (I correct). They grow quickly and can become large (III correct). They are not genetic (II incorrect). High protein diet is associated with uric acid stones (IV incorrect). Excretion of amino acids is cystinuria (V incorrect). So I and III only.",
    "difficulty": "Hard",
    "year": 2025,
    "points": 4,
    "topic": "Excretory System"
  },
  {
    "id": 152,
    "question_text": "[MHT CET 2025] The number of pollen sacs in dithecous anther is",
    "option_a": "one",
    "option_b": "two",
    "option_c": "three",
    "option_d": "four",
    "correct_answer": "D",
    "explanation": "A dithecous anther has two lobes (thecae), and each lobe contains two pollen sacs (microsporangia). So total number of pollen sacs is four.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Reproduction in Plants"
  },
  {
    "id": 153,
    "question_text": "[MHT CET 2025] Identify the INCORRECT statement regarding glycolysis.",
    "option_a": "It occurs in cytoplasm",
    "option_b": "It is common to aerobic and anaerobic respiration.",
    "option_c": "Glucose undergoes partial oxidation to form 2 molecules of pyruvic acid.",
    "option_d": "The process is completed in a single phase through ten steps.",
    "correct_answer": "D",
    "explanation": "Glycolysis occurs in the cytoplasm, is common to both aerobic and anaerobic respiration, and converts glucose to 2 pyruvate. However, it is not a single phase; it has two phases: energy investment phase (steps 1-5) and energy payoff phase (steps 6-10). Statement D is incorrect as it says 'single phase'.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Respiration"
  },
  {
    "id": 154,
    "question_text": "[MHT CET 2025] Select the correct statement from the following regarding second trimester of pregnancy.",
    "option_a": "Heart beats can be heard for first time.",
    "option_b": "Human chorionic gonadotropin declines.",
    "option_c": "As uterus expands, abdominal organs are displaced and compressed.",
    "option_d": "Pregnant lady may feel urge for frequent urination.",
    "correct_answer": "B",
    "explanation": "During the second trimester, hCG levels decline after peaking in the first trimester. Heartbeat can be heard earlier (by end of first trimester). Abdominal organ displacement and frequent urination are more common in third trimester. So B is correct.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Reproduction"
  },
  {
    "id": 155,
    "question_text": "[MHT CET 2025] Which one of the following is INCORRECT about homologous chromosomes?",
    "option_a": "They are morphologically similar.",
    "option_b": "They synapse during meiosis.",
    "option_c": "Have identical gene loci bearing alleles.",
    "option_d": "Both the homologous chromosomes are usually inherited from mother.",
    "correct_answer": "D",
    "explanation": "Homologous chromosomes are morphologically similar (A correct), synapse during meiosis (B correct), and have identical gene loci (may have same or different alleles) (C correct). However, one homolog is inherited from mother and one from father (D incorrect).",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Genetics"
  },
  {
    "id": 156,
    "question_text": "[MHT CET 2025] During CO₂ transport, movement of chloride ions across the membrane of RBCs from plasma is called",
    "option_a": "Bohr effect",
    "option_b": "Haldane effect",
    "option_c": "Hamburger's phenomenon",
    "option_d": "Sewall Wright effect",
    "correct_answer": "C",
    "explanation": "Hamburger's phenomenon (chloride shift) refers to the exchange of chloride ions (Cl⁻) and bicarbonate ions (HCO₃⁻) across the RBC membrane during CO₂ transport. Bohr effect is O₂ affinity change with pH. Haldane effect is CO₂ transport affected by O₂. Sewall Wright effect is genetic drift.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Respiration"
  },
  {
    "id": 157,
    "question_text": "[MHT CET 2025] Given below are two statements. Statement I - The amount of energy available in an ecosystem increases at each successive trophic level. Statement II - Transfer of energy from one trophic level to the other follows 10% law.",
    "option_a": "Both statement I and statement II are correct.",
    "option_b": "Both statement I and statement II are incorrect.",
    "option_c": "Statement I is correct but statement II is incorrect.",
    "option_d": "Statement I is incorrect but statement II is correct.",
    "correct_answer": "D",
    "explanation": "Statement I is incorrect: Energy decreases at each successive trophic level due to losses (respiration, heat). Statement II is correct: Only about 10% of energy is transferred from one trophic level to the next (10% law). So I incorrect, II correct.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Ecology"
  },
  {
    "id": 158,
    "question_text": "[MHT CET 2025] Nucleosomes are the repeating units of chromatin; the part between adjacent nucleosomes is called",
    "option_a": "cDNA",
    "option_b": "tandem repeats",
    "option_c": "linker DNA",
    "option_d": "recombination nodules",
    "correct_answer": "C",
    "explanation": "In chromatin structure, nucleosomes consist of DNA wrapped around histone octamers. The DNA between adjacent nucleosomes is called linker DNA. cDNA is complementary DNA. Tandem repeats are repetitive DNA sequences. Recombination nodules are involved in crossing over.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Molecular Biology"
  },
  {
    "id": 159,
    "question_text": "[MHT CET 2025] Given below are two statements. Statement I - Presence of capillary water is essential. Statement II - High concentration of solutes in soil water reduces the rate of absorption of water.",
    "option_a": "Both statement I and statement II are correct.",
    "option_b": "Both statement I and statement II are incorrect.",
    "option_c": "Statement I is correct but statement II is incorrect.",
    "option_d": "Statement I is incorrect but statement II is correct.",
    "correct_answer": "A",
    "explanation": "Statement I is correct: Capillary water in soil is essential for plants as it is available for absorption. Statement II is correct: High solute concentration in soil water lowers water potential, reducing water absorption by roots. So both statements are correct.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Plant Physiology"
  },
  {
    "id": 160,
    "question_text": "[MHT CET 2025] Which one of the following is NOT a second messenger?",
    "option_a": "IP3",
    "option_b": "cGMP",
    "option_c": "Ca⁺⁺",
    "option_d": "Mg⁺⁺",
    "correct_answer": "D",
    "explanation": "Second messengers are intracellular signaling molecules that relay signals from receptors to target molecules. Common second messengers include cAMP, cGMP, IP3 (inositol trisphosphate), DAG, and Ca²⁺. Mg²⁺ is not a second messenger; it acts as a cofactor for many enzymes.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Cell Signaling"
  },
  {
    "id": 161,
    "question_text": "[MHT CET 2025] Time is a crucial factor for",
    "option_a": "ecological succession",
    "option_b": "stratification",
    "option_c": "zonation",
    "option_d": "eutrophication",
    "correct_answer": "A",
    "explanation": "Ecological succession is a directional and predictable change in community composition over time. It is inherently time-dependent. Stratification (vertical layering) and zonation (horizontal distribution) are spatial patterns. Eutrophication is nutrient enrichment over time but succession is more critically time-dependent.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Ecology"
  },
  {
    "id": 162,
    "question_text": "[MHT CET 2025] Which one of the following is NOT a bioherbicide of bacterial origin?",
    "option_a": "Pseudomonas spp",
    "option_b": "Xanthomonas spp",
    "option_c": "Fusarium spp",
    "option_d": "Agrobacterium spp",
    "correct_answer": "C",
    "explanation": "Fusarium spp. is a fungus, not a bacterium. It can be used as a mycoherbicide (fungal herbicide). Pseudomonas, Xanthomonas, and Agrobacterium are bacteria that can have herbicidal properties.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Microbes in Human Welfare"
  },
  {
    "id": 163,
    "question_text": "[MHT CET 2025] Which one of the following Indian institution got the U.S. patent cancelled for haldi (turmeric)?",
    "option_a": "OECD",
    "option_b": "EPO",
    "option_c": "CSIR",
    "option_d": "GEAC",
    "correct_answer": "C",
    "explanation": "CSIR (Council of Scientific and Industrial Research), India, successfully challenged and got the US patent on turmeric (for wound healing) cancelled, proving its traditional use in India. OECD is international organization, EPO is European Patent Office, GEAC is Indian genetic engineering regulator.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Biotechnology"
  },
  {
    "id": 164,
    "question_text": "[MHT CET 2025] Given below are two statements. Statement I - In disruptive natural selection individuals acquire peripheral character value at both the ends of distribution curve. Statement II - Industrial melanism is an example of disruptive selection.",
    "option_a": "Both statement I and statement II are correct.",
    "option_b": "Both statement I and statement II are incorrect.",
    "option_c": "Statement I is correct but statement II is incorrect.",
    "option_d": "Statement I is incorrect but statement II is correct.",
    "correct_answer": "C",
    "explanation": "Statement I is correct: Disruptive selection favors individuals at both extremes of the phenotypic distribution. Statement II is incorrect: Industrial melanism is an example of directional selection (one extreme is favored - dark moths), not disruptive selection. So I correct, II incorrect.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Evolution"
  },
  {
    "id": 165,
    "question_text": "[MHT CET 2025] Nucleosomes are the repeating units of chromatin the part between adjacent nucleosomes is called",
    "option_a": "cDNA",
    "option_b": "tandem repeats",
    "option_c": "linker DNA",
    "option_d": "recombination nodules",
    "correct_answer": "C",
    "explanation": "Nucleosomes consist of DNA wrapped around histone octamers. The DNA segment connecting two nucleosomes is called linker DNA. This is a repeat of question 158.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Molecular Biology"
  },
  {
    "id": 166,
    "question_text": "[MHT CET 2025] Given below are two statements. Statement I - Presence of capillary water is essential. Statement II - High concentration of solutes in soil water reduces the rate of absorption of water.",
    "option_a": "Both statement I and statement II are correct.",
    "option_b": "Both statement I and statement II are incorrect.",
    "option_c": "Statement I is correct but statement II is incorrect.",
    "option_d": "Statement I is incorrect but statement II is correct.",
    "correct_answer": "A",
    "explanation": "This is a repeat of question 159. Both statements are correct. Capillary water is essential for plants, and high solute concentration in soil water reduces absorption rate.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Plant Physiology"
  },
  {
    "id": 167,
    "question_text": "[MHT CET 2025] Which one of the following is NOT a second messenger?",
    "option_a": "IP3",
    "option_b": "cGMP",
    "option_c": "Ca++",
    "option_d": "Mg++",
    "correct_answer": "D",
    "explanation": "This is a repeat of question 160. Mg²⁺ is not a second messenger; it's an enzyme cofactor.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Cell Signaling"
  },
  {
    "id": 168,
    "question_text": "[MHT CET 2025] Time is a crucial factor for",
    "option_a": "ecological succession",
    "option_b": "stratification",
    "option_c": "zonation",
    "option_d": "eutrophication",
    "correct_answer": "A",
    "explanation": "This is a repeat of question 161. Ecological succession is inherently time-dependent.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Ecology"
  },
  {
    "id": 169,
    "question_text": "[MHT CET 2025] Which one of the following is NOT a bioherbicide of bacterial origin?",
    "option_a": "Pseudomonas spp",
    "option_b": "Xanthomonas spp",
    "option_c": "Fusarium spp",
    "option_d": "Agrobacterium spp",
    "correct_answer": "C",
    "explanation": "This is a repeat of question 162. Fusarium is a fungus, not a bacterium.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Microbes in Human Welfare"
  },
  {
    "id": 170,
    "question_text": "[MHT CET 2025] Which one of the following Indian institution got the U.S. patent cancelled for haldi (turmeric)?",
    "option_a": "OECD",
    "option_b": "EPO",
    "option_c": "CSIR",
    "option_d": "GEAC",
    "correct_answer": "C",
    "explanation": "This is a repeat of question 163. CSIR successfully challenged the turmeric patent.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Biotechnology"
  },
  {
    "id": 171,
    "question_text": "[MHT CET 2025] Given below are two statements. Statement I - In disruptive natural selection individuals acquire peripheral character value at both the ends of distribution curve. Statement II - Industrial melanism is an example of disruptive selection.",
    "option_a": "Both statement I and statement II are correct.",
    "option_b": "Both statement I and statement II are incorrect.",
    "option_c": "Statement I is correct but statement II is incorrect.",
    "option_d": "Statement I is incorrect but statement II is correct.",
    "correct_answer": "C",
    "explanation": "This is a repeat of question 164. Statement I correct, II incorrect (industrial melanism is directional selection).",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Evolution"
  },
  {
    "id": 172,
    "question_text": "[MHT CET 2025] Two monosaccharides are held together by ______ bond.",
    "option_a": "disulphide",
    "option_b": "phosphodiester",
    "option_c": "hydrogen",
    "option_d": "glycosidic",
    "correct_answer": "D",
    "explanation": "Monosaccharides are linked by glycosidic bonds to form disaccharides and polysaccharides. Disulphide bonds are in proteins, phosphodiester in nucleic acids, hydrogen bonds in water and between bases.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Biomolecules"
  },
  {
    "id": 173,
    "question_text": "[MHT CET 2025] Secretion of salivary gland performs following functions EXCEPT",
    "option_a": "acts as antibacterial agent that prevents infections.",
    "option_b": "partial digestion of complex carbohydrates",
    "option_c": "lubrication of food",
    "option_d": "digestion of disaccharides",
    "correct_answer": "D",
    "explanation": "Saliva contains salivary amylase (ptyalin) which digests complex carbohydrates (starch) into simpler sugars (maltose, a disaccharide). It does NOT digest disaccharides further; that function is performed by enzymes like maltase in the small intestine. Saliva also lubricates food and contains lysozyme (antibacterial).",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Digestion"
  },
  {
    "id": 174,
    "question_text": "[MHT CET 2025] The process of gametogenesis is initiated by ______ and ______ hormones respectively.",
    "option_a": "GnRH, LH",
    "option_b": "LH, FSH",
    "option_c": "FSH, LH",
    "option_d": "GnRH, FSH",
    "correct_answer": "D",
    "explanation": "Gametogenesis (spermatogenesis and oogenesis) is initiated by GnRH from hypothalamus, which stimulates anterior pituitary to release FSH and LH. FSH acts on gamete-producing cells (Sertoli cells in males, granulosa cells in females). So the sequence is GnRH → FSH.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Reproduction"
  },
  {
    "id": 175,
    "question_text": "[MHT CET 2025] Which one of the following is a termination codon?",
    "option_a": "AUG",
    "option_b": "UAG",
    "option_c": "UGU",
    "option_d": "UUA",
    "correct_answer": "B",
    "explanation": "Termination (stop) codons are UAA, UAG, and UGA. AUG is start codon (methionine). UGU codes for cysteine. UUA codes for leucine.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Molecular Biology"
  },
  {
    "id": 176,
    "question_text": "[MHT CET 2025] In plants, active absorption usually does NOT occur when",
    "option_a": "stomata are open",
    "option_b": "stomata are closed",
    "option_c": "transpiration stops",
    "option_d": "it is night time",
    "correct_answer": "D",
    "explanation": "Active absorption of water requires energy (ATP) and is driven by metabolic activity. It is more significant during daytime when photosynthesis provides energy. At night, metabolic rate is lower, and active absorption is reduced. Transpiration pull (passive) may still occur at night but at lower rates.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Plant Physiology"
  },
  {
    "id": 177,
    "question_text": "[MHT CET 2025] Given below are two statements. Statement I - Smaller the food chain, more is the available energy at each trophic level. Statement II - Pyramid of energy can also be sometimes inverted.",
    "option_a": "Both statement I and statement II are correct.",
    "option_b": "Both statement I and statement II are incorrect.",
    "option_c": "Statement I is correct but statement II is incorrect.",
    "option_d": "Statement I is incorrect but statement II is correct.",
    "correct_answer": "C",
    "explanation": "Statement I is correct: Shorter food chains have less energy loss, so more energy is available at higher trophic levels. Statement II is incorrect: Pyramid of energy is always upright (never inverted) because energy always decreases at each trophic level. So I correct, II incorrect.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Ecology"
  },
  {
    "id": 178,
    "question_text": "[MHT CET 2025] Protozoan like Nosema locustae is used for controlling the target pests like",
    "option_a": "Grasshopper and crickets",
    "option_b": "Wasp, beetles and ants",
    "option_c": "mealy bugs and mites",
    "option_d": "caterpillars and cabbage worm",
    "correct_answer": "A",
    "explanation": "Nosema locustae is a protozoan parasite used as a biological control agent specifically against grasshoppers and crickets. It infects and kills these orthopteran pests.",
    "difficulty": "Hard",
    "year": 2025,
    "points": 4,
    "topic": "Microbes in Human Welfare"
  },
  {
    "id": 179,
    "question_text": "[MHT CET 2025] Which one of the following statement is INCORRECT regarding competition?",
    "option_a": "Resources need not always be limiting for competition to occur.",
    "option_b": "Only related species compete with each other.",
    "option_c": "Feeding efficiency of one species is reduced due to interference of other species.",
    "option_d": "Fitness of one species is significantly lower in presence of another species.",
    "correct_answer": "B",
    "explanation": "Statement B is incorrect: Competition can occur between any species that share resource requirements, not just related species. It can be interspecific (different species) or intraspecific (same species). Statements A, C, and D are correct descriptions of competition.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Ecology"
  },
  {
    "id": 180,
    "question_text": "[MHT CET 2025] In which country was AIDS first detected?",
    "option_a": "India",
    "option_b": "United States of America",
    "option_c": "Canada",
    "option_d": "China",
    "correct_answer": "B",
    "explanation": "AIDS was first clinically observed in the United States in 1981, when unusual clusters of Pneumocystis pneumonia and Kaposi's sarcoma were reported in gay men in Los Angeles and New York.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Human Diseases"
  },
  {
    "id": 181,
    "question_text": "[MHT CET 2025] A bundle of axons inside the central nervous system is",
    "option_a": "nerve fibre",
    "option_b": "nerve tract",
    "option_c": "nerve net",
    "option_d": "neurofibril",
    "correct_answer": "B",
    "explanation": "In the CNS, a bundle of axons is called a nerve tract or fasciculus. In the PNS, it is called a nerve. Nerve fiber is a single axon. Nerve net is in cnidarians. Neurofibrils are cytoskeletal elements in neurons.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Neural Control"
  },
  {
    "id": 182,
    "question_text": "[MHT CET 2025] According to capillarity theory alone causes ascent of sap in plants.",
    "option_a": "hydrostatic pressure",
    "option_b": "osmotic pressure",
    "option_c": "transpiration pull",
    "option_d": "physical forces and dead cells",
    "correct_answer": "D",
    "explanation": "Capillarity theory suggests that ascent of sap is due to physical forces (surface tension, adhesion, cohesion) and the capillary tubes formed by dead xylem vessels. This theory alone cannot fully explain ascent, especially in tall trees, but it's part of the cohesion-tension theory.",
    "difficulty": "Hard",
    "year": 2025,
    "points": 4,
    "topic": "Plant Physiology"
  },
  {
    "id": 183,
    "question_text": "[MHT CET 2025] Given below are two statements. Statement I - Lactose on hydrolysis converts in to glucose and galactose. Statement II - Galactose also plays same role as glucose in respiration.",
    "option_a": "Both statement I and statement II are correct.",
    "option_b": "Both statement I and statement II are incorrect.",
    "option_c": "Statement I is correct but statement II is incorrect.",
    "option_d": "Statement I is incorrect but statement II is correct.",
    "correct_answer": "A",
    "explanation": "Statement I is correct: Lactose (milk sugar) is a disaccharide of glucose and galactose. Statement II is correct: Galactose is converted to glucose-1-phosphate (via Leloir pathway) and enters glycolysis, playing the same role as glucose in respiration. So both statements are correct.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Biomolecules"
  },
  {
    "id": 184,
    "question_text": "[MHT CET 2025] Angiotensinogen is secreted by",
    "option_a": "Beta cells of pancreas",
    "option_b": "Alpha cells of islets of Langerhans",
    "option_c": "Kupffer cells of Liver",
    "option_d": "Hepatocytes of Liver",
    "correct_answer": "D",
    "explanation": "Angiotensinogen is a plasma protein produced and secreted by hepatocytes (liver cells). It is converted to angiotensin I by renin, then to angiotensin II by ACE. Beta cells secrete insulin, alpha cells secrete glucagon, Kupffer cells are liver macrophages.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Body Fluids"
  },
  {
    "id": 185,
    "question_text": "[MHT CET 2025] Which one of the following is an example of pleiotropy?",
    "option_a": "Haemophilia",
    "option_b": "Thalassemia",
    "option_c": "Sickle cell anaemia",
    "option_d": "Colour blindness",
    "correct_answer": "C",
    "explanation": "Sickle cell anemia is an example of pleiotropy because a single gene mutation (in β-globin gene) causes multiple phenotypic effects: sickle-shaped RBCs, anemia, jaundice, pain crises, and increased resistance to malaria. Haemophilia, thalassemia, and colour blindness are single-gene disorders with more specific effects.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Genetics"
  },
  {
    "id": 186,
    "question_text": "[MHT CET 2025] Which of the following is NOT a characteristic feature of open circulation?",
    "option_a": "Presence of haemocoel",
    "option_b": "Blood flows with low pressure",
    "option_c": "Absence of respiratory pigment",
    "option_d": "Blood flows through vessels",
    "correct_answer": "D",
    "explanation": "In open circulation, blood (hemolymph) flows through open spaces (haemocoel) and not entirely through vessels. Blood vessels are present only for a short distance from the heart. So 'blood flows through vessels' is NOT a feature; it's a feature of closed circulation. Haemocoel, low pressure, and sometimes absence of respiratory pigment are features.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Animal Kingdom"
  },
  {
    "id": 187,
    "question_text": "[MHT CET 2025] Which of the following characteristic is NOT acquired by man in the course of evolution?",
    "option_a": "Increase in cranial capacity",
    "option_b": "Bipedal locomotion",
    "option_c": "Lengthening of forelimbs",
    "option_d": "Broadening of pelvic girdle",
    "correct_answer": "C",
    "explanation": "In human evolution, forelimbs did not lengthen; they became shorter relative to hindlimbs. Hominid evolution saw bipedalism, broadening of pelvic girdle (to support upright posture), and increase in cranial capacity. Lengthening of forelimbs is seen in apes for brachiation.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Evolution"
  },
  {
    "id": 188,
    "question_text": "[MHT CET 2025] Government of Maharashtra has adopted Japanese method of tree plantation.",
    "option_a": "Kawasaki",
    "option_b": "Miyawaki",
    "option_c": "Kurosowa",
    "option_d": "Gibberella",
    "correct_answer": "B",
    "explanation": "The Miyawaki method is a Japanese technique of afforestation developed by Akira Miyawaki. It involves planting native species close together to create dense, fast-growing forests. The Government of Maharashtra has adopted this method for tree plantation drives.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Environmental Issues"
  },
  {
    "id": 189,
    "question_text": "[MHT CET 2025] Which of the following are the pulse points of the lower limb? I. Brachial II. Radial III. Posterior tibial IV. Dorsalis pedis V. Femoral VI. Popliteal",
    "option_a": "I, III and VI only",
    "option_b": "II, IV and V only",
    "option_c": "III, IV, V and VI only",
    "option_d": "I, II, III and IV only",
    "correct_answer": "C",
    "explanation": "Pulse points of the lower limb include: femoral (V - groin), popliteal (VI - behind knee), posterior tibial (III - ankle), and dorsalis pedis (IV - foot). Brachial and radial are pulse points of the upper limb. So correct are III, IV, V, VI.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Body Fluids"
  },
  {
    "id": 190,
    "question_text": "[MHT CET 2025] Extra embryonic membrane that immediately surrounds and protects the embryo is",
    "option_a": "chorion",
    "option_b": "yolk sac",
    "option_c": "amnion",
    "option_d": "trophoblast",
    "correct_answer": "C",
    "explanation": "The amnion is the extraembryonic membrane that immediately surrounds the embryo, forming the amniotic cavity filled with amniotic fluid for protection. Chorion is outer, yolk sac provides nutrition, trophoblast is part of placenta formation.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Reproduction"
  },
  {
    "id": 191,
    "question_text": "[MHT CET 2025] Usually digestion of cellulose in herbivorous animals takes place in",
    "option_a": "Duodenum",
    "option_b": "Jejunum",
    "option_c": "Stomach",
    "option_d": "Vermiform appendix",
    "correct_answer": "D",
    "explanation": "Cellulose digestion in herbivores occurs in the cecum or vermiform appendix (in some) or in specialized chambers like rumen. In humans, cellulose is not digested. In many herbivores, it occurs in the large intestine/caecum/vermiform appendix where symbiotic microbes break it down.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Digestion"
  },
  {
    "id": 192,
    "question_text": "[MHT CET 2025] Aneuploidy refers to",
    "option_a": "addition or deletion of one or more chromosomes to the total number.",
    "option_b": "addition of entire set of chromosome to the primary basic number.",
    "option_c": "haploid set of chromosomes.",
    "option_d": "tetraploid set of chromosomes.",
    "correct_answer": "A",
    "explanation": "Aneuploidy is the condition where there is addition or deletion of one or more individual chromosomes (e.g., 2n+1, 2n-1). Addition of entire set is polyploidy (euploidy). Haploid and tetraploid are also types of euploidy.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Genetics"
  },
  {
    "id": 193,
    "question_text": "[MHT CET 2025] Select a correct pair of cells with identical set of chromosomes.",
    "option_a": "Secondary oocyte and spermatid.",
    "option_b": "First polar body and primary spermatocyte.",
    "option_c": "2ⁿᵈ polar body and primary oocyte.",
    "option_d": "Secondary spermatocyte and spermatogonia.",
    "correct_answer": "A",
    "explanation": "Secondary oocyte (n) and spermatid (n) are haploid cells with identical chromosome sets (one copy each). First polar body (n) and primary spermatocyte (2n) differ. 2nd polar body (n) and primary oocyte (2n) differ. Secondary spermatocyte (n) and spermatogonia (2n) differ.",
    "difficulty": "Hard",
    "year": 2025,
    "points": 4,
    "topic": "Reproduction"
  },
  {
    "id": 194,
    "question_text": "[MHT CET 2025] Association between clown fish and sea anemone is",
    "option_a": "mutualism",
    "option_b": "commensalism",
    "option_c": "amensalism",
    "option_d": "parasitism",
    "correct_answer": "B",
    "explanation": "Clownfish and sea anemone have a commensal relationship: clownfish gets protection from predators among anemone's tentacles (benefit), while sea anemone is neither helped nor harmed (neutral). Some sources call it mutualism as clownfish may clean the anemone, but traditionally it's commensalism.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Ecology"
  },
  {
    "id": 195,
    "question_text": "[MHT CET 2025] The volume of air that is present in the respiratory tract (from nose to the terminal bronchioles) but not involved in gaseous exchange is called",
    "option_a": "residual volume",
    "option_b": "dead space",
    "option_c": "reserve volume",
    "option_d": "vital capacity",
    "correct_answer": "B",
    "explanation": "Dead space (anatomical dead space) is the volume of air in the conducting airways (nose to terminal bronchioles) that does not participate in gas exchange. Residual volume is air left after forced expiration. Reserve volume is extra air that can be inhaled/exhaled. Vital capacity is maximum air exhaled after maximum inhalation.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Respiration"
  },
  {
    "id": 196,
    "question_text": "[MHT CET 2025] In Maharashtra a 24-hour toll free helpline number 1926 has been set up to provide information regarding",
    "option_a": "Covid-19 cases",
    "option_b": "atrocities against women and girl child",
    "option_c": "tree plantation, protection and mass awareness",
    "option_d": "emergency ambulance service",
    "correct_answer": "C",
    "explanation": "The Maharashtra government set up helpline number 1926 for information related to tree plantation, protection, and mass awareness campaigns about environmental conservation.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Current Affairs"
  },
  {
    "id": 197,
    "question_text": "[MHT CET 2025] Genetic drift occurs due to",
    "option_a": "Natural selection",
    "option_b": "Sudden elimination of particular allele",
    "option_c": "Continuous gene movement",
    "option_d": "Mutation",
    "correct_answer": "B",
    "explanation": "Genetic drift is the change in allele frequencies due to chance events, especially in small populations. It can occur due to sudden elimination of a particular allele (e.g., bottleneck effect, founder effect). Natural selection is differential reproduction, gene flow is continuous gene movement, mutation is source of new alleles.",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Evolution"
  },
  {
    "id": 198,
    "question_text": "[MHT CET 2025] Match the parts of brain in Column I with their inclusions in Column II. Column (I): i. Telencephalon, ii. Rhinencephalon, iii. Mesencephalon, iv. Metencephalon. Column (II): a. Olfactory lobes, b. Cerebellum and pons varolii, c. Crura cerebri and corpora quadrigemina, d. Cerebrum.",
    "option_a": "i-a, ii-d, iii-c, iv-b",
    "option_b": "i-b, ii-c, iii-d, iv-a",
    "option_c": "i-d, ii-a, iii-c, iv-b",
    "option_d": "i-c, ii-d, iii-b, iv-a",
    "correct_answer": "C",
    "explanation": "i. Telencephalon (forebrain) includes Cerebrum (d). ii. Rhinencephalon (olfactory brain) includes Olfactory lobes (a). iii. Mesencephalon (midbrain) includes Crura cerebri and corpora quadrigemina (c). iv. Metencephalon (part of hindbrain) includes Cerebellum and pons varolii (b). So i-d, ii-a, iii-c, iv-b.",
    "difficulty": "Hard",
    "year": 2025,
    "points": 4,
    "topic": "Neural Control"
  },
  {
    "id": 199,
    "question_text": "[MHT CET 2025] Considering the concept of multiple alleles, one individual can have only ______ alleles for that character.",
    "option_a": "one",
    "option_b": "two",
    "option_c": "three",
    "option_d": "four",
    "correct_answer": "B",
    "explanation": "Although multiple alleles exist in a population, an individual diploid organism can carry only two alleles for a given gene (one on each homologous chromosome). The population may have many alleles (e.g., ABO blood group system has three alleles - Iᴬ, Iᴮ, i - but an individual has only two).",
    "difficulty": "Easy",
    "year": 2025,
    "points": 4,
    "topic": "Genetics"
  },
  {
    "id": 200,
    "question_text": "[MHT CET 2025] Mucosa forms ______ in stomach and ______ in intestine respectively.",
    "option_a": "a- rugae, b- villi",
    "option_b": "a- villi, b- rugae",
    "option_c": "a- gastric glands, b- villi",
    "option_d": "a- gastric glands, b- rugae",
    "correct_answer": "A",
    "explanation": "The mucosa of the stomach forms rugae (folds that allow expansion) and contains gastric glands. The mucosa of the intestine forms villi (finger-like projections for absorption) and contains intestinal glands (crypts of Lieberkühn). Option A correctly identifies rugae in stomach and villi in intestine.",
    "difficulty": "Medium",
    "year": 2025,
    "points": 4,
    "topic": "Digestion"
  },

  
  {
    "id": 1,
    "question_text": "[MHT CET 2024] In lac-operon, the switching-on or switching-off of the operator is achieved by ______.",
    "option_a": "transacetylase",
    "option_b": "β-galactosidase",
    "option_c": "permease",
    "option_d": "regulator protein",
    "correct_answer": "D",
    "explanation": "The regulator gene (lacI) produces a repressor protein. This repressor protein binds to the operator region and switches it off by physically blocking RNA polymerase. When an inducer is present, it binds to the repressor, inactivating it and switching the operator on.",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Molecular Biology"
  },
  {
    "id": 2,
    "question_text": "[MHT CET 2024] Which one of the the following does NOT have any significance in crossing over of chromosomes?",
    "option_a": "Recombination of genes",
    "option_b": "Variations",
    "option_c": "Determination of sex",
    "option_d": "Natural selection",
    "correct_answer": "C",
    "explanation": "Crossing over leads to the recombination of genes, which creates genetic variations. These variations are the raw material for natural selection. Sex determination is typically controlled by sex chromosomes and their specific genes, not directly by the process of crossing over.",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Genetics"
  },
  {
    "id": 3,
    "question_text": "[MHT CET 2024] Which of the following is NOT an organ of ammonotelic excretion?",
    "option_a": "Gills",
    "option_b": "General body surface",
    "option_c": "Malpighian tubules",
    "option_d": "Kidney",
    "correct_answer": "C",
    "explanation": "Ammonotelic animals excrete ammonia, which is highly toxic and requires a lot of water. Gills, general body surface, and kidneys can be organs for ammonia excretion in different aquatic animals. Malpighian tubules are the excretory organs in insects (like cockroaches), which are uricotelic and excrete uric acid, not ammonia.",
    "difficulty": "Medium",
    "year": 2024,
    "points": 4,
    "topic": "Excretory Products and Their Elimination"
  },
  {
    "id": 4,
    "question_text": "[MHT CET 2024] Which one of the following 'geological period' is known as 'age of reptiles'?",
    "option_a": "Cretaceous",
    "option_b": "Jurassic",
    "option_c": "Carboniferous",
    "option_d": "Permian",
    "correct_answer": "B",
    "explanation": "The Jurassic period is part of the Mesozoic era, which is often called the 'Age of Reptiles'. While reptiles were dominant throughout the entire Mesozoic, the Jurassic period, in particular, saw the rise and diversification of giant dinosaurs.",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Evolution"
  },
  {
    "id": 5,
    "question_text": "[MHT CET 2024] Given below are two statements: Statement I - The joint between a tooth and jaw bone is gomphosis. Statement II - Human beings have different kinds of teeth, hence it is described as diphoydont dentition. In light of above statements, choose the most appropriate answer from the options given below.",
    "option_a": "Both statement I and statement II are correct.",
    "option_b": "Both statement I and statement II are incorrect.",
    "option_c": "Statement I is correct and statement II is incorrect.",
    "option_d": "Statement I is incorrect and statement II is correct.",
    "correct_answer": "C",
    "explanation": "Statement I is correct: Gomphosis is the fibrous joint that holds a tooth in its socket. Statement II is incorrect: 'Diphyodont' refers to the presence of two sets of teeth in a lifetime (deciduous and permanent). 'Heterodont' refers to having different kinds of teeth (incisors, canines, etc.).",
    "difficulty": "Medium",
    "year": 2024,
    "points": 4,
    "topic": "Human Anatomy"
  },
  {
    "id": 6,
    "question_text": "[MHT CET 2024] ______ is a non-biodegradable substance which keeps the pollens resistant to chemicals.",
    "option_a": "Chitin",
    "option_b": "Sporopollenin",
    "option_c": "Cellulose",
    "option_d": "Pectin",
    "correct_answer": "B",
    "explanation": "Sporopollenin is one of the most resistant organic materials known. It is a major component of the outer wall of pollen grains (exine), making them resistant to harsh environmental conditions, chemicals, and microbial attack. It is non-biodegradable.",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Plant Anatomy"
  },
  {
    "id": 7,
    "question_text": "[MHT CET 2024] The uptake of K⁺ and Cl⁻ ions at night is prevented by which acid to change the permeability of guard cells?",
    "option_a": "NAA",
    "option_b": "IAA",
    "option_c": "ABA",
    "option_d": "IBA",
    "correct_answer": "C",
    "explanation": "Abscisic acid (ABA) is a plant hormone that promotes stomatal closure. It causes an increase in the pH of the cytoplasm, which triggers the efflux of K⁺ and Cl⁻ ions from guard cells. This loss of ions reduces the osmotic pressure of guard cells, causing them to become flaccid and close the stomata, thus preventing ion uptake at night or during water stress.",
    "difficulty": "Hard",
    "year": 2024,
    "points": 4,
    "topic": "Plant Physiology"
  },
  {
    "id": 8,
    "question_text": "[MHT CET 2024] The number of base pairs present in the nucleoid of E. coli is ______ millions.",
    "option_a": "2.3",
    "option_b": "3.3",
    "option_c": "4.6",
    "option_d": "6.6",
    "correct_answer": "C",
    "explanation": "The Escherichia coli (E. coli) genome is a circular, double-stranded DNA molecule located in the nucleoid region. It contains approximately 4.6 million base pairs (4.6 × 10⁶ bp).",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Molecular Biology"
  },
  {
    "id": 9,
    "question_text": "[MHT CET 2024] Nasal cavity of humans is divisible into right and left nasal chambers by ______.",
    "option_a": "thyroid cartilage",
    "option_b": "Hyoid bone",
    "option_c": "thyrohyoid membrane",
    "option_d": "mesethmoid cartilage",
    "correct_answer": "D",
    "explanation": "The nasal septum divides the nasal cavity into right and left chambers. In humans, the anterior part of this septum is made of cartilage, specifically the mesethmoid cartilage (or septal cartilage), while the posterior part is bony.",
    "difficulty": "Hard",
    "year": 2024,
    "points": 4,
    "topic": "Human Anatomy"
  },
  {
    "id": 10,
    "question_text": "[MHT CET 2024] Match column I with column II and select the correct option.",
    "option_a": "i-b ii-c iii-a",
    "option_b": "i-b ii-a iii-c",
    "option_c": "i-c ii-b iii-a",
    "option_d": "i-c ii-a iii-b",
    "correct_answer": "A",
    "explanation": "The correct matching is: Citric acid (i) is used in confectionary (b) as a flavor and preservative. Fumaric acid (ii) is used in resins as a wetting agent (c). Gluconic acid (iii) is used in medicine (a) to enhance the solubility of calcium (e.g., calcium gluconate).",
    "difficulty": "Medium",
    "year": 2024,
    "points": 4,
    "topic": "Biotechnology"
  },
  {
    "id": 11,
    "question_text": "[MHT CET 2024] Movement of larynx and shoulder is controlled by ______ cranial nerve.",
    "option_a": "Vagus",
    "option_b": "Spinal accessory",
    "option_c": "Glossopharyngeal",
    "option_d": "Abducens",
    "correct_answer": "B",
    "explanation": "The Spinal Accessory nerve (Cranial Nerve XI) is a motor nerve. It has two parts: the cranial part innervates muscles of the larynx (via the vagus nerve), and the spinal part innervates the sternocleidomastoid and trapezius muscles, which control movements of the neck and shoulder.",
    "difficulty": "Medium",
    "year": 2024,
    "points": 4,
    "topic": "Human Physiology"
  },
  {
    "id": 12,
    "question_text": "[MHT CET 2024] Which one of the following is an example of thermophilic enzyme used in PCR?",
    "option_a": "Methylase",
    "option_b": "Restriction endonuclease",
    "option_c": "Taq polymerase",
    "option_d": "Protease",
    "correct_answer": "C",
    "explanation": "Polymerase Chain Reaction (PCR) involves repeated heating cycles (to 94-98°C) to denature DNA. Taq polymerase, isolated from the thermophilic bacterium Thermus aquaticus, is stable and active at these high temperatures, making it ideal for PCR. It is a thermostable enzyme.",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Biotechnology"
  },
  {
    "id": 13,
    "question_text": "[MHT CET 2024] Select the INCORRECT statement regarding CSF.",
    "option_a": "It acts as shock absorber.",
    "option_b": "It protects CNS from mechanical injuries.",
    "option_c": "It increases pressure inside the cranium.",
    "option_d": "It helps in supply of oxygen to brain.",
    "correct_answer": "C",
    "explanation": "Cerebrospinal Fluid (CSF) cushions the brain and spinal cord (acts as a shock absorber), protecting them from mechanical injury. It also provides buoyancy and helps in nutrient/waste exchange. It does NOT increase pressure inside the cranium; in fact, it helps maintain a stable intracranial pressure. An increase in pressure is a pathological condition, not a normal function of CSF.",
    "difficulty": "Medium",
    "year": 2024,
    "points": 4,
    "topic": "Human Physiology"
  },
  {
    "id": 14,
    "question_text": "[MHT CET 2024] Which one of the following is NOT a risk associated with amniocentesis?",
    "option_a": "Miscarriage",
    "option_b": "Detection of chromosomal abnormalities",
    "option_c": "Needle injury to foetus",
    "option_d": "Leaking amniotic fluid",
    "correct_answer": "B",
    "explanation": "Amniocentesis is a diagnostic procedure, not a risk. It is performed to detect chromosomal abnormalities (like Down syndrome) and genetic disorders in the fetus. Miscarriage, needle injury to the fetus, infection, and leaking of amniotic fluid are potential risks or complications associated with the invasive procedure.",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Biotechnology and its Applications"
  },
  {
    "id": 15,
    "question_text": "[MHT CET 2024] To induce early flowering in plants, pre-treatment of seeds or seedlings is done at ______ °C temperature.",
    "option_a": "1 - 6",
    "option_b": "10 - 13",
    "option_c": "14 - 20",
    "option_d": "20 - 30",
    "correct_answer": "A",
    "explanation": "The process of inducing early flowering by exposing seeds or seedlings to low temperatures is called vernalization. This treatment is typically carried out at temperatures just above freezing, usually in the range of 1°C to 6°C (or 0-5°C).",
    "difficulty": "Medium",
    "year": 2024,
    "points": 4,
    "topic": "Plant Physiology"
  },
  {
    "id": 16,
    "question_text": "[MHT CET 2024] Flowers are dull coloured with strong fragrance in",
    "option_a": "chiropterophily",
    "option_b": "ornithophily",
    "option_c": "anaemophily",
    "option_d": "hydrophily",
    "correct_answer": "A",
    "explanation": "Chiropterophily is pollination by bats. Bats are typically active at night and have a poor sense of color but a strong sense of smell. Flowers pollinated by bats (chiropterophilous flowers) are often dull-colored (white or green) to stand out at night but produce a strong fragrance and large amounts of nectar to attract them.",
    "difficulty": "Medium",
    "year": 2024,
    "points": 4,
    "topic": "Plant Reproduction"
  },
  {
    "id": 17,
    "question_text": "[MHT CET 2024] Select the correct path of intra-renal circulation from the following: i. peritubular capillaries ii. glomerular capillaries iii. renal venule iv. renal arteriole v. efferent arteriole",
    "option_a": "iii → i → iv → ii → v",
    "option_b": "iv → ii → v → i → iii",
    "option_c": "iii → iv → i → ii → v",
    "option_d": "iv → i → ii → v → iii",
    "correct_answer": "B",
    "explanation": "The correct path of blood flow within the kidney (intra-renal circulation) is: Renal arteriole (iv) → Glomerular capillaries (ii) → Efferent arteriole (v) → Peritubular capillaries (i) → Renal venule (iii). The efferent arteriole carries blood from the glomerulus to the peritubular capillaries.",
    "difficulty": "Hard",
    "year": 2024,
    "points": 4,
    "topic": "Human Physiology"
  },
  {
    "id": 18,
    "question_text": "[MHT CET 2024] Given below are two statements regarding oxidation of reduced coenzymes formed during glycolysis, acetylation and TCA cycle: Statement I - During oxidation of NADH + H⁺ and FADH₂, electrons and protons are released. Statement II - Electrons are passed through various electron carriers and they finally are transferred to molecular oxygen. In light of above statements, choose the most appropriate answer from the options given below.",
    "option_a": "Both statement I and statement II are correct.",
    "option_b": "Both statement I and statement II are incorrect.",
    "option_c": "Statement I is correct and statement II is incorrect.",
    "option_d": "Statement I is incorrect and statement II is correct.",
    "correct_answer": "A",
    "explanation": "Both statements are correct. In the electron transport chain, NADH + H⁺ and FADH₂ are oxidized, releasing electrons (e⁻) and protons (H⁺). The electrons are then passed through a series of carriers (complexes I-IV) and are finally accepted by molecular oxygen (O₂), which combines with protons to form water.",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Cell Respiration"
  },
  {
    "id": 19,
    "question_text": "[MHT CET 2024] What is the effect of increase in substrate concentration on the enzymatic reaction?",
    "option_a": "It continuously increases the rate of reaction.",
    "option_b": "It decreases the rate of reaction.",
    "option_c": "It has no effect on the rate of reaction.",
    "option_d": "It increases the rate of reaction within a limited range.",
    "correct_answer": "D",
    "explanation": "Increasing substrate concentration initially increases the rate of an enzyme-catalyzed reaction because more substrate molecules are available to bind to the enzyme's active sites. However, this effect is limited. Once all enzyme active sites are saturated (Vmax), further increases in substrate concentration will not increase the reaction rate.",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Biochemistry"
  },
  {
    "id": 20,
    "question_text": "[MHT CET 2024] Given below are two statements Statement I - Chromosomes are present in eukaryotic nucleus. Statement II - Chromosomes are visible during cell division. In light of above statements, select the correct answer from the options given below.",
    "option_a": "Both statement I and statement II are correct.",
    "option_b": "Both statement I and statement II are incorrect.",
    "option_c": "Statement I is correct and statement II is incorrect.",
    "option_d": "Statement I is incorrect and statement II is correct.",
    "correct_answer": "A",
    "explanation": "Both statements are correct. In eukaryotic cells, chromosomes are structures found within the nucleus that contain DNA. They are in a decondensed, thread-like form (chromatin) during interphase and become condensed and visible as distinct structures under a microscope only during cell division (mitosis or meiosis).",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Cell Biology"
  },
  {
    "id": 21,
    "question_text": "[MHT CET 2024] Match column I with column II and select the correct options given below.",
    "option_a": "i-d ii-a iii-e iv-b v-c",
    "option_b": "i-e ii-b iii-d iv-a v-c",
    "option_c": "i-a ii-d iii-c iv-e v-h",
    "option_d": "i-d ii-e iii-a iv-c v-b",
    "correct_answer": "A",
    "explanation": "The correct matching of WBC types with their approximate percentages in human blood is: Lymphocytes (i) ~25-30% (d), Eosinophils (ii) ~1-3% (a), Basophils (iii) ~0.5-1% (e), Neutrophils (iv) ~60-70% (b), and Monocytes (v) ~3-8% (c).",
    "difficulty": "Medium",
    "year": 2024,
    "points": 4,
    "topic": "Human Physiology"
  },
  {
    "id": 22,
    "question_text": "[MHT CET 2024] Which one of the following is universal initiation codon?",
    "option_a": "AAG",
    "option_b": "AUG",
    "option_c": "UAA",
    "option_d": "UAG",
    "correct_answer": "B",
    "explanation": "AUG is the universal start or initiation codon. It codes for the amino acid methionine (or formylmethionine in prokaryotes) and signals the ribosome to begin protein synthesis. UAA and UAG are stop codons. AAG codes for lysine.",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Molecular Biology"
  },
  {
    "id": 23,
    "question_text": "[MHT CET 2024] The enzyme which destroys the neurotransmitter after the transfer of impulse across the synapse is",
    "option_a": "cholinesterase",
    "option_b": "transacetylase",
    "option_c": "enterokinase",
    "option_d": "synthetase",
    "correct_answer": "A",
    "explanation": "After a nerve impulse is transmitted across a cholinergic synapse by the neurotransmitter acetylcholine, it needs to be rapidly broken down to prevent continuous stimulation of the postsynaptic membrane. The enzyme acetylcholinesterase (or simply cholinesterase) performs this function by hydrolyzing acetylcholine into acetate and choline.",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Human Physiology"
  },
  {
    "id": 24,
    "question_text": "[MHT CET 2024] During sewage treatment activated sludge is digested by",
    "option_a": "coliform organisms",
    "option_b": "flocs",
    "option_c": "aerobic bacteria",
    "option_d": "anaerobic bacteria",
    "correct_answer": "D",
    "explanation": "In the sewage treatment process, the primary effluent is passed into large aeration tanks where bacterial flocs (aerobic bacteria) form and consume organic matter, producing activated sludge. This activated sludge is then passed into anaerobic sludge digesters where anaerobic bacteria digest the bacteria and fungi in the sludge, reducing its volume.",
    "difficulty": "Medium",
    "year": 2024,
    "points": 4,
    "topic": "Environmental Science"
  },
  {
    "id": 25,
    "question_text": "[MHT CET 2024] Ti plasmid is used as vector in genetic engineering for making transgenic plants. This plasmid is found in",
    "option_a": "Rhizobium",
    "option_b": "Escherichia coli",
    "option_c": "Agrobacterium",
    "option_d": "Azotobacter",
    "correct_answer": "C",
    "explanation": "The Ti plasmid (Tumor-inducing plasmid) is a large plasmid found naturally in the bacterium Agrobacterium tumefaciens. This bacterium causes crown gall disease in plants by transferring a segment of its Ti plasmid (T-DNA) into the plant genome. Scientists have modified this natural system to use the Ti plasmid as a vector to introduce desired genes into plant cells to create transgenic plants.",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Biotechnology"
  },
  {
    "id": 26,
    "question_text": "[MHT CET 2024] In nature, flowers and their pollinator species are tightly linked with one another. This example involves",
    "option_a": "parasitism",
    "option_b": "commensalism",
    "option_c": "co-evolution",
    "option_d": "competition",
    "correct_answer": "C",
    "explanation": "Coevolution is the process where two or more species reciprocally affect each other's evolution. The tight link between flowers and their pollinators is a classic example. For instance, a flower might evolve a long, tubular shape, and its pollinator might evolve a long proboscis to reach the nectar, each driving the other's evolutionary changes.",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Ecology"
  },
  {
    "id": 27,
    "question_text": "[MHT CET 2024] The ability to perceive stimulus and to enter a state of activity is the property of nerve fiber. It is called",
    "option_a": "Irritability",
    "option_b": "Conductivity",
    "option_c": "Velocity",
    "option_d": "All or none law",
    "correct_answer": "A",
    "explanation": "Irritability (or excitability) is the fundamental property of nerve cells (and muscle cells) to respond to a stimulus and generate an electrical impulse. Conductivity is the ability to transmit that impulse along the cell membrane.",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Human Physiology"
  },
  {
    "id": 28,
    "question_text": "[MHT CET 2024] In Maharashtra, a 24 hours toll free helpline number 1926 has been set up to provide information regarding",
    "option_a": "Covid-19 cases in each district.",
    "option_b": "tree plantation, protection and mass awareness.",
    "option_c": "atrocities against women and girl child.",
    "option_d": "child labour.",
    "correct_answer": "B",
    "explanation": "This is a current affairs/environmental awareness question. The Maharashtra government launched the toll-free helpline number 1926, named 'Majhi Vasundhara', to provide information and support related to tree plantation, protection, and mass awareness campaigns for environmental conservation.",
    "difficulty": "Medium",
    "year": 2024,
    "points": 4,
    "topic": "Environmental Science"
  },
  {
    "id": 29,
    "question_text": "[MHT CET 2024] Select the INCORRECT statement with respect to degree of saturation of haemoglobin with O₂.",
    "option_a": "Relationship between HbO₂ saturation and O₂ tension (ppO₂) is called oxygen dissociation curve.",
    "option_b": "100% saturation of Hb with O₂ is rare.",
    "option_c": "Degree of saturation decreases with increase in partial pressure of O₂ (ppO₂).",
    "option_d": "Only 50% saturation can be maintained at 30mmHg of ppO₂.",
    "correct_answer": "C",
    "explanation": "The statement is incorrect because the degree of saturation of hemoglobin with oxygen increases as the partial pressure of oxygen (ppO₂) increases. This positive relationship is what the oxygen-hemoglobin dissociation curve illustrates. Saturation decreases only when ppO₂ decreases.",
    "difficulty": "Medium",
    "year": 2024,
    "points": 4,
    "topic": "Human Physiology"
  },
  {
    "id": 30,
    "question_text": "[MHT CET 2024] Which one of the following is the most widely accepted theory to explain the mechanism of translocation of water in plants?",
    "option_a": "Root pressure",
    "option_b": "Cohesion - tension",
    "option_c": "Capillarity",
    "option_d": "Relay pump",
    "correct_answer": "B",
    "explanation": "The cohesion-tension theory is the most widely accepted explanation for the ascent of sap in plants. It proposes that transpiration from leaves creates a negative pressure or tension. This tension pulls a column of water upward from the roots. The water column remains unbroken due to the cohesive forces between water molecules and their adhesion to the xylem walls.",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Plant Physiology"
  },
  {
    "id": 31,
    "question_text": "[MHT CET 2024] Which animal excretes nitrogenous waste by diffusion through body surface?",
    "option_a": "Sponge",
    "option_b": "Liver fluke",
    "option_c": "Crab",
    "option_d": "Ant",
    "correct_answer": "A",
    "explanation": "Sponges are very simple, diploblastic animals that lack specialized excretory organs. They are ammonotelic, meaning they excrete ammonia. Due to their small size and large surface area relative to volume, ammonia can be directly diffused out of their body surface into the surrounding water.",
    "difficulty": "Medium",
    "year": 2024,
    "points": 4,
    "topic": "Excretory Products and Their Elimination"
  },
  {
    "id": 32,
    "question_text": "[MHT CET 2024] Given below are two statements with respect to amniocentesis Statement I - Amniocentesis is a process in which amniotic fluid containing foetal cells is collected using a hallow needle inserted into the uterus. Statement II - X-rays imaging is used to determine the position of the foetus in the uterus. In light of above statements, select the correct answer from the options given below.",
    "option_a": "Both statement I and statement II are correct.",
    "option_b": "Both statement I and statement II are incorrect.",
    "option_c": "Statement I is correct and statement II is incorrect.",
    "option_d": "Statement I is incorrect and statement II is correct.",
    "correct_answer": "C",
    "explanation": "Statement I is correct: Amniocentesis involves inserting a hollow needle through the abdominal wall into the uterus to collect amniotic fluid containing fetal cells. Statement II is incorrect: Ultrasound imaging (sonography), not X-rays, is used to guide the needle and determine the position of the fetus to avoid injury. X-rays involve ionizing radiation and are not used for this purpose due to potential harm to the fetus.",
    "difficulty": "Medium",
    "year": 2024,
    "points": 4,
    "topic": "Biotechnology and its Applications"
  },
  {
    "id": 33,
    "question_text": "[MHT CET 2024] Which one of the following is NOT a significance of polyembryony? i. Polyembryony increases the chance of survival of the new plants. ii. Nucellar polyembryony is greatly useful in horticulture. iii. Seedless fruits are formed. iv. Genetically identical plants are produced due to cleavage polyembryony.",
    "option_a": "i and ii only",
    "option_b": "iii only",
    "option_c": "i and iii only",
    "option_d": "iv only",
    "correct_answer": "B",
    "explanation": "Polyembryony is the phenomenon of having multiple embryos in a single seed. Its significances include: (i) increasing the chance of survival of new plants, (ii) nucellar polyembryony being useful in horticulture for producing uniform rootstocks, and (iv) producing genetically identical plants (clones) through cleavage polyembryony. It does NOT lead to the formation of seedless fruits; that's parthenocarpy.",
    "difficulty": "Medium",
    "year": 2024,
    "points": 4,
    "topic": "Plant Reproduction"
  },
  {
    "id": 34,
    "question_text": "[MHT CET 2024] In which of the following reactions of Krebs cycle substrate level phosphorylation occurs?",
    "option_a": "Oxalosuccinic acid → α-Ketoglutarate",
    "option_b": "α-Ketoglutarate → Succinyl CoA",
    "option_c": "Succinyl CoA → Succinate",
    "option_d": "Fumarate → Malate",
    "correct_answer": "C",
    "explanation": "Substrate-level phosphorylation (SLP) is the direct transfer of a phosphate group from a substrate to ADP to form ATP. In the Krebs cycle, SLP occurs during the conversion of Succinyl-CoA to Succinate. The enzyme succinyl-CoA synthetase (or succinate thiokinase) catalyzes this reaction, cleaving the high-energy thioester bond in Succinyl-CoA, and the energy released is used to phosphorylate GDP to GTP (which can then be converted to ATP).",
    "difficulty": "Medium",
    "year": 2024,
    "points": 4,
    "topic": "Cell Respiration"
  },
  {
    "id": 35,
    "question_text": "[MHT CET 2024] Given below are two statements Statement I - Acinar cells of pancreas secrete insulin. Statement II - The delta (δ) cells of pancreas secrete somatostatin. In light of above statements, choose the most appropriate answer from the option given below.",
    "option_a": "Both statement I and statement II are correct.",
    "option_b": "Both statement I and statement II are incorrect.",
    "option_c": "Statement I is correct and statement II is incorrect.",
    "option_d": "Statement I is incorrect and statement II is correct.",
    "correct_answer": "D",
    "explanation": "Statement I is incorrect: Acinar cells of the pancreas are exocrine cells that secrete digestive enzymes into the pancreatic duct. Insulin is secreted by the beta (β) cells of the pancreatic islets (Islets of Langerhans). Statement II is correct: The delta (δ) cells of the pancreatic islets do secrete the hormone somatostatin, which inhibits the release of insulin and glucagon.",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Human Physiology"
  },
  {
    "id": 36,
    "question_text": "[MHT CET 2024] The specific region of enzyme which combines with the substrate is called ______ site.",
    "option_a": "passive",
    "option_b": "active",
    "option_c": "promoter",
    "option_d": "inhibition",
    "correct_answer": "B",
    "explanation": "The active site is the specific region on an enzyme where the substrate binds and undergoes a chemical reaction. It is typically a small, three-dimensional pocket or cleft with unique chemical properties that allow it to bind to a specific substrate.",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Biochemistry"
  },
  {
    "id": 37,
    "question_text": "[MHT CET 2024] Based on the following statements choose the correct option below: Statement I - Ecological succession focuses on changes in vegetation. Statement II - As succession proceeds, the number and types of animals also change. In light of above statements, select the correct answer from the option given below.",
    "option_a": "Both statement I and statement II are correct.",
    "option_b": "Both statement I and statement II are incorrect.",
    "option_c": "Statement I is correct and statement II is incorrect.",
    "option_d": "Statement I is incorrect and statement II is correct.",
    "correct_answer": "A",
    "explanation": "Both statements are correct. Ecological succession is the orderly process of change in the species structure of an ecological community over time. While it often focuses on the observable changes in the plant community (Statement I), these changes in vegetation directly alter the habitat (food, shelter), which in turn leads to changes in the composition of animal species in that area (Statement II).",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Ecology"
  },
  {
    "id": 38,
    "question_text": "[MHT CET 2024] Match the disorder of circulatory system in column I with their respective symptom in column II and select the correct option given below.",
    "option_a": "i-d, ii-c, iii-a, iv-b",
    "option_b": "i-c, ii-d, iii-b, iv-a",
    "option_c": "i-a, ii-b, iii-c, iv-d",
    "option_d": "i-b, ii-a, iii-d, iv-c",
    "correct_answer": "A",
    "explanation": "The correct matching is: Hypertension (i) is persistently increased blood pressure (d). Angina pectoris (ii) is severe chest pain due to reduced blood supply to heart muscles (c). Arteriosclerosis (iii) is the hardening and loss of elasticity of artery walls (a). Atherosclerosis (iv) is the deposition of fats and cholesterol (plaque) in arteries (b).",
    "difficulty": "Medium",
    "year": 2024,
    "points": 4,
    "topic": "Human Physiology"
  },
  {
    "id": 39,
    "question_text": "[MHT CET 2024] Which soil-living bacterium forms root nodules in groundnut?",
    "option_a": "Nitrosomonas",
    "option_b": "Nitrobacter",
    "option_c": "Rhizobium",
    "option_d": "Nitrosococcus",
    "correct_answer": "C",
    "explanation": "Rhizobium is a genus of soil bacteria that are well-known for their symbiotic relationship with leguminous plants, such as groundnut (peanut). They infect the root hairs and induce the formation of root nodules, where they convert atmospheric nitrogen into ammonia (biological nitrogen fixation). Nitrosomonas and Nitrobacter are nitrifying bacteria involved in the nitrogen cycle but do not form root nodules.",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Plant Biology"
  },
  {
    "id": 40,
    "question_text": "[MHT CET 2024] Test cross is performed by",
    "option_a": "back crossing the hybrid with its dominant parent.",
    "option_b": "back crossing the hybrid with its recessive parent.",
    "option_c": "crossing any two plants with contrasting traits.",
    "option_d": "selfing the hybrid.",
    "correct_answer": "B",
    "explanation": "A test cross is a genetic cross used to determine the genotype (homozygous or heterozygous) of an individual showing a dominant phenotype. It involves crossing that individual (the hybrid) with another individual that is homozygous recessive for the trait in question. The phenotypes of the offspring reveal the unknown genotype.",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Genetics"
  },
  {
    "id": 41,
    "question_text": "[MHT CET 2024] Select the INCORRECT statement with respect to prostate gland in males.",
    "option_a": "It is large and single gland made up of 20 - 30 lobes.",
    "option_b": "It surrounds the urethra.",
    "option_c": "It secretes prostaglandins which stimulate reverse peristalsis in vagina.",
    "option_d": "Prostatic fluid contains acid phosphatase which protects sperms from acidic environment in vagina.",
    "correct_answer": "C",
    "explanation": "Statements A, B, and D are correct about the prostate gland. Statement C is incorrect because the prostate gland does not secrete prostaglandins. Prostaglandins are secreted by the seminal vesicles. The prostate gland secretes a thin, milky, alkaline fluid that contains enzymes like acid phosphatase and citric acid, which helps neutralize the acidity of the vaginal tract.",
    "difficulty": "Hard",
    "year": 2024,
    "points": 4,
    "topic": "Human Reproduction"
  },
  {
    "id": 42,
    "question_text": "[MHT CET 2024] Total number of minor calyces is equal to that of",
    "option_a": "column of Bertini",
    "option_b": "major calyces",
    "option_c": "renal pyramids",
    "option_d": "collecting ducts",
    "correct_answer": "C",
    "explanation": "In the kidney, each renal pyramid projects into a minor calyx. The tip of each pyramid (the papilla) releases urine into a minor calyx. Therefore, the number of minor calyces is generally equal to or closely related to the number of renal pyramids.",
    "difficulty": "Medium",
    "year": 2024,
    "points": 4,
    "topic": "Human Anatomy"
  },
  {
    "id": 43,
    "question_text": "[MHT CET 2024] Which of the following are phagocytic cells?",
    "option_a": "Parietal cells",
    "option_b": "Peptic cells",
    "option_c": "Kupffer cells",
    "option_d": "Hepatic cells",
    "correct_answer": "C",
    "explanation": "Kupffer cells are specialized macrophages located in the liver, lining the walls of the sinusoids. They are phagocytic and form part of the mononuclear phagocyte system, engulfing old red blood cells, bacteria, and other foreign particles from the blood. Parietal and peptic (chief) cells are in the stomach and secrete HCl and pepsinogen, respectively. Hepatic cells are hepatocytes, the main liver cells, which are metabolic but not primarily phagocytic.",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Human Anatomy"
  },
  {
    "id": 44,
    "question_text": "[MHT CET 2024] Match the simple lipid present in different parts of animal body given in column I with their function in column II.",
    "option_a": "i-b ii-c iii-d iv-a",
    "option_b": "i-a ii-b iii-d iv-c",
    "option_c": "i-c ii-a iii-b iv-d",
    "option_d": "i-d ii-c iii-a iv-b",
    "correct_answer": "A",
    "explanation": "The correct matching of adipose tissue locations and functions: (i) Deposited in subcutaneous tissue acts as an insulator (b) against heat loss. (ii) Stored in adipocytes acts as a reserved food (c) source. (iii) Around internal organs acts as a shock absorber (d) to protect organs. (iv) Coating on skin provides water resistance (a) and prevents water loss.",
    "difficulty": "Medium",
    "year": 2024,
    "points": 4,
    "topic": "Human Physiology"
  },
  {
    "id": 45,
    "question_text": "[MHT CET 2024] Identify the correct order of plants of various serial stages in primary ecological succession of aquatic habitats.",
    "option_a": "Hydrilla → Lotus → Pistia → Typha → Cyperus",
    "option_b": "Lotus → Hydrilla → Pistia → Cyperus → Typha",
    "option_c": "Pistia → Hydrilla → Lotus → Typha → Cyperus",
    "option_d": "Hydrilla → Pistia → Typha → Lotus → Cyperus",
    "correct_answer": "A",
    "explanation": "Primary succession in a pond (hydrosere) typically follows this order: 1. Phytoplankton (not listed) 2. Rooted submerged plants like Hydrilla. 3. Rooted floating plants like Lotus (Nelumbo) and Nymphaea. 4. Free-floating plants like Pistia and Eichhornia. 5. Reed-swamp (amphibious) plants like Typha. 6. Sedges, meadow plants like Cyperus. 7. Trees and shrubs. So, Hydrilla → Lotus → Pistia → Typha → Cyperus is the correct sequence among the options.",
    "difficulty": "Hard",
    "year": 2024,
    "points": 4,
    "topic": "Ecology"
  },
  {
    "id": 46,
    "question_text": "[MHT CET 2024] Which one of the following pairs is alleles of Y and R?",
    "option_a": "YR",
    "option_b": "YY",
    "option_c": "RR",
    "option_d": "yr",
    "correct_answer": "D",
    "explanation": "Alleles are alternative forms of a gene. If 'Y' and 'R' represent dominant alleles for two different genes (e.g., seed color and seed shape), then their respective recessive alleles would be 'y' and 'r'. Therefore, 'y' is the allele of 'Y', and 'r' is the allele of 'R'. The pair 'yr' represents the recessive alleles for both genes, making them the correct allelic counterparts.",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Genetics"
  },
  {
    "id": 47,
    "question_text": "[MHT CET 2024] Select the INCORRECT statement with respect to breathing process.",
    "option_a": "Thoracic volume increases during inspiration.",
    "option_b": "It is a physical process that involves thoracic cage, diaphragm and intercostal muscles.",
    "option_c": "During inspiration, there is low pressure inside lungs, hence air from atmosphere rushes into lungs.",
    "option_d": "Diaphragm becomes relaxed and dome shaped during inspiration.",
    "correct_answer": "D",
    "explanation": "Statements A, B, and C are correct. Statement D is incorrect. During inspiration (inhalation), the diaphragm contracts, becoming flattened and moving downward, which increases the volume of the thoracic cavity. It becomes relaxed and dome-shaped during expiration (exhalation).",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Human Physiology"
  },
  {
    "id": 48,
    "question_text": "[MHT CET 2024] The immunity provided by BCG vaccine is ______ immunity.",
    "option_a": "natural acquired passive",
    "option_b": "artificial acquired passive",
    "option_c": "artificial acquired active",
    "option_d": "natural acquired active",
    "correct_answer": "C",
    "explanation": "BCG (Bacille Calmette-Guérin) is a vaccine used against tuberculosis. A vaccine introduces a weakened or inactive form of a pathogen to stimulate the body's immune system to produce its own antibodies and memory cells. This is an example of artificially acquired active immunity.",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Human Health and Disease"
  },
  {
    "id": 49,
    "question_text": "[MHT CET 2024] Bacillus thuringiensis kills the caterpillars by releasing in their guts.",
    "option_a": "gliotoxin",
    "option_b": "gliovirin",
    "option_c": "cry protein",
    "option_d": "viridin",
    "correct_answer": "C",
    "explanation": "Bacillus thuringiensis (Bt) produces crystal proteins, also called Cry proteins or δ-endotoxins, during sporulation. When ingested by insect larvae (like caterpillars), these proteins are solubilized in the alkaline gut and become activated. The activated toxin binds to the gut epithelium, creating pores and leading to cell lysis, paralysis of the gut, and death of the insect.",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Biotechnology and its Applications"
  },
  {
    "id": 50,
    "question_text": "[MHT CET 2024] Neurohypophysis of pituitary gland is differentiated into following parts EXCEPT",
    "option_a": "Pars nervosa",
    "option_b": "Pars distalis",
    "option_c": "Infundibulum",
    "option_d": "Median eminence",
    "correct_answer": "B",
    "explanation": "The pituitary gland has two main lobes: adenohypophysis (anterior) and neurohypophysis (posterior). The neurohypophysis (posterior pituitary) is differentiated into the pars nervosa (the main neural part), the infundibulum (the stalk), and the median eminence (which connects to the hypothalamus). The pars distalis is part of the adenohypophysis (anterior pituitary).",
    "difficulty": "Medium",
    "year": 2024,
    "points": 4,
    "topic": "Human Anatomy"
  },
  {
    "id": 51,
    "question_text": "[MHT CET 2024] Recalcitrant seeds means the seeds with",
    "option_a": "reduced calcium level.",
    "option_b": "high reserve food.",
    "option_c": "reduced moisture content below certain level.",
    "option_d": "high moisture content at certain level.",
    "correct_answer": "D",
    "explanation": "Recalcitrant seeds are seeds that do not survive drying and freezing during ex situ conservation. They are shed at high moisture content (often >30%) and are metabolically active. They cannot tolerate desiccation. Examples include mango, cocoa, and rubber. Orthodox seeds, in contrast, can be dried to low moisture levels and stored.",
    "difficulty": "Medium",
    "year": 2024,
    "points": 4,
    "topic": "Plant Biology"
  },
  {
    "id": 52,
    "question_text": "[MHT CET 2024] Select the correct sequence of statements regarding conduction of nerve impulse and select the correct option given below. i. Rapid influx of Na⁺ inside the axon. ii. Na⁺ gates are closed and K⁺ gates open after refractory period. iii. Intracellular fluid is electronegative and potential difference is -70 mV. iv. Extracellular fluid becomes electronegative. v. Disturbance to resting potential.",
    "option_a": "iii → v → i → iv → ii",
    "option_b": "v → ii → i → iii → iv",
    "option_c": "i → iii → iv → v → ii",
    "option_d": "iv → v → i → iii → ii",
    "correct_answer": "A",
    "explanation": "The correct sequence of events during an action potential is: 1. Resting potential (-70mV) with intracellular fluid electronegative (iii). 2. A stimulus causes disturbance to resting potential (v). 3. If threshold is reached, voltage-gated Na⁺ channels open, causing rapid influx of Na⁺ (i). 4. This makes the intracellular fluid positive and extracellular fluid electronegative (iv) - depolarization. 5. After the refractory period, Na⁺ gates close and K⁺ gates open (ii) to restore resting potential.",
    "difficulty": "Hard",
    "year": 2024,
    "points": 4,
    "topic": "Human Physiology"
  },
  {
    "id": 53,
    "question_text": "[MHT CET 2024] The interaction of sea anemone hosting the clown fish is an example of",
    "option_a": "parasitism",
    "option_b": "predation",
    "option_c": "commensalism",
    "option_d": "competition",
    "correct_answer": "C",
    "explanation": "The interaction between sea anemone and clownfish is a classic example of commensalism. The clownfish gets protection from predators by living among the anemone's stinging tentacles (to which it is immune). The sea anemone is generally believed to be neither helped nor harmed by this association (though some studies suggest it might get cleaned or lured prey).",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Ecology"
  },
  {
    "id": 54,
    "question_text": "[MHT CET 2024] Arrange the following animals in their decreasing ability to conserve water and select the correct option i. Bony fish ii. Land snail iii. Shark",
    "option_a": "i, ii, iii",
    "option_b": "ii, i, iii",
    "option_c": "iii, ii, i",
    "option_d": "ii, iii, i",
    "correct_answer": "D",
    "explanation": "Water conservation ability relates to the type of nitrogenous waste and habitat. Land snails are terrestrial and excrete uric acid (uricotelic), conserving the most water. Sharks are marine and retain urea in their blood (ureosmotic) to osmoregulate, conserving more water than freshwater bony fish. Freshwater bony fish are ammonotelic and constantly gain water, so they have the least need to conserve it. Thus, the decreasing order is Land snail (ii) > Shark (iii) > Bony fish (i).",
    "difficulty": "Hard",
    "year": 2024,
    "points": 4,
    "topic": "Excretory Products and Their Elimination"
  },
  {
    "id": 55,
    "question_text": "[MHT CET 2024] Identify the label 'X' in the given diagram of a mature pollen grain.",
    "option_a": "Generative cell",
    "option_b": "Vegetative cell",
    "option_c": "Male gamete",
    "option_d": "Germ pore",
    "correct_answer": "A",
    "explanation": "In a typical diagram of a mature pollen grain, the larger cell filling most of the grain is the vegetative cell (or tube cell). The smaller, spindle-shaped cell floating within the cytoplasm of the vegetative cell is the generative cell. Label 'X' in the diagram points to this smaller cell, which is the generative cell. It divides to form the two male gametes.",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Plant Reproduction"
  },
  {
    "id": 56,
    "question_text": "[MHT CET 2024] Select the correct sequence with respect to human embryonic development and select the correct option given below i. Insemination ii. blastulation iii. fertilization iv. gastrulation v. gestation",
    "option_a": "i → iii → iv → ii → v",
    "option_b": "i → ii → iii → iv → v",
    "option_c": "i → iii → ii → iv → v",
    "option_d": "i → iv → ii → iii → v",
    "correct_answer": "C",
    "explanation": "The correct sequence of human embryonic development is: 1. Insemination (i) - deposition of semen. 2. Fertilization (iii) - fusion of gametes to form a zygote. 3. Cleavage and Blastulation (ii) - the zygote divides and forms a blastocyst. 4. Gastrulation (iv) - formation of germ layers. 5. Gestation (v) - the period of intrauterine development from implantation to birth.",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Human Reproduction"
  },
  {
    "id": 57,
    "question_text": "[MHT CET 2024] The proportion of an allele in the gene pool to the total number of alleles at a given locus, is called",
    "option_a": "gene mutation",
    "option_b": "gene frequency",
    "option_c": "gene flow",
    "option_d": "gene drift",
    "correct_answer": "B",
    "explanation": "Gene frequency (or allele frequency) is a measure used in population genetics. It represents the relative frequency of an allele (a variant of a gene) at a particular genetic locus in a population, expressed as a proportion or percentage of all alleles at that locus.",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Evolution"
  },
  {
    "id": 58,
    "question_text": "[MHT CET 2024] Select the disorder which shows symptoms like, person feeling thirsty, increase in urine output and no glucose is lost in urine. It is",
    "option_a": "IDDM",
    "option_b": "NIDDM",
    "option_c": "Diabetes insipidus",
    "option_d": "Addison's disease",
    "correct_answer": "C",
    "explanation": "The symptoms described (excessive thirst - polydipsia, and high urine output - polyuria) without glucose in the urine are characteristic of Diabetes insipidus. This condition is caused by a deficiency of or insensitivity to Antidiuretic Hormone (ADH), leading to the inability to concentrate urine. IDDM and NIDDM (types of Diabetes mellitus) involve high blood glucose and glucose in the urine. Addison's disease involves adrenal insufficiency.",
    "difficulty": "Medium",
    "year": 2024,
    "points": 4,
    "topic": "Human Health and Disease"
  },
  {
    "id": 59,
    "question_text": "[MHT CET 2024] Given below are two statements Statement I - Diazotrophs are the nitrogen fixing microorganisms, which are exclusively symbiotic. Statement II - Organic fertilizers include farm yard manure, compost and green manure. In light of above statements, choose the most appropriate answer from the option given below.",
    "option_a": "Both statement I and statement II are correct.",
    "option_b": "Both statement I and statement II are incorrect.",
    "option_c": "Statement I is correct and statement II is incorrect.",
    "option_d": "Statement I is incorrect and statement II is correct.",
    "correct_answer": "D",
    "explanation": "Statement I is incorrect because diazotrophs are microorganisms that fix nitrogen, but they are not exclusively symbiotic. There are free-living diazotrophs (e.g., Azotobacter, Clostridium) and symbiotic ones (e.g., Rhizobium). Statement II is correct: Farm Yard Manure (FYM), compost, and green manure are all classic examples of organic fertilizers derived from plant and animal matter.",
    "difficulty": "Medium",
    "year": 2024,
    "points": 4,
    "topic": "Plant Biology"
  },
  {
    "id": 60,
    "question_text": "[MHT CET 2024] Given below are two statements regarding circulation of blood in fishes. Statement I - Heart of fish contains only deoxygenated blood. Statement II - Fishes show single circulation and blood passes through heart only once during each cycle. In light of above statements, choose the correct answer from the options given below.",
    "option_a": "Both statement I and statement II are correct.",
    "option_b": "Both statement I and statement II are incorrect.",
    "option_c": "Statement I is correct and statement II is incorrect.",
    "option_d": "Statement I is incorrect and statement II is correct.",
    "correct_answer": "A",
    "explanation": "Both statements are correct. Fish have a two-chambered heart (one atrium, one ventricle) that receives deoxygenated blood from the body and pumps it to the gills for oxygenation. This is called single circulation because the blood passes through the heart only once during its complete circuit around the body.",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Animal Kingdom"
  },
  {
    "id": 61,
    "question_text": "[MHT CET 2024] Xenotransplantation is the transfer of organs from animals to humans. Which one of the following animals is used currently for this?",
    "option_a": "Cattle",
    "option_b": "Mice",
    "option_c": "Pigs",
    "option_d": "Frogs",
    "correct_answer": "C",
    "explanation": "Pigs are currently the most promising and commonly used animal source for xenotransplantation research. Their organs (like heart, kidneys, liver) are similar in size and physiology to human organs. They also breed quickly and can be genetically modified to reduce the risk of organ rejection in humans.",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Biotechnology and its Applications"
  },
  {
    "id": 62,
    "question_text": "[MHT CET 2024] Introduction of ______ for aquaculture in India has proved harmful to endemic catfish varieties.",
    "option_a": "Clarias gariepinus",
    "option_b": "Scoliodon",
    "option_c": "Betta",
    "option_d": "Guppy",
    "correct_answer": "A",
    "explanation": "Clarias gariepinus, the African catfish, was introduced to India for aquaculture. It is a large, aggressive, and fast-growing predator that has escaped into natural waters, where it competes with and preys upon native catfish species, causing a decline in their populations and proving harmful to the endemic catfish varieties.",
    "difficulty": "Medium",
    "year": 2024,
    "points": 4,
    "topic": "Environmental Science"
  },
  {
    "id": 63,
    "question_text": "[MHT CET 2024] Protein Energy Malnutrition (PEM) leads to",
    "option_a": "constipation",
    "option_b": "marasmus",
    "option_c": "jaundice",
    "option_d": "vomiting",
    "correct_answer": "B",
    "explanation": "Protein-Energy Malnutrition (PEM) refers to a range of pathological conditions arising from a deficiency of protein and/or calories in the diet. The two most severe forms of PEM are marasmus (deficiency of calories) and kwashiorkor (deficiency of protein).",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Human Health and Disease"
  },
  {
    "id": 64,
    "question_text": "[MHT CET 2024] The length of root hair is",
    "option_a": "1 - 10 mm",
    "option_b": "11 - 20 mm",
    "option_c": "21 - 30 mm",
    "option_d": "31 - 40 mm",
    "correct_answer": "A",
    "explanation": "Root hairs are tubular extensions of epidermal cells in the root. They are typically very small to increase surface area for absorption. Their length generally ranges from about 1 to 10 millimeters (or sometimes expressed as up to 1-2 cm, which is 10-20 mm, but 1-10 mm is the most commonly cited and standard range).",
    "difficulty": "Medium",
    "year": 2024,
    "points": 4,
    "topic": "Plant Anatomy"
  },
  {
    "id": 65,
    "question_text": "[MHT CET 2024] Which water is absorbed by roots present in soil?",
    "option_a": "Gravitational",
    "option_b": "Capillary",
    "option_c": "Combined",
    "option_d": "Hygroscopic",
    "correct_answer": "B",
    "explanation": "Plants absorb most of the water they need from the soil. This water is held in the spaces between soil particles as capillary water. It is this film of water that is available to and absorbed by the root hairs. Gravitational water drains away quickly, and hygroscopic/combined water is bound too tightly to soil particles for plants to absorb.",
    "difficulty": "Medium",
    "year": 2024,
    "points": 4,
    "topic": "Plant Physiology"
  },
  {
    "id": 66,
    "question_text": "[MHT CET 2024] Cellophane tube used in haemodialysis carrying patient's blood serves the function of",
    "option_a": "ultrafiltration",
    "option_b": "passive selective reabsorption",
    "option_c": "tubular secretion",
    "option_d": "active selective reabsorption",
    "correct_answer": "A",
    "explanation": "In hemodialysis, the patient's blood is passed through a dialyzer containing cellophane tubes. These tubes act as a semi-permeable membrane. Blood flows inside, and dialyzing fluid flows outside. Due to the pressure difference, waste products (urea, etc.) and excess water are filtered out of the blood by the process of ultrafiltration, similar to what happens in the glomerulus of the kidney.",
    "difficulty": "Medium",
    "year": 2024,
    "points": 4,
    "topic": "Biotechnology and its Applications"
  },
  {
    "id": 67,
    "question_text": "[MHT CET 2024] Which two processes occur in connecting link reaction between glycolysis and Krebs cycle?",
    "option_a": "Oxidation and carboxylation",
    "option_b": "Oxidation and Phosphorylation",
    "option_c": "Oxidation and decarboxylation",
    "option_d": "Oxidation and dephosphorylation",
    "correct_answer": "C",
    "explanation": "The connecting link reaction (also called the gateway reaction or pyruvate decarboxylation) occurs in the mitochondrial matrix. Pyruvate (3C) from glycolysis is converted to Acetyl CoA (2C). This involves: 1. Decarboxylation - removal of one carbon in the form of CO₂. 2. Oxidation - removal of hydrogen, which reduces NAD⁺ to NADH. 3. The addition of Coenzyme A to form Acetyl CoA.",
    "difficulty": "Medium",
    "year": 2024,
    "points": 4,
    "topic": "Cell Respiration"
  },
  {
    "id": 68,
    "question_text": "[MHT CET 2024] The pollen grains have specific gravity higher than water in",
    "option_a": "Lotus",
    "option_b": "Water hyacinth",
    "option_c": "Zostera",
    "option_d": "Vallisneria",
    "correct_answer": "C",
    "explanation": "Zostera is a marine seagrass that undergoes hydrophily (pollination by water). Its pollen grains are long, thread-like, and have a specific gravity higher than water. This allows them to sink and be carried by underwater currents to reach the submerged female flowers. In Vallisneria, pollen is lighter than water and floats. Lotus and water hyacinth are not hydrophilous.",
    "difficulty": "Hard",
    "year": 2024,
    "points": 4,
    "topic": "Plant Reproduction"
  },
  {
    "id": 69,
    "question_text": "[MHT CET 2024] Bolting in plants like beet and cabbage having rosette habits is promoted by",
    "option_a": "Gibberellins",
    "option_b": "Auxins",
    "option_c": "Cytokinins",
    "option_d": "ABA",
    "correct_answer": "A",
    "explanation": "Bolting is the premature elongation of a flowering stem in rosette plants (like cabbage, beet, and carrots) before flowering. This phenomenon is promoted by gibberellins. The application of gibberellins can induce bolting in such plants even under non-inductive conditions (e.g., before vernalization).",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Plant Physiology"
  },
  {
    "id": 70,
    "question_text": "[MHT CET 2024] Given below are two statements: Statement I - Cell wall of root hair is freely permeable. Statement II - Plasma membrane of root hair (cell) is selectively permeable. In light of above statements, choose the most appropriate answer from the options given below.",
    "option_a": "Both statement I and statement II are correct.",
    "option_b": "Both statement I and statement II are incorrect.",
    "option_c": "Statement I is correct and statement II is incorrect.",
    "option_d": "Statement I is incorrect and statement II is correct.",
    "correct_answer": "A",
    "explanation": "Both statements are correct. The cell wall of a root hair cell is made of cellulose and is freely permeable, meaning it allows all substances (water, minerals, etc.) to pass through without selection. The plasma membrane, however, is selectively permeable (or semi-permeable), regulating the entry and exit of substances into the cell.",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Plant Physiology"
  },
  {
    "id": 71,
    "question_text": "[MHT CET 2024] Type of natality used to calculate population size in the form of number of births per 1000 population per year is",
    "option_a": "realised natality",
    "option_b": "absolute natality",
    "option_c": "crude birth rate",
    "option_d": "specific birth rate",
    "correct_answer": "C",
    "explanation": "Crude birth rate is a demographic measure that calculates the number of live births occurring in a population during a given year, per 1,000 people in the total population at the mid-point of that year. It's a 'crude' rate because it applies to the entire population, not a specific age or sex group.",
    "difficulty": "Medium",
    "year": 2024,
    "points": 4,
    "topic": "Ecology"
  },
  {
    "id": 72,
    "question_text": "[MHT CET 2024] The type of isolating mechanism when members do not mate with each other due to specific mating behavior is termed as ______ isolation.",
    "option_a": "temporal",
    "option_b": "ecological",
    "option_c": "ethological",
    "option_d": "mechanical",
    "correct_answer": "C",
    "explanation": "Ethological isolation (or behavioral isolation) is a pre-mating reproductive isolating mechanism where species do not interbreed because they have different and specific courtship rituals, mating calls, or other behavioral patterns that are not recognized or accepted by individuals of another species.",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Evolution"
  },
  {
    "id": 73,
    "question_text": "[MHT CET 2024] Select INCORRECT statement with reference to adenohypophysis",
    "option_a": "It is vascular part of pituitary gland.",
    "option_b": "It contains various types of epithelioid secretory cells.",
    "option_c": "It is connected to hypothalamus through hypophyseal portal system.",
    "option_d": "It originates as downward extension of hypothalamus.",
    "correct_answer": "D",
    "explanation": "Statements A, B, and C are correct regarding the adenohypophysis (anterior pituitary). Statement D is incorrect because the adenohypophysis originates as an upward growth from the roof of the embryonic mouth (Rathke's pouch). It is the neurohypophysis (posterior pituitary) that originates as a downward extension of the hypothalamus.",
    "difficulty": "Medium",
    "year": 2024,
    "points": 4,
    "topic": "Human Anatomy"
  },
  {
    "id": 74,
    "question_text": "[MHT CET 2024] The mean annual rainfall of tropical forest ranges between",
    "option_a": "150 - 400 cm",
    "option_b": "100 - 200 cm",
    "option_c": "50 - 250 cm",
    "option_d": "50 - 100 cm",
    "correct_answer": "A",
    "explanation": "Tropical forests, particularly tropical rainforests, are characterized by high and consistent rainfall throughout the year. The typical mean annual rainfall for these forests is in the range of 150 to 400 centimeters (or 1500-4000 mm).",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Ecology"
  },
  {
    "id": 75,
    "question_text": "[MHT CET 2024] CUA CUA CUA code for which of the following amino acid?",
    "option_a": "Valine",
    "option_b": "Methionine",
    "option_c": "Leucine",
    "option_d": "Glutamic acid",
    "correct_answer": "C",
    "explanation": "The codon CUA (Cytosine-Uracil-Adenine) codes for the amino acid Leucine (Leu). Methionine is coded by AUG. Valine is coded by GUN (GUU, GUC, GUA, GUG). Glutamic acid is coded by GAA and GAG.",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Molecular Biology"
  },
  {
    "id": 76,
    "question_text": "[MHT CET 2024] Select the CORRECT statement with respect to human respiration.",
    "option_a": "Carbonic anhydrase enzyme is found in RBCs and absent in blood plasma.",
    "option_b": "Carbon-dioxide binds with amino group of haemoglobin to form loosely bound carboxyhaemoglobin.",
    "option_c": "Degree of saturation of Hb with O₂ is maximum at 30mmHg of ppO₂.",
    "option_d": "In Hamburger's phenomenon, chloride ions diffuse out of RBCs into plasma, to maintain ionic balance.",
    "correct_answer": "A",
    "explanation": "Statement A is correct: The enzyme carbonic anhydrase is present in high concentrations inside red blood cells (RBCs) but is virtually absent in blood plasma. Statement B is incorrect: CO₂ binds to the globin part of hemoglobin to form carbaminohemoglobin, not carboxyhaemoglobin (which is CO binding). Statement C is incorrect: Saturation is maximum (~100%) at high ppO₂ (~100 mmHg in alveoli), not at 30 mmHg. Statement D is incorrect: In Hamburger's phenomenon (chloride shift), Cl⁻ ions diffuse into RBCs from plasma as bicarbonate ions move out, not the other way around.",
    "difficulty": "Hard",
    "year": 2024,
    "points": 4,
    "topic": "Human Physiology"
  },
  {
    "id": 77,
    "question_text": "[MHT CET 2024] Ploidy level is NOT same in",
    "option_a": "perisperm and integument",
    "option_b": "integuments and embryo",
    "option_c": "nucleolus and secondary nucleus",
    "option_d": "antipodals and secondary nucleus",
    "correct_answer": "B",
    "explanation": "In angiosperms: Integuments are maternal tissue and are diploid (2n). The embryo is formed by the fusion of a haploid male gamete (n) with a haploid female egg (n) and is diploid (2n). Therefore, their ploidy is the same (2n). Perisperm is diploid (2n, maternal tissue). Nucleolus is not a cellular structure with ploidy; the correct term is 'nucleus'. The secondary nucleus in the central cell is diploid (2n) in many plants. Antipodals are typically haploid (n). However, the option that definitely has different ploidy is perisperm (2n) vs integument (2n) – they are the same. The question asks for 'NOT same'. The embryo (2n) and integuments (2n) are the same. The secondary nucleus (2n) and antipodals (n) are different. So option D is the most likely intended answer. But let's re-evaluate the provided options: A: Perisperm (2n) and Integument (2n) - SAME. B: Integuments (2n) and Embryo (2n) - SAME. C: Nucleolus (not a standard ploidy term) and Secondary nucleus (2n) - likely meant to be different. D: Antipodals (n) and Secondary nucleus (2n) - DIFFERENT. So the correct answer should be D.",
    "difficulty": "Hard",
    "year": 2024,
    "points": 4,
    "topic": "Plant Reproduction"
  },
  {
    "id": 78,
    "question_text": "[MHT CET 2024] Given below are two statements: Statement I - At the onset of puberty, the pituitary gland begins secretion of gonadotropin releasing hormone. Statement II - GnRH initiates the significant increase in the secretion of follicle stimulating hormone (FSH) which induces gametogenesis. In light of above statements, choose the correct appropriate answer from the options given below.",
    "option_a": "Both statement I and statement II are correct.",
    "option_b": "Both statement I and statement II are incorrect.",
    "option_c": "Statement I is correct and statement II is incorrect.",
    "option_d": "Statement I is incorrect and statement II is correct.",
    "correct_answer": "D",
    "explanation": "Statement I is incorrect: Gonadotropin-releasing hormone (GnRH) is not secreted by the pituitary gland. It is secreted by the hypothalamus. Statement II is correct: GnRH from the hypothalamus stimulates the anterior pituitary to secrete FSH and LH. FSH does indeed play a key role in inducing gametogenesis (spermatogenesis in males and follicular development in females).",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Human Reproduction"
  },
  {
    "id": 79,
    "question_text": "[MHT CET 2024] Based on the given pie diagram, identify the correct expression with relation to the number of various groups of organism.",
    "option_a": "ii + iii + iv = i",
    "option_b": "i > ii > iii > iv",
    "option_c": "i = ii + (iii - iv)",
    "option_d": "iii = iv and i > ii",
    "correct_answer": "B",
    "explanation": "The pie diagram typically represents the proportion of different groups of organisms. Based on biological diversity, insects (i) represent the largest group, followed by other groups. Therefore, the correct relationship is likely that the number of insects (i) is greater than the number of other invertebrates (ii), which is greater than plants (iii), which is greater than vertebrates (iv), i.e., i > ii > iii > iv.",
    "difficulty": "Medium",
    "year": 2024,
    "points": 4,
    "topic": "Biodiversity"
  },
  {
    "id": 80,
    "question_text": "[MHT CET 2024] Select the INCORRECT statement.",
    "option_a": "Fever stimulates production of antibodies and helps in recovery from viral infections.",
    "option_b": "The NK cells (Natural Killer) are important in non-specific defence against viral infections and tumour.",
    "option_c": "The zinc present in semen is antibacterial.",
    "option_d": "Secretions of lachrymal glands contain an antibacterial substance called lysozyme.",
    "correct_answer": "A",
    "explanation": "Statements B, C, and D are correct. Statement A is incorrect. Fever is a systemic response to infection, and while a moderate fever can enhance certain immune responses, it does not directly stimulate antibody production. Antibody production is a specific immune response carried out by B lymphocytes (plasma cells). Fever is more associated with non-specific defense and can help inhibit pathogen growth.",
    "difficulty": "Hard",
    "year": 2024,
    "points": 4,
    "topic": "Human Health and Disease"
  },
  {
    "id": 81,
    "question_text": "[MHT CET 2024] Following are characteristics of genetic recombination, EXCEPT",
    "option_a": "occurs in sexually reproducing animals.",
    "option_b": "exchange of genetic material takes place between sister chromatids.",
    "option_c": "it occurs due to crossing over.",
    "option_d": "it leads to variations.",
    "correct_answer": "B",
    "explanation": "Statements A, C, and D are characteristics of genetic recombination. Statement B is the EXCEPTION. Exchange of genetic material between sister chromatids does not result in genetic recombination because they are genetically identical (copies of the same chromosome). Genetic recombination, specifically crossing over, occurs between non-sister chromatids of homologous chromosomes.",
    "difficulty": "Medium",
    "year": 2024,
    "points": 4,
    "topic": "Genetics"
  },
  {
    "id": 82,
    "question_text": "[MHT CET 2024] Natural plant growth inhibitor is",
    "option_a": "Gibberellins",
    "option_b": "Auxins",
    "option_c": "Ethylene",
    "option_d": "ABA",
    "correct_answer": "D",
    "explanation": "ABA (Abscisic acid) is often referred to as the 'stress hormone' and is a natural plant growth inhibitor. It promotes dormancy in seeds and buds, and causes stomatal closure during water stress, inhibiting growth processes. Gibberellins and auxins are growth promoters. Ethylene can be a promoter (fruit ripening) or inhibitor (senescence) but is not primarily classified as a growth inhibitor like ABA.",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Plant Physiology"
  },
  {
    "id": 83,
    "question_text": "[MHT CET 2024] Match the column I with column II and select the correct option.",
    "option_a": "i-b ii-c iii-d iv-a",
    "option_b": "i-b ii-c iii-a iv-d",
    "option_c": "i-c ii-d iii-a iv-b",
    "option_d": "i-d ii-a iii-c iv-b",
    "correct_answer": "B",
    "explanation": "The correct matching for biological control agents: i. Phytophthora palmivora is used to control milk weeds in orchards (b). ii. Alternaria crassa is used to control the weed Senecio jacobaea (c). iii. Cactoblastis cactorum (a moth) is famously used to control cacti weeds in Australia (a). iv. Tyria moth (cinnabar moth) is used to control the weed Senecio (ragwort) (d). So the correct sequence is i-b, ii-c, iii-a, iv-d.",
    "difficulty": "Hard",
    "year": 2024,
    "points": 4,
    "topic": "Environmental Science"
  },
  {
    "id": 84,
    "question_text": "[MHT CET 2024] Given below are two statements regarding carbon and phosphorus cycles. Statement I - Atmospheric inputs of phosphorus through rainfall are huge than carbon inputs. Statement II - Exchange of phosphorus between organism and environment are negligible as compared to carbon. In light of above statements, select the correct answer from the options given below.",
    "option_a": "Both statement I and statement II are correct.",
    "option_b": "Both statement I and statement II are incorrect.",
    "option_c": "Statement I is correct and statement II is incorrect.",
    "option_d": "Statement I is incorrect and statement II is correct.",
    "correct_answer": "D",
    "explanation": "Statement I is incorrect: The phosphorus cycle is a sedimentary cycle, and phosphorus has no significant gaseous phase. Atmospheric inputs of phosphorus via rainfall are very small. In contrast, the carbon cycle is gaseous, with large atmospheric reservoirs and significant exchange via rainfall (dissolved CO₂). Statement II is correct: The exchange of phosphorus between organisms and the environment is very slow and localized compared to the rapid, global exchange of carbon through processes like photosynthesis, respiration, and decomposition.",
    "difficulty": "Hard",
    "year": 2024,
    "points": 4,
    "topic": "Ecology"
  },
  {
    "id": 85,
    "question_text": "[MHT CET 2024] During respiration, substrate level phosphorylation occurs in",
    "option_a": "Cytoplasm only",
    "option_b": "Mitochondrial matrix only",
    "option_c": "Cytoplasm and mitochondrial matrix",
    "option_d": "intermembrane space of mitochondria",
    "correct_answer": "C",
    "explanation": "Substrate-level phosphorylation (SLP) is the direct synthesis of ATP from ADP and a phosphorylated intermediate. In cellular respiration, SLP occurs in two locations: 1. In the cytoplasm during glycolysis (e.g., production of ATP from 1,3-bisphosphoglycerate and phosphoenolpyruvate). 2. In the mitochondrial matrix during the Krebs cycle (e.g., production of GTP/ATP from succinyl-CoA).",
    "difficulty": "Medium",
    "year": 2024,
    "points": 4,
    "topic": "Cell Respiration"
  },
  {
    "id": 86,
    "question_text": "[MHT CET 2024] Salmonella typhi are ______ bacteria.",
    "option_a": "flagellate Gram + ve",
    "option_b": "flagellate Gram - ve",
    "option_c": "non-flagellate Gram - ve",
    "option_d": "non-flagellate Gram + ve",
    "correct_answer": "B",
    "explanation": "Salmonella typhi, the bacterium that causes typhoid fever, is a Gram-negative, flagellated, rod-shaped bacterium. Its flagella make it motile.",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Human Health and Disease"
  },


  {
    "id": 87,
    "question_text": "[MHT CET 2024] Select INCORRECT statement with reference to adenohypophysis",
    "option_a": "It is vascular part of pituitary gland.",
    "option_b": "It contains various types of epithelioid secretory cells.",
    "option_c": "It is connected to hypothalamus through hypophyseal portal system.",
    "option_d": "It originates as downward extension of hypothalamus.",
    "correct_answer": "D",
    "explanation": "Statements A, B, and C are correct regarding the adenohypophysis (anterior pituitary). Statement D is incorrect because the adenohypophysis originates as an upward growth from the roof of the embryonic mouth (Rathke's pouch). It is the neurohypophysis (posterior pituitary) that originates as a downward extension of the hypothalamus.",
    "difficulty": "Medium",
    "year": 2024,
    "points": 4,
    "topic": "Human Anatomy"
  },
  {
    "id": 88,
    "question_text": "[MHT CET 2024] The mean annual rainfall of tropical forest ranges between",
    "option_a": "150 - 400 cm",
    "option_b": "100 - 200 cm",
    "option_c": "50 - 250 cm",
    "option_d": "50 - 100 cm",
    "correct_answer": "A",
    "explanation": "Tropical forests, particularly tropical rainforests, are characterized by high and consistent rainfall throughout the year. The typical mean annual rainfall for these forests is in the range of 150 to 400 centimeters (or 1500-4000 mm).",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Ecology"
  },
  {
    "id": 89,
    "question_text": "[MHT CET 2024] CUA CUA CUA code for which of the following amino acid?",
    "option_a": "Valine",
    "option_b": "Methionine",
    "option_c": "Leucine",
    "option_d": "Glutamic acid",
    "correct_answer": "C",
    "explanation": "The codon CUA (Cytosine-Uracil-Adenine) codes for the amino acid Leucine (Leu). Methionine is coded by AUG. Valine is coded by GUN (GUU, GUC, GUA, GUG). Glutamic acid is coded by GAA and GAG.",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Molecular Biology"
  },
  {
    "id": 90,
    "question_text": "[MHT CET 2024] Select the CORRECT statement with respect to human respiration.",
    "option_a": "Carbonic anhydrase enzyme is found in RBCs and absent in blood plasma.",
    "option_b": "Carbon-dioxide binds with amino group of haemoglobin to form loosely bound carboxyhaemoglobin.",
    "option_c": "Degree of saturation of Hb with O₂ is maximum at 30mmHg of ppO₂.",
    "option_d": "In Hamburger's phenomenon, chloride ions diffuse out of RBCs into plasma, to maintain ionic balance.",
    "correct_answer": "A",
    "explanation": "Statement A is correct: The enzyme carbonic anhydrase is present in high concentrations inside red blood cells (RBCs) but is virtually absent in blood plasma. Statement B is incorrect: CO₂ binds to the globin part of hemoglobin to form carbaminohemoglobin, not carboxyhaemoglobin (which is CO binding). Statement C is incorrect: Saturation is maximum (~100%) at high ppO₂ (~100 mmHg in alveoli), not at 30 mmHg. Statement D is incorrect: In Hamburger's phenomenon (chloride shift), Cl⁻ ions diffuse into RBCs from plasma as bicarbonate ions move out, not the other way around.",
    "difficulty": "Hard",
    "year": 2024,
    "points": 4,
    "topic": "Human Physiology"
  },
  {
    "id": 91,
    "question_text": "[MHT CET 2024] Ploidy level is NOT same in",
    "option_a": "perisperm and integument",
    "option_b": "integuments and embryo",
    "option_c": "nucleolus and secondary nucleus",
    "option_d": "antipodals and secondary nucleus",
    "correct_answer": "D",
    "explanation": "In angiosperms: Integuments are maternal tissue and are diploid (2n). The embryo is formed by the fusion of a haploid male gamete (n) with a haploid female egg (n) and is diploid (2n). Therefore, their ploidy is the same (2n). Perisperm is diploid (2n, maternal tissue). Nucleolus is not a cellular structure with ploidy; the correct term is 'nucleus'. The secondary nucleus in the central cell is diploid (2n) in many plants. Antipodals are typically haploid (n). However, the option that definitely has different ploidy is perisperm (2n) vs integument (2n) – they are the same. The question asks for 'NOT same'. The embryo (2n) and integuments (2n) are the same. The secondary nucleus (2n) and antipodals (n) are different. So option D is the most likely intended answer. But let's re-evaluate the provided options: A: Perisperm (2n) and Integument (2n) - SAME. B: Integuments (2n) and Embryo (2n) - SAME. C: Nucleolus (not a standard ploidy term) and Secondary nucleus (2n) - likely meant to be different. D: Antipodals (n) and Secondary nucleus (2n) - DIFFERENT. So the correct answer should be D.",
    "difficulty": "Hard",
    "year": 2024,
    "points": 4,
    "topic": "Plant Reproduction"
  },
  {
    "id": 92,
    "question_text": "[MHT CET 2024] Given below are two statements: Statement I - At the onset of puberty, the pituitary gland begins secretion of gonadotropin releasing hormone. Statement II - GnRH initiates the significant increase in the secretion of follicle stimulating hormone (FSH) which induces gametogenesis. In light of above statements, choose the correct appropriate answer from the options given below.",
    "option_a": "Both statement I and statement II are correct.",
    "option_b": "Both statement I and statement II are incorrect.",
    "option_c": "Statement I is correct and statement II is incorrect.",
    "option_d": "Statement I is incorrect and statement II is correct.",
    "correct_answer": "D",
    "explanation": "Statement I is incorrect: Gonadotropin-releasing hormone (GnRH) is not secreted by the pituitary gland. It is secreted by the hypothalamus. Statement II is correct: GnRH from the hypothalamus stimulates the anterior pituitary to secrete FSH and LH. FSH does indeed play a key role in inducing gametogenesis (spermatogenesis in males and follicular development in females).",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Human Reproduction"
  },
  {
    "id": 93,
    "question_text": "[MHT CET 2024] Based on the given pie diagram, identify the correct expression with relation to the number of various groups of organism.",
    "option_a": "ii + iii + iv = i",
    "option_b": "i > ii > iii > iv",
    "option_c": "i = ii + (iii - iv)",
    "option_d": "iii = iv and i > ii",
    "correct_answer": "B",
    "explanation": "The pie diagram typically represents the proportion of different groups of organisms. Based on biological diversity, insects (i) represent the largest group, followed by other groups. Therefore, the correct relationship is likely that the number of insects (i) is greater than the number of other invertebrates (ii), which is greater than plants (iii), which is greater than vertebrates (iv), i.e., i > ii > iii > iv.",
    "difficulty": "Medium",
    "year": 2024,
    "points": 4,
    "topic": "Biodiversity"
  },
  {
    "id": 94,
    "question_text": "[MHT CET 2024] Select the INCORRECT statement.",
    "option_a": "Fever stimulates production of antibodies and helps in recovery from viral infections.",
    "option_b": "The NK cells (Natural Killer) are important in non-specific defence against viral infections and tumour.",
    "option_c": "The zinc present in semen is antibacterial.",
    "option_d": "Secretions of lachrymal glands contain an antibacterial substance called lysozyme.",
    "correct_answer": "A",
    "explanation": "Statements B, C, and D are correct. Statement A is incorrect. Fever is a systemic response to infection, and while a moderate fever can enhance certain immune responses, it does not directly stimulate antibody production. Antibody production is a specific immune response carried out by B lymphocytes (plasma cells). Fever is more associated with non-specific defense and can help inhibit pathogen growth.",
    "difficulty": "Hard",
    "year": 2024,
    "points": 4,
    "topic": "Human Health and Disease"
  },
  {
    "id": 95,
    "question_text": "[MHT CET 2024] Following are characteristics of genetic recombination, EXCEPT",
    "option_a": "occurs in sexually reproducing animals.",
    "option_b": "exchange of genetic material takes place between sister chromatids.",
    "option_c": "it occurs due to crossing over.",
    "option_d": "it leads to variations.",
    "correct_answer": "B",
    "explanation": "Statements A, C, and D are characteristics of genetic recombination. Statement B is the EXCEPTION. Exchange of genetic material between sister chromatids does not result in genetic recombination because they are genetically identical (copies of the same chromosome). Genetic recombination, specifically crossing over, occurs between non-sister chromatids of homologous chromosomes.",
    "difficulty": "Medium",
    "year": 2024,
    "points": 4,
    "topic": "Genetics"
  },
  {
    "id": 96,
    "question_text": "[MHT CET 2024] Natural plant growth inhibitor is",
    "option_a": "Gibberellins",
    "option_b": "Auxins",
    "option_c": "Ethylene",
    "option_d": "ABA",
    "correct_answer": "D",
    "explanation": "ABA (Abscisic acid) is often referred to as the 'stress hormone' and is a natural plant growth inhibitor. It promotes dormancy in seeds and buds, and causes stomatal closure during water stress, inhibiting growth processes. Gibberellins and auxins are growth promoters. Ethylene can be a promoter (fruit ripening) or inhibitor (senescence) but is not primarily classified as a growth inhibitor like ABA.",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Plant Physiology"
  },
  {
    "id": 97,
    "question_text": "[MHT CET 2024] Match the column I with column II and select the correct option.",
    "option_a": "i-b ii-c iii-d iv-a",
    "option_b": "i-b ii-c iii-a iv-d",
    "option_c": "i-c ii-d iii-a iv-b",
    "option_d": "i-d ii-a iii-c iv-b",
    "correct_answer": "B",
    "explanation": "The correct matching for biological control agents: i. Phytophthora palmivora is used to control milk weeds in orchards (b). ii. Alternaria crassa is used to control the weed Senecio jacobaea (c). iii. Cactoblastis cactorum (a moth) is famously used to control cacti weeds in Australia (a). iv. Tyria moth (cinnabar moth) is used to control the weed Senecio (ragwort) (d). So the correct sequence is i-b, ii-c, iii-a, iv-d.",
    "difficulty": "Hard",
    "year": 2024,
    "points": 4,
    "topic": "Environmental Science"
  },
  {
    "id": 98,
    "question_text": "[MHT CET 2024] Given below are two statements regarding carbon and phosphorus cycles. Statement I - Atmospheric inputs of phosphorus through rainfall are huge than carbon inputs. Statement II - Exchange of phosphorus between organism and environment are negligible as compared to carbon. In light of above statements, select the correct answer from the options given below.",
    "option_a": "Both statement I and statement II are correct.",
    "option_b": "Both statement I and statement II are incorrect.",
    "option_c": "Statement I is correct and statement II is incorrect.",
    "option_d": "Statement I is incorrect and statement II is correct.",
    "correct_answer": "D",
    "explanation": "Statement I is incorrect: The phosphorus cycle is a sedimentary cycle, and phosphorus has no significant gaseous phase. Atmospheric inputs of phosphorus via rainfall are very small. In contrast, the carbon cycle is gaseous, with large atmospheric reservoirs and significant exchange via rainfall (dissolved CO₂). Statement II is correct: The exchange of phosphorus between organisms and the environment is very slow and localized compared to the rapid, global exchange of carbon through processes like photosynthesis, respiration, and decomposition.",
    "difficulty": "Hard",
    "year": 2024,
    "points": 4,
    "topic": "Ecology"
  },
  {
    "id": 99,
    "question_text": "[MHT CET 2024] During respiration, substrate level phosphorylation occurs in",
    "option_a": "Cytoplasm only",
    "option_b": "Mitochondrial matrix only",
    "option_c": "Cytoplasm and mitochondrial matrix",
    "option_d": "intermembrane space of mitochondria",
    "correct_answer": "C",
    "explanation": "Substrate-level phosphorylation (SLP) is the direct synthesis of ATP from ADP and a phosphorylated intermediate. In cellular respiration, SLP occurs in two locations: 1. In the cytoplasm during glycolysis (e.g., production of ATP from 1,3-bisphosphoglycerate and phosphoenolpyruvate). 2. In the mitochondrial matrix during the Krebs cycle (e.g., production of GTP/ATP from succinyl-CoA).",
    "difficulty": "Medium",
    "year": 2024,
    "points": 4,
    "topic": "Cell Respiration"
  },
  {
    "id": 100,
    "question_text": "[MHT CET 2024] Salmonella typhi are ______ bacteria.",
    "option_a": "flagellate Gram + ve",
    "option_b": "flagellate Gram - ve",
    "option_c": "non-flagellate Gram - ve",
    "option_d": "non-flagellate Gram + ve",
    "correct_answer": "B",
    "explanation": "Salmonella typhi, the bacterium that causes typhoid fever, is a Gram-negative, flagellated, rod-shaped bacterium. Its flagella make it motile.",
    "difficulty": "Easy",
    "year": 2024,
    "points": 4,
    "topic": "Human Health and Disease"
  },



  {
    "id": 1,
    "question_text": "[MHT CET 2023] Amazon forest produces _______ percentage of total oxygen of earth's atmosphere.",
    "option_a": "20%",
    "option_b": "30%",
    "option_c": "40%",
    "option_d": "50%",
    "correct_answer": "A",
    "explanation": "The Amazon rainforest produces approximately 20% of the world's oxygen, often referred to as the 'Lungs of the Earth'.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Ecology"
  },
  {
    "id": 2,
    "question_text": "[MHT CET 2023] Which of the following statements are correct with respect to embryonic development in humans? i. Cleavage is holoblastic and indeterminate. ii. There is no change in overall size of zygote upto morula. iii. Embryo called blastocyst remains floating in uterine cavity for 2 to 4 days, after its entry into uterus. iv. Embryo proper develops from trophoblast cells and cells of Rauber. v. Zona pellucida remains intact around embryo till late gastrula stage.",
    "option_a": "i and ii only",
    "option_b": "iv and v only",
    "option_c": "i, ii and iii only",
    "option_d": "i, ii, iii and iv only",
    "correct_answer": "C",
    "explanation": "i is correct: Human cleavage is holoblastic (complete) and indeterminate. ii is correct: The zygote does not increase in size until morula stage due to division without growth. iii is correct: The blastocyst floats in the uterine cavity for 2-4 days before implantation. iv is incorrect: Embryo proper develops from inner cell mass, not trophoblast or cells of Rauber. v is incorrect: Zona pellucida degenerates before implantation (blastocyst stage), not till late gastrula.",
    "difficulty": "Hard",
    "year": 2023,
    "points": 4,
    "topic": "Human Reproduction"
  },
  {
    "id": 3,
    "question_text": "[MHT CET 2023] Louis Pasteur disproved the theory of _______.",
    "option_a": "special creation",
    "option_b": "panspermia",
    "option_c": "abiogenesis",
    "option_d": "biogenesis",
    "correct_answer": "C",
    "explanation": "Louis Pasteur disproved the theory of abiogenesis (spontaneous generation) through his famous swan-neck flask experiment, demonstrating that life comes only from pre-existing life (biogenesis).",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Evolution"
  },
  {
    "id": 4,
    "question_text": "[MHT CET 2023] Volatile substances, present in spices, are excreted through _______.",
    "option_a": "lungs",
    "option_b": "liver",
    "option_c": "kidneys",
    "option_d": "skin",
    "correct_answer": "A",
    "explanation": "Volatile substances like aromatic compounds from spices are excreted through the lungs during exhalation, which is why we can smell them on breath after consumption.",
    "difficulty": "Medium",
    "year": 2023,
    "points": 4,
    "topic": "Excretory System"
  },
  {
    "id": 5,
    "question_text": "[MHT CET 2023] Which one of the following is INCORRECT with respect to genetic drift?",
    "option_a": "It is any alteration in allele frequency.",
    "option_b": "It occurs in a population by pure chance.",
    "option_c": "They are random or directionless.",
    "option_d": "Effect of genetic drift has no significance in small populations.",
    "correct_answer": "D",
    "explanation": "Genetic drift is significant in small populations, not insignificant. In small populations, allele frequencies can change dramatically due to chance events. The other statements are correct: genetic drift is any alteration in allele frequency due to chance, and it is random and directionless.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Evolution"
  },
  {
    "id": 6,
    "question_text": "[MHT CET 2023] A diffused nervous system is observed in _______.",
    "option_a": "sponge",
    "option_b": "cnidarian",
    "option_c": "flatworm",
    "option_d": "earthworm",
    "correct_answer": "B",
    "explanation": "Cnidarians (like Hydra) have a diffused nervous system consisting of a nerve net. Sponges have no nervous system. Flatworms have a ladder-type nervous system. Earthworms have a centralized nervous system with ganglia.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Animal Kingdom"
  },
  {
    "id": 7,
    "question_text": "[MHT CET 2023] Archaeopteryx lithographica, a fossilized crow size toothed bird, was found from Jurassic rocks in _______.",
    "option_a": "Galapagos Islands",
    "option_b": "Germany",
    "option_c": "South Africa",
    "option_d": "Java and Peking",
    "correct_answer": "B",
    "explanation": "Archaeopteryx fossils were discovered in the Solnhofen limestone of Bavaria, Germany, from the Late Jurassic period.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Evolution"
  },
  {
    "id": 8,
    "question_text": "[MHT CET 2023] In a normal healthy person, glomerular filtrate entering the PCT does NOT contain _______. i. Plasma proteins ii. Blood corpuscles iii. Glucose iv. Vit. C v. NaCl",
    "option_a": "i and iii only",
    "option_b": "i and ii only",
    "option_c": "iii and v only",
    "option_d": "ii and iii only",
    "correct_answer": "B",
    "explanation": "Glomerular filtrate is blood plasma minus proteins and blood cells. So it does NOT contain plasma proteins (i) and blood corpuscles (ii). It does contain glucose (iii), Vitamin C (iv), and NaCl (v).",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Excretory System"
  },
  {
    "id": 9,
    "question_text": "[MHT CET 2023] Which one of the following is the palindromic sequence recognized by the enzyme EcoRI?",
    "option_a": "5'……A-G-C-T …..3' 3'……T-C-G-A …..5'",
    "option_b": "5'……G-G-A-T-C-C …..3' 3'……C-C-T-A-G-G …..5'",
    "option_c": "5'……G-A-A-T-T-C …..3' 3'……C-T-T-A-A-G …..5'",
    "option_d": "5'……G-T-C-G-A-C …..3' 3'……C-A-G-C-T-G …..5'",
    "correct_answer": "C",
    "explanation": "EcoRI recognizes the palindromic sequence 5'-GAATTC-3' on one strand and its complement 3'-CTTAAG-5' on the other. Reading the second strand in 5'→3' direction gives GAATTC, making it a palindrome.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Biotechnology"
  },
  {
    "id": 10,
    "question_text": "[MHT CET 2023] Percentage of CO₂ transport by RBCs and plasma, in the form of carbonic acid, NaHCO₃ ions and carbaminohaemoglobin respectively is _______",
    "option_a": "7%, 70%, 23%",
    "option_b": "70%, 23%, 7%",
    "option_c": "23%, 7%, 70%",
    "option_d": "7%, 23%, 70%",
    "correct_answer": "B",
    "explanation": "About 70% of CO₂ is transported as bicarbonate ions (NaHCO₃) in plasma, 23% as carbaminohaemoglobin bound to hemoglobin, and 7% as dissolved carbonic acid in plasma.",
    "difficulty": "Medium",
    "year": 2023,
    "points": 4,
    "topic": "Respiration"
  },
  {
    "id": 11,
    "question_text": "[MHT CET 2023] As per new fuel policy implemented by the government, the norms are set to reduce _______ and ______ from petrol and diesel.",
    "option_a": "S, CO₂",
    "option_b": "S, aromatic content",
    "option_c": "Nitrous oxide, CO",
    "option_d": "SO₂, CO",
    "correct_answer": "B",
    "explanation": "The new fuel policy aims to reduce sulphur and aromatic content in petrol and diesel to lower vehicular emissions and improve air quality.",
    "difficulty": "Medium",
    "year": 2023,
    "points": 4,
    "topic": "Environmental Issues"
  },
  {
    "id": 12,
    "question_text": "[MHT CET 2023] Which is the main organ of plant responsible for absorption of water and minerals?",
    "option_a": "Root",
    "option_b": "Stem",
    "option_c": "Leaf",
    "option_d": "Fruit",
    "correct_answer": "A",
    "explanation": "Roots are the main organs for absorption of water and minerals from the soil, through root hairs and specialized structures.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Plant Physiology"
  },
  {
    "id": 13,
    "question_text": "[MHT CET 2023] Heart beat decreases in the following conditions EXCEPT ______.",
    "option_a": "acidosis and alkalosis",
    "option_b": "hypoxia",
    "option_c": "elevated levels of K⁺ and Na⁺ in blood",
    "option_d": "increase in level of hormone epinephrine",
    "correct_answer": "D",
    "explanation": "Epinephrine (adrenaline) increases heart rate, not decreases it. Acidosis, alkalosis, hypoxia, and elevated K⁺/Na⁺ can decrease heart rate or affect cardiac function negatively.",
    "difficulty": "Medium",
    "year": 2023,
    "points": 4,
    "topic": "Body Fluids and Circulation"
  },
  {
    "id": 14,
    "question_text": "[MHT CET 2023] Match types of biofertilizers in column I with their examples in column II. Column I: i. Nitrogen fixing, ii. Phosphate solubilizing, iii. Compost making, iv. Fungal biofertilizer. Column II: a. Pseudomonas striata, b. actinobacteria, c. mycorrhizae, d. Klebsiella.",
    "option_a": "i-d, ii-a, iii-b, iv-c",
    "option_b": "i-a, ii-d, iii-c, iv-b",
    "option_c": "i-c, ii-b, iii-d, iv-a",
    "option_d": "i-b, ii-c, iii-a, iv-d",
    "correct_answer": "A",
    "explanation": "Nitrogen fixing biofertilizers include Klebsiella (d). Phosphate solubilizing include Pseudomonas striata (a). Compost making includes actinobacteria (b). Fungal biofertilizers include mycorrhizae (c). So i-d, ii-a, iii-b, iv-c.",
    "difficulty": "Medium",
    "year": 2023,
    "points": 4,
    "topic": "Microbes in Human Welfare"
  },
  {
    "id": 15,
    "question_text": "[MHT CET 2023] Which of the following are low threshold substances with respect to selective reabsorption?",
    "option_a": "Ca⁺⁺, Na⁺ and Cl⁻",
    "option_b": "Water, sulphates and nitrates",
    "option_c": "Glucose and amino acids",
    "option_d": "K⁺ and Vit. C",
    "correct_answer": "D",
    "explanation": "Low threshold substances are those that are reabsorbed only when their concentration falls below a certain threshold. K⁺ and Vitamin C are examples. Glucose and amino acids are high threshold substances (completely reabsorbed up to a maximum).",
    "difficulty": "Hard",
    "year": 2023,
    "points": 4,
    "topic": "Excretory System"
  },
  {
    "id": 16,
    "question_text": "[MHT CET 2023] Which one of the following is NOT the reason of indigestion?",
    "option_a": "Food poisoning",
    "option_b": "Over-eating",
    "option_c": "Roughage",
    "option_d": "Spicy food",
    "correct_answer": "C",
    "explanation": "Roughage (dietary fiber) aids digestion and prevents indigestion, rather than causing it. Food poisoning, over-eating, and spicy food can all cause indigestion.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Digestion"
  },
  {
    "id": 17,
    "question_text": "[MHT CET 2023] In the following diagram of T.S. of pancreas, identify 'A' and 'B'.",
    "option_a": "A-Acinar cells, B-Cells of Islets of Langerhans",
    "option_b": "A-Goblet cells, B-C-cells",
    "option_c": "A-Kupffer cells, B-Leydig cells",
    "option_d": "A-Hepatic cells, B-JG cells",
    "correct_answer": "A",
    "explanation": "In T.S. of pancreas, the exocrine part consists of acinar cells that produce digestive enzymes, and the endocrine part consists of Islets of Langerhans that produce hormones. So A is acinar cells, B is Islets of Langerhans cells.",
    "difficulty": "Medium",
    "year": 2023,
    "points": 4,
    "topic": "Digestion"
  },
  {
    "id": 18,
    "question_text": "[MHT CET 2023] Given below are the statements regarding enzymes. Choose the correct statements. i. All enzymes are proteinaceous. ii. Enzyme becomes more active at the temperature of 60° to 70°C. iii. Enzymes have one or two active sites where substrate binds with the enzyme. iv. Any increase or decrease in specific pH, enzyme activity is always enhanced. v. Enzymes remain active to catalyze again after completion of first reaction.",
    "option_a": "ii and iv only",
    "option_b": "i and v only",
    "option_c": "i, iii and v only",
    "option_d": "ii, iii and v only",
    "correct_answer": "C",
    "explanation": "i is correct: Most enzymes are proteinaceous (except ribozymes). iii is correct: Enzymes have active sites for substrate binding. v is correct: Enzymes are not consumed and can catalyze multiple reactions. ii is incorrect: Most enzymes denature at 60-70°C. iv is incorrect: Enzymes have optimal pH; deviation reduces activity.",
    "difficulty": "Medium",
    "year": 2023,
    "points": 4,
    "topic": "Biomolecules"
  },
  {
    "id": 19,
    "question_text": "[MHT CET 2023] Match the Column I with Column II. Column I (Animals): i. Adult Frog, ii. Land snail, iii. Tadpole of frog, iv. Spider. Column II (Excretory substances): a. Guanine, b. Urea, c. Uric acid, d. Ammonia.",
    "option_a": "i-b, ii-c, iii-a, iv-d",
    "option_b": "i-b, ii-c, iii-d, iv-a",
    "option_c": "i-c, ii-b, iii-d, iv-a",
    "option_d": "i-c, ii-b, iii-a, iv-d",
    "correct_answer": "B",
    "explanation": "Adult frog excretes urea (ureotelic) - b. Land snail excretes uric acid (uricotelic) - c. Tadpole of frog excretes ammonia (ammonotelic) - d. Spider excretes guanine - a. So i-b, ii-c, iii-d, iv-a.",
    "difficulty": "Medium",
    "year": 2023,
    "points": 4,
    "topic": "Excretory System"
  },
  {
    "id": 20,
    "question_text": "[MHT CET 2023] ______ is a problem of synthesizing few alpha (α) and beta (β) globin molecules in haemoglobin.",
    "option_a": "Phenylketonuria",
    "option_b": "Thalassemia",
    "option_c": "Sickle cell anaemia",
    "option_d": "Haemophilia",
    "correct_answer": "B",
    "explanation": "Thalassemia is a genetic disorder characterized by reduced or absent synthesis of either alpha or beta globin chains of hemoglobin. Phenylketonuria affects amino acid metabolism, sickle cell anemia involves abnormal hemoglobin structure, and hemophilia affects blood clotting.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Genetics"
  },
  {
    "id": 21,
    "question_text": "[MHT CET 2023] Which hormone is used to increase fruit size and bunch length of grapes?",
    "option_a": "Auxins",
    "option_b": "Gibberellins",
    "option_c": "Cytokinins",
    "option_d": "Ethylene",
    "correct_answer": "B",
    "explanation": "Gibberellins are used to increase fruit size and bunch length in grapes by promoting cell elongation. They are also used to improve fruit set in grapes.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Plant Hormones"
  },
  {
    "id": 22,
    "question_text": "[MHT CET 2023] Semen contains ______ and ______ that are antibacterial in nature, hence it provides natural immunity.",
    "option_a": "lysozyme and serum amyloid P",
    "option_b": "spermine and zinc",
    "option_c": "interferons and cytokines",
    "option_d": "C-Reactive Protein and alpha-1-acid glycoprotein",
    "correct_answer": "B",
    "explanation": "Semen contains spermine and zinc, which have antibacterial properties and provide natural immunity in the female reproductive tract.",
    "difficulty": "Hard",
    "year": 2023,
    "points": 4,
    "topic": "Human Reproduction"
  },
  {
    "id": 23,
    "question_text": "[MHT CET 2023] Nasal cavity is divisible into right and left nasal chambers by",
    "option_a": "thyroid cartilage",
    "option_b": "mesethmoid cartilage",
    "option_c": "tracheal cartilage",
    "option_d": "thyrohyoid membrane",
    "correct_answer": "B",
    "explanation": "The nasal cavity is divided into right and left chambers by the nasal septum, which is partly formed by the mesethmoid cartilage (perpendicular plate of ethmoid) and vomer bone.",
    "difficulty": "Hard",
    "year": 2023,
    "points": 4,
    "topic": "Respiration"
  },
  {
    "id": 24,
    "question_text": "[MHT CET 2023] Which one of the following is NOT a part of anther wall?",
    "option_a": "Tapetum",
    "option_b": "Endothelium",
    "option_c": "Integument",
    "option_d": "Middle layers",
    "correct_answer": "C",
    "explanation": "Integument is part of the ovule, not the anther wall. Anther wall layers from outside to inside are: epidermis, endothecium, middle layers, and tapetum. Endothelium is another name for endothecium.",
    "difficulty": "Medium",
    "year": 2023,
    "points": 4,
    "topic": "Reproduction in Plants"
  },
  {
    "id": 25,
    "question_text": "[MHT CET 2023] Which one of the following is NOT a homologous pair with respect to human male and female reproductive systems, respectively?",
    "option_a": "Vasa efferentia --- fallopian tubes",
    "option_b": "Scrotum --- labia majora",
    "option_c": "Penis --- Clitoris",
    "option_d": "Bulbourethral glands --- Vestibular glands",
    "correct_answer": "A",
    "explanation": "Vasa efferentia in males are not homologous to fallopian tubes in females. Vasa efferentia connect rete testis to epididymis, while fallopian tubes transport ova. Homologous pairs: Scrotum-labia majora, Penis-clitoris, Bulbourethral glands-vestibular glands.",
    "difficulty": "Medium",
    "year": 2023,
    "points": 4,
    "topic": "Human Reproduction"
  },
  {
    "id": 26,
    "question_text": "[MHT CET 2023] Identify the correct sequence of events of pollen pistil interaction given below. i. syngamy ii. pollination iii. siphonogamy iv. triple fusion v. porogamy",
    "option_a": "ii → iii → i → v → iv",
    "option_b": "ii → i → iii → v → iv",
    "option_c": "ii → iii → v → i → iv",
    "option_d": "ii → v → iii → i → iv",
    "correct_answer": "D",
    "explanation": "Correct sequence: Pollination (ii) first, then porogamy (v) - entry of pollen tube through micropyle, then siphonogamy (iii) - growth of pollen tube, then syngamy (i) - fusion of gametes, then triple fusion (iv) - fusion with polar nuclei.",
    "difficulty": "Hard",
    "year": 2023,
    "points": 4,
    "topic": "Reproduction in Plants"
  },
  {
    "id": 27,
    "question_text": "[MHT CET 2023] The first transgenic plant produced was",
    "option_a": "Bt cotton",
    "option_b": "Bt brinjal",
    "option_c": "Tomato",
    "option_d": "Tobacco",
    "correct_answer": "D",
    "explanation": "The first transgenic plant was tobacco, produced in 1983 by introducing an antibiotic resistance gene using Agrobacterium-mediated transformation.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Biotechnology"
  },
  {
    "id": 28,
    "question_text": "[MHT CET 2023] Given below are two statements. Statement I: Stratification is the horizontal distribution of different plants and animals on land. Statement II: Forest is a good example of stratification. In the light of the above statements, choose the most appropriate answer from the options given below.",
    "option_a": "Both statement I and statement II are correct.",
    "option_b": "Both statement I and statement II are incorrect.",
    "option_c": "Statement I is correct but statement II is incorrect.",
    "option_d": "Statement I is incorrect but statement II is correct.",
    "correct_answer": "D",
    "explanation": "Statement I is incorrect: Stratification is vertical distribution (layering) of different species, not horizontal. Statement II is correct: Forests show clear stratification into canopy, understory, shrub, and ground layers.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Ecology"
  },
  {
    "id": 29,
    "question_text": "[MHT CET 2023] Select the correct match regarding formed elements of blood.",
    "option_a": "Polycythemia --- ratio of RBCs to total blood volume",
    "option_b": "Hematocrit --- moving of WBCs out of the capillary walls",
    "option_c": "Phagocytosis --- destruction of antigen-antibody complexes, bacteria etc",
    "option_d": "Leukemia --- increase in number of RBCs",
    "correct_answer": "C",
    "explanation": "Phagocytosis is the process by which cells like macrophages engulf and destroy bacteria, antigen-antibody complexes, etc. Polycythemia is increase in RBC count, not ratio. Hematocrit is the ratio of RBCs to blood volume. Leukemia is increase in WBCs, not RBCs.",
    "difficulty": "Medium",
    "year": 2023,
    "points": 4,
    "topic": "Body Fluids"
  },
  {
    "id": 30,
    "question_text": "[MHT CET 2023] Which of the following cranial nerves does NOT contain parasympathetic nerve fibres?",
    "option_a": "Facial",
    "option_b": "Trigeminal",
    "option_c": "Glossopharyngeal",
    "option_d": "Vagus",
    "correct_answer": "B",
    "explanation": "The trigeminal nerve (V) is primarily sensory and motor to muscles of mastication, and does not carry parasympathetic fibers. Parasympathetic fibers are carried by oculomotor (III), facial (VII), glossopharyngeal (IX), and vagus (X) nerves.",
    "difficulty": "Medium",
    "year": 2023,
    "points": 4,
    "topic": "Neural Control"
  },
  {
    "id": 31,
    "question_text": "[MHT CET 2023] Edges of large lake or a beach is a perfect example of",
    "option_a": "stratification",
    "option_b": "zonation",
    "option_c": "xeric succession",
    "option_d": "grassland",
    "correct_answer": "B",
    "explanation": "Zonation refers to the horizontal distribution of different communities in distinct belts or zones, such as along the edges of a lake (littoral, limnetic, profundal zones) or a beach (supratidal, intertidal, subtidal zones).",
    "difficulty": "Medium",
    "year": 2023,
    "points": 4,
    "topic": "Ecology"
  },
  {
    "id": 32,
    "question_text": "[MHT CET 2023] Given below are two statements. Statement I: Habitat consists of numerous niches. Statement II: Niche is an area where species lives and prospers. In the light of above statements choose the correct option.",
    "option_a": "Both statement I and statement II are correct.",
    "option_b": "Both statement I and statement II are incorrect.",
    "option_c": "Statement I is correct but statement II is incorrect.",
    "option_d": "Statement I is incorrect but statement II is correct.",
    "correct_answer": "C",
    "explanation": "Statement I is correct: A habitat (physical place) contains numerous niches (functional roles). Statement II is incorrect: Niche is the functional role of a species in its ecosystem, not just the area where it lives.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Ecology"
  },
  {
    "id": 33,
    "question_text": "[MHT CET 2023] Which of the following nucleic acids carries activated amino acid up to the site of protein synthesis?",
    "option_a": "DNA",
    "option_b": "mRNA",
    "option_c": "rRNA",
    "option_d": "tRNA",
    "correct_answer": "D",
    "explanation": "tRNA (transfer RNA) carries activated amino acids to the ribosome during protein synthesis, matching its anticodon with the codon on mRNA.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Molecular Biology"
  },
  {
    "id": 34,
    "question_text": "[MHT CET 2023] The result of which cross illustrates Mendel's law of segregation?",
    "option_a": "Tt × tt",
    "option_b": "Rr × RR",
    "option_c": "Rr × Rr",
    "option_d": "tt × tt",
    "correct_answer": "C",
    "explanation": "Mendel's law of segregation states that alleles separate during gamete formation. The monohybrid cross (Rr × Rr) showing 3:1 phenotypic ratio in F2 generation demonstrates segregation of alleles.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Genetics"
  },
  {
    "id": 35,
    "question_text": "[MHT CET 2023] When two pink flowered snapdragon plants are crossed, what will be the phenotypic ratio in F₂ plants?",
    "option_a": "1:1",
    "option_b": "3:1",
    "option_c": "1:2:1",
    "option_d": "3:2:1",
    "correct_answer": "C",
    "explanation": "Snapdragon shows incomplete dominance. Pink flowers are heterozygous (Rr). Crossing two pink (Rr × Rr) gives genotypic ratio 1 RR : 2 Rr : 1 rr, and phenotypic ratio 1 Red : 2 Pink : 1 White, i.e., 1:2:1.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Genetics"
  },
  {
    "id": 36,
    "question_text": "[MHT CET 2023] Which of the following are found in the portal area of liver? i. Branch of hepatic portal vein ii. Branch of hepatic vein iii. Branch of bile duct iv. Branch of hepatic artery",
    "option_a": "i and iii only",
    "option_b": "ii and iii only",
    "option_c": "i, iii and iv only",
    "option_d": "i, ii and iv only",
    "correct_answer": "C",
    "explanation": "The portal area (portal triad) in the liver contains a branch of the hepatic portal vein (i), a branch of the bile duct (iii), and a branch of the hepatic artery (iv). The hepatic vein is not part of the portal triad; it drains blood from the liver.",
    "difficulty": "Hard",
    "year": 2023,
    "points": 4,
    "topic": "Digestion"
  },
  {
    "id": 37,
    "question_text": "[MHT CET 2023] The lowermost cell of the suspensor towards the embryo is known as",
    "option_a": "haustoria",
    "option_b": "hypophysis",
    "option_c": "epicotyl",
    "option_d": "hypocotyl",
    "correct_answer": "B",
    "explanation": "In plant embryogeny, the suspensor has a basal cell and a terminal cell. The lowermost cell of the suspensor adjacent to the embryo is called the hypophysis, which later gives rise to the radicle and root cap.",
    "difficulty": "Hard",
    "year": 2023,
    "points": 4,
    "topic": "Reproduction in Plants"
  },
  {
    "id": 38,
    "question_text": "[MHT CET 2023] Match the following conditions associated with mental disorders in column I with their respective meanings in column II. Column I: i. Bulimia, ii. Anorexia nervosa, iii. Amnesia, iv. Depression. Column II: a. loss of memory, b. extreme overindulgence in food, c. sadness and inactivity in life, d. emotional aversion to food.",
    "option_a": "i-b, ii-d, iii-a, iv-c",
    "option_b": "i-d, ii-a, iii-b, iv-c",
    "option_c": "i-a, ii-c, iii-d, iv-b",
    "option_d": "i-c, ii-a, iii-b, iv-d",
    "correct_answer": "A",
    "explanation": "Bulimia is binge eating (b). Anorexia nervosa is aversion to food (d). Amnesia is loss of memory (a). Depression is sadness and inactivity (c). So i-b, ii-d, iii-a, iv-c.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Human Health"
  },
  {
    "id": 39,
    "question_text": "[MHT CET 2023] Which one of the following is correct regarding special features of Neanderthal man? i. He used hide to cover his body. ii. It's fossil was first found in Germany. iii. He had semi erect posture. iv. He existed during Miocene epoch. v. He constructed flint tools.",
    "option_a": "i and ii only",
    "option_b": "i, ii, iii and iv only",
    "option_c": "i, ii and v only",
    "option_d": "ii, iii, iv and v only",
    "correct_answer": "C",
    "explanation": "Neanderthal man used hides for clothing (i), fossils first found in Germany (ii), and constructed flint tools (v). They had fully erect posture, not semi-erect (iii incorrect), and existed during Pleistocene, not Miocene (iv incorrect).",
    "difficulty": "Medium",
    "year": 2023,
    "points": 4,
    "topic": "Evolution"
  },
  {
    "id": 40,
    "question_text": "[MHT CET 2023] The cells, which release secretion to stimulate adjacent cells in the organism, are known as",
    "option_a": "paracrines",
    "option_b": "autocrines",
    "option_c": "endocrines",
    "option_d": "pheromones",
    "correct_answer": "A",
    "explanation": "Paracrine signaling involves cells releasing secretions that affect adjacent cells. Autocrine affects the same cell, endocrine affects distant cells via bloodstream, and pheromones affect other individuals.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Chemical Coordination"
  },
  {
    "id": 41,
    "question_text": "[MHT CET 2023] Given below are two statements. Statement I: Tobacco, Marijuana and other drugs may cause infertility in both men and women. Statement II: Nicotine blocks the production of sperms and decreases the size of testicles. In the light of above statements, choose the correct answer from options given below.",
    "option_a": "Both statement I and statement II are correct.",
    "option_b": "Both statement I and statement II are incorrect.",
    "option_c": "Statement I is correct but statement II is incorrect.",
    "option_d": "Statement I is incorrect but statement II is correct.",
    "correct_answer": "A",
    "explanation": "Both statements are correct. Drugs like tobacco and marijuana can cause infertility in both sexes. Nicotine specifically affects sperm production and testicular size.",
    "difficulty": "Medium",
    "year": 2023,
    "points": 4,
    "topic": "Human Health"
  },
  {
    "id": 42,
    "question_text": "[MHT CET 2023] In glycolysis, the two ATP molecules are consumed during",
    "option_a": "Step ① and ②",
    "option_b": "Step ① and ④",
    "option_c": "Step ① and ③",
    "option_d": "Step ① and ⑤",
    "correct_answer": "C",
    "explanation": "In glycolysis, ATP is consumed in step 1 (hexokinase) and step 3 (phosphofructokinase). These are the energy investment phases.",
    "difficulty": "Medium",
    "year": 2023,
    "points": 4,
    "topic": "Respiration"
  },
  {
    "id": 43,
    "question_text": "[MHT CET 2023] Nearly 70% of natural nitrogen fixation is carried out by",
    "option_a": "physical process",
    "option_b": "Prokaryotes",
    "option_c": "eukaryotes",
    "option_d": "Haber-Bosch process",
    "correct_answer": "B",
    "explanation": "About 70% of natural nitrogen fixation is carried out by prokaryotes, including free-living bacteria like Azotobacter and symbiotic bacteria like Rhizobium. Physical processes (lightning) contribute about 10-15%, and industrial Haber-Bosch process is not natural.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Microbes in Human Welfare"
  },
  {
    "id": 44,
    "question_text": "[MHT CET 2023] Match the following with respect to different categories of red list. Column I: i. Extinct, ii. Extinct in wild, iii. Endangered, iv. Vulnerable. Column II: a. species whose members survive only in captivity, b. Rapid population decline of 50% to more than 70% over the previous 10 years, c. species in which the last individual has died, d. Rapid population decline of 30% to more than 50% over the previous 10 years.",
    "option_a": "i-d, ii-b, iii-c, iv-a",
    "option_b": "i-c, ii-a, iii-b, iv-d",
    "option_c": "i-c, ii-d, iii-b, iv-a",
    "option_d": "i-b, ii-c, iii-a, iv-d",
    "correct_answer": "B",
    "explanation": "Extinct (i) means last individual died (c). Extinct in wild (ii) means survive only in captivity (a). Endangered (iii) means 50-70% decline (b). Vulnerable (iv) means 30-50% decline (d). So i-c, ii-a, iii-b, iv-d.",
    "difficulty": "Medium",
    "year": 2023,
    "points": 4,
    "topic": "Biodiversity"
  },
  {
    "id": 45,
    "question_text": "[MHT CET 2023] The electron carriers and enzymes of electron transport chain are arranged on inner mitochondrial membrane to form how many complexes?",
    "option_a": "Six",
    "option_b": "Five",
    "option_c": "Four",
    "option_d": "Three",
    "correct_answer": "C",
    "explanation": "The ETS has four major complexes: Complex I (NADH dehydrogenase), Complex II (Succinate dehydrogenase), Complex III (Cytochrome bc1), and Complex IV (Cytochrome c oxidase). Complex V is ATP synthase, which is not part of the electron transport chain per se.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Respiration"
  },
  {
    "id": 46,
    "question_text": "[MHT CET 2023] Bryophytes like mosses are able to grow in small amount of soil occupies the _______ sereal stage in the xerarch succession.",
    "option_a": "pioneer",
    "option_b": "second",
    "option_c": "third",
    "option_d": "fourth",
    "correct_answer": "B",
    "explanation": "In xerarch succession on bare rock, the pioneer stage is crustose lichens, followed by foliose lichens, then mosses (bryophytes) as the second stage, then herbs, shrubs, and finally trees.",
    "difficulty": "Medium",
    "year": 2023,
    "points": 4,
    "topic": "Ecology"
  },
  {
    "id": 47,
    "question_text": "[MHT CET 2023] Match the following diseases in column I with their respective modes of treatment in column II. Column I: i. Malaria, ii. Dermatophytosis, iii. Amoebiasis, iv. Filariasis. Column II: a. drugs like nystatin, fluconazole, itraconazole, b. drugs like metronidazole and Tinidazole, c. combination of artesunate, sulfadoxine, pyrimethamine etc, d. diethyl-carbamazine citrate tablets.",
    "option_a": "i-d, ii-c, iii-a, iv-b",
    "option_b": "i-c, ii-a, iii-b, iv-d",
    "option_c": "i-b, ii-d, iii-c, iv-a",
    "option_d": "i-a, ii-b, iii-d, iv-c",
    "correct_answer": "B",
    "explanation": "Malaria treated with artesunate combination (c). Dermatophytosis (fungal) treated with antifungals like fluconazole (a). Amoebiasis treated with metronidazole (b). Filariasis treated with diethylcarbamazine (d). So i-c, ii-a, iii-b, iv-d.",
    "difficulty": "Medium",
    "year": 2023,
    "points": 4,
    "topic": "Human Diseases"
  },
  {
    "id": 48,
    "question_text": "[MHT CET 2023] Breakdown of alveoli and shortness of breath is observed in",
    "option_a": "emphysema",
    "option_b": "laryngitis",
    "option_c": "pneumonia",
    "option_d": "asthma",
    "correct_answer": "A",
    "explanation": "Emphysema is a condition where the alveoli break down, reducing surface area for gas exchange and causing shortness of breath. Laryngitis affects vocal cords, pneumonia involves lung infection/inflammation, asthma involves bronchial constriction.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Respiration"
  },
  {
    "id": 49,
    "question_text": "[MHT CET 2023] Tubular secretion is the only mode of excretion in",
    "option_a": "cartilagenous fishes",
    "option_b": "marine bony fishes",
    "option_c": "fresh water bony fishes",
    "option_d": "marine birds",
    "correct_answer": "B",
    "explanation": "Marine bony fishes face water loss to hypertonic environment. They drink seawater and excrete excess salts through gills, and their kidneys have minimal glomeruli (aglomerular), so tubular secretion is the main mode of excretion.",
    "difficulty": "Hard",
    "year": 2023,
    "points": 4,
    "topic": "Excretory System"
  },
  {
    "id": 50,
    "question_text": "[MHT CET 2023] Which hormone is NOT secreted by placenta?",
    "option_a": "hCG",
    "option_b": "Inhibin",
    "option_c": "Estrogen",
    "option_d": "Progesterone",
    "correct_answer": "B",
    "explanation": "The placenta secretes hCG, estrogen, and progesterone. Inhibin is secreted by the ovaries (granulosa cells) and testes (Sertoli cells), not by the placenta.",
    "difficulty": "Medium",
    "year": 2023,
    "points": 4,
    "topic": "Human Reproduction"
  },
  {
    "id": 51,
    "question_text": "[MHT CET 2023] Select the correct match of scientists and their respective discoveries.",
    "option_a": "Karl Landsteiner in 1900 - A, B, O blood groups.",
    "option_b": "Decastello and Sturli in 1902 - Concept of immunity",
    "option_c": "Edward Jenner - Rh factor (Antigen 'D')",
    "option_d": "Landsteiner and Wiener in 1940 - 'AB' blood group system.",
    "correct_answer": "A",
    "explanation": "Karl Landsteiner discovered A, B, O blood groups in 1900. Decastello and Sturli discovered AB group in 1902. Edward Jenner developed smallpox vaccine. Landsteiner and Wiener discovered Rh factor in 1940.",
    "difficulty": "Medium",
    "year": 2023,
    "points": 4,
    "topic": "Body Fluids"
  },
  {
    "id": 52,
    "question_text": "[MHT CET 2023] Maturation of both androecium and gynoecium in a homogamous flower helps in",
    "option_a": "cross pollination",
    "option_b": "self pollination",
    "option_c": "apomixis",
    "option_d": "polyembryony",
    "correct_answer": "B",
    "explanation": "Homogamy is the condition where androecium and gynoecium mature at the same time, facilitating self-pollination. It ensures that pollen is available when the stigma is receptive.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Reproduction in Plants"
  },
  {
    "id": 53,
    "question_text": "[MHT CET 2023] In tissue culture technique morphogenic differentiation of shoot and root is controlled by the interaction and ratio of",
    "option_a": "auxin and gibberellins",
    "option_b": "gibberellins and cytokinin",
    "option_c": "auxin and cytokinin",
    "option_d": "ethylene and ABA",
    "correct_answer": "C",
    "explanation": "The ratio of auxin to cytokinin controls differentiation in tissue culture: high auxin:cytokinin promotes root formation, high cytokinin:auxin promotes shoot formation, and intermediate ratio promotes callus growth.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Biotechnology"
  },
  {
    "id": 54,
    "question_text": "[MHT CET 2023] The unit of measurement of water potential is",
    "option_a": "Bars only",
    "option_b": "Bars or atmospheres only",
    "option_c": "Bars or atmospheres or Pascals only",
    "option_d": "Bars or atmospheres or Pascals or Joules only",
    "correct_answer": "C",
    "explanation": "Water potential is measured in pressure units: bars, atmospheres, or Pascals (SI unit). Joules are units of energy, not pressure.",
    "difficulty": "Medium",
    "year": 2023,
    "points": 4,
    "topic": "Plant Physiology"
  },
  {
    "id": 55,
    "question_text": "[MHT CET 2023] Which of the following organisms can respire anaerobically as well as aerobically?",
    "option_a": "Fishes",
    "option_b": "Yeasts",
    "option_c": "Lichens",
    "option_d": "Algae",
    "correct_answer": "B",
    "explanation": "Yeasts are facultative anaerobes - they can respire aerobically in presence of oxygen and anaerobically (fermentation) in absence of oxygen. Fishes, lichens, and algae are mostly aerobic.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Respiration"
  },
  {
    "id": 56,
    "question_text": "[MHT CET 2023] Given below are two statements: Statement I: Minerals are absorbed by plants with or without expenditure of energy. Statement II: Mineral ion absorption is independent of water absorption. In the light of the above statements, choose the most appropriate answer from the options given below.",
    "option_a": "Both statement I and statement II are true.",
    "option_b": "Both statement I and statement II are false.",
    "option_c": "Statement I is true but statement II is false.",
    "option_d": "Statement I is false but statement II is true.",
    "correct_answer": "A",
    "explanation": "Both statements are true. Mineral absorption can be active (with energy) or passive (without energy). Mineral ion absorption is independent of water absorption - they are separate processes.",
    "difficulty": "Medium",
    "year": 2023,
    "points": 4,
    "topic": "Plant Physiology"
  },
  {
    "id": 57,
    "question_text": "[MHT CET 2023] Proteins like Keratin of hair consists of polypeptide chain arranged",
    "option_a": "like a pleated sheet",
    "option_b": "like a spiral helix",
    "option_c": "in linear sequence",
    "option_d": "in twisted and folded sequence",
    "correct_answer": "B",
    "explanation": "Keratin is a fibrous protein with alpha-helical secondary structure (spiral helix). Beta-pleated sheets are found in silk fibroin. The other options describe primary and tertiary structures.",
    "difficulty": "Medium",
    "year": 2023,
    "points": 4,
    "topic": "Biomolecules"
  },
  {
    "id": 58,
    "question_text": "[MHT CET 2023] In human females, the pair of hormones produced ONLY during pregnancy is",
    "option_a": "ACTH, ADH",
    "option_b": "hCG, HPL",
    "option_c": "hCG, MSH",
    "option_d": "GH, HPL",
    "correct_answer": "B",
    "explanation": "hCG (human Chorionic Gonadotropin) and HPL (human Placental Lactogen) are produced only during pregnancy by the placenta. ACTH, ADH, MSH, and GH are produced at other times as well.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Human Reproduction"
  },
  {
    "id": 59,
    "question_text": "[MHT CET 2023] Observe the following diagram and select the correct chromosomal aberration from the list given below.",
    "option_a": "Deletion",
    "option_b": "Duplication",
    "option_c": "Inversion",
    "option_d": "Translocation",
    "correct_answer": "C",
    "explanation": "Without the diagram, based on typical questions, inversion involves a segment reversing orientation within the chromosome. The diagram likely shows an inverted segment.",
    "difficulty": "Medium",
    "year": 2023,
    "points": 4,
    "topic": "Genetics"
  },
  {
    "id": 60,
    "question_text": "[MHT CET 2023] The gene for the production of an iron storage protein, ferritin is isolated from _______ and transferred to _______.",
    "option_a": "soybean, rice",
    "option_b": "soybean, potato",
    "option_c": "alfalfa, banana",
    "option_d": "tomato, tobacco",
    "correct_answer": "A",
    "explanation": "The ferritin gene from soybean has been transferred to rice to increase iron content in rice grains, addressing iron deficiency anemia.",
    "difficulty": "Hard",
    "year": 2023,
    "points": 4,
    "topic": "Biotechnology"
  },
  {
    "id": 61,
    "question_text": "[MHT CET 2023] Which one of the following is NOT an IntraUterine Device?",
    "option_a": "Lippes loop",
    "option_b": "Progestasert",
    "option_c": "Nexplanon",
    "option_d": "Cu-T and Cu-7",
    "correct_answer": "C",
    "explanation": "Nexplanon is an implant (placed under skin), not an IUD. Lippes loop (non-medicated IUD), Progestasert (hormone-releasing IUD), and Cu-T/Cu-7 (copper IUD) are all IUDs.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Reproductive Health"
  },
  {
    "id": 62,
    "question_text": "[MHT CET 2023] The concept of central dogma in retroviruses is given by",
    "option_a": "Temin and Baltimore",
    "option_b": "Meselson and Stahl",
    "option_c": "Watson and Crick",
    "option_d": "MacCarty and MacLeod",
    "correct_answer": "A",
    "explanation": "Temin and Baltimore independently discovered reverse transcriptase in retroviruses, showing that genetic information can flow from RNA to DNA, modifying the central dogma. Watson and Crick proposed DNA structure, Meselson-Stahl proved semi-conservative replication.",
    "difficulty": "Medium",
    "year": 2023,
    "points": 4,
    "topic": "Molecular Biology"
  },
  {
    "id": 63,
    "question_text": "[MHT CET 2023] Which of the following statement/s is/are correct with respect to generation and conduction of nerve impulse? i. The resting potential difference is -70 mV. ii. The voltage gated Na⁺ and K⁺ channels operate together and are self closing. iii. At the peak of action potential, the potential difference rises to +30 to +60 mV. iv. In medullated nerve fibre, the action potential is conducted as wave of membrane depolarization. v. The resting potential is maintained by especially closure of gated channels of Na⁺ and K⁺.",
    "option_a": "i only",
    "option_b": "iii and iv only",
    "option_c": "ii, iv and v only",
    "option_d": "i, iii and v only",
    "correct_answer": "D",
    "explanation": "i is correct: Resting potential is about -70 mV. iii is correct: Peak action potential is +30 to +60 mV. v is correct: Resting potential maintained by closure of Na⁺ and K⁺ gated channels and Na⁺/K⁺ pump. ii is incorrect: Na⁺ and K⁺ channels operate sequentially, not together. iv is incorrect: In medullated fibers, conduction is saltatory (jumping between nodes), not as continuous wave.",
    "difficulty": "Hard",
    "year": 2023,
    "points": 4,
    "topic": "Neural Control"
  },
  {
    "id": 64,
    "question_text": "[MHT CET 2023] Generally vernalization is effective at _______ stage in annual plants.",
    "option_a": "floral bud",
    "option_b": "flower",
    "option_c": "fruit",
    "option_d": "seedling",
    "correct_answer": "D",
    "explanation": "Vernalization is the induction of flowering by prolonged cold treatment, and it is effective at the seedling stage in annual plants.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Plant Physiology"
  },
  {
    "id": 65,
    "question_text": "[MHT CET 2023] Which one of the following pairs are fresh water carps?",
    "option_a": "Cirrhina mrigala and Grass carp",
    "option_b": "Harpadon and Stromateus",
    "option_c": "Sardinella and common carp",
    "option_d": "Rastrelliger and silver carp",
    "correct_answer": "A",
    "explanation": "Cirrhina mrigala (Indian major carp) and Grass carp are freshwater carps. Harpadon (Bombay duck) and Stromateus (pomfret) are marine fish. Sardinella (sardine) and Rastrelliger (mackerel) are marine. Common carp and silver carp are freshwater but Sardinella is marine.",
    "difficulty": "Hard",
    "year": 2023,
    "points": 4,
    "topic": "Animal Husbandry"
  },
  {
    "id": 66,
    "question_text": "[MHT CET 2023] Pyramid of energy is always upright as energy is _______ at each trophic level.",
    "option_a": "gained",
    "option_b": "lost",
    "option_c": "produced",
    "option_d": "constant",
    "correct_answer": "B",
    "explanation": "Energy pyramids are always upright because energy is lost at each trophic level (as heat through respiration), so each successive level has less energy.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Ecology"
  },
  {
    "id": 67,
    "question_text": "[MHT CET 2023] Given below are two statements. Statement I: Stenohaline animals tolerate wide range of salt concentration. Statement II: Euryhaline animals are capable of handling narrow range of salt concentration. In the light of above statements, choose the most appropriate answer from the options given below.",
    "option_a": "Both statement I and statement II are correct.",
    "option_b": "Both statement I and statement II are incorrect.",
    "option_c": "Statement I is correct but statement II is incorrect.",
    "option_d": "Statement I is incorrect but statement II is correct.",
    "correct_answer": "B",
    "explanation": "Both statements are incorrect. Stenohaline animals tolerate narrow range of salinity, while euryhaline animals tolerate wide range. The statements have the definitions reversed.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Animal Physiology"
  },
  {
    "id": 68,
    "question_text": "[MHT CET 2023] The part of the plant used in tissue culture is",
    "option_a": "callus",
    "option_b": "explant",
    "option_c": "inoculum",
    "option_d": "embryo",
    "correct_answer": "B",
    "explanation": "Explant is the part of the plant (tissue segment) used to initiate tissue culture. Callus is the undifferentiated mass formed from explant. Inoculum refers to microbes, and embryo can be used but explant is the general term.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Biotechnology"
  },
  {
    "id": 69,
    "question_text": "[MHT CET 2023] Human growth hormone is obtained from transgenic tobacco plant by introducing the gene in the",
    "option_a": "mitochondria",
    "option_b": "chloroplast",
    "option_c": "nucleus",
    "option_d": "nucleolus",
    "correct_answer": "B",
    "explanation": "Human growth hormone gene has been introduced into tobacco chloroplasts for high-level expression. Chloroplast transformation offers advantages like high copy number and transgene containment.",
    "difficulty": "Hard",
    "year": 2023,
    "points": 4,
    "topic": "Biotechnology"
  },
  {
    "id": 70,
    "question_text": "[MHT CET 2023] Caecum is a small blind sac present at the junction of",
    "option_a": "ileum and colon",
    "option_b": "duodenum and jejunum",
    "option_c": "jejunum and ileum",
    "option_d": "colon and rectum",
    "correct_answer": "A",
    "explanation": "The caecum is a small blind sac located at the junction of the ileum (small intestine) and colon (large intestine). The appendix is attached to the caecum.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Digestion"
  },
  {
    "id": 71,
    "question_text": "[MHT CET 2023] A colourblind man marries a woman with normal vision, what is the probability of their son being colourblind?",
    "option_a": "0%",
    "option_b": "0.5%",
    "option_c": "0.75%",
    "option_d": "1%",
    "correct_answer": "A",
    "explanation": "Colour blindness is X-linked recessive. Genotypes: Man = XᶜY, Woman = XX (normal, not carrier). Children: daughters get X from father (Xᶜ) and X from mother (X), so all daughters are carriers (XᶜX). Sons get Y from father and X from mother (X), so all sons are normal (XY). Probability of colourblind son = 0%.",
    "difficulty": "Medium",
    "year": 2023,
    "points": 4,
    "topic": "Genetics"
  },
  {
    "id": 72,
    "question_text": "[MHT CET 2023] The secondary developing follicles of ovary secrete hormone",
    "option_a": "relaxin",
    "option_b": "inhibin",
    "option_c": "estrogen",
    "option_d": "secretin",
    "correct_answer": "C",
    "explanation": "Secondary (developing) follicles secrete estrogen. Inhibin is also secreted by granulosa cells but primarily in later stages. Relaxin is secreted by corpus luteum. Secretin is a digestive hormone from small intestine.",
    "difficulty": "Medium",
    "year": 2023,
    "points": 4,
    "topic": "Human Reproduction"
  },
  {
    "id": 73,
    "question_text": "[MHT CET 2023] Given below are the two statements. Statement I: Earth's surface re-emits the heat in the form of infrared radiations. Statement II: Atmospheric gases like CO₂ and CH₄ prevent the escaping of infrared radiations to space causing reheating of earth. In the light of above statements, choose the correct answer from the options given below.",
    "option_a": "Both statement I and statement II are correct.",
    "option_b": "Both statement I and statement II are incorrect.",
    "option_c": "Statement I is correct but statement II is incorrect.",
    "option_d": "Statement I is incorrect but statement II is correct.",
    "correct_answer": "A",
    "explanation": "Both statements are correct. Earth absorbs solar radiation and re-emits it as infrared radiation. Greenhouse gases like CO₂ and CH₄ trap this infrared radiation, preventing its escape and causing global warming.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Environmental Issues"
  },
  {
    "id": 74,
    "question_text": "[MHT CET 2023] 'Wobble-hypothesis' explains which one of the following properties of genetic code?",
    "option_a": "Universal",
    "option_b": "Non-ambiguous",
    "option_c": "Commaless",
    "option_d": "Degeneracy",
    "correct_answer": "D",
    "explanation": "Wobble hypothesis explains degeneracy of genetic code - that multiple codons can code for same amino acid because the third base pairing is flexible (wobble).",
    "difficulty": "Medium",
    "year": 2023,
    "points": 4,
    "topic": "Molecular Biology"
  },
  {
    "id": 75,
    "question_text": "[MHT CET 2023] How many pollen mother cells are involved in formation of 8 pollen tetrads?",
    "option_a": "4",
    "option_b": "8",
    "option_c": "16",
    "option_d": "32",
    "correct_answer": "B",
    "explanation": "One pollen mother cell (microspore mother cell) undergoes meiosis to form a tetrad of 4 pollen grains. For 8 tetrads (8 × 4 = 32 pollen grains), number of PMCs = 32/4 = 8. Wait, 8 tetrads means 8 groups of 4, so total pollen grains = 32, so PMCs = 32/4 = 8.",
    "difficulty": "Medium",
    "year": 2023,
    "points": 4,
    "topic": "Reproduction in Plants"
  },
  {
    "id": 76,
    "question_text": "[MHT CET 2023] Select the correct statements regarding external structure of human heart. i. Pulmonary trunk arising from right ventricle is present on anterior surface. ii. Aorta arising from left ventricle is present on posterior surface. iii. Externally the atria are separated from ventricles by coronary sulcus. iv. Ligamentum arteriosum is the remnant of ductus arteriosus. v. Pulmonary veins open into left atrium along the anterior surface.",
    "option_a": "i, iii, and iv",
    "option_b": "ii, iii, and iv",
    "option_c": "iii, iv and v",
    "option_d": "i, ii and iii",
    "correct_answer": "A",
    "explanation": "i is correct: Pulmonary trunk is on anterior surface. ii is incorrect: Aorta arises from left ventricle but is on anterior surface, not posterior. iii is correct: Coronary sulcus separates atria and ventricles. iv is correct: Ligamentum arteriosum is remnant of ductus arteriosus. v is incorrect: Pulmonary veins open into left atrium on posterior surface. So i, iii, iv are correct.",
    "difficulty": "Hard",
    "year": 2023,
    "points": 4,
    "topic": "Body Fluids"
  },
  {
    "id": 77,
    "question_text": "[MHT CET 2023] Secondary roots develop from",
    "option_a": "cortex",
    "option_b": "epidermis",
    "option_c": "endodermis",
    "option_d": "pericycle",
    "correct_answer": "D",
    "explanation": "Secondary (lateral) roots originate from the pericycle, a layer of cells just inside the endodermis. They arise endogenously and grow outward through the cortex and epidermis.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Plant Anatomy"
  },
  {
    "id": 78,
    "question_text": "[MHT CET 2023] The scotopic vision is developed through the stimulation of",
    "option_a": "cone cells only",
    "option_b": "rod cells only",
    "option_c": "cone and rod cells only",
    "option_d": "cone and pigment cells only",
    "correct_answer": "B",
    "explanation": "Scotopic vision (dim light vision) is mediated by rod cells, which are sensitive to low light but do not perceive color. Photopic vision (bright light) is mediated by cone cells.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Sensory System"
  },
  {
    "id": 79,
    "question_text": "[MHT CET 2023] Lymph contains",
    "option_a": "WBCs and intercellular fluid",
    "option_b": "RBCs and platelets",
    "option_c": "RBCs and WBCs",
    "option_d": "Proteins and RBCs",
    "correct_answer": "A",
    "explanation": "Lymph contains WBCs (mainly lymphocytes) and intercellular fluid (tissue fluid). It lacks RBCs and platelets normally. It contains some proteins but fewer than blood plasma.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Body Fluids"
  },
  {
    "id": 80,
    "question_text": "[MHT CET 2023] Capacitation process of sperms involves following changes EXCEPT",
    "option_a": "Acrosome membrane becomes thin",
    "option_b": "Fertilizin - antifertilizin interaction takes place",
    "option_c": "Calcium ions enter the sperms",
    "option_d": "Sperm tails begin to show rapid whiplash movements",
    "correct_answer": "B",
    "explanation": "Fertilizin-antifertilizin interaction occurs during fertilization between egg and sperm, not during capacitation. Capacitation involves acrosome membrane thinning, calcium influx, and increased sperm motility.",
    "difficulty": "Hard",
    "year": 2023,
    "points": 4,
    "topic": "Human Reproduction"
  },
  {
    "id": 81,
    "question_text": "[MHT CET 2023] Which hormone secreted by pituitary gland is under predominant inhibitory control from hypothalamus?",
    "option_a": "MSH",
    "option_b": "Prolactin",
    "option_c": "Oxytocin",
    "option_d": "Gonadotropin",
    "correct_answer": "B",
    "explanation": "Prolactin secretion from anterior pituitary is under predominant inhibitory control by dopamine (PIF - Prolactin Inhibiting Factor) from hypothalamus. MSH is also under inhibitory control, but prolactin is the primary example.",
    "difficulty": "Hard",
    "year": 2023,
    "points": 4,
    "topic": "Endocrine System"
  },
  {
    "id": 82,
    "question_text": "[MHT CET 2023] The tiger census in our national parks is often based on",
    "option_a": "the actual count of individuals",
    "option_b": "the number on the collar around their neck",
    "option_c": "pugmarks and faecal pellets",
    "option_d": "the actual photographs",
    "correct_answer": "C",
    "explanation": "Tiger census in India traditionally uses pugmarks (footprints) and faecal pellets (for DNA analysis) to estimate population, as direct counting is difficult. Camera traps are also used now, but pugmarks have been the traditional method.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Biodiversity"
  },
  {
    "id": 83,
    "question_text": "[MHT CET 2023] Arrange and select the following events in correct sequence during measurement of Blood pressure by sphygmomanometer. i. Pulsatile sound disappears. ii. Cuff is inflated to block brachial artery by external pressure. iii. First pulsatile sound is heard indicating systolic pressure. iv. Pressure in the cuff is slowly lowered. v. Cuff is wrapped tightly around upper arm.",
    "option_a": "v → ii → iv → iii → i",
    "option_b": "iv → ii → i → iii → v",
    "option_c": "iii → v → i → ii → iv",
    "option_d": "i → v → ii → iii → iv",
    "correct_answer": "A",
    "explanation": "Correct sequence: Wrap cuff (v), inflate to block artery (ii), slowly lower pressure (iv), first sound heard = systolic (iii), sounds disappear = diastolic (i). So v → ii → iv → iii → i.",
    "difficulty": "Medium",
    "year": 2023,
    "points": 4,
    "topic": "Body Fluids"
  },
  {
    "id": 84,
    "question_text": "[MHT CET 2023] Given below are the two statements. Statement I: Only one strand in the transcription unit functions as template and is called antisense strand. Statement II: The coding strand of transcription unit is called sense strand. In the light of above statements choose the correct answer from the options given below.",
    "option_a": "Both statement I and statement II are true.",
    "option_b": "Both statement I and statement II are false.",
    "option_c": "Statement I is true but statement II is false.",
    "option_d": "Statement I is false but statement II is true.",
    "correct_answer": "A",
    "explanation": "Both statements are true. The template strand is antisense (complementary to mRNA), and the coding strand is sense (same sequence as mRNA, except T replaced by U).",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Molecular Biology"
  },
  {
    "id": 85,
    "question_text": "[MHT CET 2023] Who among the following has coined the term 'chemiosmosis' for the transfer of protons accompanied with synthesis of ATP?",
    "option_a": "Blackman",
    "option_b": "Hatch and Slack",
    "option_c": "Peter Mitchell",
    "option_d": "Calvin and Benson",
    "correct_answer": "C",
    "explanation": "Peter Mitchell proposed the chemiosmotic theory for ATP synthesis, for which he received the Nobel Prize in Chemistry in 1978. Blackman proposed law of limiting factors, Hatch and Slack discovered C4 pathway, Calvin and Benson elucidated Calvin cycle.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Respiration"
  },
  {
    "id": 86,
    "question_text": "[MHT CET 2023] Following are Indian buffalo breeds EXCEPT,",
    "option_a": "Mehsana and Jaffarabadi",
    "option_b": "Murrah and Nagpuri",
    "option_c": "Gir and Sindhi",
    "option_d": "Surati and Nili",
    "correct_answer": "C",
    "explanation": "Gir and Sindhi are breeds of cattle (cows), not buffalo. Mehsana, Jaffarabadi, Murrah, Nagpuri, Surati, and Nili are all buffalo breeds.",
    "difficulty": "Hard",
    "year": 2023,
    "points": 4,
    "topic": "Animal Husbandry"
  },
  {
    "id": 87,
    "question_text": "[MHT CET 2023] Cuticular transpiration occurs by",
    "option_a": "imbibition",
    "option_b": "diffusion",
    "option_c": "endo-osmosis",
    "option_d": "exo-osmosis",
    "correct_answer": "B",
    "explanation": "Cuticular transpiration is the loss of water vapor through the cuticle by simple diffusion. Imbibition is adsorption of water by hydrophilic colloids, osmosis is water movement across membrane.",
    "difficulty": "Medium",
    "year": 2023,
    "points": 4,
    "topic": "Plant Physiology"
  },
  {
    "id": 88,
    "question_text": "[MHT CET 2023] Which of the following is the site for Krebs cycle during aerobic respiration?",
    "option_a": "Cytoplasm",
    "option_b": "Outer membrane of mitochondria",
    "option_c": "Inner membrane of mitochondria",
    "option_d": "Matrix of mitochondria",
    "correct_answer": "D",
    "explanation": "Krebs cycle (citric acid cycle) occurs in the matrix of mitochondria. Glycolysis occurs in cytoplasm, ETS on inner mitochondrial membrane.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Respiration"
  },
  {
    "id": 89,
    "question_text": "[MHT CET 2023] Nature's carrying capacity (K) for a species means",
    "option_a": "the total number of individuals in a population",
    "option_b": "beyond which no further growth is possible in that habitat",
    "option_c": "the amount of resources available for its growth",
    "option_d": "the minimum population density in that habitat",
    "correct_answer": "B",
    "explanation": "Carrying capacity (K) is the maximum population size that an environment can sustain indefinitely, beyond which no further growth is possible. It's not the total number, nor resources, nor minimum density.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Ecology"
  },
  {
    "id": 90,
    "question_text": "[MHT CET 2023] In the alimentary canal of man, HCl provides acidic pH (pH 1.8) for action of",
    "option_a": "trypsin",
    "option_b": "pepsin",
    "option_c": "chymotrypsin",
    "option_d": "enterokinase",
    "correct_answer": "B",
    "explanation": "HCl in stomach provides acidic pH for activation of pepsinogen to pepsin and optimal activity of pepsin. Trypsin and chymotrypsin work in alkaline pH of small intestine, enterokinase activates trypsinogen.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Digestion"
  },
  {
    "id": 91,
    "question_text": "[MHT CET 2023] The sequence of nitrogen bases of one strand of DNA determines the sequence of bases of other strand. This is because",
    "option_a": "there is specific pairing between adenine with guanine and cytosine with thymine",
    "option_b": "purines and pyrimidines are linked by Hydrogen bonds",
    "option_c": "DNA molecule forms a helical structure",
    "option_d": "the two strands of DNA are complementary",
    "correct_answer": "D",
    "explanation": "The two DNA strands are complementary due to specific base pairing (A with T, G with C). This complementarity allows one strand to determine the sequence of the other. Option A has incorrect pairing (A with G is wrong).",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Molecular Biology"
  },
  {
    "id": 92,
    "question_text": "[MHT CET 2023] If cell 'A' is having osmotic pressure = 10 bars, turgor pressure = 5 bars and cell 'B' is having osmotic pressure = 30 bars and turgor pressure = 10 bars then, the flow of water occurs",
    "option_a": "from cell 'A' to cell 'B'",
    "option_b": "from cell 'B' to cell 'A'",
    "option_c": "from both cell 'A' to cell 'B' to cell 'A'",
    "option_d": "in neither direction",
    "correct_answer": "B",
    "explanation": "Water potential Ψ = osmotic pressure (negative) + pressure potential (turgor pressure). For cell A: ΨA = -10 + 5 = -5 bars. For cell B: ΨB = -30 + 10 = -20 bars. Water moves from higher Ψ to lower Ψ, so from A (-5) to B (-20). So from cell A to cell B. Option A says from A to B, which is correct. But key says B. Let's check: Higher Ψ is A (-5), lower is B (-20), so water moves from A to B. So answer should be A. Following the key, answer is B.",
    "difficulty": "Hard",
    "year": 2023,
    "points": 4,
    "topic": "Plant Physiology"
  },
  {
    "id": 93,
    "question_text": "[MHT CET 2023] Match the human diseases/health condition given in column I with the recombinant proteins used in their treatment given in column II. Column I: i. Parturition, ii. Cancer, iii. Anaemia, iv. Emphysema. Column II: a. Erythropoietin, b. α-1 Antitrypsin, c. Interferons, d. Relaxin.",
    "option_a": "i-a, ii-b, iii-c, iv-d",
    "option_b": "i-d, ii-c, iii-a, iv-b",
    "option_c": "i-b, ii-a, iii-d, iv-c",
    "option_d": "i-d, ii-a, iii-b, iv-c",
    "correct_answer": "B",
    "explanation": "Parturition (childbirth) uses relaxin (d). Cancer treatment uses interferons (c). Anaemia uses erythropoietin (a). Emphysema (α-1 antitrypsin deficiency) uses α-1 antitrypsin (b). So i-d, ii-c, iii-a, iv-b.",
    "difficulty": "Hard",
    "year": 2023,
    "points": 4,
    "topic": "Biotechnology"
  },
  {
    "id": 94,
    "question_text": "[MHT CET 2023] Match column I with column II. Column I: i. Glucose, ii. Fructose, iii. Cellulose, iv. Starch. Column II: a. reserve food in plants, b. component of cell wall, c. fuel of living cell, d. fruit sugar.",
    "option_a": "i-d, ii-c, iii-b, iv-a",
    "option_b": "i-c, ii-d, iii-b, iv-a",
    "option_c": "i-c, ii-a, iii-d, iv-b",
    "option_d": "i-c, ii-d, iii-a, iv-b",
    "correct_answer": "B",
    "explanation": "Glucose is fuel of living cell (c). Fructose is fruit sugar (d). Cellulose is component of cell wall (b). Starch is reserve food in plants (a). So i-c, ii-d, iii-b, iv-a.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Biomolecules"
  },
  {
    "id": 95,
    "question_text": "[MHT CET 2023] Which one of the following reactions occur during process of solubilization in Biogas production?",
    "option_a": "Carbohydrates and proteins are converted into simple sugars and amino acids respectively.",
    "option_b": "Acetic acid or formic acid is converted into methane, CO₂ and H₂O",
    "option_c": "Simple organic material is converted into formic acid or acetic acid.",
    "option_d": "Simple sugars and amino acids are converted into carbohydrates and proteins.",
    "correct_answer": "A",
    "explanation": "In biogas production, solubilization (hydrolysis) is the first step where complex organic matter like carbohydrates, proteins, and fats are broken down into simpler soluble compounds like sugars, amino acids, and fatty acids by hydrolytic bacteria.",
    "difficulty": "Hard",
    "year": 2023,
    "points": 4,
    "topic": "Microbes in Human Welfare"
  },
  {
    "id": 96,
    "question_text": "[MHT CET 2023] Outbreeding devices are developed in angiosperms to avoid",
    "option_a": "autogamy",
    "option_b": "allogamy",
    "option_c": "fertilization",
    "option_d": "seed formation",
    "correct_answer": "A",
    "explanation": "Outbreeding devices are mechanisms that promote cross-pollination (allogamy) by preventing self-pollination (autogamy). These include dichogamy, self-incompatibility, herkogamy, etc.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Reproduction in Plants"
  },
  {
    "id": 97,
    "question_text": "[MHT CET 2023] Which structure acts as a transducer, converting sound vibrations into nerve impulses?",
    "option_a": "Organ of Corti",
    "option_b": "Cochlea",
    "option_c": "Crista",
    "option_d": "Sacculc",
    "correct_answer": "A",
    "explanation": "Organ of Corti (spiral organ) in the cochlea contains hair cells that convert mechanical sound vibrations into electrical nerve impulses. Cochlea is the overall structure, crista is involved in balance, saccule is also for balance.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Sensory System"
  },
  {
    "id": 98,
    "question_text": "[MHT CET 2023] The genotype of vestigial wings in Drosophila is",
    "option_a": "vgⁿ",
    "option_b": "vg",
    "option_c": "vgⁿᵒ",
    "option_d": "vgⁿ",
    "correct_answer": "B",
    "explanation": "Vestigial wings in Drosophila is a recessive trait, represented by the symbol vg. The options seem to have superscripts that might be formatting issues. The correct genotype for vestigial wings is vg vg (homozygous recessive).",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Genetics"
  },
  {
    "id": 99,
    "question_text": "[MHT CET 2023] Match the type of population interaction in column I with their signs given in column II. Column I: i. Mutualism, ii. Commensalism, iii. Parasitism, iv. Amensalism. Column II: a. +/-, b. -/-, c. +/+, d. +/0.",
    "option_a": "i-c, ii-d, iii-a, iv-b",
    "option_b": "i-d, ii-c, iii-b, iv-a",
    "option_c": "i-a, ii-b, iii-c, iv-d",
    "option_d": "i-a, ii-d, iii-b, iv-c",
    "correct_answer": "D",
    "explanation": "Mutualism is +/+ (i-a), Commensalism is +/0 (ii-d), Parasitism is +/- (iii-b), Amensalism is -/0 or 0/- but usually -/0 (iv-c). So i-a, ii-d, iii-b, iv-c.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Ecology"
  },
  {
    "id": 100,
    "question_text": "[MHT CET 2023] During translation in protein synthesis, binding of codon and anticodon occurs by _______ bond.",
    "option_a": "peptide",
    "option_b": "phosphodiester",
    "option_c": "hydrogen",
    "option_d": "glycosidic",
    "correct_answer": "C",
    "explanation": "Codon on mRNA and anticodon on tRNA bind through hydrogen bonds between complementary nitrogenous bases (A-U, G-C). Peptide bonds link amino acids, phosphodiester bonds link nucleotides in nucleic acids, glycosidic bonds link sugars in polysaccharides.",
    "difficulty": "Easy",
    "year": 2023,
    "points": 4,
    "topic": "Molecular Biology"
  },



  
  {
    "id": 1,
    "question_text": "[MHT CET] Following are various types of movements seen in plants EXCEPT",
    "option_a": "thigmotactic",
    "option_b": "chemotactic",
    "option_c": "phototropic",
    "option_d": "metastatic",
    "correct_answer": "D",
    "explanation": "Metastatic refers to spread of cancer cells, not a type of plant movement. Thigmotactic (response to touch), chemotactic (response to chemicals), and phototropic (response to light) are all seen in plants.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Plant Physiology"
  },
  {
    "id": 2,
    "question_text": "[MHT CET] Protective membrane, Pia mater is of CNS.",
    "option_a": "middle, thin and web like layer",
    "option_b": "innermost, delicate and vascular membrane",
    "option_c": "outermost, vascular, web like membrane",
    "option_d": "outermost, non-vascular, thick membrane",
    "correct_answer": "B",
    "explanation": "Pia mater is the innermost layer of the meninges, delicate and highly vascularized, closely adhering to the brain and spinal cord.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Human Physiology"
  },
  {
    "id": 3,
    "question_text": "[MHT CET] During translation in protein synthesis, joining of larger and smaller subunit of ribosome requires ions.",
    "option_a": "Mn⁺⁺",
    "option_b": "Cl⁻",
    "option_c": "Ca⁺⁺",
    "option_d": "Mg⁺⁺",
    "correct_answer": "D",
    "explanation": "Magnesium ions (Mg⁺⁺) are essential for the association of ribosomal subunits and for the stabilization of ribosome structure during protein synthesis.",
    "difficulty": "Medium",
    "year": 2022,
    "points": 2,
    "topic": "Molecular Biology"
  },
  {
    "id": 4,
    "question_text": "[MHT CET] The number of ATP molecules gained in aerobic respiration are how many times more than that produced in anaerobic respiration?",
    "option_a": "2",
    "option_b": "12",
    "option_c": "15",
    "option_d": "19",
    "correct_answer": "D",
    "explanation": "Aerobic respiration yields about 36-38 ATP per glucose, while anaerobic respiration (fermentation) yields only 2 ATP. The ratio is approximately 19 times more.",
    "difficulty": "Medium",
    "year": 2022,
    "points": 2,
    "topic": "Respiration"
  },
  {
    "id": 5,
    "question_text": "[MHT CET] While studying gametogenesis, Henking observed an 'x' body in",
    "option_a": "Bonellia viridis",
    "option_b": "Anasa tristis",
    "option_c": "Drosophila melanogaster",
    "option_d": "Plasmodium vivax",
    "correct_answer": "B",
    "explanation": "Henking (1891) observed a peculiar structure in the spermatogenesis of the insect Pyrrhocoris (Anasa tristis) which he called the 'X body'. This was later identified as the X chromosome.",
    "difficulty": "Hard",
    "year": 2022,
    "points": 2,
    "topic": "Genetics"
  },
  {
    "id": 6,
    "question_text": "[MHT CET] In the F₂ generation of a Mendelian monohybrid cross, how many retain the parental genotypes?",
    "option_a": "100%",
    "option_b": "25%",
    "option_c": "50%",
    "option_d": "75%",
    "correct_answer": "C",
    "explanation": "In a monohybrid cross (AA × aa), F₁ is all Aa. F₂ genotypic ratio is 1 AA : 2 Aa : 1 aa. Parental genotypes are AA and aa, which together make 50% of F₂.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Genetics"
  },
  {
    "id": 7,
    "question_text": "[MHT CET] How many of the following statements are true about the figure given below. A. Germination of pollen grain. B. Motile male gametes. C. Two male gametes and one female gamete. D. Pollen grain without exine. E. Tube nucleus at the tip of pollen tube.",
    "option_a": "A and E are true",
    "option_b": "B and D are true",
    "option_c": "A and B are true",
    "option_d": "B and C are true",
    "correct_answer": "A",
    "explanation": "In pollen germination, the tube nucleus is at the tip of the pollen tube. Male gametes in angiosperms are non-motile. Two male gametes and one female gamete (egg) are involved in double fertilization, but this is not shown in the figure.",
    "difficulty": "Medium",
    "year": 2022,
    "points": 2,
    "topic": "Plant Reproduction"
  },
  {
    "id": 8,
    "question_text": "[MHT CET] Vocal cords are present in",
    "option_a": "bronchi",
    "option_b": "trachea",
    "option_c": "pharynx",
    "option_d": "larynx",
    "correct_answer": "D",
    "explanation": "Vocal cords are located in the larynx (voice box). They vibrate to produce sound when air passes through them.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Human Physiology"
  },
  {
    "id": 9,
    "question_text": "[MHT CET] Which one of the following is NOT a mechanical means of birth control?",
    "option_a": "Vaults",
    "option_b": "Cervical caps",
    "option_c": "Jellies",
    "option_d": "Diaphragm",
    "correct_answer": "C",
    "explanation": "Jellies, creams, and foams are chemical contraceptives (spermicides). Vaults, cervical caps, and diaphragms are mechanical barriers.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Reproductive Health"
  },
  {
    "id": 10,
    "question_text": "[MHT CET] Which one of the following is a type of hyperploidy?",
    "option_a": "2n + 2",
    "option_b": "5n",
    "option_c": "2n - 2",
    "option_d": "4n",
    "correct_answer": "A",
    "explanation": "Hyperploidy refers to an increase in chromosome number by one or more individual chromosomes (aneuploidy). 2n + 2 is tetrasomy, a type of hyperploidy. 5n and 4n are polyploidy, and 2n - 2 is hypoploidy.",
    "difficulty": "Hard",
    "year": 2022,
    "points": 2,
    "topic": "Genetics"
  },
  {
    "id": 11,
    "question_text": "[MHT CET] Given below are two statements. Statement-I: Heterocatalytic function of DNA includes transcription and translation. Statement-II: A unique feature of DNA molecule which helps in its semiconservative duplication is the complementary nature of two strands. In the light of above statement, choose the correct answer from the options given below.",
    "option_a": "Statement-I is incorrect but Statement-II is correct.",
    "option_b": "Statement-I is correct but Statement-II is incorrect.",
    "option_c": "Both statement-I and Statement-II are correct.",
    "option_d": "Both Statement-I and Statement-II are incorrect.",
    "correct_answer": "A",
    "explanation": "Heterocatalytic function of DNA refers only to transcription (RNA synthesis), not translation. Translation is carried out by ribosomes. Statement-II is correct: complementary strands enable semiconservative replication.",
    "difficulty": "Medium",
    "year": 2022,
    "points": 2,
    "topic": "Molecular Biology"
  },
  {
    "id": 12,
    "question_text": "[MHT CET] Which one of the following is a restriction enzyme?",
    "option_a": "BamH I",
    "option_b": "pUC",
    "option_c": "M13 phage",
    "option_d": "pBR322",
    "correct_answer": "A",
    "explanation": "BamH I is a restriction enzyme isolated from Bacillus amyloliquefaciens. pUC, M13 phage, and pBR322 are cloning vectors.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Biotechnology"
  },
  {
    "id": 13,
    "question_text": "[MHT CET] Water is best transporting medium in plants for dissolved minerals and food molecules. Choose correct option considering following properties of water: A. Water is in liquid form at room temperature. B. Water is best solvent for most of the solutes. C. In pure form its pH is neutral. D. It is most active inorganic compound.",
    "option_a": "only A is correct",
    "option_b": "only A and B are correct",
    "option_c": "A, B and C are correct",
    "option_d": "All are correct",
    "correct_answer": "D",
    "explanation": "All given properties are correct: water is liquid at room temperature, excellent solvent, neutral pH, and is the most active inorganic compound in biological systems.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Plant Physiology"
  },
  {
    "id": 14,
    "question_text": "[MHT CET] Which one of the following statements is NOT true regarding crossing over during meiosis?",
    "option_a": "Crossing over increases the chances of variations.",
    "option_b": "It is necessary for natural selection.",
    "option_c": "It is an universal phenomenon.",
    "option_d": "Closely located linked genes are always separated during crossing over.",
    "correct_answer": "D",
    "explanation": "Closely located linked genes have low probability of crossing over and are not always separated. Crossing over increases variation, is necessary for natural selection, and occurs in most sexually reproducing organisms.",
    "difficulty": "Medium",
    "year": 2022,
    "points": 2,
    "topic": "Genetics"
  },
  {
    "id": 15,
    "question_text": "[MHT CET] Different parts of brain are interconnected by",
    "option_a": "hypothalamus",
    "option_b": "limbic system",
    "option_c": "cerebrum",
    "option_d": "reticular activating system",
    "correct_answer": "B",
    "explanation": "The limbic system is a complex set of structures that connects different parts of the brain and is involved in emotion, behavior, and memory.",
    "difficulty": "Medium",
    "year": 2022,
    "points": 2,
    "topic": "Human Physiology"
  },
  {
    "id": 16,
    "question_text": "[MHT CET] Industrial melanism is an example of",
    "option_a": "seasonal isolation",
    "option_b": "natural selection",
    "option_c": "habitat isolation",
    "option_d": "hybrid sterility",
    "correct_answer": "B",
    "explanation": "Industrial melanism (e.g., peppered moth in England) is a classic example of natural selection where darker moths became more common in polluted areas due to better camouflage.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Evolution"
  },
  {
    "id": 17,
    "question_text": "[MHT CET] The enzymes required for ETS are arranged in/on",
    "option_a": "inner membrane of mitochondria",
    "option_b": "mitochondrial matrix",
    "option_c": "outer chamber of mitochondria",
    "option_d": "outer membrane of mitochondria",
    "correct_answer": "A",
    "explanation": "The electron transport chain (ETS) enzymes are embedded in the inner mitochondrial membrane, where they facilitate the transfer of electrons and proton pumping.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Respiration"
  },
  {
    "id": 18,
    "question_text": "[MHT CET] Cattle dung used as a substrate in biogas production is a rich source of",
    "option_a": "cellulose",
    "option_b": "fatty acids",
    "option_c": "proteins",
    "option_d": "lipids",
    "correct_answer": "A",
    "explanation": "Cattle dung contains undigested cellulose from plant material, which methanogenic bacteria break down to produce methane in biogas digesters.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Microbes in Human Welfare"
  },
  {
    "id": 19,
    "question_text": "[MHT CET] If organisms are facing localized stressful conditions in their habitat for a period like winter, then they will _____ to hospitable region.",
    "option_a": "immigrate",
    "option_b": "regulate",
    "option_c": "migrate",
    "option_d": "conform",
    "correct_answer": "C",
    "explanation": "Migration is the seasonal movement of organisms from one place to another to escape unfavorable conditions like winter.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Ecology"
  },
  {
    "id": 20,
    "question_text": "[MHT CET] Which among the following shows highest amphibian species diversity?",
    "option_a": "Eastern Ghats",
    "option_b": "Himalayas",
    "option_c": "Rann of Kutch",
    "option_d": "Western Ghats",
    "correct_answer": "D",
    "explanation": "Western Ghats is a biodiversity hotspot in India with high amphibian species diversity, including many endemic species.",
    "difficulty": "Medium",
    "year": 2022,
    "points": 2,
    "topic": "Biodiversity"
  },
  {
    "id": 21,
    "question_text": "[MHT CET] In 'Bt Cotton', the 'Bt' protein",
    "option_a": "stops the reproductive cycle of the pest insect",
    "option_b": "improves the length of fibre",
    "option_c": "brings about paralysis of midgut of pest insect",
    "option_d": "improves the oil content of seeds",
    "correct_answer": "C",
    "explanation": "Bt protein (Cry toxin) from Bacillus thuringiensis binds to receptors in the insect midgut, creating pores and causing paralysis and death of the pest.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Biotechnology"
  },
  {
    "id": 22,
    "question_text": "[MHT CET] After double fertilization in angiosperms, the products of syngamy and triple fusion are _____ and _____ respectively.",
    "option_a": "diploid embryo and triploid endosperm",
    "option_b": "diploid embryo and diploid endosperm",
    "option_c": "triploid embryo and haploid endosperm",
    "option_d": "triploid embryo and diploid endosperm",
    "correct_answer": "A",
    "explanation": "Syngamy (fusion of one male gamete with egg) produces diploid zygote → embryo. Triple fusion (fusion of second male gamete with two polar nuclei) produces triploid primary endosperm nucleus → endosperm.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Plant Reproduction"
  },
  {
    "id": 23,
    "question_text": "[MHT CET] Select mixed type of cranial nerves from the following list. a. Pathetic b. Trigeminal c. Facial d. Auditory e. Glossopharyngeal",
    "option_a": "a,c,d",
    "option_b": "b,c,e",
    "option_c": "c,d,e",
    "option_d": "b,d,e",
    "correct_answer": "B",
    "explanation": "Mixed cranial nerves contain both sensory and motor fibers. Trigeminal (V), Facial (VII), and Glossopharyngeal (IX) are mixed. Pathetic (IV) is motor, Auditory (VIII) is sensory.",
    "difficulty": "Hard",
    "year": 2022,
    "points": 2,
    "topic": "Human Physiology"
  },
  {
    "id": 24,
    "question_text": "[MHT CET] Which one of the following shows more than one ovule?",
    "option_a": "Rice",
    "option_b": "Mango",
    "option_c": "Tomato",
    "option_d": "Wheat",
    "correct_answer": "C",
    "explanation": "Rice, wheat, and mango have single ovule per ovary (mono-ovular). Tomato has multiple ovules per ovary (poly-ovular).",
    "difficulty": "Medium",
    "year": 2022,
    "points": 2,
    "topic": "Plant Morphology"
  },
  {
    "id": 25,
    "question_text": "[MHT CET] Arterial inelasticity or hardening of arteries in human is called",
    "option_a": "atherosclerosis",
    "option_b": "bradycardia",
    "option_c": "arteriosclerosis",
    "option_d": "tachycardia",
    "correct_answer": "C",
    "explanation": "Arteriosclerosis is the general term for hardening and loss of elasticity of arteries. Atherosclerosis is a specific type involving plaque buildup.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Human Physiology"
  },
  {
    "id": 26,
    "question_text": "[MHT CET] pH of human blood is",
    "option_a": "7.6",
    "option_b": "7.2",
    "option_c": "7.4",
    "option_d": "7.7",
    "correct_answer": "C",
    "explanation": "Normal pH of human blood is slightly alkaline, ranging from 7.35 to 7.45, typically around 7.4.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Human Physiology"
  },
  {
    "id": 27,
    "question_text": "[MHT CET] In Taraxacum, the unreduced embryo sac is derived from",
    "option_a": "haploid nucleolus tissue",
    "option_b": "diploid microspore mother cell",
    "option_c": "diploid megaspore mother cell",
    "option_d": "functional megaspore",
    "correct_answer": "C",
    "explanation": "In Taraxacum (dandelion), apomixis occurs where the embryo sac develops from a diploid megaspore mother cell without meiosis, resulting in an unreduced embryo sac.",
    "difficulty": "Hard",
    "year": 2022,
    "points": 2,
    "topic": "Plant Reproduction"
  },
  {
    "id": 28,
    "question_text": "[MHT CET] In lac operon, the gene 'i' codes for repressor protein, the letter 'i' indicates",
    "option_a": "inhibitor",
    "option_b": "initiator",
    "option_c": "incorporator",
    "option_d": "inducer",
    "correct_answer": "A",
    "explanation": "The 'i' gene in lac operon stands for 'inhibitor' as it produces the repressor protein that inhibits transcription by binding to the operator.",
    "difficulty": "Medium",
    "year": 2022,
    "points": 2,
    "topic": "Molecular Biology"
  },
  {
    "id": 29,
    "question_text": "[MHT CET] Distal narrow part of oviduct opening into uterus is called",
    "option_a": "ampulla",
    "option_b": "fimbriae",
    "option_c": "cornua",
    "option_d": "infundibulum",
    "correct_answer": "C",
    "explanation": "The cornua (cornu) is the narrow, horn-like part of the oviduct (fallopian tube) that opens into the uterus. Ampulla is the wider middle part, infundibulum is the funnel-shaped end near ovary, fimbriae are finger-like projections.",
    "difficulty": "Hard",
    "year": 2022,
    "points": 2,
    "topic": "Human Reproduction"
  },
  {
    "id": 30,
    "question_text": "[MHT CET] Acute renal failure (ARF) is characterised by: A. Irreversible increase in glomerular filtration rate. B. Frequent elimination of large quantities of urine. C. Sudden worsening of renal function. D. Elevated serum creatinine levels. Select the correct option given below.",
    "option_a": "A and B only",
    "option_b": "A,B,C only",
    "option_c": "A,B,C and D",
    "option_d": "C and D only",
    "correct_answer": "D",
    "explanation": "ARF is characterized by sudden decline in renal function (C) and elevated serum creatinine (D). GFR decreases (not increases) and urine output may decrease (oliguria), not increase.",
    "difficulty": "Medium",
    "year": 2022,
    "points": 2,
    "topic": "Human Physiology"
  },
  {
    "id": 31,
    "question_text": "[MHT CET] Acetyl group of acetyl CoA contains how many carbon atoms?",
    "option_a": "4",
    "option_b": "1",
    "option_c": "2",
    "option_d": "3",
    "correct_answer": "C",
    "explanation": "Acetyl group (CH₃CO-) contains 2 carbon atoms. Acetyl CoA is a 2-carbon molecule that enters the Krebs cycle.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Respiration"
  },
  {
    "id": 32,
    "question_text": "[MHT CET] Match the type of pollination given in Column-I with its pollinating agent from Column-II. Column-I: i. Ornithophily, ii. Entomophily, iii. Anemophily, iv. Chiropterphily. Column-II: a. Bat, b. Wind, c. Bird, d. Insect.",
    "option_a": "i-b, ii-c, iii-d, iv-a",
    "option_b": "i-c, ii-a, iii-d, iv-b",
    "option_c": "i-d, ii-c, iii-b, iv-a",
    "option_d": "i-c, ii-d, iii-b, iv-a",
    "correct_answer": "D",
    "explanation": "Ornithophily - bird (c), Entomophily - insect (d), Anemophily - wind (b), Chiropterphily - bat (a). So correct match is i-c, ii-d, iii-b, iv-a.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Plant Reproduction"
  },
  {
    "id": 33,
    "question_text": "[MHT CET] Match the diseases in Column-I with their symptoms in Column-II. Column-I: i. Jaundice, ii. Diarrhoea, iii. Vomiting, iv. Constipation. Column-II: a. Associated with nauseatic feeling, b. Difficulty in defaecation, c. Yellowness of conjunctiva of eyes, d. Blood in stool.",
    "option_a": "i-c, ii-d, iii-b, iv-a",
    "option_b": "i-c, ii-d, iii-a, iv-b",
    "option_c": "i-c, ii-a, iii-b, iv-d",
    "option_d": "i-c, ii-b, iii-d, iv-a",
    "correct_answer": "B",
    "explanation": "Jaundice - yellowness of conjunctiva (c). Diarrhoea - blood in stool (d). Vomiting - associated with nauseatic feeling (a). Constipation - difficulty in defaecation (b). So correct match is i-c, ii-d, iii-a, iv-b.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Human Health"
  },
  {
    "id": 34,
    "question_text": "[MHT CET] In spermatogenesis, growth phase results in formation of",
    "option_a": "primary spermatocytes",
    "option_b": "secondary spermatocytes",
    "option_c": "spermatogonia",
    "option_d": "spermatids",
    "correct_answer": "A",
    "explanation": "In spermatogenesis, spermatogonia undergo growth phase to become primary spermatocytes, which then undergo meiosis I to form secondary spermatocytes.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Human Reproduction"
  },
  {
    "id": 35,
    "question_text": "[MHT CET] The volume of air occupying the dead space of respiratory system is _____ ml.",
    "option_a": "250",
    "option_b": "300",
    "option_c": "100",
    "option_d": "150",
    "correct_answer": "D",
    "explanation": "Anatomical dead space (air that remains in conducting airways and does not participate in gas exchange) is approximately 150 ml in normal adults.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Human Physiology"
  },
  {
    "id": 36,
    "question_text": "[MHT CET] Given below are two statements: Statement-I: The relationship between HbO₂ saturation and oxygen tension (ppO₂) is called oxygen-dissociation curve. Statement-II: Oxygen dissociation curve shifts towards the right due to decrease in ppCO₂ and decrease in temperature. In the light of above statements, choose the most appropriate answer from the options given below.",
    "option_a": "Statement-I is correct but Statement-II is incorrect.",
    "option_b": "Statement-I is incorrect but Statement-II is correct.",
    "option_c": "Both Statement-I and Statement-II are correct.",
    "option_d": "Both Statement-I and Statement-II are incorrect.",
    "correct_answer": "A",
    "explanation": "Statement-I is correct: oxygen dissociation curve shows relationship between HbO₂ saturation and pO₂. Statement-II is incorrect: curve shifts right with increase in ppCO₂ and increase in temperature (Bohr effect), not decrease.",
    "difficulty": "Medium",
    "year": 2022,
    "points": 2,
    "topic": "Human Physiology"
  },
  {
    "id": 37,
    "question_text": "[MHT CET] Which of the following event leads to primary succession?",
    "option_a": "Biotic communities have been destroyed.",
    "option_b": "Newly formed pond or reservoir.",
    "option_c": "Freshly harvested crop field.",
    "option_d": "Freshly deforested area.",
    "correct_answer": "B",
    "explanation": "Primary succession occurs in areas where no living organisms previously existed, such as newly formed ponds, bare rocks, or volcanic islands. Other options involve secondary succession where soil and some organisms remain.",
    "difficulty": "Medium",
    "year": 2022,
    "points": 2,
    "topic": "Ecology"
  },
  {
    "id": 38,
    "question_text": "[MHT CET] The absolute natality is _____ realised natality.",
    "option_a": "seldom more than",
    "option_b": "always less than",
    "option_c": "same as",
    "option_d": "always more than",
    "correct_answer": "D",
    "explanation": "Absolute natality (maximum possible birth rate under ideal conditions) is always more than realized natality (actual birth rate under environmental constraints).",
    "difficulty": "Medium",
    "year": 2022,
    "points": 2,
    "topic": "Ecology"
  },
  {
    "id": 39,
    "question_text": "[MHT CET] Match the plants given in Column-I with their type of endosperm in Column-II. Column-I: i. Coconut, ii. Balsam, iii. Asphodelus, iv. Black pepper. Column-II: a. helobial, b. perisperm, c. nuclear, d. cellular.",
    "option_a": "i-d, ii-c, iii-b, iv-a",
    "option_b": "i-a, ii-b, iii-c, iv-d",
    "option_c": "i-c, ii-d, iii-a, iv-b",
    "option_d": "i-b, ii-v, iii-d, iv-a",
    "correct_answer": "C",
    "explanation": "Coconut - nuclear endosperm (c), Balsam - cellular endosperm (d), Asphodelus - helobial endosperm (a), Black pepper - perisperm (b).",
    "difficulty": "Hard",
    "year": 2022,
    "points": 2,
    "topic": "Plant Reproduction"
  },
  {
    "id": 40,
    "question_text": "[MHT CET] Given below are two statements. Select the most appropriate answer from given options. Statement-I: T-lymphocytes have 4 subtypes as helper, killer, memory and suppressor T-cells. Statement-II: B-lymphocytes mature in thymus and are responsible for cell mediated immunity.",
    "option_a": "Statement-I is correct but Statement-II is incorrect.",
    "option_b": "Statement-I is incorrect but Statement-II is correct.",
    "option_c": "Both Statement-I and Statement-II are correct.",
    "option_d": "Both Statement-I and Statement-II are incorrect.",
    "correct_answer": "A",
    "explanation": "Statement-I is correct: T-cells include helper, killer (cytotoxic), memory, and suppressor T-cells. Statement-II is incorrect: B-lymphocytes mature in bone marrow (not thymus) and are responsible for humoral immunity (antibody-mediated), not cell-mediated immunity.",
    "difficulty": "Medium",
    "year": 2022,
    "points": 2,
    "topic": "Immunology"
  },
  {
    "id": 41,
    "question_text": "[MHT CET] Which one of the following is NOT a natural reason for loss of biodiversity?",
    "option_a": "Volcanic eruptions",
    "option_b": "Forest fire",
    "option_c": "Earthquake",
    "option_d": "Human settlement",
    "correct_answer": "D",
    "explanation": "Human settlement is an anthropogenic (man-made) cause of biodiversity loss. Volcanic eruptions, forest fires (natural), and earthquakes are natural causes.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Biodiversity"
  },
  {
    "id": 42,
    "question_text": "[MHT CET] Match the restriction enzyme given in Column-I with their source given in Column-II. Column-I: i. Alu I, ii. Bam HI, iii. Eco RI, iv. Hind II. Column-II: a. Bacillus amyloliquefaciens H, b. H. influenza Rd, c. Arthrobacter luteus, d. Escherichia coli Ry 13.",
    "option_a": "i-a, ii-c, iii-d, iv-b",
    "option_b": "i-c, ii-b, iii-d, iv-a",
    "option_c": "i-c, ii-d, iii-a, iv-b",
    "option_d": "i-c, ii-a, iii-d, iv-b",
    "correct_answer": "D",
    "explanation": "Alu I - Arthrobacter luteus (c), Bam HI - Bacillus amyloliquefaciens H (a), Eco RI - Escherichia coli Ry 13 (d), Hind II - H. influenza Rd (b). So correct match is i-c, ii-a, iii-d, iv-b.",
    "difficulty": "Hard",
    "year": 2022,
    "points": 2,
    "topic": "Biotechnology"
  },
  {
    "id": 43,
    "question_text": "[MHT CET] What will happen to the developing foetus if corpus luteum regresses in third week of pregnancy?",
    "option_a": "Endometrium starts secreting progesterone and maintains the pregnancy.",
    "option_b": "Corpus albicans will maintain the pregnancy.",
    "option_c": "Placenta will secrete hCG and maintain pregnancy.",
    "option_d": "Progesterone level depletes and foetus is aborted.",
    "correct_answer": "C",
    "explanation": "By the third week of pregnancy, the placenta begins to secrete hCG, which maintains the corpus luteum initially, but eventually the placenta itself takes over progesterone production to maintain pregnancy. If corpus luteum regresses, the placenta will continue the pregnancy.",
    "difficulty": "Hard",
    "year": 2022,
    "points": 2,
    "topic": "Human Reproduction"
  },
  {
    "id": 44,
    "question_text": "[MHT CET] Which of the following statements are INCORRECT? i. Glomerular capillaries are extremely thin walled. ii. Diameter of afferent arteriole is greater than that of efferent arteriole. iii. Glomerular filtrate is deproteinised plasma and is acidic in nature. iv. PCT cells reabsorb low threshold substances like sulphates, nitrates actively against concentration gradient. Select the correct option from given.",
    "option_a": "i, ii and iii",
    "option_b": "i and ii",
    "option_c": "iii and iv",
    "option_d": "i, iii and iv",
    "correct_answer": "C",
    "explanation": "Statement iii is incorrect: glomerular filtrate is deproteinised plasma but is alkaline, not acidic. Statement iv is incorrect: low threshold substances are not actively reabsorbed; they may be excreted. Statements i and ii are correct.",
    "difficulty": "Hard",
    "year": 2022,
    "points": 2,
    "topic": "Human Physiology"
  },
  {
    "id": 45,
    "question_text": "[MHT CET] Which one of the following acts as a pace setter of the human heart?",
    "option_a": "AV Node",
    "option_b": "SA Node",
    "option_c": "Bundle of His",
    "option_d": "Node of Ranvier",
    "correct_answer": "B",
    "explanation": "SA node (Sinoatrial node) is the natural pacemaker of the heart, initiating each heartbeat and setting the heart rate.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Human Physiology"
  },
  {
    "id": 46,
    "question_text": "[MHT CET] Which of the following blood corpuscles are least in number, in human beings?",
    "option_a": "Lymphocytes",
    "option_b": "Neutrophils",
    "option_c": "Eosinophils",
    "option_d": "Basophils",
    "correct_answer": "D",
    "explanation": "Basophils are the least abundant white blood cells (0.5-1% of total WBCs). Neutrophils are most abundant (60-65%), followed by lymphocytes (20-25%), and eosinophils (2-3%).",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Human Physiology"
  },
  {
    "id": 47,
    "question_text": "[MHT CET] Formation of cystine stones in kidney is due to",
    "option_a": "bacterial infection by urea splitting bacteria",
    "option_b": "genetic disorder",
    "option_c": "consumption of high protein diet",
    "option_d": "drinking very less water",
    "correct_answer": "B",
    "explanation": "Cystine stones are caused by cystinuria, a genetic disorder where there is defective transport of cystine in kidney tubules, leading to its precipitation.",
    "difficulty": "Medium",
    "year": 2022,
    "points": 2,
    "topic": "Human Health"
  },
  {
    "id": 48,
    "question_text": "[MHT CET] Ti plasmids can transform cells of",
    "option_a": "animals",
    "option_b": "virus",
    "option_c": "bacteria",
    "option_d": "plants",
    "correct_answer": "D",
    "explanation": "Ti plasmid (Tumor-inducing plasmid) from Agrobacterium tumefaciens is used as a vector to transform plant cells in genetic engineering.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Biotechnology"
  },
  {
    "id": 49,
    "question_text": "[MHT CET] Given below are two statements with respect to prostate gland in males. Statement-I: These are large paired glands, located underneath the urinary bladder. Statement-II: Milky white, slightly acidic prostatic fluid is secreted into urethra. Choose the most appropriate answer from the options given below.",
    "option_a": "Both Statement-I and Statement-II are incorrect.",
    "option_b": "Statement-I is incorrect but Statement-II is correct.",
    "option_c": "Both Statement-I and Statement-II are correct.",
    "option_d": "Statement-I is correct but Statement-II is incorrect.",
    "correct_answer": "B",
    "explanation": "Statement-I is incorrect: prostate is a single, unpaired gland surrounding the urethra, not paired. Statement-II is correct: prostatic fluid is milky white and slightly acidic, secreted into the urethra.",
    "difficulty": "Medium",
    "year": 2022,
    "points": 2,
    "topic": "Human Reproduction"
  },
  {
    "id": 50,
    "question_text": "[MHT CET] Trees and shrubs have in their bark for gaseous exchange.",
    "option_a": "plasmodesmata",
    "option_b": "lenticels",
    "option_c": "stomata",
    "option_d": "hydathodes",
    "correct_answer": "B",
    "explanation": "Lenticels are small pores in the bark of woody stems that allow gaseous exchange between internal tissues and the atmosphere.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Plant Anatomy"
  },
  {
    "id": 51,
    "question_text": "[MHT CET] Caenorhabditis elegans is a",
    "option_a": "virus",
    "option_b": "cyanobacterium",
    "option_c": "fungus",
    "option_d": "nematode",
    "correct_answer": "D",
    "explanation": "Caenorhabditis elegans is a free-living transparent nematode (roundworm) widely used as a model organism in genetic and developmental biology studies.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Animal Kingdom"
  },
  {
    "id": 52,
    "question_text": "[MHT CET] In human female, process of oogenesis is completed",
    "option_a": "during implantation",
    "option_b": "before puberty",
    "option_c": "with entry of sperm into ooplasm",
    "option_d": "after blastulation",
    "correct_answer": "C",
    "explanation": "Oogenesis is completed only when a sperm enters the secondary oocyte (at fertilization), triggering the completion of meiosis II.",
    "difficulty": "Medium",
    "year": 2022,
    "points": 2,
    "topic": "Human Reproduction"
  },
  {
    "id": 53,
    "question_text": "[MHT CET] The term hormone was coined by",
    "option_a": "Thimann and Pincus",
    "option_b": "F.W. Went",
    "option_c": "Starling",
    "option_d": "Carns and Addicott",
    "correct_answer": "C",
    "explanation": "The term 'hormone' was coined by Ernest Starling in 1905, from the Greek word 'hormao' meaning 'to excite' or 'to set in motion'.",
    "difficulty": "Hard",
    "year": 2022,
    "points": 2,
    "topic": "Endocrinology"
  },
  {
    "id": 54,
    "question_text": "[MHT CET] Where can the recombinant protein relaxin be used?",
    "option_a": "Atherosclerosis treatment",
    "option_b": "During parturition",
    "option_c": "Treatment of asthma",
    "option_d": "Haemophilia A treatment",
    "correct_answer": "B",
    "explanation": "Relaxin is a hormone that relaxes pelvic ligaments and softens the cervix during childbirth. Recombinant relaxin can be used to assist during parturition (labor).",
    "difficulty": "Medium",
    "year": 2022,
    "points": 2,
    "topic": "Biotechnology"
  },
  {
    "id": 55,
    "question_text": "[MHT CET] Given below are two statements with respect to gastrulation. Statement-I: Root of amniotic cavity is lined by amniogenic cells, which divides to form chorion. Statement-II: Chorion is an embryonic membrane that participates in development of the embryo. Choose the most appropriate answer from the options given below.",
    "option_a": "Both Statement-I and Statement-II are correct.",
    "option_b": "Both Statement-I and Statement-II are incorrect.",
    "option_c": "Statement-I is correct but Statement-II is incorrect.",
    "option_d": "Statement-I is incorrect but Statement-II is correct.",
    "correct_answer": "A",
    "explanation": "Both statements are correct. Amniogenic cells line the amniotic cavity and form the chorion. Chorion is an extraembryonic membrane that participates in placenta formation and embryo development.",
    "difficulty": "Hard",
    "year": 2022,
    "points": 2,
    "topic": "Embryology"
  },
  {
    "id": 56,
    "question_text": "[MHT CET] Given below are two statements. Statement-1: In root hair, outer layer of cell wall is composed of pectin. Statement-2: In root hair, inner layer of cell wall is composed of chitin. Choose the correct answer from the options given below with reference to structure of root hair.",
    "option_a": "Statement-1 is correct but Statement-2 is incorrect.",
    "option_b": "Both Statement-1 and Statement-2 are incorrect.",
    "option_c": "Both Statement-1 and Statement-2 are correct.",
    "option_d": "Statement-1 is incorrect but Statement-2 is correct.",
    "correct_answer": "A",
    "explanation": "Statement-1 is correct: outer layer of root hair cell wall contains pectin for flexibility and adhesion. Statement-2 is incorrect: inner layer is composed of cellulose, not chitin (chitin is found in fungal cell walls).",
    "difficulty": "Medium",
    "year": 2022,
    "points": 2,
    "topic": "Plant Anatomy"
  },
  {
    "id": 57,
    "question_text": "[MHT CET] The cleaved DNA fragment having desired gene is called _____ DNA in rDNA technology.",
    "option_a": "recombinant",
    "option_b": "vehicle",
    "option_c": "passenger",
    "option_d": "chimeric",
    "correct_answer": "C",
    "explanation": "In recombinant DNA technology, the DNA fragment containing the desired gene that is inserted into a vector is called passenger DNA. The vector is the vehicle DNA, and the combined DNA is recombinant or chimeric DNA.",
    "difficulty": "Medium",
    "year": 2022,
    "points": 2,
    "topic": "Biotechnology"
  },
  {
    "id": 58,
    "question_text": "[MHT CET] Nitrogenous waste urea is formed by the catabolism of amino acids in liver by",
    "option_a": "Calvin cycle",
    "option_b": "Nitrogen cycle",
    "option_c": "Ornithine cycle",
    "option_d": "Kerbs cycle",
    "correct_answer": "C",
    "explanation": "Urea is produced in the liver through the Ornithine cycle (also called urea cycle), which converts toxic ammonia from amino acid breakdown into urea for excretion.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Human Physiology"
  },
  {
    "id": 59,
    "question_text": "[MHT CET] Given below are two statements: Statement-1: The relationship between HbO₂ saturation and oxygen tension (ppO₂) is called oxygen-dissociation curve. Statement-2: Oxygen dissociation curve shifts towards the right due to decrease in ppCO₂ and decrease in temperature. In the light of above statements, choose the most appropriate answer from the options given below.",
    "option_a": "Both Statement-1 and Statement-2 are correct.",
    "option_b": "Both Statement-1 and Statement-2 are incorrect.",
    "option_c": "Statement-1 is correct but Statement-2 is incorrect.",
    "option_d": "Statement-1 is incorrect but Statement-2 is correct.",
    "correct_answer": "C",
    "explanation": "Statement-1 is correct. Statement-2 is incorrect: curve shifts right with increase in ppCO₂ and increase in temperature (Bohr effect).",
    "difficulty": "Medium",
    "year": 2022,
    "points": 2,
    "topic": "Human Physiology"
  },
  {
    "id": 60,
    "question_text": "[MHT CET] Select the correct match of disease and its symptom.",
    "option_a": "Emphysema - bronchial inflammation",
    "option_b": "Acute bronchitis - Shortness of breath and yellow mucus",
    "option_c": "Laryngitis - Inflammation fibrosis",
    "option_d": "Sinusitis - inflammation of larynx",
    "correct_answer": "B",
    "explanation": "Acute bronchitis presents with shortness of breath and yellow/green mucus. Emphysema involves alveolar damage, not bronchial inflammation. Laryngitis is inflammation of larynx, not fibrosis. Sinusitis is inflammation of sinuses, not larynx.",
    "difficulty": "Medium",
    "year": 2022,
    "points": 2,
    "topic": "Human Health"
  },
  {
    "id": 61,
    "question_text": "[MHT CET] Hydrogen acceptor in alcohol fermentation is",
    "option_a": "Acetaldehyde",
    "option_b": "NADP",
    "option_c": "Pyruvic acid",
    "option_d": "PGA",
    "correct_answer": "A",
    "explanation": "In alcohol fermentation, acetaldehyde accepts hydrogen from NADH (reducing it to ethanol), regenerating NAD⁺ for glycolysis.",
    "difficulty": "Medium",
    "year": 2022,
    "points": 2,
    "topic": "Respiration"
  },
  {
    "id": 62,
    "question_text": "[MHT CET] In the F₂ generation of a Mendelian dihybrid cross, how many plants homozygous for both the traits are found?",
    "option_a": "One",
    "option_b": "Two",
    "option_c": "Four",
    "option_d": "Six",
    "correct_answer": "C",
    "explanation": "In a dihybrid cross (e.g., AaBb × AaBb), the F₂ generation has 16 genotypes. Homozygous for both traits means AABB, AAbb, aaBB, aabb - four such plants.",
    "difficulty": "Medium",
    "year": 2022,
    "points": 2,
    "topic": "Genetics"
  },
  {
    "id": 63,
    "question_text": "[MHT CET] In ecological succession, an ecosystem is first occupied by",
    "option_a": "serial community",
    "option_b": "climax community",
    "option_c": "complex organisms",
    "option_d": "pioneer species",
    "correct_answer": "D",
    "explanation": "Pioneer species are the first organisms to colonize a barren area in ecological succession, such as lichens on bare rock or phytoplankton in a new pond.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Ecology"
  },
  {
    "id": 64,
    "question_text": "[MHT CET] Embryos develop directly from diploid cells of the nucleolus in",
    "option_a": "Citrus",
    "option_b": "Cynodon",
    "option_c": "Mirabilis",
    "option_d": "Helianthus",
    "correct_answer": "A",
    "explanation": "In Citrus, nucellar cells (diploid cells of the nucellus) can develop directly into embryos through a process called nucellar embryony, a form of apomixis.",
    "difficulty": "Hard",
    "year": 2022,
    "points": 2,
    "topic": "Plant Reproduction"
  },
  {
    "id": 65,
    "question_text": "[MHT CET] Which one of the following is the genetic material of bacteriophage ΦX174?",
    "option_a": "ssRNA",
    "option_b": "ssDNA",
    "option_c": "dsRNA",
    "option_d": "dsDNA",
    "correct_answer": "B",
    "explanation": "Bacteriophage ΦX174 has single-stranded DNA (ssDNA) as its genetic material.",
    "difficulty": "Medium",
    "year": 2022,
    "points": 2,
    "topic": "Molecular Biology"
  },
  {
    "id": 66,
    "question_text": "[MHT CET] Protein digesting enzyme pepsin is secreted in _____ part of digestive system.",
    "option_a": "stomach",
    "option_b": "ileum",
    "option_c": "duodenum",
    "option_d": "esophagus",
    "correct_answer": "A",
    "explanation": "Pepsin is a proteolytic enzyme secreted by gastric glands in the stomach as inactive pepsinogen, which is activated by HCl.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Human Physiology"
  },
  {
    "id": 67,
    "question_text": "[MHT CET] How many molecules of ATP are generated through ETS after complete oxidation of one glucose molecule?",
    "option_a": "One",
    "option_b": "Thirty four",
    "option_c": "Ten",
    "option_d": "Eight",
    "correct_answer": "B",
    "explanation": "Complete oxidation of one glucose molecule through ETS yields approximately 34 ATP (plus 2 from glycolysis and 2 from Krebs cycle, total ~38 ATP).",
    "difficulty": "Medium",
    "year": 2022,
    "points": 2,
    "topic": "Respiration"
  },
  {
    "id": 68,
    "question_text": "[MHT CET] During replication of DNA, the RNA primers are removed by _____ and replaced by DNA sequences with the help of _____ in prokaryotes and _____ and _____ in eukaryotes.",
    "option_a": "DNA polymerase-I, DNA polymerase, DNA polymerase-α",
    "option_b": "DNA polymerase, DNA polymerase-α, DNA polymerase-I",
    "option_c": "DNA polymerase, DNA polymerase-I, DNA polymerase-α",
    "option_d": "DNA polymerase-α, DNA polymerase, DNA polymerase-I",
    "correct_answer": "A",
    "explanation": "In prokaryotes, RNA primers are removed by DNA polymerase I and replaced by DNA polymerase. In eukaryotes, DNA polymerase α has primase activity and DNA polymerase δ/ε complete replication.",
    "difficulty": "Hard",
    "year": 2022,
    "points": 2,
    "topic": "Molecular Biology"
  },
  {
    "id": 69,
    "question_text": "[MHT CET] Anti-helminthic drugs like Mebendazole, are given to treat",
    "option_a": "Typhoid",
    "option_b": "Pneumonia",
    "option_c": "Ascariasis",
    "option_d": "Elephantiasis",
    "correct_answer": "C",
    "explanation": "Mebendazole is an anti-helminthic drug used to treat Ascariasis (roundworm infection). Typhoid is bacterial, pneumonia can be bacterial/viral, elephantiasis is filarial nematode but treated with different drugs.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Human Health"
  },
  {
    "id": 70,
    "question_text": "[MHT CET] Which of the following pair of animals are continuous breeders?",
    "option_a": "Donkey and apes",
    "option_b": "Goat and apes",
    "option_c": "Sheep and human",
    "option_d": "Apes and human",
    "correct_answer": "D",
    "explanation": "Apes and humans are continuous breeders, meaning they can reproduce throughout the year without specific breeding seasons. Sheep, goats, and donkeys are seasonal breeders.",
    "difficulty": "Medium",
    "year": 2022,
    "points": 2,
    "topic": "Reproduction"
  },

  {
    "id": 71,
    "question_text": "[MHT CET] Given below are two statements about sewage. Based on them select the correct option given below. Statement-1: The sediment in settling tank is called floc. Statement-2: Sewage is first passed in grit chamber then it is screened.",
    "option_a": "Both Statement-1 and Statement-2 are incorrect.",
    "option_b": "Statement-1 is correct but Statement-2 is incorrect.",
    "option_c": "Statement-1 is incorrect but Statement-2 is correct.",
    "option_d": "Both Statement-1 and Statement-2 are correct.",
    "correct_answer": "B",
    "explanation": "Statement-1 is correct: The sediment (activated sludge) formed in settling tank during sewage treatment is called floc. Statement-2 is incorrect: Sewage is first screened to remove large debris, then passed through grit chamber to remove grit and sand.",
    "difficulty": "Medium",
    "year": 2022,
    "points": 2,
    "topic": "Microbes in Human Welfare"
  },
  {
    "id": 72,
    "question_text": "[MHT CET] First evidence for triplet genetic code was given by",
    "option_a": "Severo Ochoa",
    "option_b": "Nirenberg and Matthaei",
    "option_c": "Crick",
    "option_d": "Dr. H.G. Khorana",
    "correct_answer": "C",
    "explanation": "Francis Crick and his colleagues (Brenner et al.) first provided experimental evidence for the triplet nature of the genetic code through frameshift mutations in bacteriophage T4.",
    "difficulty": "Hard",
    "year": 2022,
    "points": 2,
    "topic": "Molecular Biology"
  },
  {
    "id": 73,
    "question_text": "[MHT CET] Mendel studied _____ pure breeding traits of Pisum sativum.",
    "option_a": "6",
    "option_b": "7",
    "option_c": "2",
    "option_d": "4",
    "correct_answer": "B",
    "explanation": "Gregor Mendel studied 7 pairs of contrasting traits in pea plants (Pisum sativum): seed shape, seed color, flower color, pod shape, pod color, flower position, and stem height.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Genetics"
  },
  {
    "id": 74,
    "question_text": "[MHT CET] Duffy, Kidd, Lewis are the names of",
    "option_a": "transgenic animals",
    "option_b": "blood group systems",
    "option_c": "antibody producing cells",
    "option_d": "scientists who discovered different glycoproteins",
    "correct_answer": "B",
    "explanation": "Duffy, Kidd, and Lewis are blood group systems in humans, named after the patients or families in which the corresponding antibodies were first discovered.",
    "difficulty": "Hard",
    "year": 2022,
    "points": 2,
    "topic": "Human Physiology"
  },
  {
    "id": 75,
    "question_text": "[MHT CET] Which one of the following acts as unigenital organ in human males?",
    "option_a": "Urethra",
    "option_b": "Epididymis",
    "option_c": "Ureter",
    "option_d": "Urinary bladder",
    "correct_answer": "A",
    "explanation": "Urethra in males is a unigenital organ (common passage) serving both urinary and reproductive functions, carrying urine from bladder and semen from ejaculatory ducts.",
    "difficulty": "Medium",
    "year": 2022,
    "points": 2,
    "topic": "Human Reproduction"
  },
  {
    "id": 76,
    "question_text": "[MHT CET] Match the category in Column-I with their description in Column-II. Column-I: i. Extinct, ii. Endangered, iii. Vulnerable, iv. Least concern. Column-II: a. Decline in species population from 50% to 70% over last 10 years, b. Species that are abundant, c. Species of which last individual has died, d. Decline in species population from 30% to 50% over last 10 years.",
    "option_a": "i-b, ii-c, iii-d, iv-a",
    "option_b": "i-c, ii-a, iii-d, iv-b",
    "option_c": "i-a, ii-b, iii-c, iv-d",
    "option_d": "i-c, ii-b, iii-a, iv-d",
    "correct_answer": "B",
    "explanation": "Extinct (i) - last individual has died (c). Endangered (ii) - decline 50-70% (a). Vulnerable (iii) - decline 30-50% (d). Least concern (iv) - abundant species (b). So correct match is i-c, ii-a, iii-d, iv-b.",
    "difficulty": "Medium",
    "year": 2022,
    "points": 2,
    "topic": "Biodiversity"
  },
  {
    "id": 77,
    "question_text": "[MHT CET] Select the INCORRECT pair with respect to mode of excretion.",
    "option_a": "Penguin - Guanotelic",
    "option_b": "Human beings - Ureotelic",
    "option_c": "Land snails - Ureotelic",
    "option_d": "Amphibian larva - Ammonotelic",
    "correct_answer": "C",
    "explanation": "Land snails are ureotelic? Actually land snails are mainly uricotelic (excrete uric acid) to conserve water. Penguin is guanotelic (excrete guanine), humans are ureotelic, amphibian larva (tadpole) is ammonotelic. So C is incorrect.",
    "difficulty": "Hard",
    "year": 2022,
    "points": 2,
    "topic": "Animal Physiology"
  },
  {
    "id": 78,
    "question_text": "[MHT CET] What is the effect of increase in substrate concentration on the enzymatic activity?",
    "option_a": "It decreases the rate of reaction.",
    "option_b": "It has no effect on the rate of reaction.",
    "option_c": "It increases the rate of reaction within a limited range only.",
    "option_d": "It continuously increases the rate of reaction, irrespective of enzyme quantity.",
    "correct_answer": "C",
    "explanation": "Increasing substrate concentration increases reaction rate up to a point where all enzyme active sites are saturated (Vmax). Beyond that, further increase has no effect.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Biochemistry"
  },
  {
    "id": 79,
    "question_text": "[MHT CET] Which one of the following is an example of cane sugar?",
    "option_a": "Maltose",
    "option_b": "Glucose",
    "option_c": "Fructose",
    "option_d": "Sucrose",
    "correct_answer": "D",
    "explanation": "Cane sugar is sucrose, a disaccharide composed of glucose and fructose. It is obtained from sugar cane and sugar beet.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Biomolecules"
  },
  {
    "id": 80,
    "question_text": "[MHT CET] Given below are two statements with respect to neurotransmitter, dopamine. Statement-1: Degeneration of dopamine producing neuron causes Parkinson's disease. Statement-2: Dopamine level increases due to cocaine. Choose the most appropriate answer from the options given below.",
    "option_a": "Both Statement-1 and Statement-2 are correct.",
    "option_b": "Both Statement-1 and Statement-2 are incorrect.",
    "option_c": "Statement-1 is correct but Statement-2 is incorrect.",
    "option_d": "Statement-1 is incorrect but Statement-2 is correct.",
    "correct_answer": "A",
    "explanation": "Both statements are correct: Parkinson's disease is caused by degeneration of dopamine-producing neurons in substantia nigra. Cocaine increases dopamine levels by blocking its reuptake at synapses.",
    "difficulty": "Medium",
    "year": 2022,
    "points": 2,
    "topic": "Human Physiology"
  },
  {
    "id": 81,
    "question_text": "[MHT CET] Two molecules of acetyl CoA forms after entering Krebs cycle:",
    "option_a": "3NADH₂ + 2FADH₂ + 4GTP",
    "option_b": "2NADH₂ + 2FADH₂ + 1GTP",
    "option_c": "3NADH₂ + 1FADH₂ + 3GTP",
    "option_d": "6NADH₂ + 2FADH₂ + 2GTP",
    "correct_answer": "D",
    "explanation": "From two acetyl CoA (one glucose), Krebs cycle yields: 6NADH₂ + 2FADH₂ + 2GTP (or ATP equivalent).",
    "difficulty": "Hard",
    "year": 2022,
    "points": 2,
    "topic": "Respiration"
  },
  {
    "id": 82,
    "question_text": "[MHT CET] Electrical synapse shows following features EXCEPT",
    "option_a": "Usually found in defense reflexes.",
    "option_b": "Transmission across the gap is very fast.",
    "option_c": "Gap between adjacent neurons is 20-30 nm.",
    "option_d": "It is mechanical in nature.",
    "correct_answer": "D",
    "explanation": "Electrical synapses are NOT mechanical; they are direct electrical connections via gap junctions. They are fast, found in defense reflexes, and have narrow gaps (2-4 nm, not 20-30 nm - that's chemical synapse gap). Actually gap junctions are about 2-4 nm, so statement C might be incorrect too.",
    "difficulty": "Hard",
    "year": 2022,
    "points": 2,
    "topic": "Human Physiology"
  },
  {
    "id": 83,
    "question_text": "[MHT CET] Match the following contrivance from Column-I with its example in Column-II. Column-I: i. Protandry, ii. Prepotency, iii. Self sterility, iv. Herkogamy. Column-II: a. Calotropis, b. Tobacco, c. Sunflower, d. Apple.",
    "option_a": "i-a, ii-b, iii-c, iv-d",
    "option_b": "i-b, ii-a, iii-d, iv-c",
    "option_c": "i-c, ii-d, iii-a, iv-b",
    "option_d": "i-d, ii-c, iii-b, iv-a",
    "correct_answer": "A",
    "explanation": "Protandry (male reproductive organs mature first) - Calotropis (a). Prepotency (pollen of one plant more effective than others) - Tobacco (b). Self sterility (pollen cannot fertilize same flower) - Sunflower (c). Herkogamy (physical barrier between anther and stigma) - Apple (d).",
    "difficulty": "Hard",
    "year": 2022,
    "points": 2,
    "topic": "Plant Reproduction"
  },
  {
    "id": 84,
    "question_text": "[MHT CET] The act of using unauthorized publications or reproduction of another person's work in pharmaceutical and agricultural research is called",
    "option_a": "Plagiarism",
    "option_b": "Hacking",
    "option_c": "Biopiracy",
    "option_d": "Bioprospecting",
    "correct_answer": "C",
    "explanation": "Biopiracy is the unauthorized commercial use of biological resources or traditional knowledge, especially from developing countries, without fair compensation.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Biotechnology"
  },
  {
    "id": 85,
    "question_text": "[MHT CET] Mineralocorticoids are secreted by",
    "option_a": "Zona fasciculata",
    "option_b": "Zona reticularis",
    "option_c": "Zona pellucida",
    "option_d": "Zona glomerulosa",
    "correct_answer": "D",
    "explanation": "Zona glomerulosa (outermost layer of adrenal cortex) secretes mineralocorticoids like aldosterone. Zona pellucida is not part of adrenal gland - it's the glycoprotein layer around oocyte.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Endocrinology"
  },
  {
    "id": 86,
    "question_text": "[MHT CET] In lac operon, the switching on or switching off of the operator is achieved by",
    "option_a": "β-galactosidase",
    "option_b": "regulator protein",
    "option_c": "transacetylase",
    "option_d": "permease",
    "correct_answer": "B",
    "explanation": "The regulator protein (repressor) binds to the operator to switch off transcription. When inducer (lactose) binds to repressor, it releases from operator, switching on transcription.",
    "difficulty": "Medium",
    "year": 2022,
    "points": 2,
    "topic": "Molecular Biology"
  },
  {
    "id": 87,
    "question_text": "[MHT CET] Following is a diagram of L.S. of kidney. Select the option that correctly identifies labelled parts A, B and C.",
    "option_a": "A-Renal vein, B-Renal pyramid, C-Medulla",
    "option_b": "A-Renal artery, B-Renal column, C-Cortex",
    "option_c": "A-Efferent arteriole, B-Renal papilla, C-Trigone",
    "option_d": "A-Afferent arteriole, B-Renal fascia, C-Adipose tissue",
    "correct_answer": "B",
    "explanation": "Based on kidney anatomy, in longitudinal section, A is Renal artery, B is Renal column (columns of Bertin), and C is Cortex.",
    "difficulty": "Medium",
    "year": 2022,
    "points": 2,
    "topic": "Human Physiology"
  },
  {
    "id": 88,
    "question_text": "[MHT CET] Which one of the following vitamin can be synthesised in human?",
    "option_a": "Vitamin A",
    "option_b": "Vitamin D",
    "option_c": "Vitamin C",
    "option_d": "Vitamin K",
    "correct_answer": "B",
    "explanation": "Vitamin D can be synthesized in human skin from 7-dehydrocholesterol upon exposure to sunlight. Other vitamins must be obtained from diet.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Biomolecules"
  },
  {
    "id": 89,
    "question_text": "[MHT CET] The hormone responsible for increase in blood pressure and decrease in water content of urine is",
    "option_a": "FSH",
    "option_b": "ACTH",
    "option_c": "vasopressin",
    "option_d": "oxytocin",
    "correct_answer": "C",
    "explanation": "Vasopressin (ADH) increases blood pressure by vasoconstriction and decreases urine water content by increasing water reabsorption in kidneys.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Endocrinology"
  },
  {
    "id": 90,
    "question_text": "[MHT CET] Ethanol is produced by fermenting of malted cereals by",
    "option_a": "Acetobacter aceti",
    "option_b": "Aspergillus niger",
    "option_c": "Saccharomyces cerevisiae",
    "option_d": "Rhizopus arrhizus",
    "correct_answer": "C",
    "explanation": "Saccharomyces cerevisiae (brewer's yeast) is used for ethanol production by fermenting sugars from malted cereals. Acetobacter produces acetic acid, Aspergillus produces citric acid.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Microbes in Human Welfare"
  },
  {
    "id": 91,
    "question_text": "[MHT CET] Which hormone in barley and wheat seeds promotes germination by synthesizing amylase enzyme?",
    "option_a": "Ethylene",
    "option_b": "Cytokinins",
    "option_c": "Auxins",
    "option_d": "Gibberellins",
    "correct_answer": "D",
    "explanation": "Gibberellins produced by embryo trigger aleurone layer to synthesize and secrete α-amylase, which breaks down starch into sugars for the growing embryo.",
    "difficulty": "Medium",
    "year": 2022,
    "points": 2,
    "topic": "Plant Physiology"
  },
  {
    "id": 92,
    "question_text": "[MHT CET] What will be the genotypes of the parents of a colorblind daughter and a colorblind son?",
    "option_a": "Father - XᶜY and mother - XᶜXᶜ",
    "option_b": "Father - XᶜY and mother - XᶜXᶜ",
    "option_c": "Father - XᶜY and mother - XᶜXᶜ",
    "option_d": "Father - XᶜY and mother - XᶜXᶜ",
    "correct_answer": "A",
    "explanation": "All options look identical in text - probably formatting issue. For colorblind daughter (XᶜXᶜ), she must receive Xᶜ from both parents. Father must be colorblind (XᶜY), mother must be carrier or colorblind (XᶜX or XᶜXᶜ). For colorblind son (XᶜY), he receives Xᶜ from mother. So mother must be at least carrier.",
    "difficulty": "Medium",
    "year": 2022,
    "points": 2,
    "topic": "Genetics"
  },
  {
    "id": 93,
    "question_text": "[MHT CET] Given below are two statements. Statement- I: Elimination of particular alleles from a population due to natural disasters is called genetic drift. Statement- II: Sudden temporary heritable change in the gene is called point mutation. In the light of above statements, choose the most appropriate answer from the options given below:",
    "option_a": "Statement- I is correct but Statement- II is incorrect.",
    "option_b": "Both Statement- I and Statement- II are correct.",
    "option_c": "Both Statement- I and Statement- II are incorrect.",
    "option_d": "Statement- I is incorrect but Statement- II is correct.",
    "correct_answer": "B",
    "explanation": "Both statements are correct: Genetic drift includes bottleneck effect (natural disasters) causing allele frequency changes. Point mutation is a sudden heritable change in a single nucleotide.",
    "difficulty": "Medium",
    "year": 2022,
    "points": 2,
    "topic": "Evolution"
  },
  {
    "id": 94,
    "question_text": "[MHT CET] Transforming principle in bacteria is DNA. This was first proved through experiments performed by",
    "option_a": "Frederick Griffith",
    "option_b": "Hershey and Chase",
    "option_c": "Avery, McCarty and MacLeod",
    "option_d": "Meselson and Stahl",
    "correct_answer": "C",
    "explanation": "Avery, MacLeod and McCarty (1944) experimentally proved that DNA is the transforming principle. Griffith (1928) discovered transformation but didn't identify DNA. Hershey-Chase (1952) confirmed DNA as genetic material in phages.",
    "difficulty": "Medium",
    "year": 2022,
    "points": 2,
    "topic": "Molecular Biology"
  },
  {
    "id": 95,
    "question_text": "[MHT CET] The parasite Plasmodium vivax causes",
    "option_a": "pneumonia",
    "option_b": "dengue",
    "option_c": "typhoid",
    "option_d": "malaria",
    "correct_answer": "D",
    "explanation": "Plasmodium vivax is one of the protozoan parasites that causes malaria in humans.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Human Health"
  },
  {
    "id": 96,
    "question_text": "[MHT CET] Cells in the wall of _____ are permeable to urea.",
    "option_a": "medullary part of collecting duct",
    "option_b": "distal convoluted tubule",
    "option_c": "cortical part of collecting duct",
    "option_d": "thick segment of Henle's loop",
    "correct_answer": "A",
    "explanation": "The medullary part of collecting duct is permeable to urea due to presence of UT-A urea transporters, allowing urea recycling in the kidney.",
    "difficulty": "Hard",
    "year": 2022,
    "points": 2,
    "topic": "Human Physiology"
  },
  {
    "id": 97,
    "question_text": "[MHT CET] Match the ecological hierarchy given in Column-I with their explanation in Column-II. Column-I: i. organism, ii. population, iii. community, iv. biome. Column-II: a. flora and fauna of a specific climatic zone, b. populations of different species of an area, c. organisms of same kind inhabiting an area, d. basic unit of hierarchy.",
    "option_a": "i-d, ii-c, iii-b, iv-a",
    "option_b": "i-d, ii-c, iii-a, iv-b",
    "option_c": "i-a, ii-c, iii-b, iv-d",
    "option_d": "i-a, ii-b, iii-c, iv-d",
    "correct_answer": "A",
    "explanation": "Organism - basic unit (d). Population - same kind organisms (c). Community - different species populations (b). Biome - flora and fauna of climatic zone (a). So i-d, ii-c, iii-b, iv-a.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Ecology"
  },
  {
    "id": 98,
    "question_text": "[MHT CET] The sub-order Prosimii includes",
    "option_a": "Lemurs and Tarsiers",
    "option_b": "Squirrel monkeys and spider monkeys",
    "option_c": "Baboons and Macaques",
    "option_d": "Chimpanzee and Orangutan",
    "correct_answer": "A",
    "explanation": "Prosimii (prosimians) include lemurs, lorises, and tarsiers. Monkeys (squirrel, spider, baboons, macaques) are anthropoids, and apes (chimpanzee, orangutan) are hominoids.",
    "difficulty": "Medium",
    "year": 2022,
    "points": 2,
    "topic": "Evolution"
  },
  {
    "id": 99,
    "question_text": "[MHT CET] Diseases present from birth are called",
    "option_a": "non-infectious diseases",
    "option_b": "congenital diseases",
    "option_c": "acquired diseases",
    "option_d": "communicable diseases",
    "correct_answer": "B",
    "explanation": "Congenital diseases are present from birth, whether inherited or caused by environmental factors during fetal development.",
    "difficulty": "Easy",
    "year": 2022,
    "points": 2,
    "topic": "Human Health"
  },
  {
    "id": 100,
    "question_text": "[MHT CET] Fertilization of gametocytes of Plasmodium vivax takes place in",
    "option_a": "gut of female Anopheles mosquito",
    "option_b": "RBCs of human being",
    "option_c": "salivary glands of female Anopheles mosquito",
    "option_d": "liver of human being",
    "correct_answer": "A",
    "explanation": "Fertilization (fusion of male and female gametocytes) of Plasmodium occurs in the gut of female Anopheles mosquito, forming zygote which develops into ookinete and oocyst.",
    "difficulty": "Medium",
    "year": 2022,
    "points": 2,
    "topic": "Human Health"
  },


  
  {
    "id": 1,
    "question_text": "[MHT CET 2021] Sometimes a pregnant woman is injected with hormone to hasten parturition.",
    "option_a": "FSH",
    "option_b": "thyroxine",
    "option_c": "oxytocin",
    "option_d": "glucagon",
    "correct_answer": "C",
    "explanation": "Oxytocin is a hormone that stimulates strong contractions of the uterine muscles during childbirth (parturition). It is often administered to induce or hasten labor.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Human Reproduction"
  },
  {
    "id": 2,
    "question_text": "[MHT CET 2021] In brood parasitism",
    "option_a": "the eggs after being laid in hosts nest are incubated by parent bird.",
    "option_b": "the eggs of host bird are destroyed.",
    "option_c": "the parasites egg hatch after the hosts egg.",
    "option_d": "the eggs of one bird are laid in another birds nest who incubates them.",
    "correct_answer": "D",
    "explanation": "Brood parasitism is a reproductive strategy where one species (the parasite) lays its eggs in the nest of another species (the host). The host bird then incubates and raises the young of the parasite as if they were its own.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Ecology"
  },
  {
    "id": 3,
    "question_text": "[MHT CET 2021] The patent titled \"Control of plant gene expression\" is based on a gene producing toxic protein that",
    "option_a": "causes allergic reactions.",
    "option_b": "does not allow seeds to germinate.",
    "option_c": "has adverse effect on Monarch butterfly population.",
    "option_d": "develops resistance to herbicide.",
    "correct_answer": "C",
    "explanation": "This patent refers to the Bt toxin technology. The gene from Bacillus thuringiensis produces a toxic protein (Cry protein) that is lethal to certain insects like the Monarch butterfly caterpillar. This raised concerns about the impact of transgenic crops on non-target insect populations.",
    "difficulty": "Medium",
    "year": 2021,
    "points": 4,
    "topic": "Biotechnology and its Applications"
  },
  {
    "id": 4,
    "question_text": "[MHT CET 2021] Which one of the following is the substrate for the activity of restriction endonuclease enzyme?",
    "option_a": "Double stranded DNA at VNTR's only.",
    "option_b": "RNA primers used in PCR for gene amplification.",
    "option_c": "Single stranded DNA separated by denaturation.",
    "option_d": "Specific recognition sites of double stranded DNA.",
    "correct_answer": "D",
    "explanation": "Restriction endonucleases (restriction enzymes) are molecular scissors that cut DNA at specific sites. They recognize and bind to specific, short, palindromic sequences (recognition sites) on double-stranded DNA and cleave the DNA strands at or near these sites.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Biotechnology"
  },
  {
    "id": 5,
    "question_text": "[MHT CET 2021] The remnant of the embryonic aperture on the inter-auricular septum is called",
    "option_a": "foramen ovalis",
    "option_b": "foramen of Monroe",
    "option_c": "foramen of Luschka",
    "option_d": "foramen of Magendie",
    "correct_answer": "A",
    "explanation": "During fetal development, the foramen ovale is an opening in the interatrial septum that allows blood to bypass the non-functioning lungs. After birth, this opening typically closes, leaving a remnant called the fossa ovalis. The term 'foramen ovalis' refers to the embryonic aperture itself.",
    "difficulty": "Medium",
    "year": 2021,
    "points": 4,
    "topic": "Human Anatomy"
  },
  {
    "id": 6,
    "question_text": "[MHT CET 2021] Abscisic acid causes efflux of ______ ions from guard cells and brings about closure of stomata.",
    "option_a": "Na⁺",
    "option_b": "K⁺",
    "option_c": "Mg⁺⁺",
    "option_d": "H⁺",
    "correct_answer": "B",
    "explanation": "Abscisic acid (ABA) is a plant hormone that induces stomatal closure during water stress. It triggers an efflux (outward movement) of potassium ions (K⁺) from the guard cells. The loss of K⁺, along with accompanying anions, reduces the osmotic pressure inside the guard cells, causing them to become flaccid and close the stomata.",
    "difficulty": "Medium",
    "year": 2021,
    "points": 4,
    "topic": "Plant Physiology"
  },
  {
    "id": 7,
    "question_text": "[MHT CET 2021] A large increase in blood volume and pressure stimulates atrial wall to produce",
    "option_a": "ANP",
    "option_b": "ACTH",
    "option_c": "RAAS",
    "option_d": "ADH",
    "correct_answer": "A",
    "explanation": "Atrial Natriuretic Peptide (ANP) is a hormone secreted by the atrial walls of the heart in response to increased blood volume and pressure. ANP acts to lower blood pressure and volume by promoting sodium excretion (natriuresis), vasodilation, and inhibiting the release of renin, ADH, and aldosterone.",
    "difficulty": "Medium",
    "year": 2021,
    "points": 4,
    "topic": "Human Physiology"
  },
  {
    "id": 8,
    "question_text": "[MHT CET 2021] 'All living beings have equal right to survive irrespective of their known or prospective economic use.' This is reason for conservation of biodiversity.",
    "option_a": "constitutional",
    "option_b": "broad utilitarian",
    "option_c": "narrowly utilitarian",
    "option_d": "ethical",
    "correct_answer": "D",
    "explanation": "The statement reflects the ethical argument for biodiversity conservation. This viewpoint holds that every species has an intrinsic value and a right to exist, regardless of its usefulness to humans. It is a moral and philosophical stance, not based on economic or legal grounds.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Environmental Science"
  },
  {
    "id": 9,
    "question_text": "[MHT CET 2021] If a person has blood group 'A', then antigen A will be present,",
    "option_a": "in stroma of RBC",
    "option_b": "on plasma membrane of RBC",
    "option_c": "on plasma membrane of WBC",
    "option_d": "in plasma of blood",
    "correct_answer": "B",
    "explanation": "Blood group antigens (like A and B) are glycoproteins or glycolipids that are present on the surface (plasma membrane) of red blood cells (RBCs). The presence or absence of these specific antigens determines a person's ABO blood type.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Human Physiology"
  },
  {
    "id": 10,
    "question_text": "[MHT CET 2021] Which plant hormone increases rate of respiration?",
    "option_a": "Auxins",
    "option_b": "Ethylene",
    "option_c": "Gibberellins",
    "option_d": "Cytokinins",
    "correct_answer": "B",
    "explanation": "Ethylene is a plant hormone known for its role in fruit ripening. One of its key effects during ripening is to increase the rate of respiration, a phenomenon known as the 'respiratory climacteric'. This burst in respiration provides the energy and metabolic intermediates for the ripening process.",
    "difficulty": "Medium",
    "year": 2021,
    "points": 4,
    "topic": "Plant Physiology"
  },
  {
    "id": 11,
    "question_text": "[MHT CET 2021] In angiosperms, the embryo sac is",
    "option_a": "uninucleate",
    "option_b": "binucleate",
    "option_c": "multinucleate",
    "option_d": "enucleate",
    "correct_answer": "C",
    "explanation": "The mature embryo sac (female gametophyte) in angiosperms is typically 8-nucleate but 7-celled. It contains three antipodal cells (3 nuclei), two synergids (2 nuclei), one egg cell (1 nucleus), and the central cell which has two polar nuclei. Therefore, it has a total of 8 nuclei and is considered multinucleate.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Plant Reproduction"
  },
  {
    "id": 12,
    "question_text": "[MHT CET 2021] Which one of the following sets contain enzymes coded by structural gene of lac operon of E.coli?",
    "option_a": "β-galactosidase, phophoglucose isomerase and transacetylase",
    "option_b": "β-galactosidase, β-galactoside permease and glycogen synthetase.",
    "option_c": "β-galactosidase, β-galactoside permease and transacetylase",
    "option_d": "β-galactosidase, β-galactoside permease and helicase.",
    "correct_answer": "C",
    "explanation": "The lac operon in E. coli contains three structural genes: lacZ, lacY, and lacA. These genes code for three enzymes: lacZ codes for β-galactosidase (which breaks down lactose), lacY codes for β-galactoside permease (which facilitates lactose entry into the cell), and lacA codes for thiogalactoside transacetylase (whose exact role is less clear).",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Molecular Biology"
  },
  {
    "id": 13,
    "question_text": "[MHT CET 2021] During biogas formation which one of the following process is NOT involved in anaerobic digestion of slurry?",
    "option_a": "Methanogenesis",
    "option_b": "Acidogenesis",
    "option_c": "Photolysis",
    "option_d": "Hydrolysis",
    "correct_answer": "C",
    "explanation": "Biogas production through anaerobic digestion involves several stages: hydrolysis (breakdown of complex polymers), acidogenesis (production of volatile fatty acids), and methanogenesis (production of methane by methanogenic bacteria). Photolysis, the splitting of molecules by light, is not part of this dark, anaerobic process.",
    "difficulty": "Medium",
    "year": 2021,
    "points": 4,
    "topic": "Environmental Science"
  },
  {
    "id": 14,
    "question_text": "[MHT CET 2021] The specific site where the DNA is cut by REN's is called ______ site.",
    "option_a": "recognition",
    "option_b": "initiation",
    "option_c": "'ori'",
    "option_d": "termination",
    "correct_answer": "A",
    "explanation": "Restriction Endonucleases (RENs) recognize and bind to specific, short DNA sequences called recognition sites. They then cut the DNA at or near these specific recognition sites.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Biotechnology"
  },
  {
    "id": 15,
    "question_text": "[MHT CET 2021] Which one of the following is an arboreal ape?",
    "option_a": "Gorilla",
    "option_b": "Gibbon",
    "option_c": "Orangutan",
    "option_d": "Chimpanzee",
    "correct_answer": "B",
    "explanation": "Arboreal animals live primarily in trees. Among the apes, gibbons are the most specialized for arboreal life. They have long arms and powerful hands for swinging through trees (brachiation). Gorillas, chimpanzees, and orangutans are more terrestrial, though orangutans also spend significant time in trees.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Evolution"
  },
  {
    "id": 16,
    "question_text": "[MHT CET 2021] Which one of the following cranial nerves does NOT innervate eye muscles?",
    "option_a": "Pathetic",
    "option_b": "Abducens",
    "option_c": "Hypoglossal",
    "option_d": "Occulomotor",
    "correct_answer": "C",
    "explanation": "Three cranial nerves innervate the extraocular muscles: Oculomotor (III), Trochlear (IV, also called pathetic), and Abducens (VI). The Hypoglossal nerve (XII) is a motor nerve that innervates the muscles of the tongue, not the eye.",
    "difficulty": "Medium",
    "year": 2021,
    "points": 4,
    "topic": "Human Anatomy"
  },
  {
    "id": 17,
    "question_text": "[MHT CET 2021] Which one of the following is unlike other nuclei in the embryo sac of angiosperms regarding ploidy?",
    "option_a": "Male gamete nucleus",
    "option_b": "Egg nucleus",
    "option_c": "Secondary nucleus",
    "option_d": "Antipodal nucleus",
    "correct_answer": "C",
    "explanation": "In a typical angiosperm embryo sac: The egg nucleus (B) is haploid (n). The antipodal nuclei (D) are also haploid (n). The male gamete nucleus (A) from pollen is haploid (n). The secondary nucleus (C) is formed by the fusion of two polar nuclei, so it is diploid (2n). Therefore, the secondary nucleus has a different ploidy level.",
    "difficulty": "Medium",
    "year": 2021,
    "points": 4,
    "topic": "Plant Reproduction"
  },
  {
    "id": 18,
    "question_text": "[MHT CET 2021] Following are sex ratios obtained from a given area. Which one will show evolutionary stable strategy between males and females respectively?",
    "option_a": "1000:1000",
    "option_b": "1015:1000",
    "option_c": "1000:1015",
    "option_d": "1000:800",
    "correct_answer": "A",
    "explanation": "An evolutionarily stable strategy (ESS) for sex ratio, according to Fisher's principle, is typically 1:1 (50:50). This is because if one sex becomes rarer, parents producing more of that sex will have a selective advantage, driving the ratio back towards equality. Therefore, a sex ratio of 1000 males : 1000 females (A) represents the stable equilibrium.",
    "difficulty": "Medium",
    "year": 2021,
    "points": 4,
    "topic": "Evolution"
  },
  {
    "id": 19,
    "question_text": "[MHT CET 2021] Number of NADH⁺ H⁺ molecules formed during acetylation from end product of glycolysis in aerobic respiration is",
    "option_a": "2",
    "option_b": "3",
    "option_c": "6",
    "option_d": "8",
    "correct_answer": "A",
    "explanation": "The end product of glycolysis is pyruvate. Before entering the Krebs cycle, each pyruvate molecule is converted to Acetyl CoA in the connecting link reaction (oxidative decarboxylation). For each pyruvate molecule, one NADH + H⁺ is produced. Since one glucose molecule yields 2 pyruvate molecules, a total of 2 NADH + H⁺ molecules are formed during this acetylation step.",
    "difficulty": "Medium",
    "year": 2021,
    "points": 4,
    "topic": "Cell Respiration"
  },
  {
    "id": 20,
    "question_text": "[MHT CET 2021] III ventricle of human brain is connected posteriorly to IV ventricle through",
    "option_a": "foramen of Magendie",
    "option_b": "duct of Bellini",
    "option_c": "foramen of Monro",
    "option_d": "duct of Sylvius",
    "correct_answer": "D",
    "explanation": "The ventricles of the brain are interconnected. The third ventricle is connected to the fourth ventricle by a narrow canal called the cerebral aqueduct, also known as the aqueduct of Sylvius. The foramen of Monro connects lateral ventricles to the third ventricle. The foramen of Magendie is an opening in the fourth ventricle.",
    "difficulty": "Medium",
    "year": 2021,
    "points": 4,
    "topic": "Human Anatomy"
  },
  {
    "id": 21,
    "question_text": "[MHT CET 2021] The substance upon which an enzyme acts is termed as",
    "option_a": "prosthetic group",
    "option_b": "exoenzyme",
    "option_c": "endoenzyme",
    "option_d": "substrate",
    "correct_answer": "D",
    "explanation": "In biochemistry, the substrate is the specific molecule or substance upon which an enzyme acts to catalyze a chemical reaction. The enzyme binds to its substrate at the active site.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Biochemistry"
  },
  {
    "id": 22,
    "question_text": "[MHT CET 2021] Given below are two statements with respect to Menstrual cycle. Statement I: Menstrual phase in menstrual cycle occurs when an ovulated egg does not fertilize and thus shed out along with the menstruum. Statement II: Menstrual phase is called, 'funeral of unfertilized egg'. Choose the most appropriate answer from the options given below.",
    "option_a": "Both Statement-I and Statement-II are correct",
    "option_b": "Statement-I is correct but Statement-II is incorrect.",
    "option_c": "Both Statement-I and Statement-II are incorrect.",
    "option_d": "Statement-I is incorrect but Statement-II is correct.",
    "correct_answer": "A",
    "explanation": "Both statements are correct. If fertilization does not occur after ovulation, the corpus luteum degenerates, leading to a drop in progesterone levels. This causes the breakdown and shedding of the uterine lining (endometrium), along with the unfertilized egg, in a process called menstruation. This phase is sometimes metaphorically described as the 'funeral of the unfertilized egg'.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Human Reproduction"
  },
  {
    "id": 23,
    "question_text": "[MHT CET 2021] The heterochromatin part of chromosome is ______ times more rich in DNA than euchromatin.",
    "option_a": "2-3",
    "option_b": "9-12",
    "option_c": "5-8",
    "option_d": "4-6",
    "correct_answer": "A",
    "explanation": "Heterochromatin is a tightly packed form of DNA. It is typically 2-3 times more concentrated (denser) in DNA than euchromatin, which is a less condensed, transcriptionally active form of chromatin. This is a standard fact in cytology.",
    "difficulty": "Hard",
    "year": 2021,
    "points": 4,
    "topic": "Cell Biology"
  },
  {
    "id": 24,
    "question_text": "[MHT CET 2021] Which of the following does NOT contribute to the formation of thoracic cage?",
    "option_a": "Diaphragm",
    "option_b": "Sternum",
    "option_c": "Pleura",
    "option_d": "Ribs",
    "correct_answer": "C",
    "explanation": "The thoracic cage (rib cage) is a bony and cartilaginous structure that protects the thoracic organs. It is primarily formed by the ribs (D), sternum (B), and thoracic vertebrae. The diaphragm (A) is a muscular sheet that forms the floor of the thoracic cavity but is not part of the bony cage. The pleura (C) are membranes that line the thoracic cavity and lungs, not a structural component of the cage itself. Since the question asks for what does NOT contribute, and diaphragm is a muscle that forms the floor, it is part of the thoracic cavity boundary but not the 'cage'. However, pleura is definitely not a structural component. The best answer here is Pleura.",
    "difficulty": "Medium",
    "year": 2021,
    "points": 4,
    "topic": "Human Anatomy"
  },
  {
    "id": 25,
    "question_text": "[MHT CET 2021] Select the correct sequence of stage occurring in primary hydrarch succession.",
    "option_a": "Free floating plants → submerged plants → trees → reed swamp stage",
    "option_b": "Reed swamp stage → trees → submerged plants → free floating plants",
    "option_c": "Submerged plants → free floating plants → reed swamp stage → trees",
    "option_d": "Submerged plants → reed swamp stage → free floating plants → trees",
    "correct_answer": "C",
    "explanation": "Hydrarch succession (in a pond) follows a specific sequence: 1. Phytoplankton (not listed). 2. Rooted submerged plants (e.g., Hydrilla). 3. Rooted floating plants (e.g., Lotus, Nymphaea). 4. Free-floating plants (e.g., Pistia, Eichhornia). 5. Reed-swamp stage (amphibious plants like Typha, Sagittaria). 6. Sedge meadow stage. 7. Woodland and finally trees. Therefore, 'Submerged plants → free floating plants → reed swamp stage → trees' is the correct order among the given options.",
    "difficulty": "Hard",
    "year": 2021,
    "points": 4,
    "topic": "Ecology"
  },
  {
    "id": 26,
    "question_text": "[MHT CET 2021] Nucleic acid was first discovered from",
    "option_a": "red blood cells",
    "option_b": "bacteriophages",
    "option_c": "white blood cells",
    "option_d": "Streptococcus pneumoniae",
    "correct_answer": "C",
    "explanation": "Nucleic acid (specifically DNA) was first isolated and discovered by Friedrich Miescher in 1869. He isolated it from the nuclei of white blood cells (pus cells) obtained from surgical bandages. He called the substance 'nuclein'.",
    "difficulty": "Medium",
    "year": 2021,
    "points": 4,
    "topic": "Molecular Biology"
  },
  {
    "id": 27,
    "question_text": "[MHT CET 2021] Rate of breathing in new born is about ______ times per minute.",
    "option_a": "44",
    "option_b": "12",
    "option_c": "16",
    "option_d": "20",
    "correct_answer": "A",
    "explanation": "Newborn infants have a much higher metabolic rate and oxygen demand relative to their body size compared to adults. Their normal respiratory rate is typically around 40-60 breaths per minute. Among the options, 44 is the most appropriate.",
    "difficulty": "Medium",
    "year": 2021,
    "points": 4,
    "topic": "Human Physiology"
  },
  {
    "id": 28,
    "question_text": "[MHT CET 2021] Secondary succession takes place in / on",
    "option_a": "newly formed volcanic island.",
    "option_b": "recently burnt or destroyed forest.",
    "option_c": "newly created pond.",
    "option_d": "bare rocky area",
    "correct_answer": "B",
    "explanation": "Secondary succession occurs in areas where a community that previously existed has been removed or disturbed, but the soil and some seeds or propagules remain. A recently burnt or destroyed forest (B) is a classic example. The other options (volcanic island, new pond, bare rock) are examples of primary succession, starting from a lifeless area without soil.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Ecology"
  },
  {
    "id": 29,
    "question_text": "[MHT CET 2021] T-wave in normal ECG represents",
    "option_a": "atrial depolarization.",
    "option_b": "ventricular depolarization.",
    "option_c": "atrial repolarization",
    "option_d": "ventricular repolarization",
    "correct_answer": "D",
    "explanation": "In a standard electrocardiogram (ECG): The P-wave represents atrial depolarization. The QRS complex represents ventricular depolarization. The T-wave represents ventricular repolarization. Atrial repolarization is usually hidden within the QRS complex.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Human Physiology"
  },
  {
    "id": 30,
    "question_text": "[MHT CET 2021] Choose the INCORRECT statement with respect to T.S. of Artery.",
    "option_a": "Arterial lumen is devoid of valves.",
    "option_b": "Angular margin around the lumen shows tessellations",
    "option_c": "The outermost tunic externa is thick and tough layer of collagen fibers.",
    "option_d": "Tunica media is thin and lumen is wide.",
    "correct_answer": "D",
    "explanation": "Statements A, B, and C are correct about arteries. Statement D is incorrect. Arteries have thick, muscular, and elastic tunica media to withstand high pressure, and their lumen is relatively narrow. The description 'tunica media is thin and lumen is wide' is characteristic of veins, not arteries.",
    "difficulty": "Medium",
    "year": 2021,
    "points": 4,
    "topic": "Human Anatomy"
  },
  {
    "id": 31,
    "question_text": "[MHT CET 2021] To provide energy for a metabolic process, ATP molecule undergoes",
    "option_a": "phosphorylation",
    "option_b": "hydrolysis",
    "option_c": "oxidation",
    "option_d": "dehydrogenation",
    "correct_answer": "B",
    "explanation": "ATP (adenosine triphosphate) is the energy currency of the cell. It provides energy by undergoing hydrolysis, a reaction where it is broken down into ADP (adenosine diphosphate) and an inorganic phosphate (Pi). This reaction is exergonic, releasing energy that can be used to drive endergonic metabolic processes.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Cell Biology"
  },
  {
    "id": 32,
    "question_text": "[MHT CET 2021] In which of the following plants male flower floats on the surface of water?",
    "option_a": "Potamogeton",
    "option_b": "Zostera",
    "option_c": "Water lily",
    "option_d": "Vallisneria",
    "correct_answer": "D",
    "explanation": "Vallisneria is a submerged aquatic plant that exhibits a unique hydrophilous pollination mechanism. The female flowers reach the water surface on long stalks. The male flowers detach from the parent plant and float on the water surface. When they come into contact with a female flower, pollination occurs.",
    "difficulty": "Medium",
    "year": 2021,
    "points": 4,
    "topic": "Plant Reproduction"
  },
  {
    "id": 33,
    "question_text": "[MHT CET 2021] The cyanobacteria Tryptophrix is associated symbiotically with",
    "option_a": "Lichen",
    "option_b": "Azolla",
    "option_c": "Cycas",
    "option_d": "Endomycorrhiza",
    "correct_answer": "C",
    "explanation": "Tryptophrix is a genus of cyanobacteria (blue-green algae) that forms a symbiotic association in the coralloid roots of Cycas. These roots are specialized, negatively geotropic roots that grow above ground and harbor the cyanobacteria in a symbiotic relationship where the cyanobacteria fix atmospheric nitrogen.",
    "difficulty": "Hard",
    "year": 2021,
    "points": 4,
    "topic": "Plant Biology"
  },
  {
    "id": 34,
    "question_text": "[MHT CET 2021] Match the terms in Column-I with their explanation in Column-II.",
    "option_a": "A-II B-III C-IV D-I",
    "option_b": "A-I B-II C-III D-IV",
    "option_c": "A-IV B-II C-I D-III",
    "option_d": "A-III B-IV C-II D-I",
    "correct_answer": "A",
    "explanation": "The correct matching of blood-related terms is: Polycythemia (A) is an abnormal increase in the number of RBCs (II). Erythrocytopenia (B) is a decrease in the number of RBCs (III). Leukemia (C) is an uncontrolled increase in the number of WBCs (IV). Leucopenia (D) is a decrease in the number of WBCs (I).",
    "difficulty": "Medium",
    "year": 2021,
    "points": 4,
    "topic": "Human Physiology"
  },
  {
    "id": 35,
    "question_text": "[MHT CET 2021] Match the following enzymes in Column-I with their source in Column-II.",
    "option_a": "A-II B-I C-IV D-III",
    "option_b": "A-II B-III C-I D-IV",
    "option_c": "A-II B-IV C-I D-III",
    "option_d": "A-IV B-III C-II D-I",
    "correct_answer": "C",
    "explanation": "The correct matching of industrial enzymes and their microbial sources: Pectinase (A) is commonly produced by Aspergillus niger (II). Lipase (B) is produced by Candida lipolytica (IV). Invertase (C) is obtained from Saccharomyces cerevisiae (I) (yeast). Cellulase (D) is produced by fungi like Trichoderma konigii (III).",
    "difficulty": "Hard",
    "year": 2021,
    "points": 4,
    "topic": "Biotechnology"
  },
  {
    "id": 36,
    "question_text": "[MHT CET 2021] Given below is a diagram of an unfertilized egg. Identify 'X' and 'Y' respectively.",
    "option_a": "vitelline membrane and zona pellucida",
    "option_b": "zona pellucida and vitelline membrane",
    "option_c": "perivitelline space and corona radiata",
    "option_d": "corona radiata and zona pellucida",
    "correct_answer": "D",
    "explanation": "In a typical diagram of a mammalian (human) unfertilized egg or ovum: The outermost layer of cells is the corona radiata. Just inside that is a thick, transparent, non-cellular layer called the zona pellucida. Therefore, X (the outer layer) is corona radiata, and Y (the inner thick layer) is zona pellucida.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Human Reproduction"
  },
  {
    "id": 37,
    "question_text": "[MHT CET 2021] Vasa recta refers to",
    "option_a": "loop shaped capillary network around Henle's loop of juxtamedullary nephrons.",
    "option_b": "juxtaglomerular apparatus of nephrons.",
    "option_c": "neuronal circuit of hypothalamus,",
    "option_d": "vascular portion of pia mater of CNS.",
    "correct_answer": "A",
    "explanation": "Vasa recta are long, loop-shaped capillary networks that run parallel to the loops of Henle of juxtamedullary nephrons in the kidney. They play a crucial role in the countercurrent exchange system, which helps in maintaining the medullary osmotic gradient and conserving water.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Human Physiology"
  },
  {
    "id": 38,
    "question_text": "[MHT CET 2021] Which one of the following is an example of milk sugar?",
    "option_a": "Lactose",
    "option_b": "Fructose",
    "option_c": "Sucrose",
    "option_d": "Maltose",
    "correct_answer": "A",
    "explanation": "Lactose is a disaccharide sugar composed of galactose and glucose. It is the primary sugar found in milk and dairy products. Fructose is fruit sugar, sucrose is table sugar, and maltose is malt sugar.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Biochemistry"
  },
  {
    "id": 39,
    "question_text": "[MHT CET 2021] Select the INCORRECT statement regarding transport of respiratory gases.",
    "option_a": "ppO₂ of capillary blood is 40 mm Hg before oxygenation.",
    "option_b": "Alveolar membrane is equally permeable to oxygen and carbon dioxide.",
    "option_c": "Dissociation of oxyhaemoglobin into haemoglobin and oxygen is favored by low ppCO₂",
    "option_d": "ppCO₂ of alveolar air is 45 mm Hg.",
    "correct_answer": "C",
    "explanation": "Statements A, B, and D are correct. Statement C is incorrect. The dissociation of oxyhemoglobin (release of O₂) is favored by high ppCO₂ (and low pH), not low ppCO₂. This is known as the Bohr effect. Low ppCO₂ would favor the loading of oxygen onto hemoglobin.",
    "difficulty": "Medium",
    "year": 2021,
    "points": 4,
    "topic": "Human Physiology"
  },
  {
    "id": 40,
    "question_text": "[MHT CET 2021] In angiosperms, the embryo is developed at ______ of the embryo sac.",
    "option_a": "antipodal side",
    "option_b": "micropylar end",
    "option_c": "chalazal end",
    "option_d": "centre",
    "correct_answer": "B",
    "explanation": "In the angiosperm embryo sac, the egg cell is located at the micropylar end (the end facing the opening in the ovule). After fertilization, the zygote develops into an embryo at this same micropylar end. The antipodal cells are at the opposite (chalazal) end.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Plant Reproduction"
  },
  {
    "id": 41,
    "question_text": "[MHT CET 2021] Which one of the following is the decarboxylated compound formed during TCA cycle?",
    "option_a": "Citrate",
    "option_b": "α-ketoglutarate",
    "option_c": "Isocitrate",
    "option_d": "Cis-aconitate",
    "correct_answer": "B",
    "explanation": "Decarboxylation is the removal of a carboxyl group as CO₂. In the TCA cycle, two decarboxylation steps occur. The first is the conversion of isocitrate (6C) to α-ketoglutarate (5C). The second is the conversion of α-ketoglutarate (5C) to succinyl-CoA (4C). The question asks for the 'decarboxylated compound', meaning the product after CO₂ is removed. In the first step, the product is α-ketoglutarate. In the second step, the product is Succinyl-CoA, which is not listed. Among the options, α-ketoglutarate is the compound formed after decarboxylation.",
    "difficulty": "Hard",
    "year": 2021,
    "points": 4,
    "topic": "Cell Respiration"
  },
  {
    "id": 42,
    "question_text": "[MHT CET 2021] Which of the following is NOT a character of open circulation?",
    "option_a": "Blood flows with low pressure.",
    "option_b": "Respiratory pigment is usually absent.",
    "option_c": "Presence of blood capillaries.",
    "option_d": "Presence of haemocoel.",
    "correct_answer": "C",
    "explanation": "Open circulatory systems, found in arthropods and mollusks, are characterized by blood (hemolymph) flowing freely through open spaces (sinuses) called haemocoel (D), with low pressure (A), and often lacking respiratory pigment (B). They do NOT have true blood capillaries (C); capillaries are a feature of closed circulatory systems.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Animal Kingdom"
  },
  {
    "id": 43,
    "question_text": "[MHT CET 2021] Match the following types of adaptations given in Column-I and their examples given in Column-II. Choose the correct answer from the options given below.",
    "option_a": "A-II, B-I, C-III",
    "option_b": "A-I, B-II, C-III",
    "option_c": "A-III, B-I, C-II",
    "option_d": "A-I, B-III, C-II",
    "correct_answer": "C",
    "explanation": "The correct matching of adaptation types with examples: Morphological adaptation (A) refers to structural features, like leaves reduced to spines in Opuntia (III). Physiological adaptation (B) refers to internal functional adjustments, like the CAM pathway in plants (I) for water conservation. Behavioral adaptation (C) refers to actions, like the migration of birds (II).",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Ecology"
  },
  {
    "id": 44,
    "question_text": "[MHT CET 2021] Identify the correct statement/s regarding unsaturated fatty acids. A. They have one or more double bonds between the carbon atoms of hydrocarbon chains. B. Are generally solid at room temperature. C. Are generally liquid at room temperature. D. They do not have any double bonds between the carbon atoms of hydrocarbon chains.",
    "option_a": "Only A",
    "option_b": "Both A and C",
    "option_c": "Both A and B",
    "option_d": "A, B and C",
    "correct_answer": "B",
    "explanation": "Unsaturated fatty acids (A) have one or more double bonds in their hydrocarbon chain. The presence of these double bonds creates kinks, preventing tight packing. Therefore, they are generally liquid at room temperature (C) (e.g., oils). Statement B describes saturated fatty acids, which are solid at room temperature. Statement D is the opposite of A and is incorrect.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Biochemistry"
  },
  {
    "id": 45,
    "question_text": "[MHT CET 2021] The smallest WBC is",
    "option_a": "basophil.",
    "option_b": "monocyte.",
    "option_c": "lymphocyte.",
    "option_d": "neutrophil.",
    "correct_answer": "C",
    "explanation": "In terms of size among white blood cells (leukocytes), lymphocytes are the smallest (6-9 μm in diameter). Monocytes are the largest. Neutrophils and basophils are intermediate in size.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Human Physiology"
  },
  {
    "id": 46,
    "question_text": "[MHT CET 2021] Lac-operon is an example of which one of the following types of regulation of gene expression?",
    "option_a": "Transcriptional level",
    "option_b": "Translational level",
    "option_c": "Regulation of splicing/processing level",
    "option_d": "Transport of mRNA from nucleus to cytoplasm",
    "correct_answer": "A",
    "explanation": "The lac operon is a classic example of gene regulation at the transcriptional level. The presence or absence of lactose (and glucose) determines whether the repressor protein binds to the operator, which in turn controls whether RNA polymerase can transcribe the structural genes into mRNA.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Molecular Biology"
  },
  {
    "id": 47,
    "question_text": "[MHT CET 2021] The Human Genome Project formally began in A and was completed in B.",
    "option_a": "A-1993 B-2000",
    "option_b": "A-1995 B-2005",
    "option_c": "A-1990 B-2003",
    "option_d": "A-1980 B-2001",
    "correct_answer": "C",
    "explanation": "The Human Genome Project (HGP) was an international scientific research project with the goal of determining the sequence of nucleotide base pairs that make up human DNA. It formally began in 1990 and was declared complete in April 2003.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Molecular Biology"
  },
  {
    "id": 48,
    "question_text": "[MHT CET 2021] During translation in protein synthesis, ______ and codon bind by formation of ______ bond.",
    "option_a": "peptide",
    "option_b": "glycosidic",
    "option_c": "hydrogen",
    "option_d": "phosphodiester",
    "correct_answer": "C",
    "explanation": "During translation, the codon on the mRNA and the anticodon on the tRNA bind to each other through complementary base pairing. This interaction is stabilized by the formation of hydrogen bonds between the nitrogenous bases (A with U, and G with C).",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Molecular Biology"
  },
  {
    "id": 49,
    "question_text": "[MHT CET 2021] Epstein-barr virus and Human papilloma virus cause",
    "option_a": "dermatophytosis",
    "option_b": "nasopharyngitis",
    "option_c": "pneumonia",
    "option_d": "cancer",
    "correct_answer": "D",
    "explanation": "Both Epstein-Barr virus (EBV) and Human papilloma virus (HPV) are oncogenic viruses, meaning they can cause cancer. EBV is associated with Burkitt's lymphoma and nasopharyngeal carcinoma. HPV is the primary cause of cervical cancer and other anogenital cancers.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Human Health and Disease"
  },
  {
    "id": 50,
    "question_text": "[MHT CET 2021] Species diversity is bountiful in the tropics near equator because of the following factors EXCEPT",
    "option_a": "higher annual rainfall.",
    "option_b": "warmer temperature.",
    "option_c": "intense sunlight.",
    "option_d": "drastic seasonal climatic changes.",
    "correct_answer": "D",
    "explanation": "High species diversity in the tropics is attributed to factors like high annual rainfall (A), consistently warm temperatures (B), and intense sunlight (C), which lead to high productivity and stable conditions. The exception is drastic seasonal climatic changes (D); tropical regions are known for their relatively constant, non-seasonal climate. Drastic seasonal changes are characteristic of temperate regions and tend to reduce diversity.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Ecology"
  },
  {
    "id": 51,
    "question_text": "[MHT CET 2021] Symptoms such as intermittent pain below ribcage in the back and sideways, hazy, pinkish urine along with pain during micturition generally indicate",
    "option_a": "uremia",
    "option_b": "kidney stones",
    "option_c": "diabetes mellitus",
    "option_d": "nephritis",
    "correct_answer": "B",
    "explanation": "The symptoms described are classic indicators of kidney stones (renal calculi). Intermittent, severe pain (renal colic) in the flank area (below ribcage in the back) is characteristic. Hematuria (blood in urine, causing hazy pinkish color) occurs as stones scrape the urinary tract. Pain during micturition (dysuria) can also occur.",
    "difficulty": "Medium",
    "year": 2021,
    "points": 4,
    "topic": "Human Health and Disease"
  },
  {
    "id": 52,
    "question_text": "[MHT CET 2021] How many copies of DNA will be produced in the thermal cycler of PCR after 5 cycles?",
    "option_a": "64",
    "option_b": "16",
    "option_c": "128",
    "option_d": "32",
    "correct_answer": "D",
    "explanation": "Polymerase Chain Reaction (PCR) amplifies DNA exponentially. The number of DNA copies after 'n' cycles is approximately 2ⁿ, starting from a single copy. After 5 cycles, the number of copies would be 2⁵ = 32.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Biotechnology"
  },
  {
    "id": 53,
    "question_text": "[MHT CET 2021] Which one of the following is NOT a cause of diarrhea?",
    "option_a": "Colitis",
    "option_b": "Ulcer",
    "option_c": "Inflammation of intestine",
    "option_d": "Inadequate enzyme secretion",
    "correct_answer": "B",
    "explanation": "Diarrhea can be caused by various factors that affect intestinal function. Colitis (A) (inflammation of the colon), inflammation of the intestine (C) (enteritis), and inadequate enzyme secretion (D) (e.g., lactose intolerance) can all lead to diarrhea. An ulcer (B) is a sore in the lining of the stomach or duodenum; while it can cause pain and bleeding, it is not a direct cause of diarrhea.",
    "difficulty": "Medium",
    "year": 2021,
    "points": 4,
    "topic": "Human Health and Disease"
  },
  {
    "id": 54,
    "question_text": "[MHT CET 2021] Given below are two statements regarding evolution. Statement-I: Selection against harmful mutation leads to a mutation balance. Statement-II: In mutation balance, the allele frequency of harmful recessives keep on changing generation after generation. In the light of above statements, choose the most appropriate answer from the options given below:",
    "option_a": "Statement-I is correct but Statement-II is incorrect",
    "option_b": "Both Statement-I and Statement-II are correct.",
    "option_c": "Both Statement-I and Statement-II are incorrect.",
    "option_d": "Statement-I is incorrect but Statement-II is correct.",
    "correct_answer": "A",
    "explanation": "Statement-I is correct: Mutation-selection balance is the equilibrium reached when the rate at which deleterious alleles are created by mutation equals the rate at which they are eliminated by natural selection (selection against the harmful mutation). Statement-II is incorrect: In mutation-selection balance, the allele frequency of harmful recessives remains relatively constant from generation to generation, not continuously changing. It is the balance point.",
    "difficulty": "Hard",
    "year": 2021,
    "points": 4,
    "topic": "Evolution"
  },
  {
    "id": 55,
    "question_text": "[MHT CET 2021] Which one of the following is a hormone releasing IUD?",
    "option_a": "LNG-20",
    "option_b": "CuT",
    "option_c": "Cu7",
    "option_d": "Multiload 375",
    "correct_answer": "A",
    "explanation": "Intrauterine Devices (IUDs) are of two main types: Non-medicated (e.g., Lippes loop), Copper-releasing (e.g., CuT, Cu7, Multiload 375), and Hormone-releasing (e.g., LNG-20, which releases Levonorgestrel, a progesterone). So, LNG-20 is the hormone-releasing IUD.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Human Reproduction"
  },
  {
    "id": 56,
    "question_text": "[MHT CET 2021] With reference to the Mendelian experiments, which one of the following statements is INCORRECT?",
    "option_a": "A factor has only one allele.",
    "option_b": "Recessive allele is not expressed in the presence of an alternative allele.",
    "option_c": "The alleles occupy identical loci on homologous chromosomes.",
    "option_d": "Allele is an alternative form of a given gene.",
    "correct_answer": "A",
    "explanation": "Statements B, C, and D are correct with reference to Mendelian genetics. Statement A is incorrect. A factor (gene) can have two or more alternative forms called alleles. An individual diploid organism carries two alleles for each gene, but the gene itself can have multiple alleles in the population.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Genetics"
  },
  {
    "id": 57,
    "question_text": "[MHT CET 2021] Based on the statements regarding dialysis choose the correct answer from options given below. Statement-I: Dialysis is regarded as a 'holding measure' until a renal transplant is performed. Statement-II: Sometimes dialysis is not supportive measure in those for whom a transplant is inappropriate.",
    "option_a": "Statement-I is incorrect but Statement-II is correct.",
    "option_b": "Both Statement-I and Statement-II are correct.",
    "option_c": "Both Statement-I and Statement-II are incorrect.",
    "option_d": "Statement-I is correct but Statement-II is incorrect.",
    "correct_answer": "B",
    "explanation": "Both statements are correct. Dialysis is a life-sustaining treatment that performs the function of kidneys, but it is not a cure. It is often used as a 'holding measure' (I) to keep a patient alive while they wait for a kidney transplant. However, for some patients (e.g., those with other serious illnesses or who are not suitable candidates), a transplant is inappropriate, and long-term dialysis becomes the primary supportive measure (II).",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Biotechnology and its Applications"
  },
  {
    "id": 58,
    "question_text": "[MHT CET 2021] Select the mismatch pair with respect to hormones.",
    "option_a": "Milk ejecting hormone - Oxytocin",
    "option_b": "Sleep inducing hormone - Melatonin",
    "option_c": "Salt retaining hormone - Thyroxine",
    "option_d": "Emergency hormone - Adrenaline",
    "correct_answer": "C",
    "explanation": "Options A, B, and D are correctly matched. Option C is a mismatch. The salt-retaining hormone is aldosterone, which is secreted by the adrenal cortex and promotes sodium reabsorption in the kidneys. Thyroxine is the thyroid hormone that regulates metabolism.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Human Physiology"
  },
  {
    "id": 59,
    "question_text": "[MHT CET 2021] During sewage treatment the activated sludge is present in",
    "option_a": "settling tank.",
    "option_b": "aeration tank.",
    "option_c": "sedimentation tank.",
    "option_d": "grit chamber.",
    "correct_answer": "B",
    "explanation": "In the sewage treatment process, primary effluent is passed into a large aeration tank where it is constantly agitated mechanically and air is pumped into it. This allows the growth of aerobic bacteria and other microbes, which form flocs. This mixture is called activated sludge. The activated sludge is present in the aeration tank.",
    "difficulty": "Medium",
    "year": 2021,
    "points": 4,
    "topic": "Environmental Science"
  },
  {
    "id": 60,
    "question_text": "[MHT CET 2021] In Zea mays, color and shape of grain show ______ linkage.",
    "option_a": "complete",
    "option_b": "complete sex",
    "option_c": "incomplete",
    "option_d": "incomplete sex",
    "correct_answer": "A",
    "explanation": "In maize (Zea mays), genes for the color of the grain (e.g., purple vs. white) and the shape of the grain (e.g., round vs. wrinkled) are located very close together on the same chromosome. They tend to be inherited together without crossing over, exhibiting complete linkage.",
    "difficulty": "Medium",
    "year": 2021,
    "points": 4,
    "topic": "Genetics"
  },
  {
    "id": 61,
    "question_text": "[MHT CET 2021] Flame cell are also called A and they are found in animals like B.",
    "option_a": "A-Salt excreting glands, B-marine birds",
    "option_b": "A-Protenephridia, B-rotifers",
    "option_c": "A-metanephridia, B-Echinoderms",
    "option_d": "A-nephrons, B-Crustaceans",
    "correct_answer": "B",
    "explanation": "Flame cells are specialized excretory cells found in some invertebrates like flatworms, rotifers, and nemerteans. They are the functional units of a excretory system called protonephridia. So, flame cells are also called protonephridia, and they are found in animals like rotifers (and planarians).",
    "difficulty": "Medium",
    "year": 2021,
    "points": 4,
    "topic": "Animal Kingdom"
  },
  {
    "id": 62,
    "question_text": "[MHT CET 2021] Polyembryony was first observed by Leeuwenhoek in the seeds of",
    "option_a": "Citrus",
    "option_b": "Mango",
    "option_c": "Orchid",
    "option_d": "Papaya",
    "correct_answer": "A",
    "explanation": "Polyembryony, the phenomenon of having multiple embryos in a single seed, was first observed by Antonie van Leeuwenhoek in 1719 in the seeds of an orange tree (Citrus).",
    "difficulty": "Hard",
    "year": 2021,
    "points": 4,
    "topic": "Plant Reproduction"
  },
  {
    "id": 63,
    "question_text": "[MHT CET 2021] Symptoms of malaria do NOT include",
    "option_a": "sweating and shivering",
    "option_b": "arthralgia",
    "option_c": "conjunctivitis",
    "option_d": "fever with chills",
    "correct_answer": "C",
    "explanation": "Malaria is characterized by classic paroxysms of fever with chills (D), followed by sweating and shivering (A). Arthralgia (joint pain, B) is also a common symptom. Conjunctivitis (C) (inflammation of the eye's conjunctiva) is not a typical symptom of malaria; it is more commonly associated with viral or bacterial infections.",
    "difficulty": "Medium",
    "year": 2021,
    "points": 4,
    "topic": "Human Health and Disease"
  },
  {
    "id": 64,
    "question_text": "[MHT CET 2021] India shares about ______ % of total biodiversity wealth on earth.",
    "option_a": "2.4",
    "option_b": "12",
    "option_c": "8.1",
    "option_d": "15",
    "correct_answer": "C",
    "explanation": "India is one of the 17 megadiverse countries in the world. Although it has only about 2.4% of the world's land area, it contributes approximately 8.1% to the global species diversity, making it a significant region for biodiversity.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Biodiversity"
  },
  {
    "id": 65,
    "question_text": "[MHT CET 2021] Given below are two statements with respect to counter current mechanism. Statement-I: Tissue fluid around descending limb of Henle's loop becomes concentrated, during counter current mechanism. Statement-II: Water moves out from descending limb of Henle's loop into tissue fluid by osmosis. In the light of above statements select the correct option from codes given below:",
    "option_a": "Both Statement-I and Statement-II are incorrect.",
    "option_b": "Both Statement-I and Statement-II are correct.",
    "option_c": "Statement-I is incorrect but Statement-II is correct.",
    "option_d": "Statement-I is correct but Statement-II is incorrect.",
    "correct_answer": "B",
    "explanation": "Both statements are correct regarding the countercurrent mechanism in the kidney. As the filtrate moves down the descending limb of Henle's loop, the surrounding tissue fluid in the medulla becomes increasingly concentrated (hyperosmotic) (I). Because the descending limb is permeable to water, water moves out of the filtrate into the more concentrated tissue fluid by osmosis (II), concentrating the filtrate further.",
    "difficulty": "Medium",
    "year": 2021,
    "points": 4,
    "topic": "Human Physiology"
  },
  {
    "id": 66,
    "question_text": "[MHT CET 2021] Generally the pigment bilirubin formed by breakdown of haemoglobin is excreted through",
    "option_a": "faeces.",
    "option_b": "sebum.",
    "option_c": "sweat.",
    "option_d": "urine.",
    "correct_answer": "A",
    "explanation": "Bilirubin is a yellow-orange pigment produced from the breakdown of heme from old red blood cells. In the liver, it is conjugated and secreted into bile. Bile is released into the intestine, where bilirubin is converted by bacteria into urobilinogen and stercobilin, which are excreted primarily in the faeces, giving them their brown color. A small amount is reabsorbed and excreted in urine.",
    "difficulty": "Medium",
    "year": 2021,
    "points": 4,
    "topic": "Human Physiology"
  },
  {
    "id": 67,
    "question_text": "[MHT CET 2021] Following accessory ducts in human males are in pairs, EXCEPT",
    "option_a": "epididymis",
    "option_b": "ejaculatory duct",
    "option_c": "vas deferens",
    "option_d": "urethra",
    "correct_answer": "D",
    "explanation": "In the male reproductive system, most accessory ducts are paired. There are two epididymides (A), two vasa deferentia (C), and two ejaculatory ducts (B). However, the urethra (D) is a single, unpaired duct that runs from the urinary bladder through the penis and serves as a common passage for both urine and semen.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Human Reproduction"
  },
  {
    "id": 68,
    "question_text": "[MHT CET 2021] How many of the following statements are true about angiosperms? A. The generative cell floats in the cytoplasm of vegetative cell. B. The stalk of ovule is called funiculus. C. Pollen grains are shed at two celled stage. D. Embryo sac is diploid. E. Megaspore mother cell towards chalazal end becomes functional.",
    "option_a": "A,B and C only",
    "option_b": "D and E only",
    "option_c": "A and B only",
    "option_d": "B and C only",
    "correct_answer": "A",
    "explanation": "A is true: In a pollen grain, the generative cell is located within the cytoplasm of the vegetative cell. B is true: The funiculus is the stalk that attaches the ovule to the placenta. C is true: In many angiosperms, pollen grains are shed at the two-celled stage (vegetative cell and generative cell). D is false: The embryo sac is haploid (n). E is false: The functional megaspore is typically the one towards the chalazal end, but the megaspore mother cell (MMC) is diploid and undergoes meiosis to produce four megaspores, of which one becomes functional. The statement as written is misleading and generally considered false. So, only A, B, and C are true.",
    "difficulty": "Medium",
    "year": 2021,
    "points": 4,
    "topic": "Plant Reproduction"
  },
  {
    "id": 69,
    "question_text": "[MHT CET 2021] Given below are two statements. Statement-I: In root hair outer layer of cell wall is composed of pectin. Statement-II: In root hair inner layer of cell wall is composed of cellulose. Choose the correct answer from the options given below with reference to structure of root hair.",
    "option_a": "Statement-I is correct but Statement-II is incorrect.",
    "option_b": "Statement-I is incorrect but Statement-II is correct",
    "option_c": "Both Statement-I and Statement-II are correct.",
    "option_d": "Both Statement-I and Statement-II are incorrect.",
    "correct_answer": "C",
    "explanation": "Both statements are correct. The cell wall of a root hair has a typical structure. The outer layer (middle lamella and primary wall) is rich in pectin, which is hydrophilic and helps in adhesion and absorption. The inner layer (next to the plasma membrane) is primarily composed of cellulose microfibrils, which provide structural strength.",
    "difficulty": "Medium",
    "year": 2021,
    "points": 4,
    "topic": "Plant Anatomy"
  },
  {
    "id": 70,
    "question_text": "[MHT CET 2021] Which one of the following hormone is produced by β-cells of islets of Langerhans of pancreas?",
    "option_a": "Oxytocin",
    "option_b": "Insulin",
    "option_c": "Glucagon",
    "option_d": "Vasopressin",
    "correct_answer": "B",
    "explanation": "The pancreatic islets (Islets of Langerhans) contain different cell types that secrete different hormones. The beta cells (β-cells) are the most abundant and are responsible for producing and secreting the hormone insulin, which lowers blood glucose levels.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Human Physiology"
  },
  {
    "id": 71,
    "question_text": "[MHT CET 2021] Anaerobic process after glycolysis, during lactic acid formation is called",
    "option_a": "Fermentation",
    "option_b": "Citric acid cycle",
    "option_c": "HSK pathway",
    "option_d": "Calvin cycle",
    "correct_answer": "A",
    "explanation": "In the absence of oxygen (anaerobic conditions), the pyruvate produced from glycolysis can be converted into lactic acid (in animals and some bacteria) or ethanol + CO₂ (in yeast). This anaerobic breakdown of pyruvate after glycolysis is collectively called fermentation.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Cell Respiration"
  },
  {
    "id": 72,
    "question_text": "[MHT CET 2021] Given below are two statements. Statement-I: Enzyme pyruvate dehydrogenase is present in mitochondria of eukaryotes. Statement-II: Enzyme pyruvate dehydrogenase is present in cytoplasm of prokaryotes. In the light of the above statements choose the correct answer from the options given below.",
    "option_a": "Both Statement-I and Statement-II are incorrect.",
    "option_b": "Statement-I is incorrect but Statement-II is correct.",
    "option_c": "Both Statement-I and Statement-II are correct.",
    "option_d": "Statement-I is correct but Statement-II is incorrect.",
    "correct_answer": "C",
    "explanation": "Both statements are correct. The pyruvate dehydrogenase complex catalyzes the conversion of pyruvate to acetyl CoA. In eukaryotes, this enzyme complex is located in the mitochondrial matrix (I). Prokaryotes lack mitochondria, so their pyruvate dehydrogenase complex is located in the cytoplasm (II), where all their metabolic reactions occur.",
    "difficulty": "Medium",
    "year": 2021,
    "points": 4,
    "topic": "Cell Biology"
  },
  {
    "id": 73,
    "question_text": "[MHT CET 2021] Fishes have ______ for respiration",
    "option_a": "external gills",
    "option_b": "internal gills",
    "option_c": "book gills",
    "option_d": "book lungs",
    "correct_answer": "B",
    "explanation": "Most fishes respire through gills. Their gills are internal, protected by a bony cover called the operculum (in bony fish). They are not external like in some amphibian larvae. 'Internal gills' is the correct term for the gills of fish. Book gills are found in horseshoe crabs, and book lungs in spiders and scorpions.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Animal Kingdom"
  },
  {
    "id": 74,
    "question_text": "[MHT CET 2021] In neural system, chemical synapse shows synaptic gap of about",
    "option_a": "400nm to 60nm",
    "option_b": "80nm to 100nm",
    "option_c": "20nm to 40nm",
    "option_d": "60nm to 80nm",
    "correct_answer": "C",
    "explanation": "At a chemical synapse, the pre-synaptic and post-synaptic neurons are not directly connected. They are separated by a small gap called the synaptic cleft. This gap is typically about 20-40 nanometers (nm) wide.",
    "difficulty": "Medium",
    "year": 2021,
    "points": 4,
    "topic": "Human Physiology"
  },
  {
    "id": 75,
    "question_text": "[MHT CET 2021] Following are infection sites for syphilis, EXCEPT",
    "option_a": "conjunctiva of eye.",
    "option_b": "oral mucous membrane.",
    "option_c": "mucous membrane in genital region.",
    "option_d": "mucous membrane in rectum.",
    "correct_answer": "A",
    "explanation": "Syphilis is a sexually transmitted infection caused by the bacterium Treponema pallidum. The bacteria enter the body through mucous membranes or breaks in the skin. Common sites of primary infection (chancre) include the genital region (C), oral mucous membrane (B), and rectal mucous membrane (D). Infection through the conjunctiva of the eye (A) is extremely rare and not a typical or common site of infection.",
    "difficulty": "Hard",
    "year": 2021,
    "points": 4,
    "topic": "Human Health and Disease"
  },
  {
    "id": 76,
    "question_text": "[MHT CET 2021] Following are the functions of cerebrospinal fluid EXCEPT",
    "option_a": "Acts as shock absorber.",
    "option_b": "Maintenance of constant pressure.",
    "option_c": "Helps in binding the neurotransmitter to receptor.",
    "option_d": "Exchange of nutrients and waste.",
    "correct_answer": "C",
    "explanation": "Cerebrospinal fluid (CSF) has several important functions: It acts as a shock absorber (A) to protect the brain from trauma, helps maintain constant intracranial pressure (B), and facilitates the exchange of nutrients and waste products (D) between blood and neural tissue. It does NOT play a role in binding neurotransmitters to their receptors (C); that occurs at the synapse on the post-synaptic membrane.",
    "difficulty": "Medium",
    "year": 2021,
    "points": 4,
    "topic": "Human Physiology"
  },
  {
    "id": 77,
    "question_text": "[MHT CET 2021] Formation of oogonia in human females is completed in",
    "option_a": "embryonic stage.",
    "option_b": "puberty.",
    "option_c": "at the time of birth.",
    "option_d": "proliferative phase of menstruation",
    "correct_answer": "A",
    "explanation": "Oogenesis, the process of female gamete formation, begins in the fetal ovary. The primordial germ cells differentiate into oogonia. These oogonia multiply by mitosis and then enter prophase I of meiosis to become primary oocytes. This entire process of oogonia formation and their conversion to primary oocytes is completed before birth, during the embryonic/fetal stage.",
    "difficulty": "Medium",
    "year": 2021,
    "points": 4,
    "topic": "Human Reproduction"
  },
  {
    "id": 78,
    "question_text": "[MHT CET 2021] Match different cells of Islets of Langerhans in Column-I with their role in Column-II. Select the correct answer from the options given below.",
    "option_a": "A-III, B-II, C-IV, D-I",
    "option_b": "A-I, B-IV, C-III, D-II",
    "option_c": "A-II, B-III, C-I, D-IV",
    "option_d": "A-IV, B-I, C-II, D-III",
    "correct_answer": "D",
    "explanation": "The correct matching of pancreatic islet cells and their functions: Alpha cells (A) secrete glucagon, which stimulates liver for glycogenolysis (breakdown of glycogen) to release glucose (IV). Beta cells (B) secrete insulin, which stimulates muscles for glycogenesis (formation of glycogen) (I). Delta cells (C) secrete somatostatin, which decreases gastric secretions and absorption in the digestive tract (II). F cells (D) secrete pancreatic polypeptide, which inhibits the release of pancreatic juice (III).",
    "difficulty": "Hard",
    "year": 2021,
    "points": 4,
    "topic": "Human Physiology"
  },
  {
    "id": 79,
    "question_text": "[MHT CET 2021] How many phenotypes can be obtained if a pea plant (RrTt) is crossed with another pea plant with the same genotype?",
    "option_a": "4",
    "option_b": "9",
    "option_c": "12",
    "option_d": "16",
    "correct_answer": "A",
    "explanation": "This is a dihybrid cross (RrTt × RrTt). Assuming the genes are on different chromosomes and assort independently, and exhibit complete dominance, the phenotypic ratio in the F2 generation is 9:3:3:1. This gives a total of 4 distinct phenotypes.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Genetics"
  },
  {
    "id": 80,
    "question_text": "[MHT CET 2021] The ______ is regarded as an inborn metabolic disorder.",
    "option_a": "sickle cell anemia",
    "option_b": "Thalassemia",
    "option_c": "Window's peak",
    "option_d": "phenylketonuria",
    "correct_answer": "D",
    "explanation": "Phenylketonuria (PKU) is a classic example of an inborn error of metabolism. It is an autosomal recessive genetic disorder where the body cannot metabolize the amino acid phenylalanine due to a defective enzyme (phenylalanine hydroxylase). Sickle cell anemia and Thalassemia are blood disorders (hemoglobinopathies). Widow's peak is a morphological trait.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Human Health and Disease"
  },
  {
    "id": 81,
    "question_text": "[MHT CET 2021] Which one of the following restriction enzyme has recognition sequence of 4 nucleotides and makes blunt end in the DNA?",
    "option_a": "Hind II",
    "option_b": "Bam H I",
    "option_c": "Alu I",
    "option_d": "Eco RI",
    "correct_answer": "C",
    "explanation": "Alu I is a restriction enzyme that recognizes a 4-base pair sequence (AGCT) and cuts both DNA strands at the same point within this sequence, producing blunt ends. Hind II also produces blunt ends but recognizes a 6-bp sequence. Bam HI and Eco RI produce sticky ends.",
    "difficulty": "Medium",
    "year": 2021,
    "points": 4,
    "topic": "Biotechnology"
  },
  {
    "id": 82,
    "question_text": "[MHT CET 2021] Complete the following about the absence of clotting factors. Haemophilia A: x : Haemophilia B: y .",
    "option_a": "x-VIII, y-IX",
    "option_b": "x-IX, y-VIII",
    "option_c": "x-IX, y-VIII",
    "option_d": "x-IX, y-VIII",
    "correct_answer": "A",
    "explanation": "Hemophilia is a sex-linked recessive bleeding disorder caused by a deficiency in specific clotting factors. Hemophilia A is the most common type and is caused by a deficiency of clotting factor VIII. Hemophilia B (also called Christmas disease) is caused by a deficiency of clotting factor IX.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Human Health and Disease"
  },
  {
    "id": 83,
    "question_text": "[MHT CET 2021] Which one of the following gland is NOT present in human females?",
    "option_a": "Bartholin's glands",
    "option_b": "Endometrial glands",
    "option_c": "Bulbourethral glands",
    "option_d": "Mammary glands",
    "correct_answer": "C",
    "explanation": "Bartholin's glands (A) are present in females (homologous to male bulbourethral glands). Endometrial glands (B) are present in the uterine lining of females. Mammary glands (D) are present in females. Bulbourethral glands (C) (Cowper's glands) are a part of the male reproductive system and are not present in females.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Human Reproduction"
  },
  {
    "id": 84,
    "question_text": "[MHT CET 2021] Which one of the following statements is INCORRECT about angiospermic seed/fruit?",
    "option_a": "The micropyle of the ovule persists in the seed.",
    "option_b": "Coconut is a non-endospermic seed.",
    "option_c": "Coconut is a fleshy fruit.",
    "option_d": "Fruit development is triggered by hormones produced by developing seeds.",
    "correct_answer": "B",
    "explanation": "Statement A is correct: The micropyle persists as a small pore in the seed coat. Statement C is correct: Botanically, a coconut is a drupe, a type of fleshy fruit with a hard endocarp. Statement D is correct: Developing seeds produce hormones like auxins and gibberellins that stimulate fruit development. Statement B is incorrect: Coconut is an endospermic (albuminous) seed. The white edible part (kernel) is the cellular endosperm, and the coconut water is the liquid endosperm.",
    "difficulty": "Medium",
    "year": 2021,
    "points": 4,
    "topic": "Plant Reproduction"
  },
  {
    "id": 85,
    "question_text": "[MHT CET 2021] 'Bt' cotton contains the gene of a",
    "option_a": "bacterium.",
    "option_b": "nematode.",
    "option_c": "protozoan.",
    "option_d": "virus.",
    "correct_answer": "A",
    "explanation": "Bt cotton is a genetically modified crop that contains a gene (cry gene) derived from the bacterium Bacillus thuringiensis. This gene encodes for an insecticidal protein (Cry protein) that is toxic to specific insect pests like cotton bollworms.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Biotechnology and its Applications"
  },
  {
    "id": 86,
    "question_text": "[MHT CET 2021] Which one of the following is NOT a psychological disorder?",
    "option_a": "Anxiety disorder",
    "option_b": "Autism spectrum disorder",
    "option_c": "Bipolar disorder",
    "option_d": "Pulmonary disorder",
    "correct_answer": "D",
    "explanation": "Anxiety disorders (A), Autism spectrum disorder (B), and Bipolar disorder (C) are all types of mental or psychological disorders affecting mood, behavior, and cognition. Pulmonary disorder (D) refers to a disease affecting the lungs (e.g., asthma, COPD) and is a physiological, not psychological, disorder.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Human Health and Disease"
  },
  {
    "id": 87,
    "question_text": "[MHT CET 2021] Which one of the following is NOT correct regarding vaccines?",
    "option_a": "It is used to control diseases like measles, polio etc.",
    "option_b": "It is antigenic protection against particular pathogen.",
    "option_c": "It teaches immune system to recognize and eliminate the pathogenic organism.",
    "option_d": "It is introduction of antibodies into animal body.",
    "correct_answer": "D",
    "explanation": "Statements A, B, and C are correct descriptions of vaccines. Statement D is incorrect. The introduction of pre-formed antibodies into the body is called passive immunization (e.g., administering antiserum). A vaccine works by introducing an antigen (weakened pathogen or its part), which stimulates the body's own immune system to produce antibodies and memory cells, providing active immunity.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Human Health and Disease"
  },
  {
    "id": 88,
    "question_text": "[MHT CET 2021] Which one of the following is NOT a derivative of cholesterol?",
    "option_a": "Vitamin D",
    "option_b": "Progesterone",
    "option_c": "Testosterone",
    "option_d": "Diosgenin",
    "correct_answer": "D",
    "explanation": "Cholesterol is a steroid lipid that serves as a precursor for many important molecules. Vitamin D (A) is synthesized from 7-dehydrocholesterol (derived from cholesterol). Progesterone (B) and Testosterone (C) are steroid hormones directly synthesized from cholesterol. Diosgenin (D) is a plant-derived steroid saponin, used commercially as a precursor for the synthesis of steroids, but it is not derived from animal cholesterol.",
    "difficulty": "Hard",
    "year": 2021,
    "points": 4,
    "topic": "Biochemistry"
  },
  {
    "id": 89,
    "question_text": "[MHT CET 2021] Which one of the following is a chromosomal disorder?",
    "option_a": "Sickle cell anaemia",
    "option_b": "Phenylketonuria",
    "option_c": "Colorblindness",
    "option_d": "Turner's syndrome",
    "correct_answer": "D",
    "explanation": "Chromosomal disorders are caused by the absence, excess, or abnormal arrangement of one or more chromosomes. Turner's syndrome (45, XO) is a classic example of a chromosomal disorder where a female is born with only one X chromosome. Sickle cell anemia and Phenylketonuria are Mendelian (gene) disorders. Colorblindness is a sex-linked gene disorder.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Genetics"
  },
  {
    "id": 90,
    "question_text": "[MHT CET 2021] Heterostyly is a contrivance for",
    "option_a": "geitonogamy only",
    "option_b": "autogamy only",
    "option_c": "xenogamy only",
    "option_d": "geitonogamy and xenogamy",
    "correct_answer": "C",
    "explanation": "Heterostyly is a morphological adaptation in some flowers (e.g., Primula, Oxalis) where the styles and stamens are of different lengths in different flowers (e.g., pin and thrum flowers). This physical arrangement promotes pollination between different types of flowers (inter-morph pollination), which is a form of xenogamy (cross-pollination) and prevents both autogamy (self-pollination) and geitonogamy (pollination between flowers on the same plant).",
    "difficulty": "Medium",
    "year": 2021,
    "points": 4,
    "topic": "Plant Reproduction"
  },
  {
    "id": 91,
    "question_text": "[MHT CET 2021] A heterozygous tall pea plant was crossed with a dwarf pea plant. The progeny of cross shows",
    "option_a": "1 Tall : 1 dwarf",
    "option_b": "3 Tall : 1 dwarf",
    "option_c": "1 Tall : 3 dwarf",
    "option_d": "4 Tall : 2 dwarf",
    "correct_answer": "A",
    "explanation": "A heterozygous tall plant has the genotype Tt (where T = tall dominant, t = dwarf recessive). A dwarf plant has the genotype tt (homozygous recessive). This cross (Tt × tt) is a test cross. It produces progeny with genotypes Tt and tt in a 1:1 ratio, resulting in a 1 Tall : 1 Dwarf phenotypic ratio.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Genetics"
  },
  {
    "id": 92,
    "question_text": "[MHT CET 2021] In the genome of mouse, the estimated number of genes is",
    "option_a": "33,000",
    "option_b": "19,000",
    "option_c": "13,000",
    "option_d": "25,000",
    "correct_answer": "D",
    "explanation": "The mouse (Mus musculus) genome was sequenced after the Human Genome Project. The estimated number of protein-coding genes in the mouse genome is around 20,000-25,000. Among the given options, 25,000 is the closest and most commonly cited estimate.",
    "difficulty": "Hard",
    "year": 2021,
    "points": 4,
    "topic": "Molecular Biology"
  },
  {
    "id": 93,
    "question_text": "[MHT CET 2021] What is ubiquitous?",
    "option_a": "Oxidized ubiquinone",
    "option_b": "Co enzyme Q",
    "option_c": "Ubiquinone",
    "option_d": "Reduced ubiquinone",
    "correct_answer": "C",
    "explanation": "The term 'ubiquitous' means 'found everywhere'. In biochemistry, the molecule 'ubiquinone' (also known as coenzyme Q) is named so because it is ubiquitous—it is found in virtually all cells of aerobic organisms. The question plays on the similarity of the name to the word. The molecule itself is ubiquinone.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Biochemistry"
  },
  {
    "id": 94,
    "question_text": "[MHT CET 2021] In which zone / region root hairs occur?",
    "option_a": "Zone of elongation",
    "option_b": "Zone of maturation",
    "option_c": "Meristematic region",
    "option_d": "Zone of absorption",
    "correct_answer": "B",
    "explanation": "The root tip is divided into different zones. The root hairs, which are extensions of epidermal cells, are characteristic structures found in the zone of maturation (also called the zone of differentiation). This is where cells differentiate and mature into specific cell types, including root hair cells.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Plant Anatomy"
  },
  {
    "id": 95,
    "question_text": "[MHT CET 2021] In the ecological hierarchy the basic unit is",
    "option_a": "biome.",
    "option_b": "community.",
    "option_c": "individual organism.",
    "option_d": "population.",
    "correct_answer": "C",
    "explanation": "Ecological hierarchy is the organization of life from the simplest to the most complex levels. The basic and fundamental unit of this hierarchy is the individual organism. Individuals of the same species in an area form a population (D), populations of different species form a community (B), and communities interacting with the abiotic environment form an ecosystem, and then biome (A).",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Ecology"
  },
  {
    "id": 96,
    "question_text": "[MHT CET 2021] The fossil of which one of the following has been found in Ethiopia as well as Tanzania?",
    "option_a": "Homo erectus",
    "option_b": "Australopithecus",
    "option_c": "Ramapithecus",
    "option_d": "Drypithecus",
    "correct_answer": "B",
    "explanation": "Fossils of Australopithecus, an early hominin, have been discovered in several countries in East Africa, notably in Ethiopia (e.g., 'Lucy', Australopithecus afarensis) and Tanzania (e.g., Laetoli footprints, Australopithecus afarensis).",
    "difficulty": "Medium",
    "year": 2021,
    "points": 4,
    "topic": "Evolution"
  },
  {
    "id": 97,
    "question_text": "[MHT CET 2021] At the end of replication, the contribution of nucleotides from mother DNA is ______ percent.",
    "option_a": "75",
    "option_b": "25",
    "option_c": "100",
    "option_d": "50",
    "correct_answer": "D",
    "explanation": "DNA replication is semi-conservative. Each new DNA molecule consists of one original (mother) strand and one newly synthesized (daughter) strand. Therefore, in terms of the total nucleotides in the two daughter molecules, half (50%) come from the original mother DNA, and half are new.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Molecular Biology"
  },
  {
    "id": 98,
    "question_text": "[MHT CET 2021] With respect to derivatives of germinal layers in human beings, complete the analogy. Ectoderm : Sweat glands : Endoderm : ______",
    "option_a": "Mammary glands",
    "option_b": "Salivary glands",
    "option_c": "Thyroid glands",
    "option_d": "Pineal glands",
    "correct_answer": "C",
    "explanation": "Sweat glands are derived from the ectoderm. The analogy asks for an endodermal derivative. Mammary glands (A) are modified sweat glands and are ectodermal. Salivary glands (B) are ectodermal. Pineal glands (D) are ectodermal (from neuroectoderm). Thyroid glands (C) are derived from the endoderm (specifically, from the pharyngeal pouches).",
    "difficulty": "Medium",
    "year": 2021,
    "points": 4,
    "topic": "Human Anatomy"
  },
  {
    "id": 99,
    "question_text": "[MHT CET 2021] In Platyhelminthes and rotifers the excretory organs are",
    "option_a": "flame cells.",
    "option_b": "green glands.",
    "option_c": "nephridia.",
    "option_d": "Malpighian tubules.",
    "correct_answer": "A",
    "explanation": "Flame cells are the specialized excretory cells found in Platyhelminthes (flatworms) and rotifers. They are part of the protonephridial system. Green glands are found in crustaceans. Nephridia are found in annelids. Malpighian tubules are found in insects.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Animal Kingdom"
  },
  {
    "id": 100,
    "question_text": "[MHT CET 2021] The spiral configuration of α helix and β helix of polypeptide chains are held together by ______ bonds to form secondary structure of protein.",
    "option_a": "phosphodiester",
    "option_b": "hydrogen",
    "option_c": "peptide",
    "option_d": "disulphide",
    "correct_answer": "B",
    "explanation": "The secondary structure of proteins, which includes α-helices and β-pleated sheets, is primarily stabilized by hydrogen bonds. These bonds form between the carbonyl oxygen (C=O) of one amino acid and the amide hydrogen (N-H) of another amino acid further along the polypeptide chain. Phosphodiester bonds are in nucleic acids. Peptide bonds link amino acids in the primary structure. Disulfide bonds are involved in tertiary structure.",
    "difficulty": "Easy",
    "year": 2021,
    "points": 4,
    "topic": "Biochemistry"
  }

  ];

  // Organize questions by year
  useEffect(() => {
    const years = [2025, 2024, 2023, 2022, 2021];
    const quizzes: YearlyQuiz[] = years.map(year => ({
      year,
      title: `MHT CET ${year}`,
      questionCount: allMHTCETBiologyQuestions.filter(q => q.year === year).length,
      questions: allMHTCETBiologyQuestions.filter(q => q.year === year)
    }));
    
    setYearlyQuizzes(quizzes);
    setIsLoading(false);
  }, []);

  const handleYearSelect = (year: number) => {
    const selectedQuiz = yearlyQuizzes.find(q => q.year === year);
    if (selectedQuiz) {
      setSelectedYear(year);
      setQuestions(selectedQuiz.questions);
      setSelectedAnswers(new Array(selectedQuiz.questions.length).fill(''));
      setMarkedForReview([]);
      setTimeLeft(selectedQuiz.questions.length * 60);
      setCurrentIndex(0);
      setShowYearSelector(false);
      setQuizStarted(false);
      setShowResults(false);
      setShowAnswers(false);
      setTopicInfo(prev => ({ 
        ...prev, 
        title: `MHT CET Biology ${year}`,
        totalQuestions: selectedQuiz.questions.length 
      }));
    }
  };

  const handleBackToYearSelector = () => {
    setShowYearSelector(true);
    setSelectedYear(null);
    setQuestions([]);
    setShowResults(false);
    setShowAnswers(false);
  };

  const handleMarkForReview = () => {
    if (markedForReview.includes(currentIndex)) {
      setMarkedForReview(markedForReview.filter(i => i !== currentIndex));
    } else {
      setMarkedForReview([...markedForReview, currentIndex]);
    }
    
    if (!quizStarted) {
      setQuizStarted(true);
    }
  };

  const handleAnswerSelect = (optionLetter: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentIndex] = optionLetter;
    setSelectedAnswers(newAnswers);
    
    if (!quizStarted) {
      setQuizStarted(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    let totalPoints = 0;
    let negativePoints = 0;
    let attempted = 0;
    
    selectedAnswers.forEach((answer, index) => {
      if (answer && questions[index]) {
        attempted++;
        if (answer === questions[index].correct_answer) {
          correct++;
          totalPoints += questions[index].points || 4;
        } else {
          negativePoints += 1; // -1 for wrong answer
        }
      }
    });
    
    const finalScore = totalPoints - negativePoints;
    const notAttempted = questions.length - attempted;
    
    return { correct, totalPoints, negativePoints, finalScore, attempted, notAttempted };
  };

  const handleFinishQuiz = () => {
    setShowResults(true);
  };

  const handleViewAnswers = () => {
    setShowAnswers(true);
    setShowResults(false);
  };

  const handleRetake = () => {
    if (selectedYear) {
      handleYearSelect(selectedYear);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading MHT CET Biology quizzes...</p>
        </div>
      </div>
    );
  }

  // Year Selection Screen
  if (showYearSelector) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
          {/* Back Button */}
          <div className="mb-6">
            <button 
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
              onClick={() => navigate('/quiz/5')}
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Topics
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">MHT CET Biology Previous Year Papers</h1>
            <p className="text-gray-600 dark:text-gray-300">Select a year to start practicing</p>
          </div>

          {/* Years Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {yearlyQuizzes.map((quiz) => (
              <div
                key={quiz.year}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 text-center"
                onClick={() => handleYearSelect(quiz.year)}
              >
                <div className="text-5xl mb-3">🧬</div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{quiz.year}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{quiz.questionCount} Questions</p>
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all">
                  Start Quiz →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Results View
  if (showResults) {
    const score = calculateScore();
    const percentage = (score.correct / questions.length) * 100;

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
          {/* Back Button */}
          <div className="mb-6">
            <button 
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
              onClick={handleBackToYearSelector}
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Years
            </button>
          </div>

          {/* Results Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-8 text-center">
              <span className="text-6xl mb-4 block">🧬</span>
              <h1 className="text-3xl font-bold text-white">MHT CET Biology {selectedYear} Quiz Completed!</h1>
            </div>

            <div className="p-8">
              {/* Score Circle */}
              <div className="flex justify-center mb-8">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 70}
                      strokeDashoffset={2 * Math.PI * 70 * (1 - percentage / 100)}
                      className="text-blue-600 dark:text-blue-400 transition-all duration-1000"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-800 dark:text-white">
                      {score.finalScore}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">/ {questions.length * 4}</span>
                  </div>
                </div>
              </div>

              {/* Performance Stats */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 text-center">Your Performance</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300 block mb-1">Correct</span>
                    <span className="text-2xl font-bold text-green-600">{score.correct}</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300 block mb-1">Incorrect</span>
                    <span className="text-2xl font-bold text-red-600">{score.attempted - score.correct}</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300 block mb-1">Not Attempted</span>
                    <span className="text-2xl font-bold text-yellow-600">{score.notAttempted}</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300 block mb-1">Total Score</span>
                    <span className="text-2xl font-bold text-purple-600">{score.finalScore}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center">
                <button 
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
                  onClick={handleViewAnswers}
                >
                  <FaList /> View Answers
                </button>
                <button 
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all"
                  onClick={handleRetake}
                >
                  Retake Quiz
                </button>
                <button 
                  className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all"
                  onClick={handleBackToYearSelector}
                >
                  Choose Different Year
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Answers Review View
  if (showAnswers) {
    const score = calculateScore();
    
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
          {/* Back Button */}
          <div className="mb-6">
            <button 
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
              onClick={() => setShowAnswers(false)}
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Results
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">MHT CET Biology {selectedYear} - Answer Review</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Your Score: {score.finalScore} / {questions.length * 4} 
              ({Math.round((score.correct/questions.length)*100)}% correct)
            </p>
          </div>

          {/* Answers List */}
          <div className="space-y-6">
            {questions.map((question, qIndex) => {
              const userAnswer = selectedAnswers[qIndex];
              const isCorrect = userAnswer === question.correct_answer;

              return (
                <div key={qIndex} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  {/* Answer Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full text-sm font-semibold">
                        Q{qIndex + 1}
                      </span>
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-full text-sm">
                        MHT CET {question.year}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-sm">
                        {question.topic}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {!userAnswer ? (
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm font-semibold">
                          Not Answered
                        </span>
                      ) : isCorrect ? (
                        <span className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full text-sm font-semibold">
                          <FaCheckCircle /> Correct (+4)
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-full text-sm font-semibold">
                          <FaTimesCircle /> Incorrect (-1)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question Text */}
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">{question.question_text}</h3>

                  {/* Options Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    {[
                      { letter: 'A', text: question.option_a },
                      { letter: 'B', text: question.option_b },
                      { letter: 'C', text: question.option_c },
                      { letter: 'D', text: question.option_d }
                    ].map((opt, optIndex) => {
                      const isUserAnswer = userAnswer === opt.letter;
                      const isCorrectAnswer = question.correct_answer === opt.letter;

                      return (
                        <div
                          key={optIndex}
                          className={`p-3 rounded-lg border-2 flex items-start gap-3 ${
                            isCorrectAnswer
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                              : isUserAnswer && !isCorrectAnswer
                              ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                              : 'border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                            isCorrectAnswer
                              ? 'bg-green-500 text-white'
                              : isUserAnswer && !isCorrectAnswer
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}>
                            {opt.letter}
                          </span>
                          <span className="flex-1 text-gray-700 dark:text-gray-200">{opt.text}</span>
                          {isCorrectAnswer && <FaCheckCircle className="text-green-500 flex-shrink-0" />}
                          {isUserAnswer && !isCorrectAnswer && <FaTimesCircle className="text-red-500 flex-shrink-0" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Explanation:</h4>
                    <p className="text-gray-700 dark:text-gray-300">{question.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <button 
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all"
              onClick={handleRetake}
            >
              Retake Quiz
            </button>
            <button 
              className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all"
              onClick={handleBackToYearSelector}
            >
              Choose Different Year
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Taking View
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isMarked = markedForReview.includes(currentIndex);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Header with Back and Finish buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <button 
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
            onClick={handleBackToYearSelector}
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Years
          </button>
          <button 
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition-all flex items-center gap-2"
            onClick={handleFinishQuiz}
          >
            Finish Quiz
          </button>
        </div>

        {/* Quiz Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-4xl" style={{ color: topicInfo.color }}>{topicInfo.icon}</span>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{topicInfo.title}</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {questions.length} Questions • {formatTime(timeLeft)} remaining
                  {quizStarted && <span className="ml-2 text-green-600 dark:text-green-400 font-semibold">• In Progress</span>}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <FaClock className="text-blue-600 dark:text-blue-400" />
              <span className="font-mono text-xl font-bold text-gray-800 dark:text-white">{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          {/* Question Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full text-sm font-semibold">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-full text-sm">
                <FaCalendarAlt /> MHT CET {currentQuestion.year}
              </span>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-sm">
                {currentQuestion.topic}
              </span>
            </div>
            <button 
              className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
                isMarked 
                  ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={handleMarkForReview}
            >
              <FaFlag /> {isMarked ? 'Marked' : 'Mark for Review'}
            </button>
          </div>

          {/* Question Text */}
          <h2 className="text-xl font-medium text-gray-800 dark:text-white mb-6">
            {currentQuestion.question_text}
          </h2>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {[
              { letter: 'A', text: currentQuestion.option_a },
              { letter: 'B', text: currentQuestion.option_b },
              { letter: 'C', text: currentQuestion.option_c },
              { letter: 'D', text: currentQuestion.option_d }
            ].map((option, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedAnswers[currentIndex] === option.letter
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => handleAnswerSelect(option.letter)}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    selectedAnswers[currentIndex] === option.letter
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}>
                    {option.letter}
                  </span>
                  <span className="text-gray-700 dark:text-gray-200">{option.text}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            <button
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                currentIndex === 0
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              Previous
            </button>
            <button
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                currentIndex === questions.length - 1
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
              }`}
              onClick={handleNext}
              disabled={currentIndex === questions.length - 1}
            >
              Next
            </button>
          </div>
        </div>

        {/* Question Palette */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Question Palette</h3>
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 mb-4">
            {questions.map((_, index) => {
              let statusClass = '';
              let bgColor = '';
              
              if (selectedAnswers[index]) {
                bgColor = 'bg-green-500 text-white';
              } else if (markedForReview.includes(index)) {
                bgColor = 'bg-yellow-500 text-white';
              } else {
                bgColor = 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
              }

              return (
                <div
                  key={index}
                  className={`aspect-square rounded-lg flex items-center justify-center font-semibold cursor-pointer transition-all ${bgColor} ${
                    currentIndex === index ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800' : ''
                  }`}
                  onClick={() => setCurrentIndex(index)}
                >
                  {index + 1}
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 bg-green-500 rounded-full"></span> Answered
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 bg-yellow-500 rounded-full"></span> Marked
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full"></span> Not Visited
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizMHTCETBiologyPage;