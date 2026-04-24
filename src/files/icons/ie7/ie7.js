/* To avoid CSS expressions while still supporting IE 7 and IE 6, use this script */
/* The script tag referencing this file must be placed before the ending body tag. */

/* Use conditional comments in order to target IE 7 and older:
	<!--[if lt IE 8]><!-->
	<script src="ie7/ie7.js"></script>
	<!--<![endif]-->
*/

(function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'SovokIconFont\'">' + entity + '</span>' + html;
	}
	var icons = {
		'icon-logo': '&#xe900;',
		'icon-arrow-double-rw-right': '&#xe906;',
		'icon-arrow-double-rb-right': '&#xe90a;',
		'icon-chevron-double-rw-right': '&#xe90e;',
		'icon-chevron-double-bw-right': '&#xe912;',
		'icon-chevron-right': '&#xe916;',
		'icon-close': '&#xe917;',
		'icon-triangle': '&#xe918;',
		'icon-be': '&#xe919;',
		'icon-pt': '&#xe91a;',
		'icon-vc': '&#xe91b;',
		'icon-inst': '&#xe91c;',
		'icon-wa': '&#xe91d;',
		'icon-tg': '&#xe91e;',
		'icon-vk': '&#xe91f;',
		'icon-max': '&#xe920;',
		'icon-star': '&#xe921;',
		'0': 0
		},
		els = document.getElementsByTagName('*'),
		i, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
}());
