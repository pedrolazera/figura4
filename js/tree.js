'use strict'

class LocalNode {
  constructor(nome, id_nome, filhos, qtd_vias, pai) {
    this.nome = nome;
    this.id_nome = id_nome;
    this.filhos = filhos
    this.qtd_vias = qtd_vias;
    this.pai = pai;
    this.tipo = "local";
  }
}

class ViaNode {
  constructor(nome, id_nome, pai, grau, extensao, ano,
  			  conquistadores, comentarios, croqui, imgs) {
    this.nome = nome;
    this.id_nome = id_nome;
    this.pai = pai;
    this.grau = grau;
    this.extensao = extensao;
    this.ano = ano;
    this.conquistadores = conquistadores;
    this.comentarios = comentarios;
    this.filhos = [];
    this.croqui = croqui;
    this.imgs = imgs;
    this.tipo = "via";
  }
}

function get_node_from_jsonNode(json_node, pai = null) {
	if (json_node.is_via) {
		var node = new ViaNode(json_node.nome, json_node.id_nome, pai,
			json_node.graduacao, json_node.extensao, json_node.ano,
			json_node.conquistadores, json_node.observacoes,
			json_node.path_croqui, json_node.v_path_imgs);
	} else {
		var node = new LocalNode(json_node.nome, json_node.id_nome,
			[], json_node.qtd_vias, pai);

		//console.log(json_node.nome);
		for (let filho of json_node.v_filhos) {
			node.filhos.push(get_node_from_jsonNode(filho, node));
		}
	}

	return node;
}

function insert_node_in_dic(node, dic_vias, dic_locais) {
	if (node instanceof ViaNode) {
		dic_vias[node.id_nome] = node;
	} else {
		dic_locais[node.id_nome] = node;
		for (let filho of node.filhos) {
			insert_node_in_dic(filho, dic_vias, dic_locais);
		}
	}
}

// cria uma árvore com nós do tipo tree_node
// v = vetor de itens, onde item = [id_nome, id_pai, nome, tipo, grau, extensao]
function jsonTree_to_tree(v) {
	var raiz = get_node_from_jsonNode(v[0]);
	raiz.vias = Object();
	raiz.locais = Object();

	insert_node_in_dic(raiz, raiz.vias, raiz.locais)

	return raiz;
}