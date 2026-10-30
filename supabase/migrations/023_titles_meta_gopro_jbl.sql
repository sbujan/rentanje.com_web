-- ============================================================
-- 023_titles_meta_gopro_jbl.sql
--
-- Catalogue-wide title and meta rewrite plus full GoPro / JBL copy
-- (owner decisions 2026-10-30, see the SEO plan).
--
-- Why: 46 of 53 active products had no "Zagreb" in title or meta, 49 meta
-- descriptions had no price, 40 contained dashes, and three titles were
-- broken (brand mid-title, a truncated "Rentanje.co", a generic "Najam
-- šatora"). GoPro 13 and 10 also competed for the same "najam GoPro" term.
--
-- Titles follow "Najam <model in genitive> u Zagrebu od {cijena} €/dan"
-- where that fits ~60 characters with the " | rentanje.com" suffix, and
-- drop "u Zagrebu" (kept in the meta) where it does not. {cijena} is filled
-- with the live daily rate at render time, so these never go stale when a
-- price changes in admin. Requires the code that fills {cijena}
-- (src/lib/seo.ts fillPrice); push only after that code is live, or the
-- placeholder would show literally.
--
-- Also: names lose em/en dashes (wording kept), Product JSON-LD gets a
-- brand where one is known, and the five GoPro/JBL products get HTML
-- descriptions with internal links to /najam/gopro-kamere and
-- /najam/jbl-zvucnici (brand hubs shipped in code), fixed FAQ, alt texts
-- and curated related products.
--
-- Data only. Idempotent. No em or en dashes in copy (owner rule).
-- ============================================================

BEGIN;

-- 1) seo_title + seo_description for every active product. {cijena} is
--    filled with the live daily rate at render time (src/lib/seo.ts).
UPDATE products p SET seo_title = v.t, seo_description = v.d, updated_at = now()
FROM (VALUES
  ('gopro-hero-13-black-najam', 'Najam GoPro Hero 13 u Zagrebu od {cijena} €/dan', 'Iznajmite GoPro Hero 13 Black u Zagrebu od {cijena} €/dan. 5.3K video, HyperSmooth 6.0, vodootporna do 10 m. Preuzimanje ili dostava po Zagrebu.'),
  ('gopro-hero-10-black-kamera-najam', 'Najam GoPro Hero 10 u Zagrebu od {cijena} €/dan', 'Iznajmite GoPro Hero 10 Black u Zagrebu od {cijena} €/dan. 5.3K video, prednji ekran, vodootporna do 10 m. Isplativ izbor za putovanja i izlete.'),
  ('dji-osmo-action-5-pro-najam', 'Najam DJI Osmo Action 5 Pro od {cijena} €/dan', 'Iznajmite DJI Osmo Action 5 Pro u Zagrebu od {cijena} €/dan. Veliki senzor, 4K pri 120 fps, baterija do 4 h i vodootpornost do 20 m.'),
  ('dji-osmo-pocket-3-najam', 'Najam DJI Osmo Pocket 3 u Zagrebu od {cijena} €/dan', 'Iznajmite DJI Osmo Pocket 3 u Zagrebu od {cijena} €/dan. Gimbal kamera s 1 inčnim senzorom i 4K pri 120 fps za vlogove, putovanja i evente.'),
  ('insta360-go-3-mini-kamera-najam', 'Najam Insta360 GO 3 u Zagrebu od {cijena} €/dan', 'Iznajmite Insta360 GO 3 u Zagrebu od {cijena} €/dan. Najmanja akcijska kamera od 35 g s magnetskim nosačem za kreativne POV snimke.'),
  ('insta360-x5-360-kamera-najam', 'Najam Insta360 X5 u Zagrebu od {cijena} €/dan', 'Iznajmite Insta360 X5 360 kameru u Zagrebu od {cijena} €/dan. 8K 360 video, vodootporna do 15 m, a kadar birate naknadno. Rezervirajte online.'),
  ('fujifilm-instax-mini-evo-najam', 'Najam Instax Mini EVO u Zagrebu od {cijena} €/dan', 'Iznajmite Fujifilm Instax Mini EVO instant kameru u Zagrebu od {cijena} €/dan. Ispis fotografija na licu mjesta za vjenčanja i rođendane.'),
  ('dji-mini-2-dron-fly-more-najam', 'Najam drona DJI Mini 2 u Zagrebu od {cijena} €/dan', 'Iznajmite DJI Mini 2 Fly More dron u Zagrebu od {cijena} €/dan. 249 g, 4K video i 3 baterije za do 93 minute leta. Rezervirajte online.'),
  ('dji-neo-motion-fly-more-combo-najam', 'Najam DJI Neo drona u Zagrebu od {cijena} €/dan', 'Iznajmite DJI Neo selfie dron u Zagrebu od {cijena} €/dan. 135 g, polijeće s dlana, 4K video, FPV naočale i 3 baterije u kompletu.'),
  ('jbl-partybox-stage-320-prijenosni-party-zvucnik-s-kotacima', 'Najam JBL PartyBox 320 u Zagrebu od {cijena} €/dan', 'Iznajmite JBL PartyBox Stage 320 u Zagrebu od {cijena} €/dan. 240 W, svjetlosni show, ulazi za mikrofon i 18 h baterije. Dostava po Zagrebu.'),
  ('jbl-charge-3-bluetooth-zvucnik-najam', 'Najam JBL Charge 3 u Zagrebu od {cijena} €/dan', 'Iznajmite JBL Charge 3 Bluetooth zvučnik u Zagrebu od {cijena} €/dan. Baterija do 20 h, vodootporan IPX7 i puni mobitel. Za plažu i izlete.'),
  ('jbl-bezicni-mikrofoni-par-najam', 'Najam JBL bežičnih mikrofona od {cijena} €/dan', 'Iznajmite par JBL bežičnih mikrofona za karaoke u Zagrebu od {cijena} €/dan. Plug and play s JBL PartyBox zvučnicima, domet do 30 m.'),
  ('stalak-za-zvucnik-tripod-najam', 'Najam stalka za zvučnik u Zagrebu od {cijena} €/dan', 'Iznajmite stalak za zvučnik u Zagrebu od {cijena} €/dan. Visina od 1,24 do 2,1 m i nosivost do 45 kg, idealan za JBL PartyBox zvučnike.'),
  ('epson-eb-fh52-profesionalni-projektor-najam', 'Najam Epson projektora 4000 lumena od {cijena} €/dan', 'Iznajmite Epson EB-FH52 u Zagrebu od {cijena} €/dan. Full HD projektor s 4000 lumena za konferencije, seminare i prezentacije u dvorani.'),
  ('veliko-projekcijsko-platno-stalak-211x160-100-inca-najam', 'Najam projekcijskog platna 100 inča u Zagrebu', 'Iznajmite projekcijsko platno 100 inča na stalku u Zagrebu od {cijena} €/dan. 211 x 160 cm za konferencije i velika događanja, bez montaže.'),
  ('projektor-s-platnom-najam', 'Najam projektora s platnom od {cijena} €/dan', 'Iznajmite projektor s platnom u Zagrebu od {cijena} €/dan. Kino na otvorenom, gledanje utakmica i prezentacije. Preuzimanje ili dostava.'),
  ('cornhole-igra-najam', 'Najam cornhole igre u Zagrebu od {cijena} €/dan', 'Iznajmite cornhole igru u Zagrebu od {cijena} €/dan. Popularna igra bacanja vrećica za sve uzraste, za roštilj, vjenčanja i team building.'),
  ('velika-jenga-giant-jenga-igra-najam', 'Najam velike jenge u Zagrebu od {cijena} €/dan', 'Iznajmite veliku jengu u Zagrebu od {cijena} €/dan. Drveni toranj koji raste do 150 cm, atrakcija za vrtne zabave, vjenčanja i evente.'),
  ('kubb-viking-igra-najam', 'Najam kubb igre u Zagrebu od {cijena} €/dan', 'Iznajmite kubb, skandinavsku drvenu igru za 2 do 12 igrača, u Zagrebu od {cijena} €/dan. Za parkove, dvorišta, plažu i team building.'),
  ('ladder-golf-igra-najam', 'Najam ladder golf igre u Zagrebu od {cijena} €/dan', 'Iznajmite ladder golf u Zagrebu od {cijena} €/dan. Igra bacanja bola na ljestvicu s tri prečke za 2 do 4 igrača, za vrt, park i plažu.'),
  ('spikeball-igra-najam', 'Najam spikeball seta u Zagrebu od {cijena} €/dan', 'Iznajmite spikeball set u Zagrebu od {cijena} €/dan. Dinamična igra za 4 igrača na plaži, u parku ili na travi. Idealna za team building.'),
  ('beer-pong-stol-case-najam', 'Najam beer pong stola s čašama od {cijena} €/dan', 'Iznajmite beer pong stol s čašama u Zagrebu od {cijena} €/dan. Sklopivi stol spreman za par minuta, za rođendane, momačke i tulume.'),
  ('ring-toss-igra-bacanja-prstenova-najam', 'Najam ring toss igre u Zagrebu od {cijena} €/dan', 'Iznajmite ring toss igru bacanja prstenova u Zagrebu od {cijena} €/dan. Jednostavna igra za sve uzraste, za vrtne zabave i dječje rođendane.'),
  ('badminton-set-mreza-najam', 'Najam badminton seta s mrežom od {cijena} €/dan', 'Iznajmite badminton set s mrežom, reketima i lopticama u Zagrebu od {cijena} €/dan. Postavljanje bez alata, za vrt, plažu i park.'),
  ('softarchery-luk-strijela-najam', 'Najam luka i strijele u Zagrebu od {cijena} €/dan', 'Iznajmite set luk i strijela s mekanim strelicama u Zagrebu od {cijena} €/dan. Sigurno streljaštvo za dječje rođendane i team building.'),
  ('froebel-tower-timska-igra-najam', 'Najam Fröbel Tower timske igre od {cijena} €/dan', 'Iznajmite Fröbel Tower u Zagrebu od {cijena} €/dan. Timska igra za 2 do 24 igrača u kojoj svi zajedno slažu toranj. Za team building.'),
  ('spyrathree-vodeni-pistolj-plavi-najam', 'Najam plavog SpyraThree vodenog pištolja', 'Iznajmite plavi SpyraThree električni vodeni pištolj u Zagrebu od {cijena} €/dan. Domet do 15 m, automatsko punjenje i LCD displej.'),
  ('spyrathree-vodeni-pistolj-crveni-najam', 'Najam crvenog SpyraThree vodenog pištolja', 'Iznajmite crveni SpyraThree električni vodeni pištolj u Zagrebu od {cijena} €/dan. Domet do 15 m, a uz plavi i timska vodena bitka.'),
  ('aparat-za-kokice-s-kolicima-vevor-najam', 'Najam aparata za kokice u Zagrebu od {cijena} €/dan', 'Iznajmite aparat za kokice s kolicima u Zagrebu od {cijena} €/dan. Retro kino stil, svježe kokice za 3 minute. Za rođendane i evente.'),
  ('ledomat-aparat-za-led-najam', 'Najam ledomata u Zagrebu od {cijena} €/dan', 'Iznajmite ledomat u Zagrebu od {cijena} €/dan. Aparat proizvodi do 12 kg leda dnevno, za koktele, roštilj i zabave. Rezervirajte online.'),
  ('tocionik-za-pivu-5l-najam', 'Najam točionika za pivo u Zagrebu od {cijena} €/dan', 'Iznajmite točionik za pivo u Zagrebu od {cijena} €/dan. Hladi 5 litrene bačve na 2 do 12 °C i toči pivo s kremastom pjenom.'),
  ('aparat-za-slushie-margaritu-najam', 'Najam Ninja aparata za slushie od {cijena} €/dan', 'Iznajmite Ninja SLUSHi aparat za slushie i margaritu u Zagrebu od {cijena} €/dan. Ledeni kokteli i bezalkoholni napitci za zabave.'),
  ('ninja-creami-swirl-aparat-sladoled-najam', 'Najam Ninja aparata za sladoled od {cijena} €/dan', 'Iznajmite Ninja CREAMi Swirl aparat za sladoled u Zagrebu od {cijena} €/dan. Soft serve, sorbet i frozen jogurt za zabave i rođendane.'),
  ('paviljon-sator-3x3m-najam', 'Najam paviljona 3x3 m u Zagrebu od {cijena} €/dan', 'Iznajmite paviljon šator 3x3 m u Zagrebu od {cijena} €/dan. Zaštita od sunca i kiše za 10 do 15 gostiju, postavljanje bez alata.'),
  ('prijenosni-ratan-stol-klupe-8-osoba-najam', 'Najam stola s klupama za 8 osoba od {cijena} €/dan', 'Iznajmite ratan stol s dvije klupe za 8 osoba u Zagrebu od {cijena} €/dan. Elegantniji pivski set za vrtne zabave, piknik i evente.'),
  ('blumfeldt-dark-wave-infracrvena-grijalica-najam', 'Najam infracrvene grijalice od {cijena} €/dan', 'Iznajmite infracrvenu grijalicu Blumfeldt Dark Wave 2000 W u Zagrebu od {cijena} €/dan. Grije odmah, IP65, za terase i vrtne zabave.'),
  ('kotao-lijevani-zeljezo-10l-stalak-najam', 'Najam kotla od lijevanog željeza od {cijena} €/dan', 'Iznajmite kotao od lijevanog željeza od 10 L sa stalkom u Zagrebu od {cijena} €/dan. Za gulaš, čobanac i fiš na vatri za 10 do 15 osoba.'),
  ('kotlovina-73cm-najam', 'Najam kotlovine u Zagrebu od {cijena} €/dan', 'Iznajmite kotlovinu promjera 73,5 cm u Zagrebu od {cijena} €/dan. Za kotlovinu, pljeskavice i roštilj za 20 i više osoba.'),
  ('ooni-koda-16-plinska-pec-pizza-najam', 'Najam peći za pizzu Ooni Koda 16 od {cijena} €/dan', 'Iznajmite Ooni Koda 16 plinsku peć za pizzu u Zagrebu od {cijena} €/dan. Postiže 500 °C, a napolitanska pizza gotova je za 60 sekundi.'),
  ('peka-tradicionalna-najam', 'Najam peke u Zagrebu od {cijena} €/dan', 'Iznajmite tradicionalnu peku u Zagrebu od {cijena} €/dan. Janjetina, hobotnica i povrće ispod peke za obiteljska okupljanja i slavlja.'),
  ('philips-aparat-za-tjesteninu', 'Najam aparata za tjesteninu od {cijena} €/dan', 'Iznajmite Philips aparat za tjesteninu u Zagrebu od {cijena} €/dan. Sam mijesi i oblikuje svježu domaću tjesteninu za par minuta.'),
  ('razanj-s-motorom-najam', 'Najam ražnja s motorom u Zagrebu od {cijena} €/dan', 'Iznajmite ražanj s motorom u Zagrebu od {cijena} €/dan. Ravnomjerno pečenje janjetine, odojka i piletine, dolazi u transportnoj torbi.'),
  ('vertikalni-kebab-rostilj-najam', 'Najam kebab roštilja u Zagrebu od {cijena} €/dan', 'Iznajmite vertikalni kebab roštilj u Zagrebu od {cijena} €/dan. Döner, gyros i shawarma kod kuće za 2 do 5 kg mesa. Za zabave i festivale.'),
  ('weber-traveler-prijenosni-plinski-rostilj-najam', 'Najam Weber Traveler roštilja od {cijena} €/dan', 'Iznajmite Weber Traveler prijenosni plinski roštilj u Zagrebu od {cijena} €/dan. Sklapa se kao kofer na kotačima, za 6 do 8 osoba.'),
  ('dji-power-1000-mini-stanica-napajanje-powerbank-najam', 'Najam DJI Power 1000 Mini stanice od {cijena} €/dan', 'Iznajmite DJI Power 1000 Mini stanicu za napajanje u Zagrebu od {cijena} €/dan. 1024 Wh i 2200 W, struja za evente, kamp i snimanja.'),
  ('sator-arpenaz-41-4-osobe-najam', 'Najam šatora za 4 osobe Arpenaz 4.1', 'Iznajmite šator za 4 osobe Quechua Arpenaz 4.1 u Zagrebu od {cijena} €/dan. Jedna velika spavaonica, madrac i pumpa uključeni.'),
  ('sator-za-3-osobe-kampiranje-najam', 'Najam šatora za 3 osobe u Zagrebu od {cijena} €/dan', 'Iznajmite šator za 3 osobe s madracem i pumpom u Zagrebu od {cijena} €/dan. Fresh&Black tehnologija za tamu i hlad, za kamp i festivale.'),
  ('sator-za-kampiranje-za-4-osobe-madraci-pumpa-najam', 'Najam camping paketa: šator i 2 madraca', 'Iznajmite camping paket u Zagrebu od {cijena} €/dan: šator za 4 osobe, 2 zračna madraca i električna pumpa. Sve za kamp u jednom najmu.'),
  ('sklopivi-stol-kampiranje-4-stolice-najam', 'Najam kamp stola s 4 stolice od {cijena} €/dan', 'Iznajmite sklopivi stol za kampiranje s 4 stolice u Zagrebu od {cijena} €/dan. Za 4 do 6 osoba, podesiva visina, kompaktno sklapanje.'),
  ('solo-stove-bonfire-firepit-najam', 'Najam Solo Stove Bonfire vatrišta od {cijena} €/dan', 'Iznajmite Solo Stove Bonfire 2.0 vatrište u Zagrebu od {cijena} €/dan. Vatra s minimalno dima za dvorišta, kampiranje i evente.'),
  ('sup-stand-up-paddle-najam', 'Najam SUP daske u Zagrebu od {cijena} €/dan', 'Iznajmite SUP dasku na napuhavanje u Zagrebu od {cijena} €/dan. Veslo, pumpa i ruksak uključeni. Za Jarun, Bundek i jadransku obalu.'),
  ('plinski-plamenik-kampiranje-najam', 'Najam plamenika za kampiranje od {cijena} €/dan', 'Iznajmite plinski plamenik za kampiranje u Zagrebu od {cijena} €/dan. Kompaktno kuhalo za kamp, piknik i festivale. Rezervirajte online.'),
  ('karcher-puzzi-mokro-suhi-usisavac-najam', 'Najam Kärcher Puzzi u Zagrebu od {cijena} €/dan', 'Iznajmite Kärcher Puzzi 10/1 u Zagrebu od {cijena} €/dan. Dubinsko čišćenje tepiha, namještaja i autosjedala kao od profesionalaca.')
) AS v(slug, t, d)
WHERE p.slug = v.slug;

