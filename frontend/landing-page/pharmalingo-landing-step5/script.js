document.getElementById('year').textContent=new Date().getFullYear();const menu=document.querySelector('.menu');const nav=document.querySelector('.header nav');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));

// Static sample-data demo: no API calls, no patient data, no live translation.
const samples = {
  food: {es:"Tome este medicamento con alimentos dos veces al día.",fr:"Prenez ce médicament avec de la nourriture deux fois par jour.",ar:"تناول هذا الدواء مع الطعام مرتين يوميًا.",ru:"Принимайте это лекарство с пищей два раза в день."},
  refill: {es:"Su receta está lista para recoger.",fr:"Votre ordonnance est prête à être récupérée.",ar:"وصفتك الطبية جاهزة للاستلام.",ru:"Ваш рецепт готов к получению."},
  water: {es:"Beba mucha agua mientras toma este medicamento.",fr:"Buvez beaucoup d’eau pendant que vous prenez ce médicament.",ar:"اشرب الكثير من الماء أثناء تناول هذا الدواء.",ru:"Пейте много воды во время приема этого лекарства."}
};
const phraseSelect = document.getElementById("demo-phrase");
const languageSelect = document.getElementById("demo-language");
const demoOutput = document.getElementById("demo-output");

function updateSample() {
  const phrase = phraseSelect.value, language = languageSelect.value;
  demoOutput.textContent = samples[phrase][language];
  demoOutput.dir = language === "ar" ? "rtl" : "ltr";
  const foot = document.createElement("div");
  foot.className = "translation-foot";
  foot.textContent = "Illustrative sample translation · Verify before use";
  demoOutput.appendChild(foot);
}

phraseSelect.addEventListener("change", updateSample);
languageSelect.addEventListener("change", updateSample);
