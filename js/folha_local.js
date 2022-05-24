"use strict"

const _GRAU_DESCONHECIDO = 0;
const _ROMAN_TO_NUMBER = {
	"i": 1,
	"ii": 2,
	"iii": 3,
	"iv": 4,
	"v": 5,
	"vi": 6,
	"vii": 7,
	"viii": 8,
	"ix": 9,
	"x": 10,
	"xi": 11,
	"xii": 12,
	"xiii": 13
}

function get_max_height(bars) {
	let max_h = 0;

	for(let bar of bars) {
		let h = Number(bar.getAttribute("qtd"));
		max_h = Math.max(max_h, h);
	}

	return max_h;
}

function set_height_in_style(bars, bars_value) {
	// preenche quantidades
	for(let i = 0; i < bars.length; i++) {
		let bar_node = bars[i];
		let bar_value_node = bars_value[i];

		let h = Number(bar_node.getAttribute("qtd"));

		if(h > 0) {
			bar_value_node.textContent = String(h);
		}
	}

	// gambiarra para determinar quanto espaço resta
	let max_h = get_max_height(bars);
	let max_h_px = get_max_h_px();

	for(let i = 0; i < bars.length; i++) {
		let bar_node = bars[i];

		let h = Number(bar_node.getAttribute("qtd"));
		//let rel_h = (h/max_h*100);
		//let str_rel_h = String(rel_h) + "%";

		let h_in_px = h/max_h * max_h_px;
		let str_h_in_px = String(h_in_px) + "px";
		bar_node.style.height = str_h_in_px;
	}
}

function get_max_h_px() {
	let n1 = document.querySelector(".chart-column-container");
	let n2 = document.querySelector(".chart-bar-value");
	
	return (n1.clientHeight - n2.offsetHeight);
}

function parse_grau(g) {
	g = String(g);
	g = g.trim().toLowerCase();
	g = g.split(' ')[0]

	let n;
	let adendo = "";

	if(g.endsWith("sup")) {
		adendo = "+";
		g = g.slice(0, g.length-3);
	} else if(g.endsWith("+")) {
		adendo = "+";
		g = g.slice(0, g.length-1);
	} else if( g.endsWith('a') || g.endsWith('b') || g.endsWith('c') ) {
		adendo = g[g.length-1];
		g = g.slice(0, g.length-1);
	}

	// caso fácil
	if( is_digit(g[0]) ) {
		n = Number(g[0])
		if( (g.length >= 1) && (is_digit(g[1])) ) {
			n = n*10 + Number(g[1]);
		}
	} else if(_ROMAN_TO_NUMBER.hasOwnProperty(g)) { // caso romano
		n = _ROMAN_TO_NUMBER[g];
	} else { // caso impossível
		n = _GRAU_DESCONHECIDO;
	}

	//if(n != _GRAU_DESCONHECIDO) {
	//	n = String(n) + adendo;
	//}

	return n;
}

function is_digit(c) {
	return ( ('0'<=c) && (c<='9') );
}