-- 2) Names: em/en dash replaced, wording kept. GoPro names get the model
--    suffix "Black" so the H1 matches what people search.
UPDATE products p SET name = v.n, updated_at = now()
FROM (VALUES
  ('gopro-hero-13-black-najam', 'GoPro Hero 13 Black akcijska kamera'),
  ('gopro-hero-10-black-kamera-najam', 'GoPro Hero 10 Black akcijska kamera'),
  ('dji-neo-motion-fly-more-combo-najam', 'DJI Neo Motion Fly More Combo, selfie dron 135 g'),
  ('fujifilm-instax-mini-evo-najam', 'Fujifilm Instax Mini EVO hibridna instant kamera'),
  ('jbl-bezicni-mikrofoni-par-najam', 'JBL bežični mikrofoni (par) za karaoke i evente'),
  ('jbl-partybox-stage-320-prijenosni-party-zvucnik-s-kotacima', 'JBL PartyBox Stage 320 prijenosni party zvučnik s kotačima'),
  ('ninja-creami-swirl-aparat-sladoled-najam', 'Ninja CREAMi Swirl aparat za sladoled'),
  ('spyrathree-vodeni-pistolj-plavi-najam', 'SpyraThree vodeni pištolj, plavi'),
  ('spyrathree-vodeni-pistolj-crveni-najam', 'SpyraThree vodeni pištolj, crveni'),
  ('froebel-tower-timska-igra-najam', 'Fröbel Tower, timska igra na otvorenom'),
  ('sator-arpenaz-41-4-osobe-najam', 'Šator za 4 osobe Arpenaz 4.1 + madrac i pumpa'),
  ('sator-za-3-osobe-kampiranje-najam', 'Šator za 3 osobe, kompaktni šator za kampiranje + madrac na napuhavanje + pumpa'),
  ('sklopivi-stol-kampiranje-4-stolice-najam', 'Sklopivi stol za kampiranje s 4 stolice, za 4 do 6 osoba'),
  ('sup-stand-up-paddle-najam', 'SUP daska, Stand Up Paddle na napuhavanje'),
  ('kotlovina-73cm-najam', 'Kotlovina 73,5 cm')
) AS v(slug, n)
WHERE p.slug = v.slug;

