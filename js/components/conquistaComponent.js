'use strict'

class ConquistasComponent {
	constructor(vias, app) {
		this.vias = vias;
		this.conquistadores = ConquistasComponent._get_conquistadores(vias);
		this.primeira_letra = ConquistasComponent._get_primeira_letra(this.conquistadores);
		this._app = app;

		this._VISITA_RAIZ = "raiz";
		this._VISITA_CONQUISTAS = "conquistas";
		this._VISITA_BUSCA = "busca";
		this._ID = "conquistas";
		app.add_component(this.id_component, this);

		this._SORT_BY_NOME = 0;
		this._SORT_BY_QTD = 1;

		this.inner_state = Object();
	};

	go_to_initial_state() {
		let state = {"tipo": this._VISITA_RAIZ};
		this._app.go_to_page(this.id_component, state);
	}

	get id_component () {
		return this._ID;
	}

	get_fragment(state) {
		let tipo = state.tipo;
		let t;

		if(tipo == this._VISITA_RAIZ) {
			// get names
			let v_nomes = Object.keys(this.conquistadores);
			v_nomes.sort(this._get_sort_by_qtd_conquistas(false));

			// update inner state
			this.inner_state.curr_v_nomes = v_nomes;
			this.inner_state.sort_by = this._SORT_BY_QTD;
			this.inner_state.sort_ascending = false;
			this.inner_state.tipo = this._VISITA_RAIZ;

			t = this._get_template_lista_conquistadores(v_nomes);
		} else if(tipo == this._VISITA_CONQUISTAS) {
			let nome = state.nome;
			let v_conquistas = this.conquistadores[nome]["vias"];

			// update inner state
			this.inner_state.tipo = this._VISITA_CONQUISTAS;

			t = this._get_template_conquistas(nome);
		} else if(tipo == this._VISITA_BUSCA) {
			let query = state.query;
			let v_nomes = this._get_nomes_from_busca(query);
			v_nomes.sort(this._get_sort_by_qtd_conquistas(false));

			// update inner state
			this.inner_state.curr_v_nomes = v_nomes;
			this.inner_state.sort_by = this._SORT_BY_QTD;
			this.inner_state.sort_ascending = false;
			this.inner_state.tipo = this._VISITA_BUSCA;

			t = this._get_template_lista_conquistadores(v_nomes);
		} else {
			throw "Tipo de visualizacao desconhecido!"
		}

		return t.fragment;
	}

	busca(query) {
		query = ConquistasComponent.get_nome_simplificado(query);
		let state = {"query": query,
					 "tipo": this._VISITA_BUSCA};
		this._app.go_to_page(this.id_component, state);
	}

	_get_template_lista_conquistadores(v_nomes) {
		let t = new Template("t-conquistas-0", "ref");

		// barra
		let span;
		let strike
		for(let p of Object.keys(this.primeira_letra)) {
			span = document.createElement("span");
			span.textContent = p;
			
			if(this.primeira_letra[p].length > 0) {
				this._add_link_to_lista_nomes(span, p);
			} else {
				span.classList.add("sem-conquistadores");
			}
			
			t.append_child("barra", span);
		}

		// nomes
		let lista_conquistadores = this._get_dom_lista_conquistadores(v_nomes);
		t.get_node("nomes").insertBefore(lista_conquistadores, null);

		// event listeners
		this._add_toggle_barra_letras(t.get_node("plus"), "conquistas-options-list");
		this._add_sort_by_name(t.get_node("sort-by-name"));
		this._add_sort_by_qtd_conquistas(t.get_node("sort-by-qtd"));
		//this._add_busca_key_press(t.get_node("search-input"));
		//this._add_busca_click(t.get_node("search-icon"));

		return t;
	}

	_get_dom_lista_conquistadores(v_nomes) {
		let t = document.createDocumentFragment();
		let ti;
		//tmp_v_nomes.sort();
		for(let nome of v_nomes) {
			ti = new Template("t-menus-item-local", "ref");
			let qtd_vias = this.conquistadores[nome]["vias"].length;
			this._add_link_to_conquistas(ti.get_node("container"), nome);
			ti.set_node_content("qtd",  qtd_vias);
			ti.set_node_content("nome", nome);
			t.appendChild(ti.fragment);
		}

		return t;
	}

