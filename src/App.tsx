import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronRight, 
  ChevronLeft,
  Clock,
  ShieldCheck,
  User,
  Lock,
  Sparkles,
  Phone,
  Mail,
  Heart,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Plus,
  FileText,
  MapPin,
  Eye,
  EyeOff,
  Search,
  Bell,
  Settings,
  HelpCircle,
  Moon,
  LogOut,
  Home,
  Users,
  Camera,
  MessageSquare,
  Share2,
  MoreHorizontal,
  Image,
  Pencil,
  Trash2,
  Star
} from "lucide-react";

type ViewState = "welcome" | "signup" | "login" | "dashboard";
type SignupRole = "cuidador" | "dono";
type DonoStep = "info" | "pet";

// Helper components & masking format routines for Portuguese documents & phones
const formatPhone = (val: string) => {
  let clean = val.replace(/\D/g, "");
  if (clean.length > 11) clean = clean.slice(0, 11);
  if (clean.length > 10) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
  } else if (clean.length > 6) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`;
  } else if (clean.length > 2) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2)}`;
  } else if (clean.length > 0) {
    return `(${clean}`;
  }
  return clean;
};

const formatCPF = (val: string) => {
  let clean = val.replace(/\D/g, "");
  if (clean.length > 11) clean = clean.slice(0, 11);
  if (clean.length > 9) {
    return `${clean.slice(0, 3)}.${clean.slice(3, 6)}.${clean.slice(6, 9)}-${clean.slice(9)}`;
  } else if (clean.length > 6) {
    return `${clean.slice(0, 3)}.${clean.slice(3, 6)}.${clean.slice(6)}`;
  } else if (clean.length > 3) {
    return `${clean.slice(0, 3)}.${clean.slice(3)}`;
  }
  return clean;
};

const formatCEP = (val: string) => {
  let clean = val.replace(/\D/g, "");
  if (clean.length > 8) clean = clean.slice(0, 8);
  if (clean.length > 5) {
    return `${clean.slice(0, 5)}-${clean.slice(5)}`;
  }
  return clean;
};

const PetCoinIcon = ({ className = "w-4 h-4" }: { className?: string }) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      className={`${className}`}
      fill="currentColor"
    >
      {/* Premium stylized solid heart icon */}
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
};

