import { faker } from "@faker-js/faker/locale/id_ID";
import { TargetStatus } from "../../generated/prisma/client";

const MENU_DATA = [
  {
    nama_menu: "Smoothie Pisang Protein",
    deskripsi:
      "Smoothie kaya protein dari pisang matang, susu full cream, selai kacang, dan oat. Cocok untuk sarapan tinggi kalori yang menyehatkan dan mengenyangkan bagi yang ingin menambah berat badan.",
    kalori: 420,
    target_status: "Kurus" as TargetStatus,
    waktu_memasak: 10,
    gambar:
      "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&auto=format&fit=crop&q=80",
  },
  {
    nama_menu: "Nasi Merah Ayam Panggang",
    deskripsi:
      "Nasi merah bergizi dipadukan dengan ayam panggang bumbu rempah, dilengkapi sayuran kukus dan saus tomat segar. Sumber karbohidrat kompleks dan protein tinggi untuk mendukung massa otot.",
    kalori: 520,
    target_status: "Kurus" as TargetStatus,
    waktu_memasak: 40,
    gambar:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop&q=80",
  },
  {
    nama_menu: "Pasta Telur Keju",
    deskripsi:
      "Pasta al dente dengan saus krim telur dan keju parmesan. Hidangan lezat berkalori tinggi yang memberikan energi maksimal untuk aktivitas harian dan mendukung peningkatan berat badan secara sehat.",
    kalori: 580,
    target_status: "Kurus" as TargetStatus,
    waktu_memasak: 25,
    gambar:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&auto=format&fit=crop&q=80",
  },
  {
    nama_menu: "Granola Bowl Buah Segar",
    deskripsi:
      "Granola renyah dengan yogurt Greek, madu, dan potongan buah segar seperti stroberi, pisang, dan blueberry. Sarapan padat nutrisi yang memberikan energi tahan lama sepanjang hari.",
    kalori: 380,
    target_status: "Kurus" as TargetStatus,
    waktu_memasak: 10,
    gambar:
      "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=800&auto=format&fit=crop&q=80",
  },
  {
    nama_menu: "Omelet Sayur Keju",
    deskripsi:
      "Telur kocok dengan isian paprika, bayam, bawang bombay, dan keju cheddar leleh. Sarapan tinggi protein yang mudah dibuat dan kaya nutrisi esensial untuk pertumbuhan otot.",
    kalori: 340,
    target_status: "Kurus" as TargetStatus,
    waktu_memasak: 15,
    gambar:
      "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800&auto=format&fit=crop&q=80",
  },
  // Normal (5 menu)
  {
    nama_menu: "Buddha Bowl Quinoa",
    deskripsi:
      "Bowl seimbang berisi quinoa, edamame, alpukat, wortel parut, dan dressing tahini lemon. Menu sehat dengan keseimbangan karbohidrat, protein nabati, dan lemak baik yang sempurna.",
    kalori: 380,
    target_status: "Normal" as TargetStatus,
    waktu_memasak: 20,
    gambar:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
  },
  {
    nama_menu: "Salad Brokoli Segar",
    deskripsi:
      "Brokoli segar kukus dengan topping kacang almond, cranberry kering, bawang merah, dan dressing yogurt lemon. Hidangan ringan kaya serat dan vitamin yang mendukung kesehatan pencernaan.",
    kalori: 230,
    target_status: "Normal" as TargetStatus,
    waktu_memasak: 20,
    gambar:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80",
  },
  {
    nama_menu: "Salmon Teriyaki Kukus",
    deskripsi:
      "Fillet salmon segar dikukus dengan saus teriyaki rendah sodium, disajikan dengan edamame dan nasi merah. Hidangan tinggi omega-3 dan protein berkualitas untuk menjaga kesehatan jantung.",
    kalori: 420,
    target_status: "Normal" as TargetStatus,
    waktu_memasak: 30,
    gambar:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop&q=80",
  },
  {
    nama_menu: "Tumis Tofu Sayuran",
    deskripsi:
      "Tofu organik ditumis dengan brokoli, paprika merah dan hijau, wortel, dan saus tiram rendah sodium. Menu vegetarian berprotein tinggi yang cocok untuk pola makan sehat sehari-hari.",
    kalori: 280,
    target_status: "Normal" as TargetStatus,
    waktu_memasak: 20,
    gambar:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop&q=80",
  },
  {
    nama_menu: "Wrap Ayam Avokad",
    deskripsi:
      "Tortilla gandum utuh diisi ayam panggang iris tipis, alpukat, selada, tomat cherry, dan saus Greek yogurt. Makan siang praktis yang seimbang antara protein, lemak sehat, dan karbohidrat.",
    kalori: 350,
    target_status: "Normal" as TargetStatus,
    waktu_memasak: 15,
    gambar:
      "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&auto=format&fit=crop&q=80",
  },
  // Berlebih (5 menu)
  {
    nama_menu: "Sup Ayam Sayuran Rendah Lemak",
    deskripsi:
      "Sup bening ayam kampung dengan wortel, kentang, seledri, dan bawang prei. Hidangan hangat rendah kalori yang mengenyangkan, cocok untuk program defisit kalori ringan tanpa mengorbankan nutrisi.",
    kalori: 180,
    target_status: "Berlebih" as TargetStatus,
    waktu_memasak: 35,
    gambar:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=80",
  },
  {
    nama_menu: "Salad Tuna Timun",
    deskripsi:
      "Tuna kalengan rendah lemak dengan irisan timun, tomat, bawang merah, dan dressing lemon zaitun. Makan siang ringan tinggi protein yang membantu menjaga kenyang lebih lama dengan kalori minimal.",
    kalori: 160,
    target_status: "Berlebih" as TargetStatus,
    waktu_memasak: 10,
    gambar:
      "https://images.unsplash.com/photo-1529059997568-3d847b1154f0?w=800&auto=format&fit=crop&q=80",
  },
  {
    nama_menu: "Dada Ayam Panggang Herbal",
    deskripsi:
      "Dada ayam tanpa kulit dipanggang dengan bumbu rosemary, thyme, bawang putih, dan perasan lemon. Disajikan dengan bayam tumis dan tomat panggang. Tinggi protein, sangat rendah lemak.",
    kalori: 220,
    target_status: "Berlebih" as TargetStatus,
    waktu_memasak: 30,
    gambar:
      "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&auto=format&fit=crop&q=80",
  },
  {
    nama_menu: "Oatmeal Buah Rendah Gula",
    deskripsi:
      "Oatmeal tanpa gula tambahan dimasak dengan susu almond, dilengkapi potongan apel, kayu manis, dan biji chia. Sarapan serat tinggi yang membantu mengontrol nafsu makan sepanjang hari.",
    kalori: 190,
    target_status: "Berlebih" as TargetStatus,
    waktu_memasak: 10,
    gambar:
      "https://images.unsplash.com/photo-1571748982800-fa51082c2224?w=800&auto=format&fit=crop&q=80",
  },
  {
    nama_menu: "Gado-Gado Lontong Diet",
    deskripsi:
      "Gado-gado segar dengan lontong, tahu, tempe, sayuran rebus, dan saus kacang rendah lemak. Versi diet dari hidangan favorit Indonesia yang tetap lezat namun terkontrol kandungan kalorinya.",
    kalori: 250,
    target_status: "Berlebih" as TargetStatus,
    waktu_memasak: 25,
    gambar:
      "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&auto=format&fit=crop&q=80",
  },
  // Obesitas (5 menu)
  {
    nama_menu: "Sup Bening Bayam Tahu",
    deskripsi:
      "Sup bening dengan bayam organik, tahu sutra, wortel, dan kaldu ayam tanpa lemak. Hidangan sangat rendah kalori namun kaya mineral, vitamin, dan protein nabati untuk mendukung penurunan berat badan.",
    kalori: 90,
    target_status: "Obesitas" as TargetStatus,
    waktu_memasak: 20,
    gambar:
      "https://images.unsplash.com/photo-1584714268709-c3dd9c92b378?w=800&auto=format&fit=crop&q=80",
  },
  {
    nama_menu: "Salad Kangkung Rebus",
    deskripsi:
      "Kangkung rebus dengan bumbu kacang tanah sangat minimal, cabai rawit, dan perasan jeruk nipis. Menu detox alami kaya zat besi dan serat yang membantu membersihkan sistem pencernaan.",
    kalori: 80,
    target_status: "Obesitas" as TargetStatus,
    waktu_memasak: 15,
    gambar:
      "https://images.unsplash.com/photo-1543362906-acfc16c67564?w=800&auto=format&fit=crop&q=80",
  },
  {
    nama_menu: "Ikan Kukus Jahe Lemon",
    deskripsi:
      "Ikan nila segar dikukus dengan irisan jahe, serai, dan perasan lemon. Disiram sedikit kecap rendah sodium. Menu rendah kalori tinggi protein omega-3 yang membantu proses pembakaran lemak tubuh.",
    kalori: 150,
    target_status: "Obesitas" as TargetStatus,
    waktu_memasak: 25,
    gambar:
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80",
  },
  {
    nama_menu: "Smoothie Hijau Detox",
    deskripsi:
      "Blend bayam, mentimun, apel hijau, jahe segar, dan air kelapa muda tanpa gula. Minuman detox segar kaya klorofil dan antioksidan yang membantu metabolisme dan membuang racun dari tubuh.",
    kalori: 95,
    target_status: "Obesitas" as TargetStatus,
    waktu_memasak: 5,
    gambar:
      "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=800&auto=format&fit=crop&q=80",
  },
  {
    nama_menu: "Pepes Tahu Jamur",
    deskripsi:
      "Tahu dan jamur shiitake dibumbui kunyit, kencur, kemiri, dan daun kemangi, lalu dibungkus daun pisang dan dikukus. Menu tradisional Indonesia yang sangat rendah kalori namun kaya cita rasa dan nutrisi.",
    kalori: 120,
    target_status: "Obesitas" as TargetStatus,
    waktu_memasak: 40,
    gambar:
      "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&auto=format&fit=crop&q=80",
  },
];

export function generateMenus() {
  return MENU_DATA.map((menu, index) => {
    const slug =
      menu.nama_menu
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "") + `-${Date.now() + index}`;

    return {
      ...menu,
      slug,
      dibaca: faker.number.int({ min: 0, max: 200 }),
    };
  });
}