-- 3) Brand for the Product JSON-LD (read by extractBrand in ProductPage).
--    Merges into any existing schema_json; only rows without a brand.
UPDATE products p SET schema_json = coalesce(p.schema_json, '{}'::jsonb)
    || jsonb_build_object('@context', 'https://schema.org', '@type', 'Product', 'name', p.name,
                          'brand', jsonb_build_object('@type', 'Brand', 'name', v.b)),
  updated_at = now()
FROM (VALUES
  ('gopro-hero-13-black-najam', 'GoPro'),
  ('gopro-hero-10-black-kamera-najam', 'GoPro'),
  ('dji-osmo-action-5-pro-najam', 'DJI'),
  ('dji-osmo-pocket-3-najam', 'DJI'),
  ('dji-mini-2-dron-fly-more-najam', 'DJI'),
  ('dji-power-1000-mini-stanica-napajanje-powerbank-najam', 'DJI'),
  ('insta360-go-3-mini-kamera-najam', 'Insta360'),
  ('insta360-x5-360-kamera-najam', 'Insta360'),
  ('jbl-partybox-stage-320-prijenosni-party-zvucnik-s-kotacima', 'JBL'),
  ('jbl-charge-3-bluetooth-zvucnik-najam', 'JBL'),
  ('weber-traveler-prijenosni-plinski-rostilj-najam', 'Weber'),
  ('ooni-koda-16-plinska-pec-pizza-najam', 'Ooni'),
  ('karcher-puzzi-mokro-suhi-usisavac-najam', 'Kärcher'),
  ('solo-stove-bonfire-firepit-najam', 'Solo Stove'),
  ('blumfeldt-dark-wave-infracrvena-grijalica-najam', 'Blumfeldt'),
  ('philips-aparat-za-tjesteninu', 'Philips'),
  ('spikeball-igra-najam', 'Spikeball')
) AS v(slug, b)
WHERE p.slug = v.slug
  AND (p.schema_json IS NULL OR NOT (p.schema_json ? 'brand'));

