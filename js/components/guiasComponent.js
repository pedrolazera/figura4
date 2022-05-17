'use strict'

class GuiasComponent {
	constructor() {
		this._app = app;
		this._ID = "guias";
		this._PATH_IMGS = "./dados/guias/";
		
		this.guias = this._get_guias();
		
		app.add_component(this.id_component, this);

		// states
		this._VISITA_RAIZ = "raiz";
		this._VISITA_BUSCA = "busca";
		this._VISITA_GUIA = "guia";

		this._SORT_BY_TITULO = 0;
		this._SORT_BY_AUTOR = 1;

		this.inner_state = Object();
	};

	go_to_initial_state() {
		let state = {tipo: this._VISITA_RAIZ};
		this._app.go_to_page(this.id_component, state);
	}

	get id_component () {
		return this._ID;
	}

	get_fragment(state) {
		let tipo = state.tipo;
		let t;
		
		if(tipo == this._VISITA_RAIZ) {
			t = this._get_template_raiz();
		} else if(tipo == this._VISITA_BUSCA) {
			let query = state.query;
			t = this._get_template_busca(query);
		}

		return t.fragment;
	}

	busca(query) {
		query = GuiasComponent.get_nome_busca(query);
		let state = {"query": query,
					 "tipo": this._VISITA_BUSCA};
		this._app.go_to_page(this.id_component, state);
	}

	_get_template_raiz() {
		let t = new Template("t-guias", "ref");

		let lista_guias = this._get_template_lista_de_guias(this.guias);
		t.get_node("lista-guias").insertBefore(lista_guias, null);

		// event listeners
		let node_options = t.get_node("options-btn");
		t.get_node("plus").addEventListener("click", function() {
			node_options.classList.toggle("invisible");
		});
		this._add_sort_by_titulo(t.get_node("sort-by-livro"));
		this._add_sort_by_autor(t.get_node("sort-by-autor"));

		// update inner state
		this.inner_state.curr_guias = this.guias;

		return t;
	}

	_get_template_busca(query) {
		let t = new Template("t-guias", "ref");

		let v_guias = this._get_lista_guias_from_busca(query);
		let lista_guias = this._get_template_lista_de_guias(v_guias);
		t.get_node("lista-guias").insertBefore(lista_guias, null);

		// event listeners
		let node_options = t.get_node("options-btn");
		t.get_node("plus").addEventListener("click", function() {
			node_options.classList.toggle("invisible");
		});
		this._add_sort_by_titulo(t.get_node("sort-by-livro"));
		this._add_sort_by_autor(t.get_node("sort-by-autor"));

		// update inner state
		this.inner_state.curr_guias = v_guias;

		return t;
	}

	_get_template_lista_de_guias(v_guias) {
		let t = document.createDocumentFragment();
		let ti;
		for(let guia of v_guias) {
			ti = new Template("t-guias-item", "ref");
			ti.set_node_content("titulo", guia.titulo);
			ti.set_node_content("autor", guia.autor);
			ti.set_node_attribute("img", "src", guia.img);

			t.insertBefore(ti.fragment, null);
		}

		return t;
	}

	_get_guias() {
		let path = this._PATH_IMGS;
		let guias = [
			{
				titulo: "Guia da Floresta",
				autor: "Flavio Daflon, Delson de Queiroz",
				img: path + "guia-da-floresta.jpg"
			},
			{
				titulo: "Guia da Zona Sul",
				autor: "André Ilha",
				img: path + "guia-da-zona-sul.jpeg"
			},
			{
				titulo: "Guia de Itacoatiara",
				autor: "Cintia Daflon, Flavio Daflon",
				img: path + "guia-de-itacoatiara.png"
			},
			{
				titulo: "50 vias clássicas no Brasil",
				autor: "Flavio Daflon, Cintia Daflon",
				img: path + "50-vias-classicas.png"
			}
		]

		// get nome simplificado
		for(let guia of guias) {
			guia.titulo_busca = GuiasComponent.get_nome_busca(guia.titulo);
			guia.autor_busca = GuiasComponent.get_nome_busca(guia.autor);
		}

		return guias;
	}

	_get_lista_guias_from_busca(query) {
		let v_guias = [];
		for(let guia of this.guias) {
			if(guia.titulo_busca.includes(query)) {
				v_guias.push(guia);
			} else if(guia.autor_busca.includes(query)) {
				v_guias.push(guia);
			}
		}

		return v_guias;
	}

	_add_sort_by_titulo(node) {
		let _self_ = this;

		node.addEventListener("click", function() {
			let f;
			_self_.inner_state.sort_by_ascending = !_self_.inner_state.sort_by_ascending;
			_self_.inner_state.sort_by = _self_._SORT_BY_TITULO;

			if(_self_.inner_state.sort_by_ascending) {
				f = function(a,b) {return a.titulo.localeCompare(b.titulo);}
			} else {
				f = function(a,b) {return (-1)*a.titulo.localeCompare(b.titulo);}
			}
			
			_self_._sort_by(f);
		});
	}

	_add_sort_by_autor(node) {
		let _self_ = this;
		
		node.addEventListener("click", function() {
			let f;
			_self_.inner_state.sort_by_ascending = !_self_.inner_state.sort_by_ascending;
			_self_.inner_state.sort_by = _self_._SORT_BY_AUTOR;

			if(_self_.inner_state.sort_by_ascending)
				f = function(a,b) {return a.autor.localeCompare(b.autor);}
			else
				f = function(a,b) {return (-1)*a.autor.localeCompare(b.autor);}
			
			_self_._sort_by(f);
		});
	}

	_sort_by(sort_fn) {
		this.inner_state.curr_guias.sort(sort_fn);
		let lista_guias = this._get_template_lista_de_guias(this.inner_state.curr_guias);
		let wrapper_conteudo = document.getElementById("guias-inner-content");
		this._app.render_from_node(wrapper_conteudo, lista_guias);
	}

	static get_nome_busca(nome) {
		// retira acentos
		// converte para minúscula
		// retira caracteres proibidos
		nome = nome.replace(/[#=\/&]/g,"")
		return nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
	}
}

