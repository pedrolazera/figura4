'use strict'

// constantes
const _CLS_SET_INVISIBLE = "invisible";

const _ID_T_MENU = "t-menus";
const _ID_T_ITEM_LOCAL = "t-menus-item-local";
const _ID_T_ITEM_VIA = "t-menus-item-via";
const _ID_T_VIA = "t-via";
const _ID_T_VIA_CONTENT = "t-via-content";
const _ID_T_LOCAL_FOLHA = "t-local-folha";
const _ID_T_LOCAL_FOLHA_CONTENT = "t-local-folha-content";

class ViasComponent {
	constructor(raiz, vias, locais, dic_fontes, app) {
		this.raiz = raiz;
		this.vias = vias;
		this.locais = locais;
		this.dic_fontes = dic_fontes;
		this._app = app;
		this._ID = "vias";

		// constantes de visita
		this._VISITA_LOCAL = "local";
		this._VISITA_FOLHA_VIA = "folha_via";
		this._VISITA_BUSCA = "busca";
		this._VISITA_FOLHA_LOCAL = "folha_local";

		// constantes de ordenacao
		this._SORT_BY_NOME = 0;
		this._SORT_BY_GRAU = 1;
		this._SORT_BY_ORDEM = 2;
		this._SORT_BY_EXTENSAO = 3;
		

		app.add_component(this.id_component, this);
		dfs_add_nome_de_busca(raiz);

		// inner_state
		this.inner_state = Object();
		this.inner_state.sort_fn = this._SORT_BY_NOME;
		this.inner_state.sort_ascending = true;
	}

	go_to_initial_state() {
		let state = {"id_nome": this.raiz.id_nome,
					 "tipo": this._VISITA_LOCAL};
		this._app.go_to_page(this.id_component, state);
	}

	busca(query) {
		query = get_nome_simplificado(query);
		let state = {"query": query,
					 "tipo": this._VISITA_BUSCA};
		this._app.go_to_page(this.id_component, state);
	}

	get_fragment(state) {
		let tipo = state.tipo;
		let t;

		if (tipo == this._VISITA_LOCAL) {
			let id_nome = parseInt(state.id_nome);
			let node = this.locais[state.id_nome];
			let v_location_nodes = get_caminho_with_nodes(node);
			let v_nodes = node.filhos.slice();

			//update inner state
			this.inner_state.curr_v_nodes = v_nodes;
			this.inner_state.tipo = tipo;
			this.inner_state.add_loc_to_menu_itens = false;

			t = this._create_template_menu(v_nodes, v_location_nodes, false);
		} else if (tipo == this._VISITA_FOLHA_VIA) {
			let id_nome = parseInt(state.id_nome);
			let node = this.vias[state.id_nome];

			//update inner state
			this.inner_state.tipo = tipo;
			this.inner_state.curr_node = node;

			t = this._create_template_via(node);
		} else if (tipo == this._VISITA_BUSCA) {
			let query = state.query;
			let v_nodes = get_nodes_from_busca(query, this.locais, this.vias);

			//update inner state
			this.inner_state.curr_v_nodes = v_nodes;
			this.inner_state.tipo = tipo;
			this.inner_state.add_loc_to_menu_itens = true;

			t = this._create_template_menu(v_nodes, [], true);
		} else if (tipo == this._VISITA_FOLHA_LOCAL) {
			//throw "Visita a folha de local ainda nao implementado!";
			let id_nome = parseInt(state.id_nome);
			let node = this.locais[state.id_nome];

			//update inner state
			this.inner_state.tipo = tipo;
			this.inner_state.curr_node = node;

			t = this._create_template_local_folha(node);
		} else {
			throw "Tipo de visualizacao desconhecido!"
		}

		return t.fragment;
	}

	get id_component () {
		return this._ID;
	}

	/* pagina da via */
	_create_template_via(node) {
		let t = create_empty_template_via();

		// localizacao
		let tag_menu_location = t.get_node("loc");
		let v_location_nodes = get_caminho_with_nodes(node.pai);
		let location_fragment = this._get_location_span_from_location_nodes(v_location_nodes);
		tag_menu_location.insertBefore(location_fragment, null);

		// via
		let tag_menu_via = t.get_node("via");
		let via_fragment = this._get_via(node);
		tag_menu_via.insertBefore(via_fragment, null);

		return t;
	}