-- 4) Full copy for the GoPro and JBL products: HTML descriptions with
--    headings and internal links (hub, category, related models), fixed and
--    extended FAQ, short_desc without dashes, and alt texts. Facts come from
--    the existing rows; "dodatna oprema na upit" per owner 2026-10-30.

UPDATE products SET
  short_desc = 'Akcijska kamera s 5.3K videom pri 60 fps, HyperSmooth 6.0 stabilizacijom, baterijom od 1900 mAh i vodootpornošću do 10 m. Za more, skijanje i putovanja.',
  description = '<p>GoPro Hero 13 Black je najnovija GoPro akcijska kamera u našoj ponudi. Snima 5.3K video pri 60 fps i 4K pri 120 fps za glatke usporene snimke, a HyperSmooth 6.0 stabilizacija uklanja tresenje i na neravnom terenu. Iznajmite je u Zagrebu za more, skijanje, bicikl ili putovanje, bez kupnje.</p>
<h3>Ključne značajke</h3>
<ul>
<li>5.3K video pri 60 fps i 4K pri 120 fps</li>
<li>Burst Slo-Mo do 400 fps pri 720p za ultra usporene snimke</li>
<li>HyperSmooth 6.0 stabilizacija</li>
<li>Senzor od 27,6 MP za oštre fotografije</li>
<li>Enduro baterija od 1900 mAh, do 2,5 sata neprekidnog snimanja</li>
<li>Vodootporna do 10 m bez dodatnog kućišta</li>
<li>Podrška za zamjenjive HB-Series leće: makro, ultra wide i anamorfna</li>
<li>Wi-Fi 6 i Bluetooth 5.3 za brži prijenos snimki</li>
</ul>
<h3>Što dobivate u najmu</h3>
<ul>
<li>GoPro Hero 13 Black s baterijom</li>
<li>USB-C kabel za punjenje i prijenos snimki</li>
<li>Montažne prste kompatibilne sa svim GoPro dodacima</li>
</ul>
<p>MicroSD kartica, rezervne baterije i stativ dostupni su kao dodatna oprema na upit. Napišite u napomeni upita što trebate.</p>
<h3>Za koje prilike</h3>
<p>Ronjenje s maskom, surfanje, kajak i <a href="/najam/sup-stand-up-paddle-najam">SUP</a>, skijanje i snowboard, biciklizam, planinarenje, putovanja, vjenčanja i rođendani.</p>
<h3>Usporedite s drugim kamerama</h3>
<p>Za putovanja i izlete dobar izbor je i <a href="/najam/gopro-hero-10-black-kamera-najam">GoPro Hero 10 Black</a> s istim 5.3K videom pri 60 fps. Za veći senzor i vodootpornost do 20 m tu je <a href="/najam/dji-osmo-action-5-pro-najam">DJI Osmo Action 5 Pro</a>. Usporedbu modela pogledajte na stranici <a href="/najam/gopro-kamere">najam GoPro kamere</a>, a sve kamere i dronove u kategoriji <a href="/najam/kamere-i-dronovi">kamere i dronovi</a>.</p>',
  faq = '[
    {"question":"Koliko košta najam GoPro Hero 13 Black?","answer":"Najam GoPro Hero 13 Black u Zagrebu kreće od {cijena} eura dnevno. Najam na 3 ili 7 dana povoljniji je po danu, a točnu cijenu za odabrane datume vidite u kalendaru na ovoj stranici."},
    {"question":"Koja je rezolucija GoPro Hero 13?","answer":"GoPro Hero 13 snima video do 5.3K pri 60 fps i 4K pri 120 fps. Za fotografije koristi senzor od 27,6 megapiksela, a podržava i Burst Slo-Mo do 400 fps pri 720p za ultra usporene snimke."},
    {"question":"Koliko traje baterija GoPro Hero 13?","answer":"Enduro baterija od 1900 mAh pruža do 2,5 sata neprekidnog snimanja. Trajanje ovisi o rezoluciji: na 1080p traje do 3 sata, a na 5.3K oko 1,5 sat. Rezervne baterije dostupne su kao dodatna oprema na upit."},
    {"question":"Je li GoPro Hero 13 vodootporan?","answer":"Da, vodootporan je do 10 metara dubine bez dodatnog kućišta. Idealan je za ronjenje s maskom, surfanje, kajak i sve vodene aktivnosti."},
    {"question":"Mogu li snimati usporene snimke?","answer":"Da. Hero 13 snima 4K pri 120 fps za glatke usporene snimke, a Burst Slo-Mo mod snima 400 fps pri 720p za 15 sekundi stvarnog vremena."},
    {"question":"Što dolazi u paketu pri najmu?","answer":"Uz kameru dobivate bateriju, USB-C kabel za punjenje i prijenos te montažne prste kompatibilne sa svim GoPro dodacima. MicroSD kartica, rezervne baterije i stativ dostupni su kao dodatna oprema na upit."},
    {"question":"Je li memorijska kartica uključena?","answer":"MicroSD kartica nije dio osnovnog paketa, ali je dostupna kao dodatna oprema na upit. Napišite u napomeni upita da je trebate i pripremit ćemo je uz kameru."},
    {"question":"GoPro Hero 13 ili GoPro Hero 10?","answer":"GoPro Hero 13 Black ima HyperSmooth 6.0 stabilizaciju, jaču bateriju od 1900 mAh, Burst Slo-Mo do 400 fps i podršku za zamjenjive leće. GoPro Hero 10 Black snima isti 5.3K video pri 60 fps i dobar je izbor za putovanja i izlete."}
  ]'::jsonb,
  hero_image_alt = 'GoPro Hero 13 Black akcijska kamera za najam u Zagrebu',
  image_alts = ARRAY(SELECT format('GoPro Hero 13 Black za najam, fotografija %s', i) FROM generate_series(1, coalesce(array_length(images, 1), 0)) AS i),
  updated_at = now()
