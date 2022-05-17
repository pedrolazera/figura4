'use strict'

// classe para referência rápida aos nós
// dentro de uma tag template do html
class Template {
	constructor(id_t, key) {
		this.fragment = Template._get_template(id_t);
		this._key = key;
		this._d = {}

		let children = this.fragment.children;
		for(let i = 0; i < children.length; i++)
			this._dfs(children[i]);
	}

	// retorna nó cuja chave vale ref
	get_node(ref) {
		if (this._d.hasOwnProperty(ref)) {
			return this._d[ref];
		} else {
			let _msg_erro = "Nao achou no com a ref = " + ref;
			throw _msg_erro;
		}
	}

	set_node_content(ref, text_content) {
		let node = this.get_node(ref);
		if(node) {
			node.textContent = text_content;
		}
	}

	set_node_attribute(ref, att_name, att_value) {
		let node = this.get_node(ref);
		if(node) {
			node.setAttribute(att_name, att_value);
		}
	}

	add_node_class(ref, class_name) {
		let node = this.get_node(ref);
		node.classList.add(class_name);
	}

	// remove nó cuja chave vale ref
	remove_node(ref) {
		let node = this.get_node(ref);
		node.parentNode.removeChild(node);
		delete this._d[ref];
	}

	append_child(ref, child_node) {
		let node = this.get_node(ref);
		node.appendChild(child_node);
	}

	_dfs(node) {
		this._assign_node(node);
		for(let i = 0; i < node.children.length; i++)
			this._dfs(node.children[i])
	}

	_assign_node(node) {
		if(node.hasAttribute(this._key)) {
			var att_val = node.getAttribute(this._key);
			this._d[att_val] = node;
		}
	}

	static _get_template(id_t) {
		let t;
		let clone_t;

		t = document.getElementById(id_t);
		if(t === null) {
			let msg_erro = "No com id " + id_t + "nao encontrado";
			throw msg_erro;
		}
		
		clone_t = t.content.cloneNode(true);

		return clone_t;
	}
}