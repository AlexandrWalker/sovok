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
		'icon-chevron-right': '&#xe900;',
		'icon-close': '&#xe901;',
		'icon-triangle': '&#xe902;',
		'icon-arrow-double-rw-right': '&#xe903;',
		'icon-arrow-double-rb-right': '&#xe907;',
		'icon-chevron-double-bw-right': '&#xe90b;',
		'icon-chevron-double-rw-right': '&#xe90f;',
		'icon-be': '&#xe913;',
		'icon-pt': '&#xe914;',
		'icon-vc': '&#xe915;',
		'icon-inst': '&#xe916;',
		'icon-wa': '&#xe917;',
		'icon-tg': '&#xe918;',
		'icon-vk': '&#xe919;',
		'icon-max': '&#xe91a;',
		'icon-star': '&#xe91b;',
		'icon-logo': '&#xe91c;',
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