WHERE slug = 'gopro-hero-13-black-najam';

UPDATE products SET
  short_desc = 'Pouzdana akcijska kamera s 5.3K videom pri 60 fps, HyperSmooth 4.0 stabilizacijom, prednjim ekranom i vodootpornošću do 10 m.',
  description = '<p>GoPro Hero 10 Black je pouzdana akcijska kamera koja snima 5.3K video pri 60 fps i fotografije od 23 MP. GP2 procesor daje stabilniju sliku, brži prijenos i bolju kvalitetu pri slabom svjetlu. Iznajmite je u Zagrebu za putovanja, sport i obiteljske izlete.</p>
<h3>Ključne značajke</h3>
<ul>
<li>5.3K video pri 60 fps i fotografije od 23 MP</li>
<li>HyperSmooth 4.0 stabilizacija</li>
<li>Prednji ekran za selfie kadriranje i stražnji touchscreen</li>
<li>Vodootporna do 10 m bez dodatnog kućišta</li>
<li>Baterija od 1720 mAh, oko 1 do 1,5 sat snimanja na visokim rezolucijama</li>
<li>Kompatibilna sa svim GoPro montažnim dodacima</li>
</ul>
<h3>Što dobivate u najmu</h3>
<ul>
<li>GoPro Hero 10 Black s baterijom</li>
<li>USB-C kabel za punjenje i prijenos snimki</li>
<li>Montažne prste kompatibilne sa svim GoPro dodacima</li>
</ul>
<p>MicroSD kartica, rezervne baterije i stativ dostupni su kao dodatna oprema na upit. Napišite u napomeni upita što trebate.</p>
<h3>Za koje prilike</h3>
<p>Putovanja, more i kupanje, biciklizam, planinarenje, <a href="/najam/sup-stand-up-paddle-najam">SUP</a>, skijanje i snimanje obiteljskih trenutaka.</p>
<h3>Usporedite s drugim kamerama</h3>
<p>Za dužu bateriju, Burst Slo-Mo i zamjenjive leće odaberite <a href="/najam/gopro-hero-13-black-najam">GoPro Hero 13 Black</a>. Za veći senzor i vodootpornost do 20 m tu je <a href="/najam/dji-osmo-action-5-pro-najam">DJI Osmo Action 5 Pro</a>. Usporedbu modela pogledajte na stranici <a href="/najam/gopro-kamere">najam GoPro kamere</a>, a sve kamere i dronove u kategoriji <a href="/najam/kamere-i-dronovi">kamere i dronovi</a>.</p>',
  faq = '[
    {"question":"Koliko košta najam GoPro Hero 10 Black?","answer":"Najam GoPro Hero 10 Black u Zagrebu kreće od {cijena} eura dnevno. Najam na 3 ili 7 dana povoljniji je po danu, a točnu cijenu za odabrane datume vidite u kalendaru na ovoj stranici."},
    {"question":"Koja je razlika između GoPro 10 i 13?","answer":"Hero 10 snima 5.3K video pri 60 fps kao i Hero 13, ali Hero 13 ima jaču bateriju od 1900 mAh umjesto 1720 mAh, HyperSmooth 6.0 umjesto 4.0, zamjenjive leće, Burst Slo-Mo i Wi-Fi 6."},
    {"question":"Je li vodootporna?","answer":"Da, GoPro Hero 10 Black vodootporna je do 10 metara bez dodatnog kućišta."},
    {"question":"Koliko traje baterija?","answer":"Baterija od 1720 mAh pruža oko 1 do 1,5 sat snimanja na visokim rezolucijama. Rezervne baterije dostupne su kao dodatna oprema na upit."},
    {"question":"Ima li prednji ekran?","answer":"Da. Ima prednji ekran za selfie kadriranje i stražnji touchscreen za pregled snimki i navigaciju izbornicima."},
    {"question":"S kojim dodacima je kompatibilna?","answer":"Kompatibilna je sa svim GoPro montažnim dodacima: nosačima za kacigu, prsa i ruke, selfie štapovima i vodenim dodacima."},
    {"question":"Što dolazi u paketu pri najmu?","answer":"Uz kameru dobivate bateriju, USB-C kabel za punjenje i prijenos te montažne prste kompatibilne sa svim GoPro dodacima. MicroSD kartica, rezervne baterije i stativ dostupni su kao dodatna oprema na upit."},
    {"question":"Je li memorijska kartica uključena?","answer":"MicroSD kartica nije dio osnovnog paketa, ali je dostupna kao dodatna oprema na upit. Napišite u napomeni upita da je trebate i pripremit ćemo je uz kameru."}
  ]'::jsonb,
  hero_image_alt = 'GoPro Hero 10 Black akcijska kamera za najam u Zagrebu',
  image_alts = ARRAY(SELECT format('GoPro Hero 10 Black za najam, fotografija %s', i) FROM generate_series(1, coalesce(array_length(images, 1), 0)) AS i),
  updated_at = now()
