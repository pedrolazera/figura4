'use strict'

// unica var global, para controlar tudo!
var app;

function inicia_app(v, dic_fontes) {
  app = new App();

  // componente das vias
  let raiz = jsonTree_to_tree(v);
  let via_component = new ViasComponent(raiz, raiz.vias,
    raiz.locais, dic_fontes, app);
  app.set_component_as_main_component(via_component._ID);

  // componente das conquistas
  let conquistas_component = new ConquistasComponent(raiz.vias, app);

  // componente de contato
  let contato_component = new StaticComponent("contato",
    "t-contato", app);

  // compoenent de graduacao
  let graduacao_component = new StaticComponent("graduacao",
    "t-graduacao", app);

  // compoenent de guias
  let guias_component = new GuiasComponent(app);

  // component de modal
  let modal_component = new ModalComponent(raiz.vias, app);

  // gambiarra: component da barra de navegação
  add_navbar_component();

  // liga alguns links
  add_header_bidings();
  add_navbar_bindings();

  // 1o estado
  if (window.location.hash == "") {
    app.go_to_initial_state();
  } else {
    app.render();
  }
}

// funcoes que estao aqui por preguica
function toggle_nav_bar() {
    var x = document.getElementById("nav-bar");
    x.classList.toggle("invisible")
}

function toggle_search_box() {
    var x = document.getElementById("search-input-bottom");
    var y = document.getElementById("grid-header-search");
    y.classList.toggle("invisible");
    x.focus();
}

//////////////////////////////////////

function add_navbar_bindings() {
  let node;

  // vias to vias component
  node = document.getElementById("navbar-link-to-vias");
  app.add_binding_to_component_initial_state(node, "vias");

  // conquistas to conquistas component
  node = document.getElementById("navbar-link-to-conquistas");
  app.add_binding_to_component_initial_state(node, "conquistas");

  // contatos to contatos component
  node = document.getElementById("navbar-link-to-contato");
  app.add_binding_to_component_initial_state(node, "contato");

  // contatos to guias component
  node = document.getElementById("navbar-link-to-guias");
  app.add_binding_to_component_initial_state(node, "guias");

  // contatos to graduacao component
  node = document.getElementById("navbar-link-to-graduacao");
  app.add_binding_to_component_initial_state(node, "graduacao");
}

function add_navbar_component() {
  let v_nodes = [
    document.getElementById("navbar-link-to-vias"),
    document.getElementById("navbar-link-to-conquistas"),
    document.getElementById("navbar-link-to-contato"),
    document.getElementById("navbar-link-to-guias"),
    document.getElementById("navbar-link-to-graduacao")
  ];

  let v_ids = ["vias", "conquistas", "contato",
               "guias", "graduacao"];    
  let navbar_component = new NavbarComponent(v_nodes, v_ids,
                                             "active", "inactive");

  app.add_global_component(navbar_component);
}


function add_header_bidings() {
  let v_events = ["click", "click", "click", "click", "keypress", "keypress"];
  let v_ids = ["search-icon-cell", "hamburguer-icon-cell", "logo", "search-icon-desktop",
    "search-input-desktop", "search-input-bottom"];
  let v_functions = [
    toggle_search_box,
    toggle_nav_bar,
    function() { app.go_to_initial_state() },
    function() {
      let node = document.getElementById("search-input-desktop");
      let query = node.value;
      if(query.length >= 2) {
        if(typeof app.curr_component.busca == "function") {
          app.curr_component.busca(query);
        } else {
          app.main_component.busca(query);
        }
      }
    },
    function(e) {
      let key = e.which || e.keyCode;
      if (key === 13) { // 13 = enter
          let query = this.value;
          if(query.length >= 2) {
            if(typeof app.curr_component.busca == "function") {
              app.curr_component.busca(query);
            } else {
              app.main_component.busca(query);
            }
            
            this.blur();
        }
      }
    },
    function(e) {
      let key = e.which || e.keyCode;
      if (key === 13) { // 13 = enter
          let query = this.value;
          if(query.length >= 2) {
            if(typeof app.curr_component.busca == "function") {
              app.curr_component.busca(query);
            } else {
              app.main_component.busca(query);
            }
            
            this.blur();
        }
      }
    }];

  liga_links(v_ids, v_functions, v_events);
}

function liga_links(v_ids, v_functions, v_events) {
  let _node;
  let _id;
  let _function;
  let _event_name;

  for(let i = 0; i < v_ids.length; i++) {

    _id = v_ids[i];
    _function = v_functions[i];
    _event_name = v_events[i];
    _node = document.getElementById(_id);

    // checa se no de fato existe
    if(_node === null) {
      let msg = "Nao achou no com id = " + _id;
      throw msg;
    }

    _node.addEventListener(_event_name, _function);

  }
}

window.onload = function () {
  inicia_app(v_nodes, dic_fontes);
}

window.onpopstate = function (event) {
  app.render();
};