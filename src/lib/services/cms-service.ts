import { db, storage } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp, 
  deleteDoc, 
  doc, 
  updateDoc,
  where,
  getDoc,
  limit,
  onSnapshot,
  increment,
  arrayUnion,
  arrayRemove,
  setDoc,
  type DocumentData
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import placeholderImages from '@/app/lib/placeholder-images.json';

// --- TYPES ---

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  dataAiHint: string;
  caption?: string;
  date?: string;
  tags: string[];
  storagePath?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  content: string;
  tags: string[];
  imageUrl?: string;
  dataAiHint?: string;
  commentCount: number;
  status: 'Published' | 'Hidden' | 'Reported';
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  dataAiHint: string;
  youtubeVideoId: string;
  category: string;
  duration?: string;
}

export interface Campaign {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  dataAiHint?: string;
  region: 'Western' | 'Eastern' | 'Northern' | 'Central' | 'Other';
  goal: number;
  currentAmount: number;
  tags: string[];
  featured?: boolean;
  storyline?: string[];
  organizer?: string;
  volunteersNeeded?: number;
  volunteersSignedUp?: number;
  activities?: any[];
  accommodation?: any[];
  meals?: any[];
  bookingTips?: string[];
  endDate?: string;
}

export interface Package {
  id: string;
  name: string;
  basePrice: number;
  durationDays: number;
  features: string[];
  isPopular?: boolean;
  isActive: boolean;
}

export interface Addon {
  id: string;
  name: string;
  price: number;
  category: 'activity' | 'luxury' | 'extension';
  subCategory?: 'Wildlife' | 'Adventure' | 'Culture' | 'Nature & Scenic';
  region?: 'Central' | 'Western' | 'Eastern' | 'Northern';
  bundleEligible?: boolean;
  isActive: boolean;
}

export interface Promotion {
  id: string;
  title: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  submittedBy: string;
  dateSubmitted: string;
  votes: number;
  voters: string[];
  status: 'New' | 'Under Review' | 'Approved' | 'Implemented';
  imageUrl?: string;
  dataAiHint?: string;
  commentsCount: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: string;
  createdAt: any;
}

// --- BUILDER SERVICES ---

export async function fetchBasePackages(): Promise<Package[]> {
  const q = query(collection(db, 'packages'), where('isActive', '==', true));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    return [
      { id: 'explorer', name: 'Explorer Package', basePrice: 750, durationDays: 4, features: ['Short Trip', 'Eastern Uganda'], isActive: true },
      { id: 'adventurer', name: 'Adventurer Package', basePrice: 4500, durationDays: 7, features: ['Primate Focus', 'Lodge Stays'], isActive: true, isPopular: true },
      { id: 'ultimate', name: 'Ultimate Safari', basePrice: 8000, durationDays: 10, features: ['All Major Parks', 'Full Circuit'], isActive: true }
    ];
  }
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Package));
}

export async function savePackage(pkg: Partial<Package>) {
  if (pkg.id) {
    const pkgRef = doc(db, 'packages', pkg.id);
    await updateDoc(pkgRef, { ...pkg, updatedAt: serverTimestamp() });
  } else {
    await addDoc(collection(db, 'packages'), {
      ...pkg,
      isActive: true,
      createdAt: serverTimestamp(),
    });
  }
}

export async function fetchAddons(): Promise<Addon[]> {
  const q = query(collection(db, 'addons'), where('isActive', '==', true));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    return [
      { id: 'gorilla', name: 'Gorilla Trekking', price: 900, category: 'activity', subCategory: 'Wildlife', bundleEligible: true, isActive: true },
      { id: 'chimp', name: 'Chimpanzee Tracking', price: 320, category: 'activity', subCategory: 'Wildlife', bundleEligible: true, isActive: true },
      { id: 'big_five', name: 'Big Five Game Drive', price: 150, category: 'activity', subCategory: 'Wildlife', isActive: true },
      { id: 'walking_safari', name: 'Walking Safari', price: 100, category: 'activity', subCategory: 'Adventure', isActive: true },
      { id: 'cycling_safari', name: 'Cycling Safari', price: 80, category: 'activity', subCategory: 'Adventure', isActive: true },
      { id: 'luxury_lodge', name: 'Luxury Lodge Upgrade', price: 1200, category: 'luxury', isActive: true },
      { id: 'private_guide', name: 'Private Safari Guide', price: 900, category: 'luxury', isActive: true }
    ];
  }
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Addon));
}