WHERE slug = 'gopro-hero-10-black-kamera-najam';

UPDATE products SET
  short_desc = 'JBL PartyBox Stage 320 s 240 W snage, 18 sati baterije, svjetlosnim showom i ulazima za mikrofon. Pravi party zvučnik na kotačima.',
  description = '<p>JBL PartyBox Stage 320 je party zvučnik koji napuni prostor veličine teniskog terena. Dva woofera od 6,5 inča i dva visokotonca od 25 mm daju ukupno 240 W JBL Pro Sound zvuka s dubokim basom, a svjetlosni show sa zvjezdanim svjetlima, light trail efektima i stroboskopom prati ritam glazbe. Iznajmite ga u Zagrebu za rođendan, momačku, vjenčanje ili zabavu u dvorištu.</p>
<h3>Ključne značajke</h3>
<ul>
<li>240 W snage iz dva woofera od 6,5 inča i dva visokotonca od 25 mm</li>
<li>Baterija do 18 sati, zamjenjiva bez alata; 10 minuta brzog punjenja daje 2 sata glazbe</li>
<li>Dva ulaza za mikrofon i ulaz za gitaru za karaoke i nastupe</li>
<li>IPX4 zaštita od prskanja, lagana kiša mu ne smeta</li>
<li>Teleskopska ručka i široki kotači, vučete ga kao kofer</li>
<li>Bluetooth 5.4, Auracast povezivanje više zvučnika i AI Sound Boost</li>
</ul>
<h3>Što dobivate u najmu</h3>
<ul>
<li>JBL PartyBox Stage 320 zvučnik s baterijom</li>
<li>AC kabel za napajanje</li>
</ul>
<h3>Složite ozvučenje</h3>
<p>Za karaoke dodajte <a href="/najam/jbl-bezicni-mikrofoni-par-najam">JBL bežične mikrofone</a>, koji rade plug and play s PartyBox serijom, a za bolji zvuk u prostoru <a href="/najam/stalak-za-zvucnik-tripod-najam">stalak za zvučnik</a>. Imamo dva PartyBox zvučnika koja se mogu upariti u stereo, pa za veću salu ili vjenčanje pogledajte <a href="/paketi/paket-2-zvucnika-2-stalka-jbl-partybox-320">paket dva zvučnika i dva stalka</a>. Manji <a href="/najam/jbl-charge-3-bluetooth-zvucnik-najam">JBL Charge 3</a> dovoljan je za plažu i piknik. Usporedbu svih modela pogledajte na stranici <a href="/najam/jbl-zvucnici">najam JBL zvučnika</a>.</p>',
  faq = '[
    {"question":"Koliko košta najam JBL PartyBox Stage 320?","answer":"Najam JBL PartyBox Stage 320 u Zagrebu kreće od {cijena} eura dnevno. Najam na 3 ili 7 dana povoljniji je po danu, a točnu cijenu za odabrane datume vidite u kalendaru na ovoj stranici."},
    {"question":"Koliko je glasan JBL PartyBox Stage 320?","answer":"Zvučnik isporučuje 240 W snage kroz dva woofera od 6,5 inča i dva visokotonca od 25 mm. To je dovoljno da ispuni prostor veličine teniskog terena kvalitetnim zvukom s dubokim basom, u zatvorenom prostoru ili na otvorenom."},
    {"question":"Koliko dugo traje baterija JBL PartyBox Stage 320?","answer":"Baterija traje do 18 sati reprodukcije, ovisno o glasnoći i korištenju svjetlosnog showa. Potpuno punjenje traje 3 sata, a 10 minuta brzog punjenja daje dodatna 2 sata glazbe."},
    {"question":"Je li JBL PartyBox Stage 320 vodootporan?","answer":"Zvučnik ima IPX4 zaštitu od prskanja vode, pa je prikladan za zabave pokraj bazena ili u vrtu i lagana kiša mu ne smeta. Ne smije se uranjati u vodu."},
    {"question":"Mogu li koristiti mikrofon i gitaru s ovim zvučnikom?","answer":"Da. PartyBox Stage 320 ima dva ulaza za mikrofon od 6,3 mm i ulaz za gitaru, pa je savršen za karaoke i live nastupe. Uz zvučnik možete iznajmiti i JBL bežične mikrofone koji rade plug and play s PartyBox serijom."},
    {"question":"Kako se povezuje JBL PartyBox Stage 320?","answer":"Zvučnik koristi Bluetooth 5.4 i može biti spojen s dva uređaja istovremeno. Ima i 3,5 mm AUX ulaz te USB priključak za reprodukciju glazbe s USB sticka."},
    {"question":"Mogu li spojiti više JBL zvučnika zajedno?","answer":"Da. Pomoću Auracast tehnologije možete bežično povezati više kompatibilnih JBL PartyBox zvučnika, a dva PartyBox Stage 320 zvučnika mogu se upariti u stereo. Imamo dva takva zvučnika, a dostupan je i paket s dva zvučnika i dva stalka."},
    {"question":"Koliko je težak i je li lako prenosiv?","answer":"Zvučnik teži 16,5 kg, ali zahvaljujući širokim kotačima i teleskopskoj ručki vučete ga kao kofer. Dimenzije su 33,5 x 67 x 38,5 cm."},
    {"question":"Kakav je svjetlosni show na JBL PartyBox Stage 320?","answer":"Zvučnik ima ugrađeni svjetlosni sustav sa zvjezdanim svjetlima, light trail efektima i stroboskopom koji se automatski sinkroniziraju s ritmom glazbe. Postavke svjetla podešavate u JBL PartyBox aplikaciji."},
    {"question":"Što uključuje najam?","answer":"U najam dobivate JBL PartyBox Stage 320 zvučnik s baterijom i AC kabel za napajanje. Bežične mikrofone i stalak možete iznajmiti uz zvučnik."}
  ]'::jsonb,
  hero_image_alt = 'JBL PartyBox Stage 320 party zvučnik za najam u Zagrebu',
  image_alts = ARRAY(SELECT format('JBL PartyBox Stage 320 za najam, fotografija %s', i) FROM generate_series(1, coalesce(array_length(images, 1), 0)) AS i),
  updated_at = now()
