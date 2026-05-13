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
		'icon-p': '&#xe903;',
		'icon-chevron-thin-down': '&#xe900;',
		'icon-add-doc': '&#xe901;',
		'icon-download': '&#xe902;',
		'icon-arrow-double-rw-right': '&#xe909;',
		'icon-arrow-double-rb-right': '&#xe90d;',
		'icon-chevron-double-rw-right': '&#xe911;',
		'icon-chevron-double-bw-right': '&#xe915;',
		'icon-chevron-right': '&#xe919;',
		'icon-close': '&#xe91a;',
		'icon-triangle': '&#xe91b;',
		'icon-be': '&#xe91c;',
		'icon-pt': '&#xe91d;',
		'icon-vc': '&#xe91e;',
		'icon-inst': '&#xe91f;',
		'icon-wa': '&#xe920;',
		'icon-tg': '&#xe921;',
		'icon-vk': '&#xe922;',
		'icon-max': '&#xe923;',
		'icon-star': '&#xe924;',
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