function do_it() {

	let graus = ["5° VIIa A1", "3° IV", "6° A2+", "VIsup E3", "3º IV E2 D2", "6°", "3° IV E5 D2", "4º Vsup E3 D3", "3º IVsup E4 D1", "7º VIIIa E2 D1", "4º VIsup E2", "5º VIIIc A2+ E3 D4", "6º VIIb", "3º IV E3 D1", "III sol", "3º IVsup E4 D1", "2º IIsup E3 D1", "IIIsup sol", "3º IV E3/E4 D1", "3° IV", "3º V", "6° A2+", "5° VI", "2°", "7° VIIa", "V (A0 VIsup) E1", "3° III+ C", "7° VIIa A1 E2/E3", "A2+ D6", "5° A2 E3 D5", "3°", "A1", "A2+", "5° VIsup D4", "4° IVsup A1", "VIsup", "5° VIsup", "4° VI", "3° IV", "3° III", "5° IVsup", "5° VIIb", "3º V", "2º III", "6º VIIa A1 D2 E3", "5° VI", "3° IIIsup", "5° Vsup E2", "5° Vsup (A0/7a) E2 D2", "5° V E2 D1", "A3 VI", "4º Vsup E3/E4", "", "IXa", "VIIb", "Xc", "IXc", "VIIc", "IXa", "IXc", "Xb", "VIIIa", "VIIIa", "VIIIc", "IXc", "VIIIb", "4º V", "VIIa a IXa/b", "4° VIIa E2", "4° V E2 D2", "IVsup", "4º VI E1 D1", "5° VI E2 D2", "3°", "3°", "3º IVsup", "3° III", "5° VIIa", "6° VIIb E3", "6º VIIa A2", "6º VIIb A1 E2", "5° VI E2/E3 D2", "2°", "Vsup A2", "5º VI", "3° Vsup", "4° V", "3° IV", "4° V", "4° IV", "2° III", "4° VI", "4° IV", "4° V", "5° VIIsup", "5° VII", "6° VII", "4° VI", "4° V", "6° VIIsup", "4° Vsup", "VI", "V", "7° VIIc", "4° V E3 E4", "4° V", "5° VII E2", "5° Vsup", "4° IVsup", "5º VII", "4° IVsup", "IIIsup", "4° IVsup", "IIIsup", "IIIsup", "IV", "VIIIc", "VIIIa", "VIIIa", "4° V E2 D1", "5° VIIa", "3° IVsup", "8° Xa E2 D4", "6° VIIIa A1+ E3", "IVsup", "6° VIIa", "6º VIIa", "5º VI", "2° III E2", "3° IV E2", "3° IIIsup E2", "VI", "5° VI E2 D1", "2°", "V", "3º V", "2º II", "3° IV E3", "3°", "5° V", "3° V", "3° IVsup", "2º IIIsup", "3° V", "3 III E2 D1", "3° IIIsup", "VIIIa", "VIIa E3", "VIIb E2", "VIIIc", "VIIb", "VIIIa", "VI E2", "V E3", "VIIIb", "VIIa", "5° VIIb/c", "5° VIIa A2 E3 D1", "5° A3 E5 D1", "6° VIsup E1 D1", "IVsup E1", "7º VIIc/A2", "5º VI A1", "5° VI", "3º IVsup", "4° Vsup E2", "5° VIIa", "5° Vsup", "5° VIIa E2", "V E3", "3° IV E2", "IV A0/VIIIb", "5º VI", "6° VIIb D2 E3", "IIIsup", "VIIIa", "III", "VIIIa", "3º IV", "V E2", "5° VIIa E2", "Vsup E4", "4 IV E1 D1", "A2", "2º III", "4º VI E2 D1", "IVsup", "IIIsup E4", "II", "III", "4° VI", "VIIc E1", "VIIIb E1", "IXa", "VIIa", "VIsup E5/66", "VIsup E5", "VIIc E6", "VIsup E5/6", "VIIb E5/6", "2°", "2° IIsup", "5° VIsup A1", "VIIIb E6", "Vsup E4", "7° VIIa", "6º VIIc", "5° VIsup", "3° III", "2º IIIsup", "6° VIIc", "6° VIIb", "5° VI", "6° A1", "4° VI", "VIIa", "6° VIIc", "VIIsup", "1° II", "6º VIIb E2 D1", "4° VII", "VIIc E2", "6º VIIb E2 D3", "V E3", "VIIb", "V", "VI E2", "VI", "VIIb", "VIIIb", "VIIIb E6", "VIIb", "IXb", "VIIa/b", "VIIb", "VIIIc", "VIIa", "V E1", "VI E1", "III E2", "3° IV sup E2", "IV", "VI", "3° IIIsup E2", "3° IIIsup E2", "3°", "3°", "VIIb", "VIIIa", "VIIb", "VIIIb", "VIIIb", "VIIc", "", "", "", "VIIa", "VIIa", "VIsup", "VIIa", "VIsup", "VIsup", "VIIIa", "VI", "VI", "VIIb", "VIIIa", "", "VIIc", "VIIIb", "VIIb", "", "VIIIb", "III", "IV", "IV", "IV", "V5", "V7", "V6", "V6", "V5", "V1", "V1", "V1", "V1", "V3", "V6", "V4", "V3", "V2", "V7", "V0", "V4", "V0", "V0", "8c", "7a", "7a", "4o", "4+", "7c", "6+", "7c", "7a", "5o", "4+", "6o", "5o", "7c", "5+", "6+", "4+", "6o", "6+", "7b", "7c", "5o", "6o", "8a", "8a", "5o", "7c", "7c", "5+", "6+", "5o", "5+", "6o", "4+", "5o", "5+", "3+", "3o", "2o", "7b", "7b", "6+", "7b", "9a", "4o", "5+", "3° IIIsup A1 E2 D3", "2° III", "2° III E2 D2", "2° II", "1° I", "", "A1", "2° IIsup", "5° Vsup", "5° VI", "3°", "3° IV", "5° VIIa", "5° Vsup E2 D1", "III sup", "5°", "2° III", "3° IIIsup", "4° IVsup", "4° V", "", "6° VI A0", "2º IIIsup", "5° VIIa A2 E2 D3", "VIIb", "", "3° IV", "3° IVsup", "4° IVsup E2 D2", "4° IVsup", "3° IIIsup", "2° IV E1 D1", "3°sup", "4° VI", "6° VI", "8° A2", "6° Vsup A1", "3° IIIsup", "A2", "6° VIIsup", "6° A1 E1 D1", "4° IV A2 E1 D1", "5° VI", "3°", "3° IV", "3° IIIsup", "", "4° A1", "1° I", "3° III", "4° V A1 E3", "2° III A1", "3° IIIsup", "4° VI A1 E2 D1", "4°", "1° II", "2° IV", "C", "2° IIsup", "2° IIIsup", "6° IVsup", "3º IIIsup", "5° VIsup", "A1", "2° IIIsup E3", "4° IV", "3° IVsup", "2° III", "4°", "4°", "4° Vsup", "3°", "3° IIIsup", "4° VI E3", "3° IIIsup E3", "2° II", "4° IV A1", "2° III", "6° VIsup", "IV", "6° VI E2", "4° VIsup", "2° IIsup", "4° VI", "5° VI", "2° III", "2° III", "3° IV", "4° Vsup", "5°", "4° V", "4° VI", "2° III", "3° IIIsup", "4º IVsup", "4°", "3° IV", "1°", "3° IVsup", "2° IIsup E2 D1", "5° VI", "4° V", "3° IIIsup", "3° IVsup", "5° VI", "2° III", "5° Vsup E2 D2", "5° VI", "5° VIIa A0/VIIb", "4° IVsup A1 E2 D2", "6º VIsup", "5°", "4° V", "5 V Sup", "2° III", "4° IVsup A1", "4° Vsup", "6º VIsup", "4° V E2 D1", "7° VIIb", "6° VI", "4° VI", "7a", "VIsup", "4° IVsup", "V", "7° VIIsup", "2° IIsup", "3° IV", "1° Isup", "4° V", "3° IVsup", "2° IIIsup", "3° IVsup E2", "4°", "6°", "7°", "3° IIIsup", "4° V", "3° V", "III", "6°", "A3", "7° VIIsup", "3° IV", "2° III", "3° IV", "5° VIIc", "3° IV", "VI", "6° VIsup", "VI", "3° IIIsup", "4° V", "4° VI", "VIIb", "4° V", "5° VIsup", "A2", "7° VIIa", "3° V", "4° IVsup E2 D1", "5° VII", "5° VI", "V", "3° V", "V", "6° VIIsup A2", "VIsup", "4° Vsup", "3° IV", "2°", "7°c", "7° VIIsup", "VIsup", "6° VI A2", "VIsup", "V", "6° VIsup", "5° VIIa", "4° VIsup", "5° VIsup", "2° II", "5° VI", "3° IV", "4°", "VIsup", "3° IIIsup", "VIIa", "VIIIc", "4° IVsup", "2° II", "3°", "5°", "IV", "VII", "2° IIIsup", "1° II", "IVsup A4", "5°", "6° VIIIa", "VIIc", "IIIsup", "VI", "3° IIIsup", "IVsup", "V", "4° VIsup", "II E1", "Xa", "3°", "IIIsup", "VIIa", "VI", "4° VI", "VIsup", "3° IV", "3° VIIb", "4° VI", "4° VIIa", "5° VIIa", "3º IIIsup A1", "VIIc", "6° VIIb", "IVsup", "6° VIIa", "VI", "6° VIIa", "VIsup", "5° VI", "5° VI", "7° VIIb", "IV", "VIIIa", "2°", "VIIa", "VIIa", "5° VIsup", "5° VII", "5° VIsup E1 D2", "4° V", "7° VIIc", "II", "5°", "IV", "1° Isup", "Vsup", "3° IVsup", "IV E1", "4° V A2", "4° V A2", "IV", "VIIb", "5° VI", "3°", "4° V", "V", "4° V", "Vsup", "VIIa", "Vsup", "VIsup", "7°c", "4°", "5º VIIa E2", "Vsup", "III", "IV", "III", "Vsup", "VI", "VIsup", "IIIsup", "VI", "Vsup", "VIIc", "IV", "IV", "Vsup", "II", "III", "VI E1", "5° VI", "3° VI D2", "5° VIsup A1", "5° V E2", "3° IVsup E2 D1", "6° VIIb (A1)", "7° A4", "4° V E1 D1", "A4", "3° V", "3° IV", "A2+", "A2", "7° VIIIc E1 D1", "5° VI", "5° VI A0/7c", "4° Vsup E3", "4° A2+", "", "VIIb", "VI", "VIIa", "4° IV", "3° IVsup", "5° VIIa A2", "3° III", "5° VIIb E2 D1", "4° Vsup", "2° IIsup", "4° VI", "6° VII", "6° VII", "A3+", "4° IVsup E2 D1", "5° VII", "3º IVsup", "IVsup E3", "4° V", "6º VIsup A1", "II E4", "4° IVsup", "5° VI", "5° VI A2 E3 D4", "", "5°a VII A1", "4° IVsup E2", "7º VIIIa A0 E1 D3", "4° V E1/E2", "3° IIIsup/IV E2", "4° V E2", "4° V E2", "3° VI E1", "5°", "7° IXa A0 E3", "3° V E2", "5° Vsup E2", "5° VIIc E2", "7° VIIb", "5° VIsup/A1 E3 D3", "5° VI A0 E2 D2", "IV E2", "Vsup E2", "VIIc", "3° IV E2", "4° IV E3 D1", "3° IIIsup E4", "A2 (VIIIc)", "2° E1 D1", "5° VI", "6° VIIb E2", "7° VIIa A2+ D5", "4° E2", "6° VIsup E3 D4", "VI", "3° V E2", "4° VIsup E2 D2", "VIIb", "4° E3", "5° VI D2 E4", "A2 VIsup", "Xc", "3° V", "6° E3 D1", "IVsup", "III", "4° VII", "4° V E2", "4° E3", "4° E2", "4° V E3 D1", "", "5º VIIb A2", "5° VIsup 7b/A1", "7°", "5° VIsup, E1, D2", "4° IVsup", "4° Vsup", "6° VII", "Vsup", "VIsup", "Vsup", "V E3", "V", "4° V E3", "IVsup E3", "4° VI E2", "5° VIsup/VIIa A0 E1 D1", "5° VIIa E2/E3", "5° VIIc", "4° A2 D1", "6º VIIb E2", "3° V", "4° E2", "3° IV E1 D1", "3° IVsup", "4° V E3 D2", "4° Vsup", "A2", "VI E2 D1", "2° III D1 E2", "6° VIsup A1 E1", "6B A2+ E2", "4° VI E2 D1", "6° VIIa E3 D3", "6° VII E2/E3 D1", "2° III", "2° IVsup E2/E3 D1", "V E2", "4° V E3", "4° V E2/E3 D2", "5° VI E2", "4° V E3 D3", "3° V A0/VIIa", "2º Vsup E2 D2", "3° IVsup E2 D2", "3º E2", "3° IV E2 D1", "4° V E2 D1", "V E4/E5", "IIIsup E3/E4", "5°VI E3 D2", "3° IIIsup", "3°", "5° VII E2", "3° IIIsup E2", "2° IV A0 E1", "3° IV E2", "4° IVsup E1/E2 D1", "5° VIIa A0", "3° IVsup E2 D1", "4° IVsup E2 D1", "5° VI", "6º VIIb E3", "2º VI E2 D1", "4° IVsup E2 D1", "4° IVsup E3/E4 D2", "3° IIIsup (A0/IVsup) E2 D2", "3º IIIsup E2 D1", "VIsup E2", "3° IV E2", "IV A0", "4° V A0 E1", "4° V E2", "3° VIsup E2", "3º Vsup E1", "4º V", "4°V E2/E3 D1", "5° VIIc", "II", "Vsup E2 D1", "6° VIIa E2 D1", "5° VIIb E2 D1", "4° V E3", "2º III E3 D2", "3º IVsup", "2º IIIsup E5", "2º II E3 D1", "5º V (A1/Vsup)", "7° VIIIa", "3° IV E2", "3° IV E2", "III E2", "6º VIIb E2", "4° IVsup", "2° III", "5° V E2 D1", "3° IV E2 D1", "6° VIIb E2", "A2/A3", "3° V E4 D1", "5° VIIa E2 D1", "3° III D1 E2/E3", "4° V E2 D1", "3° IV E2", "6° Vsup E3 D3", "3° III E2", "3° II E1", "4° IV E1", "6° VIIb A0", "3° III E2 D1", "4° V (A0/VI) E2 D1", "4° IV A0 E2 D", "A0 E1 D1", "4° IV E1", "4° IV E2 D1", "5° VI E1", "4° Vsup E1", "6° VIIa E1", "5° V E2 D1", "VIIb E1 D1", "VIIa E1 D1", "VIIIa E1 D1", "IV E1 D1", "3° III D1 E1", "4° V D1", "2° II D1 E1", "3° IV E2 D1", "3° III E2 D1", "4° V E2 D1", "3° IV E2/E3 D2", "4° IV E2 D1", "3° V E2 D1", "5° VIsup (A2) E2 D2", "6° VIIa E2 D1", "4° VI E2 D1", "6° VII D2", "A2+ V D3", "2° III E3", "3° V E2 D1", "6° VIsup A0", "6° VII E3 D3", "4° IVsup (A0/VI) E1 D2 D1", "4° IVsup", "6° VIIc E3 D1", "3° V E1 D1", "VI", "VI E1 D1", "6° VIsup E1 D1", "6° VIsup (A0/VIIb) E2 D1", "Vsup", "4° VIsup E1/E2 D1", "5° VI E1", "6º VIIa A3 D6", "7° VIIIa E3 D4", "6° (A0/VIIb)", "4° V E3 D4,", "A2+ VIIa", "II E1", "IV E1", "IV E1", "IV E1", "IV E1", "Vsup E1", "III E1", "III E1", "IV E1", "4º Vsup E3 D1", "5° VI E1/E2", "6° VIsup E2", "6° 6sup A0 E1 D1", "4° V E1 D2", "IV", "4° V E2 D2", "4° VIIa E2/E3 D1", "5° 7a D3 E3", "4º IVsup E4 D2", "5° VI E3 D2", "VI E1", "4° V E2", "5° VIIa E3 D3", "6° VIIIa E2 D2", "5° VI E2", "6° VIII E2", "5° VIIa E1/E2", "4° VI (VIIc/A0) E2 D2", "3° Vsup E1/E2 D2", "A2 E2 D3", "4° V E2", "IVsup E1", "5° VIIa E2", "6° VII A2 E2 D3", "3° VI E2/E3 D2", "4° V E2 D2", "4° V E2", "2º III E2 D1", "3° Vsup D2 E3", "3° IVsup E2 D1", "4° VIsup E1/E2 D2", "5° VIIb E2/E3 D2", "4° VI E2 D2", "5° VIsup E2/E3", "4° VI E2 D2", "2° IIsup E2 D1", "3° IVsup D1 E2", "VI E1", "IVsup E3", "IV E2", "V E1", "Vsup E1", "VIsup E1", "VI E1", "VIsup E2", "III E1", "IV E2", "IV E2", "IVsup E1", "IIIsup E1", "VIIIb E1", "VIIc E1", "V E1", "VI E1", "III E1 D1", "3º III E2 D1", "3° V (A0/VIIa confirmar) E2 D1", "3° IIIsup E1 D1", "7° VIIb A0 E2 D4", "IIIsup E2", "IV E2/E3", "III E2", "IV E1", "4° VIIa E1 D1", "2° IIsup E1", "2° IIIsup E2 D1", "IVsup E1", "III E1", "6° VIIa E1-E2", "3° III sup D1 E2", "3° IVsup E2/E3 D2", "3° IVsup", "5º VII E3", "4° V E1 D1", "5° VI E1 D1", "5° VIIa E2 D1", "5° VIIa", "4° VI", "IV", "V", "III E1 D1", "5° VIsup E1", "VI E1", "IV E1", "III E2", "IV E2", "IV sup E1", "III sup E1", "III sup E2", "II E1", "V E3", "VIIc E1", "III E2", "2° IV sup D1 E2", "IV E2", "III E2", "4° VIIa D1 E1", "3° IV D1 E1/E2", "3° IIIsup E2", "3° IIIsup", "VIIc E1 D1", "VIIb E1 D1", "VIIc/VIIIa E1 D1", "3° IV E2", "4° E2", "3° IV E2 D2", "VIIc E1", "VI E1", "4° VI D1 E1", "V E1", "IV sup E1", "III sup E1", "VIIb E1", "VIIa E1", "III sup E2", "VIIb E1", "2° II A0 E2 D1", "4° VI E2 - Mista", "5° VIsup A0 (7b)", "4° V A0/VIIa", "3° IVsup", "5° VIIa A0 E2 D3", "Vsup E1", "3º IV E1", "3º IIIsup E1/E2", "3° IV E2", "V E1/E2", "VIIb E1", "III E2", "V E1", "VIIIa", "Vsup", "VIIb", "VIIb", "IXa", "VIIIb", "VIIc", "VIIc", "VIIb", "VIIb", "Vsup", "VIsup", "Visup", "VIsup", "VIIc", "IV", "VIIIa", "VIIc", "VIIa", "VIsup", "VIsup", "VI", "Vsup", "V", "VIIa", "", "VIIa", "VIIb", "VIIb", "VIIc", "VIIa", "", "IXb", "VIIIc", "VIIIa", "IV", "IV", "IV", "V", "IV", "VIIc", "", "", "VIsup", "VIIa", "VIsup", "Vsup", "Vsup", "VIIa", "VIIa", "VIIa", "VIIa", "VIIa", "VIIIa", "VIsup", "VIIb", "VIIb", "VIIIb", "VIIIb", "", "VIIb", "", "VIIa", "A1", "VIsup", "V", "VIsup", "VI", "VIIa", "IV", "IV", "VIIc", "V", "", "VIIb", "VIIIa", "V", "Vsup", "VIsup", "IVsup", "VIsup", "IV", "V", "V2", "", "VIIIa", "VIsup", "", "VIIa", "V", "VIIa", "VIIIb", "V", "Vsup", "VIIc", "VIIa", "IVsup", "", "VI", "", "", "VIIa", "VIIa", "", "VIIIb", "VIIIb", "VIIIb", "7b", "VIIc", "VIIIb", "", "VIIc", "IXa", "", "VIIIc", "VIsup", "VIIa", "Vsup", "VI", "IV", "Vsup", "VI", "VIIb", "VIIa", "VIIa", "VIsup", "VI", "IVsup", "VIIa", "VIIa", "VIsup", "", "", "", "VIIb", "VIIIb", "VIIIb", "VIIIc", "VI", "VIIIb", "IXb"];
	let v = new Array(graus.length);
	for(let i = 0; i < graus.length; i++) {
		v[i] = parse_grau(graus[i]);
	}

	return v;
}

