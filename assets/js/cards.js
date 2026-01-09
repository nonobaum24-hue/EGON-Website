// Generate color-switch buttons for article cards and handle image swapping
document.addEventListener('DOMContentLoaded', function () {
  var cards = document.querySelectorAll('.article-card[data-images]');
  cards.forEach(function (card) {
    var list = card.getAttribute('data-images');
    if (!list) return;
    var sources = list.split(',').map(function(s){ return s.trim(); }).filter(Boolean);
    if (!sources.length) return;

    // create control container
    var controls = document.createElement('div');
    controls.className = 'color-controls';

    var mainImg = card.querySelector('img');
    // ensure mainImg exists
    if (!mainImg) return;

    // optional data-colors attribute (comma-separated hex colors) to force swatches
    var explicitColors = card.getAttribute('data-colors');
    var colorList = explicitColors ? explicitColors.split(',').map(function(s){ return s.trim(); }) : null;

    function deriveColorFromFilename(fn) {
      var name = fn.split('/').pop().toLowerCase();
      // heuristics: look for tokens
      if (/\b(red|r)\b|[-_]r\./i.test(name)) return '#e63946';
      if (/\b(blue|b)\b|[-_]b\./i.test(name)) return '#1d4ed8';
      if (/\b(yellow|y)\b|[-_]y\./i.test(name)) return '#ffb703';
      if (/\b(lightblue|lb)\b|[-_]lb\./i.test(name)) return '#60a5fa';
      if (/\b(green|g)\b|[-_]g\./i.test(name)) return '#16a34a';
      if (/black|k|bk/i.test(name)) return '#111827';
      // fallback: null
      return null;
    }

    sources.forEach(function(src, idx){
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Farbe ' + (idx+1));
      btn.dataset.src = src;

      // determine swatch color: explicit, heuristic, or fallback to thumbnail background
      var color = null;
      if (colorList && colorList[idx]) color = colorList[idx];
      else color = deriveColorFromFilename(src);

      var swatch = document.createElement('span');
      swatch.className = 'swatch';
      if (color) {
        swatch.style.backgroundColor = color;
      } else {
        // use image as background if no color available
        swatch.style.backgroundImage = 'url("' + src + '")';
        swatch.style.backgroundSize = 'cover';
        swatch.style.backgroundPosition = 'center';
      }
      btn.appendChild(swatch);

      btn.addEventListener('click', function(e){
        // prevent clicks from bubbling to wrapping link
        e.preventDefault();
        e.stopPropagation();
        // simple fade-out / swap / fade-in
        var current = mainImg.getAttribute('src') || '';
        if (current.indexOf(src) !== -1 || current.split('/').pop() === src.split('/').pop()) return;
        mainImg.style.opacity = 0;
        setTimeout(function(){
          mainImg.setAttribute('src', src);
          // mark active button
          controls.querySelectorAll('button').forEach(function(b){ b.classList.remove('active'); });
          btn.classList.add('active');
          setTimeout(function(){ mainImg.style.opacity = 1; }, 80);
        }, 120);
      });

      controls.appendChild(btn);

      // set button active if matches initial src
      var mainSrc = mainImg.getAttribute('src') || '';
      if (mainSrc.indexOf(src) !== -1 || mainSrc.split('/').pop() === src.split('/').pop()) {
        btn.classList.add('active');
      }
    });

    card.appendChild(controls);
  });
});