export async function saveAddon(addon: Partial<Addon>) {
  if (addon.id) {
    const addonRef = doc(db, 'addons', addon.id);
    await updateDoc(addonRef, { ...addon, updatedAt: serverTimestamp() });
  } else {
    await addDoc(collection(db, 'addons'), {
      ...addon,
      isActive: true,
      createdAt: serverTimestamp(),
    });
  }
}

export async function deleteAddon(id: string) {
  await deleteDoc(doc(db, 'addons', id));
}

export function calculatePricing(basePackage: Package, selectedAddons: Addon[], numPeople: number = 1) {
  const basePrice = basePackage.basePrice;
  let addonsTotalPerPerson = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
  
  let discountAmountPerPerson = 0;
  const hasGorilla = selectedAddons.some(a => a.id === 'gorilla');
  const hasChimp = selectedAddons.some(a => a.id === 'chimp');
  
  if (hasGorilla && hasChimp) {
    const wildlifeItems = selectedAddons.filter(a => a.id === 'gorilla' || a.id === 'chimp');
    const wildlifeSum = wildlifeItems.reduce((sum, item) => sum + item.price, 0);
    discountAmountPerPerson = wildlifeSum * 0.05;
  }

  const finalPerPerson = basePrice + addonsTotalPerPerson - discountAmountPerPerson;
  const finalTotal = finalPerPerson * numPeople;
  
  const tier = finalTotal > 10000 ? 'elite' : 'standard';

  return {
    basePrice,
    addonsTotal: addonsTotalPerPerson,
    discountAmount: discountAmountPerPerson,
    perPersonTotal: finalPerPerson,
    finalTotal,
    tier
  };
}

// --- PROMOTIONS ---

export async function fetchPromotions(): Promise<Promotion[]> {
  const q = query(collection(db, 'promotions'), orderBy('endDate', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Promotion));
}

export async function savePromotion(promo: Partial<Promotion>) {
  if (promo.id) {
    const ref = doc(db, 'promotions', promo.id);
    await updateDoc(ref, { ...promo, updatedAt: serverTimestamp() });
  } else {
    await addDoc(collection(db, 'promotions'), {
      ...promo,
      isActive: true,
      createdAt: serverTimestamp(),
    });
  }
}

export async function deletePromotion(id: string) {
  await deleteDoc(doc(db, 'promotions', id));
}

// --- GALLERY ---

export async function uploadGalleryImage(file: File, metadata: { caption?: string, tags?: string, dataAiHint?: string }) {
  const storagePath = `gallery/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, storagePath);
  
  await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(storageRef);
  
  const tagsArray = metadata.tags ? metadata.tags.split(',').map(t => t.trim().startsWith('#') ? t.trim() : `#${t.trim()}`) : [];
  
  const docRef = await addDoc(collection(db, 'gallery'), {
    src: downloadUrl,
    alt: metadata.caption || 'Gallery Image',
    caption: metadata.caption || '',
    tags: tagsArray,
    dataAiHint: metadata.dataAiHint || 'safari photo',
    storagePath: storagePath,
    createdAt: serverTimestamp(),
  });
  
  return { id: docRef.id, src: downloadUrl };
}