function set_dist_graus(node) {
	if(!node.hasOwnProperty("dist_graus")) {
		if(node.tipo == "local") {
			node["dist_graus"] = get_empty_dist_graus();

			for(let filho of node.filhos) {
				if(filho.tipo == "via") {
					let grau_filho = parse_grau(filho.grau);
					if(grau_filho != _GRAU_DESCONHECIDO) {
						node["dist_graus"][grau_filho] += 1;
					}
					
				} else {
					set_dist_graus(filho);
					for(let key in filho["dist_graus"]) {
						node["dist_graus"][key] += filho["dist_graus"][key];
					}
				}
			}
		}
	}
}

function set_dist_anos(node) {
	if(!node.hasOwnProperty("dist_anos")) {
		if(node.tipo == "local") {
			node["dist_anos"] = new Object();

			for(let filho of node.filhos) {
				if(filho.tipo == "via") {
					let ano = filho.ano;
					
					if(!node["dist_anos"].hasOwnProperty(ano)) {
						node["dist_anos"][ano] = 0;
					}

					node["dist_anos"][ano] += 1;
					
				} else { //node.tipo = local
					set_dist_anos(filho);
					for(let ano in filho["dist_anos"]) {
						if(!node["dist_anos"].hasOwnProperty(ano)) {
							node["dist_anos"][ano] = 0;
						}

						node["dist_anos"][ano] += filho["dist_anos"][ano]
					}
				}
			}
		}
	}
}

function get_empty_dist_graus() {
	return {
				1: 0,
				2: 0,
				3: 0,
				4: 0,
				5: 0,
				6: 0,
				7: 0,
				8: 0,
				9: 0,
				10: 0,
				11: 0,
			};
}