class StaticComponent {
	constructor(id_component, id_template, app) {
		this._ID = id_component;
		this.id_template = id_template;
		this._app = app;
		app.add_component(this.id_component, this);
	}

	go_to_initial_state() {
		this._app.go_to_page(this.id_component, "");
	}

	get_fragment_from_string(state_str) {
		return this.get_fragment({});
	}

	get_fragment(state) {		
		let t = document.getElementById(this.id_template);
		let clone_t = t.content.cloneNode(true);
		return clone_t;
	}

	get id_component () {
		return this._ID;
	}
}