WHERE slug = 'jbl-partybox-stage-320-prijenosni-party-zvucnik-s-kotacima';

UPDATE products SET
  description = '<p>JBL Charge 3 je kompaktni prijenosni Bluetooth zvučnik čiji zvuk nadmašuje njegovu veličinu. Baterija traje do 20 sati, IPX7 zaštita znači da ga možete ponijeti na plažu, bazen ili pod kišu, a ugrađeni powerbank usput puni mobitel. Iznajmite ga u Zagrebu za izlet, kampiranje ili manje druženje.</p>
<h3>Ključne značajke</h3>
<ul>
<li>20 W snage, dovoljno za 15 do 20 osoba na otvorenom ili manju sobu</li>
<li>Baterija do 20 sati reprodukcije</li>
<li>IPX7 vodootpornost, može se uroniti do 1 m na 30 minuta</li>
<li>Powerbank funkcija za punjenje mobitela preko USB-a</li>
<li>JBL Connect+ za povezivanje više kompatibilnih JBL zvučnika</li>
</ul>
<h3>Kada odabrati veći zvučnik</h3>
<p>Za rođendan, momačku ili zabavu u dvorištu odaberite <a href="/najam/jbl-partybox-stage-320-prijenosni-party-zvucnik-s-kotacima">JBL PartyBox Stage 320</a> s 240 W i svjetlosnim showom. Za karaoke trebate PartyBox, jer <a href="/najam/jbl-bezicni-mikrofoni-par-najam">JBL bežični mikrofoni</a> s Charge 3 ne rade bez posebnog prijemnika. Usporedbu svih modela pogledajte na stranici <a href="/najam/jbl-zvucnici">najam JBL zvučnika</a>.</p>',
  faq = '[
    {"question":"Koliko košta najam JBL Charge 3?","answer":"Najam JBL Charge 3 u Zagrebu kreće od {cijena} eura dnevno uz minimalni najam od 3 dana. Najam na 7 dana povoljniji je po danu, a točnu cijenu za odabrane datume vidite u kalendaru na ovoj stranici."},
    {"question":"Koliko traje baterija JBL Charge 3?","answer":"Do 20 sati reprodukcije na jednom punjenju, dovoljno za cjelodnevni izlet ili večernju zabavu."},
    {"question":"Je li vodootporan?","answer":"Da. JBL Charge 3 ima IPX7 certifikat i može se potpuno uroniti u vodu do 1 metra na 30 minuta bez oštećenja."},
    {"question":"Koliko je glasan?","answer":"JBL Charge 3 isporučuje 20 W snage, dovoljno za manja druženja od 15 do 20 osoba na otvorenom ili za manju sobu. Za veću zabavu preporučujemo JBL PartyBox Stage 320."},
    {"question":"Može li puniti mobitel?","answer":"Da. Ima ugrađenu powerbank funkciju pa možete puniti mobitel preko USB porta dok slušate glazbu."},
    {"question":"Mogu li spojiti više zvučnika?","answer":"Da. JBL Connect+ tehnologija omogućuje povezivanje više kompatibilnih JBL zvučnika za veći zvuk."},
    {"question":"Rade li JBL bežični mikrofoni s Charge 3?","answer":"Ne. JBL bežični mikrofoni rade plug and play s JBL PartyBox serijom. Za karaoke iznajmite JBL PartyBox Stage 320 s mikrofonima."}
  ]'::jsonb,
  hero_image_alt = 'JBL Charge 3 Bluetooth zvučnik za najam u Zagrebu',
  image_alts = ARRAY(SELECT format('JBL Charge 3 za najam, fotografija %s', i) FROM generate_series(1, coalesce(array_length(images, 1), 0)) AS i),
  updated_at = now()
