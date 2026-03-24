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
   * Анимация текста
   */
  gsap.utils.toArray('[data-split="title"]').forEach(dataSplitLines => {
    const textSplits = dataSplitLines.querySelectorAll('*');
    textSplits.forEach(textSplit => {
      if (textSplit) SplitText.create(textSplit, {
        type: "words,lines",
        mask: "lines",
        linesClass: "line",
        autoSplit: true,
        onSplit: inst => gsap.from(inst.lines, {
          y: 50,
          rotation: 2.5,
          opacity: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: dataSplitLines,
            start: "top 90%",
            end: "bottom top"
          }
        })
      });
    });
  });

  gsap.utils.toArray('[data-split="text"]').forEach(dataSplitLines => {
    const textSplits = dataSplitLines.querySelectorAll('*');
    textSplits.forEach(textSplit => {
      if (textSplit) SplitText.create(textSplit, {
        type: "words,lines",
        mask: "lines",
        linesClass: "line",
        autoSplit: true,
        onSplit: inst => gsap.from(inst.lines, {
          y: 30,
          rotation: 2.5,
          opacity: 0,
          stagger: 0.05,
          duration: 0.8,
          scrollTrigger: {
            trigger: dataSplitLines,
            start: "top 90%",
            end: "bottom top"
          }
        })
      });
    });
  });

  /**
   * Функция воспроизведения звука при нажатии на кнопку
   */
  (function () {
    // Конфиг: название звука - путь до файла
    const SOUND_MAP = {
      poehali: './sound/poehali.mp3',
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
        console.warn(`[Sound] Не найден путь для звука: "\${name}"`);
        return;
      }

      loadingSet.add(name);
      try {
        const response = await fetch(path);
        const arrayBuffer = await response.arrayBuffer();
        bufferCache[name] = await audioCtx.decodeAudioData(arrayBuffer);
      } catch (err) {
        console.error(`[Sound] Ошибка загрузки "\${name}":`, err);
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
        console.warn(`[Sound] Буфер не готов для: "\${name}"`);
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
   * sound-section
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
      levitan: 0.4,   // меняем здесь громкость для каждого звука
    };

    // Глобальная громкость поверх индивидуальной (множитель)
    // 1.0 = без изменений, 0.5 = вдвое тише, 0 = полная тишина
    let globalVolume = 0.4;

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
        console.error(`[ScrollSound] Ошибка загрузки "\${name}":`, err);
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
      // Граф: source → gainNode → destination
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
   * Функция для шапки
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
          end: `+=\${scrollZone}`,
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
      start: `top+=\${scrollZone} top`,
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
   * Управляет поведением меню-бургера.
   */
  function burgerNav() {
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
  }
  burgerNav();

  /**
   * Анимация посимвольной печати
   */
  // (function () {

  //   // ─── Конфиг ────────────────────────────────────────────────────────────────

  //   /**
  //    * Список фраз для посимвольной печати.
  //    *
  //    * Каждая фраза - массив строк (строк = линий).
  //    * Каждая строка - массив слов.
  //    *
  //    * Структура:
  //    * [
  //    *   [                          ← фраза
  //    *     ['слово1', 'слово2'],    ← первая линия
  //    *     ['слово3'],              ← вторая линия
  //    *     ['слово4', 'слово5'],    ← третья линия
  //    *   ],
  //    * ]
  //    *
  //    * Слова совпадают с data-word в HTML - через них применяются CSS-стили.
  //    * Порядок слов в массиве = порядок печати слева направо, сверху вниз.
  //    */
  //   const PHRASES = [
  //     [
  //       ['за!'],
  //       ['уровень'],
  //       ['в', ' цифре'],
  //     ],
  //     [
  //       ['след.'],
  //       ['фраза'],
  //       ['прямо', ' здесь'],
  //     ],
  //     [
  //       ['и ещё'],
  //       ['одна'],
  //       ['строка'],
  //     ],
  //   ];

  //   /**
  //    * Скорость печати одного символа (секунды).
  //    * TYPE_VARIANCE добавляет случайный разброс - имитация живого набора.
  //    */
  //   const TYPE_SPEED = 0.07;
  //   const TYPE_VARIANCE = 0.04;

  //   /** Скорость удаления одного символа (секунды). */
  //   const DELETE_SPEED = 0.04;

  //   /**
  //    * Паузы (секунды):
  //    * PAUSE_AFTER_TYPE   - после полного набора фразы
  //    * PAUSE_AFTER_DELETE - после полного удаления (перед следующей фразой)
  //    */
  //   const PAUSE_AFTER_TYPE = 2.0;
  //   const PAUSE_AFTER_DELETE = 0.5;

  //   // ─── DOM ───────────────────────────────────────────────────────────────────

  //   const cursorEl = document.querySelector('.typewriter__cursor');

  //   /**
  //    * Собираем все .typewriter__word в Map: data-word → элемент.
  //    *
  //    * Map выбран вместо объекта потому что:
  //    * - гарантирует порядок вставки (важно при итерации)
  //    * - ключи строго строковые без коллизий с прототипом
  //    *
  //    * Пример результата:
  //    * wordMap = {
  //    *   'за!'     → <span data-word="за!">,
  //    *   'уровень' → <span data-word="уровень">,
  //    *   'в'       → <span data-word="в">,
  //    *   'цифре'   → <span data-word="цифре">,
  //    * }
  //    */
  //   const wordMap = new Map();
  //   document.querySelectorAll('.typewriter__word').forEach(el => {
  //     wordMap.set(el.dataset.word, el);
  //   });

  //   // ─── Курсор: мигание ───────────────────────────────────────────────────────

  //   /**
  //    * Бесконечное мигание курсора.
  //    * pause() / resume() синхронизируют мигание с циклом печати:
  //    * курсор статичен во время набора/удаления, мигает в паузах.
  //    */
  //   const cursorTween = gsap.to(cursorEl, {
  //     opacity: 0,
  //     duration: 0.5,
  //     repeat: -1,
  //     yoyo: true,
  //     ease: 'none',
  //   });

  //   // ─── Вспомогательные функции ───────────────────────────────────────────────

  //   /**
  //    * Случайная задержка вокруг TYPE_SPEED.
  //    * @returns {number} секунды
  //    */
  //   function getTypeDelay() {
  //     return TYPE_SPEED + (Math.random() * 2 - 1) * TYPE_VARIANCE;
  //   }

  //   /**
  //    * Promise-обёртка над setTimeout для await-синтаксиса.
  //    * @param {number} seconds
  //    */
  //   function sleep(seconds) {
  //     return new Promise(resolve => setTimeout(resolve, seconds * 1000));
  //   }

  //   /**
  //    * Перемещает курсор в конец указанного элемента-слова.
  //    *
  //    * Курсор физически один в DOM, но логически "принадлежит"
  //    * последнему напечатанному слову. Для этого переносим его
  //    * в нужный .typewriter__word через appendChild.
  //    *
  //    * appendChild перемещает существующий узел - клонирование не нужно.
  //    * Курсор автоматически исчезает из предыдущего места.
  //    *
  //    * @param {HTMLElement} wordEl - элемент слова, куда переносим курсор
  //    */
  //   function moveCursorTo(wordEl) {
  //     wordEl.appendChild(cursorEl);
  //   }

  //   /**
  //    * Печатает одно слово посимвольно в указанный элемент.
  //    *
  //    * Каждый символ - отдельный <span> внутри .typewriter__word.
  //    * Пробел → &nbsp; чтобы браузер не "съел" пробелы в конце.
  //    *
  //    * @param {HTMLElement} wordEl - элемент слова
  //    * @param {string}      word   - строка для печати
  //    */
  //   async function typeWord(wordEl, word) {
  //     for (const char of word) {
  //       const span = document.createElement('span');
  //       span.innerHTML = char === ' ' ? '&nbsp;' : char;
  //       // Вставляем символ перед курсором чтобы курсор всегда был в конце
  //       wordEl.insertBefore(span, cursorEl);
  //       await sleep(getTypeDelay());
  //     }
  //   }

  //   /**
  //    * Удаляет все символы из указанного элемента-слова (справа налево).
  //    *
  //    * Выбираем только span-символы (не курсор) через селектор span:not(.typewriter__cursor).
  //    * Реверсируем массив - удаление идёт с последнего символа.
  //    *
  //    * @param {HTMLElement} wordEl - элемент слова
  //    */
  //   async function deleteWord(wordEl) {
  //     const spans = Array.from(
  //       wordEl.querySelectorAll('span:not(.typewriter__cursor)')
  //     ).reverse();

  //     for (const span of spans) {
  //       span.remove();
  //       await sleep(DELETE_SPEED);
  //     }
  //   }

  //   /**
  //    * Печатает целую фразу: перебирает строки и слова по порядку.
  //    *
  //    * Перед каждым словом курсор переезжает в его контейнер -
  //    * визуально курсор "следует" за набором.
  //    *
  //    * @param {string[][][]} phrase - трёхмерный массив [линии[слова]]
  //    */
  //   async function typePhrase(phrase) {
  //     cursorTween.pause();
  //     gsap.set(cursorEl, { opacity: 1 });

  //     for (const line of phrase) {
  //       for (const word of line) {
  //         const wordEl = wordMap.get(word);
  //         if (!wordEl) continue;

  //         // Курсор переезжает в текущее слово перед его набором
  //         moveCursorTo(wordEl);
  //         await typeWord(wordEl, word);
  //       }
  //     }

  //     cursorTween.resume();
  //   }

  //   /**
  //    * Удаляет целую фразу: перебирает слова в обратном порядке.
  //    *
  //    * flat() разворачивает [линии[слова]] → плоский массив слов.
  //    * reverse() - удаление идёт от последнего слова к первому.
  //    *
  //    * Перед удалением каждого слова курсор переезжает в него -
  //    * курсор "отступает" вместе с удалением.
  //    *
  //    * @param {string[][][]} phrase
  //    */
  //   async function deletePhrase(phrase) {
  //     cursorTween.pause();
  //     gsap.set(cursorEl, { opacity: 1 });

  //     // flat() разворачивает вложенные массивы строк и слов
  //     const allWords = phrase.flat().reverse();

  //     for (const word of allWords) {
  //       const wordEl = wordMap.get(word);
  //       if (!wordEl) continue;

  //       moveCursorTo(wordEl);
  //       await deleteWord(wordEl);
  //     }

  //     cursorTween.resume();
  //   }

  //   /**
  //    * Обновляет data-word у всех .typewriter__word и пересобирает wordMap.
  //    *
  //    * Нужно при смене фразы: HTML-структура (строки/слова) остаётся той же,
  //    * но слова меняются. Обновляем атрибуты и переключаем CSS-стили.
  //    *
  //    * Порядок обхода: сначала все слова первой линии, потом второй и т.д.
  //    * - совпадает с порядком в PHRASES[phraseIndex].
  //    *
  //    * @param {string[][][]} phrase - новая фраза
  //    */
  //   function applyPhraseToDOM(phrase) {
  //     // Плоский список новых слов в порядке обхода
  //     const newWords = phrase.flat();

  //     // Все существующие .typewriter__word в порядке DOM
  //     const wordEls = Array.from(document.querySelectorAll('.typewriter__word'));

  //     wordEls.forEach((el, i) => {
  //       const newWord = newWords[i];
  //       if (!newWord) return;

  //       // Меняем data-word → CSS [data-word="..."] автоматически подхватит новые стили
  //       el.dataset.word = newWord;
  //     });

  //     // Пересобираем Map с актуальными ключами
  //     wordMap.clear();
  //     document.querySelectorAll('.typewriter__word').forEach(el => {
  //       wordMap.set(el.dataset.word, el);
  //     });
  //   }

  //   // ─── Основной цикл ─────────────────────────────────────────────────────────

  //   /**
  //    * Бесконечный цикл смены фраз.
  //    *
  //    * Порядок для каждой фразы:
  //    * 1. applyPhraseToDOM - обновляем data-word (CSS-стили переключаются)
  //    * 2. typePhrase       - посимвольный набор всех слов
  //    * 3. sleep            - пауза чтения
  //    * 4. deletePhrase     - посимвольное удаление в обратном порядке
  //    * 5. sleep            - пауза перед следующей фразой
  //    */
  //   async function runLoop() {
  //     let index = 0;

  //     while (true) {
  //       const phrase = PHRASES[index % PHRASES.length];

  //       applyPhraseToDOM(phrase);
  //       await typePhrase(phrase);
  //       await sleep(PAUSE_AFTER_TYPE);
  //       await deletePhrase(phrase);
  //       await sleep(PAUSE_AFTER_DELETE);

  //       index++;
  //     }
  //   }

  //   runLoop();

  // })();

  /**
   * Анимация наслоения блоков
   */
  function initSectionAnimations() {
    document.querySelectorAll("[data-animate]").forEach((section) => {

      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top bottom-=30%",
        },
      });

      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "bottom bottom",
          end: "bottom top",
          pin: true,
          pinSpacing: false,
        },
      });
    });
  }
  initSectionAnimations();

  /**
   * callback
   */
  (function () {
    const callbackBtn = document.querySelector('.callback__btn');
    const callbackBlock = document.querySelector('.callback');

    const fadeUpItems = gsap.utils.toArray('[data-anim="fadeUp"]');
    const fadeDownItems = gsap.utils.toArray('[data-anim="fadeDown"]');

    const callbackTl = gsap.timeline({ paused: true });

    fadeUpItems.forEach(el => {
      callbackTl.from(el, {
        duration: 0.8,
        y: 350,
        ease: 'none',
      }, 0);
    });

    fadeDownItems.forEach(el => {
      callbackTl.from(el, {
        duration: 0.8,
        rotate: -20,
        y: -100,
        ease: 'none',
      }, 0);
    });

    const openMenu = () => {
      callbackBtn.classList.add('callback--open');
      document.documentElement.classList.add('callback--open');
      lenis.stop();
      callbackTl.restart();
    };

    const closeMenu = () => {
      callbackBtn.classList.remove('callback--open');
      document.documentElement.classList.remove('callback--open');
      lenis.start();
      // callbackTl.pause(0);
      callbackTl.reverse();
    };

    const toggleMenu = (e) => {
      e.preventDefault();
      const isOpen = document.documentElement.classList.contains('callback--open');
      isOpen ? closeMenu() : openMenu();
    };

    callbackBtn.addEventListener('click', toggleMenu);

    window.addEventListener('keydown', (e) => {
      if (e.key === "Escape" && document.documentElement.classList.contains('callback--open')) {
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
 * Анимация текста
 */
  gsap.utils.toArray('[data-split="title"]').forEach(dataSplitLines => {
    const textSplits = dataSplitLines.querySelectorAll('*');

    const validTargets = Array.from(textSplits).filter(el =>
      el.tagName !== 'BR' &&
      el.tagName !== 'IMG' &&
      el.tagName !== 'SVG'
    );

    const targets = validTargets.length > 0
      ? validTargets
      : [dataSplitLines];

    targets.forEach(textSplit => {
      SplitText.create(textSplit, {
        type: "words,lines",
        mask: "lines",
        linesClass: "line",
        autoSplit: true,
        onSplit: inst => {
          const lineHeight = inst.lines[0]?.offsetHeight ?? 50;
          gsap.from(inst.lines, {
            y: lineHeight / 10 + 'rem',
            // rotation: 2.5,
            // opacity: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: dataSplitLines,
              start: "top 90%",
              end: "bottom top"
            }
          })
        }
      });
    });
  });

  gsap.utils.toArray('[data-split="text"]').forEach(dataSplitLines => {
    const textSplits = dataSplitLines.querySelectorAll('*');

    const validTargets = Array.from(textSplits).filter(el =>
      el.tagName !== 'BR' &&
      el.tagName !== 'IMG' &&
      el.tagName !== 'SVG'
    );

    const targets = validTargets.length > 0
      ? validTargets
      : [dataSplitLines];

    targets.forEach(textSplit => {
      if (textSplit) SplitText.create(textSplit, {
        type: "words,lines",
        mask: "lines",
        linesClass: "line",
        autoSplit: true,
        onSplit: inst => {
          const lineHeight = inst.lines[0]?.offsetHeight ?? 50;
          gsap.from(inst.lines, {
            y: lineHeight / 10 + 'rem',
            rotation: 2.5,
            stagger: 0.05,
            duration: 0.8,
            scrollTrigger: {
              trigger: dataSplitLines,
              start: "top 90%",
              end: "bottom top"
            }
          })
        }
      });
    });
  });

  // gsap.utils.toArray('[data-anim="fadeUp"]').forEach(dataAnimItem => {
  //   gsap.from(dataAnimItem, {
  //     duration: 0.8,
  //     delay: 0.5,
  //     // rotate: -70.79,
  //     y: 40,
  //     ease: 'none',
  //     scrollTrigger: {
  //       trigger: dataAnimItem,
  //       start: 'top center',
  //       end: 'bottom top',
  //       toggleActions: 'play none none none',
  //     }
  //   });
  // });
  // gsap.utils.toArray('[data-anim="fadeDown"]').forEach(dataAnimItem => {
  //   gsap.from(dataAnimItem, {
  //     duration: 0.8,
  //     delay: 0.5,
  //     // rotate: -16.41,
  //     y: -100,
  //     ease: 'none',
  //     scrollTrigger: {
  //       trigger: dataAnimItem,
  //       start: 'top center',
  //       end: 'bottom top',
  //       toggleActions: 'play none none none',
  //     }
  //   });
  // });

  (function () {

    // Конфиг

    /**
     * Список фраз для посимвольной печати.
     *
     * Каждая фраза — массив строк (строк = линий).
     * Каждая строка — массив слов.
     *
     * Слова совпадают с data-word в HTML — через них применяются CSS-стили.
     * Порядок слов в массиве = порядок печати слева направо, сверху вниз.
     */
    const PHRASES = [
      [
        ['за!'],
        ['уровень'],
        ['в', 'цифре'],
      ],
      [
        ['след.'],
        ['фраза'],
        ['прямо', 'здесь'],
      ],
      [
        ['и ещё'],
        ['одна'],
        ['строка'],
      ],
    ];

    /**
     * Скорость печати одного символа (секунды).
     * TYPE_VARIANCE добавляет случайный разброс - имитация живого набора.
     */
    const TYPE_SPEED = 0.07;
    const TYPE_VARIANCE = 0.04;

    /** Скорость удаления одного символа (секунды). */
    const DELETE_SPEED = 0.04;

    /**
     * Паузы (секунды):
     * PAUSE_AFTER_TYPE - после полного набора фразы
     * PAUSE_AFTER_DELETE - после полного удаления (перед следующей фразой)
     */
    const PAUSE_AFTER_TYPE = 2.0;
    const PAUSE_AFTER_DELETE = 0.5;

    // DOM

    const cursorEl = document.querySelector('.hero__title-cursor');

    /**
     * Собираем все .typewriter__word в Map: data-word → элемент.
     *
     * Map выбран вместо объекта потому что:
     * - гарантирует порядок вставки (важно при итерации)
     * - ключи строго строковые без коллизий с прототипом
     *
     * Пример результата:
     * wordMap = {
     *   'за - <span data-word="за!">,
     *   'уровень - <span data-word="уровень">,
     *   'в - <span data-word="в">,
     *   'цифре - <span data-word="цифре">,
     * }
     */
    const wordMap = new Map();
    document.querySelectorAll('.hero__title-word').forEach(el => {
      wordMap.set(el.dataset.word, el);
    });

    // Курсор: мигание

    /**
     * Бесконечное мигание курсора.
     * pause() / resume() синхронизируют мигание с циклом печати:
     * курсор статичен во время набора/удаления, мигает в паузах.
     */
    const cursorTween = gsap.to(cursorEl, {
      opacity: 0,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: 'none',
    });

    // Вспомогательные функции

    /**
     * Случайная задержка вокруг TYPE_SPEED.
     * @returns {number} секунды
     */
    function getTypeDelay() {
      return TYPE_SPEED + (Math.random() * 2 - 1) * TYPE_VARIANCE;
    }

    /**
     * Promise-обёртка над setTimeout для await-синтаксиса.
     * @param {number} seconds
     */
    function sleep(seconds) {
      return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }

    /**
     * Перемещает курсор в конец указанного элемента-слова.
     *
     * Курсор физически один в DOM, но логически "принадлежит"
     * последнему напечатанному слову. Для этого переносим его
     * в нужный .typewriter__word через appendChild.
     *
     * appendChild перемещает существующий узел — клонирование не нужно.
     * Курсор автоматически исчезает из предыдущего места.
     *
     * @param {HTMLElement} wordEl — элемент слова, куда переносим курсор
     */
    function moveCursorTo(wordEl) {
      wordEl.appendChild(cursorEl);
    }

    /**
     * Печатает одно слово посимвольно в указанный элемент.
     *
     * Каждый символ — отдельный <span> внутри .typewriter__word.
     * Пробел → &nbsp; чтобы браузер не "съел" пробелы в конце.
     *
     * @param {HTMLElement} wordEl — элемент слова
     * @param {string}      word   — строка для печати
     */
    async function typeWord(wordEl, word) {
      for (const char of word) {
        const span = document.createElement('span');
        span.innerHTML = char === ' ' ? '&nbsp;' : char;
        // Вставляем символ перед курсором чтобы курсор всегда был в конце
        wordEl.insertBefore(span, cursorEl);
        await sleep(getTypeDelay());
      }
    }

    /**
     * Удаляет все символы из указанного элемента-слова (справа налево).
     *
     * Выбираем только span-символы (не курсор) через селектор span:not(.typewriter__cursor).
     * Реверсируем массив — удаление идёт с последнего символа.
     *
     * @param {HTMLElement} wordEl — элемент слова
     */
    async function deleteWord(wordEl) {
      const spans = Array.from(
        wordEl.querySelectorAll('span:not(.hero__title-cursor)')
      ).reverse();

      for (const span of spans) {
        span.remove();
        await sleep(DELETE_SPEED);
      }
    }

    /**
     * Печатает целую фразу: перебирает строки и слова по порядку.
     *
     * Перед каждым словом курсор переезжает в его контейнер —
     * визуально курсор "следует" за набором.
     *
     * @param {string[][][]} phrase — трёхмерный массив [линии[слова]]
     */
    async function typePhrase(phrase) {
      cursorTween.pause();
      gsap.set(cursorEl, { opacity: 1 });

      for (const line of phrase) {
        for (const word of line) {
          const wordEl = wordMap.get(word);
          if (!wordEl) continue;

          // Курсор переезжает в текущее слово перед его набором
          moveCursorTo(wordEl);
          await typeWord(wordEl, word);
        }
      }

      cursorTween.resume();
    }

    /**
     * Удаляет целую фразу: перебирает слова в обратном порядке.
     *
     * flat() разворачивает [линии[слова]] → плоский массив слов.
     * reverse() — удаление идёт от последнего слова к первому.
     *
     * Перед удалением каждого слова курсор переезжает в него —
     * курсор "отступает" вместе с удалением.
     *
     * @param {string[][][]} phrase
     */
    async function deletePhrase(phrase) {
      cursorTween.pause();
      gsap.set(cursorEl, { opacity: 1 });

      // flat() разворачивает вложенные массивы строк и слов
      const allWords = phrase.flat().reverse();

      for (const word of allWords) {
        const wordEl = wordMap.get(word);
        if (!wordEl) continue;

        moveCursorTo(wordEl);
        await deleteWord(wordEl);
      }

      cursorTween.resume();
    }

    /**
     * Обновляет data-word у всех .typewriter__word и пересобирает wordMap.
     *
     * Нужно при смене фразы: HTML-структура (строки/слова) остаётся той же,
     * но слова меняются. Обновляем атрибуты и переключаем CSS-стили.
     *
     * Порядок обхода: сначала все слова первой линии, потом второй и т.д.
     * — совпадает с порядком в PHRASES[phraseIndex].
     *
     * @param {string[][][]} phrase — новая фраза
     */
    function applyPhraseToDOM(phrase) {
      // Плоский список новых слов в порядке обхода
      const newWords = phrase.flat();

      // Все существующие .typewriter__word в порядке DOM
      const wordEls = Array.from(document.querySelectorAll('.hero__title-word'));

      wordEls.forEach((el, i) => {
        const newWord = newWords[i];
        if (!newWord) return;

        // Меняем data-word → CSS [data-word="..."] автоматически подхватит новые стили
        el.dataset.word = newWord;
      });

      // Пересобираем Map с актуальными ключами
      wordMap.clear();
      document.querySelectorAll('.hero__title-word').forEach(el => {
        wordMap.set(el.dataset.word, el);
      });
    }

    // Основной цикл

    /**
     * Бесконечный цикл смены фраз.
     *
     * Порядок для каждой фразы:
     * 1. applyPhraseToDOM — обновляем data-word (CSS-стили переключаются)
     * 2. typePhrase       — посимвольный набор всех слов
     * 3. sleep            — пауза чтения
     * 4. deletePhrase     — посимвольное удаление в обратном порядке
     * 5. sleep            — пауза перед следующей фразой
     */
    async function runLoop() {
      let index = 0;

      while (true) {
        const phrase = PHRASES[index % PHRASES.length];

        applyPhraseToDOM(phrase);
        await typePhrase(phrase);
        await sleep(PAUSE_AFTER_TYPE);
        await deletePhrase(phrase);
        await sleep(PAUSE_AFTER_DELETE);

        index++;
      }
    }

    runLoop();

  })();

  // Одноразовая печать
  (function () {

    // Общие утилиты (вынесены из основного IIFE)

    const TYPE_SPEED = 0.07;
    const TYPE_VARIANCE = 0.04;

    function getTypeDelay() {
      return TYPE_SPEED + (Math.random() * 2 - 1) * TYPE_VARIANCE;
    }

    function sleep(seconds) {
      return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }

    // Одноразовая печать

    function waitForVisible(el) {
      return new Promise(resolve => {
        const observer = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting) {
            observer.disconnect();
            resolve();
          }
        }, { threshold: 0.2 });

        observer.observe(el);
      });
    }

    async function typeOnce(el) {
      // Берём текст напрямую из el, убираем лишние пробелы и переносы
      const text = el.textContent.trim().replace(/\s+/g, ' ');
      // const text = el.querySelector('*');
      
      // Очищаем весь контент включая <br>
      el.innerHTML = '';

      // Создаём курсор через js
      const cursor = document.createElement('span');
      Object.assign(cursor.style, {
        display: 'inline-block',
        fontWeight: '300',
        marginLeft: '0.2rem',
        opacity: '1',
      });
      cursor.textContent = '|';
      el.appendChild(cursor);

      const localCursorTween = gsap.to(cursor, {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'none',
        paused: true,
      });

      // Ждём появления в viewport
      await waitForVisible(el);

      localCursorTween.pause();
      gsap.set(cursor, { opacity: 1 });

      // Печатаем посимвольно
      for (const char of text) {
        const span = document.createElement('span');
        span.innerHTML = char === ' ' ? '&nbsp;' : char;
        el.insertBefore(span, cursor);
        await sleep(getTypeDelay());
      }

      // После печати мигаем и убираем курсор
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

  // iOS-safe ScrollTrigger refresh handler
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
   * Инициализация формы набора символов
   */
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

  /**
   * Анимация
   */
  // if (document.documentElement.classList.contains('callback--open')) {

  // }

});