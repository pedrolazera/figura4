'use strict'

class App {
	constructor() {
		this.content = _get_node_content();
		this._d = {};
		this.main_component = null;
		this._global_component = null;
		this.curr_id_component = null;
		this.curr_component = null;
	}

	go_to_initial_state() {
		return this.main_component.go_to_initial_state();
	}

	add_component(id_component, component) {
		this._d[id_component] = component;
	}

	add_global_component(component) {
		this._global_component = component;
	}

	set_component_as_main_component(id_component) {
		let component = this.get_component(id_component);
		this.main_component = component;
	}

	add_binding_to_component_initial_state(dom_node, id_component) {
		let component = this.get_component(id_component);
		dom_node.addEventListener("click", function() {
			component.go_to_initial_state();
		});
	}

	render() {
		let url = window.location.hash;
		url = decodeURIComponent(url);

		let id_component = get_id_component(url);
		this.update_curr_id_component(id_component);

		// atualiza navbar
		app._render_global(id_component);

		// atualiza content
		let substate = get_substate(url);
		substate = this._parse_state(substate);

		this._clear_content();
		let fragment = this._get_fragment(id_component, substate);

		// animations
		let content = this.content;
		content.classList.remove("translateX-center");
		content.classList.remove("translateX-right");
		content.classList.add("translateX-right");
		this._set_content(fragment);
		setTimeout( function() {
			content.classList.add("translateX-center"); }, 10);
		/*setTimeout(function() {
			content.classList.remove("translateX-right");
			content.classList.remove("translateX-center");
		}, 200);*/
		

	}

	go_to_page(id_component, component_state) {
		this._check_id_component(id_component);
		component_state = this._stringfy_state(component_state)
		let state = "#/" + id_component + "/" + component_state;
		window.history.pushState(null, "", state);
		this.render();
	}

	get_component(id_component) {
		this._check_id_component(id_component);
		return this._d[id_component];
	}

	update_curr_id_component(id_component) {
		this.curr_id_component = id_component;
		this.curr_component = this.get_component(id_component);

		return this._curr_component;
	}

	render_from_node(old_node, new_subtree) {
		if(!this.content.contains(old_node)) {
			throw "A renderizacao deve ser de um no de conteudo!";
		}

		let parent_node = old_node.parentNode;
		let next_sibling = old_node.netxElementSibling;
		let new_node = old_node.cloneNode();

		parent_node.removeChild(old_node);
		new_node.insertBefore(new_subtree, null);
		parent_node.insertBefore(new_node, next_sibling);
	}

	_set_content(fragment) {
		this.content.insertBefore(fragment, null);
	}

	_clear_content() {
		while(this.content.firstChild)
			this.content.removeChild(this.content.firstChild);
	}

	_get_fragment(id_component, substate) {
		let component = this.get_component(id_component);
		return component.get_fragment(substate);
	}

	_check_id_component(id_component) {
		if (!this._d.hasOwnProperty(id_component)) {
			let msg = "Nenhuma component associado a " + id_component;
			throw msg;
		}
	}

	_render_global(id_component) {
		if(id_component == "modal")
			id_component = "vias";
		this._global_component.render(id_component);
	}

	_parse_state(state_str) {
		let state_obj = {};
		let partes = state_str.split("&");
		let name;
		let value;

		for(let p of partes) {
			name = p.split("=")[0];
			value = p.split("=")[1];

			/*if (name == "id_nome") value = parseInt(value);*/
			state_obj[name] = value;
		}

		return state_obj;
	}

	_stringfy_state(state) {
		let v = [];
		let value;
		for(let name in state) {
			let value = state[name];
			v.push(String(name)+"="+String(value));
		}

		return v.join("&");
	}
}

function get_id_component(state) {
	return split_state(state)[1];
}

function get_substate(state) {
	return split_state(state)[2];
}

function split_state(state) {
	let partes = state.split("/");

	if (partes.length != 3) {
		let msg = "Estado <" + String(state) + "> desconhecido";
		throw msg;
	}

	return partes;
}

function _get_node_content() {
	let t = document.querySelector("#content-container");

	if (t === null)
		throw "Nó de conteúdo não existe!"

	return t;
}