	_get_via(node) {
		let t = create_empty_template_via_content();

		let id_nome = node.id_nome,
			nome = node.nome,
			grad = node.grau,
			ext = node.extensao,
			conq = node.conquistadores,
			ano = node.ano,
			obs = "--"; // TEMPORÁRIO, ENQUANTO NÃO TENHO COMENTÁRIOS!

		// preenche dados vazios com "--"
		if(!grad) grad = "--";
		if(!ano) ano = "--";
		if(!ext) {
			ext = "--";
		} else {
			ext = String(ext) + "m";
		}

		// adiciona infos da via
		t.set_node_content('titulo', nome);
		t.set_node_content('graduacao', grad);
		t.set_node_content('extensao', ext);
		t.set_node_content('ano', ano);

		let p;
		if(node.comentarios.length > 0) {
			for(let comentario of node.comentarios) {
				p = document.createElement("p");
				p.textContent = comentario;
				t.append_child("observacoes", p);
			}
		} else {
			p = document.createElement("p");
			p.textContent = "--";
			t.append_child("observacoes", p);
		}

		// Adiciona fontes
		if(node.fontes.length > 0) {
			p = document.createElement("p");
			p.textContent = "Fontes:"
			for(let fonte of node.fontes) {
				let span = document.createElement("a");
				span.classList.add("fonte-de-via");
				span.textContent = this.dic_fontes[fonte]["nome"];
				span.setAttribute("href", this.dic_fontes[fonte]["link"]);
				span.setAttribute("target", "_blank");
				p.appendChild(span);
			}

			t.append_child("observacoes", p);
		}		
		

		if(conq.length > 0) {
			t.append_child('conquistadores', this._get_conquistadors_span(conq));
		} else {
			t.set_node_content("conquistadores", "--");
		}

		// adiciona link aos botões (ou torna disabled)
		//// croqui
		if(node.croqui !== null) {
			let path_croqui = get_path_from_croqui_name(node.croqui);
			t.set_node_attribute('icon-croqui', "href", path_croqui);
		} else {
			t.add_node_class('icon-croqui', "disabled");
		}

		//// imagens
		if(node.imgs.length > 0) {
			this._add_link_to_modal(t.get_node('icon-fotos'), id_nome);
		} else {
			t.add_node_class('icon-fotos', "disabled");
		}

		return t.fragment;
	}

	/* menus internos*/

	/*_create_template_menu_from_node(node, add_loc_to_menu_itens = false) {
		let v_location_nodes = get_caminho_with_nodes(node);
		let t = this._create_template_menu(node.filhos,
			v_location_nodes, add_loc_to_menu_itens);
		return t;
	}*/

	_create_template_menu(v_nodes, v_location_nodes = [],
		add_loc_to_menu_itens = false) {
		let t = create_empty_template_menu();

		let tag_menu_location = t.get_node("loc");
		let tag_menu_lista = t.get_node("lista");

		let lista_fragment = this._get_menu_itens_from_node_list(v_nodes, add_loc_to_menu_itens);
		tag_menu_lista.insertBefore(lista_fragment, null);

		let location_fragment = this._get_location_span_from_location_nodes(v_location_nodes);
		tag_menu_location.insertBefore(location_fragment, null);

		// event listeners
		let node_options = t.get_node("options-btn");
		t.get_node("plus").addEventListener("click", function() {
			node_options.classList.toggle("invisible");
		});
		this._add_sort_by_nome(t.get_node("sort-by-nome"));
		this._add_sort_by_extensao(t.get_node("sort-by-extensao"));

		return t;
	}

	_get_menu_itens_from_node_list(v, add_loc_to_menu_itens = false) {
		let fragment = document.createDocumentFragment();
		let ti;

		for (let vi of v) {
			if(vi.tipo == "local") {
				ti =  create_empty_template_menu_item_local();
				this._add_link_to_local(ti.get_node("container"), vi.id_nome);
				ti.set_node_content("qtd",  String(vi.qtd_vias));
			} else if(vi.tipo == "via") {
				ti =  create_empty_template_menu_item_via();
				this._add_link_to_folha_via(ti.get_node("container"), vi.id_nome);

				// grau
				if(vi.grau) {
					let grau = parse_grau_via(vi.grau)
					ti.set_node_content("grau", grau);
				}

				// extensao
				if(vi.extensao) {
					let extensao = String(vi.extensao) + "m";
					ti.set_node_content("extensao", extensao);
				}
			} else {
				throw "tipo do no desconhecido";
			}

			// nome do item
			ti.set_node_content("nome", vi.nome);

			if (add_loc_to_menu_itens) {
				set_menu_item_location(ti.get_node("left"), vi);
			}

			// insere no no menu
			fragment.insertBefore(ti.fragment, null);
		}

		return fragment;
	}

