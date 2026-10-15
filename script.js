const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = $('.menu-toggle');
  const nav = $('.main-nav');
  if (menuToggle) menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  $$('.main-nav a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
  }));

  const pressure = $('#pressure');
  const pressureValue = $('#pressureValue');
  if (pressure && pressureValue) pressure.addEventListener('input', () => { pressureValue.textContent = pressure.value + '/10'; });

  const feelingMap = {
    guilt: 'rasa bersalah',
    anxious: 'cemas atau takut dengan respon orang',
    drained: 'capek atau terkuras',
    angry: 'kesal atau marah',
    confused: 'bingung dengan keinginan sendiri',
    okay: 'ragu walaupun secara umum baik-baik saja'
  };

  function makeAdvice(data) {
    let score = 0;
    if (data.desire === 'no') score += 3;
    if (data.desire === 'delay') score += 2;
    if (data.desire === 'yes-limited') score += 1;
    if (['guilt','anxious','drained','confused'].includes(data.feeling)) score += 2;
    if (data.pressure >= 7) score += 2;
    if (data.repeatPattern) score += 2;
    if (data.situation === 'privacy' || data.situation === 'pressure') score += 1;

    let title, subtitle, steps;
    if (score >= 8) {
      title = 'Kamu kelihatannya sedang butuh batas yang lebih jelas.';
      subtitle = 'Sinyalnya cukup kuat: ada jarak antara apa yang kamu mau dan apa yang kamu merasa harus lakukan.';
      steps = [
        ['PAUSE', 'Jangan jawab di bawah tekanan. Ambil waktu beberapa menit atau beberapa jam bila aman.'],
        ['TENTUKAN', 'Pilih satu kebutuhan yang paling penting sekarang: waktu, energi, privasi, atau rasa aman.'],
        ['UCAPKAN', 'Gunakan satu kalimat pendek. Tidak perlu memberi alasan panjang.'],
        ['DUKUNGAN', 'Kalau pola ini sering terjadi dan mengganggu aktivitasmu, cerita ke orang dewasa tepercaya atau profesional.']
      ];
    } else if (score >= 5) {
      title = 'Ada sinyal people pleasing yang layak kamu perhatikan.';
      subtitle = 'Kamu tidak harus langsung punya jawaban sempurna. Fokus dulu membedakan keinginanmu dari rasa takut mengecewakan orang.';
      steps = [
        ['JEDA', 'Coba tunda jawaban: “Aku pikir dulu, ya.”'],
        ['CEK', 'Tanya diri: “Kalau tidak takut dinilai, aku sebenarnya mau apa?”'],
        ['BATAS', 'Tawarkan kemampuanmu secukupnya, bukan seluruh tenagamu.'],
        ['ULANGI', 'Boundary yang sehat kadang perlu diucapkan lebih dari sekali.']
      ];
    } else {
      title = 'Kamu terlihat cukup sadar dengan kebutuhanmu.';
      subtitle = 'Tetap jaga kebiasaan mengecek kapasitas sebelum bilang iya. Keraguan juga boleh jadi alasan untuk berhenti sebentar.';
      steps = [
        ['CEK KAPASITAS', 'Pastikan kamu punya waktu dan energi untuk kesanggupanmu.'],
        ['JELAS', 'Sebutkan apa yang bisa kamu lakukan dan apa yang tidak.'],
        ['KONSISTEN', 'Ikuti batas yang sudah kamu tetapkan.'],
        ['EVALUASI', 'Setelah situasi selesai, lihat apakah keputusan tadi terasa sesuai dengan dirimu.']
      ];
    }
    const pct = Math.min(100, Math.round((score / 12) * 100));
    return {title, subtitle, steps, pct, feeling: feelingMap[data.feeling] || 'perasaan tertentu'};
  }

  const checkupForm = $('#checkupForm');
  if (checkupForm) checkupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      situation: $('#situation').value,
      feeling: $('#feeling').value,
      desire: $('#desire').value,
      pressure: Number($('#pressure').value),
      repeatPattern: $('#repeatPattern').checked
    };
    const result = makeAdvice(data);
    $('#checkupResult').innerHTML = `
      <div class="result-content">
        <span class="section-kicker" style="color:#8cf2dc">REFLEKSI SEKARANG</span>
        <h3 class="result-title">${result.title}</h3>
        <span class="feeling-pill">Kamu sedang merasakan: ${result.feeling}</span>
        <p class="result-sub">${result.subtitle}</p>
        <div class="result-meter"><i style="width:${result.pct}%"></i></div>
        <div class="result-score">Sinyal yang terdeteksi dari jawabanmu: ${result.pct}%</div>
        <div class="action-list">
          ${result.steps.map((s,i)=>`<div class="action-step"><b>${i+1}. ${s[0]}</b><span>${s[1]}</span></div>`).join('')}
        </div>
      </div>
    `;
    $('#checkupResult').scrollIntoView({behavior:'smooth', block:'center'});
  });

  const peopleQuestions = [
    {
      q:'Aku sering bilang iya karena takut orang kecewa.',
      a:['Jarang','Kadang','Sering','Hampir selalu']
    },
    {
      q:'Setelah membantu orang, aku malah merasa capek atau kesal.',
      a:['Jarang','Kadang','Sering','Hampir selalu']
    },
    {
      q:'Aku sulit menyampaikan pendapat yang berbeda.',
      a:['Jarang','Kadang','Sering','Hampir selalu']
    },
    {
      q:'Aku merasa perlu disukai agar merasa “cukup baik”.',
      a:['Jarang','Kadang','Sering','Hampir selalu']
    },
    {
      q:'Aku menunda kebutuhanku sendiri demi membantu orang lain.',
      a:['Jarang','Kadang','Sering','Hampir selalu']
    },
    {
      q:'Aku merasa bersalah saat membuat keputusan untuk diriku sendiri.',
      a:['Jarang','Kadang','Sering','Hampir selalu']
    }
  ];

  const boundaryQuestions = [
    {
      q:'Teman meminta bantuan saat kamu sedang menyelesaikan deadline. Kamu…',
      a:['Langsung bilang iya','Menunda/menolak dengan jelas','Menghilang tanpa kabar','Menyalahkan teman']
    },
    {
      q:'Seseorang meminta cerita pribadi yang tidak ingin kamu bagi. Kamu…',
      a:['Tetap cerita agar tidak canggung','Mengalihkan topik dengan keras','Bilang bahwa kamu belum nyaman membahasnya','Marah dan menghina']
    },
    {
      q:'Kamu butuh istirahat tetapi diajak pergi. Kamu…',
      a:['Menolak dengan sopan','Ikut sambil terpaksa','Pura-pura sakit','Menyuruh mereka jangan ganggu']
    },
    {
      q:'Orang lain terus memaksa setelah kamu bilang tidak. Kamu…',
      a:['Menyerah saja','Mengulangi batas dengan tegas dan mencari dukungan bila perlu','Membalas memaksa','Tidak berkata apa-apa']
    },
    {
      q:'Kamu berubah pikiran setelah terlanjur bilang iya. Kamu…',
      a:['Tetap melakukan walau sangat berat','Mengoreksi keputusan secepatnya dengan jujur','Menyalahkan orang lain','Memutus kontak']
    }
  ];

  function renderQuiz(list, container, prefix) {
    list.forEach((item, qi) => {
      const wrap = document.createElement('div');
      wrap.className='quiz-q';
      wrap.innerHTML = `<b>${qi+1}. ${item.q}</b>${item.a.map((ans,ai)=>`
        <label><input type="radio" name="${prefix}${qi}" value="${ai}" /> <span>${ans}</span></label>
      `).join('')}`;
      container.appendChild(wrap);
    });
  }

  const quizPeople = $('#quizPeople');
  const quizBoundary = $('#quizBoundary');
  if (quizPeople) renderQuiz(peopleQuestions, quizPeople, 'p');
  if (quizBoundary) renderQuiz(boundaryQuestions, quizBoundary, 'b');

  $$('.quiz-submit').forEach(btn => btn.addEventListener('click', () => {
    const type = btn.dataset.quiz;
    const isPeople = type === 'people';
    const list = isPeople ? peopleQuestions : boundaryQuestions;
    let points = 0, answered = 0;
    list.forEach((item, qi) => {
      const selected = document.querySelector(`input[name="${isPeople ? 'p':'b'}${qi}"]:checked`);
      if (!selected) return;
      answered++;
      const v = Number(selected.value);
      if (isPeople) points += v; else points += ([1,2,0,1,1][qi] === v ? 1 : 0);
    });
    const out = $(`#quiz${isPeople ? 'People':'Boundary'}Result`);
    if (answered < list.length) {
      out.textContent = `Masih ada ${list.length - answered} pertanyaan yang belum dijawab.`;
      out.classList.add('show');
      return;
    }

    if (isPeople) {
      const ratio = points / (list.length*3);
      let msg = ratio >= .68
        ? 'Ada cukup banyak sinyal people pleasing. Coba mulai dari latihan jeda sebelum mengatakan iya.'
        : ratio >= .4
        ? 'Ada beberapa sinyal yang muncul. Perhatikan situasi mana yang paling sering membuatmu sulit berkata tidak.'
        : 'Sinyalnya relatif rendah dari jawabanmu. Tetap jaga kemampuan berkata iya maupun tidak sesuai kapasitas.';
      out.innerHTML = `<b>Hasil: ${Math.round(ratio*100)}%</b><br>${msg}<br><small>Ini hanya alat refleksi, bukan diagnosis.</small>`;
    } else {
      const pct = Math.round((points/list.length)*100);
      let msg = pct >= 80 ? 'Kamu cukup konsisten memilih respons yang asertif.'
        : pct >= 60 ? 'Dasarnya sudah ada. Perkuat kalimat yang jelas tanpa menyerang.'
        : 'Coba ulangi konsep: boundary = menjelaskan batas diri, bukan mengontrol orang lain.';
      out.innerHTML = `<b>Skor boundary: ${pct}%</b><br>${msg}`;
    }
    out.classList.add('show');
  }));
});
