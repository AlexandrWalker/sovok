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
  const lenis = new Lenis({
    anchors: {
      offset: -60,
    },
  });

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

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

    // ================================================================
    // НАСТРОЙКИ
    // ================================================================
    const CONFIG = {

      // --------------------------------------------------------------
      // СЕЛЕКТОРЫ
      // --------------------------------------------------------------
      headerSelector: '.header',
      sectionsSelector: 'section',
      firstSectionSelector: null,      // null = используем высоту хедера
      footerSelector: '.footer',

      // --------------------------------------------------------------
      // ТЕМА (светлая / тёмная секция под хедером)
      // Атрибут на секции: data-header-theme="dark" или "light"
      // Добавляет класс на <html>: header-theme-dark / header-theme-light
      // --------------------------------------------------------------
      themeAttribute: 'data-header-theme',
      classThemeDark: 'header-theme-dark',
      classThemeLight: 'header-theme-light',

      // --------------------------------------------------------------
      // КЛАССЫ НА <html> ДЛЯ СОСТОЯНИЙ СКРОЛЛА
      // --------------------------------------------------------------
      classFixed: 'header-fixed',         // прошли 1px скролла
      classOffTop: 'header-off-top',      // прошли первую секцию
      classAtFooter: 'header-at-footer',  // хедер у футера
      classHidden: 'header-hidden',       // хедер скрыт

      // --------------------------------------------------------------
      // СКРЫТИЕ ХЕДЕРА ПРИ СКРОЛЛЕ ВНИЗ
      // --------------------------------------------------------------
      hideOnScroll: true,                // true = скрывать, false = всегда видим

      // Настройки скрытия (работают только если hideOnScroll: true)
      hideDuration: 0.4,
      showDuration: 0.4,
      hideEase: 'power2.in',
      showEase: 'power2.out',
      scrollThreshold: 5,                 // минимальный скролл для реакции (px)

      // --------------------------------------------------------------
      // АНИМАЦИЯ ФОНА ХЕДЕРА ПРИ СКРОЛЛЕ
      // --------------------------------------------------------------
      animateBg: false,                    // true = менять фон, false = не менять
      bgInitial: 'rgba(255, 255, 255, 0)',
      bgScrolled: 'rgba(255, 255, 255, 1)',

      // --------------------------------------------------------------
      // АНИМАЦИЯ ТЕНИ ХЕДЕРА ПРИ СКРОЛЛЕ
      // --------------------------------------------------------------
      animateShadow: false,                // true = менять тень, false = не менять
      shadowInitial: '0px 0px 0px rgba(0, 0, 0, 0)',
      shadowScrolled: '0px 0px 20px rgba(0, 0, 0, 0.3)',

      // --------------------------------------------------------------
      // АНИМАЦИЯ ВЫСОТЫ ХЕДЕРА ПРИ СКРОЛЛЕ
      // --------------------------------------------------------------
      animateHeight: true,                // true = менять высоту, false = не менять
      heightMultiplier: 0.7,              // во сколько раз уменьшить (0.7 = 70%)

    };

    // ================================================================
    // ЭЛЕМЕНТЫ
    // ================================================================
    const header = document.querySelector(CONFIG.headerSelector);
    if (!header) return;

    const footer = document.querySelector(CONFIG.footerSelector);
    const htmlEl = document.documentElement;
    const headerHeight = header.offsetHeight;

    const firstSection = CONFIG.firstSectionSelector
      ? document.querySelector(CONFIG.firstSectionSelector)
      : null;

    // Зона скролла для scrub-анимации
    const scrollZone = firstSection
      ? firstSection.offsetHeight
      : headerHeight;

    // ================================================================
    // ОПРЕДЕЛЕНИЕ ТЕМЫ ПОД ХЕДЕРОМ
    // Проходим по секциям, находим ту что пересекается с хедером,
    // берём её data-header-theme и ставим класс на <html>
    // ================================================================
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

    // ================================================================
    // НАЧАЛЬНЫЕ СТИЛИ ХЕДЕРА
    // Устанавливаем только те свойства которые включены в CONFIG
    // ================================================================
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

    // ================================================================
    // GSAP SCRUB - анимация хедера при скролле
    // Собираем объект анимации только из включённых свойств
    // ================================================================

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
      animateTo.height = headerHeight * CONFIG.heightMultiplier;
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

    // ================================================================
    // КЛАСС header-off-top - прошли зону анимации
    // ================================================================
    ScrollTrigger.create({
      trigger: document.documentElement,
      start: `top+=${scrollZone} top`,
      onEnter: () => htmlEl.classList.add(CONFIG.classOffTop),
      onLeaveBack: () => htmlEl.classList.remove(CONFIG.classOffTop),
    });

    // ================================================================
    // КЛАСС header-at-footer - хедер достиг футера
    // ================================================================
    if (footer) {
      ScrollTrigger.create({
        trigger: footer,
        start: 'top bottom',
        onEnter: () => htmlEl.classList.add(CONFIG.classAtFooter),
        onLeaveBack: () => htmlEl.classList.remove(CONFIG.classAtFooter),
      });
    }

    // ================================================================
    // HIDE / SHOW ХЕДЕРА
    // Работает только если CONFIG.hideOnScroll: true
    // ================================================================
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

    // ================================================================
    // ОСНОВНОЙ ОБРАБОТЧИК СКРОЛЛА
    // ================================================================
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
          if (scrollingDown && currentScrollY > firstSectionBottom) {
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

    // ================================================================
    // ИНИЦИАЛИЗАЦИЯ - определяем тему сразу при загрузке страницы
    // ================================================================
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
      lenis.stop();
    };

    const closeMenu = () => {
      burgerBtn.classList.remove('burger--open');
      document.documentElement.classList.remove('menu--open');
      lenis.start();
    };

    const toggleMenu = (e) => {
      e.preventDefault();
      const isOpen = document.documentElement.classList.contains('menu--open');
      isOpen ? closeMenu() : openMenu();
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
   * Функция для блока callback
   */
  (function () {
    const callbackBtn = document.querySelector('.callback__btn');
    const callbackBlock = document.querySelector('.callback');

    const fadeUpItems = gsap.utils.toArray('[data-callback-anim="fadeUp"]');
    const fadeDownItems = gsap.utils.toArray('[data-callback-anim="fadeDown"]');

    let isClosing = false;
    let closeTimeout = null;

    // Timeline открытия
    const openTl = gsap.timeline({ paused: true });

    fadeUpItems.forEach(el => {
      openTl.from(el, {
        duration: 0.8,
        y: 350,
        ease: 'none',
      }, 0);
    });

    fadeDownItems.forEach(el => {
      openTl.from(el, {
        duration: 0.8,
        rotate: -20,
        y: -500,
        ease: 'none',
      }, 0);
    });

    const openMenu = () => {
      if (isClosing) return;

      callbackBtn.classList.add('callback--open');
      document.documentElement.classList.add('callback--open');
      lenis.stop();
      openTl.restart();
    };

    const closeMenu = () => {
      if (isClosing) return;
      isClosing = true;

      openTl.pause();

      // Анимация fadeUp и fadeDown запускается сразу без задержки
      const closeTl = gsap.timeline({
        onComplete: () => {
          // После анимации ждём 1 секунду и только потом скрываем блок
          closeTimeout = setTimeout(() => {
            callbackBtn.classList.remove('callback--open');
            document.documentElement.classList.remove('callback--open');
            lenis.start();
            isClosing = false;
          }, 100);
        },
      });

      fadeUpItems.forEach(el => {
        closeTl.to(el, {
          duration: 0.2,
          y: 1000,
          ease: 'none',
        }, 0);
      });

      fadeDownItems.forEach(el => {
        closeTl.to(el, {
          duration: 0.2,
          rotate: 10,
          y: 50,
          ease: 'none',
        }, 0);
      });
    };

    const toggleMenu = (e) => {
      e.preventDefault();
      const isOpen = document.documentElement.classList.contains('callback--open');
      isOpen ? closeMenu() : openMenu();
    };

    callbackBtn.addEventListener('click', toggleMenu);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.documentElement.classList.contains('callback--open')) {
        closeMenu();
      }
    });

    document.addEventListener('click', (event) => {
      const isMenuOpen = document.documentElement.classList.contains('callback--open');
      const clickInsideMenu = callbackBlock.contains(event.target);
      const clickOnButton = callbackBtn.contains(event.target);

      if (isMenuOpen && !clickInsideMenu && !clickOnButton) {
        closeMenu();
      }
    });

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

    // Реестр анимаций: element -> duration
    // Нужен чтобы дочерние split знали длительность родительской анимации
    const animRegistry = new Map();

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

    gsap.utils.toArray('[data-animate]').forEach(section => {
      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top bottom-=30%',
        },
      });

      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'bottom bottom',
          end: 'bottom top',
          pin: true,
          pinSpacing: false,
        },
      });
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
      fadeLeft: { x: '-100%', y: '0%' },
      fadeRight: { x: '100%', y: '0%' },
      fadeUp: { x: '0%', y: '100%' },
      fadeDown: { x: '0%', y: '-100%' },
    };

    Object.entries(fadeDirections).forEach(([name, from]) => {
      gsap.utils.toArray(`[data-anim="${name}"]`).forEach(el => {
        gsap.timeline({
          paused: true,
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }).fromTo(el,
          { x: from.x, y: from.y, opacity: 0 },
          { x: '0%', y: '0%', opacity: 1, duration: 0.15, ease: 'power2.out' }
        );
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
            end: 'bottom top',
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
            { y: '-80%', opacity: 0, scale: 0.85, ease: 'power2.in', duration: 0.25 }
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
              start: 'bottom 80%',
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

    function initSplitAnim(container, { rotation, stagger, duration, start }) {
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
              rotation,
              stagger,
              duration,
              delay,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: container,
                start,
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
        rotation: 0,
        stagger: 0.1,
        duration: 0.6,
        start: 'top 90%',
      });
    });

    // Split - текст
    gsap.utils.toArray('[data-split="text"]').forEach(container => {
      initSplitAnim(container, {
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

    // Координатор синхронной группы.
    // Управляет несколькими экземплярами как одним целым,
    // все тикают одновременно, ни один не отстаёт.
    function initSyncGroup(containers) {

      const first = containers[0];
      const TYPE_SPEED = parseFloat(first.dataset.typeSpeed ?? 0.07);
      const TYPE_VARIANCE = parseFloat(first.dataset.typeVariance ?? 0.04);
      const DELETE_SPEED = parseFloat(first.dataset.deleteSpeed ?? 0.04);
      const PAUSE_AFTER_TYPE = parseFloat(first.dataset.pauseAfterType ?? 2.0);
      const PAUSE_AFTER_DEL = parseFloat(first.dataset.pauseAfterDelete ?? 0.5);

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

      const phraseCount = instances[0]?.phraseCount ?? 0;
      if (phraseCount === 0) return;

      function getTypeDelay() {
        return TYPE_SPEED + (Math.random() * 2 - 1) * TYPE_VARIANCE;
      }

      function sleep(seconds) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
      }

      // sleep который можно прервать через abortSignal,
      // чтобы не ждать конца паузы когда пришёл focus
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

      // Синхронный набор: количество шагов = самое длинное слово среди всех экземпляров
      async function typeAll(phraseIndex) {
        const steps = Math.max(...instances.map(inst => inst.getStepCount(phraseIndex)));

        instances.forEach(inst => inst.prepareCursor(phraseIndex));

        for (let i = 0; i < steps; i++) {
          if (abortSignal) break;
          instances.forEach(inst => inst.typeStep(phraseIndex, i));
          await sleepAbortable(getTypeDelay());
        }

        instances.forEach(inst => inst.resumeCursor());
      }

      // Синхронное удаление
      async function deleteAll(phraseIndex) {
        const steps = Math.max(...instances.map(inst => inst.getStepCount(phraseIndex)));

        instances.forEach(inst => inst.prepareCursor(phraseIndex));

        for (let i = 0; i < steps; i++) {
          if (abortSignal) break;
          instances.forEach(inst => inst.deleteStep());
          await sleepAbortable(DELETE_SPEED);
        }

        instances.forEach(inst => inst.resumeCursor());
      }

      function applyAll(phraseIndex) {
        instances.forEach(inst => inst.applyPhrase(phraseIndex));
      }

      function clearAll() {
        instances.forEach(inst => inst.clearSlots());
      }

      // Финальный stop-text набирается параллельно во всех экземплярах
      async function typeStopAll() {
        await Promise.all(instances.map(inst => inst.typeStopText()));
      }

      async function runLoop() {
        let index = 0;

        while (true) {
          if (isStopped) { await sleep(0.1); continue; }

          const phraseIndex = index % phraseCount;

          // Чистим перед каждой итерацией, в том числе после resume
          clearAll();
          applyAll(phraseIndex);

          await typeAll(phraseIndex);
          if (abortSignal) { abortSignal = false; clearAll(); await typeStopAll(); isStopped = true; continue; }

          await sleepAbortable(PAUSE_AFTER_TYPE);
          if (abortSignal) { abortSignal = false; clearAll(); await typeStopAll(); isStopped = true; continue; }

          await deleteAll(phraseIndex);
          if (abortSignal) { abortSignal = false; clearAll(); await typeStopAll(); isStopped = true; continue; }

          await sleepAbortable(PAUSE_AFTER_DEL);
          if (abortSignal) { abortSignal = false; clearAll(); await typeStopAll(); isStopped = true; continue; }

          index++;
        }
      }

      runLoop();
    }

    // Один экземпляр typewriter.
    // Если externalControl: true - не запускает свой цикл,
    // отдаёт API координатору и следит только за своим input-ом.
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

      // Максимальная длина слова среди всех слотов для данной фразы.
      // Координатор использует это чтобы выровнять все экземпляры по шагам.
      function getStepCount(phraseIndex) {
        return Math.max(...slots.map(slot => (slot.words[phraseIndex] ?? '').length));
      }

      // Переносим курсор в последний непустой слот перед стартом
      function prepareCursor(phraseIndex) {
        const lastActive = [...slots].reverse().find(slot => slot.words[phraseIndex ?? 0]);
        if (lastActive) moveCursorTo(lastActive.el);
      }

      // Добавляет i-й символ в каждый слот этого экземпляра.
      // Курсор статичен - resume вызывает координатор после всех шагов.
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

      // Удаляет последний символ из каждого слота этого экземпляра.
      function deleteStep() {
        cursorTween.pause();
        gsap.set(cursorEl, { opacity: 1 });

        slots.forEach(slot => {
          const spans = slot.el.querySelectorAll('span:not(.typewriter__cursor)');
          if (spans.length === 0) return;
          spans[spans.length - 1].remove();
        });

        // container.style.webkitTransform = 'translateZ(0)';
        // requestAnimationFrame(() => {
        //   container.style.webkitTransform = '';
        // });
      }

      // Возобновляет мигание - вызывается после завершения набора или удаления
      function resumeCursor() {
        cursorTween.resume();
      }

      // Пересоздаём tween после kill() - нужно когда экземпляр возвращается из stopped
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

      // Набирает финальный stop-text когда input активен или заполнен.
      // После завершения курсор гасим - анимация для этого экземпляра закончена.
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


      // Собственный цикл - только для одиночных экземпляров.
      // Слоты идут последовательно как части одного предложения.
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

            // Чистим перед каждой итерацией, в том числе после resume
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
              // Поле заполнено - оставляем stop-text, не трогаем
              if (inputEl.classList.contains('filled') || inputEl.value?.trim()) return;
              // Только снимаем флаг - цикл сам почистит слоты и начнёт заново
              isStopped = false;
              restoreCursor();
            }, 50);
          };

          inputEl.addEventListener('focus', activate);
          inputEl.addEventListener('blur', deactivate);

          const observer = new MutationObserver(() => {
            if (inputEl.classList.contains('filled')) {
              // Поле заполнено - это постоянное состояние, не зависит от фокуса
              clearTimeout(deactivateTimer);
              if (!isStopped) abortSignal = true;
            } else {
              // Класс убрали - деактивируем только если не в фокусе
              if (!inputEl.matches(':focus')) deactivate();
            }
          });

          observer.observe(inputEl, { attributes: true, attributeFilter: ['class'] });
        }

        runLoop();
      }


      // Режим внешнего управления - свой цикл не запускаем,
      // но за своим input-ом следим и уведомляем координатора.
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
            // Поле заполнено - оставляем stop-text, не трогаем
            if (inputEl.classList.contains('filled') || inputEl.value?.trim()) return;
            // Только снимаем флаг и уведомляем координатора
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
        ScrollTrigger.create({
          trigger: triggerEl,
          start: 'top 90%',
          onEnter: () => resolve(),
        });
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
          gsap.delayedCall(1.5 + i * 0.3, () => {
            t.kill();
            const loops = Math.floor(digitEl.querySelectorAll("span").length / 10) - 1;
            gsap.to(digitEl, { y: -(loops * 10 + parseInt(target)) + "em", duration: 0.2 + i * 0.2, ease: "power3.out" });
          });
        })
      });
    });

  })();

  /**
   * iOS-safe ScrollTrigger refresh handler
   */
  (function () {
    let resizeTimer;
    let lastWidth = window.innerWidth;
    let lastHeight = window.innerHeight;

    // Функция для стабильного пересчёта
    const safeRefresh = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const currentWidth = window.innerWidth;
        const currentHeight = window.innerHeight;

        // Проверяем - реально ли изменился размер экрана
        const widthChanged = Math.abs(currentWidth - lastWidth) > 50;
        const heightChanged = Math.abs(currentHeight - lastHeight) > 150;

        if (widthChanged || heightChanged) {
          lastWidth = currentWidth;
          lastHeight = currentHeight;
          console.log('refresh');
          ScrollTrigger.refresh();
        }
      }, 250); // debounce 250ms - достаточно для всех платформ
    };

    // Реакция на изменение ориентации (особенно важно для iOS)
    window.addEventListener('orientationchange', () => {
      setTimeout(() => ScrollTrigger.refresh(), 300);
    });

    // Реакция на реальный resize, но фильтруем “мусорные” вызовы
    window.addEventListener('resize', safeRefresh);
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
      {
        sliderSelector: '.produce__slider',
        highlight: false,
        swiperOptions: {
          slidesPerGroup: 1,
          slidesPerView: 1,
          spaceBetween: 10,
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
          breakpoints: {
            0: {
              slidesPerGroup: 1,
              slidesPerView: 1,
              spaceBetween: 20,
            },
            601: {
              slidesPerGroup: 1,
              slidesPerView: 2,
              spaceBetween: 20,
            },
            835: {
              slidesPerGroup: 1,
              slidesPerView: 3,
              spaceBetween: 80,
            },
          },
        },
      },
      {
        sliderSelector: '.cases__slider',
        prevSelector: '.cases-button-prev',
        nextSelector: '.cases-button-next',
        highlight: false,
        swiperOptions: {
          slidesPerGroup: 1,
          slidesPerView: 1,
          spaceBetween: 10,
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
          breakpoints: {
            0: {
              slidesPerGroup: 1,
              slidesPerView: 1,
              spaceBetween: 20,
            },
            601: {
              slidesPerGroup: 1,
              slidesPerView: 1,
              spaceBetween: 20,
            },
            835: {
              slidesPerGroup: 1,
              slidesPerView: 1,
              spaceBetween: 40,
            },
          },
        },
      },
      {
        sliderSelector: '.inform__slider',
        highlight: false,
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
      if (prevEl && nextEl) {
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

        prevEl.classList.toggle('swiper-button-disabled', isStart);
        nextEl.classList.toggle('swiper-button-disabled', nextBlocked);

        // disabled как свойство а не атрибут - клик всё равно доходит
        // до нашего обработчика даже когда кнопка визуально заблокирована
        prevEl.disabled = isStart;
        nextEl.disabled = nextBlocked;
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

        if (swiper.params.loop) {
          const total = swiper.slides.length - (swiper.loopedSlides ?? 0) * 2;
          const curr = swiper.realIndex;
          const target = direction === 'next'
            ? (curr + steps) % total
            : (curr - steps + total) % total;
          swiper.slideToLoop(target);
        } else {
          const base = swiper.activeIndex;
          const target = direction === 'next'
            ? Math.min(base + steps, swiper.slides.length - 1)
            : Math.max(base - steps, 0);
          swiper.slideTo(target);
        }

        updateDisabled();
      }

      nextEl.addEventListener('click', (e) => { e.preventDefault(); handle('next'); });
      prevEl.addEventListener('click', (e) => { e.preventDefault(); handle('prev'); });

      swiper.on('touchStart', resetImpulse);
      swiper.on('slideChange', updateDisabled);
      swiper.on('resize', updateDisabled);

      swiper.on('destroy', () => {
        if (decayTimer) clearInterval(decayTimer);
        decayTimer = null;
      });

      updateDisabled();
    }

  })();

});