	_get_location_span_from_location_nodes(v) {
		let fragment = document.createDocumentFragment();
		let dom_node;
		for (let node of v) {

			dom_node = document.createElement("span");
			dom_node.textContent = node.nome;
			this._add_link_to_local(dom_node, node.id_nome);

			fragment.insertBefore(dom_node, null);
		}

		return fragment;
	}

	_get_conquistadors_span(v_nomes) {
		let fragment = document.createDocumentFragment();

		let dom_node;
		for (let nome of v_nomes) {

			dom_node = document.createElement("span");
			dom_node.textContent = nome;
			this._add_link_to_conquistador(dom_node, nome);

			fragment.insertBefore(dom_node, null);
		}

		return fragment;
	}

	_add_sort_by_nome(node) {
		let _self_ = this;
		let sort_fn;

		node.addEventListener("click", function() {
			let sort_ascending = !_self_.inner_state.sort_ascending;
			
			if(sort_ascending) {
				sort_fn = function(a,b) {
					if(a.tipo==="local" && b.tipo==="via") return -1;
					if(a.tipo==="via" && b.tipo==="local") return 1;
					return a.nome.localeCompare(b.nome);
				}
			} else {
				sort_fn = function(a,b) {
					if(a.tipo==="local" && b.tipo==="via") return -1;
					if(a.tipo==="via" && b.tipo==="local") return 1;
					return b.nome.localeCompare(a.nome);
				}
			}
			
			// update inner state
			_self_.inner_state.sort_fn = _self_._SORT_BY_NOME;
			_self_.inner_state.sort_ascending = sort_ascending;

			_self_._sort_by(sort_fn);
		});
	}

	_add_sort_by_extensao(node) {
		let _self_ = this;
		let sort_fn;

		node.addEventListener("click", function() {
			let sort_ascending = !_self_.inner_state.sort_ascending;
			
			if(sort_ascending) {
				sort_fn = function(a,b) {
					if(a.tipo==="local" && b.tipo==="via") return -1;
					if(a.tipo==="via" && b.tipo==="local") return 1;
					if(a.tipo==="local" && b.tipo==="local") return a.nome.localeCompare(b.nome);
					if(a.extensao===b.extensao) return 0;
					if(a.extensao === null) return -1;
					if(b.extensao === null) return 1;
					if(a.extensao>b.extensao) return 1;
					if(b.extensao>a.extensao) return -1;
					return 0;
				}
			} else {
				sort_fn = function(a,b) {
					if(a.tipo==="local" && b.tipo==="via") return -1;
					if(a.tipo==="via" && b.tipo==="local") return 1;
					if(a.tipo==="local" && b.tipo==="local") return a.nome.localeCompare(b.nome);
					if(a.extensao===b.extensao) return 0;
					if(a.extensao === null) return 1;
					if(b.extensao === null) return -1;
					if(a.extensao>b.extensao) return -1;
					if(b.extensao>a.extensao) return 1;
					return 0;
				}
			}
			
			// update inner state
			_self_.inner_state.sort_fn = _self_._SORT_BY_EXTENSAO;
			_self_.inner_state.sort_ascending = sort_ascending;

			_self_._sort_by(sort_fn);
		});
	}

	_sort_by(sort_fn) {
		let v_nodes = this.inner_state.curr_v_nodes;
		let add_loc_to_menu_itens = this.inner_state.add_loc_to_menu_itens;

		v_nodes.sort(sort_fn);
		
		let lista = this._get_menu_itens_from_node_list(v_nodes, add_loc_to_menu_itens);
		let wrapper_conteudo = document.getElementById("menus-list");
		this._app.render_from_node(wrapper_conteudo, lista);
	}

	_add_link_to_local(node, id_nome) {
		let state = {"id_nome": id_nome,
					 "tipo": this._VISITA_LOCAL};
		return this._add_link_to_node(node,
			this.id_component, state);
	}

	_add_link_to_folha_via(node, id_nome) {
		let state = {"id_nome": id_nome,
					 "tipo": this._VISITA_FOLHA_VIA};
		return this._add_link_to_node(node,
			this.id_component, state);
	}

	_add_link_to_modal(node, id_nome) {
		let state = {"id_nome": id_nome};
		return this._add_link_to_node(node, "modal", state);
	}

	_add_link_to_conquistador(node, id_conquistador) {
		let state = {"tipo": "conquistas",
					 "nome": id_conquistador};
		return this._add_link_to_node(node, "conquistas", state);
	}