	_get_template_conquistas(id_conquistador) {
		let t = new Template("t-conquistas-1", "ref");
		let ti;

		let v_vias = this.conquistadores[id_conquistador]["vias"];
		let d_conquistas = this._get_group_vias_by_local(v_vias);
		let v_vias_grupo;
		let id_local;

		// conquistador
		t.set_node_content("nome", id_conquistador);

		// grupos e vias
		let v_locais = Array.from(Object.keys(d_conquistas));
		v_locais.sort();
		for(let nome_local of v_locais) {
			v_vias_grupo = d_conquistas[nome_local];
			id_local = v_vias_grupo[0].pai.id_nome;

			ti = new Template("t-conquistas-1-grupo", "ref");

			// local
			ti.set_node_content("local", nome_local);
			this._add_link_to_local(ti.get_node("local"), id_local);

			// vias
			ti.append_child("vias", this._get_span_from_vias(v_vias_grupo));

			// insere em t
			t.get_node("grupos").insertBefore(ti.fragment, null);
		}

		return t;
	}

	_get_span_from_vias(v_vias) {
		let t = document.createDocumentFragment();
		let ti;

		for(let via of v_vias) {
			ti = new Template("t-menus-item-via", "ref");

			// nome
			ti.set_node_content("nome", via.nome);

			// grau
			if(via.grau) {
				let grau = ConquistasComponent.parse_grau_via(via.grau)
				ti.set_node_content("grau", grau);
			}

			// extensao
			if(via.extensao) {
				let extensao = String(via.extensao) + "m";
				ti.set_node_content("extensao", extensao);
			}

			this._add_link_to_via(ti.get_node("container"), via.id_nome);
			t.insertBefore(ti.fragment, null);
		}

		//console.log(t);
		return t;
	}

	_get_group_vias_by_local(v_vias) {
		let d = Object();
		let local;
		let pai;
		for(let via of v_vias) {
			local = "";
			pai = via.pai;
			while(pai.pai !== null) {
				local = pai.nome + " / " + local;
				pai = pai.pai;
			}

			// tira o " / " do fim
			local = local.slice(0, -3);

			if(!d.hasOwnProperty(local))
				d[local] = [];
			d[local].push(via);
		}

		return d;
	}

	_add_sort_by_name(node) {
		let _self_ = this;

		node.addEventListener("click", function() {
			let sort_ascending = !_self_.inner_state.sort_ascending;
			let sort_fn = _self_._get_sort_by_name(sort_ascending);
			
			// update inner state
			_self_.inner_state.sort_by = _self_._SORT_BY_NOME;
			_self_.inner_state.sort_ascending = sort_ascending;

			_self_._sort_by(sort_fn);
		});
	}

	_add_sort_by_qtd_conquistas(node) {
		let _self_ = this;
		node.addEventListener("click", function() {
			let sort_ascending = !_self_.inner_state.sort_ascending;
			let sort_fn = _self_._get_sort_by_qtd_conquistas(sort_ascending);
			_self_._sort_by(sort_fn);
			// update inner state
			_self_.inner_state.sort_by = _self_._SORT_BY_QTD;
			_self_.inner_state.sort_ascending = sort_ascending;
		});
	}

	_sort_by(sort_fn) {
		this.inner_state.curr_v_nomes.sort(sort_fn);
		let lista_conquistadores = this._get_dom_lista_conquistadores(this.inner_state.curr_v_nomes);
		let wrapper_conteudo = document.querySelector(".conquistas-nomes");
		this._app.render_from_node(wrapper_conteudo, lista_conquistadores);
	}

	_add_toggle_barra_letras(node, barra_id) {
		node.addEventListener("click", function() {
			let node_barra = document.getElementById(barra_id);
			node_barra.classList.toggle("invisible");
		})
	}

	_get_nomes_from_busca(query) {
		let v_nomes = [];
		let nome_simplificado;
		for(let nome of Object.keys(this.conquistadores)) {
			nome_simplificado = this.conquistadores[nome]["nome_simplificado"];
			if(nome_simplificado.includes(query)) {
				v_nomes.push(nome);
			}
		}

		return v_nomes;
	}

	static _get_conquistadores(vias) {
		let conquistadores = Object();
		let via;
		let conquistadores_via;
		let nome_simplificado;

		for(let key of Object.keys(vias)) {
			via = vias[key];

			if(!via.conquistadores)
				continue;

			for(let nome of via.conquistadores) {
				nome = nome.trim();
				nome_simplificado =  this.get_nome_simplificado(nome);
				
				if(!conquistadores.hasOwnProperty(nome)) {
					conquistadores[nome] = {"vias": [],
											"nome_simplificado": nome_simplificado};
				}

				conquistadores[nome]["vias"].push(via);
			}
		}

		return conquistadores;
	}

