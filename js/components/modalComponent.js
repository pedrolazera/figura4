'use strict'

class ModalComponent {
	constructor(vias, app) {
		this.vias = vias;
		//this.add_link_to_close_btn = add_link_to_close_btn;
		this._app = app;

		this._ID = "modal";

		app.add_component(this.id_component, this);
	}

	go_to_initial_state() {
		throw "Sem estado inicial!"
	}

	get_fragment_from_string(state_str) {
		let state_obj = ModalComponent._parse_state_from_string(state_str);
		return this.get_fragment(state_obj);
	}

	get_fragment(state) {
		let t = new Template("t-modal", "ref");

		let id_nome = state.id_nome;

		let node = this.vias[id_nome];
		let v_urls = node.imgs.map(get_path_from_foto_name);

		// resize image and set btns positions
		let node_component = t.get_node("modal-content");
		let node_prev = t.get_node("prev-img");
		let node_next = t.get_node("next-img");
		
		let f_resize = function() {
			set_modal_positions(node_component, node_prev, node_next);
		}

		f_resize();
		window.addEventListener("resize", f_resize);

		// toggle img buttons
		/// lista de nos a serem togglados
		let node_close = t.get_node("close-img");
		let node_legenda = t.get_node("modal-legenda");
		let node_toggle_lst = [node_close, node_legenda, node_prev, node_next];
		
		let node_img = t.get_node("modal-img");
		node_img.addEventListener("click", function() {
			for(let _n of node_toggle_lst)
				_n.classList.toggle("invisible");
		})

		// first img
		node_img.setAttribute("src", v_urls[0]);
		
		// prev and next imgs functions actions
		let curr_img = 0;
		let total_imgs = v_urls.length;

		let f_next = function() {
			if (total_imgs > 1) {
				curr_img = (curr_img+1)%total_imgs;
				let url = v_urls[curr_img];
				node_img.setAttribute("src", url);
			}
		};

		let f_prev = function () {
			if (total_imgs > 1) {
				curr_img = (curr_img-1+total_imgs)%total_imgs;
				let url = v_urls[curr_img];
				node_img.setAttribute("src", url);
			}
		};

		let f_close = function() {
			window.removeEventListener("click", f_resize);
			window.removeEventListener("click", f_key_down);
		}

		let f_key_down = function(e) {
			if (e.key == "ArrowRight")
				f_next();
			else if (e.key == "ArrowLeft")
				f_prev();
			else if (e.key == "Escape")
				node_close.click();
		}

		// actions
		node_close.addEventListener("click", function() {
			f_close();
		});
		this._add_link_to_close_btn(node_close, id_nome);

		window.addEventListener("keydown", f_key_down);

		node_next.addEventListener("click", f_next);
		node_prev.addEventListener("click", f_prev);

		return t.fragment;
	}

	get id_component () {
		return this._ID;
	}

	_add_link_to_close_btn(node, id_nome) {
		let state = {"id_nome": id_nome,
					 "tipo": "folha_via"};
		let _app = this._app;
		let _id_component = "vias";
		node.addEventListener("click", function() {
			_app.go_to_page(_id_component, state);
		});
	}

	static _parse_state_from_string(state_str) {
		let state_obj = {};
		let partes = state_str.split("&");
		let name;
		let value;

		for(let p of partes) {
			name = p.split("=")[0];
			value = p.split("=")[1];

			if (name == "id_nome") value = parseInt(value);
			state_obj[name] = value;
		}

		return state_obj;
	}

	static _stringfy_state(state) {
		let v = [];
		let value;
		for(let name in state) {
			let value = state[name];
			v.push(String(name)+"="+String(value));
		}

		return v.join("&");
	}
}

function get_path_from_foto_name(foto_name) {
	let diretorio = foto_name.slice(0, foto_name.indexOf("_"));
	let path_foto = "./dados/fotos/" + diretorio + "/" + foto_name;
	return path_foto
}

function set_modal_positions(node_content, node_prev, node_next) {
	// modal content
	//node = document.getElementById("modal-content");
	let inner_width = document.documentElement.clientWidth;
	let inner_height = document.documentElement.clientHeight;
	node_content.style.width = String(Math.min(1000, inner_width-2))+"px";
	node_content.style.height = String(inner_height-50)+"px";

	// modal previous img button
	//node = document.getElementById("prev-img");
	node_prev.style.top = String(Math.round(inner_height/2))+"px";

	// modal next img button
	//node = document.getElementById("next-img");
	node_next.style.top = String(Math.round(inner_height/2))+"px";
}