const BubblesBackground = () => {
  const bubbles = Array.from({ length: 15 }, (_, i) => {
    const size = Math.floor(Math.random() * 20) + 8; // 8px to 28px
    const left = Math.floor(Math.random() * 100); // 0% to 100%
    const delay = Math.random() * 8; // 0s to 8s delay
    const duration = Math.random() * 10 + 7; // 7s to 17s duration
    const opacity = Math.random() * 0.35 + 0.15; // 0.15 to 0.5 opacity
    return { id: i, size, left, delay, duration, opacity };
  });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="absolute rounded-full bg-emerald-400/30 border border-emerald-300/20 backdrop-blur-[0.5px]"
          style={{
            width: b.size,
            height: b.size,
            left: `${b.left}%`,
            bottom: "-40px",
            opacity: b.opacity,
            animation: `bubbleRise ${b.duration}s infinite linear`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default function App() {
  const profileFileInputRef = React.useRef<HTMLInputElement>(null);
  const postFileInputRef = React.useRef<HTMLInputElement>(null);
  const [currentView, setCurrentView] = useState<ViewState>("welcome");
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  // Signup form roles & steps
  const [signupRole, setSignupRole] = useState<SignupRole>("cuidador");
  const [donoStep, setDonoStep] = useState<DonoStep>("info");
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");

  // Shared Signup form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Dono specific extra states
  const [cpf, setCpf] = useState("");
  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [isFetchingCEP, setIsFetchingCEP] = useState(false);
  const [cepError, setCepError] = useState("");

  // Cuidador specific states
  const [petExperience, setPetExperience] = useState("all"); // 'dogs', 'cats', 'all'

  // Dono basic specs
  const [selectedAnimals, setSelectedAnimals] = useState<string[]>([]);
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [otherAnimalText, setOtherAnimalText] = useState("");

  // Dono Pet specific states (Step 2)
  const [petName, setPetName] = useState("");
  const [petAge, setPetAge] = useState("");
  const [petEspecie, setPetEspecie] = useState("");
  const [hasSpecialNeeds, setHasSpecialNeeds] = useState<boolean | null>(null);
  const [specialNeedsText, setSpecialNeedsText] = useState("");

  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  // Password visibility states
  const [showPasswordSignup, setShowPasswordSignup] = useState(false);
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);

  // Login specific states
  const [loginRole, setLoginRole] = useState<SignupRole>("cuidador");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginSlideDirection, setLoginSlideDirection] = useState<"left" | "right">("right");
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Sync login role with registration role
  React.useEffect(() => {
    setLoginRole(signupRole);
  }, [signupRole]);
  
  // Esqueci minha senha states
  const [forgotPasswordSubmitted, setForgotPasswordSubmitted] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");

  // Social Network Dashboard States
  const [isProfileHudOpen, setIsProfileHudOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [activeSidebarTab, setActiveSidebarTab] = useState("home"); // profile, home, search, nearby, follow, chat
  const [typingComments, setTypingComments] = useState<{[key: string]: string}>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // USER PROFILE STATES (Real-time and fully dynamic)
  const [selectedProfileId, setSelectedProfileId] = useState<string>("user");
  const [userAvatarUrl, setUserAvatarUrl] = useState<string>("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150");
  const [userBio, setUserBio] = useState<string>("Amante de animais, sempre buscando a melhor hospedagem com carinho e responsabilidade na rede PetAffection.");
  const [userPets, setUserPets] = useState<{ id: string; name: string }[]>([
    { id: "p1", name: "Pipoca" },
    { id: "p2", name: "Bolinha" }
  ]);
  const [userPetRole, setUserPetRole] = useState<"dono" | "cuidador" | "ambos">("cuidador");
  const [currentUserPosts, setCurrentUserPosts] = useState<any[]>([
    {
      id: "cur_p1",
      imageUrl: "https://images.unsplash.com/photo-1543446835-00a7907e9de1?w=600",
      caption: "Pipoca super animado no passeio matinal! ☀️🐾",
      createdAt: "Há 2 horas"
    },
    {
      id: "cur_p2",
      imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600",
      caption: "Bolinha tirando aquela soneca gostosa após comer petiscos. 🐶💤",
      createdAt: "Há 1 dia"
    }
  ]);
  const [currentCaregiverPosts, setCurrentCaregiverPosts] = useState<any[]>([
    {
      id: "ccg_p1",
      imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600",
      caption: "Romeu cachorrinho super fofo do @carlos.almeida. Cuidado com muito amor e carinho!",
      createdAt: "Há 4 horas"
    }
  ]);
  const [otherUsersData, setOtherUsersData] = useState<{[key: string]: any}>({
    "Mariana Silva": {
      name: "Mariana Silva",
      role: "Dono",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      bio: "Amante compulsiva de caninos. Procuro cuidadores atenciosos em SP.",
      pets: [{ id: "o_ms1", name: "Toby" }, { id: "o_ms2", name: "Mel" }],
      posts: [
        { id: "p_ms1", imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600", caption: "Visita no parque com meu Toby brincalhão!" },
        { id: "p_ms2", imageUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600", caption: "Melzinha descansando." }
      ]
    },
    "Luciana Fonseca": {
      name: "Luciana Fonseca",
      role: "Dono",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      bio: "Fã incondicional de felinos de todo tipo. Minha Miau é prioridade total na minha vida.",
      pets: [{ id: "o_lf1", name: "Miau" }],
      posts: [
        { id: "p_lf1", imageUrl: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600", caption: "Miau em seu trono favorito na sala!" }
      ]
    },
    "Roberto Costa": {
      name: "Roberto Costa",
      role: "Cuidador",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      bio: "Amante de felinos e caninos. Tenho ampla experiência com animais idosos.",
      rating: 5,
      posts: [
        { id: "p_rc1", imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600", caption: "Romeu cachorrinho super fofo do @carlos.almeida." },
        { id: "p_rc2", imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600", caption: "Luna gatinha adorável que hospedei de @marianasilva" }
      ]
    },
    "Roberto Costa de Souza": {
      name: "Roberto Costa de Souza",
      role: "Cuidador",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      bio: "Amante de felinos e caninos. Tenho ampla experiência com animais idosos e medicação diária.",
      rating: 5,
      posts: [
        { id: "p_rcs1", imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600", caption: "Romeu cachorrinho super fofo do @carlos.almeida." }
      ]
    },
    "Mariana Vasconcelos": {
      name: "Mariana Vasconcelos",
      role: "Cuidador",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      bio: "Especialista em adestramento positivo, com 3 anos de hospedagem certificada.",
      rating: 4,
      posts: [
        { id: "p_mv1", imageUrl: "https://images.unsplash.com/photo-1534361960057-19889db9621e?w=600", caption: "Bob cachorrinho incrível e brincalhão do @fernando.silva." }
      ]
    },
    "Ana Beatriz Lima": {
      name: "Ana Beatriz Lima",
      role: "Cuidador",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      bio: "Excelente área externa para recreação, com enriquecimento ambiental total.",
      rating: 3,
      posts: [
        { id: "p_abl1", imageUrl: "https://images.unsplash.com/photo-1477884213980-b111f22e99de?w=600", caption: "Melzinha super dócil e ativa da @amanda.lima." }
      ]
    }
  });

  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState("");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editBioValue, setEditBioValue] = useState("");

  const [newProfilePostCaption, setNewProfilePostCaption] = useState("");
  const [newProfilePostImage, setNewProfilePostImage] = useState("");
  const [newPetNameInput, setNewPetNameInput] = useState("");

  const handleViewUserProfile = (authorName: string, authorRole?: "Dono" | "Cuidador") => {
    setIsProfileHudOpen(false);
    const resolvedName = authorName.replace("@", "");
    const selfName = fullName || "Visitante";
    
    if (resolvedName.toLowerCase() === "visitante" || resolvedName.toLowerCase() === selfName.toLowerCase() || resolvedName.toLowerCase() === "user") {
      setSelectedProfileId("user");
      setActiveSidebarTab("profile");
      return;
    }
    
    // Check if keeper matches
    const cg = mapCaregivers.find(c => c.name.toLowerCase() === resolvedName.toLowerCase());
    if (cg) {
      setSelectedProfileId(cg.id);
      setActiveSidebarTab("profile");
      return;
    }
    
    // Check other registered
    const key = Object.keys(otherUsersData).find(k => k.toLowerCase() === resolvedName.toLowerCase());
    if (key) {
      setSelectedProfileId(key);
    } else {
      setSelectedProfileId(resolvedName);
    }
    setActiveSidebarTab("profile");
  };

  // Pet Coins game-styled system states & payment modal
  const [userPetCoins, setUserPetCoins] = useState(50);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentModalCaregiverId, setPaymentModalCaregiverId] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"credits" | null>("credits"); // Defaults to credits
  const [paymentStep, setPaymentStep] = useState<"checkout" | "shop" | "success">("checkout"); // checkout, shop, success

  // Chat rooms with caregivers (WhatsApp Web clone)
  const [chatRooms, setChatRooms] = useState<any[]>([
    {
      caregiverId: "cg_1",
      status: "Solicitado", // "Solicitado" or "Contratado"
      messages: [
        { sender: "caregiver", text: "Olá! Tudo bem? Vi que você tem interesse em encontrar um espaço confortável para o seu pet. Qual é a raça dele?", time: "Ontem, 18:30" },
        { sender: "user", text: "Olá Mariana! É um Golden Retriever de 2 anos, super manso e brincalhão.", time: "Ontem, 18:45" },
        { sender: "caregiver", text: "Ah, eu adoro Goldens! Eles se dão super bem na minha área externa de recreação. Fique à vontade para clicar em 'Contratar & Confirmar Cuidado' para adiantarmos a garantia da vaga!", time: "Ontem, 18:48" },
      ]
    }
  ]);
  const [activeChatRoomId, setActiveChatRoomId] = useState<string>("cg_1");
  const [chatInputText, setChatInputText] = useState("");

  const startChatWithCaregiver = (cg: any) => {
    const existingRoom = chatRooms.find(room => room.caregiverId === cg.id);
    if (!existingRoom) {
      const newRoom = {
        caregiverId: cg.id,
        status: "Solicitado",
        messages: [
          { sender: "user", text: `Olá ${cg.name.split(" ")[0]}! Gostaria de fazer o agendamento de hospedagem para o meu pet direto pela aba de Cuidadores Próximos.`, time: "Agora" },
          { sender: "caregiver", text: `Olá! Fico muito contente com seu contato. Vamos conversar sobre os detalhes? Quando estiver pronto(a), você pode confirmar a hospedagem clicando em "Contratar & Confirmar Cuidado" aqui no topo do chat!`, time: "Agora" }
        ]
      };
      setChatRooms([...chatRooms, newRoom]);
    }
    setActiveChatRoomId(cg.id);
    setActiveSidebarTab("chat");
    triggerToast(`Chat iniciado com ${cg.name.split(" ")[0]}!`);
  };

  const [dashboardPosts, setDashboardPosts] = useState<any[]>([
    {
      id: "1",
      authorName: "Mariana Silva",
      authorRole: "Dono",
      authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      timeAgo: "Há 10 minutos",
      content: "Procuro cuidador para cuidar do meu cachorro enquanto estou fora de viagem 🐾 Ele é super carinhoso, vacinado e adora dar passeios no final da tarde!",
      image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600",
      likes: 12,
      hasLiked: false,
      comments: [
        { author: "Roberto Souza", text: "Ele é lindo! Tenho disponibilidade integral." },
        { author: "Ana Lima", text: "Que fofura! Posso ajudar se precisar de finais de semana." }
      ]
    },
    {
      id: "2",
      authorName: "Roberto Costa",
      authorRole: "Cuidador",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      timeAgo: "Há 1 hora",
      content: "Posso cuidar do seu animalzinho, não tenho problema com nenhum animal em específico, fico à disposição para o trabalho! Tenho experiência com cães idosos e gatos ariscos.",
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600",
      likes: 8,
      hasLiked: false,
      comments: [
        { author: "Carlos Santos", text: "Excelente cuidador, recomendadíssimo!" }
      ]
    },
    {
      id: "3",
      authorName: "Luciana Fonseca",
      authorRole: "Dono",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      timeAgo: "Há 3 horas",
      content: "Pretendo viajar no feriado e preciso de um espaço seguro para hospedar minha gatinha Miau. Ela necessita de escovação diária.",
      image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600",
      likes: 5,
      hasLiked: false,
      comments: []
    }
  ]);

  const [newPostText, setNewPostText] = useState("");
  const [newPostRoleInput, setNewPostRoleInput] = useState<"Dono" | "Cuidador">("Dono");

  // Google Earth map caretakers states
  const [mapZoom, setMapZoom] = useState(1);
  const [showGridOverlay, setShowGridOverlay] = useState(true);
  const [hoveredCaregiverId, setHoveredCaregiverId] = useState<string | null>(null);
  const [selectedMapCaregiver, setSelectedMapCaregiver] = useState<any>(null);
  const [contactProposalMsg, setContactProposalMsg] = useState("");
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const [mapCaregivers] = useState([
    {
      id: "cg_1",
      name: "Mariana Vasconcelos",
      cityState: "São Paulo, SP",
      hours: "08:00 - 18:00 (Segunda a Sexta)",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      rating: 4,
      top: "35%",
      left: "40%",
      lat: "23° 32' 58\" S",
      lng: "46° 38' 02\" W",
      bio: "Especialista em adestramento positivo, com 3 anos de hospedagem certificada de cães pequenos e médios.",
      rate: 40
    },
    {
      id: "cg_2",
      name: "Roberto Costa de Souza",
      cityState: "São Paulo, SP",
      hours: "Disponibilidade Integral & Feriados",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      rating: 5,
      top: "65%",
      left: "25%",
      lat: "23° 33' 15\" S",
      lng: "46° 38' 22\" W",
      bio: "Amante de felinos e caninos. Tenho ampla experiência com animais idosos e que necessitam de medicação diária.",
      rate: 100
    },
    {
      id: "cg_3",
      name: "Ana Beatriz Lima",
      cityState: "São Paulo, SP",
      hours: "14:00 - 22:00 (Finais de Semana)",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      rating: 3,
      top: "48%",
      left: "70%",
      lat: "23° 32' 40\" S",
      lng: "46° 37' 42\" W",
      bio: "Excelente área externa para recreação, com enriquecimento ambiental total para cães e cuidados afetivos de alto padrão.",
      rate: 150
    }
  ]);

  // Menta Vibrante theme values
  const theme = {
    bgGradient: "from-[#ecfdf5] via-[#f0fbf5] to-[#d1fae5]",
    cardBg: "bg-white/95 backdrop-blur-md",
    cardBorder: "border-emerald-200/60",
    textColor: "text-[#064e3b]",
    textColorMuted: "text-emerald-700/80",
    buttonStyle: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/15",
    shadow: "shadow-[0_24px_60px_rgba(5,150,105,0.08)]",
  };

  const navigateTo = (view: ViewState) => {
    startTransition(() => {
      setCurrentView(view);
      setRegisteredSuccess(false); // Reset success banner on screen change
      setDonoStep("info");
      setLoginEmail("");
      setLoginPassword("");
      setLoginSuccess(false);
      setForgotPasswordSubmitted(false);
      setRecoveryEmail("");
      setShowPasswordSignup(false);
      setShowPasswordLogin(false);
    });
  };

  const handleRoleChange = (role: SignupRole) => {
    if (role === signupRole) return;
    setSlideDirection(role === "dono" ? "right" : "left");
    setSignupRole(role);
  };

  const handleAnimalToggle = (animal: string) => {
    if (animal === "Outro") {
      setIsOtherSelected(!isOtherSelected);
      return;
    }
    if (selectedAnimals.includes(animal)) {
      setSelectedAnimals(selectedAnimals.filter((a) => a !== animal));
    } else {
      setSelectedAnimals([...selectedAnimals, animal]);
    }
  };

  const handleCEPChange = async (val: string) => {
    const formatted = formatCEP(val);
    setCep(formatted);
    const numericCep = formatted.replace(/\D/g, "");
    if (numericCep.length === 8) {
      setIsFetchingCEP(true);
      setCepError("");
      try {
        const res = await fetch(`https://viacep.com.br/ws/${numericCep}/json/`);
        const data = await res.json();
        if (data && !data.erro) {
          setLogradouro(data.logradouro || "");
          setBairro(data.bairro || "");
          setCidade(data.localidade || "");
          setUf(data.uf || "");
        } else {
          setCepError("CEP não encontrado.");
        }
      } catch (err) {
        setCepError("Erro ao buscar as informações do CEP.");
      } finally {
        setIsFetchingCEP(false);
      }
    }
  };

  const handleContinueCadastro = (e: React.FormEvent) => {
    e.preventDefault();
    // Validations before moving to step 2 code
    if (!fullName || !email || !phone || !password || !cpf || !cep || !logradouro || !numero || !bairro || !cidade || !uf) {
      alert("Por favor, preencha todos os campos obrigatórios do dono.");
      return;
    }
    if (cpf.replace(/\D/g, "").length !== 11) {
      alert("Por favor, digite um CPF válido.");
      return;
    }
    if (cep.replace(/\D/g, "").length !== 8) {
      alert("Por favor, digite um CEP válido.");
      return;
    }
    if (selectedAnimals.length === 0 && !isOtherSelected) {
      alert("Selecione pelo menos um animal para continuar.");
      return;
    }
    if (isOtherSelected && !otherAnimalText.trim()) {
      alert("Por favor, especifique qual outro animal você possui.");
      return;
    }

    setSlideDirection("right");
    setDonoStep("pet");
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (signupRole === "dono") {
      if (!petName || !petAge || !petEspecie || hasSpecialNeeds === null) {
        alert("Por favor, preencha todos os campos do pet.");
        return;
      }
      if (hasSpecialNeeds && !specialNeedsText.trim()) {
        alert("Por favor, descreva as necessidades especiais do seu pet.");
        return;
      }
    }

    // Directly go to dashboard
    setUserPetRole(signupRole === "cuidador" ? "cuidador" : "dono");
    navigateTo("dashboard");
  };

  const resetFormAndNavigateWelcome = () => {
    // Auto clear form states
    setFullName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setPetExperience("all");
    setSelectedAnimals([]);
    setIsOtherSelected(false);
    setOtherAnimalText("");
    setPetName("");
    setPetAge("");
    setPetEspecie("");
    setHasSpecialNeeds(null);
    setSpecialNeedsText("");
    setCpf("");
    setCep("");
    setLogradouro("");
    setNumero("");
    setComplemento("");
    setBairro("");
    setCidade("");
    setUf("");
    setIsFetchingCEP(false);
    setCepError("");
    
    // Clear login and forgot recovery structures
    setLoginEmail("");
    setLoginPassword("");
    setLoginSuccess(false);
    setForgotPasswordSubmitted(false);
    setRecoveryEmail("");
    setShowPasswordSignup(false);
    setShowPasswordLogin(false);
    
    navigateTo("welcome");
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      alert("Por favor, preencha o e-mail e a senha fictícios.");
      return;
    }
    // Directly go to dashboard
    navigateTo("dashboard");
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail) {
      alert("Por favor, digite seu e-mail.");
      return;
    }
    setForgotPasswordSubmitted(true);
  };

  const handleSocialLogin = (provider: string) => {
    alert(`Simulando login social com o ${provider}. Essa integração fictícia está configurada com sucesso para testes!`);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3000);
  };

  const handleLikePost = (postId: string) => {
    setDashboardPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const nextHasLiked = !post.hasLiked;
          return {
            ...post,
            hasLiked: nextHasLiked,
            likes: nextHasLiked ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      })
    );
  };

  const handleAddComment = (postId: string) => {
    const commentText = typingComments[postId];
    if (!commentText || !commentText.trim()) return;

    setDashboardPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [
              ...post.comments,
              { author: fullName || "Você (Visitante)", text: commentText.trim() },
            ],
          };
        }
        return post;
      })
    );

    setTypingComments((prev) => ({
      ...prev,
      [postId]: "",
    }));
  };

  const handleCreatePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPostObj = {
      id: Date.now().toString(),
      authorName: fullName || "Usuário Conectado",
      authorRole: newPostRoleInput,
      authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
      timeAgo: "Agora mesmo",
      content: newPostText.trim(),
      likes: 0,
      hasLiked: false,
      comments: [],
    };

    setDashboardPosts((prev) => [newPostObj, ...prev]);
    setNewPostText("");
    triggerToast("Postagem publicada com sucesso na rede!");
  };

  const renderPaymentModal = () => {
    return (
      <AnimatePresence>
        {isPaymentModalOpen && (() => {
          const activeCg = mapCaregivers.find(c => c.id === paymentModalCaregiverId) || {
            name: "Cuidador Premium",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
            rate: 40
          };
          const cgRate = activeCg.rate || 40;

          return (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-zinc-950/70 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 30, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                className="bg-zinc-900 border border-zinc-800 shadow-3xl rounded-3xl w-full max-w-md overflow-hidden relative text-white"
              >
                {/* Close Button top-right */}
                {paymentStep !== "success" && (
                  <button 
                    onClick={() => setIsPaymentModalOpen(false)}
                    className="absolute top-4 right-4 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer text-xs font-black"
                  >
                    ✕
                  </button>
                )}

                {/* STEP 1: CHECKOUT SCREEN */}
                {paymentStep === "checkout" && (
                  <div className="p-6 sm:p-8 flex flex-col text-left">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2.5 bg-amber-500/10 border border-amber-500/25 rounded-2xl">
                        <PetCoinIcon className="w-6 h-6 text-amber-400 fill-amber-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-wider text-amber-400">Checkout de Hospedagem</h3>
                        <p className="text-[10px] text-zinc-400 font-bold">Garantia e Proteção PetAffection</p>
                      </div>
                    </div>

                    {/* Caregiver Summary */}
                    <div className="bg-zinc-800/40 border border-zinc-800/85 rounded-2xl p-4 mb-5 flex items-center gap-3">
                      <img src={activeCg.avatar} alt={activeCg.name} className="w-11 h-11 rounded-full object-cover border border-zinc-700" />
                      <div className="flex-1 min-w-0">
                        <span className="text-[8px] bg-emerald-500/10 text-emerald-400 font-extrabold uppercase px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                          CONTRATANDO CUIDADOR
                        </span>
                        <h4 className="text-xs font-black text-white mt-1 truncate">{activeCg.name}</h4>
                        <p className="text-[9px] text-zinc-400 font-bold">Atendimento Premium</p>
                      </div>
                    </div>

                    {/* Price & Balance breakdown */}
                    <div className="space-y-3 mb-6 bg-zinc-950/40 p-4 rounded-2xl border border-zinc-800/80">
                      <div className="flex justify-between items-center pb-2.5 border-b border-zinc-800/60">
                        <span className="text-xs font-bold text-zinc-400">Seu Saldo:</span>
                        <div className="flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                          <PetCoinIcon className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                          <span className="text-xs font-black text-amber-400 font-mono">{userPetCoins} PC</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-0.5">
                        <span className="text-xs font-bold text-zinc-400">Valor Solicitado pelo Cuidador:</span>
                        <div className="flex items-center gap-1.5 bg-zinc-800/85 px-2.5 py-1 rounded-full border border-zinc-750">
                          <PetCoinIcon className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                          <span className="text-xs font-black text-white font-mono">{cgRate} PC</span>
                        </div>
                      </div>
                    </div>

                    {/* Forma de Pagamento */}
                    <div className="mb-6">
                      <p className="text-[10px] font-black uppercase text-zinc-450 tracking-wider mb-2">
                        Forma de Pagamento
                      </p>
                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          onClick={() => setSelectedPaymentMethod("credits")}
                          className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                            selectedPaymentMethod === "credits"
                              ? "bg-amber-400/10 border-amber-400 text-white"
                              : "bg-zinc-850/40 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                          }`}
                        >
                          <div className="w-4 h-4 rounded-full border border-amber-400 flex items-center justify-center shrink-0">
                            <span className="w-2 h-2 bg-amber-400 rounded-full" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-wide">Usar Meus Créditos</span>
                        </button>

                        <button
                          onClick={() => {
                            setPaymentStep("shop");
                          }}
                          className="p-3 rounded-xl bg-zinc-850/40 border border-zinc-800 text-zinc-400 hover:border-zinc-700 flex flex-col items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <div className="w-4 h-4 rounded-full border border-zinc-600 flex items-center justify-center shrink-0">
                            <span className="text-zinc-400 font-black text-xs">+</span>
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-wide">Comprar Mais Créditos</span>
                        </button>
                      </div>
                    </div>

                    {/* BOTTOM BUTTON: FINALIZAR PAGAMENTO */}
                    <button
                      onClick={() => {
                        const rate = activeCg.rate || 40;
                        if (userPetCoins >= rate) {
                          setUserPetCoins(prev => prev - rate);
                          
                          // Mark as Contratado and insert success simulated messages
                          const updated = chatRooms.map(r => {
                            if (r.caregiverId === paymentModalCaregiverId) {
                              return {
                                ...r,
                                status: "Contratado",
                                messages: [
                                  ...r.messages,
                                  {
                                    sender: "system",
                                    text: `🤝 CONTRATAÇÃO CONFIRMADA! Você acabou de contratar ${activeCg.name.split(" ")[0]} para cuidar do seu pet com toda a proteção e segurança do PetAffection!`,
                                    time: "Agora mesmo"
                                  },
                                  {
                                    sender: "caregiver",
                                    text: `Excelente! ✨ Muito obrigado pela contratação e confirmação! Vou cuidar do seu pet com todo amor e atenção. Pode ficar tranquilo(a), tudo já está confirmado em nossa agenda!`,
                                    time: "Agora mesmo"
                                  }
                                ]
                              };
                            }
                            return r;
                          });
                          setChatRooms(updated);
                          setPaymentStep("success");
                          triggerToast("Transação finalizada com sucesso!");
                        } else {
                          triggerToast("Saldo insuficiente! Clique em 'Comprar Mais Créditos' para recarregar.");
                          setPaymentStep("shop");
                        }
                      }}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-500/10 active:scale-[0.98] cursor-pointer text-center"
                      style={{ padding: '20px 24px', fontSize: '15.5px', letterSpacing: '0.1em' }}
                    >
                      Finalizar Pagamento ✓
                    </button>
                  </div>
                )}

                {/* STEP 2: RECHARGE / SHOP SCREEN */}
                {paymentStep === "shop" && (
                  <div className="p-6 sm:p-8 flex flex-col text-left">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2.5">
                        <button 
                          onClick={() => {
                            if (paymentModalCaregiverId) {
                              setPaymentStep("checkout");
                            } else {
                              setIsPaymentModalOpen(false);
                            }
                          }}
                          className="bg-zinc-800 hover:bg-zinc-700 hover:text-white text-zinc-300 font-extrabold text-[9px] px-2.5 py-1.5 uppercase rounded-lg transition-all"
                        >
                          ← Voltar
                        </button>
                        <div>
                          <h3 className="text-sm font-black uppercase tracking-wider text-amber-400">Loja de Pet Coins</h3>
                          <p className="text-[9px] text-zinc-400 font-bold">Adquira Créditos de Cuidado</p>
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center gap-1.5 bg-zinc-950/60 px-2.5 py-1 rounded-xl border border-zinc-800">
                        <PetCoinIcon className="w-3 h-3 text-amber-500 fill-amber-400" />
                        <span className="text-xs font-black font-mono text-amber-400">{userPetCoins} PC</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-zinc-400 mb-5 font-semibold bg-zinc-850/60 p-3 rounded-xl border border-zinc-800/50">
                      Escolha uma das 3 formas de comprar abaixo no modelo de moedas de jogos virtuais (Robux):
                    </p>

                    {/* Displays 3 forms / card options */}
                    <div className="space-y-3 mb-6">
                      {/* Bundle 1 */}
                      <button
                        onClick={() => {
                          setUserPetCoins(prev => prev + 40);
                          triggerToast("Pacote Bronze adquirido! +40 Pet Coins adicionados.");
                          if (paymentModalCaregiverId) {
                            setPaymentStep("checkout");
                          } else {
                            setIsPaymentModalOpen(false);
                          }
                        }}
                        className="w-full p-3 bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/40 rounded-2xl flex items-center justify-between transition-all group text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-amber-500/5 text-amber-500 rounded-xl border border-amber-500/10 group-hover:scale-105 transition-transform">
                            <PetCoinIcon className="w-5 h-5 text-amber-500 fill-amber-400" />
                          </div>
                          <div>
                            <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest block font-sans">PACOTE INICIANTE</span>
                            <h4 className="text-xs font-black text-white mt-0.5">
                              40 Pet Coins por R$ 20,00
                            </h4>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] px-3 py-1.5 rounded-lg shadow-md transition-all uppercase">
                            Comprar
                          </span>
                        </div>
                      </button>

                      {/* Bundle 2 */}
                      <button
                        onClick={() => {
                          setUserPetCoins(prev => prev + 100);
                          triggerToast("Pacote Prata adquirido! +100 Pet Coins adicionados.");
                          if (paymentModalCaregiverId) {
                            setPaymentStep("checkout");
                          } else {
                            setIsPaymentModalOpen(false);
                          }
                        }}
                        className="w-full p-3 bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/40 rounded-2xl flex items-center justify-between transition-all group text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-zinc-700/10 text-zinc-300 rounded-xl border border-zinc-700/20 group-hover:scale-105 transition-transform">
                            <PetCoinIcon className="w-5 h-5 text-zinc-300 fill-zinc-350" />
                          </div>
                          <div>
                            <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest block font-mono">PACOTE POPULAR</span>
                            <h4 className="text-xs font-black text-white mt-0.5">
                              100 Pet Coins por R$ 50,00
                            </h4>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] px-3 py-1.5 rounded-lg shadow-md transition-all uppercase">
                            Comprar
                          </span>
                        </div>
                      </button>

                      {/* Bundle 3 */}
                      <button
                        onClick={() => {
                          setUserPetCoins(prev => prev + 150);
                          triggerToast("Pacote Ouro adquirido! +150 Pet Coins adicionados.");
                          if (paymentModalCaregiverId) {
                            setPaymentStep("checkout");
                          } else {
                            setIsPaymentModalOpen(false);
                          }
                        }}
                        className="w-full p-3 bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/40 rounded-2xl flex items-center justify-between transition-all group text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20 group-hover:scale-105 transition-transform">
                            <PetCoinIcon className="w-5 h-5 text-amber-500 fill-amber-400" />
                          </div>
                          <div>
                            <span className="text-[8px] font-black text-amber-400 uppercase tracking-widest block">MELHOR PREÇO 🌟</span>
                            <h4 className="text-xs font-black text-white mt-0.5">
                              150 Pet Coins por R$ 75,00
                            </h4>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] px-3 py-1.5 rounded-lg shadow-md transition-all uppercase">
                            Comprar
                          </span>
                        </div>
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        if (paymentModalCaregiverId) {
                          setPaymentStep("checkout");
                        } else {
                          setIsPaymentModalOpen(false);
                        }
                      }}
                      className="w-full py-2.5 bg-zinc-850 hover:bg-zinc-800 text-zinc-400 font-black uppercase text-[10px] tracking-wider rounded-xl transition-all cursor-pointer text-center border border-zinc-800"
                    >
                      Cancelar e Voltar
                    </button>
                  </div>
                )}

                {/* STEP 3: SUCCESS GREEN HUD */}
                {paymentStep === "success" && (
                  <div className="bg-emerald-600 p-8 sm:p-10 flex flex-col items-center justify-center text-center text-white">
                    {/* Big celebratory logo */}
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6 text-white">
                      <PetCoinIcon className="w-9 h-9 text-white fill-white" />
                    </div>

                    {/* Green HUD with white text */}
                    <h2 className="text-xl sm:text-2xl font-black mb-4 select-none uppercase tracking-wide leading-tight">
                      Pagamento Finalizado
                    </h2>

                    <p className="text-xs text-emerald-100 font-bold max-w-sm mb-3 leading-relaxed">
                      Sua hospedagem foi confirmada na agenda do cuidador! O chat com ele foi atualizado com as informações da contratação garantida do PetAffection.
                    </p>

                    {/* Cat and dog emojis side-by-side shifted below the message text */}
                    <div className="text-2xl mb-6 select-none flex items-center justify-center gap-2">
                      🐱 🐶
                    </div>

                    <button
                      onClick={() => {
                        setIsPaymentModalOpen(false);
                        setActiveSidebarTab("chat");
                      }}
                      className="w-full max-w-xs py-3.5 px-6 bg-white hover:bg-zinc-100 text-emerald-800 font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-md active:scale-95 cursor-pointer text-center"
                    >
                      Ir ao Bate-papo ✓
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    );
  };

  const renderDashboard = () => {
    const filteredPosts = dashboardPosts.filter((post) => {
      const query = searchFilter.toLowerCase();
      return (
        post.content.toLowerCase().includes(query) ||
        post.authorName.toLowerCase().includes(query) ||
        post.authorRole.toLowerCase().includes(query)
      );
    });

    const mockNotifications = [
      { id: 1, text: "🐾 Mariana G. (Cuidadora) enviou um diário do Pipoca!", time: "Há 5m", read: false },
      { id: 2, text: "❤️ Seu post recebeu uma curtida de Roberto Costa.", time: "Há 12m", read: false },
      { id: 3, text: "🔔 Cuidador Próximo verificado encontrou seu perfil.", time: "Há 1h", read: true },
    ];

    const currentUserName = fullName || "Visitante";
    const currentUserRole = signupRole === "cuidador" ? "Cuidador" : "Dono";

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 animate-fade-in">
        {/* CABEÇALHO */}
        <header className="sticky top-0 z-40 w-full bg-white border-b border-zinc-200 shadow-sm px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Esquerda: Logo */}
          <div 
            onClick={() => setActiveSidebarTab("home")} 
            className="flex items-center gap-2 select-none cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md transition-all hover:scale-110 active:scale-95">
              {/* Premium paw print icon */}
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M12 10.5c-1.8 0-3.3 1.4-3.3 3.1 0 1.2.6 2.3 1.5 2.8.5.3 1.1.5 1.8.5s1.3-.2 1.8-.5c.9-.5 1.5-1.6 1.5-2.8 0-1.7-1.5-3.1-3.3-3.1z" />
                <circle cx="7.2" cy="11" r="1.5" />
                <circle cx="10.1" cy="7.8" r="1.5" />
                <circle cx="13.9" cy="7.8" r="1.5" />
                <circle cx="16.8" cy="11" r="1.5" />
              </svg>
            </div>
            <span className="text-lg font-black tracking-tight text-emerald-800 hidden sm:inline">
              PetAffection
            </span>
          </div>

          {/* Meio: Campo de pesquisa */}
          <div className="flex-1 max-w-sm mx-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
              <Search className="w-4 h-4 text-emerald-600" />
            </div>
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-10 pr-9 py-2 bg-zinc-100 focus:bg-white text-xs border border-transparent focus:border-emerald-300 rounded-full outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all font-medium placeholder-zinc-400"
            />
            {searchFilter && (
              <button 
                onClick={() => setSearchFilter("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-zinc-400 hover:text-zinc-650 font-bold"
              >
                ×
              </button>
            )}
          </div>

          {/* Direita: Notificações e Perfil */}
          <div className="flex items-center gap-3 relative">
            {/* Game-styled Pet Coins Indicator (adjacent to Notifications) */}
            <button
              onClick={() => {
                setPaymentStep("shop");
                setIsPaymentModalOpen(true);
                triggerToast("Loja de Pet Coins aberta!");
              }}
              className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 hover:border-amber-400 rounded-full px-2.5 py-1.5 shadow-sm hover:scale-105 active:scale-95 transition-all text-amber-800 cursor-pointer text-left"
              title="Clique para recarregar seus Pet Coins!"
            >
              <PetCoinIcon className="w-4 h-4 text-amber-500 fill-amber-400 drop-shadow-xs" />
              <span className="text-[11px] font-black font-mono tracking-wide">{userPetCoins} PC</span>
            </button>

            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileHudOpen(false);
                }}
                className={`p-2 rounded-full cursor-pointer transition-colors relative hover:bg-zinc-100 ${
                  isNotificationsOpen ? "bg-emerald-50 text-emerald-600" : "text-zinc-600"
                }`}
                title="Notificações"
              >
                <Bell className="w-5 h-5" />
                {mockNotifications.some((n) => !n.read) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
                )}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 bg-white border border-zinc-200 rounded-2xl shadow-xl z-50 p-4"
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100">
                      <span className="text-xs font-bold text-zinc-805 uppercase tracking-wide">Notificações</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Simulador</span>
                    </div>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {mockNotifications.map((n) => (
                        <div key={n.id} className="text-left text-xs p-2 rounded-xl hover:bg-zinc-55 transition-colors flex flex-col">
                          <span className={n.read ? "text-zinc-500" : "text-zinc-900 font-semibold"}>
                            {n.text}
                          </span>
                          <span className="text-[10px] text-zinc-400 mt-1">{n.time}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  setIsProfileHudOpen(!isProfileHudOpen);
                  setIsNotificationsOpen(false);
                }}
                className={`flex items-center gap-1.5 p-1 rounded-full border hover:border-emerald-300 transition-colors ${
                  isProfileHudOpen ? "border-emerald-500 bg-emerald-50/50" : "border-zinc-200"
                }`}
                title="Opções de Perfil"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs border border-emerald-200">
                  {currentUserName.charAt(0).toUpperCase()}
                </div>
              </button>

              <AnimatePresence>
                {isProfileHudOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-64 bg-white border border-zinc-200 rounded-2xl shadow-xl z-50 overflow-hidden"
                  >
                    <div 
                      onClick={() => handleViewUserProfile("user")}
                      className="p-4 bg-emerald-50/50 border-b border-zinc-100 text-left cursor-pointer hover:bg-emerald-100/50"
                    >
                      <p className="text-xs font-black text-emerald-900">{currentUserName}</p>
                      <p className="text-[10px] font-bold text-emerald-700/80 uppercase tracking-widest mt-0.5">{currentUserRole} • Ver meu perfil 🐾</p>
                    </div>

                    <div className="py-2 flex flex-col">
                      <button
                        onClick={() => {
                          setIsProfileHudOpen(false);
                          triggerToast("Configurações de privacidade acessadas!");
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-left text-xs text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-zinc-500" />
                        <span>Configurações de privacidade</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsProfileHudOpen(false);
                          triggerToast("Central de Ajuda e Suporte carregada.");
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-left text-xs text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors"
                      >
                        <HelpCircle className="w-4 h-4 text-zinc-500" />
                        <span>Ajuda e Suporte</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsProfileHudOpen(false);
                          triggerToast("Tema e Acessibilidade configurados!");
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-left text-xs text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors"
                      >
                        <Moon className="w-4 h-4 text-zinc-500" />
                        <span>Tela e Acessibilidade</span>
                      </button>

                      <div className="border-t border-zinc-100 my-1" />

                      <button
                        onClick={() => {
                          setIsProfileHudOpen(false);
                          resetFormAndNavigateWelcome();
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-left text-xs text-rose-650 hover:bg-rose-50 transition-colors font-bold"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sair</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* CONTAINER PRINCIPAL */}
        <div className="flex-1 w-full max-w-7xl mx-auto flex gap-6 px-4 py-6 items-start relative">
          
          {/* ABA DA ESQUERDA */}
          <aside className="w-64 shrink-0 bg-white border border-zinc-200 rounded-2xl p-4 hidden md:flex flex-col gap-1.5 sticky top-22">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-3 mb-2 font-mono">
              Ferramentas
            </span>

            <button
              onClick={() => {
                setActiveSidebarTab("profile");
                triggerToast("Perfil do usuário em demonstração.");
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeSidebarTab === "profile" 
                  ? "bg-emerald-50 text-emerald-800"
                  : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-emerald-600 font-black text-[9px] text-white flex items-center justify-center">
                {currentUserName.charAt(0).toUpperCase()}
              </div>
              <span className="truncate">{currentUserName}</span>
            </button>

            <button
              onClick={() => setActiveSidebarTab("home")}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeSidebarTab === "home" 
                  ? "bg-emerald-50 text-emerald-800"
                  : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
              }`}
            >
              <Home className="w-5 h-5 text-emerald-600" />
              <span>Página Oficial</span>
            </button>

            <button
              onClick={() => {
                setActiveSidebarTab("search");
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeSidebarTab === "search" 
                  ? "bg-emerald-50 text-emerald-800"
                  : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
              }`}
            >
              <MapPin className="w-5 h-5 text-emerald-600" />
              <span>Buscar cuidador</span>
            </button>

            <button
              onClick={() => {
                setActiveSidebarTab("nearby");
                triggerToast("Cuidadores Próximos em demonstração.");
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeSidebarTab === "nearby" 
                  ? "bg-emerald-50 text-emerald-800"
                  : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
              }`}
            >
              <Users className="w-5 h-5 text-emerald-600" />
              <span>Cuidadores Próximos</span>
            </button>

            <button
              onClick={() => {
                setActiveSidebarTab("follow");
                triggerToast("Acompanhe Seu Pet em demonstração.");
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeSidebarTab === "follow" 
                  ? "bg-emerald-50 text-emerald-800"
                  : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
              }`}
            >
              <Camera className="w-5 h-5 text-emerald-600" />
              <span>Acompanhe Seu Pet</span>
            </button>

            <button
              onClick={() => {
                setActiveSidebarTab("chat");
                triggerToast("Central de Mensagens com seus cuidadores!");
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeSidebarTab === "chat" 
                  ? "bg-emerald-50 text-emerald-800"
                  : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
              }`}
            >
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              <span>Chat com Cuidadores</span>
            </button>
          </aside>

          {/* MEIO: CONTEÚDO PRINCIPAL (FEED, MAPA, ETC) */}
          <main className="flex-1 max-w-2xl mx-auto flex flex-col gap-6 w-full">
            
            {/* Barra de Navegação Horizontal para Móveis (Foco em Responsividade) */}
            <div className="flex md:hidden bg-white border border-zinc-200 p-2 rounded-2xl gap-1 overflow-x-auto w-full shadow-sm">
              <button 
                onClick={() => setActiveSidebarTab("home")}
                className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  activeSidebarTab === "home" 
                    ? "bg-emerald-600 text-white shadow-sm" 
                    : "text-zinc-600 hover:text-zinc-900 bg-zinc-50"
                }`}
              >
                Página Oficial 🏠
              </button>
              <button 
                onClick={() => setActiveSidebarTab("search")}
                className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  activeSidebarTab === "search" 
                    ? "bg-emerald-600 text-white shadow-sm" 
                    : "text-zinc-600 hover:text-zinc-900 bg-zinc-50"
                }`}
              >
                Buscar Cuidador 📍
              </button>
              <button 
                onClick={() => {
                  setActiveSidebarTab("nearby");
                  triggerToast("Carregando cuidadores em destaque...");
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  activeSidebarTab === "nearby" 
                    ? "bg-emerald-600 text-white shadow-sm" 
                    : "text-zinc-600 hover:text-zinc-900 bg-zinc-50"
                }`}
              >
                Cuidadores Próximos 👥
              </button>
              <button 
                onClick={() => {
                  setActiveSidebarTab("follow");
                  triggerToast("Câmeras ao vivo ativadas em demonstração.");
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  activeSidebarTab === "follow" 
                    ? "bg-emerald-600 text-white shadow-sm" 
                    : "text-zinc-600 hover:text-zinc-900 bg-zinc-50"
                }`}
              >
                Acompanhe Seu Pet 🎥
              </button>
              <button 
                onClick={() => {
                  setActiveSidebarTab("chat");
                  triggerToast("Mensagens de cuidadores solicitados.");
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  activeSidebarTab === "chat" 
                    ? "bg-emerald-600 text-white shadow-sm" 
                    : "text-zinc-600 hover:text-zinc-900 bg-zinc-50"
                }`}
              >
                Mensagens 💬
              </button>
            </div>

            {/* CONTEÚDO: FEED DE NOTÍCIAS / PÁGINA OFICIAL */}
            {activeSidebarTab === "home" && (
              <>
                {/* CRIAR POSTAGEM */}
                <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs select-none shrink-0">
                      {currentUserName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <textarea
                        rows={2}
                        value={newPostText}
                        onChange={(e) => setNewPostText(e.target.value)}
                        placeholder={`No que você está pensando, ${currentUserName.split(" ")[0]}? Compartilhe com a nossa comunidade...`}
                        className="w-full bg-zinc-50 hover:bg-zinc-100/50 focus:bg-white text-xs text-zinc-900 border border-zinc-150 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder-zinc-400 resize-none font-medium"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-100 pt-3 flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-1.5 bg-zinc-50 p-1 rounded-lg border border-zinc-150">
                      <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wide px-1">Postar como:</span>
                      <button
                        onClick={() => setNewPostRoleInput("Dono")}
                        className={`px-2 py-1 rounded font-bold text-[10px] transition-all uppercase ${
                          newPostRoleInput === "Dono" 
                            ? "bg-emerald-600 text-white" 
                            : "text-zinc-600 hover:text-zinc-900"
                        }`}
                      >
                        Dono 🐾
                      </button>
                      <button
                        onClick={() => setNewPostRoleInput("Cuidador")}
                        className={`px-2 py-1 rounded font-bold text-[10px] transition-all uppercase ${
                          newPostRoleInput === "Cuidador" 
                            ? "bg-emerald-600 text-white" 
                            : "text-zinc-600 hover:text-zinc-900"
                        }`}
                      >
                        Cuidador 💼
                      </button>
                    </div>

                    <button
                      onClick={handleCreatePostSubmit}
                      disabled={!newPostText.trim()}
                      className={`px-4 py-2 font-bold rounded-xl flex items-center justify-center gap-1 text-xs transition-all ${
                        newPostText.trim()
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-500/10 cursor-pointer"
                          : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Publicar</span>
                    </button>
                  </div>
                </div>

                {/* LISTA DE POSTS */}
                <div className="flex flex-col gap-6">
                  {filteredPosts.length === 0 ? (
                    <div className="bg-white border border-zinc-200 p-8 rounded-2xl text-center shadow-sm">
                      <p className="text-sm font-bold text-zinc-500">Nenhum post coincide com sua busca.</p>
                      <button 
                        onClick={() => setSearchFilter("")}
                        className="text-xs text-emerald-600 font-bold hover:underline mt-2 inline-block"
                      >
                        Ver todos os posts
                      </button>
                    </div>
                  ) : (
                    filteredPosts.map((post) => (
                      <article key={post.id} className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
                        <div className="p-4 flex items-center justify-between border-b border-zinc-100">
                          <div className="flex items-center gap-3">
                            <img 
                              src={post.authorAvatar} 
                              alt={post.authorName}
                              referrerPolicy="no-referrer"
                              onClick={() => handleViewUserProfile(post.authorName)}
                              className="w-10 h-10 rounded-full border border-zinc-205 object-cover cursor-pointer transition-transform hover:scale-105"
                            />
                            <div className="text-left">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span 
                                  onClick={() => handleViewUserProfile(post.authorName)}
                                  className="text-xs font-extrabold text-zinc-900 cursor-pointer hover:text-emerald-700 hover:underline"
                                >
                                  {post.authorName}
                                </span>
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                  post.authorRole === "Dono" 
                                    ? "bg-rose-50 text-rose-700 border border-rose-100" 
                                    : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                }`}>
                                  {post.authorRole}
                                </span>
                              </div>
                              <span className="text-[10px] text-zinc-400 font-medium block mt-0.5">{post.timeAgo}</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => triggerToast("Opção simulada de gerenciamento.")}
                            className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-650 transition-colors"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="p-4 text-left text-xs text-zinc-800 leading-relaxed font-semibold whitespace-pre-wrap">
                          {post.content}
                        </div>

                        {post.image && (
                          <div className="border-y border-zinc-100 bg-zinc-50">
                            <img 
                              src={post.image} 
                              alt="Foto do pet" 
                              referrerPolicy="no-referrer"
                              className="w-full max-h-96 object-cover"
                            />
                          </div>
                        )}

                        <div className="px-4 py-2.5 border-b border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 font-medium">
                          <div className="flex items-center gap-1 text-zinc-500">
                            <span className="text-rose-500">❤️</span>
                            <span>{post.likes} {post.likes === 1 ? "curtida" : "curtidas"}</span>
                          </div>
                          <span className="hover:underline cursor-pointer">{post.comments.length} {post.comments.length === 1 ? "comentário" : "comentários"}</span>
                        </div>

                        <div className="px-2 py-1 flex items-center justify-between text-xs text-zinc-600 font-bold border-b border-zinc-100 gap-1 bg-zinc-50/20">
                          <button
                            onClick={() => handleLikePost(post.id)}
                            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors hover:bg-zinc-100 ${
                              post.hasLiked ? "text-rose-650" : "text-zinc-600"
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${post.hasLiked ? "fill-rose-600 text-rose-600" : ""}`} />
                            <span>{post.hasLiked ? "Amei" : "Curtir"}</span>
                          </button>

                          <button
                            onClick={() => {
                              const inputElem = document.getElementById(`comment-input-${post.id}`);
                              if (inputElem) inputElem.focus();
                            }}
                            className="flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-zinc-655 hover:bg-zinc-100 transition-colors"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>Comentar</span>
                          </button>

                          <button
                            onClick={() => triggerToast("Compartilhamento concluído com sucesso!")}
                            className="flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-zinc-655 hover:bg-zinc-100 transition-colors"
                          >
                            <Share2 className="w-4 h-4" />
                            <span>Compartilhar</span>
                          </button>
                        </div>

                        {post.comments.length > 0 && (
                          <div className="p-4 bg-zinc-50/60 border-b border-zinc-100 flex flex-col gap-3">
                            {post.comments.map((cmt: any, idx: number) => (
                              <div key={idx} className="flex gap-2.5 items-start text-left">
                                <div 
                                  onClick={() => handleViewUserProfile(cmt.author)}
                                  className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 select-none cursor-pointer transition-transform hover:scale-110"
                                >
                                  {cmt.author.charAt(0).toUpperCase()}
                                </div>
                                <div className="bg-white border border-zinc-150 px-3 py-2 rounded-2xl flex-1 text-xs">
                                  <span 
                                    onClick={() => handleViewUserProfile(cmt.author)}
                                    className="font-extrabold text-zinc-900 block mb-0.5 cursor-pointer hover:text-emerald-700 hover:underline"
                                  >
                                    {cmt.author}
                                  </span>
                                  <span className="text-zinc-700 font-medium leading-relaxed">{cmt.text}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="p-3 flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-[10px] select-none border border-emerald-100 shrink-0">
                            {currentUserName.charAt(0).toUpperCase()}
                          </div>
                          <input
                            id={`comment-input-${post.id}`}
                            type="text"
                            placeholder="Escreva um comentário..."
                            value={typingComments[post.id] || ""}
                            onChange={(e) => setTypingComments(prev => ({ ...prev, [post.id]: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleAddComment(post.id);
                              }
                            }}
                            className="flex-1 bg-zinc-100 hover:bg-zinc-150/50 focus:bg-white text-xs text-zinc-900 border border-transparent focus:border-zinc-200 rounded-full px-3 py-1.5 outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all font-medium placeholder-zinc-400"
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            disabled={!(typingComments[post.id] || "").trim()}
                            className="text-xs font-bold text-emerald-650 disabled:text-zinc-300 hover:text-emerald-805 disabled:cursor-not-allowed px-2 transition-colors shrink-0"
                          >
                            Enviar
                          </button>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </>
            )}

            {/* CONTEÚDO: TELA DO MAPA DIGITAL (GOOGLE MAPS STYLE) */}
            {activeSidebarTab === "search" && (
              <div className="bg-white text-slate-800 rounded-3xl overflow-hidden border border-zinc-200 shadow-2xl flex flex-col w-full h-[550px] relative font-sans">
                {/* Map Header with Google Maps Styling */}
                <div className="bg-zinc-50 border-b border-zinc-200 px-4 py-3 flex items-center justify-between z-10">
                  <div className="flex items-center gap-2">
                    {/* Google Pin Custom Graphic */}
                    <svg className="w-5 h-5 text-emerald-600 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    <span className="text-[11px] uppercase tracking-wider font-extrabold text-zinc-700 font-sans">
                      Google Maps • Buscador PetAffection
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Traffic toggle indicator */}
                    <button
                      onClick={() => setShowGridOverlay(!showGridOverlay)}
                      className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase border transition-colors ${
                        showGridOverlay 
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300" 
                          : "bg-zinc-100 text-zinc-500 border-zinc-200"
                      }`}
                    >
                      {showGridOverlay ? "Trânsito: ativo 🟢" : "Trânsito: inativo"}
                    </button>
                    <span className="text-[10px] font-semibold text-zinc-400 hidden sm:inline">
                      {mapZoom === 1 ? "Escala: 1:5000" : mapZoom === 1.5 ? "Escala: 1:2500" : "Escala: 1:1250"}
                    </span>
                  </div>
                </div>

                {/* Map Canvas viewport */}
                <div className="flex-1 relative overflow-hidden bg-[#f4f6f4] select-none">
                  
                  {/* Digital Google Map SVG Vector-Guided Landscape */}
                  <div 
                    className="absolute inset-0 transition-transform duration-500 ease-out origin-center"
                    style={{
                      transform: `scale(${mapZoom})`,
                    }}
                  >
                    <svg className="absolute inset-0 w-full h-full text-zinc-300 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                      {/* Landmass background */}
                      <rect width="100%" height="100%" fill="#f4f6f4" />
                      
                      {/* Parks (emerald soft areas) */}
                      <path d="M 50 120 C 120 100, 180 80, 220 150 C 260 220, 200 300, 100 240 Z" fill="#d1fae5" opacity="0.85" />
                      <text x="110" y="180" className="text-[10px] font-black tracking-wider fill-emerald-800/65 uppercase select-none font-sans">Parque Ibirapuera 🌳</text>
                      
                      <path d="M 550 200 C 620 180, 700 250, 680 320 C 650 380, 520 350, 480 290 Z" fill="#d1fae5" opacity="0.85" />
                      <text x="520" y="300" className="text-[10px] font-black tracking-wider fill-emerald-800/65 uppercase select-none font-sans">Parque Villa-Lobos 🌸</text>
                      
                      {/* Rio Pinheiros */}
                      <path d="M -50 450 Q 250 320, 500 480 T 1100 400" fill="none" stroke="#bae6fd" strokeWidth="24" strokeLinecap="round" />
                      <path d="M -50 450 Q 250 320, 500 480 T 1100 400" fill="none" stroke="#e0f2fe" strokeWidth="18" strokeLinecap="round" />
                      <text x="350" y="420" className="text-[9px] font-black tracking-widest fill-sky-700/60 uppercase select-none font-mono">Rio Pinheiros 🌊</text>
                      
                      {/* Major grid lines (Streets & Avenues) */}
                      {/* Avenida Paulista */}
                      <path d="M 100 50 L 900 250" fill="none" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" />
                      <path d="M 100 50 L 900 250" fill="none" stroke="#fef08a" strokeWidth="6" strokeLinecap="round" />
                      <text x="380" y="125" className="text-[8.5px] font-black tracking-wide fill-slate-550 uppercase select-none rotate-[14deg]">Avenida Paulista 🚦</text>
                      
                      {/* Avenida Brigadeiro Luis Antonio */}
                      <path d="M 400 0 L 350 500" fill="none" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
                      
                      {/* Avenida Rebouças */}
                      <path d="M 200 0 L 500 550" fill="none" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" />
                      <path d="M 200 0 L 500 550" fill="none" stroke="#f1f5f9" strokeWidth="6" strokeLinecap="round" />
                      <text x="300" y="210" className="text-[8px] font-bold tracking-wide fill-slate-500 uppercase select-none rotate-[61deg]">Av. Rebouças</text>

                      {/* Avenida Brigadeiro Faria Lima */}
                      <path d="M 150 250 L 750 490" fill="none" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" />
                      <path d="M 150 250 L 750 490" fill="none" stroke="#fef08a" strokeWidth="8" strokeLinecap="round" />
                      <text x="470" y="375" className="text-[8.5px] font-extrabold tracking-widest fill-slate-650 uppercase select-none rotate-[21deg]">Av. Brig. Faria Lima (Pet Center) 🏡</text>

                      {/* Random minor roads layout */}
                      <path d="M 0 100 L 1000 100" fill="none" stroke="#ffffff" strokeWidth="4" />
                      <path d="M 0 280 L 1000 280" fill="none" stroke="#ffffff" strokeWidth="4" />
                      <path d="M 0 380 L 1000 380" fill="none" stroke="#ffffff" strokeWidth="4" />
                      
                      <path d="M 100 0 L 100 600" fill="none" stroke="#ffffff" strokeWidth="4" />
                      <path d="M 280 0 L 280 600" fill="none" stroke="#ffffff" strokeWidth="4" />
                      <path d="M 680 0 L 680 600" fill="none" stroke="#ffffff" strokeWidth="4" />
                      <path d="M 850 0 L 850 600" fill="none" stroke="#ffffff" strokeWidth="4" />

                      {/* Simulated Traffic flow layers (Green/Orange lines overlaying key routes) */}
                      {showGridOverlay && (
                        <>
                          <path d="M 100 50 L 600 175" fill="none" stroke="#22c55e" strokeWidth="3" opacity="0.8" strokeLinecap="round" />
                          <path d="M 600 175 L 900 250" fill="none" stroke="#ef4444" strokeWidth="3" opacity="0.8" strokeLinecap="round" />
                          <path d="M 200 0 L 350 275" fill="none" stroke="#22c55e" strokeWidth="3" opacity="0.8" strokeLinecap="round" />
                          <path d="M 350 275 L 500 550" fill="none" stroke="#f97316" strokeWidth="3" opacity="0.8" strokeLinecap="round" />
                          <path d="M 150 250 L 450 350" fill="none" stroke="#22c55e" strokeWidth="3" opacity="0.8" strokeLinecap="round" />
                          <path d="M 450 350 L 750 490" fill="none" stroke="#22c55e" strokeWidth="3" opacity="0.8" strokeLinecap="round" />
                        </>
                      )}

                      {/* Neighborhood labels */}
                      <text x="210" y="75" className="text-[10px] font-bold fill-slate-400 select-none font-sans">Jardins</text>
                      <text x="560" y="115" className="text-[10px] font-bold fill-slate-400 select-none font-sans">Vila Mariana</text>
                      <text x="490" y="360" className="text-[10px] font-bold fill-slate-400 select-none font-sans">Itaim Bibi</text>
                      <text x="170" y="320" className="text-[10px] font-bold fill-slate-400 select-none font-sans">Pinheiros</text>
                    </svg>
                  </div>

                  {/* Interactive Caregiver Pins in authentic Google Maps Drop Marker layouts */}
                  {mapCaregivers.map((cg) => {
                    const isHovered = hoveredCaregiverId === cg.id;
                    return (
                      <div
                        key={cg.id}
                        className="absolute transition-all duration-300 z-20"
                        style={{
                          top: cg.top,
                          left: cg.left,
                          transform: `translate(-50%, -50%)`
                        }}
                      >
                        <div 
                          className="relative cursor-pointer"
                          onMouseEnter={() => setHoveredCaregiverId(cg.id)}
                          onMouseLeave={() => setHoveredCaregiverId(null)}
                        >
                          {/* Pulsing signal halo matching the site's brand */}
                          <span className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-ping pointer-events-none" />
                          <span className="absolute -inset-2.5 rounded-full bg-emerald-500/10 pointer-events-none" />
                          
                          {/* Google Pins Droplet structure: Emerald pin holder with user photo */}
                          <div className="relative w-11 h-11 sm:w-12 sm:h-12 bg-emerald-600 rounded-full p-0.5 shadow-xl border-2 border-white overflow-hidden transition-transform duration-300 hover:scale-110 active:scale-95 z-10">
                            <img 
                              src={cg.avatar} 
                              alt={cg.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full rounded-full object-cover select-none"
                            />
                          </div>
                          {/* Pin stem triangle vector decoration */}
                          <div className="w-3.5 h-3.5 bg-emerald-600 border-r border-b border-white rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2 shadow-md z-0" />

                          {/* Glowing online status point */}
                          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-550 rounded-full border border-white z-20 flex items-center justify-center text-[7px] text-white font-bold shadow-sm">
                            ✓
                          </div>
                        </div>

                        {/* Hover HUD Box: with 5 star ranking system (Yellow indicates evaluation/grey represents unrated) */}
                        <AnimatePresence>
                          {isHovered && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: 10 }}
                              transition={{ duration: 0.12 }}
                              onMouseEnter={() => setHoveredCaregiverId(cg.id)}
                              onMouseLeave={() => setHoveredCaregiverId(null)}
                              className="absolute bottom-14 left-1/2 -translate-x-1/2 w-56 sm:w-64 bg-white/98 backdrop-blur-md border border-zinc-200/90 rounded-2xl shadow-2xl p-4.5 text-left pointer-events-auto z-40 text-slate-800"
                            >
                              {/* Name of the caregiver */}
                              <h3 className="text-xs font-black text-slate-900 tracking-tight flex items-center justify-between">
                                <span>{cg.name}</span>
                                <span className="text-[8px] bg-emerald-50 text-emerald-800 border border-emerald-100 font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider font-sans">
                                  Verificado
                                </span>
                              </h3>
                              
                              {/* City and State */}
                              <div className="flex items-center gap-1 mt-1.5 text-[10px] text-zinc-500 font-semibold">
                                <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span>{cg.cityState} • Coordenada Real</span>
                              </div>

                              {/* Available hours / times */}
                              <div className="mt-2 text-[10px] font-bold text-zinc-650 flex flex-col">
                                <span className="text-[8px] uppercase tracking-widest font-extrabold text-zinc-400 font-mono">Disponibilidade</span>
                                <span className="text-emerald-800/95 mt-0.5">{cg.hours}</span>
                              </div>

                              {/* Horizontal weakness divider */}
                              <div className="h-px bg-zinc-150 my-2.5" />

                              {/* 5 stars rating system where rating is yellow/gold and remaining are grey */}
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] uppercase tracking-wider font-extrabold text-zinc-400 font-mono">Avaliação</span>
                                <div className="flex items-center gap-0.5" title={`${cg.rating} de 5 Estrelas`}>
                                  {[1, 2, 3, 4, 5].map((starIndex) => {
                                    const isFilled = starIndex <= cg.rating;
                                    return (
                                      <svg 
                                        key={starIndex} 
                                        className={`w-3.5 h-3.5 drop-shadow-[0_0.5px_0.5px_rgba(0,0,0,0.1)] transition-colors ${
                                          isFilled 
                                            ? "fill-yellow-400 text-yellow-500" 
                                            : "fill-zinc-200 text-zinc-300"
                                        }`} 
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Action Link inside HUD */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedMapCaregiver(cg);
                                  setContactSubmitted(false);
                                  setContactProposalMsg(`Olá ${cg.name.split(" ")[0]}! Vi seu perfil aproximado no Google Maps do PetAffection. Gostaria de solicitar informações de agendamento para hospedar meu pet.`);
                                }}
                                className="w-full mt-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[9px] uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
                              >
                                Chamar Cuidador
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}

                  {/* Floating map coordinate tracker overlay */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm border border-zinc-200 px-3 py-2 rounded-xl text-[10px] font-mono text-zinc-500 leading-normal flex flex-col select-none shadow-sm">
                    <span className="text-emerald-800 font-extrabold uppercase tracking-wider text-[8px] mb-0.5">Barra de Status GPS</span>
                    <span>LAT: 23° 32' 47" S</span>
                    <span>LON: 46° 38' 14" W</span>
                    <span>SIG: Google Maps Live 🛰️</span>
                  </div>

                  {/* Navigation compass, and scale overview panel */}
                  <div className="absolute right-4 bottom-4 flex flex-col gap-2 z-30">
                    {/* Compass */}
                    <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-zinc-200 flex items-center justify-center relative cursor-pointer shadow-sm" title="Norte Magnético">
                      <div className="w-0.5 h-6 bg-emerald-600 absolute top-1" />
                      <div className="w-0.5 h-3 bg-zinc-300 absolute bottom-1" />
                      <span className="text-[8px] font-extrabold text-emerald-800 absolute top-0.5">N</span>
                    </div>
                  </div>
                </div>

                {/* Map footer description with mock action */}
                <div className="bg-zinc-50 border-t border-zinc-200 px-4 py-3 text-[11px] text-zinc-500 font-sans flex flex-col sm:flex-row items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600">🌐</span>
                    <span>Modo Mapa Digital: Ideal para traçar rotas e proximidade rápida.</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 font-mono">Google Maps Platform API © 2026</span>
                  </div>
                </div>
              </div>
            )}

            {/* CONTEÚDO EXTRA: OUTRAS ABAS SECUNDÁRIAS PARA EVITAR DEAD ENDS */}
            {activeSidebarTab === "nearby" && (
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-4">
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest font-mono">Cuidadores recomendados próximos</h2>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">São Paulo</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {mapCaregivers.map((cg) => {
                    return (
                      <div key={cg.id} className="border border-zinc-200 p-4 rounded-xl flex flex-col gap-3 hover:border-emerald-500 transition-colors bg-zinc-50/40">
                        <div className="flex gap-3">
                          <img 
                            src={cg.avatar} 
                            alt={cg.name} 
                            onClick={() => handleViewUserProfile(cg.name)}
                            className="w-12 h-12 rounded-full border object-cover cursor-pointer transition-transform hover:scale-110" 
                          />
                          <div className="text-left flex-1">
                            <div className="flex items-center justify-between">
                              <p 
                                onClick={() => handleViewUserProfile(cg.name)}
                                className="text-xs font-black text-slate-900 cursor-pointer hover:text-emerald-700 hover:underline"
                              >
                                {cg.name}
                              </p>
                              {/* Small ratings panel */}
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((starIndex) => (
                                  <svg 
                                    key={starIndex} 
                                    className={`w-2.5 h-2.5 ${starIndex <= cg.rating ? "fill-yellow-400 text-yellow-500" : "fill-zinc-200 text-zinc-200"}`}
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                            <p className="text-[10px] text-zinc-450 font-bold">{cg.cityState}</p>
                          </div>
                        </div>
                        <p className="text-[11px] text-zinc-650 leading-relaxed font-semibold text-left italic">
                          "{cg.bio}"
                        </p>
                        <div className="flex flex-col gap-2 mt-1">
                          {/* Hire Button ABOVE Map View button */}
                          <button
                            onClick={() => {
                              startChatWithCaregiver(cg);
                            }}
                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer text-center"
                          >
                            Contratar Cuidador 🤝
                          </button>
                          
                          <button
                            onClick={() => {
                              setActiveSidebarTab("search");
                              setHoveredCaregiverId(cg.id);
                              triggerToast(`Mostrando marcador de ${cg.name.split(" ")[0]} no mapa digital!`);
                            }}
                            className="w-full py-2 bg-emerald-50 text-emerald-800 font-bold rounded-xl text-[10px] uppercase hover:bg-emerald-100 transition-colors font-mono"
                          >
                            Ver no mapa 🗺️
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeSidebarTab === "chat" && (
              <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm flex flex-col md:grid md:grid-cols-3 h-[600px] w-full text-left">
                {/* LISTA DE CONVERSAS */}
                <div className={`md:col-span-1 border-r border-zinc-150 flex flex-col bg-zinc-50/50 h-full ${activeChatRoomId && window.innerWidth < 768 ? 'hidden md:flex' : 'flex'}`}>
                  <div className="p-4 border-b border-zinc-150 bg-white">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-2">Mensagens</h3>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Pesquisar conversa..." 
                        className="w-full bg-zinc-100 text-xs rounded-xl pl-8 pr-3 py-2 outline-none border border-zinc-200 focus:ring-2 focus:ring-emerald-500/20 font-semibold"
                      />
                      <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto divide-y divide-zinc-100 bg-white">
                    {chatRooms.length === 0 ? (
                      <p className="text-xs text-zinc-400 text-center p-4">Nenhum cuidador adicionado.</p>
                    ) : (
                      chatRooms.map((room) => {
                        const cg = mapCaregivers.find(c => c.id === room.caregiverId) || {
                          name: "Cuidador Exemplo",
                          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
                          bio: "Especialista"
                        };
                        const lastMsg = room.messages[room.messages.length - 1];
                        const isSelected = activeChatRoomId === room.caregiverId;

                        return (
                          <button
                            key={room.caregiverId}
                            onClick={() => setActiveChatRoomId(room.caregiverId)}
                            className={`w-full text-left p-3.5 flex gap-3 transition-colors border-b border-zinc-100 ${
                              isSelected ? "bg-emerald-50/70 border-l-4 border-emerald-650" : "bg-white hover:bg-zinc-50"
                            }`}
                          >
                            <div className="relative shrink-0">
                              <img src={cg.avatar} alt={cg.name} className="w-10 h-10 rounded-full object-cover border border-zinc-250 shadow-xs" />
                              <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                                room.status === "Contratado" ? "bg-emerald-500 animate-pulse" : "bg-amber-400"
                              }`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-baseline mb-0.5">
                                <span className="text-xs font-black text-slate-900 truncate">{cg.name}</span>
                                <span className="text-[9px] text-zinc-450 font-semibold font-mono shrink-0">
                                  {lastMsg ? lastMsg.time.split(", ").pop() : ""}
                                </span>
                              </div>
                              <p className="text-[10px] text-zinc-500 truncate font-semibold">
                                {lastMsg ? lastMsg.text : "Nenhuma mensagem..."}
                              </p>
                              <div className="flex gap-1.5 mt-1 items-center">
                                <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-full ${
                                  room.status === "Contratado" 
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-250" 
                                    : "bg-amber-50 text-amber-850 border border-amber-200"
                                }`}>
                                  {room.status}
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* TELA DE CHAT ATIVA (WHATSAPP WEB STYLE) */}
                <div className={`md:col-span-2 flex flex-col bg-[#f0f2f5] h-full relative ${!activeChatRoomId ? 'hidden md:flex' : 'flex'}`}>
                  {activeChatRoomId ? (() => {
                    const room = chatRooms.find(r => r.caregiverId === activeChatRoomId);
                    if (!room) return <div className="flex-1 flex items-center justify-center text-zinc-450 text-xs font-bold p-6">Conversa não encontrada.</div>;

                    const cg = mapCaregivers.find(c => c.id === room.caregiverId) || {
                      name: "Cuidador",
                      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
                      hours: "Disponível"
                    };

                    return (
                      <div className="flex flex-col h-full w-full justify-between">
                        {/* Header do Chat */}
                        <div className="p-3 bg-zinc-100 border-b border-zinc-200 flex items-center justify-between shadow-xs shrink-0">
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => setActiveChatRoomId("")}
                              className="md:hidden px-2.5 py-1.5 bg-zinc-200 hover:bg-zinc-300 rounded-lg text-zinc-800 font-extrabold text-[11px] uppercase"
                            >
                              Voltar
                            </button>
                            <img src={cg.avatar} alt={cg.name} className="w-10 h-10 rounded-full object-cover border border-zinc-350" />
                            <div className="text-left">
                              <p className="text-xs font-black text-slate-900 leading-none">{cg.name}</p>
                              <span className="text-[10px] text-zinc-500 font-bold mt-1 inline-block">
                                {cg.hours} • Canal do PetAffection ✓
                              </span>
                            </div>
                          </div>

                          {/* Botão para contratar cuidado */}
                          <div>
                            {room.status !== "Contratado" ? (
                              <button
                                onClick={() => {
                                  setPaymentModalCaregiverId(room.caregiverId);
                                  setPaymentStep("checkout");
                                  setIsPaymentModalOpen(true);
                                }}
                                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
                              >
                                <span>Confirmar cuidado</span>
                              </button>
                            ) : (
                              <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1.5 rounded-xl font-black text-[9px] uppercase flex items-center gap-1.5 select-none">
                                <span className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse" />
                                Cuidado Confirmado ✓
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Corpo das Mensagens */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#e5ddd5]/65" style={{ minHeight: '380px' }}>
                          {room.messages.map((msg: any, mIdx: number) => {
                            if (msg.sender === "system") {
                              return (
                                <div key={mIdx} className="flex justify-center my-3">
                                  <div className="bg-emerald-50 border border-emerald-250 text-emerald-850 text-[10px] font-extrabold px-4 py-3 rounded-2xl max-w-sm text-center shadow-xs">
                                    {msg.text}
                                  </div>
                                </div>
                              );
                            }

                            const isUser = msg.sender === "user";
                            return (
                              <div 
                                key={mIdx} 
                                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                              >
                                <div className={`max-w-[75%] rounded-2xl p-3 shadow-xs ${
                                  isUser 
                                    ? "bg-emerald-600 text-white rounded-tr-none" 
                                    : "bg-white text-slate-900 rounded-tl-none border border-zinc-200"
                                }`}>
                                  <p className="text-xs font-semibold leading-relaxed break-words whitespace-pre-wrap">{msg.text}</p>
                                  <p className={`text-[8px] text-right mt-1.5 font-bold ${isUser ? "text-emerald-100" : "text-zinc-400 font-mono"}`}>
                                    {msg.time}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Input Footer */}
                        <form 
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (!chatInputText.trim()) return;

                            const newMsg = {
                              sender: "user",
                              text: chatInputText,
                              time: "Hoje, " + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                            };

                            const updatedRooms = chatRooms.map(r => {
                              if (r.caregiverId === room.caregiverId) {
                                return {
                                  ...r,
                                  messages: [...r.messages, newMsg]
                                };
                              }
                              return r;
                            });

                            setChatRooms(updatedRooms);
                            setChatInputText("");
                            triggerToast("Mensagem enviada!");

                            // Auto caregiver respond simulation
                            setTimeout(() => {
                              setChatRooms(prevRooms => {
                                return prevRooms.map(r => {
                                  if (r.caregiverId === room.caregiverId) {
                                    // avoid duplication
                                    const last = r.messages[r.messages.length - 1];
                                    if (last && last.sender === "caregiver" && last.text.includes("responder em instantes")) return r;

                                    return {
                                      ...r,
                                      messages: [
                                        ...r.messages,
                                        {
                                          sender: "caregiver",
                                          text: `Perfeito! Entendido perfeitamente. Estou de olho aqui no chat. Se puder confirmar a contratação pelo botão "Contratar e Confirmar Cuidado" no topo da nossa conversa, ajuda bastante a deixar o meu dia pré-agendado no sistema do PetAffection! 🐾`,
                                          time: "Hoje, " + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                                        }
                                      ]
                                    };
                                  }
                                  return r;
                                });
                              });
                            }, 1300);
                          }}
                          className="p-3 bg-zinc-100 border-t border-zinc-200 flex items-center gap-2 shrink-0"
                        >
                          <input 
                            type="text"
                            value={chatInputText}
                            onChange={(e) => setChatInputText(e.target.value)}
                            placeholder="Escreva sua mensagem segura aqui..."
                            className="flex-1 bg-white border border-zinc-200 hover:border-zinc-350 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 font-semibold text-slate-800"
                          />
                          <button
                            type="submit"
                            className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all cursor-pointer active:scale-95 shadow-sm shrink-0"
                            title="Enviar mensagem"
                          >
                            <svg className="w-4 h-4 fill-current rotate-90" viewBox="0 0 24 24">
                              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                            </svg>
                          </button>
                        </form>
                      </div>
                    );
                  })() : (
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 p-6 text-center h-full">
                      <MessageSquare className="w-12 h-12 text-zinc-300 mb-2.5" />
                      <p className="text-xs font-black text-zinc-650 uppercase">Mensagens Privadas</p>
                      <p className="text-[11px] text-zinc-450 max-w-xs mt-1.5 font-bold leading-relaxed">
                        Selecione um cuidador solicitado ou acordado na lista à esquerda para carregar o bate-papo estilo WhatsApp Web.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSidebarTab === "follow" && (
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm text-center flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
                  <span className="text-xs bg-zinc-900 text-white font-extrabold font-mono px-2 py-0.5 rounded-full">AO VIVO</span>
                </div>
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Acompanhe Seu Pet com Câmera Digital</h2>
                <div className="w-full h-80 bg-zinc-950 rounded-2xl overflow-hidden relative border border-zinc-800 flex items-center justify-center text-zinc-500">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/50 via-zinc-950 to-zinc-950 z-10" />
                  <img 
                    src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600" 
                    alt="Cachorro assistindo câmera" 
                    className="absolute inset-0 w-full h-full object-cover opacity-35 filter sepia hue-rotate-60"
                  />
                  <div className="absolute top-4 left-4 z-20 flex flex-col items-start gap-1 text-[9px] font-mono text-emerald-400">
                    <span>ÁREA DE RECREAÇÃO COLETIVA</span>
                    <span>FRAME RATE: 30 FPS • SINAL EXCELENTE</span>
                  </div>
                  <div className="absolute bottom-4 right-4 z-20 text-[9px] font-mono text-zinc-400 bg-zinc-900/80 px-2 py-0.5 rounded-md">
                    17-06-2026 22:52:22 UTC
                  </div>
                  <div className="z-20 flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md cursor-pointer transition-all">
                      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-white text-xs font-bold font-mono">Stream PetRoom São Paulo Centro</span>
                  </div>
                </div>
              </div>
            )}

            {activeSidebarTab === "profile" && (() => {
              const isCurrentUser = (selectedProfileId === "user" || selectedProfileId.toLowerCase() === "user" || selectedProfileId.toLowerCase() === (fullName || "Visitante").toLowerCase());
              
              // Resolve details
              const profileName = isCurrentUser ? (fullName || "Visitante") : (otherUsersData[selectedProfileId]?.name || selectedProfileId);
              
              const getStableRandomRole = (name: string) => {
                let hash = 0;
                for (let i = 0; i < name.length; i++) {
                  hash = name.charCodeAt(i) + ((hash << 5) - hash);
                }
                const index = Math.abs(hash) % 3;
                const roles = ["Dono", "Cuidador", "Os dois (Dono e Cuidador)"];
                return roles[index];
              };

              const getFormattedRole = (role: "dono" | "cuidador" | "ambos") => {
                if (role === "dono") return "Dono";
                if (role === "cuidador") return "Cuidador";
                return "Os dois (Dono e Cuidador)";
              };

              const profileRole = isCurrentUser ? getFormattedRole(userPetRole) : getStableRandomRole(profileName);
              const profileAvatar = isCurrentUser ? userAvatarUrl : (otherUsersData[selectedProfileId]?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150");
              const profileBioText = isCurrentUser ? userBio : (otherUsersData[selectedProfileId]?.bio || "Amante de animais e membro dedicado da rede PetAffection.");
              const profilePets = isCurrentUser ? userPets : (otherUsersData[selectedProfileId]?.pets || []);
              const profileRating = isCurrentUser ? 5 : (otherUsersData[selectedProfileId]?.rating || 5);
              
              // Posts feed list
              const isCuidador = profileRole.toLowerCase().includes("cuidador");
              const profilePosts = isCurrentUser 
                ? (userPetRole === "ambos" ? [...currentUserPosts, ...currentCaregiverPosts] : (isCuidador ? currentCaregiverPosts : currentUserPosts))
                : (otherUsersData[selectedProfileId]?.posts || []);

              // Handlers for dynamic state updates
              const handleProfilePhotoClick = () => {
                if (isCurrentUser) {
                  profileFileInputRef.current?.click();
                }
              };

              const onProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    if (event.target?.result) {
                      setUserAvatarUrl(event.target.result as string);
                      triggerToast("Foto de perfil atualizada do computador! 📸");
                    }
                  };
                  reader.readAsDataURL(file);
                }
              };

              const onNewPostPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    if (event.target?.result) {
                      setNewProfilePostImage(event.target.result as string);
                      triggerToast("Imagem do post carregada! Para publicar, insira a legenda.");
                    }
                  };
                  reader.readAsDataURL(file);
                }
              };

              const handleSaveName = () => {
                if (!editNameValue.trim()) {
                  triggerToast("Insira um nome válido!");
                  return;
                }
                setFullName(editNameValue);
                setIsEditingName(false);
                triggerToast("Nome de perfil atualizado com sucesso!");
              };

              const handleSaveBio = () => {
                setUserBio(editBioValue);
                setIsEditingBio(false);
                triggerToast("Biografia de perfil atualizada com sucesso!");
              };

              const handleAddNewPet = (e: React.FormEvent) => {
                e.preventDefault();
                if (!newPetNameInput.trim()) {
                  triggerToast("Por favor, informe o nome do pet!");
                  return;
                }
                const newPet = {
                  id: "pet_" + Date.now(),
                  name: newPetNameInput.trim()
                };
                setUserPets([...userPets, newPet]);
                setNewPetNameInput("");
                triggerToast(`${newPet.name} foi adicionado à sua lista de pets! 🐶✨`);
              };

              const handleRemovePet = (petId: string, petName: string) => {
                setUserPets(userPets.filter(p => p.id !== petId));
                triggerToast(`${petName} foi removido com sucesso.`);
              };

              const handleCreateProfilePost = (e: React.FormEvent) => {
                e.preventDefault();
                if (!newProfilePostCaption.trim()) {
                  triggerToast("Adicione uma legenda para sua postagem!");
                  return;
                }

                const postObj = {
                  id: "prof_post_" + Date.now(),
                  imageUrl: newProfilePostImage || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600",
                  caption: newProfilePostCaption,
                  createdAt: "Agora mesmo"
                };

                if (isCuidador) {
                  setCurrentCaregiverPosts([postObj, ...currentCaregiverPosts]);
                  triggerToast("Trabalho postado com sucesso no seu portfólio de cuidador! 💼✨");
                } else {
                  setCurrentUserPosts([postObj, ...currentUserPosts]);
                  triggerToast("Foto do pet compartilhada com sucesso na sua rede! 🐾✨");
                }
                setNewProfilePostCaption("");
                setNewProfilePostImage("");
              };

              return (
                <div className="flex flex-col gap-6 animate-fade-in text-left">
                  {/* Back to Home navigation header if checking other member */}
                  {!isCurrentUser && (
                    <button 
                      onClick={() => handleViewUserProfile("user")}
                      className="flex items-center gap-2 text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-3.5 py-1.5 rounded-full w-fit self-start transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Voltar para Meu Perfil</span>
                    </button>
                  )}

                  {/* PROFILE CARD */}
                  <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start">
                    {/* Left side: Avatar & trigger selection */}
                    <div className="relative shrink-0 mx-auto md:mx-0">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-emerald-500 shadow-md relative overflow-hidden bg-zinc-150">
                        <img 
                          src={profileAvatar} 
                          alt={profileName} 
                          className="w-full h-full object-cover select-none" 
                        />
                      </div>
                      
                      {isCurrentUser && (
                        <>
                          <button 
                            onClick={handleProfilePhotoClick}
                            type="button"
                            title="Trocar Foto de Perfil"
                            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center border-2 border-white cursor-pointer active:scale-95 transition-all shadow-md"
                          >
                            <Camera className="w-4 h-4" />
                          </button>
                          <input 
                            type="file" 
                            ref={profileFileInputRef}
                            accept="image/*"
                            onChange={onProfilePhotoChange}
                            className="hidden" 
                          />
                        </>
                      )}
                    </div>

                    {/* Right side: Credentials, name & biography edit forms */}
                    <div className="flex-1 text-left w-full space-y-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {isEditingName ? (
                            <div className="flex items-center gap-1.5 w-full sm:w-auto">
                              <input 
                                type="text" 
                                value={editNameValue}
                                onChange={(e) => setEditNameValue(e.target.value)}
                                className="bg-zinc-50 border border-zinc-250 rounded-xl px-3 py-1.5 text-sm font-bold text-zinc-800 focus:outline-none focus:border-emerald-600 w-full sm:w-64"
                                placeholder="Nome Completo"
                              />
                              <button 
                                onClick={handleSaveName}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-3 py-1.5 text-xs font-extrabold shadow-sm"
                              >
                                Salvar
                              </button>
                              <button 
                                onClick={() => setIsEditingName(false)}
                                className="bg-zinc-200 hover:bg-zinc-300 text-zinc-700 rounded-xl px-2.5 py-1.5 text-xs font-bold"
                              >
                                X
                              </button>
                            </div>
                          ) : (
                            <>
                              <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight leading-none">
                                {profileName}
                              </h2>
                              {isCurrentUser && (
                                <button 
                                  onClick={() => {
                                    setEditNameValue(profileName);
                                    setIsEditingName(true);
                                  }}
                                  className="text-zinc-400 hover:text-emerald-700 p-1"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                              )}
                            </>
                          )}
                        </div>

                        {/* Badge / Verification */}
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                            {profileRole}
                          </span>
                          {isCuidador && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-3 py-1 rounded-full flex items-center gap-0.5 shadow-sm">
                              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                              <span>{profileRating}.0 Estrelas</span>
                            </span>
                          )}
                        </div>

                        {/* Role Selector (ONLY for current user) */}
                        {isCurrentUser && (
                          <div className="mt-3 p-3 bg-emerald-50/40 border border-emerald-100 rounded-xl space-y-2">
                            <span className="block text-[9px] text-emerald-800 font-black uppercase tracking-wider font-mono">
                              Minha Atuação no PetAffection:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {(["cuidador", "dono", "ambos"] as const).map((r) => (
                                <button
                                  key={r}
                                  type="button"
                                  onClick={() => {
                                    setUserPetRole(r);
                                    triggerToast(`Atuação alterada para: ${r === "cuidador" ? "Cuidador" : r === "dono" ? "Dono" : "Os dois (Dono e Cuidador)"} 🐾`);
                                  }}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    userPetRole === r
                                      ? "bg-emerald-600 text-white shadow-sm"
                                      : "bg-white text-emerald-800 border border-emerald-200/60 hover:bg-emerald-50"
                                  }`}
                                >
                                  {r === "cuidador" ? "Cuidador" : r === "dono" ? "Dono" : "Os dois 🐾"}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Bio info */}
                      <div className="bg-zinc-50/75 border border-zinc-150 p-4 rounded-2xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[9px] text-zinc-400 font-black uppercase tracking-widest font-mono">SOBRE MIM</span>
                          {isCurrentUser && !isEditingBio && (
                            <button 
                              onClick={() => {
                                setEditBioValue(profileBioText);
                                setIsEditingBio(true);
                              }}
                              className="text-zinc-400 hover:text-emerald-700 font-bold text-xs flex items-center gap-1"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              <span>Editar</span>
                            </button>
                          )}
                        </div>

                        {isEditingBio ? (
                          <div className="space-y-2">
                            <textarea
                              rows={3}
                              value={editBioValue}
                              onChange={(e) => setEditBioValue(e.target.value)}
                              className="w-full bg-white border border-zinc-255 rounded-xl p-3 text-xs text-zinc-705 focus:outline-none focus:border-emerald-600 leading-relaxed font-semibold"
                              placeholder="Fale um pouco sobre você..."
                            />
                            <div className="flex items-center gap-1.5 justify-end">
                              <button 
                                onClick={handleSaveBio}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-3.5 py-1.5 text-xs font-extrabold shadow-sm cursor-pointer"
                              >
                                Salvar Bio
                              </button>
                              <button 
                                onClick={() => setIsEditingBio(false)}
                                className="bg-zinc-200 hover:bg-zinc-300 text-zinc-650 rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-zinc-700 font-medium leading-relaxed italic">
                            "{profileBioText}"
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM SECTIONS DEPENDING ON ROLE */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    
                    <div className="md:col-span-1 space-y-6">
                      {/* Render status do cuidador if they have Cuidador role */}
                      {profileRole.toLowerCase().includes("cuidador") && (
                        <div className="bg-white border border-zinc-200 rounded-3xl p-5 shadow-sm space-y-4">
                          <div className="border-b border-zinc-100 pb-3">
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest font-mono">Status do Cuidador 🤝</h3>
                          </div>
                          <div className="space-y-3.5">
                            <div className="flex items-center justify-between text-xs font-bold text-zinc-650">
                              <span>Avaliação Média:</span>
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((sIndex) => (
                                  <Star 
                                    key={sIndex} 
                                    className={`w-3.5 h-3.5 ${sIndex <= profileRating ? "fill-amber-400 text-amber-500" : "fill-zinc-150 text-zinc-150"}`} 
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-xs font-bold text-zinc-650">
                              <span>Status Cadastro:</span>
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1 rounded-full uppercase">
                                Verificado
                              </span>
                            </div>
                            {!isCurrentUser && (
                              <button
                                type="button"
                                onClick={() => {
                                  const cgObj = mapCaregivers.find(c => c.name.toLowerCase() === profileName.toLowerCase()) || { id: selectedProfileId, name: profileName };
                                  startChatWithCaregiver(cgObj);
                                }}
                                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wide transition-all shadow-md active:scale-95 text-center block mt-3 cursor-pointer"
                              >
                                Iniciar Conversa 📍
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Render Meus Pets if they have Dono role */}
                      {profileRole.toLowerCase().includes("dono") && (
                        <div className="bg-white border border-zinc-200 rounded-3xl p-5 shadow-sm space-y-4">
                          <div className="border-b border-zinc-100 pb-3 flex items-center justify-between">
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest font-mono">Meus Pets 🐾</h3>
                            <span className="text-[10px] bg-emerald-50 text-emerald-800 font-extrabold px-3 py-0.5 rounded-full">
                              {profilePets.length} {profilePets.length === 1 ? "Pet" : "Pets"}
                            </span>
                          </div>

                          {profilePets.length > 0 ? (
                            <div className="flex flex-col gap-2">
                              {profilePets.map((p: any) => (
                                <div key={p.id} className="flex items-center justify-between bg-zinc-50 border border-zinc-150 px-3 py-2.5 rounded-xl text-xs font-bold text-zinc-850">
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">🐶</span>
                                    <span>{p.name}</span>
                                  </div>
                                  {isCurrentUser && (
                                    <button 
                                      onClick={() => handleRemovePet(p.id, p.name)}
                                      title="Remover Pet"
                                      className="p-1 text-zinc-400 hover:text-red-500 rounded-lg transition-colors"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[11px] text-zinc-450 leading-relaxed font-semibold italic text-center py-2">
                              Nenhum pet registrado.
                            </p>
                          )}

                          {isCurrentUser && (
                            <form onSubmit={handleAddNewPet} className="pt-2 border-t border-zinc-100 space-y-2">
                              <span className="text-[9px] text-zinc-400 font-black uppercase tracking-wider font-mono">Registrar Novo Pet</span>
                              <div className="flex gap-1.5 items-stretch">
                                <input 
                                  type="text"
                                  value={newPetNameInput}
                                  onChange={(e) => setNewPetNameInput(e.target.value)}
                                  className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-emerald-600 w-full min-w-0"
                                  placeholder="Nome do pet..."
                                />
                                <button 
                                  type="submit"
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-3.5 shrink-0 flex items-center justify-center shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                                  title="Registrar Pet"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </form>
                          )}
                        </div>
                      )}
                    </div>

                    {/* RIGHT / MAIN SIDE CONTENT FEED: TIMELINE DE FOTOS DA REDE SOCIAL */}
                    <div className="md:col-span-2 space-y-5 w-full">
                      
                      {/* Social Media photo share form */}
                      {isCurrentUser && (
                        <div className="bg-white border border-zinc-200 rounded-3xl p-5 shadow-sm">
                          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest font-mono mb-4 border-b pb-2 flex items-center gap-1.5">
                            <span>📸</span>
                            <span>{isCuidador ? "Portfólio: Compartilhar Cuidado" : "Nova Foto do Pet"}</span>
                          </h3>
                          
                          <form onSubmit={handleCreateProfilePost} className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                              {/* Hidden image uploader from computer with preview */}
                              <div className="relative w-20 h-20 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden transition-all shrink-0" onClick={() => postFileInputRef.current?.click()}>
                                {newProfilePostImage ? (
                                  <img src={newProfilePostImage} alt="Post preview" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="text-center text-zinc-400 p-1 flex flex-col items-center">
                                    <Image className="w-5 h-5 mb-0.5 text-emerald-600" />
                                    <span className="text-[7px] font-black uppercase tracking-wider">Computador</span>
                                  </div>
                                )}
                              </div>
                              <input 
                                type="file" 
                                ref={postFileInputRef}
                                accept="image/*"
                                onChange={onNewPostPhotoChange}
                                className="hidden" 
                              />

                              <div className="flex-1 w-full">
                                <textarea
                                  rows={2}
                                  value={newProfilePostCaption}
                                  onChange={(e) => setNewProfilePostCaption(e.target.value)}
                                  className="w-full bg-zinc-50 border border-zinc-150 rounded-xl px-3.5 py-2 text-xs font-semibold text-zinc-700 focus:outline-none focus:border-emerald-600"
                                  placeholder={isCuidador ? 'Escreva sobre um pet cuidado Ex: Romeu cachorrinho super fofo do @carlos.almeida.' : 'Escreva uma legenda Ex: Pipoca correndo muito no gramado do parque hoje! 🐶'}
                                />
                              </div>
                            </div>

                            <div className="flex justify-between items-center pt-2">
                              {newProfilePostImage && (
                                <button
                                  type="button"
                                  onClick={() => setNewProfilePostImage("")}
                                  className="text-[10px] text-red-500 hover:underline font-bold"
                                >
                                  Remover foto
                                </button>
                              )}
                              <button
                                type="submit"
                                className="ml-auto bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4 py-2 text-xs font-extrabold shadow-md flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
                              >
                                <span>Publicar</span>
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </form>
                        </div>
                      )}

                      {/* SOCIAL NETWORK GRID FEED DISPLAY */}
                      <div className="space-y-3.5">
                        <h4 className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-widest font-mono">
                          {isCuidador ? "Portfólio de Cuidados Prestados" : "Fotos e Momentos de Pets"}
                        </h4>

                        {profilePosts.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {profilePosts.map((post: any, pIdx: number) => (
                              <div key={post.id || pIdx} className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm flex flex-col hover:border-emerald-500/50 transition-colors">
                                {/* Image frame */}
                                <div className="aspect-[4/3] bg-zinc-100 overflow-hidden relative">
                                  <img 
                                    src={post.imageUrl || post.image} 
                                    alt={post.caption}
                                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                                  />
                                </div>
                                {/* Caption description */}
                                <div className="p-4 flex-1 flex flex-col justify-between text-left gap-1.5 bg-zinc-50/20">
                                  <p className="text-xs font-medium text-zinc-800 leading-relaxed">
                                    {post.caption}
                                  </p>
                                  <div className="flex items-center justify-between text-[9px] text-zinc-400 font-extrabold font-mono uppercase border-t pt-2 mt-1.5">
                                    <span>{post.createdAt || "Há alguns dias"}</span>
                                    <span className="text-emerald-700">♥ PetAffection</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-white border border-zinc-200 rounded-3xl p-8 text-center text-zinc-400 font-semibold italic text-xs">
                             Nenhuma foto compartilhada na rede social ainda.
                          </div>
                        )}

                      </div>

                    </div>

                  </div>
                </div>
              );
            })()}

          </main>
        </div>

        {/* MODAL COBERTURA CONTATO DE CUIDADORES */}
        <AnimatePresence>
          {selectedMapCaregiver && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-md w-full border border-zinc-200 p-6 text-slate-800"
              >
                <div className="flex items-center justify-between pb-3 border-b border-zinc-150">
                  <h3 className="text-xs font-black text-zinc-900 uppercase tracking-wide">Proposta de Agendamento</h3>
                  <button 
                    onClick={() => setSelectedMapCaregiver(null)}
                    className="p-1 rounded-full text-zinc-400 hover:text-zinc-650 font-bold text-lg cursor-pointer"
                  >
                    ×
                  </button>
                </div>

                {!contactSubmitted ? (
                  <div className="mt-4 text-left flex flex-col gap-4">
                    <div className="flex gap-3 items-center">
                      <img src={selectedMapCaregiver.avatar} alt="caregiver" className="w-12 h-12 rounded-full object-cover border" />
                      <div>
                        <p className="text-xs font-extrabold text-zinc-900">{selectedMapCaregiver.name}</p>
                        <p className="text-[10px] text-zinc-500 font-semibold">Satélite • {selectedMapCaregiver.lat}, {selectedMapCaregiver.lng}</p>
                      </div>
                    </div>

                    <p className="text-[11px] text-zinc-500 leading-relaxed font-semibold italic bg-zinc-50 p-3 rounded-xl border border-zinc-150">
                      "{selectedMapCaregiver.bio}"
                    </p>

                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Escreva sua Mensagem Privada</label>
                      <textarea
                        rows={3}
                        value={contactProposalMsg}
                        onChange={(e) => setContactProposalMsg(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 font-semibold text-slate-800"
                      />
                    </div>

                    <button
                      onClick={() => {
                        setContactSubmitted(true);
                        // Add room or messages
                        const existingRoom = chatRooms.find(room => room.caregiverId === selectedMapCaregiver.id);
                        if (!existingRoom) {
                          const newRoom = {
                            caregiverId: selectedMapCaregiver.id,
                            status: "Solicitado",
                            messages: [
                              { sender: "user", text: contactProposalMsg || `Olá ${selectedMapCaregiver.name.split(" ")[0]}! Gostaria de falar sobre o agenciamento do cuidado do meu pet.`, time: "Agora" },
                              { sender: "caregiver", text: `Olá! Recebi sua mensagem de agendamento aqui pelo Google Maps do PetAffection. É um prazer falar com você! Que pet lindo você tem. Vamos combinar os detalhes e fechar com toda a segurança?`, time: "Agora" }
                            ]
                          };
                          setChatRooms([...chatRooms, newRoom]);
                        } else {
                          // if room exists, add the new user message as well
                          const updatedRoomList = chatRooms.map(r => {
                            if (r.caregiverId === selectedMapCaregiver.id) {
                              return {
                                ...r,
                                messages: [
                                  ...r.messages,
                                  { sender: "user", text: contactProposalMsg || `Olá ${selectedMapCaregiver.name.split(" ")[0]}! Nova mensagem de agendamento.`, time: "Agora" }
                                ]
                              };
                            }
                            return r;
                          });
                          setChatRooms(updatedRoomList);
                        }
                        triggerToast(`Sua proposta foi transmitida para ${selectedMapCaregiver.name.split(" ")[0]}!`);
                      }}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      Enviar Proposta com Segurança
                    </button>
                  </div>
                ) : (
                  <div className="mt-6 text-center flex flex-col items-center gap-4 py-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-2xl">
                      ✔
                    </div>
                    <div>
                      <p className="text-sm font-black text-emerald-950">Solicitação Enviada!</p>
                      <p className="text-xs text-zinc-550 font-semibold leading-relaxed max-w-xs mt-1.5">
                        O cuidador foi notificado via canal reservado do PetAffection. Ele deve responder nas próximas horas para combinar os detalhes.
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedMapCaregiver(null)}
                      className="mt-2 px-6 py-2 bg-zinc-900 hover:bg-zinc-850 text-white font-bold text-[10px] uppercase rounded-lg transition-colors cursor-pointer"
                    >
                      Fechar Janela
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* NOTIFICAÇÃO FLUTUANTE */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 50, x: "-50%" }}
              className="fixed bottom-6 left-1/2 bg-zinc-900/95 text-white text-xs font-bold px-5 py-3 rounded-full shadow-2xl z-50 flex items-center gap-2 select-none"
            >
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {renderPaymentModal()}
      </div>
    );
  };

  if (currentView === "dashboard") {
    return renderDashboard();
  }

  return (
    <div className={`min-h-screen flex flex-col justify-between p-4 sm:p-12 bg-gradient-to-b ${theme.bgGradient} font-sans antialiased transition-all duration-700 relative overflow-hidden`}>
      
      {/* Background visual effects for all initial screens (welcome, signup, login) */}
      {(currentView === "welcome" || currentView === "signup" || currentView === "login") && (
        <>
          {/* Animated rising darker bottom gradient wave */}
          <div className="absolute bottom-0 left-0 right-0 h-[60vh] bg-gradient-to-t from-emerald-200/50 via-emerald-100/10 to-transparent blur-3xl pointer-events-none z-0 animate-dark-wave" />
          {/* Animated floating bubbles */}
          <BubblesBackground />
        </>
      )}

      {/* Header Minimalista */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between py-2 relative z-10">
        <div 
          onClick={resetFormAndNavigateWelcome} 
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            {/* Premium paw print icon */}
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M12 10.5c-1.8 0-3.3 1.4-3.3 3.1 0 1.2.6 2.3 1.5 2.8.5.3 1.1.5 1.8.5s1.3-.2 1.8-.5c.9-.5 1.5-1.6 1.5-2.8 0-1.7-1.5-3.1-3.3-3.1z" />
              <circle cx="7.2" cy="11" r="1.5" />
              <circle cx="10.1" cy="7.8" r="1.5" />
              <circle cx="13.9" cy="7.8" r="1.5" />
              <circle cx="16.8" cy="11" r="1.5" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#064e3b]">
            PetAffection
          </span>
        </div>

        {/* Status discreto */}
        <div className="flex items-center gap-2 bg-emerald-100/60 px-3.5 py-1.5 rounded-full text-[11px] font-semibold text-emerald-800 tracking-wide uppercase">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Serviço Online
        </div>
      </header>

      {/* Conteúdo Centralizado */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-lg w-full mx-auto my-8 relative z-10">
        <AnimatePresence mode="wait">
          {currentView === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={`w-full ${theme.cardBg} border ${theme.cardBorder} ${theme.shadow} p-8 sm:p-12 rounded-3xl flex flex-col items-center text-center`}
              id="welcome-card"
            >
              {/* Paw logomark (Patinha simples icon) */}
              <div className="w-24 h-24 mb-8 flex items-center justify-center bg-emerald-500/10 rounded-full p-4 relative transition-transform hover:rotate-6">
                <svg 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                  className="w-14 h-14 text-emerald-600 filter drop-shadow-[0_2px_4px_rgba(16,185,129,0.15)]"
                  aria-label="Logo PetAffection"
                >
                  <path d="M12 10.5c-1.8 0-3.3 1.4-3.3 3.1 0 1.2.6 2.3 1.5 2.8.5.3 1.1.5 1.8.5s1.3-.2 1.8-.5c.9-.5 1.5-1.6 1.5-2.8 0-1.7-1.5-3.1-3.3-3.1z" />
                  <circle cx="7.2" cy="11" r="1.5" />
                  <circle cx="10.1" cy="7.8" r="1.5" />
                  <circle cx="13.9" cy="7.8" r="1.5" />
                  <circle cx="16.8" cy="11" r="1.5" />
                </svg>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-[10px] text-white font-bold p-1 rounded-full shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Título de boas-vindas */}
              <h1 className="text-4xl sm:text-[42px] font-extrabold tracking-tight text-[#064e3b] mb-4 font-display">
                Bem Vindo(a)!
              </h1>

              {/* Descrição minimalista da aplicação */}
              <p className="text-sm sm:text-base text-emerald-700/80 mb-10 leading-relaxed max-w-sm">
                Conectamos cuidadores afetuosos com pets que precisam de atenção e carinho enquanto seus donos viajam ou estão ausentes.
              </p>

              {/* Link para a tela de login */}
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigateTo("login")}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-sm tracking-wide flex items-center justify-center gap-2.5 transition-all duration-300 ${theme.buttonStyle}`}
                id="login-link-button"
              >
                <span>Ir para a Tela de Login</span>
                <ChevronRight className="w-4.5 h-4.5" />
              </motion.button>
              
              {/* Link de cadastro */}
              <button
                onClick={() => navigateTo("signup")}
                className="mt-6 text-sm font-semibold text-emerald-700 hover:text-emerald-900 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20 rounded px-2 py-1"
                id="register-link-button"
              >
                Não tem uma conta? <span className="underline decoration-emerald-500/40 hover:decoration-emerald-700 underline-offset-4 font-bold">Cadastre-se</span>
              </button>
            </motion.div>
          )}

          {currentView === "signup" && (
            /* Tela de Cadastro (Sign Up View - Unificado) */
            <motion.div
              key="signup"
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={`w-full ${theme.cardBg} border ${theme.cardBorder} ${theme.shadow} p-6 sm:p-10 rounded-3xl flex flex-col overflow-hidden`}
              id="signup-card"
            >
              {/* Header de navegação de cadastro */}
              <div className="flex items-center justify-between mb-6">
                <button 
                  onClick={() => {
                    if (signupRole === "dono" && donoStep === "pet" && !registeredSuccess) {
                      setSlideDirection("left");
                      setDonoStep("info");
                    } else {
                      resetFormAndNavigateWelcome();
                    }
                  }}
                  className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors uppercase tracking-wider bg-emerald-50 hover:bg-emerald-100/80 px-3 py-1.5 rounded-xl border border-emerald-100"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {signupRole === "dono" && donoStep === "pet" && !registeredSuccess ? "Voltar ao Perfil" : "Menu Inicial"}
                </button>

                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  {signupRole === "cuidador" ? "Perfil Cuidador" : donoStep === "info" ? "Perfil Dono • Passo 1" : "Cadastro do Pet • Passo 2"}
                </span>
              </div>

              {registeredSuccess ? (
                /* Sucesso no Cadastro */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center flex flex-col items-center py-8"
                  id="success-signup-hub"
                >
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-[#064e3b] mb-1">
                    Cadastro realizado com sucesso!
                  </h3>
                  <p className="text-xs text-emerald-700/80 mb-6 max-w-xs">
                    {signupRole === "cuidador" 
                      ? "Seu perfil de cuidador parceiro foi criado e está pronto para receber propostas fictícias!" 
                      : `Sua conta e o perfil do pet "${petName}" foram salvos na nossa base de demonstração para testes.`}
                  </p>

                  <div className="bg-white border border-emerald-100 rounded-xl p-4 w-full text-left text-[11px] text-emerald-800 mb-6 space-y-1.5 font-mono">
                    <span className="block font-bold text-emerald-950 mb-1 uppercase tracking-wider text-[10px]">Resumo do Cadastro</span>
                    <p>• Nome: {fullName || "Inquilino Demonstrativo"}</p>
                    <p>• E-mail: {email || "cuidador@petaffection.com"}</p>
                    <p>• Categoria: {signupRole === "cuidador" ? "Cuidador de Pets" : "Dono de Pet"}</p>
                    {signupRole === "dono" && (
                      <>
                        <p>• CPF: {cpf}</p>
                        <p>• CEP: {cep}</p>
                        <p>• Endereço: {logradouro}, Nº {numero} {complemento && `(${complemento})`} - {bairro}, {cidade}/{uf}</p>
                        <p>• Pet: {petName} ({petAge} anos)</p>
                        <p>• Espécie do Pet: {petEspecie}</p>
                        <p>• Espécie Escolhida: {selectedAnimals.join(", ")} {isOtherSelected && `(${otherAnimalText})`}</p>
                        <p>• Necessidades Especiais: {hasSpecialNeeds ? "Sim" : "Não"}</p>
                      </>
                    )}
                  </div>

                  <button
                    onClick={resetFormAndNavigateWelcome}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-emerald-600/10"
                    id="back-welcome-post-success"
                  >
                    Ir para Tela Principal
                  </button>
                </motion.div>
              ) : (
                /* HUD de Cadastro com Seletores principais */
                <div className="flex-1 flex flex-col">
                  
                  {/* Seletor de Tipo de Cadastro: Cuidador vs Dono (visível apenas na primeira parte do cadastro) */}
                  {!(signupRole === "dono" && donoStep === "pet") && (
                    <div className="mb-6">
                      <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 text-center">
                        Qual é o seu objetivo?
                      </label>
                      <div className="grid grid-cols-2 gap-2 bg-emerald-100/40 p-1.5 rounded-2xl border border-emerald-200/40">
                        <button
                          type="button"
                          onClick={() => handleRoleChange("cuidador")}
                          className={`py-3 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                            signupRole === "cuidador"
                              ? "bg-white text-emerald-800 shadow-sm border border-emerald-200"
                              : "text-emerald-700/70 hover:text-emerald-800"
                          }`}
                          id="btn-role-cuidador"
                        >
                          <Briefcase className="w-3.5 h-3.5" />
                          Quero Cuidar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRoleChange("dono")}
                          className={`py-3 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                            signupRole === "dono"
                              ? "bg-white text-emerald-800 shadow-sm border border-emerald-200"
                              : "text-emerald-700/70 hover:text-emerald-800"
                          }`}
                          id="btn-role-dono"
                        >
                          <Heart className="w-3.5 h-3.5 text-rose-500" />
                          Sou Dono de Pet
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Formulário Animado Horizontalmente (Slide Left & Right) */}
                  <div className="relative overflow-visible">
                    <AnimatePresence mode="prev">
                      
                      {/* CUIDADOR FORM HUD */}
                      {signupRole === "cuidador" && (
                        <motion.div
                          key="cuidador-form"
                          initial={{ opacity: 0, x: slideDirection === "right" ? 120 : -120 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: slideDirection === "right" ? -120 : 120 }}
                          transition={{ duration: 0.35, ease: "easeInOut" }}
                        >
                          <form onSubmit={handleRegisterSubmit} className="space-y-4">
                            <div>
                              <h3 className="text-[#064e3b] font-extrabold text-lg mb-1 font-display">
                                Cadastro de Cuidador
                              </h3>
                              <p className="text-xs text-emerald-700/70 mb-4">
                                Preencha para se candidatar e localizar pets necessitando de acolhimento.
                              </p>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                                Nome Completo
                              </label>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-emerald-600/50">
                                  <User className="w-4 h-4" />
                                </span>
                                <input 
                                  type="text" 
                                  required
                                  placeholder="Ex: Amanda Silva"
                                  value={fullName}
                                  onChange={(e) => setFullName(e.target.value)}
                                  className="block w-full pl-10 pr-4 py-2.5 text-sm bg-emerald-50/50 hover:bg-emerald-50 focus:bg-white border border-emerald-150 rounded-xl text-emerald-850 font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder-emerald-800/25"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                                E-mail de Trabalho
                              </label>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-emerald-600/50">
                                  <Mail className="w-4 h-4" />
                                </span>
                                <input 
                                  type="email" 
                                  required
                                  placeholder="seuemail@petaffection.com"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  className="block w-full pl-10 pr-4 py-2.5 text-sm bg-emerald-50/50 hover:bg-emerald-50 focus:bg-white border border-emerald-150 rounded-xl text-emerald-850 font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder-emerald-800/25"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                                Telefone para Contato
                              </label>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-emerald-600/50">
                                  <Phone className="w-4 h-4" />
                                </span>
                                <input 
                                  type="tel" 
                                  required
                                  placeholder="(11) 98888-7777"
                                  value={phone}
                                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                                  className="block w-full pl-10 pr-4 py-2.5 text-sm bg-emerald-50/50 hover:bg-emerald-50 focus:bg-white border border-emerald-150 rounded-xl text-emerald-850 font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder-emerald-800/25"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                                <Briefcase className="w-3.5 h-3.5" />
                                Preferência de Cuidado
                              </label>
                              <div className="grid grid-cols-3 gap-2 text-xs font-bold text-emerald-800">
                                <button
                                  type="button"
                                  onClick={() => setPetExperience("dogs")}
                                  className={`py-2 px-1 text-center border rounded-xl transition-all ${petExperience === "dogs" ? "bg-emerald-600 border-emerald-600 text-white" : "bg-emerald-50/50 hover:bg-emerald-50 border-emerald-200"}`}
                                >
                                  Cães 🐕
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setPetExperience("cats")}
                                  className={`py-2 px-1 text-center border rounded-xl transition-all ${petExperience === "cats" ? "bg-emerald-600 border-emerald-600 text-white" : "bg-emerald-50/50 hover:bg-emerald-50 border-emerald-200"}`}
                                >
                                  Gatos 🐈
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setPetExperience("all")}
                                  className={`py-2 px-1 text-center border rounded-xl transition-all ${petExperience === "all" ? "bg-emerald-600 border-emerald-600 text-white" : "bg-emerald-50/50 hover:bg-emerald-50 border-emerald-200"}`}
                                >
                                  Ambos 🐾
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                                Senha de Acesso
                              </label>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-emerald-600/50">
                                  <Lock className="w-4 h-4" />
                                </span>
                                <input 
                                  type={showPasswordSignup ? "text" : "password"} 
                                  required
                                  minLength={6}
                                  placeholder="Crie uma senha forte"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  className="block w-full pl-10 pr-12 py-2.5 text-sm bg-emerald-50/50 hover:bg-emerald-50 focus:bg-white border border-emerald-150 rounded-xl text-emerald-850 font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder-emerald-800/25"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPasswordSignup(!showPasswordSignup)}
                                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-emerald-600/50 hover:text-emerald-700 focus:outline-none"
                                >
                                  {showPasswordSignup ? (
                                    <EyeOff className="w-4 h-4" />
                                  ) : (
                                    <Eye className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            </div>

                            <div className="pt-2">
                              <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-emerald-600/10"
                                id="btn-submit-cuidador"
                              >
                                Cadastrar como Cuidador
                              </motion.button>
                            </div>
                          </form>
                        </motion.div>
                      )}

                      {/* DONO FORM - STEP 1 (Informações Pessoais & Animais que possui) */}
                      {signupRole === "dono" && donoStep === "info" && (
                        <motion.div
                          key="dono-info-form"
                          initial={{ opacity: 0, x: slideDirection === "right" ? 120 : -120 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: slideDirection === "right" ? -120 : 120 }}
                          transition={{ duration: 0.35, ease: "easeInOut" }}
                        >
                          <form onSubmit={handleContinueCadastro} className="space-y-4">
                            <div>
                              <h3 className="text-[#064e3b] font-extrabold text-lg mb-1 font-display">
                                Conta do Dono de Pet
                              </h3>
                              <p className="text-xs text-emerald-700/70 mb-4">
                                Insira seus dados de contato e selecione quais animais de estimação você possui.
                              </p>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                                Seu Nome Completo
                              </label>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-emerald-600/50">
                                  <User className="w-4 h-4" />
                                </span>
                                <input 
                                  type="text" 
                                  required
                                  placeholder="Ex: Carlos Oliveira"
                                  value={fullName}
                                  onChange={(e) => setFullName(e.target.value)}
                                  className="block w-full pl-10 pr-4 py-2.5 text-sm bg-emerald-50/50 hover:bg-emerald-50 focus:bg-white border border-emerald-150 rounded-xl text-emerald-850 font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder-emerald-800/25"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                                E-mail para Contato
                              </label>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-emerald-600/50">
                                  <Mail className="w-4 h-4" />
                                </span>
                                <input 
                                  type="email" 
                                  required
                                  placeholder="seuemail@gmail.com"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  className="block w-full pl-10 pr-4 py-2.5 text-sm bg-emerald-50/50 hover:bg-emerald-50 focus:bg-white border border-emerald-150 rounded-xl text-emerald-850 font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder-emerald-800/25"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                                WhatsApp / Telefone
                              </label>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-emerald-600/50">
                                  <Phone className="w-4 h-4" />
                                </span>
                                <input 
                                  type="tel" 
                                  required
                                  placeholder="(11) 99999-9999"
                                  value={phone}
                                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                                  className="block w-full pl-10 pr-4 py-2.5 text-sm bg-emerald-50/50 hover:bg-emerald-50 focus:bg-white border border-emerald-150 rounded-xl text-emerald-850 font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder-emerald-800/25"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                                CPF do Dono
                              </label>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-emerald-600/50">
                                  <FileText className="w-4 h-4" />
                                </span>
                                <input 
                                  type="text" 
                                  required
                                  placeholder="000.000.000-00"
                                  value={cpf}
                                  onChange={(e) => setCpf(formatCPF(e.target.value))}
                                  className="block w-full pl-10 pr-4 py-2.5 text-sm bg-emerald-50/50 hover:bg-emerald-50 focus:bg-white border border-emerald-150 rounded-xl text-emerald-850 font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder-emerald-800/25"
                                />
                              </div>
                            </div>

                            {/* Endereço com busca automática por CEP */}
                            <div className="border-t border-emerald-100/85 pt-4 mt-2">
                              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                                <MapPin className="w-4 h-4 text-emerald-600" />
                                Endereço de Residência
                              </span>

                              <div className="grid grid-cols-12 gap-2">
                                <div className="col-span-4">
                                  <label className="block text-[11px] font-bold text-emerald-800 uppercase tracking-wide mb-1">
                                    CEP
                                  </label>
                                  <input 
                                    type="text" 
                                    required
                                    placeholder="00000-000"
                                    value={cep}
                                    onChange={(e) => handleCEPChange(e.target.value)}
                                    className="block w-full px-3 py-2 text-sm bg-emerald-50/50 hover:bg-emerald-50 focus:bg-white border border-emerald-150 rounded-xl text-emerald-850 font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder-emerald-800/25 text-center"
                                  />
                                </div>
                                <div className="col-span-8">
                                  <label className="block text-[11px] font-bold text-emerald-800 uppercase tracking-wide mb-1">
                                    Logradouro
                                  </label>
                                  <input 
                                    type="text" 
                                    required
                                    placeholder="Rua, Avenida, Praça..."
                                    value={logradouro}
                                    onChange={(e) => setLogradouro(e.target.value)}
                                    className="block w-full px-3 py-2 text-sm bg-emerald-50/50 hover:bg-emerald-50 focus:bg-white border border-emerald-150 rounded-xl text-emerald-850 font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder-emerald-800/25"
                                  />
                                </div>
                              </div>

                              {isFetchingCEP && (
                                <p className="text-[10px] text-emerald-600 font-semibold mt-1 animate-pulse flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 animate-spin" /> Buscando endereço automaticamente...
                                </p>
                              )}
                              {cepError && (
                                <p className="text-[10px] text-amber-600 font-semibold mt-1 flex items-center gap-1">
                                  ⚠️ {cepError}
                                </p>
                              )}

                              <div className="grid grid-cols-12 gap-2 mt-2">
                                <div className="col-span-4">
                                  <label className="block text-[11px] font-bold text-emerald-800 uppercase tracking-wide mb-1 text-center">
                                    Número
                                  </label>
                                  <input 
                                    type="text" 
                                    required
                                    placeholder="Nº"
                                    value={numero}
                                    onChange={(e) => setNumero(e.target.value)}
                                    className="block w-full px-3 py-2 text-sm bg-emerald-50/50 hover:bg-emerald-50 focus:bg-white border border-emerald-150 rounded-xl text-emerald-850 font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder-emerald-800/25 text-center font-bold"
                                  />
                                </div>
                                <div className="col-span-8">
                                  <label className="block text-[11px] font-bold text-emerald-800 uppercase tracking-wide mb-1">
                                    Complemento
                                  </label>
                                  <input 
                                    type="text" 
                                    placeholder="Apto, Bloco, etc. (Opcional)"
                                    value={complemento}
                                    onChange={(e) => setComplemento(e.target.value)}
                                    className="block w-full px-3 py-2 text-sm bg-emerald-50/50 hover:bg-emerald-50 focus:bg-white border border-emerald-150 rounded-xl text-emerald-850 font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder-emerald-800/25"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-12 gap-2 mt-2">
                                <div className="col-span-5">
                                  <label className="block text-[11px] font-bold text-emerald-800 uppercase tracking-wide mb-1">
                                    Bairro
                                  </label>
                                  <input 
                                    type="text" 
                                    required
                                    placeholder="Bairro"
                                    value={bairro}
                                    onChange={(e) => setBairro(e.target.value)}
                                    className="block w-full px-3 py-2 text-sm bg-emerald-50/50 hover:bg-emerald-50 focus:bg-white border border-emerald-150 rounded-xl text-emerald-850 font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder-emerald-800/25"
                                  />
                                </div>
                                <div className="col-span-5">
                                  <label className="block text-[11px] font-bold text-emerald-800 uppercase tracking-wide mb-1">
                                    Cidade
                                  </label>
                                  <input 
                                    type="text" 
                                    required
                                    placeholder="Cidade"
                                    value={cidade}
                                    onChange={(e) => setCidade(e.target.value)}
                                    className="block w-full px-3 py-2 text-sm bg-emerald-50/50 hover:bg-emerald-50 focus:bg-white border border-emerald-150 rounded-xl text-emerald-850 font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder-emerald-800/25"
                                  />
                                </div>
                                <div className="col-span-2">
                                  <label className="block text-[11px] font-bold text-emerald-800 uppercase tracking-wide mb-1 text-center">
                                    UF
                                  </label>
                                  <input 
                                    type="text" 
                                    required
                                    maxLength={2}
                                    placeholder="UF"
                                    value={uf}
                                    onChange={(e) => setUf(e.target.value.toUpperCase())}
                                    className="block w-full px-1 py-2 text-sm bg-emerald-50/50 hover:bg-emerald-50 focus:bg-white border border-emerald-150 rounded-xl text-emerald-850 font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder-emerald-800/25 text-center uppercase font-mono font-bold"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Seleção de Animais com Opção Outro */}
                            <div>
                              <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                                Quais tipos de pets você possui?
                              </label>
                              <div className="grid grid-cols-2 gap-2 text-xs font-bold text-emerald-800">
                                {["Cão 🐶", "Gato 🐱", "Pássaro 🐦", "Roedor 🐹"].map((animal) => {
                                  const isSelected = selectedAnimals.includes(animal);
                                  return (
                                    <button
                                      key={animal}
                                      type="button"
                                      onClick={() => handleAnimalToggle(animal)}
                                      className={`py-3 px-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                                        isSelected 
                                          ? "bg-emerald-600 border-emerald-600 text-white shadow-sm" 
                                          : "bg-emerald-50/50 hover:bg-emerald-50 border-emerald-200"
                                      }`}
                                    >
                                      <span>{animal}</span>
                                      {isSelected && <span className="text-[10px] bg-white text-emerald-700 px-1.5 py-0.5 rounded-full">Escolhido</span>}
                                    </button>
                                  );
                                })}

                                {/* Botão de Outro */}
                                <button
                                  type="button"
                                  onClick={() => handleAnimalToggle("Outro")}
                                  className={`col-span-2 py-3 px-3 rounded-xl border text-center transition-all flex items-center justify-center gap-1.5 ${
                                    isOtherSelected 
                                      ? "bg-emerald-700 border-emerald-700 text-white shadow-sm" 
                                      : "bg-emerald-50/50 hover:bg-emerald-50 border-emerald-200"
                                  }`}
                                  id="btn-animal-outro"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  Outro animal menos comum
                                </button>
                              </div>
                            </div>

                            {/* Caixa de Texto Dinâmica de Outro Animal */}
                            <AnimatePresence>
                              {isOtherSelected && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="bg-emerald-50/50 p-3 rounded-2xl border border-emerald-150 space-y-2 mt-2">
                                    <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wider">
                                      Especifique o seu animal de estimação
                                    </label>
                                    <input 
                                      type="text" 
                                      required={isOtherSelected}
                                      placeholder="Ex: Iguana, Furão, Peixe, Porquinho da Índia..."
                                      value={otherAnimalText}
                                      onChange={(e) => setOtherAnimalText(e.target.value)}
                                      className="block w-full py-2 px-3 text-sm bg-white border border-emerald-150 rounded-lg text-emerald-850 font-medium outline-none focus:ring-1 focus:ring-emerald-500/20"
                                      maxLength={40}
                                    />
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            <div>
                              <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                                Defina sua Senha
                              </label>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-emerald-600/50">
                                  <Lock className="w-4 h-4" />
                                </span>
                                <input 
                                  type={showPasswordSignup ? "text" : "password"} 
                                  required
                                  minLength={6}
                                  placeholder="Mínimo de 6 dígitos"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  className="block w-full pl-10 pr-12 py-2.5 text-sm bg-emerald-50/50 hover:bg-emerald-50 focus:bg-white border border-emerald-150 rounded-xl text-emerald-850 font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder-emerald-800/25"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPasswordSignup(!showPasswordSignup)}
                                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-emerald-600/50 hover:text-emerald-700 focus:outline-none"
                                >
                                  {showPasswordSignup ? (
                                    <EyeOff className="w-4 h-4" />
                                  ) : (
                                    <Eye className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            </div>

                            <div className="pt-2">
                              {/* Botão verde Continuar Cadastro com animação para ir para o Pet */}
                              <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-emerald-600/10 flex items-center justify-center gap-2"
                                id="btn-continue-dono"
                              >
                                <span>Continuar Cadastro</span>
                                <ChevronRight className="w-4.5 h-4.5" />
                              </motion.button>
                            </div>
                          </form>
                        </motion.div>
                      )}

                      {/* DONO FORM - STEP 2 (Informações do Pet) */}
                      {signupRole === "dono" && donoStep === "pet" && (
                        <motion.div
                          key="dono-pet-form"
                          initial={{ opacity: 0, x: slideDirection === "right" ? 120 : -120 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: slideDirection === "right" ? -120 : 120 }}
                          transition={{ duration: 0.35, ease: "easeInOut" }}
                        >
                          <form onSubmit={handleRegisterSubmit} className="space-y-4">
                            <div>
                              <h3 className="text-[#064e3b] font-extrabold text-lg mb-1 font-display">
                                Dados de Identificação do Pet
                              </h3>
                              <p className="text-xs text-emerald-700/70 mb-4">
                                Ajude os cuidadores parceiros a entenderem as características do seu melhor amigo.
                              </p>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                                Nome do Pet
                              </label>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-emerald-600/50">
                                  <Sparkles className="w-4 h-4" />
                                </span>
                                <input 
                                  type="text" 
                                  required
                                  placeholder="Ex: Rex, Floquinho, Pipoca..."
                                  value={petName}
                                  onChange={(e) => setPetName(e.target.value)}
                                  className="block w-full pl-10 pr-4 py-2.5 text-sm bg-emerald-50/50 hover:bg-emerald-50 focus:bg-white border border-emerald-150 rounded-xl text-emerald-850 font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder-emerald-800/25"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                                Espécie do Pet
                              </label>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-emerald-600/50">
                                  <Sparkles className="w-4 h-4" />
                                </span>
                                <input 
                                  type="text" 
                                  required
                                  placeholder="Ex: Cão, Gato, Ave, Furão..."
                                  value={petEspecie}
                                  onChange={(e) => setPetEspecie(e.target.value)}
                                  className="block w-full pl-10 pr-4 py-2.5 text-sm bg-emerald-50/50 hover:bg-emerald-50 focus:bg-white border border-emerald-150 rounded-xl text-emerald-850 font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder-emerald-800/25"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                                Idade do Pet (Anos)
                              </label>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-emerald-600/50">
                                  <Clock className="w-4 h-4" />
                                </span>
                                <input 
                                  type="number" 
                                  required
                                  min={0}
                                  max={35}
                                  placeholder="Digite a idade aproximada"
                                  value={petAge}
                                  onChange={(e) => setPetAge(e.target.value)}
                                  className="block w-full pl-10 pr-4 py-2.5 text-sm bg-emerald-50/50 hover:bg-emerald-50 focus:bg-white border border-emerald-150 rounded-xl text-emerald-850 font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder-emerald-800/25"
                                />
                              </div>
                            </div>

                            {/* Necessidades Especiais - Dois botões de Sim ou Não */}
                            <div>
                              <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                                Necessidades Especiais do Pet?
                              </label>
                              <div className="grid grid-cols-2 gap-3 text-xs font-bold text-emerald-800">
                                <button
                                  type="button"
                                  onClick={() => setHasSpecialNeeds(true)}
                                  className={`py-3 px-3 rounded-xl border text-center transition-all ${
                                    hasSpecialNeeds === true
                                      ? "bg-red-500 border-red-500 text-white shadow-sm"
                                      : "bg-emerald-50/50 hover:bg-emerald-50 border-emerald-150"
                                  }`}
                                  id="btn-needs-sim"
                                >
                                  Sim, ele possui ⚠️
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setHasSpecialNeeds(false);
                                    setSpecialNeedsText("");
                                  }}
                                  className={`py-3 px-3 rounded-xl border text-center transition-all ${
                                    hasSpecialNeeds === false
                                      ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                                      : "bg-emerald-50/50 hover:bg-emerald-50 border-emerald-150"
                                  }`}
                                  id="btn-needs-nao"
                                >
                                  Não possui (Sem problemas)
                                </button>
                              </div>
                            </div>

                            {/* Caixa de Texto condicional de Necessidades Especiais */}
                            <AnimatePresence>
                              {hasSpecialNeeds === true && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="bg-red-50/40 p-3.5 rounded-xl border border-red-100 space-y-2 mt-1">
                                    <label className="block text-[11px] font-bold text-red-900 uppercase tracking-wider">
                                      Descreva em detalhes quais cuidados adicionais são necessários:
                                    </label>
                                    <textarea
                                      required={hasSpecialNeeds === true}
                                      rows={3}
                                      placeholder="Ex: Toma remédios controlados de 12 em 12 horas, possui intolerância ou alergia a certa ração, restrição física de corrida..."
                                      value={specialNeedsText}
                                      onChange={(e) => setSpecialNeedsText(e.target.value)}
                                      className="block w-full py-2 px-3 text-xs bg-white border border-red-200 rounded-lg text-zinc-800 font-medium outline-none focus:ring-1 focus:ring-red-400"
                                    />
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            <div className="pt-3 block">
                              <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2"
                                id="btn-submit-pet"
                              >
                                <span>Salvar & Finalizar Cadastro</span>
                                <CheckCircle2 className="w-4.5 h-4.5" />
                              </motion.button>
                            </div>
                          </form>
                        </motion.div>
                      )}

                    </AnimatePresence>
                  </div>

                </div>
              )}
            </motion.div>
          )}

          {currentView === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={`w-full ${theme.cardBg} border ${theme.cardBorder} ${theme.shadow} p-6 sm:p-10 rounded-3xl flex flex-col overflow-hidden`}
              id="login-card"
            >
              {/* Header de navegação de login */}
              <div className="flex items-center justify-between mb-6">
                <button 
                  onClick={resetFormAndNavigateWelcome}
                  className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-950 transition-colors uppercase tracking-wider bg-emerald-50 hover:bg-emerald-100/80 px-3 py-1.5 rounded-xl border border-emerald-100 animate-fade-in"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Voltar ao Menu
                </button>

                <span className="text-[11px] font-bold text-emerald-850 bg-emerald-100 px-3 py-1 rounded-full font-mono uppercase">
                  Acesso
                </span>
              </div>

              {loginSuccess ? (
                /* Sucesso de Login Simulado */
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 space-y-4"
                >
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-extrabold text-[#064e3b]">
                    Login Realizado com Sucesso!
                  </h3>
                  <p className="text-sm text-emerald-700/80 max-w-sm mx-auto font-medium">
                    Seja bem-vindo(a) de volta ao <strong>PetAffection</strong> fictício. Estamos preparando sua área de controle...
                  </p>
                  <div className="pt-4 flex flex-col gap-2">
                    <button
                      onClick={() => setLoginSuccess(false)}
                      className="text-xs font-bold text-emerald-750 hover:text-emerald-950 underline decoration-emerald-500/30 underline-offset-4"
                    >
                      Voltar ao Painel de Login
                    </button>
                    <button
                      onClick={resetFormAndNavigateWelcome}
                      className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all"
                    >
                      Voltar para Início
                    </button>
                  </div>
                </motion.div>
              ) : forgotPasswordSubmitted ? (
                /* Sucesso de recuperação de senha */
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 space-y-4"
                >
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <Mail className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-extrabold text-[#064e3b]">
                    E-mail Enviado!
                  </h3>
                  <p className="text-sm text-emerald-700/80 max-w-sm mx-auto font-medium">
                    Enviamos um link de redefinição de senha para o endereço <strong>{recoveryEmail || "seu e-mail"}</strong> com instruções seguras.
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => {
                        setForgotPasswordSubmitted(false);
                        setRecoveryEmail("");
                      }}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all"
                    >
                      Voltar para o Login
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* Form principal de Login */
                <div className="space-y-6">
                  <div className="text-center sm:text-left">
                    <h2 className="text-2xl font-extrabold text-[#064e3b] tracking-tight">
                      Acesse sua Conta
                    </h2>
                    <p className="text-xs text-emerald-750/70 mt-1">
                      Faça login para gerenciar ou localizar cuidados de pets ativos.
                    </p>
                  </div>

                  {/* Formulário Interativo com Animações */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={loginRole}
                      initial={{ opacity: 0, x: loginSlideDirection === "right" ? 15 : -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: loginSlideDirection === "right" ? -15 : 15 }}
                      transition={{ duration: 0.25 }}
                    >
                      <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-emerald-850 uppercase tracking-wider mb-1 font-mono">
                            E-mail
                          </label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-emerald-600/50">
                              <Mail className="w-4 h-4" />
                            </span>
                            <input 
                              type="email" 
                              required
                              placeholder="exemplo@petaffection.com"
                              value={loginEmail}
                              onChange={(e) => setLoginEmail(e.target.value)}
                              className="block w-full pl-10 pr-4 py-2.5 text-sm bg-emerald-50/50 hover:bg-emerald-50 focus:bg-white border border-emerald-150 rounded-xl text-emerald-850 font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder-emerald-800/25"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-emerald-850 uppercase tracking-wider mb-1 font-mono">
                            Senha
                          </label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-emerald-600/50">
                              <Lock className="w-4 h-4" />
                            </span>
                            <input 
                              type={showPasswordLogin ? "text" : "password"} 
                              required
                              placeholder="••••••••"
                              value={loginPassword}
                              onChange={(e) => setLoginPassword(e.target.value)}
                              className="block w-full pl-10 pr-12 py-2.5 text-sm bg-emerald-50/50 hover:bg-emerald-50 focus:bg-white border border-emerald-150 rounded-xl text-emerald-850 font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder-emerald-800/25"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswordLogin(!showPasswordLogin)}
                              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-emerald-600/50 hover:text-emerald-700 focus:outline-none"
                            >
                              {showPasswordLogin ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                          
                          {/* "Esqueci minha senha" text no canto esquerdo, clicável */}
                          <div className="flex justify-start mt-2.5">
                            <button
                              type="button"
                              onClick={() => {
                                const currentEmailInput = loginEmail ? loginEmail : "";
                                const emailUser = prompt("Redefinição de Senha: Confirme seu e-mail cadastrado:", currentEmailInput);
                                if (emailUser) {
                                  setRecoveryEmail(emailUser);
                                  setForgotPasswordSubmitted(true);
                                }
                              }}
                              className="text-xs font-semibold text-emerald-700 hover:text-emerald-950 transition-colors underline decoration-emerald-500/25 underline-offset-4"
                            >
                              Esqueci minha senha
                            </button>
                          </div>
                        </div>

                        <div className="pt-2">
                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2"
                            id="btn-login-submit"
                          >
                            <span>Entrar</span>
                            <ChevronRight className="w-4.5 h-4.5" />
                          </motion.button>
                        </div>
                      </form>
                    </motion.div>
                  </AnimatePresence>

                  {/* Redes Sociais */}
                  <div className="mt-4 pt-5 border-t border-emerald-100/85">
                    <span className="block text-center text-[10px] font-bold text-emerald-800 uppercase tracking-widest mb-3.5 font-mono">
                      Ou faça login com
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {/* Google */}
                      <button
                        type="button"
                        onClick={() => handleSocialLogin("Google")}
                        className="py-2.5 px-3 bg-white hover:bg-zinc-50 border border-emerald-150 rounded-xl flex items-center justify-center transition-all shadow-sm group"
                        title="Entrar com Google"
                        id="btn-social-google"
                      >
                        <svg className="w-4.5 h-4.5 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                        </svg>
                      </button>

                      {/* Facebook Fictício */}
                      <button
                        type="button"
                        onClick={() => handleSocialLogin("Facebook")}
                        className="py-2.5 px-3 bg-white hover:bg-zinc-50 border border-emerald-150 rounded-xl flex items-center justify-center transition-all shadow-sm group"
                        title="Entrar com Facebook"
                        id="btn-social-facebook"
                      >
                        <svg className="w-4.5 h-4.5 text-[#1877F2] fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/>
                        </svg>
                      </button>

                      {/* Instagram Fictício */}
                      <button
                        type="button"
                        onClick={() => handleSocialLogin("Instagram")}
                        className="py-2.5 px-3 bg-white hover:bg-zinc-50 border border-emerald-150 rounded-xl flex items-center justify-center transition-all shadow-sm group"
                        title="Entrar com Instagram"
                        id="btn-social-instagram"
                      >
                        <svg className="w-4.5 h-4.5 text-[#E1306C] fill-none stroke-current stroke-2 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Switch para tela de cadastro */}
                  <div className="text-center pt-2">
                    <button
                      onClick={() => navigateTo("signup")}
                      className="text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
                      id="btn-switch-to-register"
                    >
                      Não tem uma conta? <span className="underline decoration-emerald-500/30 underline-offset-4 font-bold text-emerald-700">Cadastre-se</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer minimalista sem escolhas de temas */}
      <footer className="w-full text-center py-4 relative z-10">
        <p className="text-xs text-emerald-800/60 font-medium font-mono">
          PetAffection &copy; 2026 • Design Responsivo & Minimalista
        </p>
      </footer>

      {/* Modal para Simulação de Direcionamento da Tela de Login com Dados Fictícios */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 10, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white border border-emerald-100 shadow-2xl rounded-3xl p-6 sm:p-8 max-w-md w-full overflow-hidden relative"
            >
              <div className="flex items-center gap-3.5 mb-5">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#064e3b] leading-tight">Painel de Login</h3>
                  <p className="text-xs text-emerald-700/60 font-medium">Testes da interface • PetAffection</p>
                </div>
              </div>

              {/* Formulário simulado de visualização de altíssimo nível */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1.5">
                    E-mail de Acesso
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-emerald-600/50">
                      <User className="w-4 h-4" />
                    </span>
                    <input 
                      type="text" 
                      readOnly 
                      value="cuidador@petaffection.com" 
                      className="block w-full pl-10 pr-3 py-3 text-sm bg-emerald-50/50 border border-emerald-100 rounded-xl text-emerald-850 font-medium outline-none cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1.5">
                    Senha de Acesso
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-emerald-600/50">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input 
                      type="text" 
                      readOnly 
                      value="cuidapet2026" 
                      className="block w-full pl-10 pr-3 py-3 text-sm bg-emerald-50/50 border border-emerald-100 rounded-xl text-emerald-850 font-medium outline-none cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Informação sobre os dados fictícios adicionais para o teste */}
              <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100/50 mb-6 text-xs text-emerald-800">
                <div className="font-semibold flex items-center gap-1.5 mb-2 text-emerald-900 uppercase tracking-wide">
                  <Clock className="w-3.5 h-3.5" />
                  Mocks Inclusos para Simulação:
                </div>
                <div className="space-y-1.5 font-medium">
                  <p>• <strong>Cuidadores localizados:</strong> 250 ativos</p>
                  <p>• <strong>Pets aguardando cuidador:</strong> 42 agendados</p>
                  <p>• <strong>Amigos de quatro patas:</strong> Cães, Gatos e Aves</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-emerald-600/10"
                >
                  Entendido, Voltar à Tela de Boas-vindas
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {renderPaymentModal()}
    </div>
  );
}