WHERE slug = 'jbl-charge-3-bluetooth-zvucnik-najam';

UPDATE products SET
  description = '<p>Par JBL bežičnih mikrofona za karaoke, govore i nastupe. Rade plug and play s JBL PartyBox zvučnicima: prijemnik utaknete u zvučnik i mikrofoni su spremni, bez kabela i bez podešavanja. Iznajmite ih u Zagrebu za karaoke večer, vjenčanje, prezentaciju ili rođendan.</p>
<h3>Ključne značajke</h3>
<ul>
<li>Dva bežična mikrofona u kompletu</li>
<li>Plug and play s JBL PartyBox serijom</li>
<li>Domet do 30 metara na otvorenom, manje uz zidove i prepreke</li>
<li>Baterija oko 20 sati po punjenju, dovoljno za cijelo vjenčanje ili event</li>
</ul>
<h3>Kompatibilnost</h3>
<p>Mikrofoni standardno rade samo s JBL PartyBox zvučnicima. Za druge zvučnike, uključujući <a href="/najam/jbl-charge-3-bluetooth-zvucnik-najam">JBL Charge 3</a>, potreban je poseban prijemnik koji nije u kompletu.</p>
<h3>Složite karaoke</h3>
<p>Najbolje rade uz <a href="/najam/jbl-partybox-stage-320-prijenosni-party-zvucnik-s-kotacima">JBL PartyBox Stage 320</a> i <a href="/najam/stalak-za-zvucnik-tripod-najam">stalak za zvučnik</a>. Usporedbu svih modela pogledajte na stranici <a href="/najam/jbl-zvucnici">najam JBL zvučnika</a>.</p>',
  faq = '[
    {"question":"Koliko košta najam JBL bežičnih mikrofona?","answer":"Najam para JBL bežičnih mikrofona u Zagrebu kreće od {cijena} eura dnevno uz minimalni najam od 3 dana. Točnu cijenu za odabrane datume vidite u kalendaru na ovoj stranici."},
    {"question":"Na što se spajaju?","answer":"Mikrofoni rade plug and play s JBL PartyBox zvučnicima: prijemnik utaknete u zvučnik i mikrofoni rade."},
    {"question":"Mogu li ih spojiti na zvučnik koji nije JBL PartyBox?","answer":"Standardno rade samo s JBL PartyBox serijom. Za drugi zvučnik, uključujući JBL Charge 3, potreban je poseban prijemnik koji nije u kompletu."},
    {"question":"Koliki je domet?","answer":"Do oko 30 metara na otvorenom, a manje uz prepreke poput zidova i ljudi."},
    {"question":"Koliko traje baterija?","answer":"Oko 20 sati po punjenju, dovoljno za cijelo vjenčanje ili event."},
    {"question":"Za koje prilike su idealni?","answer":"Za karaoke, vjenčanja, prezentacije, govore i live nastupe."}
  ]'::jsonb,
  hero_image_alt = 'JBL bežični mikrofoni za karaoke za najam u Zagrebu',
  image_alts = ARRAY(SELECT format('JBL bežični mikrofoni za najam, fotografija %s', i) FROM generate_series(1, coalesce(array_length(images, 1), 0)) AS i),
  updated_at = now()
WHERE slug = 'jbl-bezicni-mikrofoni-par-najam';

-- 5) Curated related products (shown before the neighbour fallback).
DELETE FROM product_relations
WHERE type = 'connected'
  AND product_id IN (SELECT id FROM products WHERE slug IN (
    'gopro-hero-13-black-najam',
    'gopro-hero-10-black-kamera-najam',
    'jbl-partybox-stage-320-prijenosni-party-zvucnik-s-kotacima'
  ));

INSERT INTO product_relations (product_id, related_id, type, sort_order)
SELECT p.id, r.id, 'connected', v.ord
FROM (VALUES
  ('gopro-hero-13-black-najam', 'gopro-hero-10-black-kamera-najam', 0),
  ('gopro-hero-13-black-najam', 'dji-osmo-action-5-pro-najam', 1),
  ('gopro-hero-13-black-najam', 'insta360-x5-360-kamera-najam', 2),
  ('gopro-hero-13-black-najam', 'dji-power-1000-mini-stanica-napajanje-powerbank-najam', 3),
  ('gopro-hero-10-black-kamera-najam', 'gopro-hero-13-black-najam', 0),
  ('gopro-hero-10-black-kamera-najam', 'dji-osmo-action-5-pro-najam', 1),
  ('gopro-hero-10-black-kamera-najam', 'insta360-go-3-mini-kamera-najam', 2),
  ('gopro-hero-10-black-kamera-najam', 'insta360-x5-360-kamera-najam', 3),
  ('jbl-partybox-stage-320-prijenosni-party-zvucnik-s-kotacima', 'jbl-bezicni-mikrofoni-par-najam', 0),
  ('jbl-partybox-stage-320-prijenosni-party-zvucnik-s-kotacima', 'stalak-za-zvucnik-tripod-najam', 1),
  ('jbl-partybox-stage-320-prijenosni-party-zvucnik-s-kotacima', 'jbl-charge-3-bluetooth-zvucnik-najam', 2)
) AS v(src, dst, ord)
JOIN products p ON p.slug = v.src
JOIN products r ON r.slug = v.dst
ON CONFLICT (product_id, related_id, type) DO UPDATE SET sort_order = EXCLUDED.sort_order;

COMMIT;

-- Verify:
--   SELECT count(*) FROM products WHERE is_active AND seo_title NOT LIKE 'Najam%';  -- expect 0
--   SELECT count(*) FROM products WHERE is_active
--     AND (name || seo_title || seo_description) ~ '[—–]';                       -- expect 0
