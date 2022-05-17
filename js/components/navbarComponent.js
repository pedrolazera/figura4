class NavbarComponent {
	constructor(v_dom_nodes, v_ids,
		active_class_name, inactive_class_name) {
		this._active = active_class_name;
		this._inactive = inactive_class_name;

		this._d_nodes = {};
		let dom_node;
		let id_node;
		for(let i = 0; i < v_dom_nodes.length; i++) {
			dom_node = v_dom_nodes[i];
			id_node = v_ids[i];
			this._d_nodes[id_node] = dom_node;
		}

	}

	render(state) {
		this._activate(state);
		this._change_search_bar_placeholder(state);
	}

	_activate(id_node) {
		// turn off every node from list
		for(let key of Object.keys(this._d_nodes)) {
			this._d_nodes[key].classList.remove(this._active);
			this._d_nodes[key].classList.add(this._inactive);
		}

		// turn one single node
		this._d_nodes[id_node].classList.add(this._active);
		this._d_nodes[id_node].classList.remove(this._inactive);
	}

	_change_search_bar_placeholder(id_component) {
		let input;

		// top
		input = document.getElementById("search-input-desktop");
		input.placeholder = this._get_placeholder(id_component);

		// bottom
		input = document.getElementById("search-input-bottom");
		input.placeholder = this._get_placeholder(id_component);
	}

	// GAMBIARRA TEMPORÁRIA!!!
	_get_placeholder(id_component) {
		if(id_component == "vias")
			return "nome da via ou do local";
		else if(id_component == "conquistas")
			return "nome do conquistador";
		else if(id_component == "guias")
			return "nome do livro ou do autor";
		else
			return "nome da via ou do local";
	}
}