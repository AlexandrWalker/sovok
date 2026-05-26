document.addEventListener('DOMContentLoaded', () => {

  const checkEditMode = document.querySelector('.bx-panel-toggle-on') ?? null;

  /**
   * Подключение ScrollTrigger
   * Подключение SplitText
   */
  gsap.registerPlugin(ScrollTrigger, SplitText);

  /**
   * Инициализация Lenis
   */
  // const lenis = new Lenis({
  //   anchors: {
  //     offset: -60,
  //   },
  // });

  // gsap.ticker.add((time) => {
  //   lenis.raf(time * 1000);
  // });

  // /**
  //  * Прелоадер
  //  */
  // (function () {
  //   // =========================
  //   // ГЛОБАЛЬНАЯ НАСТРОЙКА
  //   // =========================
  //   window.PRELOADER_MODE = window.PRELOADER_MODE || {
  //     // 'overlay'     -> как сейчас (белое лого + красная заливка)
  //     // 'singleLogo' -> без наслоения (просто одно лого)
  //     mode: 'overlay',

  //     // Пути к изображениям
  //     assets: {
  //       // можно поменять на разные файлы, если у вас реально разные варианты
  //       logoWhiteSrc: './images/logo/logo-bez-podpisi.svg',
  //       // для совместимости с вашим overlay-режимом
  //       logoCyanSrc: './images/logo/logo-bez-podpisi-2.svg'
  //     },

  //     // Размеры (можно под вашу верстку)
  //     logoWidth: 71,
  //     logoHeight: 70,

  //     // safety timeout
  //     safetyTimeoutMs: 8000,

  //     // delay перед скрытием после 100% (только overlay)
  //     overlayHideDelayMs: 600
  //   };

  //   const config = window.PRELOADER_MODE;
  //   const mode = config.mode;

  //   const preloaderEl = document.querySelector('.preloader');
  //   if (!preloaderEl) return;

  //   document.body.classList.add('no-scroll');

  //   const safetyTimer = setTimeout(function () {
  //     const preloader = document.querySelector('.preloader');
  //     if (preloader && preloader.style.display !== 'none') {
  //       preloader.style.display = 'none';
  //       restoreScroll();
  //     }
  //   }, config.safetyTimeoutMs);

  //   function restoreScroll() {
  //     document.body.classList.remove('no-scroll');
  //   }

  //   function clearSafety() {
  //     try { clearTimeout(safetyTimer); } catch (e) { }
  //   }

  //   const canvas = document.getElementById('logo-canvas');
  //   if (!canvas) return;
  //   const ctx = canvas.getContext('2d');

  //   // =========================
  //   // Hide (общая функция)
  //   // =========================
  //   function hidePreloader() {
  //     gsap.set(canvas, { opacity: 0 });

  //     gsap.to(preloaderEl, {
  //       scaleY: 0,
  //       duration: 0.7,
  //       ease: 'power2.inOut',
  //       transformOrigin: 'top center',
  //       onComplete: function () {
  //         preloaderEl.style.display = 'none';
  //         restoreScroll();
  //         clearSafety();
  //       }
  //     });

  //     gsap.to(canvas, {
  //       scaleY: 2,
  //       duration: 0.7,
  //       ease: 'power2.inOut',
  //       transformOrigin: 'bottom center'
  //     });
  //   }

  //   // =========================
  //   // canvas init
  //   // =========================
  //   function initCanvas() {
  //     const logoWidth = config.logoWidth;
  //     const logoHeight = config.logoHeight;

  //     const dpr = window.devicePixelRatio || 1;

  //     canvas.width = logoWidth * dpr;
  //     canvas.height = logoHeight * dpr;

  //     // не накапливаем scale
  //     if (ctx.setTransform) ctx.setTransform(1, 0, 0, 1, 0, 0);
  //     ctx.scale(dpr, dpr);

  //     return { logoWidth, logoHeight };
  //   }

  //   // =========================
  //   // РЕЖИМ 1: overlay (как было)
  //   // =========================
  //   function startOverlayPreloader() {
  //     const { logoWidth, logoHeight } = initCanvas();
  //     let fillHeight = 0;

  //     const logoWhite = new Image();
  //     const logoCyan = new Image();
  //     let loadedImages = 0;

  //     function draw() {
  //       ctx.clearRect(0, 0, logoWidth, logoHeight);

  //       ctx.globalCompositeOperation = 'source-over';
  //       ctx.drawImage(logoWhite, 0, 0, logoWidth, logoHeight);

  //       ctx.globalCompositeOperation = 'source-atop';
  //       ctx.fillStyle = '#FAF4ED';

  //       var rectY = logoHeight - fillHeight;
  //       ctx.fillRect(0, rectY, logoWidth, fillHeight);

  //       ctx.globalCompositeOperation = 'source-over';
  //     }

  //     function onImageLoaded() {
  //       loadedImages++;
  //       if (loadedImages === 2) start();
  //     }

  //     logoWhite.onload = onImageLoaded;
  //     logoCyan.onload = onImageLoaded;
  //     logoWhite.onerror = onImageLoaded;
  //     logoCyan.onerror = onImageLoaded;

  //     logoWhite.src = config.assets.logoWhiteSrc;
  //     logoCyan.src = config.assets.logoCyanSrc;

  //     function start() {
  //       draw();

  //       var progress = { val: 0 };

  //       gsap.to(progress, {
  //         val: 30,
  //         duration: 0.4,
  //         ease: 'power2.out',
  //         onUpdate: function () {
  //           fillHeight = (progress.val / 100) * logoHeight;
  //           draw();
  //         }
  //       });

  //       gsap.to(progress, {
  //         val: 85,
  //         duration: 2.5,
  //         ease: 'power1.out',
  //         delay: 0.4,
  //         onUpdate: function () {
  //           fillHeight = (progress.val / 100) * logoHeight;
  //           draw();
  //         }
  //       });

  //       window.addEventListener('load', function onWindowLoad() {
  //         window.removeEventListener('load', onWindowLoad);

  //         gsap.killTweensOf(progress);

  //         gsap.to(progress, {
  //           val: 100,
  //           duration: 0.4,
  //           ease: 'power2.out',
  //           onUpdate: function () {
  //             fillHeight = (progress.val / 100) * logoHeight;
  //             draw();
  //           },
  //           onComplete: function () {
  //             setTimeout(hidePreloader, config.overlayHideDelayMs);
  //           }
  //         });
  //       });
  //     }
  //   }

  //   // =========================
  //   // РЕЖИМ 2: singleLogo (без наслоения)
  //   // =========================
  //   function startSingleLogoPreloader() {
  //     const { logoWidth, logoHeight } = initCanvas();

  //     const logo = new Image();
  //     logo.onload = function () {
  //       // Просто рисуем одно лого без заливки
  //       ctx.clearRect(0, 0, logoWidth, logoHeight);
  //       ctx.globalCompositeOperation = 'source-over';
  //       ctx.drawImage(logo, 0, 0, logoWidth, logoHeight);
  //       ctx.globalCompositeOperation = 'source-over';

  //       // лёгкая анимация (опционально)
  //       gsap.fromTo(canvas, { opacity: 0.2, scaleY: 0.98 }, { opacity: 1, scaleY: 1, duration: 0.4, ease: 'power2.out' });

  //       window.addEventListener('load', function onWindowLoad() {
  //         window.removeEventListener('load', onWindowLoad);
  //         hidePreloader();
  //       });
  //     };

  //     logo.onerror = function () {
  //       // fallback: если не загрузилось - просто скрываем по load
  //       window.addEventListener('load', function onWindowLoad() {
  //         window.removeEventListener('load', onWindowLoad);
  //         hidePreloader();
  //       });
  //     };

  //     // берём путь из js-конфига
  //     logo.src = config.assets.logoWhiteSrc;
  //   }

  //   // =========================
  //   // START
  //   // =========================
  //   if (mode === 'singleLogo') {
  //     startSingleLogoPreloader();
  //   } else {
  //     startOverlayPreloader();
  //   }
  // })();

  // Блокируем браузерное восстановление скролла до того как браузер успеет прыгнуть к якорю
  if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
  }

  /**
   * Прелоадер + якорь + инициализация Lenis
   */
  (function () {

    // Длительность анимации закрытия мобильного меню в миллисекундах
    const MENU_CLOSE_DURATION = 400;

    // Конфигурация прелоадера
    const PRELOADER_CONFIG = {
      mode: 'overlay',
      assets: {
        logoWhiteSrc: './images/logo/logo-bez-podpisi.svg',
        logoCyanSrc: './images/logo/logo-bez-podpisi-2.svg',
      },
      logoWidth: 71,
      logoHeight: 70,
      safetyTimeoutMs: 8000,
      overlayHideDelayMs: 600,
    };

    // Инициализация Lenis и привязка к GSAP ticker
    const lenis = new Lenis();
    window.lenis = lenis;

    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Плавный скролл к целевому элементу через Lenis
    function scrollToTarget(target) {
      lenis.scrollTo(target, {
        offset: -60,
        duration: 1.5,
      });
    }

    // Возвращает промис который резолвится когда прелоадер скрыт
    // Используем MutationObserver чтобы отследить удаление класса preloader--active
    function waitForPreloader() {
      return new Promise((resolve) => {
        if (!document.documentElement.classList.contains('preloader--active')) {
          resolve();
          return;
        }

        const observer = new MutationObserver(() => {
          if (!document.documentElement.classList.contains('preloader--active')) {
            observer.disconnect();
            resolve();
          }
        });

        observer.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['class'],
        });
      });
    }

    // Обработчик кликов по якорным ссылкам
    // capture: true позволяет перехватить событие раньше stopPropagation в меню
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;

      // Не мешаем Fancybox - пропускаем ссылки с data-fancybox
      if (link.hasAttribute('data-fancybox')) return;

      const href = link.getAttribute('href');
      if (!href || !href.includes('#')) return;

      const hash = href.split('#')[1];
      if (!hash) return;

      // Ищем элемент на текущей странице
      // Если его нет - браузер сам перейдёт на нужную страницу
      // После загрузки сработает обработчик load ниже
      const target = document.getElementById(hash);
      if (!target) return;

      e.preventDefault();
      history.pushState(null, null, `#${hash}`);

      const isMenuOpen = document.documentElement.classList.contains('menu--open');

      if (isMenuOpen) {
        // Останавливаем Lenis пока меню закрывается анимацией
        lenis.stop();
        setTimeout(() => {
          lenis.start();
          scrollToTarget(target);
        }, MENU_CLOSE_DURATION);
      } else {
        scrollToTarget(target);
      }

    }, true);

    // При загрузке страницы с якорем в URL
    // Сначала сбрасываем позицию чтобы браузер не прыгал сам
    // Потом ждём конца прелоадера и плавно скроллим
    window.addEventListener('load', () => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;

      const target = document.getElementById(hash);
      if (!target) return;

      window.scrollTo(0, 0);

      waitForPreloader().then(() => scrollToTarget(target));
    });

    // Инициализация прелоадера
    const preloaderEl = document.querySelector('.preloader');
    if (!preloaderEl) return;

    // Блокируем скролл страницы пока прелоадер активен
    document.body.classList.add('no-scroll');
    document.documentElement.classList.add('preloader--active');

    // Страховочный таймер на случай если что-то пошло не так
    // Принудительно скрывает прелоадер через safetyTimeoutMs миллисекунд
    const safetyTimer = setTimeout(() => {
      if (preloaderEl.style.display !== 'none') {
        preloaderEl.style.display = 'none';
        restoreScroll();
      }
    }, PRELOADER_CONFIG.safetyTimeoutMs);

    function restoreScroll() {
      document.body.classList.remove('no-scroll');
    }

    function clearSafety() {
      try { clearTimeout(safetyTimer); } catch (e) { }
    }

    const canvas = document.getElementById('logo-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Настраиваем canvas с учётом плотности пикселей экрана
    function initCanvas() {
      const { logoWidth, logoHeight } = PRELOADER_CONFIG;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = logoWidth * dpr;
      canvas.height = logoHeight * dpr;

      if (ctx.setTransform) ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      return { logoWidth, logoHeight };
    }

    // Скрываем прелоадер с анимацией схлопывания
    // После завершения анимации удаляем класс preloader--active с html
    function hidePreloader() {
      gsap.set(canvas, { opacity: 0 });

      gsap.to(preloaderEl, {
        scaleY: 0,
        duration: 0.7,
        ease: 'power2.inOut',
        transformOrigin: 'top center',
        onComplete() {
          preloaderEl.style.display = 'none';
          restoreScroll();
          clearSafety();
          document.documentElement.classList.remove('preloader--active');
        },
      });

      gsap.to(canvas, {
        scaleY: 2,
        duration: 0.7,
        ease: 'power2.inOut',
        transformOrigin: 'bottom center',
      });
    }

    // Режим overlay - два логотипа с анимацией заливки снизу вверх
    function startOverlayPreloader() {
      const { logoWidth, logoHeight } = initCanvas();
      let fillHeight = 0;

      const logoWhite = new Image();
      const logoCyan = new Image();
      let loadedCount = 0;

      function draw() {
        ctx.clearRect(0, 0, logoWidth, logoHeight);
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(logoWhite, 0, 0, logoWidth, logoHeight);
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, logoHeight - fillHeight, logoWidth, fillHeight);
        ctx.globalCompositeOperation = 'source-over';
      }

      function onImageLoaded() {
        loadedCount++;
        if (loadedCount === 2) startAnimation();
      }

      logoWhite.onload = logoWhite.onerror = onImageLoaded;
      logoCyan.onload = logoCyan.onerror = onImageLoaded;
      logoWhite.src = PRELOADER_CONFIG.assets.logoWhiteSrc;
      logoCyan.src = PRELOADER_CONFIG.assets.logoCyanSrc;

      function startAnimation() {
        draw();

        const progress = { val: 0 };

        // Быстрый старт до 30%
        gsap.to(progress, {
          val: 30,
          duration: 0.4,
          ease: 'power2.out',
          onUpdate() {
            fillHeight = (progress.val / 100) * logoHeight;
            draw();
          },
        });

        // Медленное движение до 85% пока грузится страница
        gsap.to(progress, {
          val: 85,
          duration: 2.5,
          ease: 'power1.out',
          delay: 0.4,
          onUpdate() {
            fillHeight = (progress.val / 100) * logoHeight;
            draw();
          },
        });

        // После полной загрузки страницы добиваем до 100% и скрываем
        window.addEventListener('load', function onLoad() {
          window.removeEventListener('load', onLoad);
          gsap.killTweensOf(progress);

          gsap.to(progress, {
            val: 100,
            duration: 0.4,
            ease: 'power2.out',
            onUpdate() {
              fillHeight = (progress.val / 100) * logoHeight;
              draw();
            },
            onComplete() {
              setTimeout(hidePreloader, PRELOADER_CONFIG.overlayHideDelayMs);
            },
          });
        });
      }
    }

    // Режим singleLogo - одно лого без заливки, скрывается после загрузки
    function startSingleLogoPreloader() {
      const { logoWidth, logoHeight } = initCanvas();
      const logo = new Image();

      function showAndWait() {
        window.addEventListener('load', function onLoad() {
          window.removeEventListener('load', onLoad);
          hidePreloader();
        });
      }

      logo.onload = () => {
        ctx.clearRect(0, 0, logoWidth, logoHeight);
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(logo, 0, 0, logoWidth, logoHeight);

        gsap.fromTo(canvas,
          { opacity: 0.2, scaleY: 0.98 },
          { opacity: 1, scaleY: 1, duration: 0.4, ease: 'power2.out' }
        );

        showAndWait();
      };

      logo.onerror = showAndWait;
      logo.src = PRELOADER_CONFIG.assets.logoWhiteSrc;
    }

    // Запускаем нужный режим прелоадера
    if (PRELOADER_CONFIG.mode === 'singleLogo') {
      startSingleLogoPreloader();
    } else {
      startOverlayPreloader();
    }

  })();

  /**
   * Функция воспроизведения звука при нажатии на кнопку
   */
  (function () {
    // Конфиг: название звука - путь до файла
    const SOUND_MAP = {
      poehali: './sound/poehali.mp3',
      shutdown_sound: './sound/shutdown-sound.mp3',
    };

    // Кэш AudioBuffer'ов (Web Audio API)
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const bufferCache = {};          // { soundName: AudioBuffer }
    const loadingSet = new Set();    // звуки в процессе загрузки
    const playingSet = new Set();    // звуки сейчас воспроизводятся (защита от спама)

    // Предзагрузка всех звуков
    async function preloadSound(name) {
      if (bufferCache[name] || loadingSet.has(name)) return;

      const path = SOUND_MAP[name];
      if (!path) {
        console.warn(`[Sound] Не найден путь для звука: "${name}"`);
        return;
      }

      loadingSet.add(name);
      try {
        const response = await fetch(path);
        const arrayBuffer = await response.arrayBuffer();
        bufferCache[name] = await audioCtx.decodeAudioData(arrayBuffer);
      } catch (err) {
        console.error(`[Sound] Ошибка загрузки "${name}":`, err);
      } finally {
        loadingSet.delete(name);
      }
    }

    // Предзагружаем все звуки из SOUND_MAP при старте
    Object.keys(SOUND_MAP).forEach(preloadSound);

    // Воспроизведение через Web Audio API
    // Web Audio API - лучший вариант для мобильных:
    // корректно работает на iOS Safari и Android Chrome.
    // Важно: AudioContext должен быть разблокирован через user gesture.

    async function playSound(name) {
      // Защита: если звук уже играет - игнорируем повторное нажатие
      if (playingSet.has(name)) return;

      // iOS/Android: разблокировка AudioContext требует user gesture
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }

      // Если буфер ещё не загружен - ждём загрузки
      if (!bufferCache[name]) {
        await preloadSound(name);
      }

      const buffer = bufferCache[name];
      if (!buffer) {
        console.warn(`[Sound] Буфер не готов для: "${name}"`);
        return;
      }

      // Создаём новый source node (одноразовый - стандарт Web Audio API)
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);

      playingSet.add(name);

      source.onended = () => {
        playingSet.delete(name);  // снимаем блокировку после окончания
        source.disconnect();
      };

      source.start(0);
    }

    // Вешаем обработчики на все кнопки с атрибутом data-btn-sound
    document.querySelectorAll('[data-btn-sound]').forEach(btn => {
      btn.addEventListener('click', () => {
        const soundName = btn.dataset.btnSound;
        playSound(soundName);
      });
    });

    // Fallback для старых браузеров без Web Audio API
    // (очень редкий кейс, но на всякий случай)
    if (!window.AudioContext && !window.webkitAudioContext) {
      console.warn('[Sound] Web Audio API не поддерживается. Используем <audio>.');

      const htmlAudioCache = {};
      const htmlPlayingSet = new Set();

      document.querySelectorAll('[data-btn-sound]').forEach(btn => {
        btn.addEventListener('click', () => {
          const name = btn.dataset.btnSound;
          const path = SOUND_MAP[name];
          if (!path || htmlPlayingSet.has(name)) return;

          if (!htmlAudioCache[name]) {
            htmlAudioCache[name] = new Audio(path);
          }

          const audio = htmlAudioCache[name];
          audio.currentTime = 0;
          htmlPlayingSet.add(name);

          audio.play().catch(err => console.error('[Sound Fallback]', err));

          audio.onended = () => htmlPlayingSet.delete(name);
        });
      });
    }
  })();

  /**
   * Функция воспроизведения звука при скролле до блока - sound-section
   */
  (function () {
    // Конфиг звуков
    const SCROLL_SOUND_MAP = {
      levitan: './sound/vnimanie_govorit_moskva.mp3',
    };

    //Громкость:
    // 0.0 (тишина)
    // 1.0 (полная)
    // выше (усиление)
    const SOUND_VOLUME = {
      levitan: 0.7,   // меняем здесь громкость для каждого звука
    };

    // Глобальная громкость поверх индивидуальной (множитель)
    // 1.0 = без изменений, 0.5 = вдвое тише, 0 = полная тишина
    let globalVolume = 0.7;

    // Web Audio API setup
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const bufferCache = {};
    const playingSet = new Set();

    // Секции, которые уже воспроизвели звук (никогда не сбрасывается)
    const firedSections = new WeakSet();

    async function preloadSound(name) {
      if (bufferCache[name]) return;
      const path = SCROLL_SOUND_MAP[name];
      if (!path) return;

      try {
        const res = await fetch(path);
        const arrBuf = await res.arrayBuffer();
        bufferCache[name] = await audioCtx.decodeAudioData(arrBuf);
      } catch (err) {
        console.error(`[ScrollSound] Ошибка загрузки "${name}":`, err);
      }
    }

    // Предзагрузка при первом касании/клике (разблокировка AudioContext на iOS)
    let audioUnlocked = false;
    function unlockAudio() {
      if (audioUnlocked) return;
      audioUnlocked = true;

      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      Object.keys(SCROLL_SOUND_MAP).forEach(preloadSound);
    }

    document.addEventListener('touchstart', unlockAudio, { once: true });
    document.addEventListener('click', unlockAudio, { once: true });
    document.addEventListener('scroll', unlockAudio, { once: true });

    // Воспроизведение звука
    async function playScrollSound(name) {
      if (playingSet.has(name)) return;

      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }

      if (!bufferCache[name]) {
        await preloadSound(name);
      }

      const buffer = bufferCache[name];
      if (!buffer) return;

      // Итоговая громкость = индивидуальная × глобальная
      const individualVolume = SOUND_VOLUME[name] ?? 1.0;
      const finalVolume = Math.min(2.0, Math.max(0, individualVolume * globalVolume));

      // GainNode - узел громкости
      // Граф: source -> gainNode -> destination
      const gainNode = audioCtx.createGain();
      gainNode.gain.value = finalVolume;
      gainNode.connect(audioCtx.destination);

      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(gainNode); // подключаем к gainNode, не к destination

      playingSet.add(name);
      source.onended = () => {
        playingSet.delete(name);
        source.disconnect();
        gainNode.disconnect(); // истим gainNode тоже
      };

      source.start(0);

      return buffer.duration;
    }

    // Публичное API для управления громкостью извне
    // Примеры использования в консоли или другом скрипте:
    //
    // SoundSection.setVolume('levitan', 0.5) - громкость конкретного звука
    // SoundSection.setGlobalVolume(0.3) - глобальная громкость всех звуков
    // SoundSection.mute() - выключить всё
    // SoundSection.unmute() - вернуть глобальную громкость
    //
    window.SoundSection = {
      // Громкость конкретного звука: 0.0 – 2.0
      setVolume(name, value) {
        SOUND_VOLUME[name] = Math.min(2.0, Math.max(0, value));
      },

      // Глобальный множитель: 0.0 – 1.0
      setGlobalVolume(value) {
        globalVolume = Math.min(1.0, Math.max(0, value));
      },

      // Отключить все звуки
      mute() {
        globalVolume = 0;
      },

      // Вернуть полную громкость
      unmute() {
        globalVolume = 1.0;
      },
    };

    // ScrollTrigger для каждой секции
    document.querySelectorAll('[data-scroll-sound]').forEach(section => {
      const soundName = section.dataset.scrollSound;
      const image = section.querySelector('.sound-image');

      ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',

        onEnter: async () => {
          if (firedSections.has(section)) return;
          firedSections.add(section);

          const duration = await playScrollSound(soundName);

          if (!image || !duration) return;

          const showDuration = 0.6;
          const hideDuration = 0.1;
          const holdTime = Math.max(0.2, duration - showDuration - hideDuration);

          const tl = gsap.timeline();

          tl.to(image, {
            opacity: 1,
            scale: 1,
            duration: showDuration,
            ease: 'back.out(1.5)',
          });

          tl.to(image, {
            duration: holdTime,
          });

          tl.to(image, {
            opacity: 0,
            duration: hideDuration,
            ease: 'power2.in',
            // onComplete: () => {
            //   gsap.set(image, { scale: 0.5 });
            // },
          });
        },
      });
    });
  })();

  /**
   * Функция для поведения шапки
   */
  (function () {

    // 
    // НАСТРОЙКИ
    // 
    const CONFIG = {

      // 
      // СЕЛЕКТОРЫ
      // 
      headerSelector: '.header',
      sectionsSelector: 'section',
      firstSectionSelector: null,      // null = используем высоту хедера
      footerSelector: '.request',

      // 
      // ТЕМА (светлая / тёмная секция под хедером)
      // Атрибут на секции: data-header-theme="dark" или "light"
      // Добавляет класс на <html>: header-theme-dark / header-theme-light
      // 
      themeAttribute: 'data-header-theme',
      classThemeDark: 'header-theme-dark',
      classThemeLight: 'header-theme-light',

      // 
      // КЛАССЫ НА <html> ДЛЯ СОСТОЯНИЙ СКРОЛЛА
      // 
      classFixed: 'header-fixed',         // прошли 1px скролла
      classOffTop: 'header-off-top',      // прошли первую секцию
      classAtFooter: 'header-at-footer',  // хедер у футера
      classHidden: 'header-hidden',       // хедер скрыт

      // 
      // СКРЫТИЕ ХЕДЕРА ПРИ СКРОЛЛЕ ВНИЗ
      // 
      hideOnScroll: true,                // true = скрывать, false = всегда видим

      // Настройки скрытия (работают только если hideOnScroll: true)
      hideDuration: 0.4,
      showDuration: 0.4,
      hideEase: 'power2.in',
      showEase: 'power2.out',
      scrollThreshold: 5,                 // минимальный скролл для реакции (px)

      // 
      // АНИМАЦИЯ ФОНА ХЕДЕРА ПРИ СКРОЛЛЕ
      // 
      animateBg: false,                    // true = менять фон, false = не менять
      bgInitial: 'rgba(255, 255, 255, 0)',
      bgScrolled: 'rgba(220, 20, 60, 1)',

      // 
      // АНИМАЦИЯ ТЕНИ ХЕДЕРА ПРИ СКРОЛЛЕ
      // 
      animateShadow: false,                // true = менять тень, false = не менять
      shadowInitial: '0px 0px 0px rgba(0, 0, 0, 0)',
      shadowScrolled: '0px 0px 20px rgba(0, 0, 0, 0.3)',

      // 
      // АНИМАЦИЯ ВЫСОТЫ ХЕДЕРА ПРИ СКРОЛЛЕ
      // 
      animateHeight: true,                // true = менять высоту, false = не менять
      heightMultiplier: 0.645,              // во сколько раз уменьшить (0.7 = 63.53%)

      // Множитель высоты для мобильной версии
      // Используется когда ширина окна меньше mobileBreakpoint
      // Если null - используется heightMultiplier (общее значение)
      heightMultiplierMobile: 1,

      // Брейкпоинт мобильной версии в px
      // При window.innerWidth < mobileBreakpoint применяется heightMultiplierMobile
      mobileBreakpoint: 600,

      // Классы попапов на <html> при которых нужно принудительно показывать шапку
      // Если шапка скрыта (header-hidden) и появляется один из этих классов -
      // шапка опускается обратно чтобы пользователь мог по ней кликнуть
      // (например закрыть попап через кнопку в шапке)
      forceShowOnClasses: ['callback--open', 'tender--open'],
    };

    // 
    // ЭЛЕМЕНТЫ
    // 
    const header = document.querySelector(CONFIG.headerSelector);
    if (!header) return;

    const footer = document.querySelector(CONFIG.footerSelector);
    const htmlEl = document.documentElement;
    const headerHeight = header.offsetHeight;

    const firstSection = CONFIG.firstSectionSelector
      ? document.querySelector(CONFIG.firstSectionSelector)
      : null;

    // Проверка мобильной версии по ширине окна
    // Вызывается каждый раз при инициализации scrub-анимации
    // и при resize чтобы пересобрать анимацию с актуальным множителем
    const isMobile = () => window.innerWidth < CONFIG.mobileBreakpoint;

    // Возвращает актуальный множитель высоты в зависимости от ширины экрана
    // Если для мобильной версии множитель не задан (null) - возвращает общий
    const getHeightMultiplier = () => {
      if (isMobile() && CONFIG.heightMultiplierMobile !== null) {
        return CONFIG.heightMultiplierMobile;
      }
      return CONFIG.heightMultiplier;
    };

    // Зона скролла для scrub-анимации
    const scrollZone = firstSection
      ? firstSection.offsetHeight
      : headerHeight;

    // 
    // ОПРЕДЕЛЕНИЕ ТЕМЫ ПОД ХЕДЕРОМ
    // Проходим по секциям, находим ту что пересекается с хедером,
    // берём её data-header-theme и ставим класс на <html>
    // 
    const updateTheme = () => {
      const sections = document.querySelectorAll(CONFIG.sectionsSelector);
      const headerBottom = header.getBoundingClientRect().bottom;
      let foundTheme = null;

      for (const section of sections) {
        const rect = section.getBoundingClientRect();

        // Секция пересекается с хедером:
        // верх секции выше нижней границы хедера И низ секции ниже верха viewport
        const intersects = rect.top <= headerBottom && rect.bottom >= 0;

        if (intersects) {
          const theme = section.getAttribute(CONFIG.themeAttribute);
          if (theme) {
            foundTheme = theme;
            break;
          }
        }
      }

      // Сбрасываем оба класса и ставим нужный
      htmlEl.classList.remove(CONFIG.classThemeDark, CONFIG.classThemeLight);

      if (foundTheme === 'dark') {
        htmlEl.classList.add(CONFIG.classThemeDark);
      } else if (foundTheme === 'light') {
        htmlEl.classList.add(CONFIG.classThemeLight);
      }
    };

    // 
    // НАЧАЛЬНЫЕ СТИЛИ ХЕДЕРА
    // Устанавливаем только те свойства которые включены в CONFIG
    // 
    const initialStyles = {
      yPercent: 0,
      // Высоту всегда устанавливаем чтобы GSAP знал начальное значение
      height: headerHeight,
    };

    if (CONFIG.animateBg) {
      initialStyles.backgroundColor = CONFIG.bgInitial;
    }

    if (CONFIG.animateShadow) {
      initialStyles.boxShadow = CONFIG.shadowInitial;
    }

    gsap.set(header, initialStyles);

    // 
    // GSAP SCRUB - анимация хедера при скролле
    // Собираем объект анимации только из включённых свойств
    // 

    // Объект с целевыми значениями для scrub-анимации
    const animateTo = {
      ease: 'none',
      duration: 1,
    };

    if (CONFIG.animateBg) {
      animateTo.backgroundColor = CONFIG.bgScrolled;
    }

    if (CONFIG.animateShadow) {
      animateTo.boxShadow = CONFIG.shadowScrolled;
    }

    if (CONFIG.animateHeight) {
      // Берём множитель через функцию - она сама решает мобильный или десктопный
      animateTo.height = headerHeight * getHeightMultiplier();
    }

    // Запускаем scrub только если есть хотя бы одно включённое свойство
    const hasScrubAnimation = CONFIG.animateBg || CONFIG.animateShadow || CONFIG.animateHeight;

    if (hasScrubAnimation) {
      const tlScrub = gsap.timeline({
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: `+=${scrollZone}`,
          scrub: true,
          onEnter: () => htmlEl.classList.add(CONFIG.classFixed),
          onLeaveBack: () => {
            htmlEl.classList.remove(CONFIG.classFixed);
            htmlEl.classList.remove(CONFIG.classOffTop);
          },
        }
      });

      tlScrub.to(header, animateTo);
    }

    // 
    // КЛАСС header-off-top - прошли зону анимации
    // 
    ScrollTrigger.create({
      trigger: document.documentElement,
      start: `top+=${scrollZone} top`,
      onEnter: () => htmlEl.classList.add(CONFIG.classOffTop),
      onLeaveBack: () => htmlEl.classList.remove(CONFIG.classOffTop),
    });

    // 
    // КЛАСС header-at-footer - хедер достиг футера
    // 
    if (footer) {
      ScrollTrigger.create({
        trigger: footer,
        start: 'top bottom',
        onEnter: () => htmlEl.classList.add(CONFIG.classAtFooter),
        onLeaveBack: () => htmlEl.classList.remove(CONFIG.classAtFooter),
      });
    }

    // 
    // HIDE / SHOW ХЕДЕРА
    // Работает только если CONFIG.hideOnScroll: true
    // 
    let lastScrollY = window.scrollY || window.pageYOffset;
    let isHidden = false;
    let ticking = false;

    // Нижняя граница первой секции в координатах страницы
    const getFirstSectionBottom = () => {
      if (!firstSection) return scrollZone;
      return firstSection.getBoundingClientRect().bottom + window.scrollY;
    };

    const hideHeader = () => {
      if (isHidden) return;
      isHidden = true;
      htmlEl.classList.add(CONFIG.classHidden);
      gsap.to(header, {
        yPercent: -100,
        duration: CONFIG.hideDuration,
        ease: CONFIG.hideEase,
        overwrite: 'auto',
      });
    };

    const showHeader = () => {
      if (!isHidden) return;
      isHidden = false;
      htmlEl.classList.remove(CONFIG.classHidden);
      gsap.to(header, {
        yPercent: 0,
        duration: CONFIG.showDuration,
        ease: CONFIG.showEase,
        overwrite: 'auto',
      });
    };

    // 
    // ОСНОВНОЙ ОБРАБОТЧИК СКРОЛЛА
    // 
    const handleScroll = () => {
      const currentScrollY = window.scrollY || window.pageYOffset;
      const delta = currentScrollY - lastScrollY;
      const absDelta = Math.abs(delta);

      // Тему обновляем всегда - не зависит от threshold
      updateTheme();

      // Дальше - только если включено скрытие хедера
      if (CONFIG.hideOnScroll) {

        // Микро-скроллы игнорируем
        if (absDelta >= CONFIG.scrollThreshold) {
          const scrollingDown = delta > 0;
          const firstSectionBottom = getFirstSectionBottom();

          // Скролл вниз после первой секции - прячем
          // if (scrollingDown && currentScrollY > firstSectionBottom) {
          if (scrollingDown && currentScrollY > 0) {
            hideHeader();
          }

          // Скролл вверх - показываем
          if (!scrollingDown) {
            showHeader();
          }

          // Самый верх - всегда показываем
          if (currentScrollY <= 0) {
            showHeader();
          }

          lastScrollY = currentScrollY;
        }
      } else {
        // Скрытие выключено - просто обновляем lastScrollY
        lastScrollY = currentScrollY;
      }

      ticking = false;
    };

    // rAF обёртка - не чаще одного раза за кадр
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(handleScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // iOS Safari
    if (window.visualViewport) {
      window.visualViewport.addEventListener('scroll', onScroll, { passive: true });
      window.visualViewport.addEventListener('resize', () => {
        lastScrollY = window.scrollY || window.pageYOffset;
      });
    }

    // Пересчёт высоты при ресайзе окна
    // Когда пользователь переходит через брейкпоинт (например, поворот телефона
    // или ресайз окна разработчиком), множитель высоты должен пересчитаться
    // Используем дебаунс чтобы не дёргать пересборку на каждый пиксель ресайза
    if (CONFIG.animateHeight) {
      let resizeTimer = null;
      let lastIsMobile = isMobile();

      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(() => {
          const currentIsMobile = isMobile();

          // Реагируем только если реально пересекли брейкпоинт
          // Иначе при каждом мини-ресайзе будем без нужды пересобирать анимацию
          if (currentIsMobile === lastIsMobile) return;
          lastIsMobile = currentIsMobile;

          // Находим scrub-таймлайн нашего хедера и обновляем целевую высоту
          // ScrollTrigger.getAll() возвращает все триггеры на странице -
          // фильтруем по trigger === document.documentElement
          const newHeight = headerHeight * getHeightMultiplier();

          ScrollTrigger.getAll().forEach(st => {
            // Ищем именно scrub-триггер хедера
            if (st.trigger === document.documentElement && st.animation) {
              // Меняем целевое значение height в текущем твине
              const tween = st.animation.getChildren()[0];
              if (tween && tween.vars) {
                tween.vars.height = newHeight;
                // Инвалидируем чтобы GSAP перечитал from/to значения
                tween.invalidate();
                st.refresh();
              }
            }
          });
        }, 200);
      }, { passive: true });
    }

    // 
    // ПРИНУДИТЕЛЬНЫЙ ПОКАЗ ШАПКИ ПРИ ОТКРЫТИИ ПОПАПОВ
    // 
    // Когда на <html> появляется класс из forceShowOnClasses (callback--open,
    // tender--open и т.д.) - принудительно показываем шапку если она скрыта
    // Это нужно чтобы пользователь мог взаимодействовать с шапкой при открытом попапе
    // Используем MutationObserver - он реагирует только на изменения класса
    // и не дёргается при скролле, в отличие от глобальных слушателей
    // 
    if (CONFIG.forceShowOnClasses && CONFIG.forceShowOnClasses.length > 0) {

      // Проверяет есть ли на <html> хотя бы один из "форсирующих" классов
      const hasForceClass = () => {
        return CONFIG.forceShowOnClasses.some(cls => htmlEl.classList.contains(cls));
      };

      // Запоминаем предыдущее состояние - чтобы реагировать только на переход
      // false -> true (попап открылся), а не на каждое изменение класса
      let wasForced = hasForceClass();

      // Если попап уже открыт при инициализации скрипта - сразу показываем шапку
      if (wasForced && isHidden) {
        showHeader();
      }

      const popupObserver = new MutationObserver(() => {
        const isForced = hasForceClass();

        // Реагируем только в момент когда попап ОТКРЫЛСЯ
        // (раньше форс-классов не было, теперь появился)
        // На закрытие попапа не реагируем - дальше работает обычная логика hide/show
        if (isForced && !wasForced) {
          // Если шапка скрыта - принудительно показываем её
          // Если уже видна - ничего не делаем (условие внутри showHeader)
          if (isHidden) {
            showHeader();
          }
        }

        wasForced = isForced;
      });

      popupObserver.observe(htmlEl, {
        attributes: true,
        attributeFilter: ['class'],
      });
    }

    // 
    // ИНИЦИАЛИЗАЦИЯ - определяем тему сразу при загрузке страницы
    // 
    updateTheme();

  })();

  /**
   * Функция управления поведением меню-бургера.
   */
  (function () {
    const burgerBtn = document.getElementById('burger-btn');
    const burgerMenu = document.getElementById('burger-menu');
    const menuNav = document.querySelector('#burger-menu .menu__nav');

    const openMenu = () => {
      burgerBtn.classList.add('burger--open');
      document.documentElement.classList.add('menu--open');
      document.documentElement.classList.remove('tender--open');
      lenis.stop();
    };

    const closeMenu = () => {
      burgerBtn.classList.remove('burger--open');
      document.documentElement.classList.remove('menu--open');
      lenis.start();
      document.dispatchEvent(new CustomEvent('menu:close'));
    };

    const toggleMenu = (e) => {
      e.preventDefault();
      const isMenuOpen = document.documentElement.classList.contains('menu--open');
      const isTenderOpen = document.documentElement.classList.contains('tender--open');
      const isCallbackOpen = document.documentElement.classList.contains('callback--open');

      if (isMenuOpen) {
        closeMenu();
      } else if (isTenderOpen || isCallbackOpen) {
        if (isTenderOpen) {
          document.dispatchEvent(new CustomEvent('popup:close', { detail: { name: 'tender' } }));
        }
        if (isCallbackOpen) {
          document.dispatchEvent(new CustomEvent('popup:close', { detail: { name: 'callback' } }));
        }
      } else {
        openMenu();
      }
    };

    burgerBtn.addEventListener('click', toggleMenu);

    window.addEventListener('keydown', (e) => {
      if (e.key === "Escape" && document.documentElement.classList.contains('menu--open')) {
        closeMenu();
      }
    });

    document.addEventListener('click', (event) => {
      const isMenuOpen = document.documentElement.classList.contains('menu--open');
      const clickInsideMenu = burgerMenu.contains(event.target);
      const clickOnButton = burgerBtn.contains(event.target);

      // Проверяем, кликнули ли по ссылке внутри menu__list
      const clickOnMenuLink = menuNav && menuNav.contains(event.target) && event.target.tagName === 'A';

      if (isMenuOpen && !clickInsideMenu && !clickOnButton) {
        closeMenu();
      }

      // Дополнительно: закрываем меню при клике по ссылке внутри меню
      if (isMenuOpen && clickOnMenuLink) {
        closeMenu();
      }
    });
  })();

  /**
   * Функция для попапов
   */
  (function () {

    // Конфигурация каждого попапа - анимации и хуки задаются здесь
    const popupConfigs = {

      callback: {
        // onOpen вызывается при открытии попапа
        onOpen: (popup) => {
          const openTl = gsap.timeline();

          // Сбрасываем стили оставшиеся от анимации закрытия
          popup.fadeUpItems.forEach(el => {
            gsap.set(el, { clearProps: 'all' });
          });
          popup.fadeDownItems.forEach(el => {
            gsap.set(el, { clearProps: 'all' });
          });

          popup.fadeUpItems.forEach(el => {
            openTl.from(el, {
              duration: 0.8,
              y: 350,
              ease: 'none',
            }, 0);
          });

          popup.fadeDownItems.forEach(el => {
            openTl.from(el, {
              duration: 0.8,
              rotate: -20,
              y: -500,
              ease: 'none',
            }, 0);
          });

          popup.currentOpenTl = openTl;
        },

        // onClose вызывается при закрытии попапа
        onClose: (popup, onComplete) => {
          if (popup.currentOpenTl) {
            popup.currentOpenTl.pause();
          }

          const closeTl = gsap.timeline({ onComplete });

          popup.fadeUpItems.forEach(el => {
            closeTl.to(el, {
              duration: 0.2,
              y: 1000,
              ease: 'none',
            }, 0);
          });

          popup.fadeDownItems.forEach(el => {
            closeTl.to(el, {
              duration: 0.2,
              rotate: 10,
              y: 50,
              ease: 'none',
            }, 0);
          });
        },
      },

      tender: {
        onOpen: (popup) => {
          // У тендера нет сложной анимации открытия - просто показываем
        },

        onClose: (popup, onComplete) => {
          // У тендера нет анимации закрытия - сразу вызываем коллбек
          onComplete();
        },

        // onAfterClose вызывается после полного закрытия попапа
        onAfterClose: (popup) => {
          // Сбрасываем ракету при закрытии тендера
          const rocket = document.getElementById('rocket');
          if (rocket && popup.isLaunched) {
            gsap.killTweensOf(rocket);
            gsap.set(rocket, { clearProps: 'all' });
            popup.isLaunched = false;
          }
        },
      },

    };

    // Хранилище состояний для каждого попапа
    const popups = {};

    // Инициализация попапов
    document.querySelectorAll('[data-popup]').forEach(popupBlock => {
      const name = popupBlock.dataset.popup;

      popups[name] = {
        block: popupBlock,
        name,
        isClosing: false,
        closeTimeout: null,
        currentOpenTl: null,
        // Дополнительные поля для кастомных анимаций
        isLaunched: false,
        // Собираем fadeUp и fadeDown элементы внутри попапа
        fadeUpItems: gsap.utils.toArray(
          `[data-popup="${name}"] [data-popup-anim="fadeUp"]`
        ),
        fadeDownItems: gsap.utils.toArray(
          `[data-popup="${name}"] [data-popup-anim="fadeDown"]`
        ),
      };
    });

    function openPopup(name) {
      const popup = popups[name];
      const config = popupConfigs[name];
      if (!popup || !config) return;

      // Если попап закрывается - отменяем закрытие и открываем заново
      if (popup.isClosing) {
        clearTimeout(popup.closeTimeout);
        gsap.killTweensOf([...popup.fadeUpItems, ...popup.fadeDownItems]);
        popup.isClosing = false;
      }

      document.documentElement.classList.add(`${name}--open`);
      lenis.stop();

      if (config.onOpen) {
        config.onOpen(popup);
      }
    }

    function closePopup(name) {
      const popup = popups[name];
      const config = popupConfigs[name];
      if (!popup || !config || popup.isClosing) return;

      popup.isClosing = true;

      const onComplete = () => {
        popup.closeTimeout = setTimeout(() => {
          document.documentElement.classList.remove(`${name}--open`);
          lenis.start();
          popup.isClosing = false;

          if (config.onAfterClose) {
            config.onAfterClose(popup);
          }
        }, 100);
      };

      if (config.onClose) {
        config.onClose(popup, onComplete);
      } else {
        onComplete();
      }
    }

    function togglePopup(name) {
      const isOpen = document.documentElement.classList.contains(`${name}--open`);
      isOpen ? closePopup(name) : openPopup(name);
    }

    // Кнопки вызова попапов
    document.querySelectorAll('[data-popup-btn]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const name = btn.dataset.popupBtn;
        togglePopup(name);
      });
    });

    // Закрытие по Escape
    window.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;

      Object.keys(popups).forEach(name => {
        if (document.documentElement.classList.contains(`${name}--open`)) {
          closePopup(name);
        }
      });
    });

    // Закрытие по клику вне попапа
    document.addEventListener('click', (e) => {
      Object.keys(popups).forEach(name => {
        const popup = popups[name];
        const isOpen = document.documentElement.classList.contains(`${name}--open`);

        if (!isOpen) return;

        const clickInsidePopup = popup.block.contains(e.target);
        const clickOnBtn = e.target.closest(`[data-popup-btn="${name}"]`);

        if (!clickInsidePopup && !clickOnBtn) {
          closePopup(name);
        }
      });
    });

    // Ракета для тендера
    (function () {
      const rocket = document.getElementById('rocket');
      const formBtn = document.getElementById('rocket-btn');

      if (!rocket || !formBtn) return;

      function launchRocket() {
        const tenderPopup = popups['tender'];
        if (tenderPopup) tenderPopup.isLaunched = true;

        const tl = gsap.timeline();

        tl
          .to(rocket, {
            x: -3,
            duration: 0.05,
            repeat: 6,
            yoyo: true,
            ease: 'none',
          })
          .to(rocket, {
            x: 200,
            y: -2500,
            opacity: 0,
            duration: 3,
            ease: 'power4.in',
          });
      }

      formBtn.addEventListener('click', launchRocket);
    })();

    // Слушаем событие закрытия попапа от бургер-кнопки
    document.addEventListener('popup:close', (e) => {
      closePopup(e.detail.name);
    });

  })();

  /**
   * Функция магнетизма для главного блока
   */
  // Атрибуты для ручной настройки через html
  // data-magnet-distance="100"
  // data-magnet-strength="0.1"
  // data-magnet-lerp="0.12"
  // data-magnet-return-lerp="0.08">
  (function () {

    // Настройки магнетизма
    const MAGNET_CONFIG = {
      // Расстояние от края элемента в px при котором начинается притяжение
      triggerDistance: 110,
      // Сила притяжения: 0.1 = слабое, 1.0 = 1 к 1 с курсором
      strength: 0.1,
      // Скорость следования за курсором
      lerpFactor: 0.12,
      // Скорость возврата когда курсор ушёл
      returnLerpFactor: 0.08,

      // Режим работы:
      // 'magnet'  - притяжение только в зоне triggerDistance (текущее поведение)
      // 'follow'  - глаз следует за курсором по всему сайту
      mode: 'follow',
      // Сила следования в режиме follow: насколько далеко глаз уходит за курсором
      // followStrength: 0.08,
      followStrength: 0.06,

      // Задержка в мс после остановки курсора - через сколько глаз возвращается
      // в исходное положение (актуально для режима follow)
      // Если курсор не двигается дольше этого времени - глаз "отпускает" его
      idleDelay: 1000,
    };

    // Настройки автоанимации
    const AUTO_ANIM_CONFIG = {
      // Включение/отключение автоанимации на десктопе
      // true  - глаз периодически играет drift/pulse/shake/float
      // false - автоанимация отключена, глаз стоит на месте когда курсор неактивен
      enabled: true,
      // Включение/отключение автоанимации на мобильной версии
      // Отдельный флаг чтобы можно было выключить автоанимацию на телефонах
      // (экономия батареи + на тач-устройствах глаз и так не следит за курсором)
      enabledMobile: false,
      // Брейкпоинт мобильной версии в px
      // При window.innerWidth < mobileBreakpoint используется enabledMobile
      mobileBreakpoint: 600,
      // Пауза между сценариями в секундах
      // Текущие значения дают частоту примерно раз в минуту
      pauseMin: 55,
      pauseMax: 70,
      // Радиус смещения для drift в px
      driftRadius: 10,
      // Амплитуда покачивания float в px
      floatAmplitudeX: 14,
      floatAmplitudeY: 8,
      // Длительность одного цикла float в секундах
      floatDuration: 3.5,
      // Амплитуда выброса pulse в px
      pulseDist: 12,
      pulseDuration: 0.6,
      // Параметры shake
      shakeAmplitude: 6,
      shakeDuration: 0.04,
      shakeCount: 6,
    };

    // Проверка мобильной версии по ширине окна
    // Используется для выбора enabled или enabledMobile флага
    function isMobile() {
      return window.innerWidth < AUTO_ANIM_CONFIG.mobileBreakpoint;
    }

    // Возвращает актуальный флаг включения автоанимации
    // На мобилке проверяет enabledMobile, на десктопе - enabled
    // Вызывается каждый раз при попытке запустить сценарий чтобы реагировать
    // на ресайз окна без перезагрузки страницы
    function isAutoAnimEnabled() {
      return isMobile() ? AUTO_ANIM_CONFIG.enabledMobile : AUTO_ANIM_CONFIG.enabled;
    }

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    function distanceToRect(px, py, rect) {
      const dx = Math.max(rect.left - px, 0, px - rect.right);
      const dy = Math.max(rect.top - py, 0, py - rect.bottom);
      return Math.sqrt(dx * dx + dy * dy);
    }

    function randomBetween(min, max) {
      return min + Math.random() * (max - min);
    }

    function initMagnet(el) {

      // Находим блок-границу - ищем ближайший hero__cover-blind
      // const boundaryEl = el.closest('.hero__cover-blind') ?? document.querySelector('.hero__cover-blind');

      // Ищем соседний hero__cover-blind - элемент на том же уровне вложенности
      const boundaryEl = el.parentElement?.querySelector('.hero__cover-blind')
        ?? el.closest('.hero__cover-blind');

      const triggerDistance = parseFloat(
        el.dataset.magnetDistance ?? MAGNET_CONFIG.triggerDistance
      );
      const strength = parseFloat(
        el.dataset.magnetStrength ?? MAGNET_CONFIG.strength
      );
      const lerpFactor = parseFloat(
        el.dataset.magnetLerp ?? MAGNET_CONFIG.lerpFactor
      );
      const returnLerpFactor = parseFloat(
        el.dataset.magnetReturnLerp ?? MAGNET_CONFIG.returnLerpFactor
      );

      // Текущее отрисованное смещение
      let currentX = 0;
      let currentY = 0;

      // Целевое смещение
      let targetX = 0;
      let targetY = 0;

      // Смещение от автоанимации - курсор подхватывает отсюда
      let autoX = 0;
      let autoY = 0;

      let mouseX = 0;
      let mouseY = 0;

      // Курсор в зоне притяжения
      let isActive = false;

      // rAF петля запущена
      let rafId = null;

      // Автоанимация сейчас играет
      let autoPlaying = false;

      // Таймер паузы между сценариями
      let pauseTimer = null;

      // Текущий активный tween
      let autoTween = null;

      // Таймер бездействия курсора - срабатывает когда курсор остановился
      // По истечении idleDelay глаз "отпускает" курсор и возвращается в исходную точку
      let idleTimer = null;

      // Последние координаты курсора - нужны для определения реального движения
      // Браузер иногда стреляет mousemove даже когда мышь не двигалась (скролл, layout shift)
      let lastMouseX = 0;
      let lastMouseY = 0;

      // Список сценариев - drift дублируем чтобы выпадал чаще
      // const scenarios = ['float', 'drift', 'drift', 'pulse', 'shake'];
      const scenarios = ['drift', 'drift', 'pulse'];

      // Сценарий float: плавная восьмёрка через последовательные tweens
      function playFloat() {
        const cfg = AUTO_ANIM_CONFIG;
        autoPlaying = true;

        const steps = 8;
        let step = 0;

        const points = [];
        for (let i = 1; i <= steps; i++) {
          const angle = (i / steps) * Math.PI * 2;
          points.push({
            x: Math.sin(angle) * cfg.floatAmplitudeX,
            y: Math.sin(angle * 2) * cfg.floatAmplitudeY,
          });
        }

        const proxy = { x: autoX, y: autoY };

        function nextStep() {
          if (step >= points.length) {
            autoPlaying = false;
            schedulNext();
            return;
          }

          const point = points[step];
          const stepDuration = cfg.floatDuration / steps;

          autoTween = gsap.to(proxy, {
            x: point.x,
            y: point.y,
            duration: stepDuration,
            ease: 'sine.inOut',
            onUpdate: () => {
              autoX = proxy.x;
              autoY = proxy.y;
              // Убеждаемся что петля работает пока идёт автоанимация
              startLoop();
            },
            onComplete: () => {
              step++;
              nextStep();
            },
          });
        }

        nextStep();
      }

      // Сценарий drift: уход в случайную точку и возврат
      function playDrift() {
        const cfg = AUTO_ANIM_CONFIG;
        const angle = Math.random() * Math.PI * 2;
        const dist = randomBetween(cfg.driftRadius * 0.4, cfg.driftRadius);
        const toX = Math.cos(angle) * dist;
        const toY = Math.sin(angle) * dist;

        autoPlaying = true;
        const proxy = { x: autoX, y: autoY };

        autoTween = gsap.to(proxy, {
          x: toX,
          y: toY,
          duration: randomBetween(1.2, 2.2),
          ease: 'power2.inOut',
          onUpdate: () => {
            autoX = proxy.x;
            autoY = proxy.y;
            startLoop();
          },
          onComplete: () => {
            autoTween = gsap.to(proxy, {
              x: 0,
              y: 0,
              duration: randomBetween(1.0, 1.8),
              ease: 'power2.inOut',
              onUpdate: () => {
                autoX = proxy.x;
                autoY = proxy.y;
                startLoop();
              },
              onComplete: () => {
                autoX = 0;
                autoY = 0;
                autoPlaying = false;
                schedulNext();
              },
            });
          },
        });
      }

      // Сценарий pulse: короткий выброс в случайную сторону и возврат
      function playPulse() {
        const cfg = AUTO_ANIM_CONFIG;
        const angle = Math.random() * Math.PI * 2;
        const toX = Math.cos(angle) * cfg.pulseDist;
        const toY = Math.sin(angle) * cfg.pulseDist;

        autoPlaying = true;
        const proxy = { x: autoX, y: autoY };

        autoTween = gsap.to(proxy, {
          x: toX,
          y: toY,
          duration: cfg.pulseDuration,
          ease: 'power3.out',
          onUpdate: () => {
            autoX = proxy.x;
            autoY = proxy.y;
            startLoop();
          },
          onComplete: () => {
            autoTween = gsap.to(proxy, {
              x: 0,
              y: 0,
              duration: cfg.pulseDuration,
              ease: 'power3.inOut',
              onUpdate: () => {
                autoX = proxy.x;
                autoY = proxy.y;
                startLoop();
              },
              onComplete: () => {
                autoX = 0;
                autoY = 0;
                autoPlaying = false;
                schedulNext();
              },
            });
          },
        });
      }

      // Сценарий shake: быстрые случайные подёргивания
      function playShake() {
        const cfg = AUTO_ANIM_CONFIG;
        let count = cfg.shakeCount;
        autoPlaying = true;

        const proxy = { x: autoX, y: autoY };

        function nextShakeStep() {
          if (count <= 0) {
            autoTween = gsap.to(proxy, {
              x: 0,
              y: 0,
              duration: cfg.shakeDuration * 3,
              ease: 'power2.out',
              onUpdate: () => {
                autoX = proxy.x;
                autoY = proxy.y;
                startLoop();
              },
              onComplete: () => {
                autoX = 0;
                autoY = 0;
                autoPlaying = false;
                schedulNext();
              },
            });
            return;
          }

          const tx = randomBetween(-cfg.shakeAmplitude, cfg.shakeAmplitude);
          const ty = randomBetween(-cfg.shakeAmplitude, cfg.shakeAmplitude);

          autoTween = gsap.to(proxy, {
            x: tx,
            y: ty,
            duration: cfg.shakeDuration,
            ease: 'none',
            onUpdate: () => {
              autoX = proxy.x;
              autoY = proxy.y;
              startLoop();
            },
            onComplete: () => {
              count--;
              nextShakeStep();
            },
          });
        }

        nextShakeStep();
      }

      function playRandomScenario() {
        if (isActive) return;
        const name = scenarios[Math.floor(Math.random() * scenarios.length)];
        if (name === 'float') playFloat();
        else if (name === 'drift') playDrift();
        else if (name === 'pulse') playPulse();
        else if (name === 'shake') playShake();
      }

      function schedulNext() {
        if (isActive) return;
        // Если автоанимация выключена для текущей ширины экрана - не планируем
        // Используем функцию isAutoAnimEnabled которая сама определяет
        // мобилку и возвращает соответствующий флаг (enabled или enabledMobile)
        if (!isAutoAnimEnabled()) return;

        clearTimeout(pauseTimer);
        const delay = randomBetween(
          AUTO_ANIM_CONFIG.pauseMin,
          AUTO_ANIM_CONFIG.pauseMax
        ) * 1000;
        pauseTimer = setTimeout(playRandomScenario, delay);
      }

      // Останавливаем автоанимацию когда курсор перехватывает
      function stopAuto() {
        if (autoTween) {
          autoTween.kill();
          autoTween = null;
        }
        clearTimeout(pauseTimer);
        autoPlaying = false;
      }

      // rAF петля - считает и применяет transform
      function tick() {
        if (isActive) {
          const rect = el.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const deltaX = mouseX - centerX;
          const deltaY = mouseY - centerY;

          // В режиме follow используем followStrength - элемент уходит дальше за курсором
          const activeStrength = MAGNET_CONFIG.mode === 'follow'
            ? MAGNET_CONFIG.followStrength
            : strength;

          // Курсор тянет элемент + плавно гасим оставшееся авто-смещение
          // targetX = deltaX * strength + autoX;
          // targetY = deltaY * strength + autoY;
          targetX = deltaX * activeStrength + autoX;
          targetY = deltaY * activeStrength + autoY;

          // Клампим смещение так чтобы центр глаза не вышел за hero__cover-blind
          if (boundaryEl) {
            const boundaryRect = boundaryEl.getBoundingClientRect();
            const elRect = el.getBoundingClientRect();

            // Текущий центр глаза без смещения
            const elCenterX = elRect.left + elRect.width / 2.5;
            const elCenterY = elRect.top + elRect.height / 2.5;

            // Максимально допустимое смещение в каждую сторону
            const maxLeft = boundaryRect.left - elCenterX;
            const maxRight = boundaryRect.right - elCenterX;
            const maxTop = boundaryRect.top - elCenterY;
            const maxBottom = boundaryRect.bottom - elCenterY;

            targetX = Math.min(Math.max(targetX, maxLeft), maxRight);
            targetY = Math.min(Math.max(targetY, maxTop), maxBottom);
          }

          // Гасим авто-смещение пока курсор активен
          autoX = lerp(autoX, 0, 0.05);
          autoY = lerp(autoY, 0, 0.05);
        } else {
          // Без курсора - цель это текущее авто-смещение
          targetX = autoX;
          targetY = autoY;
        }

        const factor = isActive ? lerpFactor : returnLerpFactor;
        currentX = lerp(currentX, targetX, factor);
        currentY = lerp(currentY, targetY, factor);

        el.style.transform = `translate(${currentX}px, ${currentY}px)`;

        // Считаем суммарное расстояние до цели
        const distToTarget = Math.abs(currentX - targetX) + Math.abs(currentY - targetY);

        // Останавливаем петлю только если курсор не активен,
        // автоанимация не играет и элемент дошёл до цели
        const isSettled = !isActive && !autoPlaying && distToTarget < 0.05;

        if (isSettled) {
          currentX = 0;
          currentY = 0;
          el.style.transform = 'translate(0px, 0px)';
          rafId = null;
          return;
        }

        rafId = requestAnimationFrame(tick);
      }

      // Запускаем петлю только если она не запущена
      function startLoop() {
        if (rafId === null) {
          rafId = requestAnimationFrame(tick);
        }
      }

      function onMouseMove(e) {
        // На тач-устройствах магнетизм не нужен - нет курсора
        if (window.matchMedia('(hover: none)').matches) return;

        mouseX = e.clientX;
        mouseY = e.clientY;

        // Режим follow - следим за курсором по всему сайту
        if (MAGNET_CONFIG.mode === 'follow') {
          // Проверяем реальное движение курсора
          // Если координаты не изменились - событие шумовое, игнорируем
          // Это защищает от ложных срабатываний при скролле и ресайзе
          const moved = e.clientX !== lastMouseX || e.clientY !== lastMouseY;
          lastMouseX = e.clientX;
          lastMouseY = e.clientY;

          if (!moved) return;

          // Курсор реально двигается - активируем слежение
          if (!isActive) {
            isActive = true;
            el.classList.add('is-magnet-active');
            stopAuto();
          }
          startLoop();

          // Сбрасываем таймер бездействия на каждое движение курсора
          // Пока курсор двигается - глаз продолжает следить
          clearTimeout(idleTimer);
          idleTimer = setTimeout(() => {
            // Курсор остановился на idleDelay мс - "отпускаем" его
            // Глаз плавно вернётся к autoX/autoY (или к 0,0 если автоанимация выключена)
            if (isActive) {
              isActive = false;
              el.classList.remove('is-magnet-active');
              startLoop();
              schedulNext();
            }
          }, MAGNET_CONFIG.idleDelay);

          return;
        }

        const rect = el.getBoundingClientRect();
        const dist = distanceToRect(mouseX, mouseY, rect);

        if (dist <= triggerDistance) {
          if (!isActive) {
            isActive = true;
            el.classList.add('is-magnet-active');
            stopAuto();
          }
          startLoop();
        } else {
          if (isActive) {
            isActive = false;
            el.classList.remove('is-magnet-active');
            startLoop();
            schedulNext();
          }
        }
      }

      function onMouseLeave() {
        // На тач-устройствах магнетизм не нужен - нет курсора
        if (window.matchMedia('(hover: none)').matches) return;

        // Чистим таймер бездействия - курсор ушёл за пределы окна,
        // ждать его остановки уже не нужно
        clearTimeout(idleTimer);

        if (isActive) {
          isActive = false;
          el.classList.remove('is-magnet-active');
          startLoop();
          // В режиме follow запускаем автоанимацию когда курсор ушёл за пределы окна
          schedulNext();
        }
      }

      window.addEventListener('mousemove', onMouseMove, { passive: true });
      document.addEventListener('mouseleave', onMouseLeave, { passive: true });

      // Запускаем первый сценарий после паузы
      schedulNext();

      // Возвращаем API инстанса для внешнего управления
      return {
        // Пересборка автоанимации - вызывается при ресайзе через брейкпоинт
        // Если автоанимация теперь выключена - останавливаем текущую и чистим таймер
        // Если включена - планируем следующий сценарий
        refreshAutoAnim() {
          if (!isAutoAnimEnabled()) {
            stopAuto();
          } else {
            schedulNext();
          }
        },
      };
    }

    // Список инстансов с их функциями управления автоанимацией
    // Используется чтобы при ресайзе через брейкпоинт остановить или запустить
    // автоанимацию на всех глазах сразу
    const instances = [];

    document.querySelectorAll('.hero__cover-eye').forEach(el => {
      const instance = initMagnet(el);
      if (instance) instances.push(instance);
    });

    // Реагируем на ресайз окна с дебаунсом
    // Если пересекли брейкпоинт - применяем актуальное состояние автоанимации
    let resizeTimer = null;
    let lastIsMobile = isMobile();

    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);

      resizeTimer = setTimeout(() => {
        const currentIsMobile = isMobile();

        // Реагируем только если реально пересекли брейкпоинт
        if (currentIsMobile === lastIsMobile) return;
        lastIsMobile = currentIsMobile;

        // Применяем новое состояние ко всем инстансам
        instances.forEach(inst => inst.refreshAutoAnim());
      }, 200);
    }, { passive: true });

  })();

  /**
   * GSAP Animation System
   *
   * data-animate                     - секция с пином (pin без spacing)
   * data-anim-scene                  - контекст для satellite и fly-through
   *
   * data-anim="parallax"             - параллакс одного блока
   *   data-anim-y="10%"              - амплитуда (default: 10%)
   *   data-anim-start="top 90%"      - start ScrollTrigger (default: top 90%)
   *   data-anim-end="bottom top"     - end ScrollTrigger (default: bottom top)
   *
   * data-anim="parallax-shadow"      - параллакс дочерних слоёв
   *   data-anim-start="top 90%"      - start ScrollTrigger (default: top 90%)
   *   data-anim-end="bottom top"     - end ScrollTrigger (default: bottom top)
   *   [children] data-anim-y="5%"    - y каждого слоя, дефолт по индексу [5%,7%,10%,12%,15%]
   *
   * data-anim="fadeLeft"             - влёт слева
   * data-anim="fadeRight"            - влёт справа
   * data-anim="fadeUp"               - влёт снизу
   * data-anim="fadeDown"             - влёт сверху
   *
   * data-anim="satellite"            - параллакс по диагонали 45 градусов (внутри data-anim-scene)
   *   data-anim-strength="300"       - амплитуда смещения (default: 300)
   *
   * data-anim="fly-through"          - влёт снизу -> зависание -> вылет вверх (внутри data-anim-scene)
   *
   * data-anim="bounce"               - бесконечное покачивание вверх-вниз
   *   data-anim-y="20"               - амплитуда в px (default: 20)
   *   data-anim-duration="1.5"       - длительность (default: 1.5)
   *   data-anim-ease="power1.inOut"  - easing (default: power1.inOut)
   *
   * data-anim="scale"                - пульсация масштаба или одноразовое появление
   *   data-anim-scale="1.1"          - целевой scale при пульсации (default: 1.1)
   *   data-anim-duration="1.5"       - длительность (default: 1.5)
   *   data-anim-ease="power1.inOut"  - easing (default: power1.inOut)
   *   data-anim-once                 - одноразовое появление от 0 до 1, триггер по центру экрана
   *
   * data-split="title"               - split-анимация заголовка (stagger 0.1, duration 0.6)
   *   data-anim-delay="0.5"          - ручная задержка в секундах
   *
   * data-split="text"                - split-анимация текста (stagger 0.05, duration 0.8)
   *   data-anim-delay="0.5"          - ручная задержка в секундах
   *
   * Авто-задержка split: если data-split находится внутри data-anim="scale" или "bounce",
   * задержка берётся автоматически из duration родителя
   */

  (function () {
    // Брейкпоинт уже есть ниже, выносим наверх чтобы использовать везде
    const MOBILE_BREAKPOINT = 600;
    const isMobile = () => window.innerWidth < MOBILE_BREAKPOINT;

    // Настройки анимаций для мобильной версии
    const MOBILE_CONFIG = {
      // fadeDuration: 0.3,
      fadeDuration: 0.5,
      fadeStart: 'top 100%',
      splitDurationTitle: 0.5,
      splitDurationText: 0.5,
      splitStart: 'top 100%',
      splitStaggerTitle: 0.06,
      splitStaggerText: 0.03,
    };

    // Реестр анимаций: element -> duration
    // Нужен чтобы дочерние split знали длительность родительской анимации
    const animRegistry = new Map();

    // Длительности fade-анимаций для расчёта задержки в группах
    // const FADE_DURATION = 0.3;
    const FADE_DURATION = 0.5;

    // data-anim-order - порядок внутри общего родителя
    // Группируем элементы по родителю, считаем накопленную задержку
    const orderMap = new Map();

    // gsap.utils.toArray('[data-anim-order]').forEach(el => {
    //   // Ищем ближайшего предка у которого тоже есть data-anim-order
    //   const orderParent = el.parentElement?.closest('[data-anim-order]') ?? el.parentElement;
    //   if (!orderMap.has(orderParent)) orderMap.set(orderParent, []);
    //   orderMap.get(orderParent).push(el);
    // });

    // Вспомогательная функция - глубина элемента в DOM
    function getDomDepth(el) {
      let depth = 0;
      let node = el;
      while (node.parentElement) {
        depth++;
        node = node.parentElement;
      }
      return depth;
    }

    // Сортируем группы по глубине - родители всегда обрабатываются раньше детей
    // Без этого вложенный блок может обработаться до родителя
    // и parent.dataset.animDelay будет ещё не установлен
    // Array.from(orderMap.entries())
    //   .sort((a, b) => getDomDepth(a[0]) - getDomDepth(b[0]))
    //   .forEach(([parent, els]) => {
    //     // els.sort((a, b) => parseInt(a.dataset.animOrder) - parseInt(b.dataset.animOrder));

    //     // На мобильном берём data-anim-order-mobile если он задан, иначе data-anim-order
    //     els.sort((a, b) => {
    //       const aOrder = parseInt(isMobile() && a.dataset.animOrderMobile ? a.dataset.animOrderMobile : a.dataset.animOrder);
    //       const bOrder = parseInt(isMobile() && b.dataset.animOrderMobile ? b.dataset.animOrderMobile : b.dataset.animOrder);
    //       return aOrder - bOrder;
    //     });

    //     // Дочерняя группа стартует после того как родитель закончил анимацию:
    //     // delay родителя + его duration
    //     const parentStartDelay = parseFloat(parent.dataset.animDelay ?? 0);
    //     const parentDuration = parseFloat(parent.dataset.animDuration ?? FADE_DURATION);
    //     const parentOrderDelay = parentStartDelay + parentDuration;
    //     let accumulated = 0;

    //     els.forEach(el => {
    //       // Первый элемент в группе всегда получает parentOrderDelay без накопления
    //       // Это гарантирует что order-1 на мобильном не получит задержку от order-2
    //       el.dataset.animDelay = (accumulated + parentOrderDelay).toFixed(3);
    //       const duration = parseFloat(el.dataset.animDuration ?? FADE_DURATION);
    //       accumulated += duration;
    //     });
    //   });

    function recalcAnimOrder() {
      // Очищаем карту перед пересчётом - иначе элементы задвоятся при ресайзе
      orderMap.clear();

      gsap.utils.toArray('[data-anim-order]').forEach(el => {
        const orderParent = el.parentElement?.closest('[data-anim-order]') ?? el.parentElement;
        if (!orderMap.has(orderParent)) orderMap.set(orderParent, []);
        orderMap.get(orderParent).push(el);
      });

      Array.from(orderMap.entries())
        .sort((a, b) => getDomDepth(a[0]) - getDomDepth(b[0]))
        .forEach(([parent, els]) => {
          // На мобильном берём data-anim-order-mobile если задан
          els.sort((a, b) => {
            const aOrder = parseInt(isMobile() && a.dataset.animOrderMobile ? a.dataset.animOrderMobile : a.dataset.animOrder);
            const bOrder = parseInt(isMobile() && b.dataset.animOrderMobile ? b.dataset.animOrderMobile : b.dataset.animOrder);
            return aOrder - bOrder;
          });

          const parentStartDelay = parseFloat(parent.dataset.animDelay ?? 0);
          // const parentDuration = parseFloat(parent.dataset.animDuration ?? FADE_DURATION);

          // parentDuration добавляем только если родитель сам анимируется
          // иначе первый дочерний элемент получает лишнюю задержку 0.5
          const parentHasAnim = parent.hasAttribute('data-anim') || parent.hasAttribute('data-split');
          const parentDuration = parentHasAnim ? parseFloat(parent.dataset.animDuration ?? FADE_DURATION) : 0;

          const parentOrderDelay = parentStartDelay + parentDuration;
          let accumulated = 0;

          els.forEach(el => {
            el.dataset.animDelay = (accumulated + parentOrderDelay).toFixed(3);
            const duration = parseFloat(el.dataset.animDuration ?? FADE_DURATION);
            accumulated += duration;
          });
        });
    }

    // Первичный расчёт
    recalcAnimOrder();

    // Пересчёт при ресайзе через дебаунс - не спамим пересчётами
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(recalcAnimOrder, 150);
    });

    // Ищет ближайшего зарегистрированного родителя, возвращает его duration
    function getParentDelay(el) {
      let node = el.parentElement;
      while (node) {
        if (animRegistry.has(node)) return animRegistry.get(node);
        node = node.parentElement;
      }
      return 0;
    }

    //
    // PIN - секции с пином без отступа
    //

    // gsap.utils.toArray('[data-animate]').forEach(section => {
    //   gsap.timeline({
    //     scrollTrigger: {
    //       trigger: section,
    //       start: 'top bottom-=30%',
    //     },
    //   });

    //   gsap.timeline({
    //     scrollTrigger: {
    //       trigger: section,
    //       start: 'bottom bottom',
    //       end: 'bottom top',
    //       pin: true,
    //       pinSpacing: false,
    //     },
    //   });
    // });

    gsap.utils.toArray('[data-animate]').forEach(section => {

      const prev = section.previousElementSibling;
      // const prev = document.querySelector('.main');

      if (!prev) return;

      // Пиним предыдущий блок чтобы он стоял на месте
      // пока data-animate поднимается поверх него
      ScrollTrigger.create({
        trigger: prev,
        start: 'bottom bottom',
        // Держим пин ровно на высоту data-animate блока
        end: () => `+=${section.offsetHeight}`,
        pin: true,
        pinSpacing: false,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      });

      // data-animate едет снизу вверх поверх предыдущего блока
      gsap.fromTo(section,
        {
          y: () => section.offsetHeight,
        },
        {
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: prev,
            // Начинаем когда верх предыдущего блока прибит к верху экрана
            start: 'top top',
            // Заканчиваем когда data-animate полностью перекрыл предыдущий
            end: () => `+=${section.offsetHeight}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    });

    //
    // PARALLAX - одиночный блок
    //

    gsap.utils.toArray('[data-anim="parallax"]').forEach(el => {
      const y = el.dataset.animY ?? '10%';
      const start = el.dataset.animStart ?? 'top 90%';
      const end = el.dataset.animEnd ?? 'bottom top';

      gsap.fromTo(el,
        { y: y },
        {
          y: `-${y}`,
          scrollTrigger: { trigger: el, start, end, scrub: true },
        }
      );
    });

    //
    // PARALLAX SHADOW - параллакс дочерних слоёв
    //

    const defaultYValues = ['5%', '7%', '10%', '12%', '15%'];

    gsap.utils.toArray('[data-anim="parallax-shadow"]').forEach(wrapper => {
      const start = wrapper.dataset.animStart ?? 'top 90%';
      const end = wrapper.dataset.animEnd ?? 'bottom top';

      Array.from(wrapper.children).forEach((layer, i) => {
        const y = layer.dataset.animY ?? defaultYValues[i] ?? '10%';

        gsap.fromTo(layer,
          { y: y },
          {
            y: `-${y}`,
            scrollTrigger: { trigger: wrapper, start, end, scrub: true },
          }
        );
      });
    });

    //
    // FADE - влёт с четырёх сторон
    //

    const fadeDirections = {
      fadeLeft: { xPercent: -100, yPercent: 0 },
      fadeRight: { xPercent: 100, yPercent: 0 },
      fadeUp: { xPercent: 0, yPercent: 100 },
      fadeDown: { xPercent: 0, yPercent: -100 },
    };

    // // Брейкпоинт мобильной версии
    // const MOBILE_BREAKPOINT = 600;

    // // Проверяем мобильное ли устройство прямо сейчас
    // const isMobile = () => window.innerWidth < MOBILE_BREAKPOINT;

    Object.entries(fadeDirections).forEach(([name, from]) => {
      gsap.utils.toArray(`[data-anim="${name}"]`).forEach(el => {

        const hasOrder = el.dataset.animOrder !== undefined;
        const trigger = hasOrder ? el.parentElement : el;

        // const manualDelay = parseFloat(el.dataset.animDelay ?? 0);
        // const parentDelay = (() => {
        //   const parent = el.closest('[data-anim]:not([data-anim="' + name + '"])');
        //   if (!parent) return 0;
        //   return parseFloat(parent.dataset.animDuration ?? FADE_DURATION);
        // })();

        // const delay = manualDelay || parentDelay;

        // Читаем атрибут data-anim-mobile="fadeRight"
        // Если атрибута нет -- используем исходное направление
        const mobileName = el.dataset.animMobile ?? name;
        const mobileDirection = fadeDirections[mobileName] ?? from;

        // Функция возвращает нужный from в зависимости от ширины экрана
        const getFrom = () => isMobile() ? mobileDirection : from;

        // Устанавливаем начальное состояние с учётом текущего устройства
        gsap.set(el, { xPercent: getFrom().xPercent, yPercent: getFrom().yPercent, opacity: 0 });

        ScrollTrigger.create({
          trigger,
          // start: 'top 85%',
          start: isMobile() ? MOBILE_CONFIG.fadeStart : 'top 90%',
          once: true,
          onEnter: () => {
            // Читаем delay в момент срабатывания - учитывает пересчитанный order для мобильного
            const manualDelay = parseFloat(el.dataset.animDelay ?? 0);
            const parentDelay = (() => {
              const parent = el.closest('[data-anim]:not([data-anim="' + name + '"])');
              if (!parent) return 0;
              return parseFloat(parent.dataset.animDuration ?? FADE_DURATION);
            })();
            const delay = manualDelay || parentDelay;

            // В момент срабатывания триггера пересчитываем направление
            // Это важно если пользователь изменил размер окна до скролла
            gsap.set(el, { xPercent: getFrom().xPercent, yPercent: getFrom().yPercent, opacity: 0 });

            gsap.to(el, {
              xPercent: 0,
              yPercent: 0,
              opacity: 1,
              // duration: FADE_DURATION,
              duration: isMobile() ? MOBILE_CONFIG.fadeDuration : FADE_DURATION,
              delay,
              ease: 'power2.out',
              overwrite: true,
            });
          },
        });
      });
    });

    //
    // СЦЕНЫ - satellite и fly-through
    //

    gsap.utils.toArray('[data-anim-scene]').forEach(scene => {

      // SATELLITE - параллакс по диагонали 45 градусов
      gsap.utils.toArray('[data-anim="satellite"]', scene).forEach(el => {
        const strength = parseFloat(el.dataset.animStrength ?? 300);

        gsap.fromTo(el,
          { x: -strength, y: strength },
          {
            x: strength,
            y: -strength,
            ease: 'none',
            scrollTrigger: {
              trigger: scene,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        );
      });

      // FLY-THROUGH - влёт -> зависание -> вылет
      gsap.utils.toArray('[data-anim="fly-through"]', scene).forEach(el => {
        gsap.timeline({
          scrollTrigger: {
            trigger: scene,
            start: 'top bottom',
            end: '50% top',
            scrub: 1,
          },
        })
          // Фаза 1 - влёт снизу
          .fromTo(el,
            { y: '80%', opacity: 1, scale: 1 },
            { y: '0%', opacity: 1, scale: 1, ease: 'power2.out', duration: 0.35 }
          )
          // Фаза 2 - зависание
          .to(el,
            { y: '0%', opacity: 1, scale: 1, ease: 'none', duration: 0.05 }
          )
          // Фаза 3 - вылет вверх
          .to(el,
            { y: '-100%', opacity: 0, scale: 0.85, ease: 'power2.in', duration: 0.25 }
          );
      });
    });

    //
    // BOUNCE - бесконечное покачивание
    //

    gsap.utils.toArray('[data-anim="bounce"]').forEach(el => {
      const y = parseFloat(el.dataset.animY ?? 20);
      const duration = parseFloat(el.dataset.animDuration ?? 1.5);
      const ease = el.dataset.animEase ?? 'power1.inOut';

      animRegistry.set(el, duration);

      gsap.to(el, { y, duration, ease, repeat: -1, yoyo: true });
    });

    //
    // SCALE - пульсация или одноразовое появление
    //

    gsap.utils.toArray('[data-anim="scale"]').forEach(el => {
      const scale = parseFloat(el.dataset.animScale ?? 1.1);
      const duration = parseFloat(el.dataset.animDuration ?? 1);
      const ease = el.dataset.animEase ?? 'power1.inOut';
      const once = el.dataset.animOnce !== undefined;

      animRegistry.set(el, duration);

      if (once) {
        gsap.fromTo(el,
          { scale: 0 },
          {
            scale: 1,
            duration,
            ease,
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              // start: isMobile() ? MOBILE_CONFIG.fadeStart : 'top 90%',
            },
          }
        );
      } else {
        gsap.to(el, { scale, duration, ease, repeat: -1, yoyo: true });
      }
    });

    //
    // SPLIT - общая функция для title и text
    //

    function initSplitAnim(container, { opacity, rotation, stagger, duration, start }) {

      // Переопределяем параметры для мобильной версии
      const activeDuration = isMobile() ? (
        stagger === 0.1
          ? MOBILE_CONFIG.splitDurationTitle
          : MOBILE_CONFIG.splitDurationText
      ) : duration;

      const activeStagger = isMobile() ? (
        stagger === 0.1
          ? MOBILE_CONFIG.splitStaggerTitle
          : MOBILE_CONFIG.splitStaggerText
      ) : stagger;

      const activeStart = isMobile() ? MOBILE_CONFIG.splitStart : start;

      const textSplits = container.querySelectorAll('*');

      const validTargets = Array.from(textSplits).filter(el =>
        el.tagName !== 'BR' &&
        el.tagName !== 'IMG' &&
        el.tagName !== 'SVG'
      );

      const targets = validTargets.length > 0 ? validTargets : [container];

      // Задержка: ручная из атрибута или автоматически от родительской анимации
      const manualDelay = parseFloat(container.dataset.animDelay ?? 0);
      const parentDelay = getParentDelay(container);
      const delay = manualDelay || parentDelay;

      targets.forEach(textSplit => {
        SplitText.create(textSplit, {
          type: 'words,lines',
          mask: 'lines',
          linesClass: 'line',
          autoSplit: true,
          onSplit: inst => {
            const lineHeight = inst.lines[0]?.offsetHeight ?? 50;
            gsap.from(inst.lines, {
              y: lineHeight / 10 + 'rem',
              opacity,
              rotation,
              // stagger,
              // duration,
              stagger: activeStagger,
              duration: activeDuration,
              delay,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: container,
                // start,
                start: activeStart,
                end: 'bottom top',
              },
            });
          },
        });
      });
    }

    // Split - заголовок
    gsap.utils.toArray('[data-split="title"]').forEach(container => {
      initSplitAnim(container, {
        opacity: 0,
        rotation: 0,
        stagger: 0.1,
        duration: 0.6,
        start: 'top 90%',
      });
    });

    // Split - текст
    gsap.utils.toArray('[data-split="text"]').forEach(container => {
      initSplitAnim(container, {
        opacity: 0,
        rotation: 2.5,
        stagger: 0.05,
        duration: 0.8,
        start: 'top 90%',
      });
    });

  })();

  /**
   * Анимация набора текста
   */
  (function () {

    // Возвращает Promise который резолвится только когда одновременно:
    // 1. #welcome отсутствует в DOM
    // 2. <html> не имеет класса popup-open
    function waitForReadyToType() {
      return new Promise(resolve => {

        function isReady() {
          const noWelcome = !document.getElementById('welcome');
          const noPopup = !document.documentElement.classList.contains('popup-open');
          return noWelcome && noPopup;
        }

        if (isReady()) {
          resolve();
          return;
        }

        const observer = new MutationObserver(() => {
          if (isReady()) {
            observer.disconnect();
            resolve();
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });

        observer.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['class'],
        });
      });
    }

    // Возвращает Promise который резолвится когда указанный элемент
    // получает указанный класс
    function waitForClass(selector, className) {
      return new Promise(resolve => {
        const el = document.querySelector(selector);
        if (!el) return;

        if (el.classList.contains(className)) {
          resolve();
          return;
        }

        const observer = new MutationObserver(() => {
          if (el.classList.contains(className)) {
            observer.disconnect();
            resolve();
          }
        });

        observer.observe(el, {
          attributes: true,
          attributeFilter: ['class'],
        });
      });
    }

    const groupMap = new Map();

    document.querySelectorAll('.typewriter').forEach(container => {
      const group = container.dataset.syncGroup;

      if (group) {
        if (!groupMap.has(group)) groupMap.set(group, []);
        groupMap.get(group).push(container);
      } else {
        initTypewriter(container);
      }
    });

    groupMap.forEach(containers => {
      initSyncGroup(containers);
    });

    function initSyncGroup(containers) {

      const first = containers[0];
      const TYPE_SPEED = parseFloat(first.dataset.typeSpeed ?? 0.07);
      const TYPE_VARIANCE = parseFloat(first.dataset.typeVariance ?? 0.04);
      const DELETE_SPEED = parseFloat(first.dataset.deleteSpeed ?? 0.04);
      const PAUSE_AFTER_TYPE = parseFloat(first.dataset.pauseAfterType ?? 2.0);
      const PAUSE_AFTER_DEL = parseFloat(first.dataset.pauseAfterDelete ?? 0.5);
      const START_DELAY = parseFloat(first.dataset.startDelay ?? 3) * 1000;

      const trigger = first.dataset.trigger ?? null;
      const triggerEl = first.dataset.triggerEl ?? null;

      let isStopped = false;
      let abortSignal = false;
      let stoppedCount = 0;

      const instances = containers.map(container =>
        initTypewriter(container, {
          externalControl: true,

          onStop: () => {
            stoppedCount++;
            if (!isStopped) abortSignal = true;
            isStopped = true;
          },

          onResume: () => {
            stoppedCount = Math.max(0, stoppedCount - 1);
            isStopped = stoppedCount > 0;
          },
        })
      );

      if (instances.some(inst => !inst)) return;

      const phraseCount = instances[0].phraseCount;
      if (phraseCount === 0) return;

      function getTypeDelay() {
        return TYPE_SPEED + (Math.random() * 2 - 1) * TYPE_VARIANCE;
      }

      function sleep(seconds) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
      }

      function sleepAbortable(seconds) {
        return new Promise(resolve => {
          const ms = seconds * 1000;
          const start = performance.now();

          const check = () => {
            if (abortSignal || performance.now() - start >= ms) resolve();
            else requestAnimationFrame(check);
          };

          requestAnimationFrame(check);
        });
      }

      // Набираем текст одного экземпляра посимвольно
      async function typeOne(inst, phraseIndex) {
        const steps = inst.getStepCount(phraseIndex);
        inst.prepareCursor(phraseIndex);

        for (let i = 0; i < steps; i++) {
          if (abortSignal) break;
          inst.typeStep(phraseIndex, i);
          await sleepAbortable(getTypeDelay());
        }

        inst.resumeCursor();
      }

      // Стираем текст одного экземпляра посимвольно
      async function deleteOne(inst, phraseIndex) {
        const steps = inst.getStepCount(phraseIndex);
        inst.prepareCursor(phraseIndex);

        for (let i = 0; i < steps; i++) {
          if (abortSignal) break;
          inst.deleteStep();
          await sleepAbortable(DELETE_SPEED);
        }

        inst.resumeCursor();
      }

      // Финальный stop-text набирается параллельно во всех экземплярах
      async function typeStopAll() {
        await Promise.all(instances.map(inst => inst.typeStopText()));
      }

      // Вспомогательная функция обработки abortSignal во время итерации
      async function handleAbort() {
        abortSignal = false;
        instances.forEach(inst => inst.clearSlots());
        await typeStopAll();
        isStopped = true;
      }

      async function runLoop() {

        instances.forEach(inst => inst.clearSlots());

        let phraseIndex = 0;

        while (true) {

          if (isStopped) { await sleep(0.1); continue; }

          // Последовательно набираем текст у каждого экземпляра
          for (const inst of instances) {

            if (isStopped) break;

            inst.clearSlots();
            inst.applyPhrase(phraseIndex);

            await typeOne(inst, phraseIndex);
            if (abortSignal) { await handleAbort(); break; }
          }

          if (isStopped) continue;

          // Пауза пока все экземпляры показывают набранный текст
          await sleepAbortable(PAUSE_AFTER_TYPE);
          if (abortSignal) { await handleAbort(); continue; }

          // Стираем все экземпляры одновременно
          await Promise.all(instances.map(inst => deleteOne(inst, phraseIndex)));
          if (abortSignal) { await handleAbort(); continue; }

          await sleepAbortable(PAUSE_AFTER_DEL);
          if (abortSignal) { await handleAbort(); continue; }

          // Переходим к следующей фразе
          phraseIndex = (phraseIndex + 1) % phraseCount;
        }
      }

      // Показываем stop-text сразу при инициализации
      instances.forEach(inst => inst.typeStopText());

      // Ждём триггера и запускаем
      const readyPromise = (trigger && triggerEl)
        ? waitForClass(triggerEl, trigger)
        : waitForReadyToType();

      readyPromise.then(() => {
        setTimeout(() => {
          runLoop();
        }, START_DELAY);
      });
    }

    function initTypewriter(container, options = {}) {

      const TYPE_SPEED = parseFloat(container.dataset.typeSpeed ?? 0.07);
      const TYPE_VARIANCE = parseFloat(container.dataset.typeVariance ?? 0.04);
      const DELETE_SPEED = parseFloat(container.dataset.deleteSpeed ?? 0.04);
      const PAUSE_AFTER_TYPE = parseFloat(container.dataset.pauseAfterType ?? 2.0);
      const PAUSE_AFTER_DEL = parseFloat(container.dataset.pauseAfterDelete ?? 0.5);

      const STOP_TEXT = container.dataset.stopText ?? null;
      const inputSelector = container.dataset.input ?? null;

      const inputEl = inputSelector ? document.querySelector(inputSelector) : null;
      const cursorEl = container.querySelector('.typewriter__cursor');

      const slots = Array.from(container.querySelectorAll('.typewriter__word')).map(el => ({
        el,
        words: el.dataset.words.split('|'),
      }));

      const phraseCount = slots[0]?.words.length ?? 0;
      if (phraseCount === 0) return null;

      let isStopped = false;
      let abortSignal = false;

      const onStop = options.onStop ?? null;
      const onResume = options.onResume ?? null;

      let cursorTween = gsap.to(cursorEl, {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'none',
      });

      function getTypeDelay() {
        return TYPE_SPEED + (Math.random() * 2 - 1) * TYPE_VARIANCE;
      }

      function sleep(seconds) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
      }

      function sleepAbortable(seconds) {
        return new Promise(resolve => {
          const ms = seconds * 1000;
          const start = performance.now();

          const check = () => {
            if (abortSignal || performance.now() - start >= ms) resolve();
            else requestAnimationFrame(check);
          };

          requestAnimationFrame(check);
        });
      }

      function moveCursorTo(wordEl) {
        wordEl.appendChild(cursorEl);
      }

      function clearSlots() {
        slots.forEach(slot => {
          slot.el.querySelectorAll('span:not(.typewriter__cursor)').forEach(s => s.remove());
        });
      }

      function applyPhrase(phraseIndex) {
        slots.forEach(slot => {
          slot.el.dataset.word = slot.words[phraseIndex] ?? '';
        });
      }

      function getStepCount(phraseIndex) {
        return Math.max(...slots.map(slot => (slot.words[phraseIndex] ?? '').length));
      }

      function prepareCursor(phraseIndex) {
        const lastActive = [...slots].reverse().find(slot => slot.words[phraseIndex ?? 0]);
        if (lastActive) moveCursorTo(lastActive.el);
      }

      function typeStep(phraseIndex, i) {
        cursorTween.pause();
        gsap.set(cursorEl, { opacity: 1 });

        slots.forEach(slot => {
          const word = slot.words[phraseIndex] ?? '';
          if (i >= word.length) return;

          const char = word[i];
          const span = document.createElement('span');
          span.innerHTML = char === ' ' ? '&nbsp;' : char;

          if (cursorEl.parentElement === slot.el) {
            slot.el.insertBefore(span, cursorEl);
          } else {
            slot.el.appendChild(span);
          }
        });
      }

      function deleteStep() {
        cursorTween.pause();
        gsap.set(cursorEl, { opacity: 1 });

        slots.forEach(slot => {
          const spans = slot.el.querySelectorAll('span:not(.typewriter__cursor)');
          if (spans.length === 0) return;
          spans[spans.length - 1].remove();
        });
      }

      function resumeCursor() {
        cursorTween.resume();
      }

      function restoreCursor() {
        gsap.killTweensOf(cursorEl);
        cursorTween = gsap.to(cursorEl, {
          opacity: 0,
          duration: 0.5,
          repeat: -1,
          yoyo: true,
          ease: 'none',
        });
      }

      async function typeStopText() {
        if (!STOP_TEXT) return;

        clearSlots();
        moveCursorTo(slots[0].el);

        for (const char of STOP_TEXT) {
          cursorTween.pause();
          gsap.set(cursorEl, { opacity: 1 });

          const span = document.createElement('span');
          span.innerHTML = char === ' ' ? '&nbsp;' : char;
          slots[0].el.insertBefore(span, cursorEl);

          await sleep(getTypeDelay());
        }

        cursorTween.kill();
        gsap.to(cursorEl, { opacity: 0, duration: 0.3 });
      }

      if (!options.externalControl) {

        async function typePhrase(phraseIndex) {
          for (const slot of slots) {
            const word = slot.words[phraseIndex] ?? '';
            if (!word) continue;

            moveCursorTo(slot.el);

            for (let i = 0; i < word.length; i++) {
              if (abortSignal) return;

              cursorTween.pause();
              gsap.set(cursorEl, { opacity: 1 });

              const char = word[i];
              const span = document.createElement('span');
              span.innerHTML = char === ' ' ? '&nbsp;' : char;
              slot.el.insertBefore(span, cursorEl);

              await sleepAbortable(getTypeDelay());
            }
          }

          resumeCursor();
        }

        async function deletePhrase(phraseIndex) {
          for (const slot of [...slots].reverse()) {
            const word = slot.words[phraseIndex] ?? '';
            if (!word) continue;

            moveCursorTo(slot.el);

            const spans = Array.from(
              slot.el.querySelectorAll('span:not(.typewriter__cursor)')
            ).reverse();

            for (const span of spans) {
              if (abortSignal) return;

              cursorTween.pause();
              gsap.set(cursorEl, { opacity: 1 });

              span.remove();

              await sleepAbortable(DELETE_SPEED);
            }
          }

          resumeCursor();
        }

        async function runLoop() {
          let index = 0;

          while (true) {
            if (isStopped) { await sleep(0.1); continue; }

            const phraseIndex = index % phraseCount;

            clearSlots();
            applyPhrase(phraseIndex);

            await typePhrase(phraseIndex);
            if (abortSignal) { abortSignal = false; await typeStopText(); isStopped = true; continue; }

            await sleepAbortable(PAUSE_AFTER_TYPE);
            if (abortSignal) { abortSignal = false; await typeStopText(); isStopped = true; continue; }

            await deletePhrase(phraseIndex);
            if (abortSignal) { abortSignal = false; await typeStopText(); isStopped = true; continue; }

            await sleepAbortable(PAUSE_AFTER_DEL);
            if (abortSignal) { abortSignal = false; await typeStopText(); isStopped = true; continue; }

            index++;
          }
        }

        if (inputEl) {
          let deactivateTimer = null;

          const activate = () => {
            clearTimeout(deactivateTimer);
            if (!isStopped) abortSignal = true;
          };

          const deactivate = () => {
            clearTimeout(deactivateTimer);
            deactivateTimer = setTimeout(() => {
              if (!isStopped) return;
              if (inputEl.classList.contains('filled') || inputEl.value?.trim()) return;
              isStopped = false;
              restoreCursor();
            }, 50);
          };

          inputEl.addEventListener('focus', activate);
          inputEl.addEventListener('blur', deactivate);

          const observer = new MutationObserver(() => {
            if (inputEl.classList.contains('filled')) {
              clearTimeout(deactivateTimer);
              if (!isStopped) abortSignal = true;
            } else {
              if (!inputEl.matches(':focus')) deactivate();
            }
          });

          observer.observe(inputEl, { attributes: true, attributeFilter: ['class'] });
        }

        runLoop();
      }

      if (options.externalControl && inputEl) {
        let selfStopped = false;
        let deactivateTimer = null;

        const activate = () => {
          clearTimeout(deactivateTimer);
          if (selfStopped) return;
          selfStopped = true;
          onStop?.();
        };

        const deactivate = () => {
          clearTimeout(deactivateTimer);
          deactivateTimer = setTimeout(() => {
            if (!selfStopped) return;
            if (inputEl.classList.contains('filled') || inputEl.value?.trim()) return;
            selfStopped = false;
            restoreCursor();
            onResume?.();
          }, 50);
        };

        inputEl.addEventListener('focus', activate);
        inputEl.addEventListener('blur', deactivate);

        const observer = new MutationObserver(() => {
          if (inputEl.classList.contains('filled')) {
            clearTimeout(deactivateTimer);
            activate();
          } else {
            if (!inputEl.matches(':focus')) deactivate();
          }
        });

        observer.observe(inputEl, { attributes: true, attributeFilter: ['class'] });
      }

      return {
        phraseCount,
        getStepCount,
        prepareCursor,
        typeStep,
        deleteStep,
        resumeCursor,
        applyPhrase,
        clearSlots,
        typeStopText,
        restoreCursor,
      };
    }

  })();

  /**
   * Анимация одноразового набора текста
   */
  (function () {

    const TYPE_SPEED = 0.07;
    const TYPE_VARIANCE = 0.04;

    function getTypeDelay() {
      return TYPE_SPEED + (Math.random() * 2 - 1) * TYPE_VARIANCE;
    }

    function sleep(seconds) {
      return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }

    /**
     * Ждём пока триггер войдёт в viewport.
     * triggerEl - элемент с data-type="once", он же и есть триггер.
     */
    function waitForVisible(triggerEl) {
      return new Promise(resolve => {
        const observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              observer.disconnect();
              resolve();
            }
          },
          { threshold: 0 }
        );

        observer.observe(triggerEl);
      });
    }

    function parseChildNodes(el) {
      const segments = [];

      el.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const value = node.textContent.replace(/\s+/g, ' ');
          if (value.trim() === '') return;
          segments.push({ type: 'text', value });
        }

        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') {
          segments.push({ type: 'br' });
        }

        if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BR') {
          segments.push({ type: 'element', el: node, text: node.textContent });
        }
      });

      return segments;
    }

    async function typeChild(childEl, cursor) {
      const segments = parseChildNodes(childEl);

      childEl.innerHTML = '';

      // Каждый дочерний тег получает свой курсор
      childEl.appendChild(cursor);

      const localCursorTween = gsap.to(cursor, {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'none',
        paused: true,
      });

      for (const segment of segments) {
        if (segment.type === 'br') {
          childEl.insertBefore(document.createElement('br'), cursor);
          continue;
        }

        if (segment.type === 'element') {
          const wrapEl = segment.el;
          wrapEl.textContent = '';
          childEl.insertBefore(wrapEl, cursor);

          for (const char of segment.text) {
            const span = document.createElement('span');
            span.innerHTML = char === ' ' ? '&nbsp;' : char;
            wrapEl.appendChild(span);
            await sleep(getTypeDelay());
          }
          continue;
        }

        for (const char of segment.value) {
          const span = document.createElement('span');
          span.innerHTML = char === ' ' ? '&nbsp;' : char;
          childEl.insertBefore(span, cursor);
          await sleep(getTypeDelay());
        }
      }

      // Каждый курсор убирает себя сам после печати
      localCursorTween.resume();
      await sleep(1.5);
      await new Promise(resolve => {
        gsap.to(cursor, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            cursor.remove();
            resolve();
          },
        });
      });
    }

    async function typeOnce(el) {
      const children = Array.from(el.children);
      if (children.length === 0) return;

      // Скрываем все дочерние теги до старта
      children.forEach(child => {
        child.style.visibility = 'hidden';
      });

      const cursor = document.createElement('span');
      Object.assign(cursor.style, {
        display: 'inline-block',
        fontWeight: '300',
        marginLeft: '0.2rem',
        opacity: '1',
      });
      cursor.textContent = '|';

      const localCursorTween = gsap.to(cursor, {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'none',
        paused: true,
      });

      await waitForVisible(el);

      localCursorTween.pause();
      gsap.set(cursor, { opacity: 1 });

      // Показываем все дочерние теги сразу и запускаем анимацию параллельно
      children.forEach(child => {
        child.style.visibility = 'visible';
      });

      // Promise.all - все дочерние теги печатаются одновременно
      await Promise.all(children.map(child => typeChild(child, cursor.cloneNode(true))));

      localCursorTween.resume();
      await sleep(1.5);
      gsap.to(cursor, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => cursor.remove(),
      });
    }

    document.querySelectorAll('[data-type="once"]').forEach(el => {
      typeOnce(el);
    });

  })();

  /**
   * Анимация чисел
   */
  (function initNumberRolls(selector = ".number-roll") {

    document.querySelectorAll(selector).forEach(el => {
      const digits = el.dataset.number.split("");
      el.innerHTML = digits.map(ch => {
        if (ch === ".") return `<span class="digit-container"><span class="digit"><span>.</span></span></span>`;
        let numSpan = "";
        for (let j = 0; j < 2; j++) for (let i = 0; i <= 9; i++) numSpan += `<span>${i}</span>`;
        return `<span class="digit-container"><span class="digit">${numSpan}</span></span>`;
      }).join("");

      ScrollTrigger.create({
        trigger: el, start: "top 100%", once: true,
        onEnter: () => el.querySelectorAll(".digit-container").forEach((container, i) => {
          const target = digits[i]; if (target === ".") return;
          const digitEl = container.querySelector(".digit");
          const t = gsap.to(digitEl, { y: "-10em", duration: 0.2 + Math.random() * 0.4, ease: "linear", repeat: -1 });
          gsap.delayedCall(1 + i * 0.3, () => {
            t.kill();
            const loops = Math.floor(digitEl.querySelectorAll("span").length / 10) - 1;
            gsap.to(digitEl, { y: -(loops * 10 + parseInt(target)) + "em", duration: 0.2 + i * 0.2, ease: "power3.out" });
          });
        })
      });
    });

  })();

  /**
   * Функция для блока produce
   * Индикатор для наведения на ссылки внутри produce__item-list
   * Метод обработки клика produce__item для присвоения активного класса в моб версии
   */
  (function () {

    // брейкпоинт для моб. версии
    const MOBILE_BREAKPOINT = 600;

    // Проверка мобильной версии
    function isMobile() {
      return window.innerWidth <= MOBILE_BREAKPOINT;
    }

    // ИНДИКАТОР - только для десктопа

    // document.querySelectorAll('.produce__item-list>ul').forEach(nav => {
    document.querySelectorAll('.popup__list').forEach(nav => {
      const indicator = document.createElement('div');
      indicator.className = 'produce__indicator';
      nav.appendChild(indicator);

      const links = nav.querySelectorAll('a');

      links.forEach(link => {
        link.addEventListener('mouseenter', () => {
          if (isMobile()) return;

          const li = link.closest('li');
          if (!li) return;
          const navRect = nav.getBoundingClientRect();
          const liRect = li.getBoundingClientRect();

          const top = liRect.top - navRect.top + nav.scrollTop;
          const height = (35 - liRect.height) / -2;

          indicator.style.top = `${top}px`;
          indicator.style.marginTop = `${height}px`;
          indicator.classList.add('is-visible');
        });
      });

      nav.addEventListener('mouseleave', () => {
        if (isMobile()) return;
        indicator.classList.remove('is-visible');
      });
    });

    // АКТИВНЫЙ КЛАСС - только для мобильных

    document.querySelectorAll('.produce__item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (!isMobile()) return;

        const isActive = item.classList.contains('produce__item--active');

        // Снимаем активный класс со всех
        document.querySelectorAll('.produce__item').forEach(el => {
          el.classList.remove('produce__item--active');
        });

        // Если клик по ссылке - не переключаем активный класс
        if (e.target.closest('a')) return;

        // Если айтем не был активен - делаем активным, иначе оставляем снятым
        if (!isActive) {
          item.classList.add('produce__item--active');
        }
      });
    });

    // Клик вне айтема - снимаем со всех
    document.addEventListener('click', (e) => {
      if (!isMobile()) return;
      if (e.target.closest('.produce__item')) return;

      document.querySelectorAll('.produce__item').forEach(el => {
        el.classList.remove('produce__item--active');
      });
    });

  })();

  /**
   * Функция для присвоения класса filled для заполненных форм
   */
  (function () {

    const form = document.querySelector('form');

    if (form) {
      const inputElements = document.querySelectorAll('.form-input');
      const textareaElements = document.querySelectorAll('.form-textarea');
      const className = 'filled';

      inputElements.forEach(element => {
        element.addEventListener('input', function () {
          if (this.value.trim() !== '') {
            element.classList.add(className);
          } else {
            element.classList.remove(className);
          }
        });
      });

      textareaElements.forEach(element => {
        element.addEventListener('input', function () {
          if (this.value.trim() !== '') {
            element.classList.add(className);
          } else {
            element.classList.remove(className);
          }
        });
      });
    }

  })();

  /**
   * Инициализация слайдера
   */
  (function swiperWrapper() {

    if (!document.querySelector('.swiper')) return;

    const globalImpulseOptions = {
      // Максимальный интервал между кликами в мс который считается быстрым
      fastClickDelay: 200,

      // Насколько сильно каждый быстрый клик увеличивает импульс
      // Формула: impulse += (fastClickDelay - delta) * accelerationFactor
      accelerationFactor: 0.23,

      // Коэффициент затухания импульса (0-1), теряет 15% каждые 40мс
      friction: 0.85,

      // Верхняя граница импульса, итоговый шаг = 1 + round(impulse)
      maxExtraSteps: 2,

      // Как часто пересчитывается затухание в мс, ~2-3 кадра при 60fps
      decayInterval: 40,
    };

    const slidersConfig = [
      // {
      //   sliderSelector: '.produce__slider',
      //   highlight: false,
      //   swiperOptions: {
      //     slidesPerGroup: 1,
      //     slidesPerView: 1,
      //     spaceBetween: 10,
      //     speed: 500,
      //     grabCursor: true,
      //     loop: false,
      //     touchRatio: 1.6,
      //     resistance: true,
      //     resistanceRatio: 0.4,
      //     centeredSlides: false,
      //     centeredSlidesBounds: true,
      //     simulateTouch: true,
      //     direction: 'horizontal',
      //     touchStartPreventDefault: true,
      //     touchMoveStopPropagation: true,
      //     threshold: 8,
      //     touchAngle: 25,
      //     watchOverflow: true,
      //     freeMode: {
      //       enabled: true,
      //       momentum: true,
      //       momentumRatio: 0.85,
      //       momentumVelocityRatio: 1,
      //       momentumBounce: false,
      //       sticky: true,
      //     },
      //     mousewheel: {
      //       forceToAxis: true,
      //       sensitivity: 1,
      //       releaseOnEdges: true,
      //     },
      //     navigation: false,
      //     breakpoints: {
      //       0: {
      //         slidesPerGroup: 1,
      //         slidesPerView: 1,
      //         spaceBetween: 20,
      //       },
      //       601: {
      //         slidesPerGroup: 1,
      //         slidesPerView: 2,
      //         spaceBetween: 20,
      //       },
      //       835: {
      //         slidesPerGroup: 1,
      //         slidesPerView: 3,
      //         spaceBetween: 80,
      //       },
      //     },
      //   },
      // },
      {
        sliderSelector: '.cases__slider',
        prevSelector: '.cases-button-prev',
        nextSelector: '.cases-button-next',
        highlight: false,
        swiperOptions: {
          slidesPerGroup: 1,
          slidesPerView: 1,
          spaceBetween: 40,
          speed: 500,
          grabCursor: true,
          loop: false,
          touchRatio: 1.6,
          resistance: true,
          resistanceRatio: 0.4,
          centeredSlides: false,
          centeredSlidesBounds: true,
          simulateTouch: true,
          direction: 'horizontal',
          touchStartPreventDefault: true,
          touchMoveStopPropagation: true,
          threshold: 8,
          touchAngle: 25,
          watchOverflow: true,
          freeMode: {
            enabled: true,
            momentum: true,
            momentumRatio: 0.85,
            momentumVelocityRatio: 1,
            momentumBounce: false,
            sticky: true,
          },
          mousewheel: {
            forceToAxis: true,
            sensitivity: 1,
            releaseOnEdges: true,
          },
          navigation: false,
        },
      },
      {
        sliderSelector: '.inform__slider',
        nextSelector: '.inform-button-next',
        highlight: false,
        edgeTracker: true,
        swiperOptions: {
          slidesPerGroup: 1,
          slidesPerView: 'auto',
          spaceBetween: 20,
          speed: 500,
          grabCursor: true,
          loop: false,
          touchRatio: 1.6,
          resistance: true,
          resistanceRatio: 0.4,
          centeredSlides: false,
          centeredSlidesBounds: false,
          simulateTouch: true,
          direction: 'horizontal',

          // touchStartPreventDefault: true,
          touchStartPreventDefault: false,
          // touchMoveStopPropagation: true,
          touchMoveStopPropagation: false,

          threshold: 8,
          touchAngle: 25,
          watchOverflow: true,
          freeMode: false,
          mousewheel: {
            forceToAxis: true,
            sensitivity: 1,
            releaseOnEdges: true,
          },
          // scrollbar: {
          //   el: ".inform-swiper-scrollbar",
          //   hide: true,
          //   draggable: true,
          // },
          scrollbar: false,
          navigation: false,
          breakpoints: {
            0: {
              slidesPerGroup: 1,
              slidesPerView: 'auto',
              spaceBetween: 20,
            },
            601: {
              slidesPerGroup: 1,
              slidesPerView: 2,
              spaceBetween: 20,
            },
            835: {
              slidesPerGroup: 1,
              slidesPerView: 2,
              spaceBetween: 40,
            },
          },
          on: {
            init(swiper) {
              updateRect(swiper);
            },
          },
        },
      },
      {
        sliderSelector: '.awards__slider',
        nextSelector: '.awards-button-next',
        highlight: false,
        edgeTracker: false,
        swiperOptions: {
          slidesPerGroup: 1,
          slidesPerView: 1,
          spaceBetween: 40,
          speed: 800,
          grabCursor: true,
          loop: true,
          touchRatio: 1.6,
          resistance: true,
          resistanceRatio: 0.4,
          centeredSlides: false,
          centeredSlidesBounds: false,
          simulateTouch: true,
          direction: 'horizontal',
          touchStartPreventDefault: true,
          touchMoveStopPropagation: true,
          threshold: 8,
          touchAngle: 25,
          watchOverflow: true,
          freeMode: false,
          mousewheel: {
            forceToAxis: true,
            sensitivity: 1,
            releaseOnEdges: true,
          },
          navigation: false,
        },
      },
    ];


    // Инициализируем каждый слайдер из конфига
    slidersConfig.forEach(({ sliderSelector, prevSelector, nextSelector, highlight, swiperOptions }) => {

      if (!document.querySelector(sliderSelector)) return;

      // Ищем кнопки только если селекторы заданы в конфиге
      // Если prevSelector/nextSelector не указаны - слайдер без кнопок навигации
      const prevEl = prevSelector ? document.querySelector(prevSelector) : null;
      const nextEl = nextSelector ? document.querySelector(nextSelector) : null;

      // ищем highlight-элементы только если в конфиге явно указано highlight: true
      // если false или не указано - передаём null и createHighlight вернёт заглушку
      const fromEl = highlight ? document.querySelector(`${sliderSelector} .slider-highlight--from`) : null;
      const toEl = highlight ? document.querySelector(`${sliderSelector} .slider-highlight--to`) : null;

      const swiper = new Swiper(sliderSelector, swiperOptions);

      // Управление пагинацией через кастомный флаг hidePagination в брейкпоинтах
      initPaginationBreakpoint(swiper);

      // highlight создаём всегда - если элементов нет, вернётся заглушка
      // edgeTracker и navigation получат корректный объект в любом случае
      const highlightInstance = createHighlight(swiper, fromEl, toEl);

      // EdgeTracker подключаем только если slidesPerView больше 1 хотя бы
      // в одном брейкпоинте или в базовых настройках - иначе смысла нет
      const needsEdgeTracker = shouldUseEdgeTracker(swiperOptions);
      const edgeTracker = needsEdgeTracker
        ? createEdgeTracker(swiper, highlightInstance)
        : createEdgeTrackerStub();

      // Навигацию подключаем только если обе кнопки реально найдены в DOM
      if (prevEl || nextEl) {
        createNavigation(swiper, prevEl, nextEl, highlightInstance, edgeTracker);
      }
    });


    // Проверяет нужен ли edgeTracker для данного слайдера.
    // Смотрим на базовый slidesPerView и на все брейкпоинты -
    // если хоть где-то больше 1 (и не 'auto') то tracker нужен
    function shouldUseEdgeTracker(swiperOptions) {
      const base = swiperOptions.slidesPerView;
      if (typeof base === 'number' && base > 1) return true;

      const breakpoints = swiperOptions.breakpoints ?? {};
      return Object.values(breakpoints).some(bp => {
        return typeof bp.slidesPerView === 'number' && bp.slidesPerView > 1;
      });
    }


    // Заглушка edgeTracker для слайдеров где он не нужен (slidesPerView = 1).
    // Возвращает тот же API что и настоящий edgeTracker - navigation не знает разницы
    function createEdgeTrackerStub() {
      return {
        handleEdgeNext: () => false,
        handleEdgePrev: () => false,
        clearVirtual: () => { },
        getVirtualIndex: () => null,
      };
    }


    // Управление видимостью пагинации через кастомный флаг hidePagination.
    // Swiper не умеет включать/выключать пагинацию через breakpoints нативно,
    // поэтому слушаем событие breakpoint и управляем display вручную
    function initPaginationBreakpoint(swiper) {
      const paginationEl = swiper.pagination?.el;
      if (!paginationEl) return;

      function applyVisibility() {
        // currentBreakpointParams содержит параметры активного брейкпоинта
        const params = swiper.currentBreakpointParams ?? {};
        paginationEl.style.display = params.hidePagination === true ? 'none' : '';
      }

      swiper.on('breakpoint', applyVisibility);

      // Проверяем сразу после инициализации - брейкпоинт уже мог сработать
      applyVisibility();
    }


    // Highlight - анимированный фон резинка между слайдами.
    // Если элементов --from и --to нет в DOM - возвращаем заглушку.
    // Заглушка имеет тот же API поэтому edgeTracker работает без изменений
    function createHighlight(swiper, fromEl, toEl) {

      // Нет элементов - возвращаем заглушку с рабочим getGeometry
      // edgeTracker использует getGeometry для расчётов даже без визуала
      if (!fromEl || !toEl) {
        return {
          animateTo: () => { },
          snapInstant: () => { },
          getGeometry: (index) => {
            const slide = swiper.slides[index];
            if (!slide) return null;
            return {
              x: slide.offsetLeft + (swiper.translate ?? 0),
              width: slide.offsetWidth,
            };
          },
          getCurrentX: () => 0,
          getCurrentW: () => 0,
        };
      }

      const DURATION = 320;
      const EASE_OUT = 'cubic-bezier(0.4, 0, 0.2, 1)';
      const EASE_SNAP = 'cubic-bezier(0.34, 1.4, 0.64, 1)';

      let currentX = 0;
      let currentWidth = 0;
      let rafId = null;

      function getGeometry(index) {
        const slide = swiper.slides[index];
        if (!slide) return null;
        return {
          x: slide.offsetLeft + (swiper.translate ?? 0),
          width: slide.offsetWidth,
        };
      }

      function setInstant(el, x, width, visible) {
        el.style.transition = 'none';
        el.style.transform = `translateX(${x}px)`;
        el.style.width = `${width}px`;
        el.classList.toggle('is-visible', visible);
      }

      function setAnimated(el, x, width, duration, easing, visible) {
        el.style.transition = [
          `transform ${duration}ms ${easing}`,
          `width ${duration}ms ${easing}`,
          `opacity ${duration * 0.6}ms ease`,
        ].join(', ');
        el.style.transform = `translateX(${x}px)`;
        el.style.width = `${width}px`;
        el.classList.toggle('is-visible', visible);
      }

      function animateTo(toX, toWidth, dir) {
        if (rafId) cancelAnimationFrame(rafId);

        const fromX = currentX;
        const fromWidth = currentWidth;
        const collapseX = dir === 'next' ? fromX + fromWidth : fromX;
        const startX = dir === 'next' ? toX : toX + toWidth;

        setInstant(fromEl, fromX, fromWidth, true);
        setInstant(toEl, startX, 0, true);

        // Двойной RAF гарантирует что стили шага 1 применены до старта анимации
        rafId = requestAnimationFrame(() => {
          rafId = requestAnimationFrame(() => {
            rafId = null;
            setAnimated(fromEl, collapseX, 0, DURATION, EASE_OUT, false);
            setAnimated(toEl, toX, toWidth, DURATION, EASE_SNAP, true);
          });
        });

        // Фиксируем целевую геометрию сразу - не ждём конца анимации
        // Следующий вызов animateTo возьмёт правильную стартовую точку
        currentX = toX;
        currentWidth = toWidth;
      }

      function snapInstant(index) {
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        const geo = getGeometry(index);
        if (!geo) return;
        setInstant(fromEl, geo.x, geo.width, true);
        setInstant(toEl, geo.x, 0, false);
        currentX = geo.x;
        currentWidth = geo.width;
      }

      swiper.on('slideChange', () => {
        const curr = swiper.activeIndex;
        const prev = swiper.previousIndex ?? curr;
        const dir = curr >= prev ? 'next' : 'prev';
        const geo = getGeometry(curr);
        if (geo) animateTo(geo.x, geo.width, dir);
      });

      swiper.on('transitionEnd', () => {
        setInstant(fromEl, currentX, currentWidth, true);
        setInstant(toEl, currentX, 0, false);
      });

      swiper.on('setTranslate', () => {
        if (swiper.animating) return;
        const geo = getGeometry(swiper.activeIndex);
        if (!geo) return;
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        setInstant(fromEl, geo.x, geo.width, true);
        setInstant(toEl, geo.x, 0, false);
        currentX = geo.x;
        currentWidth = geo.width;
      });

      swiper.on('resize', () => snapInstant(swiper.activeIndex));

      snapInstant(swiper.activeIndex ?? 0);

      return {
        animateTo,
        snapInstant,
        getGeometry,
        getCurrentX: () => currentX,
        getCurrentW: () => currentWidth,
      };
    }


    // EdgeTracker - виртуальный активный слайд когда wrapper упёрся в край.
    // Проблема: при slidesPerView > 1 последние слайды никогда не получают
    // swiper-slide-active потому что wrapper уже не может сдвинуться.
    // Решение: вручную двигаем виртуальный активный по оставшимся слайдам
    function createEdgeTracker(swiper, highlight) {

      const VIRTUAL_CLASS = 'is-virtual-active';
      const BEFORE_EDGE_CLASS = 'is-before-edge';

      let virtualIndex = null;

      function getVisibleIndices() {
        const containerWidth = swiper.width;
        const offset = Math.abs(swiper.translate ?? 0);
        const visible = [];
        swiper.slides.forEach((slide, i) => {
          const left = slide.offsetLeft;
          const right = left + slide.offsetWidth;
          if (right > offset && left < offset + containerWidth) visible.push(i);
        });
        return visible;
      }

      function clearBeforeEdge() {
        swiper.slides.forEach(s => s.classList.remove(BEFORE_EDGE_CLASS));
      }

      function markBeforeEdge() {
        clearBeforeEdge();
        swiper.slides.forEach(s => {
          if (s.classList.contains('swiper-slide-active')) {
            s.classList.add(BEFORE_EDGE_CLASS);
          }
        });
      }

      function clearVirtual() {
        swiper.slides.forEach(s => s.classList.remove(VIRTUAL_CLASS));
        clearBeforeEdge();
        virtualIndex = null;
      }

      function setVirtualActive(index, dir) {
        if (virtualIndex === null) markBeforeEdge();
        swiper.slides.forEach(s => s.classList.remove(VIRTUAL_CLASS));
        virtualIndex = index;
        swiper.slides[index]?.classList.add(VIRTUAL_CLASS);

        // highlight может быть заглушкой - вызываем в любом случае
        const geo = highlight.getGeometry(index);
        if (geo) highlight.animateTo(geo.x, geo.width, dir);
      }

      function handleEdgeNext() {
        if (!swiper.isEnd) return false;
        const visible = getVisibleIndices();
        if (!visible.length) return false;
        const lastVisible = visible[visible.length - 1];
        const current = virtualIndex ?? swiper.activeIndex;
        if (current >= lastVisible) return true;
        setVirtualActive(current + 1, 'next');
        return true;
      }

      function handleEdgePrev() {
        if (virtualIndex === null) return false;
        const current = virtualIndex;
        const realActive = swiper.activeIndex;
        if (current <= realActive) {
          clearVirtual();
          highlight.snapInstant(realActive);
          return false;
        }
        setVirtualActive(current - 1, 'prev');
        return true;
      }

      swiper.on('slideChange', () => {
        if (virtualIndex !== null) clearVirtual();
      });

      swiper.on('fromEdge', () => {
        clearVirtual();
      });

      return {
        handleEdgeNext,
        handleEdgePrev,
        clearVirtual,
        getVirtualIndex: () => virtualIndex,
      };
    }


    // Navigation - кнопки + импульс + disabled состояние.
    // Вызывается только если у слайдера есть обе кнопки навигации.
    // Получает edgeTracker который может быть настоящим или заглушкой
    function createNavigation(swiper, prevEl, nextEl, highlight, edgeTracker) {

      const {
        fastClickDelay = 200,
        accelerationFactor = 0.23,
        friction = 0.85,
        maxExtraSteps = 2,
        decayInterval = 40,
      } = globalImpulseOptions;

      let lastClickTime = 0;
      let lastDirection = null;
      let extraImpulse = 0;
      let decayTimer = null;

      function resetImpulse() {
        extraImpulse = 0;
        lastDirection = null;
        if (decayTimer) clearInterval(decayTimer);
        decayTimer = null;
      }

      function accumulateImpulse(direction) {
        const now = Date.now();
        const delta = now - lastClickTime;

        if (lastDirection !== null && lastDirection !== direction) {
          extraImpulse = 0;
        }

        extraImpulse = delta < fastClickDelay
          ? Math.min(extraImpulse + (fastClickDelay - delta) * accelerationFactor, maxExtraSteps)
          : 0;

        lastClickTime = now;
        lastDirection = direction;

        if (decayTimer) clearInterval(decayTimer);
        decayTimer = setInterval(() => {
          extraImpulse *= friction;
          if (extraImpulse < 0.2) {
            extraImpulse = 0;
            clearInterval(decayTimer);
            decayTimer = null;
          }
        }, decayInterval);
      }

      function getVisibleIndicesForNav() {
        const containerWidth = swiper.width;
        const offset = Math.abs(swiper.translate ?? 0);
        const visible = [];
        swiper.slides.forEach((slide, i) => {
          const left = slide.offsetLeft;
          const right = left + slide.offsetWidth;
          if (right > offset && left < offset + containerWidth) visible.push(i);
        });
        return visible;
      }

      function updateDisabled() {
        if (swiper.params.loop) return;

        const isStart = swiper.isBeginning && edgeTracker.getVirtualIndex() === null;

        let nextBlocked = false;
        if (swiper.isEnd) {
          const visible = getVisibleIndicesForNav();
          const lastVisible = visible[visible.length - 1] ?? swiper.activeIndex;
          const currentVirt = edgeTracker.getVirtualIndex() ?? swiper.activeIndex;
          nextBlocked = currentVirt >= lastVisible;
        }

        // disabled как свойство а не атрибут - клик всё равно доходит
        // до нашего обработчика даже когда кнопка визуально заблокирована
        if (prevEl) { prevEl.classList.toggle('swiper-button-disabled', isStart); prevEl.disabled = isStart; }
        if (nextEl) { nextEl.classList.toggle('swiper-button-disabled', nextBlocked); nextEl.disabled = nextBlocked; }
      }

      function handle(direction) {
        if (direction === 'next' && edgeTracker.handleEdgeNext()) {
          updateDisabled();
          return;
        }
        if (direction === 'prev' && edgeTracker.handleEdgePrev()) {
          updateDisabled();
          return;
        }

        accumulateImpulse(direction);
        const steps = 1 + Math.round(extraImpulse);

        // if (swiper.params.loop) {
        //   const total = swiper.slides.length - (swiper.loopedSlides ?? 0) * 2;
        //   const curr = swiper.realIndex;
        //   const target = direction === 'next'
        //     ? (curr + steps) % total
        //     : (curr - steps + total) % total;
        //   swiper.slideToLoop(target);
        // }
        if (swiper.params.loop) {
          if (direction === 'next') {
            swiper.slideNext();
          } else {
            swiper.slidePrev();
          }
          return;
        } else {
          const base = swiper.activeIndex;
          const target = direction === 'next'
            ? Math.min(base + steps, swiper.slides.length - 1)
            : Math.max(base - steps, 0);
          swiper.slideTo(target);
        }

        // if (nextEl) nextEl.addEventListener('click', (e) => {
        //   e.preventDefault();
        //   console.log('next clicked', swiper.realIndex);
        //   handle('next');
        // });

        // console.log('loopedSlides:', swiper.loopedSlides);
        // console.log('slides.length:', swiper.slides.length);

        updateDisabled();
      }

      if (nextEl) nextEl.addEventListener('click', (e) => { e.preventDefault(); handle('next'); });
      if (prevEl) prevEl.addEventListener('click', (e) => { e.preventDefault(); handle('prev'); });

      swiper.on('touchStart', resetImpulse);
      swiper.on('slideChange', updateDisabled);
      swiper.on('resize', updateDisabled);
      swiper.on('touchEnd', () => {
        const dir = swiper.swipeDirection;
        if (dir === 'next') edgeTracker.handleEdgeNext();
        else if (dir === 'prev') edgeTracker.handleEdgePrev();
        updateDisabled();
      });

      swiper.on('destroy', () => {
        if (decayTimer) clearInterval(decayTimer);
        decayTimer = null;
      });

      updateDisabled();
    }

    /**
     * логика свг пагинации
     */
    // function updateRect(swiper) {
    //   // Дорожка - красный rect на всю ширину (x="29.2891" width="644.814")
    //   const TRACK_START = 29.2891;
    //   const TRACK_END = 29.2891 + 644.814; // 674.1031
    //   const RECT_WIDTH = 53.6474;

    //   // Крайние позиции rect-индикатора:
    //   // левый край = начало дорожки
    //   // правый край = конец дорожки минус ширина rect
    //   const POS_MIN = TRACK_START;
    //   const POS_MAX = TRACK_END - RECT_WIDTH; // 620.4557

    //   const total = swiper.slides.length - 1; // количество шагов
    //   const index = swiper.realIndex;
    //   const progress = total > 0 ? index / total : 0;
    //   const targetX = POS_MIN + (POS_MAX - POS_MIN) * progress;

    //   const rect = document.getElementById('inform__rect');

    //   gsap.to(rect, {
    //     attr: { x: targetX },
    //     duration: 0.4,
    //     ease: 'power2.out',
    //   });
    // }
    function updateRect(swiper) {
      const scrollbarRect = document.getElementById('inform__rect');

      // Координаты трека на основе SVG
      const rectTrackStartX = 61.5645; // Начало красной линии
      const rectTrackEndX = 600.339;   // Конец красной линии с учётом ширины rect
      const trackLength = rectTrackEndX - rectTrackStartX; // 812.474

      // Синхронизация позиции rect с прогрессом слайдера
      swiper.on('progress', function () {
        if (isDragging) return;
        const progress = swiper.progress; // 0–1
        const newX = rectTrackStartX + progress * trackLength;
        scrollbarRect.setAttribute('x', newX.toFixed(3));
      });

      // Инициализация при загрузке
      swiper.on('init', function () {
        swiper.update();
        const initialX = rectTrackStartX;
        scrollbarRect.setAttribute('x', initialX.toFixed(3));
      });

      // Drag-and-drop для rect
      let isDragging = false;
      let startClientX = 0; // Координата мыши при начале перетаскивания
      let initialRectX = 0; // Начальная координата rect при начале перетаскивания

      scrollbarRect.addEventListener('mousedown', startDrag);
      scrollbarRect.addEventListener('touchstart', startDrag);

      function startDrag(e) {
        isDragging = true;
        e.preventDefault();

        // Получаем начальные координаты
        startClientX = e.clientX || e.touches[0].clientX;
        initialRectX = parseFloat(scrollbarRect.getAttribute('x'));

        // Кешируем размер SVG один раз при начале drag
        // Не вызываем getBoundingClientRect на каждый mousemove - дорогая операция
        const svgEl = document.getElementById('inform__svg');
        cachedSvgScreenWidth = svgEl.getBoundingClientRect().width;
        // Отключаем CSS transition во время drag - иначе rect плетётся за курсором
        scrollbarRect.style.transition = 'none';

        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag);
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchend', stopDrag);
      }

      let cachedSvgScreenWidth = 0;
      let lastSlideTime = 0;

      function drag(e) {
        if (!isDragging) return;

        const currentClientX = e.clientX || e.touches[0].clientX;
        const deltaClientX = currentClientX - startClientX; // Смещение мыши в пикселях экрана

        // Переводим смещение мыши в смещение rect относительно трека
        // Коэффициент масштабирования: длина трека SVG / ширина контейнера слайдера
        // const containerWidth = swiper.el.offsetWidth;
        // const scaleFactor = trackLength / containerWidth;
        // const deltaRectX = deltaClientX * scaleFactor;

        // Считаем масштаб через реальную ширину SVG на экране
        // Так rect двигается точно за курсором при любом размере SVG
        // const svgEl = document.getElementById('inform__svg');
        // const svgScreenWidth = svgEl.getBoundingClientRect().width;
        const svgViewBoxWidth = 1104; // width из viewBox SVG
        // const scaleFactor = svgViewBoxWidth / svgScreenWidth;

        const scaleFactor = svgViewBoxWidth / cachedSvgScreenWidth;
        const deltaRectX = deltaClientX * scaleFactor;

        let newRectX = initialRectX + deltaRectX;

        // Ограничиваем перемещение в пределах трека
        newRectX = Math.max(rectTrackStartX, Math.min(newRectX, rectTrackEndX));

        // Обновляем позицию rect
        scrollbarRect.setAttribute('x', newRectX.toFixed(3));

        // Переводим позицию rect в прогресс слайдера
        const progress = (newRectX - rectTrackStartX) / trackLength;

        // Устанавливаем слайд по прогрессу
        swiper.slideTo(
          Math.round(progress * (swiper.slides.length - 1)),
          // 1 // Без анимации при перетаскивании
          300
        );
      }

      function stopDrag() {
        isDragging = false;

        scrollbarRect.style.transition = '';

        document.removeEventListener('mousemove', drag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchend', stopDrag);
      }
    }

  })();

  /**
   * Функция для пунктов и подпунктов меню
   */
  (function () {
    const menuListDropdowns = document.querySelectorAll('.menu__list-item--dropdown');
    const burgerMenu = document.getElementById('burger-menu');
    const menuListItems = document.querySelectorAll('.menu__list-item:not(.menu__list-item--dropdown)');

    let isClosing = false;

    // Сброс всех активных классов во всех дропдаунах
    function closeAll() {
      isClosing = true;

      document.documentElement.classList.remove('menu-list--active', 'menu-nav--active');

      menuListDropdowns.forEach(dropdown => {
        dropdown.classList.remove('list--active');
        dropdown.querySelectorAll('.menu__nav-item').forEach(item => {
          item.classList.remove('item--active');
        });
      });

      isClosing = false;
    }

    // Наводимся на обычный пункт - скрываем дропдаун список
    menuListItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        burgerMenu.classList.remove('list-dropdown-active');
      });
    });
    // Возвращаем класс только при выходе за пределы всего меню
    burgerMenu.addEventListener('mouseleave', (e) => {
      // Проверяем куда ушёл курсор - если внутрь меню то игнорируем
      if (burgerMenu.contains(e.relatedTarget)) return;
      if (document.documentElement.classList.contains('menu--open')) return;
      burgerMenu.classList.add('list-dropdown-active');
    });

    menuListDropdowns.forEach(dropdown => {
      const menuListLink = dropdown.querySelector('.menu__list-link');
      const menuNavItems = dropdown.querySelectorAll('.menu__nav-item');

      menuListLink.addEventListener('click', e => {
        e.stopPropagation();

        const isActive = dropdown.classList.contains('list--active');

        // Закрываем все перед открытием нового - один активный дропдаун
        closeAll();

        if (!isActive) {
          document.documentElement.classList.add('menu-list--active');
          dropdown.classList.add('list--active');
        }
      });

      menuNavItems.forEach(menuNavItem => {
        menuNavItem.addEventListener('click', e => {
          e.stopPropagation();

          const isActive = menuNavItem.classList.contains('item--active');

          menuNavItems.forEach(item => item.classList.remove('item--active'));

          if (isActive) {
            document.documentElement.classList.remove('menu-nav--active');
          } else {
            document.documentElement.classList.add('menu-nav--active');
            menuNavItem.classList.add('item--active');
          }
        });
      });
    });

    // Клик вне дропдауна - закрываем всё
    document.addEventListener('click', e => {
      if (e.target.closest('.menu__list-item--dropdown')) return;
      closeAll();
    });

    document.addEventListener('menu:close', () => {
      closeAll();
      // При закрытии меню возвращаем класс
      // burgerMenu.classList.add('list-dropdown-active');
      if (!document.documentElement.classList.contains('menu--open')) {
        burgerMenu.classList.add('list-dropdown-active');
      }
    });

    // Закрытие меню - сбрасываем все классы внутри дропдаунов
    // Слушаем удаление класса menu--active с html если меню закрывается снаружи

  })();

  /**
   * Функция для добавления активного класса при наведении на пункты меню
   */
  (function () {
    const menuListDropdowns = document.querySelectorAll('.menu__list-item--dropdown');

    if (menuListDropdowns.length) {
      menuListDropdowns.forEach(item => {
        item.addEventListener('mouseenter', () => {
          document.documentElement.classList.add('menu-item-hover');
        });
        item.addEventListener('mouseleave', () => {
          document.documentElement.classList.remove('menu-item-hover');
        });
      });
    }
  })();

  /**
   * ВЫПАДАЮЩИЙ СПИСОК (dropdown--js)
   *    
   * Кастомный select на основе radio-инпутов.
   * Открывается кликом, закрывается кликом вне или выбором опции.
   */
  (function () {
    const html = document.documentElement;

    const dropdowns = document.querySelectorAll('.dropdown--js');
    if (!dropdowns.length) return;

    dropdowns.forEach(dropdown => {
      const isCityDropdown = dropdown.classList.contains('js-city-dropdown');

      const selectedJs = dropdown.querySelector('.dropdown__selected--js');
      const selectedInputJs = dropdown.querySelector('.dropdown__selected-input--js');
      const selectedLabelJs = dropdown.querySelector('.dropdown__selected-label--js');
      const dropdownRadios = dropdown.querySelectorAll('.dropdown__radio');
      const dropdownValue = dropdown.querySelector('.dropdown__value');

      if (!selectedJs) return;

      selectedJs.addEventListener('click', e => {
        e.stopPropagation();
        dropdown.classList.toggle('is-active');
      });

      document.addEventListener('click', e => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove('is-active');
        }
      });

      dropdownRadios.forEach(radio => {
        radio.addEventListener('change', () => {
          if (!radio.checked) return;

          const dataValue = radio.dataset.city;
          const value = radio.value;

          // Обновляем UI в текущем dropdown
          // if (selectedLabelJs) selectedLabelJs.textContent = value;
          if (selectedInputJs) selectedInputJs.value = value;
          if (dropdownValue) dropdownValue.value = value;

          // Только для dropdown с городами
          if (isCityDropdown) {
            // 1) Синхронизируем ВСЕ js-city-dropdown:
            // меняем текст и input, а также отмечаем нужную радиокнопку в каждом dropdown
            const allCityDropdowns = document.querySelectorAll('.dropdown--js.js-city-dropdown');

            allCityDropdowns.forEach(cityDropdown => {
              const label = cityDropdown.querySelector('.dropdown__selected-label--js');
              const input = cityDropdown.querySelector('.dropdown__selected-input--js');
              const hiddenValue = cityDropdown.querySelector('.dropdown__value');

              if (label) label.textContent = value;
              if (input) input.value = value;
              if (hiddenValue) hiddenValue.value = value;

              // Отмечаем нужную радиокнопку в каждом dropdown по data-city
              const cityRadios = cityDropdown.querySelectorAll('.dropdown__radio');
              cityRadios.forEach(r => {
                // dataset.city хранит код города, который мы и используем для синхронизации
                if (r.dataset.city === dataValue) {
                  r.checked = true;
                }
              });
            });
          }

          dropdown.classList.remove('is-active');
          dropdown.classList.add('filled');
        });
      });
    });
  })();

  /**
   * Инициализация Fabcybox
   */
Fancybox.bind('[data-fancybox]', {
  // Отключаем закрытие свайпом вниз
  // Это главный виновник конфликта со скроллом внутри попапа
  dragToClose: false,
  // Отключаем жесты карусели (свайп влево/вправо)
  Carousel: {
    Panzoom: {
      // Отключаем pan (перетаскивание контента)
      panMode: 'mousemove',
      // или полностью:
      // touch: false,
    },
  },
  on: {
    init: () => lenis.stop(),
    destroy: () => lenis.start(),
  },
});

  /**
   * iOS-safe ScrollTrigger refresh handler
   */
  (function () {
    let resizeTimer = null;
    let lastWidth = window.innerWidth;

    // Единственный надёжный триггер для refresh - смена ширины.
    // Высоту игнорируем полностью: на iOS она "прыгает" при скролле
    // из-за адресной строки и вызывает ложные refresh.
    function safeRefresh() {
      // Читаем ширину через visualViewport если доступен - точнее на iOS
      const currentWidth = window.visualViewport
        ? Math.round(window.visualViewport.width)
        : window.innerWidth;

      if (Math.abs(currentWidth - lastWidth) < 50) return;

      lastWidth = currentWidth;

      clearTimeout(resizeTimer);
      // 400ms - даём iOS время завершить layout после поворота
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 400);
    }

    // orientationchange - основной триггер поворота на мобильных
    window.addEventListener('orientationchange', () => {
      // Дополнительная задержка: браузер применяет новые размеры
      // не сразу после события а через ~300-500ms
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        lastWidth = window.visualViewport
          ? Math.round(window.visualViewport.width)
          : window.innerWidth;
        ScrollTrigger.refresh();
      }, 500);
    });

    // window.resize - для десктопа и Android
    window.addEventListener('resize', safeRefresh);

    // visualViewport.resize - для iOS Safari (надёжнее чем window.resize)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', safeRefresh);
    }
  })();

});