	_add_link_to_node(node, id_component, state) {
		let _app = this._app;
		node.addEventListener("click", function() {
			_app.go_to_page(id_component, state);
		});
	}

	_create_template_local_folha(node) {
		set_dist_graus(node);
		let t = create_empty_template_local_folha();

		// localizacao
		let tag_menu_location = t.get_node("loc");
		let v_location_nodes = get_caminho_with_nodes(node);
		let location_fragment = this._get_location_span_from_location_nodes(v_location_nodes);
		tag_menu_location.insertBefore(location_fragment, null);

		// interno
		let tag_local_folha = t.get_node("local-folha");
		let interno_template = create_empty_template_local_folha_content();
		interno_template.set_node_content("titulo", node.nome + " - Estatísticas");
		interno_template.set_node_content("teste", String(Object.entries(node["dist_graus"]).join("\n")));
		tag_local_folha.insertBefore(interno_template.fragment, null);

		return t;
	}
}

/* Create templates */
function create_empty_template_menu() {
	let t = new Template(_ID_T_MENU, "ref");
	return t;
}

function create_empty_template_menu_item_local() {
	let t = new Template(_ID_T_ITEM_LOCAL, "ref");
	return t;
}

function create_empty_template_menu_item_via() {
	let t = new Template(_ID_T_ITEM_VIA, "ref");
	return t;
}

function create_empty_template_via() {
	let t = new Template(_ID_T_VIA, "ref");
	return t;
}

function create_empty_template_via_content() {
	let t = new Template(_ID_T_VIA_CONTENT, "ref");
	return t;
}

function create_empty_template_local_folha() {
	let t = new Template(_ID_T_LOCAL_FOLHA, "ref");
	return t;
}

function create_empty_template_local_folha_content() {
	let t = new Template(_ID_T_LOCAL_FOLHA_CONTENT, "ref");
	return t;
}

function get_location_span_from_location_names(v) {
	let fragment = document.createDocumentFragment();
	for (let nome of v) {
		let node = document.createElement("span");
		node.textContent = nome;
		fragment.insertBefore(node, null);
	}

	return fragment;
}

function get_path_from_croqui_name(croqui_name) {
	let path_croqui = "./dados/croquis/" + croqui_name;
	return path_croqui
}

/************************************
* funções p/ decorar itens da lista *
*************************************/

function parse_grau_via(txt) {
	const TOKENS = ["D", "E", "("];
	let i = txt.length;
	for(let t of TOKENS) {
		let i_tmp = txt.indexOf(t);
		if (i_tmp != -1)
			i = Math.min(i, i_tmp);
	}

	if(i != txt.length) {
		txt = txt.slice(0, i).trim();
	}

	return txt;
}

function get_nodes_from_busca(query, v_locais, v_vias) {
	let v = [];

	// procura locais
	for(let id_nome in v_locais) {
		let node = v_locais[id_nome];
		if(node.nome_busca.includes(query)) {
			v.push(node)
		}
	}

	// procura vias
	for(let id_nome in v_vias) {
		let node = v_vias[id_nome];
		if(node.nome_busca.includes(query)) {
			v.push(node)
		}
	}

	return v;
}

// simplifica a string, para facilitar a busca por palavras
function get_nome_simplificado(nome) {
	// retira acentos
	// converte para minúscula
	// retira caracteres proibidos
	nome = nome.replace(/[#=\/&]/g,"")
	return nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// retorna string do caminho do da raiz até o nó
function get_caminho(node) {
	let v = [];

	// o nó não faz parte de seu caminho
	if(node.tipo == "via")
		node = node.pai;

	while(node !== null) {
		v.push(node.nome);
		node = node.pai;
	}

	v.pop(); //ignora raiz
	v = v.reverse();

	return v;
}

function get_caminho_with_nodes(node) {
	let v = [];

	/*
	// o nó não faz parte de seu caminho
	if(node.tipo == "via")
		node = node.pai;
	*/

	while(node !== null) {
		v.push(node);
		node = node.pai;
	}

	v.pop(); //ignora raiz
	v = v.reverse();

	return v;
}

function dfs_add_nome_de_busca(node) {
	node.nome_busca = get_nome_simplificado(node.nome);
	for(let filho of node.filhos) {
		dfs_add_nome_de_busca(filho);
	}
}

function set_menu_item_location(dom_node, node) {
	let caminho = get_caminho(node).join(" / ");

	// gambiarra para criar o no de localziacao
	let dom_node_loc = document.createElement("div");
	dom_node_loc.classList.add("localizacao");
	dom_node_loc.textContent = caminho;

	dom_node.append(dom_node_loc);
}