export async function fetchGalleryImages(count?: number): Promise<GalleryImage[]> {
  const galleryRef = collection(db, 'gallery');
  const q = count 
    ? query(galleryRef, orderBy('createdAt', 'desc'), limit(count))
    : query(galleryRef, orderBy('createdAt', 'desc'));
    
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      src: data.src,
      alt: data.alt,
      caption: data.caption,
      dataAiHint: data.dataAiHint,
      tags: data.tags || [],
      date: data.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently',
      storagePath: data.storagePath
    };
  });
}

export async function deleteGalleryImage(id: string, storagePath?: string) {
  if (storagePath) {
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef).catch(err => console.error("Storage delete error:", err));
  }
  await deleteDoc(doc(db, 'gallery', id));
}

// --- BLOG ---

export async function submitBlogPost(data: Omit<BlogPost, 'id' | 'date' | 'commentCount' | 'status'>) {
  const docRef = await addDoc(collection(db, 'posts'), {
    ...data,
    status: 'Published',
    commentCount: 0,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function fetchBlogPosts(status?: string, count?: number): Promise<BlogPost[]> {
  const postsRef = collection(db, 'posts');
  let q;
  
  if (status && status !== 'all') {
    q = query(postsRef, where('status', '==', status), orderBy('createdAt', 'desc'));
  } else {
    q = query(postsRef, orderBy('createdAt', 'desc'));
  }
  
  if (count) {
    q = query(q, limit(count));
  }
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      date: data.createdAt?.toDate?.()?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || 'Recently',
    } as BlogPost;
  });
}

export async function getBlogPost(id: string): Promise<BlogPost | null> {
  const docSnap = await getDoc(doc(db, 'posts', id));
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      date: data.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently',
    } as BlogPost;
  }
  return null;
}

export async function updatePostStatus(id: string, status: BlogPost['status']) {
  await updateDoc(doc(db, 'posts', id), { status });
}

export async function deleteBlogPost(id: string) {
  await deleteDoc(doc(db, 'posts', id));
}

// --- VIDEOS ---

