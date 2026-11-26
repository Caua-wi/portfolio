(function () {
    'use strict';
    var raiz = document.documentElement;
    raiz.classList.add('js');

    var botao = document.querySelector('.menu-btn');
    var menu = document.getElementById('menu');
    if (!botao || !menu) return;

    function alternar(abrir) {
        menu.classList.toggle('aberto', abrir);
        botao.setAttribute('aria-expanded', String(abrir));
    }

    botao.addEventListener('click', function () {
        alternar(botao.getAttribute('aria-expanded') !== 'true');
    });

    menu.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') alternar(false);
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && botao.getAttribute('aria-expanded') === 'true') {
            alternar(false);
            botao.focus();
        }
    });

    /* Marca no menu a seção que está visível */
    if ('IntersectionObserver' in window) {
        var links = menu.querySelectorAll('a');
        var obs = new IntersectionObserver(function (itens) {
            itens.forEach(function (item) {
                if (!item.isIntersecting) return;
                links.forEach(function (a) {
                    if (a.getAttribute('href') === '#' + item.target.id) {
                        a.setAttribute('aria-current', 'true');
                    } else {
                        a.removeAttribute('aria-current');
                    }
                });
            });
        }, { rootMargin: '-35% 0px -60% 0px' });
        document.querySelectorAll('main section[id]').forEach(function (s) { obs.observe(s); });
    }
})();