	static _get_primeira_letra(conquistadores) {
		let primeira_letra = ConquistasComponent._get_primeira_letra_vazia();

		let c;
		for(let nome of Object.keys(conquistadores)) {
			c = conquistadores[nome]["nome_simplificado"][0];
			c = c.toUpperCase();
			if(primeira_letra.hasOwnProperty(c)) {
				primeira_letra[c].push(nome);
			} else {
				let msg = "Letra <" + c + "> não é valida";
				throw msg;
			}
		}

		// ordena
		for(let letra of Object.keys(primeira_letra))
			primeira_letra[letra].sort();

		return primeira_letra;
	}

	_add_link_to_via(node, id_nome) {
		let state = {"id_nome": id_nome,
					 "tipo": "folha_via"};
		return this._add_link_to_node(node, "vias", state);
	}

	_add_link_to_local(node, id_nome) {
		let state = {"id_nome": id_nome,
					 "tipo": "local"};
		return this._add_link_to_node(node, "vias", state);
	}

	/*_add_link_to_lista_nomes(node, p) {
		let state = {"tipo": this._VISITA_LISTA_NOMES,
					 "letra": p};
		return this._add_link_to_node(node,
			this.id_component, state);
	}*/

	_add_link_to_lista_nomes(node, p) {
		let _self_ = this;

		node.addEventListener("click", function() {
			let v_nomes = _self_.primeira_letra[p];
			v_nomes.sort(_self_._get_sort_by_name(false));
			let lista_conquistadores = _self_._get_dom_lista_conquistadores(v_nomes);
			let wrapper_conteudo = document.querySelector(".conquistas-nomes");
			
			// update inner state
			_self_.inner_state.curr_v_nomes = v_nomes;
			_self_.inner_state.sort_by = "nomes";
			_self_.inner_state.sort_ascending = false;

			_self_._app.render_from_node(wrapper_conteudo, lista_conquistadores);
		});
	}

	_add_link_to_conquistas(node, nome) {
		let state = {"tipo": this._VISITA_CONQUISTAS,
					 "nome": nome};
		return this._add_link_to_node(node,
			this.id_component, state);
	}

	_add_link_to_node(node, id_component, state) {
		let _app = this._app;
		node.addEventListener("click", function() {
			_app.go_to_page(id_component, state);
		});
	}

	_add_busca_key_press(node) {
		let _self_ = this;
		node.addEventListener("keypress", function(e) {
			let key = e.which || e.keyCode;
      		if (key === 13) { 
				let node_input = document.getElementById("conquistas-search-input");
				let query = node_input.value;
				if(query.length >= 2) {
					_self_.busca(query);
				}
			}
		});
	}

	_add_busca_click(node) {
		let _self_ = this;
		node.addEventListener("click", function() {
			let node_input = document.getElementById("conquistas-search-input");
			let query = node_input.value;
			if(query.length >= 2) {
				_self_.busca(query);
			}
		});
	}

	_get_sort_by_name(ascending=true) {
		let mult;
		if(ascending) mult = 1;
		else mult = -1;

		let f = function(nome_a, nome_b) {
			let cmp_result = nome_a.localeCompare(nome_b);
			cmp_result *= mult;
			return cmp_result;
		}

		return f;
	}

	_get_sort_by_qtd_conquistas(ascending=true) {
		let component = this; // lidando com namespace!

		let mult;
		if(ascending) mult = 1;
		else mult = -1;

		let f = function(nome_a, nome_b) {
			let qtd_a = component.conquistadores[nome_a]["vias"].length;
			let qtd_b = component.conquistadores[nome_b]["vias"].length;
			let cmp_result;

			if(qtd_a > qtd_b) cmp_result = 1;
			else if(qtd_a < qtd_b) cmp_result = -1;
			else cmp_result = nome_a.localeCompare(nome_b);

			cmp_result *= mult;

			return cmp_result;
		}

		return f;
	}

	static _get_primeira_letra_vazia() {
		let primeira_letra = {};
		let A = "A".charCodeAt(0);
		let Z = "Z".charCodeAt(0)

		for(let i = A; i <= Z; i++)
			primeira_letra[String.fromCharCode(i)] = [];

		return primeira_letra;
	}

	static parse_grau_via(txt) {
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

	// simplifica a string, para facilitar a busca por palavras
	static get_nome_simplificado(nome) {
		// retira acentos
		// converte para minúscula
		// retira caracteres proibidos
		nome = nome.replace(/[#=\/&]/g,"")
		return nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
	}
}