export async function addVideo(video: Omit<VideoItem, 'id'>) {
  const docRef = await addDoc(collection(db, 'videos'), {
    ...video,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function fetchVideos(): Promise<VideoItem[]> {
  const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VideoItem));
}

export async function deleteVideo(id: string) {
  await deleteDoc(doc(db, 'videos', id));
}

// --- CAMPAIGNS (Expeditions) ---

const DEFAULT_CAMPAIGNS: Campaign[] = [
  // Western Uganda
  { id: '1', title: 'Bwindi Gorilla Trekking', imageUrl: placeholderImages.campaignBwindi.src, dataAiHint: 'bwindi forest', shortDescription: 'World-famous gorilla trekking in a UNESCO World Heritage site.', description: 'Venture into the ancient Bwindi Impenetrable Forest for a face-to-face encounter with endangered mountain gorillas.', region: 'Western', goal: 100, currentAmount: 98, tags: ['#Gorilla', '#UNESCO'] },
  { id: '2', title: 'Queen Elizabeth National Park', imageUrl: placeholderImages.campaignQueenElizabeth.src, dataAiHint: 'tree climbing lion', shortDescription: 'Spot tree-climbing lions and enjoy Kazinga Channel boat safaris.', description: 'Explore Ugandas most popular savanna park, famous for its diverse ecosystems and the iconic Ishasha tree-climbing lions.', region: 'Western', goal: 100, currentAmount: 95, tags: ['#Wildlife', '#Lions'] },
  { id: '3', title: 'Murchison Falls Safari', imageUrl: placeholderImages.campaignMurchison.src, dataAiHint: 'murchison falls', shortDescription: 'See the powerful falls and diverse wildlife of Murchison.', description: 'Witness the Nile River explode through a narrow gorge at Murchison Falls, surrounded by elephants, giraffes, and hippos.', region: 'Western', goal: 100, currentAmount: 96, tags: ['#Wildlife', '#Waterfalls'] },
  { id: '4', title: 'Kibale Forest Chimpanzee Trekking', imageUrl: placeholderImages.campaignKibale.src, dataAiHint: 'chimpanzee forest', shortDescription: 'Trek chimpanzees in the primate capital of East Africa.', description: 'Track our closest relatives through the lush rainforest of Kibale, home to 13 different primate species.', region: 'Western', goal: 100, currentAmount: 94, tags: ['#Chimpanzee', '#Primates'] },
  { id: '5', title: 'Rwenzori Mountains Hiking', imageUrl: placeholderImages.campaignRwenzori.src, dataAiHint: 'rwenzori mountains', shortDescription: 'Hike the snow-capped "Mountains of the Moon".', description: 'Embark on a challenging trek to the glaciers of the Rwenzori Mountains, one of Africas most unique alpine landscapes.', region: 'Western', goal: 100, currentAmount: 92, tags: ['#Hiking', '#Mountains'] },
  { id: '6', title: 'Relax at Lake Bunyonyi', imageUrl: placeholderImages.campaignBunyonyi.src, dataAiHint: 'lake bunyonyi', shortDescription: 'Relax by one of Africa’s deepest and most scenic lakes.', description: 'Unwind at the stunning "Lake of Little Birds," famous for its 29 islands and breathtaking terraced hillsides.', region: 'Western', goal: 100, currentAmount: 97, tags: ['#Relaxation', '#Scenery'] },
  { id: '7', title: 'Lake Mburo Cycling Safari', imageUrl: placeholderImages.campaignMburo.src, dataAiHint: 'zebra safari', shortDescription: 'The closest park to Kampala, perfect for cycling among zebras.', description: 'Experience wildlife from a different perspective with a bicycle tour through the savanna of Lake Mburo.', region: 'Western', goal: 100, currentAmount: 93, tags: ['#Cycling', '#Zebras'] },
  // Eastern Uganda
  { id: '8', title: 'Jinja - Source of the Nile', imageUrl: placeholderImages.campaignSourceNile.src, dataAiHint: 'source of nile', shortDescription: 'Discover the legendary source of the world\'s longest river.', description: 'Visit the historic point where the Great Nile begins its 6,000km journey to the Mediterranean Sea.', region: 'Eastern', goal: 100, currentAmount: 95, tags: ['#Jinja', '#RiverNile'] },
  { id: '9', title: 'White-Water Rafting in Jinja', imageUrl: placeholderImages.campaignRafting.src, dataAiHint: 'white water rafting', shortDescription: 'Experience the thrill of Grade 5 rapids on the Nile.', description: 'Conquer the legendary rapids of the Victoria Nile in Jinja, the adventure capital of East Africa.', region: 'Eastern', goal: 100, currentAmount: 98, tags: ['#Adventure', '#Jinja'] },
  { id: '10', title: 'Mount Elgon National Park', imageUrl: placeholderImages.campaignElgon.src, dataAiHint: 'mount elgon', shortDescription: 'Hike a volcanic mountain and explore caves near Sipi Falls.', description: 'Explore the world\'s largest volcanic base and discover ancient caves and diverse flora on the slopes of Mt. Elgon.', region: 'Eastern', goal: 100, currentAmount: 91, tags: ['#Hiking', '#Volcano'] },
  { id: '11', title: 'Sipi Falls Adventure', imageUrl: placeholderImages.campaignSipi.src, dataAiHint: 'sipi falls', shortDescription: 'Explore a series of beautiful waterfalls with coffee tours and hikes.', description: 'Hike to three stunning waterfalls and learn about local Arabica coffee production from farm to cup.', region: 'Eastern', goal: 100, currentAmount: 96, tags: ['#Waterfalls', '#Coffee'] },
  { id: '12', title: 'Busoga Kingdom Cultural Tour', imageUrl: placeholderImages.campaignBusoga.src, dataAiHint: 'cultural kingdom', shortDescription: 'Immerse yourself in the royal heritage and traditions of Busoga.', description: 'Visit the royal palace and historical sites to understand the rich cultural fabric of the Busoga people.', region: 'Eastern', goal: 100, currentAmount: 89, tags: ['#Culture', '#History'] },
  // Northern Uganda
  { id: '13', title: 'Kidepo Valley National Park', imageUrl: placeholderImages.campaignKidepo.src, dataAiHint: 'kidepo valley', shortDescription: 'Explore remote, rugged landscapes with unique wildlife.', description: 'Journey to Ugandas most remote park for a wild experience with cheetahs, ostriches, and stunning savanna views.', region: 'Northern', goal: 100, currentAmount: 99, tags: ['#Remote', '#Wilderness'] },
  { id: '14', title: 'Karuma Falls Wildlife Tour', imageUrl: placeholderImages.campaignKaruma.src, dataAiHint: 'karuma falls', shortDescription: 'Spot wildlife near the stunning Karuma Falls on the Nile.', description: 'Observe the powerful Karuma rapids and search for wildlife in the surrounding reserves of northern Uganda.', region: 'Northern', goal: 100, currentAmount: 88, tags: ['#Wildlife', '#NationalPark'] },
  { id: '15', title: 'Pian Upe Wildlife Reserve', imageUrl: placeholderImages.campaignPianUpe.src, dataAiHint: 'savannah reserve', shortDescription: 'Discover rare wildlife species in a semi-arid savannah.', description: 'Visit one of Ugandas largest protected areas, home to roan antelopes and vibrant birdlife.', region: 'Northern', goal: 100, currentAmount: 87, tags: ['#RareWildlife', '#Savannah'] },
  // Central Uganda
  { id: '16', title: 'Kampala City Tour', imageUrl: placeholderImages.campaignKampala.src, dataAiHint: 'kampala city', shortDescription: 'Explore museums, mosques, and cultural centres in Uganda\'s capital.', description: 'Dive into the pulse of East Africas most vibrant city, from historic Cathedrals to bustling local markets.', region: 'Central', goal: 100, currentAmount: 92, tags: ['#CityTour', '#Culture'] },
  { id: '17', title: 'Entebbe Botanical Gardens', imageUrl: placeholderImages.campaignEntebbe.src, dataAiHint: 'entebbe botanical', shortDescription: 'Nature, wildlife, and relaxation by Africa’s largest lake.', description: 'Walk through historic gardens on the shores of Lake Victoria, spotting exotic birds and monkeys.', region: 'Central', goal: 100, currentAmount: 94, tags: ['#Gardens', '#Relaxation'] },
  { id: '18', title: 'Ngamba Island Chimpanzee Sanctuary', imageUrl: placeholderImages.campaignNgamba.src, dataAiHint: 'chimpanzee sanctuary', shortDescription: 'Visit a sanctuary for orphaned chimpanzees on Lake Victoria.', description: 'Take a boat trip to see rescued chimps and learn about conservation efforts on this beautiful island.', region: 'Central', goal: 100, currentAmount: 95, tags: ['#Conservation', '#Chimpanzee'] },
  { id: '19', title: 'Mabira Forest Zip-Lining', imageUrl: placeholderImages.campaignMabira.src, dataAiHint: 'rainforest zip', shortDescription: 'Experience the thrill of zip-lining through a lush rainforest.', description: 'Soar through the canopy of Ugandas largest central forest reserve on an adrenaline-pumping zip-line.', region: 'Central', goal: 100, currentAmount: 93, tags: ['#Adventure', '#Forest'] },
  { id: '20', title: 'Ssese Islands Relaxation', imageUrl: placeholderImages.campaignSsese.src, dataAiHint: 'lake victoria island', shortDescription: 'Unwind on the beautiful beaches of the Ssese Islands.', description: 'Escape to a tropical paradise in the middle of Lake Victoria, perfect for sunbathing, fishing, and island hopping.', region: 'Central', goal: 100, currentAmount: 96, tags: ['#Beach', '#Relaxation'] },
  // Other Areas
  { id: '21', title: 'Semuliki National Park', imageUrl: placeholderImages.campaignSemuliki.src, dataAiHint: 'semuliki hot springs', shortDescription: 'Discover unique bird species and boiling hot springs.', description: 'Visit the Sempaya hot springs where the water reaches boiling temperatures in a Central African-style forest.', region: 'Other', goal: 100, currentAmount: 90, tags: ['#BirdWatching', '#HotSprings'] },
  { id: '22', title: 'Toro Kingdom & Fort Portal', imageUrl: placeholderImages.campaignFortPortal.src, dataAiHint: 'crater lake', shortDescription: 'Explore stunning crater lakes and rich cultural experiences.', description: 'Visit the clean city of Fort Portal and explore the many crater lakes surrounding the Toro Royal Palace.', region: 'Other', goal: 100, currentAmount: 94, tags: ['#Culture', '#Scenery'] },
];

export async function fetchCampaigns(featuredOnly?: boolean): Promise<Campaign[]> {
  const campaignsRef = collection(db, 'campaigns');
  // Removing order by for now to handle missing createdAt fields in older docs
  const q = featuredOnly 
    ? query(campaignsRef, where('featured', '==', true))
    : query(campaignsRef);
  
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    return featuredOnly ? DEFAULT_CAMPAIGNS.filter(c => c.featured) : DEFAULT_CAMPAIGNS;
  }
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Campaign));
}

