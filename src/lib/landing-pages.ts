/**
 * Brand hub pages served at /najam/<slug> alongside categories and products.
 *
 * They exist so a generic brand query ("najam gopro", "najam jbl") has one
 * page that answers it: all models, a comparison and an FAQ. Product pages
 * then own the model queries ("najam gopro 13") and categories stop
 * competing with both.
 *
 * Kept as config in code rather than a DB table: there are only a few, all
 * SEO copy already ships through git, and a table would have to deploy ahead
 * of the code that reads it. If the owner ever needs to edit hubs in admin,
 * move this into a `landing_pages` table (migration first).
 *
 * Copy rules: no em or en dashes (owner rule), {cijena} is replaced with the
 * lowest live daily rate of `brandProductIds`, and `bodyHtml` must not rely on
 * Tailwind classes (src/lib is outside the Tailwind content glob; style comes
 * from the wrapper in LandingPage.tsx). bodyHtml goes through sanitizeHtml.
 */

export interface LandingFaq {
  question: string;
  answer: string;
}

export interface LandingPageConfig {
  slug: string;
  h1: string;
  /** May contain {cijena}. Brand-free: the layout appends " | rentanje.com". */
  seoTitle: string;
  /** May contain {cijena}. */
  seoDescription: string;
  /** Hero subtitle, plain text. */
  intro: string;
  /** Cards shown on the hub, in this order. Slug in the trailing comment. */
  productIds: string[];
  /**
   * The brand's own products: they drive {cijena} and get a backlink to the
   * hub on their product page. Must be a subset of productIds.
   */
  brandProductIds: string[];
  /** Parent in the breadcrumb; the category page links back to the hub. */
  parentCategorySlug: string;
  /** Anchor text used for links to the hub (footer, category chips). */
  navLabel: string;
  /** Anchor text on a brand product page linking back to the hub. */
  productLinkLabel: string;
  /** Public path, used for the hero and og:image. */
  heroImage: string;
  bodyHtml: string;
  /** Answers may contain {cijena}. */
  faq: LandingFaq[];
}

const GOPRO_13 = "77780245-5e25-413a-8526-9c522fb9c998"; // gopro-hero-13-black-najam
const GOPRO_10 = "dd891356-359f-480f-9601-fd612fe41247"; // gopro-hero-10-black-kamera-najam
const DJI_ACTION_5 = "8a216d33-8485-45c5-b75d-79735b34c09f"; // dji-osmo-action-5-pro-najam
const INSTA_X5 = "6a8d2c0d-7466-410d-8f4e-779021cf6b67"; // insta360-x5-360-kamera-najam
const INSTA_GO3 = "3ca30b42-088a-49ba-b5b4-9093da7a50e8"; // insta360-go-3-mini-kamera-najam
const JBL_PARTYBOX = "8bf63234-375e-41f5-8f7d-d9421620fe5c"; // jbl-partybox-stage-320-prijenosni-party-zvucnik-s-kotacima
const JBL_CHARGE_3 = "6e6de470-74be-423f-b720-9208930102b3"; // jbl-charge-3-bluetooth-zvucnik-najam
const JBL_MICS = "f6abe189-594a-4836-8a9f-b057dbd31c85"; // jbl-bezicni-mikrofoni-par-najam
const SPEAKER_STAND = "b0c794b4-bc26-4fa8-aa07-01adfbf907db"; // stalak-za-zvucnik-tripod-najam
const DJI_POCKET_3 = "176566e9-c50c-43d7-891c-ed1779b591ad"; // dji-osmo-pocket-3-najam
const DJI_MINI_2 = "34eae4aa-b521-4b8c-a701-7d825219c01f"; // dji-mini-2-dron-fly-more-najam
const DJI_NEO = "f188072d-4881-4396-88b6-a9927602921d"; // dji-neo-motion-fly-more-combo-najam
const DJI_POWER_1000 = "5cb9619b-bca7-4037-b2f5-f3e15cb55555"; // dji-power-1000-mini-stanica-napajanje-powerbank-najam

