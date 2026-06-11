const CACHE_NAME = 'v0.0.2';
const ASSETS = [
  './',
  'index.html',
  'data.json',
  'style.css',
  'manifest.json',

  'js/CustomEase.min.js',
  'js/gsap.min.js',
  'js/particles.min.js',

  'audio/lagu1.mp3',
  'logo/okut.png',
  'logo/twh.png',
  'logo/qr.png',

  'foto/vino_apriyanto.jpg','foto/vino_apriyanto2.jpg',
'foto/bayu_verelino.jpg','foto/bayu_verelino2.jpg',
'foto/alip_arifin.jpg','foto/alip_arifin2.jpg',
'foto/anggun_septiana_sari.jpg','foto/anggun_septiana_sari2.jpg',
'foto/andreas_ferdi.jpg','foto/andreas_ferdi2.jpg',
'foto/asyfa_riqqah_inayah.jpg','foto/asyfa_riqqah_inayah2.jpg',
'foto/aura_desfianti.jpg','foto/aura_desfianti2.jpg',
'foto/citra_regina_putri.jpg','foto/citra_regina_putri2.jpg',
'foto/devita_meliana.jpg','foto/devita_meliana2.jpg',
'foto/endo_azam_mudric.jpg','foto/endo_azam_mudric2.jpg',
'foto/enjel_egi_nayla_irsyada.jpg','foto/enjel_egi_nayla_irsyada2.jpg',
'foto/ferdiansah.jpg','foto/ferdiansah2.jpg',
'foto/indra_irawan.jpg','foto/indra_irawan2.jpg',
'foto/ika_maura_jenita.jpg','foto/ika_maura_jenita2.jpg',
'foto/inez_zefana.jpg','foto/inez_zefana2.jpg',
'foto/khalisyah_ramadhani.jpg','foto/khalisyah_ramadhani2.jpg',
'foto/kevin_saputra.jpg','foto/kevin_saputra2.jpg',
'foto/mawardi.jpg','foto/mawardi2.jpg',
'foto/mutiara_salsabila.jpg','foto/mutiara_salsabila2.jpg',
'foto/nismara_rahma_wati.jpg','foto/nismara_rahma_wati2.jpg',
'foto/novelin_cahya_putri.jpg','foto/novelin_cahya_putri2.jpg',
'foto/nadin_saputri.jpg','foto/nadin_saputri2.jpg',
'foto/nada_saputra.jpg','foto/nada_saputra2.jpg',
'foto/revalno_alfandi.jpg','foto/revalno_alfandi2.jpg',
'foto/ria_ayu_anjani.jpg','foto/ria_ayu_anjani2.jpg',
'foto/ridha_candra_kirana.jpg','foto/ridha_candra_kirana2.jpg',
'foto/riny_juwita_bella.jpg','foto/riny_juwita_bella2.jpg',
'foto/suryandi.jpg','foto/suryandi2.jpg',
'foto/vina_apriani.jpg','foto/vina_apriani2.jpg',
'foto/ilyas_maulana_abdulloh.jpg','foto/ilyas_maulana_abdulloh2.jpg',
'foto/azriel_faris_noufal.jpg','foto/azriel_faris_noufal2.jpg',
 
   'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap'
];

// Menginstal Service Worker dan menyimpan aset dasar ke memori HP (Bisa dibuka offline)
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.all(
        ASSETS.map(url => {
          return cache.add(url).catch(err => {
            console.error('File ini gagal dimasukkan ke Cache PWA:', url, err);
          });
        })
      );
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});