export async function getCampaignById(id: string): Promise<Campaign | null> {
  const docSnap = await getDoc(doc(db, 'campaigns', id));
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Campaign;
  }
  // Fallback to defaults
  const defaultC = DEFAULT_CAMPAIGNS.find(c => c.id === id);
  return defaultC || null;
}

export async function saveCampaign(campaign: Partial<Campaign>) {
  if (campaign.id) {
    const ref = doc(db, 'campaigns', campaign.id);
    await updateDoc(ref, { ...campaign, updatedAt: serverTimestamp() });
  } else {
    await addDoc(collection(db, 'campaigns'), {
      ...campaign,
      createdAt: serverTimestamp(),
    });
  }
}

export async function deleteCampaign(id: string) {
  await deleteDoc(doc(db, 'campaigns', id));
}

// --- IDEAS ---

export async function submitIdea(data: Omit<Idea, 'id' | 'dateSubmitted' | 'votes' | 'voters' | 'status' | 'commentsCount'>) {
  const docRef = await addDoc(collection(db, 'ideas'), {
    ...data,
    votes: 0,
    voters: [],
    status: 'New',
    commentsCount: 0,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function fetchIdeas(): Promise<Idea[]> {
  const q = query(collection(db, 'ideas'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      dateSubmitted: data.createdAt?.toDate?.()?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || 'Recently',
    } as Idea;
  });
}

export async function voteForIdea(ideaId: string, userId: string, hasVoted: boolean) {
  const ideaRef = doc(db, 'ideas', ideaId);
  if (hasVoted) {
    await updateDoc(ideaRef, {
      votes: increment(-1),
      voters: arrayRemove(userId)
    });
  } else {
    await updateDoc(ideaRef, {
      votes: increment(1),
      voters: arrayUnion(userId)
    });
  }
}

// --- CHAT ---

export async function sendMessage(message: Omit<ChatMessage, 'id' | 'timestamp' | 'createdAt'>) {
  await addDoc(collection(db, 'chats'), {
    ...message,
    createdAt: serverTimestamp(),
  });
}

export function subscribeToMessages(callback: (messages: ChatMessage[]) => void) {
  const q = query(collection(db, 'chats'), orderBy('createdAt', 'asc'), limit(50));
  
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.createdAt?.toDate?.()?.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) || 'Just now',
      } as ChatMessage;
    });
    callback(messages);
  });
}