const DELIVERY_ANSWER =
  "Da. Dostavljamo na području Zagreba i okolice, a cijena dostave navedena je uz svaki proizvod. Izvan Zagreba cijena dostave je na upit. Opremu možete i osobno preuzeti u Zagrebu.";

export const LANDING_PAGES: LandingPageConfig[] = [
  {
    slug: "gopro-kamere",
    h1: "Najam GoPro kamere u Zagrebu",
    seoTitle: "Najam GoPro kamere u Zagrebu od {cijena} €/dan",
    seoDescription:
      "Iznajmite GoPro Hero 13 Black ili Hero 10 Black u Zagrebu od {cijena} €/dan. Vodootporne do 10 m, 5.3K video, preuzimanje ili dostava po Zagrebu.",
    intro:
      "GoPro Hero 13 Black i GoPro Hero 10 Black za more, skijanje, sport i putovanja. Usporedite modele, odaberite datume i rezervirajte online.",
    productIds: [GOPRO_13, GOPRO_10, DJI_ACTION_5, INSTA_X5, INSTA_GO3],
    brandProductIds: [GOPRO_13, GOPRO_10],
    parentCategorySlug: "kamere-i-dronovi",
    navLabel: "Najam GoPro kamera",
    productLinkLabel: "Sve GoPro kamere",
    heroImage: "/GoPro-paket-iznajmljivanje.png",
    bodyHtml: `<h2>GoPro Hero 13 ili GoPro Hero 10?</h2>
<p>Obje kamere snimaju 5.3K video pri 60 fps i vodootporne su do 10 metara bez kućišta. Razlika je u stabilizaciji, bateriji, usporenim snimkama i lećama.</p>
<table>
<thead><tr><th></th><th>GoPro Hero 13 Black</th><th>GoPro Hero 10 Black</th></tr></thead>
<tbody>
<tr><td>Video</td><td>5.3K pri 60 fps, 4K pri 120 fps</td><td>5.3K pri 60 fps</td></tr>
<tr><td>Fotografije</td><td>27,6 MP</td><td>23 MP</td></tr>
<tr><td>Stabilizacija</td><td>HyperSmooth 6.0</td><td>HyperSmooth 4.0</td></tr>
<tr><td>Baterija</td><td>1900 mAh Enduro, do 2,5 h snimanja</td><td>1720 mAh, oko 1 do 1,5 h na visokim rezolucijama</td></tr>
<tr><td>Usporene snimke</td><td>Burst Slo-Mo do 400 fps pri 720p</td><td>Bez Burst Slo-Mo</td></tr>
<tr><td>Zamjenjive leće</td><td>Da, HB-Series (makro, ultra wide, anamorfna)</td><td>Ne</td></tr>
<tr><td>Vodootpornost</td><td>Do 10 m bez kućišta</td><td>Do 10 m bez kućišta</td></tr>
</tbody>
</table>
<h3>Koju odabrati</h3>
<p>Uzmite <a href="/najam/gopro-hero-13-black-najam">GoPro Hero 13 Black</a> ako snimate usporene snimke, trebate dužu bateriju za cijeli dan na moru ili planini, ili želite makro i anamorfne leće. <a href="/najam/gopro-hero-10-black-kamera-najam">GoPro Hero 10 Black</a> snima isti 5.3K video i ima prednji ekran za selfie kadriranje, pa je odličan izbor za putovanja, bicikl i obiteljske izlete.</p>
<h2>Što dobivate u najmu</h2>
<ul>
<li>GoPro kameru s baterijom</li>
<li>USB-C kabel za punjenje i prijenos snimki</li>
<li>Montažne prste kompatibilne sa svim GoPro dodacima</li>
</ul>
<p>MicroSD kartica, rezervne baterije i stativ dostupni su kao dodatna oprema na upit. Napišite u napomeni upita što trebate.</p>
<h2>Za koje aktivnosti</h2>
<p>More i ronjenje s maskom, surfanje, kajak i <a href="/najam/sup-stand-up-paddle-najam">SUP</a>, skijanje i snowboard, biciklizam i planinarenje, putovanja, vjenčanja i rođendani. Kamera je mala, izdržljiva i snima bez dodatnog kućišta i pod vodom.</p>
<h2>Kako funkcionira najam</h2>
<p>Odaberite datume u kalendaru na stranici kamere, dodajte je u košaricu i pošaljite upit. Odgovaramo u roku od jednog radnog dana. Kameru preuzimate osobno u Zagrebu ili je dostavljamo na adresu u Zagrebu i okolici.</p>
<h2>Druge akcijske kamere</h2>
<p>Trebate nešto drugačije? <a href="/najam/dji-osmo-action-5-pro-najam">DJI Osmo Action 5 Pro</a> ima veći senzor, 4K pri 120 fps, bateriju do 4 sata i vodootporna je do 20 metara. <a href="/najam/insta360-x5-360-kamera-najam">Insta360 X5</a> snima 8K 360 video pa kadar birate naknadno, a <a href="/najam/insta360-go-3-mini-kamera-najam">Insta360 GO 3</a> teži samo 35 grama. Sve kamere i dronove pogledajte u kategoriji <a href="/najam/kamere-i-dronovi">kamere i dronovi</a>.</p>`,
    faq: [
      {
        question: "Koliko košta najam GoPro kamere?",
        answer:
          "Najam GoPro kamere u Zagrebu kreće od {cijena} eura dnevno. Najam na 3 ili 7 dana povoljniji je po danu, a točnu cijenu za odabrane datume vidite u kalendaru na stranici kamere.",
      },
      {
        question: "Koju GoPro kameru odabrati, Hero 13 ili Hero 10?",
        answer:
          "GoPro Hero 13 Black ima HyperSmooth 6.0 stabilizaciju, jaču bateriju od 1900 mAh, Burst Slo-Mo do 400 fps i podršku za zamjenjive leće. GoPro Hero 10 Black snima isti 5.3K video pri 60 fps i ima prednji ekran, pa je dobar izbor za putovanja i izlete.",
      },
      {
        question: "Što dobivam uz GoPro kameru u najmu?",
        answer:
          "Uz kameru dobivate bateriju, USB-C kabel za punjenje i prijenos te montažne prste kompatibilne sa svim GoPro dodacima. MicroSD kartica, rezervne baterije i stativ dostupni su kao dodatna oprema na upit.",
      },
      {
        question: "Je li memorijska kartica uključena?",
        answer:
          "MicroSD kartica nije dio osnovnog paketa, ali je dostupna kao dodatna oprema na upit. Napišite u napomeni upita da je trebate i pripremit ćemo je uz kameru.",
      },
      {
        question: "Je li GoPro kamera vodootporna?",
        answer:
          "Da. GoPro Hero 13 Black i GoPro Hero 10 Black vodootporne su do 10 metara dubine bez dodatnog kućišta, što pokriva kupanje, ronjenje s maskom, surfanje i kajak.",
      },
      {
        question: "Koliki je minimalni najam GoPro kamere?",
        answer:
          "GoPro kamere iznajmljuju se već od jednog dana. Za vikend ili godišnji odmor isplativiji je najam na 3 ili 7 dana.",
      },
      { question: "Mogu li dobiti dostavu?", answer: DELIVERY_ANSWER },
      {
        question: "Koliko unaprijed trebam rezervirati?",
        answer:
          "Svaki model imamo u jednom primjerku, pa za vikende i ljetnu sezonu preporučujemo rezervaciju nekoliko dana unaprijed. Slobodne datume vidite odmah u kalendaru na stranici kamere.",
      },
    ],
  },
  {
    slug: "jbl-zvucnici",
    h1: "Najam JBL zvučnika u Zagrebu",
    seoTitle: "Najam JBL zvučnika u Zagrebu od {cijena} €/dan",
    seoDescription:
      "Iznajmite JBL PartyBox Stage 320 od 240 W ili JBL Charge 3 u Zagrebu. Bežični mikrofoni za karaoke, stalci i dostava po Zagrebu i okolici.",
    intro:
      "JBL PartyBox Stage 320 za zabave, JBL Charge 3 za izlete i JBL bežični mikrofoni za karaoke. Usporedite modele i rezervirajte online.",
    productIds: [JBL_PARTYBOX, JBL_CHARGE_3, JBL_MICS, SPEAKER_STAND],
    brandProductIds: [JBL_PARTYBOX, JBL_CHARGE_3, JBL_MICS],
    parentCategorySlug: "audio-video-oprema",
    navLabel: "Najam JBL zvučnika",
    productLinkLabel: "Svi JBL zvučnici",
    heroImage: "/Partybox.jpg",
    bodyHtml: `<h2>JBL PartyBox Stage 320 ili JBL Charge 3?</h2>
<p>PartyBox je pravi party zvučnik za dvorište ili salu, a Charge 3 mali prijenosni zvučnik za plažu, piknik i manja druženja.</p>
<table>
<thead><tr><th></th><th>JBL PartyBox Stage 320</th><th>JBL Charge 3</th></tr></thead>
<tbody>
<tr><td>Snaga</td><td>240 W</td><td>20 W</td></tr>
<tr><td>Baterija</td><td>Do 18 h, zamjenjiva</td><td>Do 20 h</td></tr>
<tr><td>Zaštita od vode</td><td>IPX4, otporan na prskanje</td><td>IPX7, može se uroniti do 1 m</td></tr>
<tr><td>Za koliko ljudi</td><td>Prostor veličine teniskog terena</td><td>15 do 20 osoba na otvorenom</td></tr>
<tr><td>Mikrofon i gitara</td><td>Dva ulaza za mikrofon i ulaz za gitaru</td><td>Ne</td></tr>
<tr><td>Svjetlosni show</td><td>Da</td><td>Ne</td></tr>
<tr><td>Prijenos</td><td>Kotači i teleskopska ručka, 16,5 kg</td><td>Stane u ruksak</td></tr>
</tbody>
</table>
<h3>Koji odabrati</h3>
<p>Za rođendan, vjenčanje, momačku ili zabavu u dvorištu uzmite <a href="/najam/jbl-partybox-stage-320-prijenosni-party-zvucnik-s-kotacima">JBL PartyBox Stage 320</a>. Za plažu, kampiranje i manje društvo dovoljan je <a href="/najam/jbl-charge-3-bluetooth-zvucnik-najam">JBL Charge 3</a>, koji usput puni i mobitel.</p>
<h2>Karaoke i govori</h2>
<p><a href="/najam/jbl-bezicni-mikrofoni-par-najam">JBL bežični mikrofoni</a> rade plug and play s JBL PartyBox zvučnicima: prijemnik utaknete u zvučnik i mikrofoni rade. Domet je do 30 metara, a baterija traje oko 20 sati. S JBL Charge 3 mikrofoni ne rade bez posebnog prijemnika, pa za karaoke odaberite PartyBox.</p>
<h2>Stalak i veći prostor</h2>
<p><a href="/najam/stalak-za-zvucnik-tripod-najam">Stalak za zvučnik</a> podiže zvučnik na visinu od 1,24 do 2,1 m i nosi do 45 kg, pa zvuk bolje pokriva prostor. Za veću salu ili vjenčanje imamo dva PartyBox zvučnika koja se mogu upariti u stereo, a <a href="/paketi/paket-2-zvucnika-2-stalka-jbl-partybox-320">paket dva zvučnika i dva stalka</a> povoljniji je nego zasebno.</p>
<h2>Kako funkcionira najam</h2>
<p>Odaberite datume u kalendaru na stranici zvučnika, dodajte ga u košaricu i pošaljite upit. Odgovaramo u roku od jednog radnog dana. Zvučnik preuzimate osobno u Zagrebu ili ga dostavljamo na adresu u Zagrebu i okolici. Ostalo ozvučenje i projektore pogledajte u kategoriji <a href="/najam/audio-video-oprema">audio i video oprema</a>.</p>`,
    faq: [
      {
        question: "Koliko košta najam JBL zvučnika?",
        answer:
          "Najam JBL zvučnika u Zagrebu kreće od {cijena} eura dnevno. Najam na više dana povoljniji je po danu, a točnu cijenu za odabrane datume vidite u kalendaru na stranici zvučnika.",
      },
      {
        question: "Koji JBL zvučnik odabrati za zabavu?",
        answer:
          "Za zabavu u dvorištu ili sali odaberite JBL PartyBox Stage 320 s 240 W snage, svjetlosnim showom i ulazima za mikrofon. Za plažu, piknik i društvo od 15 do 20 osoba dovoljan je JBL Charge 3.",
      },
      {
        question: "Mogu li iznajmiti dva PartyBox zvučnika?",
        answer:
          "Da. Imamo dva JBL PartyBox Stage 320 zvučnika koja se mogu upariti u stereo. Dostupni su zasebno ili kao paket dva zvučnika i dva stalka po povoljnijoj cijeni.",
      },
      {
        question: "Rade li JBL bežični mikrofoni sa svakim zvučnikom?",
        answer:
          "JBL bežični mikrofoni rade plug and play s JBL PartyBox serijom. Za druge zvučnike, uključujući JBL Charge 3, potreban je poseban prijemnik koji nije u kompletu.",
      },
      {
        question: "Je li JBL zvučnik vodootporan?",
        answer:
          "JBL Charge 3 ima IPX7 zaštitu i može se uroniti u vodu do 1 metra na 30 minuta. JBL PartyBox Stage 320 ima IPX4 zaštitu od prskanja, pa mu lagana kiša ne smeta, ali se ne smije uranjati.",
      },
      {
        question: "Trebam li stalak za zvučnik?",
        answer:
          "Stalak nije obavezan, ali zvučnik podignut na visinu od 1,24 do 2,1 metra zvuči jasnije i bolje pokriva prostor. Stalak nosi do 45 kg i ima standardni prihvat od 35 mm koji odgovara JBL PartyBox zvučnicima.",
      },
      {
        question: "Koliki je minimalni najam?",
        answer:
          "JBL PartyBox Stage 320 i stalak iznajmljuju se već od jednog dana. JBL Charge 3 i JBL bežični mikrofoni iznajmljuju se na minimalno 3 dana.",
      },
      { question: "Mogu li dobiti dostavu?", answer: DELIVERY_ANSWER },
    ],
  },
  {
    slug: "dji",
    h1: "Najam DJI opreme u Zagrebu",
    seoTitle: "Najam DJI u Zagrebu od {cijena} €/dan",
    seoDescription:
      "Najam i iznajmljivanje DJI opreme u Zagrebu od {cijena} €/dan: Osmo Action 5 Pro, Osmo Pocket 3, dronovi Mini 2 i Neo te stanica Power 1000 Mini.",
    intro:
      "Iznajmljivanje DJI kamera, dronova i prijenosne stanice za napajanje. Usporedite modele, odaberite datume i rezervirajte online.",
    productIds: [DJI_ACTION_5, DJI_POCKET_3, DJI_MINI_2, DJI_NEO, DJI_POWER_1000],
    brandProductIds: [DJI_ACTION_5, DJI_POCKET_3, DJI_MINI_2, DJI_NEO, DJI_POWER_1000],
    parentCategorySlug: "kamere-i-dronovi",
    navLabel: "Najam DJI",
    productLinkLabel: "Sva DJI oprema",
    heroImage: "/najam-dji-neo.jpg",
    bodyHtml: `<h2>Koji DJI model odabrati?</h2>
<p>U ponudi imamo dvije DJI kamere, dva drona i prijenosnu stanicu za napajanje. Svi se iznajmljuju već od jednog dana.</p>
<table>
<thead><tr><th>Model</th><th>Vrsta</th><th>Ključno</th><th>Najbolje za</th></tr></thead>
<tbody>
<tr><td>DJI Osmo Action 5 Pro</td><td>Akcijska kamera</td><td>Senzor 1/1.3 inča, 4K pri 120 fps, baterija do 4 h, vodootporna do 20 m</td><td>More, sport i putovanja</td></tr>
<tr><td>DJI Osmo Pocket 3</td><td>Gimbal kamera</td><td>Senzor od 1 inča, 4K pri 120 fps, 3-osni gimbal, rotirajući ekran</td><td>Vlogovi, evente i vertikalni video</td></tr>
<tr><td>DJI Mini 2 Fly More</td><td>Dron</td><td>249 g, 4K video, 3 baterije za do 93 minute leta, domet do 10 km</td><td>Snimke iz zraka, putovanja, nekretnine i vjenčanja</td></tr>
<tr><td>DJI Neo Motion Fly More</td><td>Selfie dron</td><td>135 g, polijeće s dlana, naočale Goggles N3, 3 baterije za oko 54 minute leta</td><td>Vlogovi i kreativne snimke</td></tr>
<tr><td>DJI Power 1000 Mini</td><td>Stanica za napajanje</td><td>1024 Wh, izlaz do 2200 W, AC, USB-C i USB-A priključci</td><td>Evente, kamp i snimanja bez struje</td></tr>
</tbody>
</table>
<h2>DJI kamere</h2>
<p><a href="/najam/dji-osmo-action-5-pro-najam">DJI Osmo Action 5 Pro</a> je akcijska kamera za vodu i sport. Vodootporna je do 20 metara bez kućišta, baterija traje do 4 sata, a ima i 64 GB ugrađene memorije. <a href="/najam/dji-osmo-pocket-3-najam">DJI Osmo Pocket 3</a> ima mehanički 3-osni gimbal za mirnu sliku iz ruke i rotirajući ekran koji brzo prebacuje na vertikalni video za TikTok i Reels. Pocket 3 nije vodootporan, pa za more i kišu odaberite Action 5 Pro.</p>
<h2>DJI dronovi</h2>
<p><a href="/najam/dji-mini-2-dron-fly-more-najam">DJI Mini 2 Fly More</a> teži 249 g, snima 4K video i dolazi s tri baterije za do 93 minute leta, punjačem, zaštitom za propelere i torbom. <a href="/najam/dji-neo-motion-fly-more-combo-najam">DJI Neo Motion Fly More</a> teži samo 135 g i polijeće s dlana, a u kompletu su naočale DJI Goggles N3, kontroler RC Motion 3 i tri baterije. Propeleri su mu potpuno zatvoreni, pa je siguran i za letenje u zatvorenom. Prije leta provjerite važeća pravila za letenje dronom.</p>
<h2>Struja bilo gdje</h2>
<p><a href="/najam/dji-power-1000-mini-stanica-napajanje-powerbank-najam">DJI Power 1000 Mini</a> ima kapacitet 1024 Wh i izlaz do 2200 W, pa napaja laptope, kamere, dronove, projektore i zvučnike na lokacijama bez struje. Od 0 do 80 % puni se za oko 50 minuta.</p>
<h2>Kako funkcionira iznajmljivanje DJI opreme</h2>
<p>Odaberite datume u kalendaru na stranici proizvoda, dodajte ga u košaricu i pošaljite upit. Odgovaramo u roku od jednog radnog dana. Opremu preuzimate osobno u Zagrebu ili je dostavljamo na adresu u Zagrebu i okolici. Ostale modele pogledajte u kategoriji <a href="/najam/kamere-i-dronovi">kamere i dronovi</a>, a akcijske kamere drugog brenda na stranici <a href="/najam/gopro-kamere">najam GoPro kamere</a>.</p>`,
    faq: [
      {
        question: "Koliko košta najam DJI opreme?",
        answer:
          "Najam DJI opreme u Zagrebu kreće od {cijena} eura dnevno. Najam na 3 ili 7 dana povoljniji je po danu, a točnu cijenu za odabrane datume vidite u kalendaru na stranici proizvoda.",
      },
      {
        question: "Mogu li iznajmiti DJI dron?",
        answer:
          "Da. Iznajmljujemo DJI Mini 2 Fly More s tri baterije za do 93 minute leta i selfie dron DJI Neo Motion Fly More s naočalama DJI Goggles N3 i kontrolerom RC Motion 3.",
      },
      {
        question: "Koju DJI kameru odabrati za more?",
        answer:
          "Odaberite DJI Osmo Action 5 Pro, koja je vodootporna do 20 metara bez kućišta. DJI Osmo Pocket 3 nije vodootporan, pa ga treba držati podalje od kiše, mora i bazena.",
      },
      {
        question: "Koja je razlika između DJI Osmo Action 5 Pro i Osmo Pocket 3?",
        answer:
          "Osmo Action 5 Pro je izdržljiva akcijska kamera za vodu i sport s baterijom do 4 sata. Osmo Pocket 3 ima veći senzor od 1 inča i mehanički gimbal, pa je bolji izbor za vlogove, evente i snimanje iz ruke.",
      },
      {
        question: "Što dobivam uz DJI dron u najmu?",
        answer:
          "Uz DJI Mini 2 Fly More dobivate 3 baterije, punjač, zaštitu za propelere, rezervne propelere i torbu. Uz DJI Neo Motion Fly More dobivate naočale DJI Goggles N3, kontroler RC Motion 3 i 3 baterije.",
      },
      {
        question: "Trebam li dozvolu za letenje dronom?",
        answer:
          "Pravila ovise o dronu i mjestu letenja. Prije leta provjerite važeće propise na stranicama Hrvatske agencije za civilno zrakoplovstvo.",
      },
      {
        question: "Koliki je minimalni najam DJI opreme?",
        answer:
          "Svi DJI modeli iznajmljuju se već od jednog dana. Za vikend ili putovanje isplativiji je najam na 3 ili 7 dana.",
      },
      { question: "Mogu li dobiti dostavu?", answer: DELIVERY_ANSWER },
    ],
  },
];

const BY_SLUG = new Map(LANDING_PAGES.map((p) => [p.slug, p]));

export function getLandingPage(slug: string): LandingPageConfig | undefined {
  return BY_SLUG.get(slug);
}

export function landingPagesForCategory(categorySlug: string): LandingPageConfig[] {
  return LANDING_PAGES.filter((p) => p.parentCategorySlug === categorySlug);
}

/** Hubs on which this product is one of the brand's own products. */
export function landingPagesForProduct(productId: string): LandingPageConfig[] {
  return LANDING_PAGES.filter((p) => p.brandProductIds.includes(productId));
}

/**
 * Category slugs that must always build even if the DB is unreachable at
 * build time. Lives here (not in the page file) because Next rejects extra
 * exports from page modules and the tests need it.
 */
export const FALLBACK_CATEGORY_SLUGS = [
  "kamere-i-dronovi",
  "audio-video-oprema",
  "igre-na-otvorenom",
  "aparati-za-hranu-i-pice",
  "oprema-za-evente",
  "rostilj-kuhanje",
  "kamp-outdoor",
  "alati-ciscenje",
  "ostalo",
];
